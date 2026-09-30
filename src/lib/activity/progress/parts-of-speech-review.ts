import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { applyReviewAttempt, scoreReviewAttempt } from '@/lib/parts-of-speech-review/progression';
import { parseExistingCategoryData } from './shared';
import { awardPoints, updateStreak, checkAndAwardAchievements } from '@/lib/gamification/gamification';
import { WORD_JOBS_LESSON_POINTS, wordJobsRewardReason } from '@/lib/parts-of-speech-review/rewards';

export async function savePartsOfSpeechReview(userId: string, activityId: string, input: unknown) {
  const { attempt } = scoreReviewAttempt(input);
  return prisma.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`pos-review:${userId}:${activityId}`}))`;
    const existing = await tx.activityProgress.findFirst({ where: { userId, activityId, assignmentId: null }, orderBy: { updatedAt: 'desc' } });
    const result = applyReviewAttempt(parseExistingCategoryData(existing?.categoryData), input, new Date().toISOString());
    const progress = result.completed ? 100 : existing?.progress ?? 0;
    const status = progress >= 100 ? 'completed' : 'in_progress';
    if (!result.alreadyCompleted) {
      const data = { progress, status, categoryData: JSON.stringify(result.category) };
      if (existing) await tx.activityProgress.update({ where: { id: existing.id }, data });
      else await tx.activityProgress.create({ data: { userId, activityId, assignmentId: null, ...data } });
    }
    // The same lock protects completion and its permanent ledger claim. Older
    // unscored completions can receive their first credit on a retry, too.
    const reason = wordJobsRewardReason(attempt.lessonId);
    const credited = await tx.pointsLedger.findFirst({ where: { userId, reason, points: { gt: 0 } }, select: { id: true } });
    const pointsAwarded = credited ? 0 : WORD_JOBS_LESSON_POINTS;
    if (pointsAwarded) {
      await awardPoints(userId, pointsAwarded, reason, 'activity', tx);
      await updateStreak(userId, pointsAwarded, tx);
      await checkAndAwardAchievements(userId, tx);
    }
    return NextResponse.json({ ok: true, review: result.review, correct: result.correct, total: result.total, progress, status, pointsAwarded });
  }, { timeout: 15000 });
}
