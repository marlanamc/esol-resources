import { cache } from "react";
import Link from "next/link";
import { ChevronRight, Gamepad2 } from "lucide-react";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { pickResumePractice, type ResumePracticeItem } from "@/lib/dashboard/resume-practice";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { SectionUnavailable } from "./SectionUnavailable";
import { KeepPracticingList } from "./NewThisWeekSection";
import type { FeaturedAssignment } from "@/components/dashboard/todays-assignments/types";

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
            <div className="font-legible grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[color:var(--dashboard-border)] bg-[color:var(--surface-elevated)] py-3 pl-4 pr-3">
                {/* Same outlined ring as the Featured rows, so one activity looks the same everywhere. */}
                <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ color: tone.accent, border: `2px solid ${tone.accent}` }}>
                    <Gamepad2 size={19} aria-hidden />
                </span>
                <div className="min-w-0">
                    {/* font-legible! beats the unlayered Lora heading rule; card titles stay in the body face. */}
                    <h3 className="m-0 font-legible! text-[0.9375rem] font-semibold leading-[1.3] text-text">{item.title}</h3>
                    <p className="mb-0 mt-0.5 text-[0.8125rem] leading-snug text-text-muted">{item.detail}</p>
                    {item.progress !== null ? (
                        <div role="progressbar" aria-label="Patterns unlocked" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--border-subtle)]">
                            <div className="h-full rounded-full" style={{ width: `${item.progress}%`, background: tone.accent }} />
                        </div>
                    ) : null}
                    <p className="sr-only">{item.note}</p>
                </div>
                <Link href={item.href} aria-label={`${item.action}: ${item.title}`} className="flex min-h-11 items-center justify-center gap-1 rounded-xl border px-3 py-2 text-[0.875rem] font-bold transition-[filter] hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" style={{ background: tone.surface, borderColor: tone.border, color: tone.chipText }}>
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

/** Phone home: the game you stopped in leads the "Keep practicing" list. */
export async function KeepPracticingSection({ userId, items }: { userId: string; items: FeaturedAssignment[] }) {
    // A failed read only drops the resume row; the featured list still shows.
    const resume = await loadResumePractice(userId).catch((error) => {
        console.error("[Dashboard] Recent practice unavailable", error);
        return null;
    });
    return <KeepPracticingList items={items} resume={resume} />;
}
