import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { applyReviewAttempt, scoreReviewAttempt } from '@/lib/parts-of-speech-review/progression';
import { parseExistingCategoryData } from './shared';

export async function savePartsOfSpeechReview(userId: string, activityId: string, input: unknown) {
  scoreReviewAttempt(input);
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
    return NextResponse.json({ ok: true, review: result.review, correct: result.correct, total: result.total, progress, status, pointsAwarded: 0 });
  });
}
