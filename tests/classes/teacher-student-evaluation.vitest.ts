import { describe, expect, it } from 'vitest';
import {
    buildRequiredQuizzes,
    buildStudentEvaluation,
    evaluationDay,
    quizEvidence,
    type EvaluationProgress,
    type EvaluationSubmission,
    type EvaluationResponse,
    type EvaluationLedger,
} from '@/lib/teacher-student-evaluation';

const since = new Date('2026-09-15T16:00:00Z');
const now = new Date('2026-10-13T17:00:00Z');
const activity = {
    id: 'week4',
    title: 'Week 4 Quiz',
    type: 'quiz',
    category: 'quizzes',
    content: JSON.stringify({ type: 'weekly-quiz', weekNumber: 4 }),
    deletedAt: null,
};
const submission = (overrides: Partial<EvaluationSubmission> = {}): EvaluationSubmission => ({
    activityId: 'week4',
    assignmentId: null,
    score: 100,
    status: 'graded',
    content: JSON.stringify({
        type: 'weekly-quiz',
        results: [{ correct: true }, { correct: false }],
    }),
    createdAt: new Date('2026-10-08T23:00:00Z'),
    updatedAt: new Date('2026-10-08T23:00:00Z'),
    completedAt: new Date('2026-10-08T23:00:00Z'),
    ...overrides,
});
const progress = (overrides: Partial<EvaluationProgress> = {}): EvaluationProgress => ({
    activityId: 'vocab',
    assignmentId: null,
    progress: 75,
    status: 'in_progress',
    categoryData: JSON.stringify({
        flashcards: { completed: true },
        matching: { completed: true },
        'fill-blank': { completed: true },
    }),
    createdAt: new Date('2026-10-01T23:00:00Z'),
    updatedAt: new Date('2026-10-01T23:10:00Z'),
    activity: { id: 'vocab', title: 'Vocabulary', type: 'vocabulary', category: 'Vocab' },
    ...overrides,
});
const ledger = (overrides: Partial<EvaluationLedger> = {}): EvaluationLedger => ({
    id: 'ledger',
    reason: 'Daily login',
    source: 'login',
    points: 5,
    createdAt: new Date('2026-10-05T23:00:00Z'),
    ...overrides,
});
const response = (
    at: string,
    correct: boolean,
    overrides: Partial<EvaluationResponse> = {},
): EvaluationResponse => ({
    activityId: 'guide',
    questionId: 'q1',
    isCorrect: correct,
    skillTag: 'be-v1-not-base',
    createdAt: new Date(at),
    activity: { id: 'guide', title: 'Verb forms', type: 'guide', category: 'grammar' },
    ...overrides,
});
const build = (input: Partial<Parameters<typeof buildStudentEvaluation>[0]> = {}) =>
    buildStudentEvaluation({
        since,
        now,
        assignmentIds: ['current'],
        progress: [],
        submissions: [],
        responses: [],
        ledger: [],
        quizzes: [],
        ...input,
    });
const quizzes = (input: Partial<Parameters<typeof buildRequiredQuizzes>[0]> = {}) =>
    buildRequiredQuizzes({
        activities: [activity],
        submissions: [],
        assignmentIds: ['current'],
        since,
        now,
        ...input,
    });

describe('current-class required weekly quizzes', () => {
    it('excludes legacy verb quizzes, deleted content and work due before enrollment', () => {
        expect(
            quizzes({
                activities: [
                    { ...activity, content: '{"type":"verb-quiz"}' },
                    { ...activity, deletedAt: now },
                ],
            }),
        ).toEqual([]);
        expect(quizzes({ since: new Date('2026-10-14T00:00:00Z') })).toEqual([]);
    });
    it('uses the same before-class deadline and opening schedule as students', () => {
        expect(quizzes()[0]).toMatchObject({ status: 'due', dueAt: '2026-10-13T22:00:00.000Z' });
        expect(quizzes({ now: new Date('2026-10-13T22:00:01Z') })[0].status).toBe('overdue');
        expect(
            quizzes({
                activities: [{ ...activity, content: '{"type":"weekly-quiz","weekNumber":5}' }],
            })[0].status,
        ).toBe('upcoming');
    });
    it('does not count a previous-class submission or pending draft as completion', () => {
        expect(quizzes({ submissions: [submission({ assignmentId: 'previous' })] })[0].status).toBe(
            'due',
        );
        expect(quizzes({ submissions: [submission({ status: 'pending' })] })[0].status).toBe('due');
        expect(
            quizzes({
                submissions: [
                    submission({
                        updatedAt: new Date('2026-03-01'),
                        completedAt: new Date('2026-03-01'),
                    }),
                ],
            })[0].status,
        ).toBe('due');
    });
    it('accepts unassigned course-map submissions and preserves purposeful outage credit', () => {
        const saved = submission({
            content: '{"type":"weekly-quiz","teacherOverride":"App outage","score":100}',
        });
        expect(quizzes({ submissions: [saved] })[0]).toMatchObject({
            status: 'completed',
            credit: 100,
            accuracy: null,
            adjusted: true,
        });
        expect(quizEvidence(submission())).toEqual({ credit: 100, accuracy: 50, adjusted: true });
    });
    it('handles malformed score payloads without inventing accuracy', () => {
        expect(quizEvidence(submission({ content: 'invalid' })).accuracy).toBeNull();
        expect(
            quizEvidence(submission({ content: '{"results":[null,{},"yes"]}' })).accuracy,
        ).toBeNull();
    });
});

