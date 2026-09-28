import { z } from 'zod';
import { REVIEW_CATEGORIES, REVIEW_LESSONS, type ReviewLessonId } from './content';

const lessonIds = Object.keys(REVIEW_LESSONS) as [ReviewLessonId, ...ReviewLessonId[]];

export const reviewAttemptSchema = z.object({
  version: z.literal(1),
  attemptId: z.string().uuid(),
  lessonId: z.enum(lessonIds),
  answers: z.array(z.object({ questionId: z.string(), answer: z.enum(REVIEW_CATEGORIES) }).strict()).max(9),
}).strict();
export type ReviewAttempt = z.infer<typeof reviewAttemptSchema>;
const resultSchema = z.object({ completed: z.literal(true), correct: z.number().int().min(0).max(9), total: z.number().int().min(1).max(9), completedAt: z.string(), attemptId: z.string().uuid() });
const progressSchema = z.object({ version: z.literal(1), lessons: z.object(Object.fromEntries(lessonIds.map(id => [id, resultSchema.optional()])) as Record<ReviewLessonId, z.ZodOptional<typeof resultSchema>>) });
export type ReviewProgress = z.infer<typeof progressSchema>;
export function readReviewProgress(value: unknown): ReviewProgress {
  const parsed = progressSchema.safeParse(value);
  return parsed.success ? parsed.data : { version: 1, lessons: {} };
}
export function scoreReviewAttempt(input: unknown) {
  const attempt = reviewAttemptSchema.parse(input);
  const lesson = REVIEW_LESSONS[attempt.lessonId];
  const answers = new Map(attempt.answers.map(a => [a.questionId, a.answer]));
  if (answers.size !== lesson.questions.length || attempt.answers.length !== lesson.questions.length ||
      lesson.questions.some(q => !answers.has(q.id)) || lesson.questions.some(q => !(q.categories ?? lesson.categories).includes(answers.get(q.id)!))) {
    throw new Error('Complete each question once before saving this review.');
  }
  return { attempt, correct: lesson.questions.filter(q => answers.get(q.id) === q.answer).length, total: lesson.questions.length };
}
export function applyReviewAttempt(category: Record<string, unknown>, input: unknown, now: string) {
  const { attempt, correct, total } = scoreReviewAttempt(input);
  const previous = readReviewProgress(category._partsOfSpeechReview);
  // Store first completion per lesson. Subsequent practice is unlimited and does
  // not create new rewards or overwrite the first independent review score.
  const alreadyCompleted = !!previous.lessons[attempt.lessonId];
  const review: ReviewProgress = alreadyCompleted ? previous : {
    version: 1, lessons: { ...previous.lessons, [attempt.lessonId]: { completed: true, correct, total, completedAt: now, attemptId: attempt.attemptId } },
  };
  return { category: { ...category, _partsOfSpeechReview: review } as Record<string, unknown>, review, correct, total, alreadyCompleted, completed: !!review.lessons['nouns-verbs'] };
}
/** A stale library tab may reset its own groups, but cannot erase or forge review completion. */
export function preserveReviewProgress(saved: Record<string, unknown>, incoming: Record<string, unknown>) {
  const category = { ...incoming };
  delete category._partsOfSpeechReview;
  if (saved._partsOfSpeechReview) category._partsOfSpeechReview = saved._partsOfSpeechReview;
  return category;
}
