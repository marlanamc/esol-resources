import type { Prisma } from '@prisma/client';
import { calculateQuizPoints, calculateWeeklyQuizPoints, weeklyQuizRetakeTopUp } from '@/lib/gamification/gamification';
import { POINTS } from '@/lib/gamification/constants';
import { applyAwardChain } from '@/lib/gamification/award-chain';
import type { VerbQuizContent, VerbQuizSubmission } from '@/types/verb-quiz';

/** Grade legacy verb quizzes on the server, using the same slash-form rules as the review. */
export function gradeVerbQuiz(quiz: VerbQuizContent, payload: unknown): VerbQuizSubmission {
  const input = (payload as { answers?: Record<string, Record<string, unknown>> } | null)?.answers;
  const answers: VerbQuizSubmission['answers'] = {};
  const results: VerbQuizSubmission['results'] = {};
  let correctCount = 0;
  const forms = ['v1_3rd', 'v1_ing', 'v2', 'v3'] as const;
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '').split('/').sort().join('/');
  for (const [verb, expected] of Object.entries(quiz.verbs)) {
    answers[verb] = { v1_3rd: '', v1_ing: '', v2: '', v3: '' };
    results[verb] = { v1_3rd: false, v1_ing: false, v2: false, v3: false };
    for (const form of forms) {
      const answer = input?.[verb]?.[form];
      if (typeof answer !== 'string' || !answer.trim() || answer.length > 500) throw new Error('Please answer every verb form before submitting.');
      answers[verb][form] = answer.trim();
      results[verb][form] = normalize(answer) === normalize(expected[form]);
      if (results[verb][form]) correctCount++;
    }
  }
  const totalForms = Object.keys(quiz.verbs).length * 4;
  if (!totalForms) throw new Error('This quiz has no questions.');
  return { answers, results, correctCount, totalForms, score: Math.round(correctCount / totalForms * 100), totalPoints: 0, submittedAt: new Date().toISOString() };
}

/** Called under the user/activity/assignment lock, inside the award transaction. */
export async function saveQuizAttempt(tx: Prisma.TransactionClient, args: {
  userId: string; activityId: string; assignmentId: string | null;
  idempotencyKey: string; content: unknown; score: number; weekly: boolean; title: string;
}) {
  const { userId, activityId, assignmentId, idempotencyKey, score } = args;
  const where = { userId, activityId, assignmentId };
  const previous = await tx.submission.findFirst({ where, orderBy: { updatedAt: 'desc' } });
  const progress = await tx.activityProgress.findFirst({ where });
  const legacyMeta = (() => { try { return JSON.parse(progress?.categoryData || '{}'); } catch { return {}; } })();
  if (previous) {
    // Archive the saved result exactly as it was, including its original timestamp.
    const hasHistory = await tx.quizAttempt.findFirst({ where: { submissionId: previous.id } });
    if (!hasHistory) {
      await tx.quizAttempt.create({ data: {
        submissionId: previous.id,
        idempotencyKey: legacyMeta.pwaLastSubmissionIdempotencyKey || `legacy:${previous.id}`,
        content: previous.content, score: previous.score, pointsAwarded: previous.pointsAwarded,
        completedAt: previous.completedAt ?? previous.updatedAt,
      } });
    }
    const duplicate = await tx.quizAttempt.findUnique({ where: { submissionId_idempotencyKey: { submissionId: previous.id, idempotencyKey } } });
    if (duplicate) {
      // Recover historical completions whose point award failed before atomic saves.
      let recoveredPoints = 0;
      if (previous.pointsAwarded === 0 && duplicate.pointsAwarded === 0) {
        recoveredPoints = args.weekly ? calculateWeeklyQuizPoints(duplicate.score) : calculateQuizPoints(duplicate.score);
        await tx.submission.update({ where: { id: previous.id }, data: { pointsAwarded: recoveredPoints } });
        await tx.quizAttempt.update({ where: { id: duplicate.id }, data: { pointsAwarded: recoveredPoints } });
        await applyAwardChain({ userId, points: recoveredPoints, reason: `${args.title}|Quiz`, source: 'activity', transaction: tx });
      }
      return { submissionId: previous.id, score: previous.score, quizResult: JSON.parse(duplicate.content), points: recoveredPoints,
        totalPointsAwarded: previous.pointsAwarded + recoveredPoints, duplicate: true };
    }
  }
  const points = previous && previous.pointsAwarded > 0
    ? POINTS.QUIZ_COMPLETION + weeklyQuizRetakeTopUp(previous.score, score)
    : args.weekly ? calculateWeeklyQuizPoints(score) : calculateQuizPoints(score);
  const completedAt = new Date();
  const result = { ...(args.content as object), totalPoints: points };
  const content = JSON.stringify(result);
  const improved = previous?.score == null || score >= previous.score;
  const submission = previous
    ? await tx.submission.update({ where: { id: previous.id }, data: {
        ...(improved ? { content, score, completedAt } : {}), status: 'submitted', pointsAwarded: { increment: points },
      } })
    : await tx.submission.create({ data: { ...where, content, score, completedAt, status: 'submitted', pointsAwarded: points } });
  await tx.quizAttempt.create({ data: { submissionId: submission.id, idempotencyKey, content, score, completedAt, pointsAwarded: points } });
  const progressData = { progress: 100, status: 'completed', categoryData: JSON.stringify({ ...legacyMeta, pwaLastSubmissionIdempotencyKey: idempotencyKey, pwaLastSubmissionSyncedAt: completedAt.toISOString() }) };
  if (progress) await tx.activityProgress.update({ where: { id: progress.id }, data: progressData });
  else await tx.activityProgress.create({ data: { ...where, ...progressData } });
  await applyAwardChain({ userId, points, reason: `${args.title}|Quiz`, source: 'activity', transaction: tx });
  return { submissionId: submission.id, score: submission.score, quizResult: result, points, totalPointsAwarded: submission.pointsAwarded, duplicate: false };
}