describe('optional practice and learning evidence', () => {
    it('counts genuine unassigned practice, deduplicates assignment variants and preserves vocabulary modes', () => {
        const result = build({
            progress: [
                progress(),
                progress({ assignmentId: 'current' }),
                progress({ activityId: 'old', assignmentId: 'previous' }),
            ],
        });
        expect(result.practice).toHaveLength(1);
        expect(result.practice[0]).toMatchObject({
            completed: false,
            modes: ['Flashcards', 'Matching', 'Fill in the blank'],
        });
        expect(result.categories[0]).toMatchObject({ category: 'Vocabulary', explored: 1 });
        expect(result.engagement.activeDays).toBe(1);
        expect(JSON.stringify(result)).not.toMatch(/stalled|overdue|needs-attention/);
    });
    it('excludes prior-year practice and does not invent history from older creation dates', () => {
        expect(
            build({ progress: [progress({ updatedAt: new Date('2026-04-01') })] }).practice,
        ).toEqual([]);
        const result = build({ progress: [progress({ createdAt: new Date('2026-03-01') })] });
        expect(result.engagement.activeDays).toBe(1);
    });
    it('retains bonuses and corrections in the ledger but excludes them from practice days', () => {
        const result = build({
            ledger: [
                ledger(),
                ledger({ source: 'course-map-recovery', points: 10 }),
                ledger({ source: 'award', reason: 'Achievements: Day One', points: 20 }),
                ledger({ source: 'correction', points: -5 }),
            ],
        });
        expect(result.engagement.activeDays).toBe(0);
        expect(result.engagement.pointsEarned).toBe(30);
        expect(result.timeline).toHaveLength(4);
    });
    it('does not interpret a teacher outage award as student practice', () => {
        const saved = submission({ content: '{"teacherOverride":"outage"}' });
        const required = quizzes({ submissions: [saved] });
        expect(
            build({
                submissions: [saved],
                quizzes: required,
                progress: [progress({ activityId: 'week4', activity })],
                ledger: [ledger({ source: 'activity', reason: 'Week 4 Quiz|Quiz' })],
            }).engagement.activeDays,
        ).toBe(0);
    });
    it('uses Eastern calendar days rather than UTC and labels the partial week', () => {
        expect(evaluationDay(new Date('2026-10-12T02:00:00Z'))).toBe('2026-10-11');
        const result = build({ responses: [response('2026-10-12T02:00:00Z', true)] });
        expect(result.engagement.weekendDays).toBe(1);
        expect(result.engagement.weeks.at(-1)).toEqual({
            start: '2026-10-12',
            activeDays: 0,
            current: true,
        });
    });
    it('compares first/latest attempts and keeps first-answer review evidence', () => {
        const result = build({
            responses: [
                response('2026-10-08T22:00:00Z', false),
                response('2026-10-10T22:00:00Z', true),
            ],
        });
        expect(result.learning[0]).toMatchObject({
            first: 0,
            latest: 100,
            comparable: true,
            attempts: 2,
            daysBetween: 2,
        });
        expect(result.review[0]).toMatchObject({ correct: 0, total: 1 });
    });
    it('does not compare different question sets as growth or double count duplicate answers', () => {
        const result = build({
            responses: [
                response('2026-10-08T22:00:00Z', false),
                response('2026-10-08T22:00:00Z', false),
                response('2026-10-10T22:00:00Z', true, { questionId: 'q2' }),
            ],
        });
        expect(result.learning[0]).toMatchObject({ comparable: false, attempts: 2, questions: 1 });
    });
});
