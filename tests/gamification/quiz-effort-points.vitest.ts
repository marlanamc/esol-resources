import { describe, expect, it, vi } from 'vitest';
vi.mock('@/lib/database/prisma', () => ({ prisma: {} }));
import { calculateQuizPoints, calculateWeeklyQuizPoints, POINTS } from '@/lib/gamification/gamification';

describe('quiz effort points', () => {
  it.each([null, 0, 35, 69, 70])('recognizes completion at score %s', score => {
    expect(calculateQuizPoints(score)).toBe(POINTS.QUIZ_COMPLETION);
  });
  it.each([[80, 5], [90, 10], [100, 15]])('preserves the award at score %s', (score, points) => {
    expect(calculateQuizPoints(score)).toBe(points);
  });
  it('pays the weekly quiz homework bonus on top of the score points', () => {
    expect(calculateWeeklyQuizPoints(40)).toBe(POINTS.WEEKLY_QUIZ_HOMEWORK_BONUS + POINTS.QUIZ_COMPLETION);
    expect(calculateWeeklyQuizPoints(100)).toBe(POINTS.WEEKLY_QUIZ_HOMEWORK_BONUS + POINTS.QUIZ_PERFECT_SCORE);
  });
  it('makes even a low weekly quiz score worth more than any game', () => {
    expect(calculateWeeklyQuizPoints(0)).toBeGreaterThan(POINTS.TIMELINE_TENSES_PERFECT);
  });
});
