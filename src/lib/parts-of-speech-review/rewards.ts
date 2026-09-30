import { REVIEW_LESSONS, type ReviewLessonId } from './content';

export const WORD_JOBS_LESSON_POINTS = 3;

/** Include the stable lesson ID because different weeks can share a title. */
export function wordJobsRewardReason(lessonId: ReviewLessonId): string {
  return `Word Jobs: ${REVIEW_LESSONS[lessonId].title}|${lessonId}`;
}
