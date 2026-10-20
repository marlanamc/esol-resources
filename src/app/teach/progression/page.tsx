import Link from "next/link";
import { connection } from "next/server";
import { buildTeachingWeeks } from "@/lib/course-map-schedule";
import {
    PROGRESSION_PAGES,
    REFERENCE_SHEET_HREF,
    isProgressionSlug,
    loadProgressionPage,
    progressionHref,
} from "@/lib/teach/grammar-progression";
import { ProgressionContent } from "@/components/teach/ProgressionContent";
import "./progression.css";

export const metadata = { title: "Grammar Progression | My ESOL Class" };

/** The latest week already opened to students, so the page lands on what is being taught now. */
function currentWeekNumber(now = new Date()): number {
    const opened = buildTeachingWeeks().filter((week) => week.revealAt <= now);
    return opened.at(-1)?.index ?? 1;
}

const pill = "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium";

export default async function TeachProgressionPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; week?: string }>;
}) {
    await connection();
    const params = await searchParams;
    const slug = isProgressionSlug(params.page) ? params.page : "weeks";
    const current = currentWeekNumber();
    const requestedWeek = Number(params.week);
    const week = Number.isInteger(requestedWeek) && requestedWeek > 0 ? requestedWeek : current;
    const page = await loadProgressionPage(slug, week);
    const lessons = slug === "lessons";

    return (
        <div>
            <div className="mb-4">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Course
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">Grammar Progression</h1>
                <p className="text-sm text-text-muted mt-1">{page.title}</p>
            </div>

            <nav
                aria-label="Grammar progression pages"
                className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
            >
                <Link
                    href={progressionHref("weeks", { hash: `#w${current}` })}
                    className={pill}
                    style={{ borderColor: "var(--primary)", color: "var(--primary-text)" }}
                >
                    This week · W{current}
                </Link>
                {PROGRESSION_PAGES.map((item) => (
                    <Link
                        key={item.slug}
                        href={item.slug === "lessons" ? progressionHref("lessons", { week: current }) : progressionHref(item.slug)}
                        aria-current={item.slug === slug ? "page" : undefined}
                        className={`${pill} text-text aria-[current=page]:font-bold`}
                        style={{
                            borderColor: "var(--border-subtle)",
                            background: item.slug === slug ? "var(--surface-subtle)" : undefined,
                        }}
                    >
                        {item.label}
                    </Link>
                ))}
                <a
                    href={REFERENCE_SHEET_HREF}
                    target="_blank"
                    rel="noopener"
                    className={`${pill} text-text-muted`}
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    Reference sheet ↗
                </a>
            </nav>

            {lessons && page.weeks && (
                <nav aria-label="Lesson preview week" className="mb-5 flex flex-wrap gap-1.5">
                    {page.weeks.map((n) => (
                        <Link
                            key={n}
                            href={progressionHref("lessons", { week: n })}
                            aria-current={n === week ? "page" : undefined}
                            className="min-w-11 rounded-md border px-2 py-1.5 text-center text-sm tabular-nums text-text aria-[current=page]:font-bold"
                            style={{
                                borderColor: n === week ? "var(--primary)" : "var(--border-subtle)",
                                background: n === week ? "var(--surface-subtle)" : undefined,
                            }}
                        >
                            W{n}
                        </Link>
                    ))}
                </nav>
            )}

            <ProgressionContent
                html={lessons ? `<div class="explanation-content">${page.html}</div>` : page.html}
                className={lessons ? "gp grammar-reader-container" : "gp"}
                scrollToId={slug === "weeks" ? `w${current}` : undefined}
            />
        </div>
    );
}
