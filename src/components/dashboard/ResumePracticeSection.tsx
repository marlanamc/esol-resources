import { cache } from "react";
import Link from "next/link";
import { ChevronRight, Gamepad2 } from "lucide-react";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { pickResumePractice, type ResumePracticeItem } from "@/lib/dashboard/resume-practice";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { SectionUnavailable } from "./SectionUnavailable";

// Mobile and desktop share one read. Only return the small presentation object to the view.
const loadResumePractice = cache(async (userId: string) => {
    const rows = await withPrismaReadRetry(() => prisma.activityProgress.findMany({
        where: {
            userId,
            activity: { type: "game", deletedAt: null },
            OR: [
                { assignmentId: null },
                { assignment: { class: { enrollments: { some: { studentId: userId, status: "active" } } } } },
            ],
        },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        // Check every saved game so older unfinished work can beat recent completions.
        distinct: ["activityId"],
        select: {
            activityId: true, assignmentId: true, progress: true, status: true,
            categoryData: true, updatedAt: true,
            activity: { select: { title: true, type: true, category: true, ui: true, content: true, deletedAt: true, isReleased: true } },
        },
    }));
    return pickResumePractice(rows);
});

export function ResumePracticeCard({ item }: { item: ResumePracticeItem }) {
    const tone = getLearnerCategoryTone("games");
    return (
        <section aria-label="Pick up where you left off">
            <h2 className="mb-3 font-display text-lg font-bold text-text">Pick up where you left off</h2>
            <div className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-2xl border border-[color:var(--dashboard-border)] bg-[color:var(--surface-elevated)] px-3 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10" style={{ color: tone.accent, background: tone.surfaceMuted }}>
                    <Gamepad2 size={20} aria-hidden />
                </span>
                <div className="min-w-0">
                    <h3 className="m-0 font-sans text-sm font-semibold leading-snug text-text sm:text-base">{item.title}</h3>
                    <p className="mb-0 mt-1 text-xs leading-snug text-text-muted">{item.detail}</p>
                    {item.progress !== null ? (
                        <div role="progressbar" aria-label="Patterns unlocked" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--border-subtle)]">
                            <div className="h-full rounded-full" style={{ width: `${item.progress}%`, background: tone.accent }} />
                        </div>
                    ) : null}
                    <p className="sr-only">{item.note}</p>
                </div>
                <Link href={item.href} aria-label={`${item.action}: ${item.title}`} className="flex min-h-11 items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:px-3 sm:text-sm" style={{ background: tone.accentStrong }}>
                    <span className="sm:hidden">{item.action === "Play another round" ? "Play again" : "Continue"}</span><span className="hidden sm:inline">{item.action}</span><ChevronRight size={16} aria-hidden />
                </Link>
            </div>
        </section>
    );
}

export async function ResumePracticeSection({ userId }: { userId: string }) {
    let item: ResumePracticeItem | null;
    try {
        item = await loadResumePractice(userId);
    } catch (error) {
        console.error("[Dashboard] Recent practice unavailable", error);
        return <SectionUnavailable title="Recent practice" />;
    }
    return item ? <ResumePracticeCard item={item} /> : null;
}
