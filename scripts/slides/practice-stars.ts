#!/usr/bin/env node

// ---------------------------------------------------------------------------
// Weekly "Practice Stars" slide image (1920x1080 PNG): the top students by
// days of practice logged from home in one Mon–Sun week.
//
// Days come from StudyLog the same way the app counts them (distinct dayKeys),
// the dots copy StudyWeekDots, and the icons are the StudyLogKindIcon ones, so
// the slide matches what learners see in the app. Test/excluded accounts are
// filtered with the leaderboard's eligibility rules.
//
// READ-ONLY: this only queries the database. It still connects to whatever
// DATABASE_URL points at (locally that is production), so never add writes.
//
// Usage: npm run slide:practice-stars -- [--week 7] [--top 5] [--min 1] [--class FY27] [--out file.png]
//   --week   teaching week number (default: last week)
//   --top    how many students (default 5; most days first, then most logs)
//   --min    fewest days practiced to make the slide (default 1)
//   --class  class name (default: newest class that isn't a test class)
//   --out    output path (default: ~/Downloads/week<N>-practice-stars.png)
// ---------------------------------------------------------------------------

import os from "node:os";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Check } from "lucide-react";
import { config as loadDotenv } from "dotenv";
import { useLiveDatabase } from "../lib/use-live-db";
import { chromium } from "@playwright/test";

useLiveDatabase(); // real class data, not the local dev DB
loadDotenv({ path: path.join(__dirname, "../../.env.local") });
loadDotenv({ path: path.join(__dirname, "../../.env") });

// Tailwind 400 shades behind COLORS in src/lib/avatar-constants.ts.
const AVATAR_HEX: Record<string, string> = {
  red: "#f87171", orange: "#fb923c", amber: "#fbbf24", yellow: "#fde047", lime: "#a3e635",
  green: "#4ade80", emerald: "#34d399", teal: "#2dd4bf", cyan: "#22d3ee", sky: "#38bdf8",
  blue: "#60a5fa", indigo: "#818cf8", violet: "#a78bfa", purple: "#c084fc", fuchsia: "#e879f9",
  pink: "#f472b6", rose: "#fb7185", slate: "#94a3b8", zinc: "#a1a1aa", gray: "#9ca3af",
};

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function formatDay(key: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .format(new Date(`${key}T12:00:00Z`));
}

