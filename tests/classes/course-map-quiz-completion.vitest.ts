import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CourseMapActivity } from '@/lib/course-map';

const mocks = vi.hoisted(() => ({ visibleMap: vi.fn(), progress: vi.fn() }));
vi.mock('@/lib/database/prisma', () => ({ prisma: {} }));
vi.mock('@/lib/course-map', () => ({ getVisibleMap: mocks.visibleMap }));
vi.mock('@/lib/learner-preview', () => ({ getEffectiveLearnerMode: async () => 'classroom' }));
vi.mock('@/lib/course-map-progress.server', () => ({
  enrichCourseMapUnitsWithGrammarIds: async (units: unknown) => units,
  loadCourseMapProgressState: mocks.progress,
}));
vi.mock('@/lib/course-map-current-week', () => ({
  visibleWeekNumbers: () => [1, 2],
  resolveCurrentWeek: () => ({ weekNumber: 2 }),
  resolveEarlyAccessWeek: () => null,
}));

import { getCurrentWeekCompletion } from '@/lib/course-map-week';

const quiz: CourseMapActivity = {
  id: 'quiz', activityId: 'quiz', title: 'Weekly quiz', activityType: 'quiz', status: 'available',
};
function setWeek(activities: CourseMapActivity[]) {
  mocks.visibleMap.mockResolvedValue({ units: [{
    unitNumber: 1, unitTitle: 'Unit', month: 'October', levels: [
      { levelNumber: 1, levelTitle: 'Last week', requiredActivities: [{ ...quiz, id: 'old', activityId: 'old' }] },
      { levelNumber: 2, levelTitle: 'This week', requiredActivities: activities },
    ],
  }] });
}

beforeEach(() => {
  mocks.progress.mockResolvedValue({ quiz: { status: 'completed', categoryData: null } });
  setWeek([quiz]);
});

describe('current-week quiz recognition', () => {
  it('recognizes completed quizzes even when other weekly work is unfinished', async () => {
    setWeek([quiz, { ...quiz, id: 'guide', activityId: 'guide', activityType: 'guide' }]);
    expect(await getCurrentWeekCompletion({ id: 'student' })).toEqual({
      weekComplete: false, weeklyQuizComplete: true, completedWeeksCount: 0,
    });
  });

  it('counts completed weeks while keeping the current week marker separate', async () => {
    mocks.progress.mockResolvedValue({
      old: { status: 'completed', categoryData: null },
      quiz: { status: 'in_progress', categoryData: null },
    });
    expect(await getCurrentWeekCompletion({ id: 'student' })).toEqual({
      weekComplete: false, weeklyQuizComplete: false, completedWeeksCount: 1,
    });
  });

  it('does not recognize an earlier week or an in-progress attempt', async () => {
    mocks.progress.mockResolvedValue({
      old: { status: 'completed', categoryData: null },
      quiz: { status: 'in_progress', categoryData: null },
    });
    expect((await getCurrentWeekCompletion({ id: 'student' })).weeklyQuizComplete).toBe(false);
  });

  it.each(['planned', 'locked'] as const)('does not recognize a %s quiz', async status => {
    setWeek([{ ...quiz, status }]);
    expect((await getCurrentWeekCompletion({ id: 'student' })).weeklyQuizComplete).toBe(false);
  });

  it('does not give a quiz marker for a week without quizzes', async () => {
    setWeek([{ ...quiz, activityType: 'guide' }]);
    expect((await getCurrentWeekCompletion({ id: 'student' })).weeklyQuizComplete).toBe(false);
  });

  it('requires all quizzes when a week has more than one', async () => {
    setWeek([quiz, { ...quiz, id: 'second', activityId: 'second' }]);
    expect((await getCurrentWeekCompletion({ id: 'student' })).weeklyQuizComplete).toBe(false);
  });

  it('returns no markers when no week is visible', async () => {
    mocks.visibleMap.mockResolvedValue({ units: [] });
    expect(await getCurrentWeekCompletion({ id: 'student' })).toEqual({
      weekComplete: false, weeklyQuizComplete: false, completedWeeksCount: 0,
    });
  });
});
