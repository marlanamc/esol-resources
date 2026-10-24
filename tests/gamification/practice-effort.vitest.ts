import { beforeEach, describe, expect, it, vi } from 'vitest';
import { calculateGroupPoints as giPoints } from '@/lib/verbs/gerund-infinitive-progress';
import { calculateGroupPoints as verbPoints } from '@/lib/verbs/irregular-progress';
import { activityAwardReportKey } from '@/lib/gamification/activity-points';
import { practiceAttemptKey } from '@/lib/practice-attempt-key';

const mocks = vi.hoisted(() => ({ award: vi.fn() }));
vi.mock('@/lib/gamification/award-chain', () => ({ applyAwardChain: mocks.award }));
vi.mock('@/lib/gamification/gamification', async () => {
  const { POINTS } = await import('@/lib/gamification/constants');
  return { POINTS, getActivityPoints: () => 5, getSentenceBuilderPoints: () => 5, getVocabularyTypePoints: () => 5 };
});
import { awardProgressActivityPoints } from '@/lib/activity/progress/award-points';

const award = (ui: string, extra: Record<string, unknown> = {}) => awardProgressActivityPoints({
  userId: 'learner', activityId: 'game', activity: { type: 'game', title: 'Practice', content: '{}', ui, category: null },
  activityGameUi: ui, shouldAwardGroupRoundPoints: ['parts-of-speech', 'gerund-infinitive', 'irregular-verbs'].includes(ui),
  groupId: 'group-1', roundMode: 'round1', roundAccuracy: 0, roundExercisesCompleted: 10,
  isVocabularyTypeUpdate: false, sanitizedAccuracy: 0, ...extra,
});
beforeEach(() => { vi.clearAllMocks(); mocks.award.mockResolvedValue({ deduped: false }); });

describe('meaningful practice earns credit without passing', () => {
  it.each([giPoints, verbPoints])('awards effort for attempted verb rounds, no points for empty rounds', (calculate) => {
    expect(calculate(0, 10, false, 'round1')).toBe(3);
    expect(calculate(100, 10, true, 'round1')).toBe(5);
    expect(calculate(100, 0, true, 'round1')).toBe(0);
  });
  it.each(['parts-of-speech', 'gerund-infinitive', 'irregular-verbs', 'verb-forms'])('%s sends effort credit to the award chain', async ui => {
    expect(await award(ui)).toBe(3);
    expect(mocks.award).toHaveBeenCalledWith(expect.objectContaining({ userId: 'learner', points: 3, source: 'activity' }));
  });
  it('time-signals awards effort below 70%, keeping the passing bonus', async () => {
    expect(await award('timeline-tenses', { category: 'time-signals' })).toBe(3);
    expect(await award('timeline-tenses', { category: 'time-signals', sanitizedAccuracy: 70 })).toBe(5);
  });
  it('distinguishes genuine new rounds while preserving a stable retry key', async () => {
    const first = {}; const second = {};
    expect(practiceAttemptKey(first)).toBe(practiceAttemptKey(first));
    expect(practiceAttemptKey(first)).not.toBe(practiceAttemptKey(second));
    await award('irregular-verbs', { idempotencyKey: practiceAttemptKey(first) });
    await award('irregular-verbs', { idempotencyKey: practiceAttemptKey(second) });
    expect(mocks.award.mock.calls[0][0].reason).not.toBe(mocks.award.mock.calls[1][0].reason);
    expect(mocks.award.mock.calls[0][0].dedupeWindowMs).toBeGreaterThan(60_000);
    mocks.award.mockResolvedValueOnce({ deduped: true });
    expect(await award('irregular-verbs', { idempotencyKey: practiceAttemptKey(first) })).toBe(0);
  });
});

it('groups separate practice attempts under one activity in teacher reports', () => {
  expect(activityAwardReportKey('Verbs|Irregular Verbs|attempt:verbs:first'))
    .toBe(activityAwardReportKey('Verbs|Irregular Verbs|attempt:verbs:second'));
  expect(activityAwardReportKey('Verbs|Irregular Verbs')).toBe('Verbs|Irregular Verbs');
  expect(activityAwardReportKey(null)).toBe('unknown');
});