async function main() {
  // Imported after dotenv so Prisma sees DATABASE_URL.
  const { prisma } = await import("@/lib/database/prisma");
  const { getAvatarEmoji } = await import("@/lib/avatar-constants");
  const { getLeaderboardWeekNumber } = await import("@/lib/gamification/leaderboard-period");
  const { buildLeaderboardEligibleUserWhere } = await import("@/lib/gamification/leaderboard-filter");
  const { addDaysToDayKey, getCalendarWeekStartDayKey, getInstantForLearnerDayStart, CALENDAR_WEEK_DAY_NAMES } =
    await import("@/lib/gamification/calendar-week");
  const { buildTeachingWeeks } = await import("@/lib/course-map-schedule");
  const { STUDY_LOG_KINDS, normalizeStudyLogKind, normalizePracticeGoalDays } = await import("@/lib/learner/study-log");
  const { StudyLogKindIcon } = await import("@/components/study-log/StudyLogKindIcon");

  try {
    const minDays = Math.max(1, Number(arg("min") ?? 1));
    const top = Math.max(1, Number(arg("top") ?? 5));

    // Same week selection as top-learners.ts: "last week" relative to a reference instant.
    let referenceDate = new Date();
    const weekArg = arg("week");
    if (weekArg) {
      const week = buildTeachingWeeks().find((w) => w.index === Number(weekArg));
      if (!week) throw new Error(`No teaching week ${weekArg} in the course schedule.`);
      referenceDate = new Date(getInstantForLearnerDayStart(addDaysToDayKey(week.weekStart, 7)).getTime() + 12 * 3600_000);
    }
    const weekStart = addDaysToDayKey(getCalendarWeekStartDayKey(referenceDate), -7);
    const dayKeys = Array.from({ length: 7 }, (_, i) => addDaysToDayKey(weekStart, i));
    const weekNumber = getLeaderboardWeekNumber(referenceDate, true);

    const className = arg("class");
    const cls = await prisma.class.findFirst({
      where: className
        ? { name: { equals: className, mode: "insensitive" } }
        : { NOT: { name: { contains: "test", mode: "insensitive" } } },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    });
    if (!cls) throw new Error(className ? `No class named "${className}".` : "No class found.");

    const logs = await prisma.studyLog.findMany({
      where: {
        dayKey: { gte: dayKeys[0], lte: dayKeys[6] },
        user: buildLeaderboardEligibleUserWhere({ classes: { some: { classId: cls.id, status: "active" } } }),
      },
      orderBy: { createdAt: "asc" },
      select: {
        kind: true,
        dayKey: true,
        user: { select: { id: true, name: true, username: true, avatar: true, avatarColor: true, practiceGoalDays: true } },
      },
    });

    type Star = { user: (typeof logs)[number]["user"]; days: Set<string>; kinds: Set<string>; logs: number };
    const byUser = new Map<string, Star>();
    for (const log of logs) {
      const star = byUser.get(log.user.id) ?? { user: log.user, days: new Set(), kinds: new Set(), logs: 0 };
      star.days.add(log.dayKey);
      const kind = normalizeStudyLogKind(log.kind);
      if (kind) star.kinds.add(kind);
      star.logs++;
      byUser.set(log.user.id, star);
    }
    const nameOf = (s: Star) => s.user.name?.trim() || s.user.username;
    const stars = [...byUser.values()]
      .filter((s) => s.days.size >= minDays)
      .sort((a, b) => b.days.size - a.days.size || b.logs - a.logs || nameOf(a).localeCompare(nameOf(b)))
      .slice(0, top);
    if (stars.length === 0) throw new Error(`Nobody in ${cls.name} logged practice on ${minDays}+ days that week.`);

    const title = weekNumber ? `Week ${weekNumber}` : "Last Week";
    const dates = `${formatDay(weekStart)} – ${formatDay(dayKeys[6])}`;
    const svg = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
    const check = svg(createElement(Check, { size: 26, strokeWidth: 3 }));

    console.log(`${cls.name} · ${title} (${dates}) · top ${top}, ${minDays}+ days`);
    const rows = stars.map((s) => {
      const goal = normalizePracticeGoalDays(s.user.practiceGoalDays);
      const goalDone = s.days.size >= goal;
      console.log(`  ${nameOf(s)}: ${s.days.size} days (goal ${goal}${goalDone ? ", done" : ""}), ${s.logs} logs`);
      const dots = dayKeys.map((key, i) => {
        const name = CALENDAR_WEEK_DAY_NAMES[i];
        const done = s.days.has(key);
        return `<div class="day"><span class="dlabel">${name.slice(0, 3)}</span><span class="dot ${done ? "done" : ""}">${done ? check : ""}</span></div>`;
      }).join("");
      const kinds = STUDY_LOG_KINDS.filter((k) => s.kinds.has(k.id))
        .map((k) => `<span class="kind">${svg(createElement(StudyLogKindIcon, { kind: k.id, size: 24, strokeWidth: 2.4 }))}${k.label}</span>`)
        .join("");
      return `<li class="${goalDone ? "goal" : ""}">
        <div class="avatar" style="background:${AVATAR_HEX[s.user.avatarColor ?? "blue"] ?? AVATAR_HEX.blue}">${getAvatarEmoji(s.user.avatar)}</div>
        <div class="who"><div class="nameline"><span class="name">${escapeHtml(nameOf(s))}</span>${goalDone ? `<span class="chip">Goal done!</span>` : ""}</div>
          <div class="kinds">${kinds}</div></div>
        <div class="dots">${dots}</div>
        <div class="count">${s.days.size}<small>of ${goal} days</small></div>
      </li>`;
    }).join("\n");

    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1920px; height: 1080px; }
  body { font-family: "Avenir Next", "Helvetica Neue", sans-serif; color: #1f2a37;
    background: radial-gradient(circle at 12% 8%, #dff3ec 0, transparent 40%),
                radial-gradient(circle at 92% 95%, #fff6dc 0, transparent 45%), #fbf8f1;
    padding: 56px 120px 48px; display: flex; flex-direction: column; }
  header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; }
  .kicker { font-size: 32px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #047857; }
  h1 { font-size: 88px; font-weight: 800; line-height: 1; margin-top: 8px; }
  .sub { font-size: 34px; color: #5b6675; font-weight: 500; margin-top: 12px; }
  .dates { font-size: 34px; color: #5b6675; font-weight: 500; text-align: right; }
  .dates b { display: block; font-size: 38px; color: #1f2a37; font-weight: 700; }
  ol { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 14px; flex: 1; min-height: 0; justify-content: center; }
  li { display: grid; grid-template-columns: 88px 1fr auto 170px; align-items: center; gap: 30px;
       background: #fff; border-radius: 24px; padding: 0 36px 0 24px; border: 3px solid transparent;
       box-shadow: 0 4px 18px rgba(31,42,55,.07); flex: 1 1 0; min-height: 0; max-height: 156px; }
  li.goal { border-color: #047857; background: #ecfdf5; }
  .avatar { width: 88px; height: 88px; border-radius: 50%; display: grid; place-items: center; font-size: 48px; box-shadow: 0 2px 8px rgba(31,42,55,.15); }
  .nameline { display: flex; align-items: center; gap: 16px; }
  .name { font-size: 50px; font-weight: 700; line-height: 1.1; }
  .chip { font-size: 24px; font-weight: 700; padding: 5px 16px; border-radius: 999px; background: #047857; color: #fffdfa; white-space: nowrap; }
  .kinds { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 10px; }
  .kind { display: inline-flex; align-items: center; gap: 7px; font-size: 25px; font-weight: 600; color: #065f46; }
  .dots { display: grid; grid-template-columns: repeat(7, 64px); gap: 8px; text-align: center; }
  .day { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .dlabel { font-size: 21px; font-weight: 700; color: #6b7280; }
  .dot { width: 54px; height: 54px; border-radius: 50%; border: 3px dashed #d6d0c4; display: grid; place-items: center; }
  .dot.done { background: #047857; border: none; color: #fffdfa; }
  .count { text-align: right; font-size: 64px; font-weight: 800; color: #047857; line-height: 1; }
  .count small { display: block; font-size: 22px; font-weight: 600; color: #8a94a3; letter-spacing: .04em; margin-top: 6px; }
  footer { margin-top: 24px; font-size: 30px; color: #5b6675; text-align: center; }
  footer b { color: #1f2a37; }
</style></head><body>
  <header>
    <div><div class="kicker">📝 Practice Stars</div><h1>${title}</h1>
      <div class="sub">They practiced English at home on the most days.</div></div>
    <div class="dates"><b>${escapeHtml(cls.name)}</b>${dates}</div>
  </header>
  <ol>${rows}</ol>
  <footer>Practice at home? <b>Tap Log on your “My practice week” card in the app.</b></footer>
</body></html>`;

    const out = arg("out")
      ?? path.join(os.homedir(), "Downloads", `${weekNumber ? `week${weekNumber}` : weekStart}-practice-stars.png`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out });
    await browser.close();
    console.log(`Saved ${out}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
