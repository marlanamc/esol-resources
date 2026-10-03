import { describe, expect, it } from 'vitest';
import { getWeeklyQuizSchedule } from '@/lib/weekly-quiz-schedule';
import { isLearnerVisibleActivity } from '@/lib/learner/visibility';

const quiz = { type: 'quiz', content: JSON.stringify({ type: 'weekly-quiz', weekNumber: 4 }), isReleased: false };
describe('weekly quiz schedule', () => {
  it('opens Quiz 1 Thursday October 8 at 6 pm and is due Tuesday October 13 at 6 pm Eastern', () => {
    expect(getWeeklyQuizSchedule(4)).toEqual({ opensAt: new Date('2026-10-08T22:00:00Z'), dueAt: new Date('2026-10-13T22:00:00Z') });
  });
  it('enforces the exact opening boundary even if the legacy flag is true', () => {
    expect(isLearnerVisibleActivity({ ...quiz, isReleased: true }, new Date('2026-10-08T21:59:59Z'))).toBe(false);
    expect(isLearnerVisibleActivity(quiz, new Date('2026-10-08T22:00:00Z'))).toBe(true);
  });
  it('never closes at or after the due date', () => {
    for (const date of ['2026-10-13T22:00:00Z', '2026-10-14T22:00:00Z', '2028-06-01T22:00:00Z']) {
      expect(isLearnerVisibleActivity(quiz, new Date(date))).toBe(true);
    }
  });
  it('keeps 6 pm wall-clock time when daylight saving ends between opening and due date', () => {
    expect(getWeeklyQuizSchedule(7)).toEqual({ opensAt: new Date('2026-10-29T22:00:00Z'), dueAt: new Date('2026-11-03T23:00:00Z') });
  });
  it('follows teaching weeks after winter break instead of adding seven days per quiz', () => {
    const schedule = getWeeklyQuizSchedule(16)!;
    expect(schedule.opensAt.toISOString()).toBe('2027-01-07T23:00:00.000Z');
    expect(schedule.dueAt.toISOString()).toBe('2027-01-12T23:00:00.000Z');
  });
  it('preserves deletion and manual release rules for other activities', () => {
    expect(isLearnerVisibleActivity({ ...quiz, deletedAt: new Date() }, new Date('2027-01-01'))).toBe(false);
    expect(isLearnerVisibleActivity({ type: 'quiz', content: '{"type":"verb-quiz"}', isReleased: false })).toBe(false);
    expect(getWeeklyQuizSchedule(99)).toBeNull();
  });
});
