import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/database/prisma';
import { awardPoints, updateStreak, checkAndAwardAchievements } from '@/lib/gamification/gamification';
import { applyRescueAction, readRescueProgress } from './progression';
import { WORD_RESCUE_ID, WORD_RESCUE_POINTS } from './types';

export async function saveRescueAction(userId: string, action: unknown, assignmentId: string | null = null, allowedWordIds?: ReadonlySet<string>) {
  return prisma.$transaction(tx => saveRescueActionInTransaction(tx, userId, action, assignmentId, allowedWordIds), { timeout: 15000 });
}

/** Shared transaction body, also exercised by the rollback-only database release check. */
export async function saveRescueActionInTransaction(tx: Prisma.TransactionClient, userId: string, action: unknown, assignmentId: string | null = null, allowedWordIds?: ReadonlySet<string>) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`word-rescue:${userId}`}))`;
    const existing = await tx.activityProgress.findFirst({ where: { userId, activityId: WORD_RESCUE_ID, assignmentId: null }, orderBy: { updatedAt: 'desc' } });
    const { state, rewardKey } = applyRescueAction(readRescueProgress(existing?.categoryData), action, allowedWordIds);
    const reason = rewardKey ? `Word Rescue practice ${rewardKey}` : null;
    const credited = reason ? await tx.pointsLedger.findFirst({ where: { userId, source: 'word-rescue', reason, points: WORD_RESCUE_POINTS }, select: { id: true } }) : null;
    const pointsAwarded = reason && !credited ? WORD_RESCUE_POINTS : 0;
    if (pointsAwarded && reason) {
      // Award and completion share the transaction: no completed-but-uncredited gap.
      await awardPoints(userId, pointsAwarded, reason, 'word-rescue', tx);
      await updateStreak(userId, pointsAwarded, tx);
      await checkAndAwardAchievements(userId, tx);
    }
    const attempts = Object.values(state.words).reduce((sum, word) => sum + word.attempts, 0);
    const progress = Math.min(100, Math.round(attempts / 3 * 100));
    const data = { progress, status: progress === 100 ? 'completed' : 'in_progress', categoryData: JSON.stringify({ wordRescue: state }) };
    if (existing) await tx.activityProgress.update({ where: { id: existing.id }, data });
    else await tx.activityProgress.create({ data: { userId, activityId: WORD_RESCUE_ID, assignmentId: null, ...data } });
    if (assignmentId) {
      const scoped = await tx.activityProgress.findFirst({ where: { userId, activityId: WORD_RESCUE_ID, assignmentId } });
      // Assignment completion follows this session, never an unrelated earlier set.
      const scopedProgress = Math.max(scoped?.progress ?? 0, Math.round((state.session?.index ?? 0) / (state.session?.wordIds.length || 3) * 100));
      const scopedData = { ...data, progress: scopedProgress, status: scopedProgress === 100 ? 'completed' : 'in_progress' };
      if (scoped) await tx.activityProgress.update({ where: { id: scoped.id }, data: scopedData });
      else await tx.activityProgress.create({ data: { userId, activityId: WORD_RESCUE_ID, assignmentId, ...scopedData } });
    }
    return { state, pointsAwarded, credited: Boolean(reason) };
}
