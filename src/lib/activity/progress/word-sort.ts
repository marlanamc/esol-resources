import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { awardPoints, updateStreak, checkAndAwardAchievements } from '@/lib/gamification/gamification';
import { applyWordSortAttempt, parseWordSortCategoryData, readWordSortProgress } from '@/lib/word-sort/progression';
import type { WordSortTarget } from '@/lib/word-sort/types';

export class InvalidWordSortAttempt extends Error {}

/** Serialize progress and rewards together, including first-time rows whose
 * nullable assignment key cannot provide a PostgreSQL uniqueness guarantee. */
export async function saveWordSortAttempt(userId: string, activityId: string, title: string, target: WordSortTarget, attempt: unknown) {
  return prisma.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`word-sort:${userId}:${activityId}`}))`;
    const records = await tx.activityProgress.findMany({ where: { userId, activityId }, orderBy: { updatedAt: 'desc' } });
    const existing = records.find(record => record.assignmentId === null);
    const source = existing ?? records[0];
    const category = parseWordSortCategoryData(source?.categoryData);
    const wasCompleted = records.some(record => record.progress >= 100 || record.status === 'completed' || readWordSortProgress(record.categoryData, target).levels.words.passed);
    const previous = readWordSortProgress(category, target, wasCompleted);
    let result;
    try { result = applyWordSortAttempt(previous, target, attempt); }
    catch (error) { throw new InvalidWordSortAttempt(error instanceof Error ? error.message : 'Invalid attempt.'); }
    let pointsAwarded = 0;
    const completed = result.progress.levels.words.passed;
    if (!result.duplicate) {
      // Only the first Words pass earns the existing beginner reward. Updating
      // progress, ledger, streak and achievements is one atomic transaction.
      if (!previous.levels.words.passed && completed) {
        pointsAwarded = { verb: 3, noun: 5, pronoun: 8, article: 3 }[target];
        await awardPoints(userId, pointsAwarded, `${title}|Parts of Speech`, 'activity', tx);
        await updateStreak(userId, pointsAwarded, tx);
        await checkAndAwardAchievements(userId, tx);
      }
      const data = { progress: completed ? 100 : 0, status: completed ? 'completed' : 'in_progress', categoryData: JSON.stringify({ ...category, wordSort: result.progress }) };
      if (existing) await tx.activityProgress.update({ where: { id: existing.id }, data });
      else await tx.activityProgress.create({ data: { userId, activityId, assignmentId: null, ...data } });
    }
    return NextResponse.json({ ok: true, progress: completed ? 100 : 0, status: completed ? 'completed' : 'in_progress', wordSort: result.progress, pointsAwarded });
  }, { timeout: 15000 });
}
