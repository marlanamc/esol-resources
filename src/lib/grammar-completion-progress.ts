import type { Prisma } from '@prisma/client';
import { acquireUserActivityScopeLock } from '@/lib/database/locks';

/** Mark the quiz's own scope complete without changing answers, practice, or prior awards. */
export async function markGrammarQuizComplete(tx: Prisma.TransactionClient, scope: {
    userId: string; activityId: string; assignmentId: string | null;
}) {
    await acquireUserActivityScopeLock(tx, scope);
    const previous = await tx.activityProgress.findFirst({ where: scope, orderBy: { updatedAt: 'desc' } });
    if (previous?.status === 'completed' && previous.progress === 100) return previous;
    return previous
        ? tx.activityProgress.update({ where: { id: previous.id }, data: { progress: 100, status: 'completed' } })
        : tx.activityProgress.create({ data: { ...scope, progress: 100, status: 'completed' } });
}
