#!/usr/bin/env node

// ---------------------------------------------------------------------------
// Weekly "Top Learners" slide image (1920x1080 PNG) for the class slideshow.
//
// Ranks come from getTimeframedLeaderboard('last-week'), the same ledger
// aggregation the app's leaderboard uses, so test/excluded accounts are
// already filtered and the Quiz / Week done chips match the app.
//
// READ-ONLY: this only queries the database. It still connects to whatever
// DATABASE_URL points at (locally that is production), so never add writes.
//
// Usage: npm run slide:top-learners -- [--week 5] [--top 6] [--class FY27] [--out file.png]
//   --week   teaching week number (default: last week)
//   --top    how many students (default 6)
//   --class  class name (default: newest class that isn't a test class)
//   --out    output path (default: ~/Downloads/week<N>-top-learners.png)
// ---------------------------------------------------------------------------

import os from "node:os";
import path from "node:path";
import { config as loadDotenv } from "dotenv";
import { chromium } from "@playwright/test";

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
  const { getTimeframedLeaderboard } = await import("@/lib/gamification/gamification");
  const { getAvatarEmoji } = await import("@/lib/avatar-constants");
  const { getLeaderboardWeekNumber } = await import("@/lib/gamification/leaderboard-period");
  const { addDaysToDayKey, getCalendarWeekStartDayKey, getInstantForLearnerDayStart } =
    await import("@/lib/gamification/calendar-week");
  const { buildTeachingWeeks } = await import("@/lib/course-map-schedule");

  try {
    const top = Math.max(1, Number(arg("top") ?? 6));

    // "Last week" relative to a reference instant; for --week N, reference the Monday after it.
    let referenceDate = new Date();
    const weekArg = arg("week");
    if (weekArg) {
      const week = buildTeachingWeeks().find((w) => w.index === Number(weekArg));
      if (!week) throw new Error(`No teaching week ${weekArg} in the course schedule.`);
      referenceDate = new Date(getInstantForLearnerDayStart(addDaysToDayKey(week.weekStart, 7)).getTime() + 12 * 3600_000);
    }
    const weekStart = addDaysToDayKey(getCalendarWeekStartDayKey(referenceDate), -7);
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

    const leaders = await getTimeframedLeaderboard("last-week", top, cls.id, undefined, { referenceDate });
    if (leaders.length === 0) throw new Error(`Nobody in ${cls.name} earned points that week.`);

    const title = weekNumber ? `Week ${weekNumber}` : "Last Week";
    const dates = `${formatDay(weekStart)} – ${formatDay(addDaysToDayKey(weekStart, 6))}`;
    const max = leaders[0].weeklyPoints;

    console.log(`${cls.name} · ${title} (${dates})`);
    const rows = leaders.map((e) => {
      console.log(`  ${e.rank}. ${e.name} ${e.weeklyPoints}${e.weeklyQuizComplete ? " [Quiz]" : ""}${e.weekComplete ? " [Week done]" : ""}`);
      const chips = (e.weeklyQuizComplete ? `<span class="chip quiz">Quiz ✓</span>` : "")
        + (e.weekComplete ? `<span class="chip week">Week done ✓</span>` : "");
      return `<li class="${e.rank === 1 ? "first" : ""}">
        <div class="rank r${Math.min(e.rank, 4)}">${e.rank}</div>
        <div class="avatar" style="background:${AVATAR_HEX[e.avatarColor ?? "blue"] ?? AVATAR_HEX.blue}">${getAvatarEmoji(e.avatar)}</div>
        <div><div class="nameline"><span class="name">${escapeHtml(e.name)}</span>${chips}</div>
          <div class="bar"><span style="width:${((e.weeklyPoints / max) * 100).toFixed(1)}%"></span></div></div>
        <div class="pts">${e.weeklyPoints}<small>POINTS</small></div>
      </li>`;
    }).join("\n");

    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1920px; height: 1080px; }
  body { font-family: "Avenir Next", "Helvetica Neue", sans-serif; color: #1f2a37;
    background: radial-gradient(circle at 15% 10%, #fff6dc 0, transparent 40%),
                radial-gradient(circle at 90% 95%, #dff3ec 0, transparent 45%), #fbf8f1;
    padding: 56px 140px 48px; display: flex; flex-direction: column; }
  header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; }
  .kicker { font-size: 32px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #c07a12; }
  h1 { font-size: 88px; font-weight: 800; line-height: 1; margin-top: 8px; }
  .dates { font-size: 34px; color: #5b6675; font-weight: 500; text-align: right; }
  .dates b { display: block; font-size: 38px; color: #1f2a37; font-weight: 700; }
  ol { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 14px; flex: 1; min-height: 0; }
  li { display: grid; grid-template-columns: 72px 80px 1fr 180px; align-items: center; gap: 26px;
       background: #fff; border-radius: 24px; padding: 0 40px 0 22px;
       box-shadow: 0 4px 18px rgba(31,42,55,.07); flex: 1 1 0; min-height: 0; max-height: 150px; }
  .rank { width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center; font-size: 40px; font-weight: 800; color: #fff; }
  .r1 { background: linear-gradient(145deg, #f7c948, #d99a0b); }
  .r2 { background: linear-gradient(145deg, #c9d2dc, #8c99a8); }
  .r3 { background: linear-gradient(145deg, #e6a26e, #b5642c); }
  .r4 { background: #e8edf2; color: #5b6675; }
  .avatar { width: 80px; height: 80px; border-radius: 50%; display: grid; place-items: center; font-size: 44px; box-shadow: 0 2px 8px rgba(31,42,55,.15); }
  .nameline { display: flex; align-items: center; gap: 14px; }
  .name { font-size: 48px; font-weight: 700; line-height: 1.1; }
  .chip { font-size: 23px; font-weight: 700; padding: 5px 14px; border-radius: 999px; white-space: nowrap; }
  .chip.quiz { background: #ede9fe; color: #6d28d9; }
  .chip.week { background: #dcfce7; color: #15803d; }
  .bar { height: 12px; border-radius: 6px; background: #eef1f4; margin-top: 8px; overflow: hidden; }
  .bar span { display: block; height: 100%; border-radius: 6px; background: #2f9e7a; }
  li.first .bar span { background: #e0a514; }
  .pts { text-align: right; font-size: 48px; font-weight: 800; color: #2f9e7a; line-height: 1; }
  li.first .pts { color: #c07a12; }
  .pts small { display: block; font-size: 20px; font-weight: 600; color: #8a94a3; letter-spacing: .08em; margin-top: 4px; }
  footer { margin-top: 24px; font-size: 30px; color: #5b6675; text-align: center; }
  footer b { color: #1f2a37; }
</style></head><body>
  <header>
    <div><div class="kicker">⭐ Top Learners</div><h1>${title}</h1></div>
    <div class="dates"><b>${escapeHtml(cls.name)}</b>${dates}</div>
  </header>
  <ol>${rows}</ol>
  <footer>Great work, everyone! <b>Keep practicing in the app this week.</b></footer>
</body></html>`;

    const out = arg("out")
      ?? path.join(os.homedir(), "Downloads", `${weekNumber ? `week${weekNumber}` : weekStart}-top-learners.png`);
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
