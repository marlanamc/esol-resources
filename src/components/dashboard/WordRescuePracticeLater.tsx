import Link from 'next/link';
import { ArrowRight, Volume2 } from 'lucide-react';
import { prisma } from '@/lib/database/prisma';
import { getRescueCollectionsForUser } from '@/lib/word-rescue/access';
import { readRescueProgress } from '@/lib/word-rescue/progression';
import { WORD_RESCUE_ID } from '@/lib/word-rescue/types';

export async function WordRescuePracticeLater({ user }: { user: { id: string; role?: string | null } }) {
    const [activity, progress, collections] = await Promise.all([
        prisma.activity.findUnique({ where: { id: WORD_RESCUE_ID }, select: { isReleased: true, deletedAt: true } }),
        prisma.activityProgress.findFirst({ where: { userId: user.id, activityId: WORD_RESCUE_ID, assignmentId: null }, orderBy: { updatedAt: 'desc' }, select: { categoryData: true } }),
        getRescueCollectionsForUser(user),
    ]);
    if (!activity?.isReleased || activity.deletedAt) return null;
    const allowed = new Set(collections.flatMap(collection => collection.wordIds));
    const count = Object.entries(readRescueProgress(progress?.categoryData).words)
        .filter(([id, word]) => allowed.has(id) && word.confidence === 'again').length;
    if (!count) return null;
    return (
        <Link href="/activity/word-rescue?collection=again&returnTo=%2Fdashboard" className="flex min-h-16 items-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 p-4 text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
            <Volume2 aria-hidden="true" className="h-6 w-6 shrink-0 text-secondary" />
            <span className="min-w-0 flex-1">
                <span className="block font-semibold">Words to practice later · {count}</span>
                <span className="block text-sm text-text-muted">Your saved Word Rescue words. Earn 2 points per word.</span>
            </span>
            <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" />
        </Link>
    );
}
