import { connection } from "next/server";
import { ArrowUpRight } from "lucide-react";
import { buildTeachingWeeks } from "@/lib/course-map-schedule";

export const metadata = { title: "Grammar Progression | My ESOL Class" };

const BASE = "/api/teach/grammar-progression";
const FRAME = "grammar-progression";

/** The latest week already opened to students, so the link lands on what is being taught now. */
function currentWeekNumber(now = new Date()): number {
    const opened = buildTeachingWeeks().filter((week) => week.revealAt <= now);
    return opened.at(-1)?.index ?? 1;
}

export default async function TeachProgressionPage() {
    await connection();
    const week = currentWeekNumber();
    const links = [
        { href: `${BASE}/weeks.html#w${week}`, label: `This week · W${week}` },
        { href: `${BASE}/index.html`, label: "Overview" },
        { href: `${BASE}/weeks.html`, label: "Week by week" },
        { href: `${BASE}/sequence.html`, label: "Sequence" },
        { href: `${BASE}/lessons.html#w${week}`, label: "Lesson preview" },
        { href: `${BASE}/vocabulary.html`, label: "Vocabulary" },
        { href: `${BASE}/reference-sheet.html`, label: "Reference sheet" },
    ];

    return (
        <div className="flex flex-col h-[calc(100dvh-10rem)] min-h-[32rem]">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                        Course
                    </p>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                        Grammar Progression
                    </h1>
                </div>
                <a
                    href={`${BASE}/index.html`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-text"
                >
                    Open full page <ArrowUpRight size={16} aria-hidden="true" />
                </a>
            </div>
            <nav aria-label="Grammar progression sections" className="mb-3 flex flex-wrap gap-2">
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target={FRAME}
                        className="rounded-full border px-3 py-1 text-sm font-medium text-text hover:bg-[var(--surface-subtle)]"
                        style={{ borderColor: "var(--border-subtle)" }}
                    >
                        {link.label}
                    </a>
                ))}
            </nav>
            <iframe
                name={FRAME}
                title="Level 3 grammar progression"
                src={`${BASE}/weeks.html#w${week}`}
                className="w-full flex-1 rounded-xl border bg-white"
                style={{ borderColor: "var(--border-subtle)" }}
            />
        </div>
    );
}
