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
        take: 50,
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
            <div className="flex min-w-0 flex-wrap items-center gap-3 rounded-2xl border border-[color:var(--dashboard-border)] bg-[color:var(--surface-elevated)] p-4 sm:gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ color: tone.accent, background: tone.surfaceMuted }}>
                    <Gamepad2 size={23} aria-hidden />
                </span>
                <div className="min-w-0 flex-1 basis-40">
                    <h3 className="text-base font-bold leading-snug text-text">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-muted">{item.detail}</p>
                    {item.progress !== null ? (
                        <div role="progressbar" aria-label="Patterns unlocked" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--border-subtle)]">
                            <div className="h-full rounded-full" style={{ width: `${item.progress}%`, background: tone.accent }} />
                        </div>
                    ) : null}
                    <p className="mt-2 text-xs text-text-muted">{item.note}</p>
                </div>
                <Link href={item.href} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:w-auto" style={{ background: tone.accentStrong }}>
                    {item.action}<ChevronRight size={18} aria-hidden />
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
