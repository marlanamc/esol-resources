import { describe, expect, it, vi } from 'vitest';
vi.mock('@/lib/database/prisma', () => ({ prisma: {} }));
import { calculateQuizPoints, POINTS } from '@/lib/gamification/gamification';

describe('quiz effort points', () => {
  it.each([null, 0, 35, 69, 70])('recognizes completion at score %s', score => {
    expect(calculateQuizPoints(score)).toBe(POINTS.QUIZ_COMPLETION);
  });
  it.each([[80, 5], [90, 10], [100, 15]])('preserves the award at score %s', (score, points) => {
    expect(calculateQuizPoints(score)).toBe(points);
  });
});
