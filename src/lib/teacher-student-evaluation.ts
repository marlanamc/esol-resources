import { CLASS_TIME_ZONE } from '@/data/school-calendar-2026-27';
import { readWeeklyQuizSchedule } from '@/lib/weekly-quiz-schedule';
export type EvaluationActivity = {
    id: string;
    title: string;
    type: string;
    category: string | null;
};
export type EvaluationProgress = {
    activityId: string;
    assignmentId: string | null;
    progress: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    categoryData: string | null;
    activity: EvaluationActivity;
};
export type EvaluationSubmission = {
    activityId: string;
    assignmentId: string | null;
    score: number | null;
    status: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date | null;
};
export type EvaluationResponse = {
    activityId: string;
    questionId: string;
    isCorrect: boolean;
    skillTag: string | null;
    createdAt: Date;
    activity: EvaluationActivity;
};
export type EvaluationLedger = {
    id: string;
    reason: string | null;
    source: string | null;
    points: number;
    createdAt: Date;
};
export type RequiredQuiz = {
    id: string;
    title: string;
    opensAt: string;
    dueAt: string;
    status: 'upcoming' | 'due' | 'overdue' | 'completed';
    submittedAt: string | null;
    credit: number | null;
    accuracy: number | null;
    adjusted: boolean;
};
function object(content: string | null): Record<string, unknown> {
    try {
        const value: unknown = JSON.parse(content || '{}');
        return value && typeof value === 'object' && !Array.isArray(value)
            ? (value as Record<string, unknown>)
            : {};
    } catch {
        return {};
    }
}
export function evaluationDay(date: Date): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: CLASS_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}
const SKILL_LABELS: Record<string, string> = {
    'be-v1-not-base': 'Choosing am, is, or are',
    'third-person-s': 'He / she / it verb endings',
    'form-verb-ing': 'Forming -ing verbs',
    'have-plus-v3': 'Have + past participle',
    'have-third-person': 'Have and has',
    'meaning-routine-vs-now': 'Routines versus actions happening now',
    'form-am-verb-ing': 'Am / is / are + -ing',
    'hard-vs-hardly': 'Hard versus hardly',
    'state-verb-no-ing': 'State verbs without -ing',
    'form-past-simple': 'Past simple verb forms',
    'meaning-past-background': 'Background actions in past stories',
    'form-past-cont-interruption': 'Interrupted actions in the past',
};
function percent(correct: number, total: number) {
    return total ? Math.round((correct / total) * 100) : null;
}
function within(date: Date, since: Date, now: Date) {
    return date >= since && date <= now;
}
/** Saved teacher credit and answer accuracy deliberately remain separate. */
export function quizEvidence(submission: EvaluationSubmission | undefined) {
    if (!submission) return { credit: null, accuracy: null, adjusted: false };
    const payload = object(submission.content);
    const results = Array.isArray(payload.results)
        ? payload.results.filter(
              (
                  r,
              ): r is {
                  correct: boolean;
              } => !!r && typeof r === 'object' && typeof r.correct === 'boolean',
          )
        : [];
    const accuracy = results.length
        ? percent(results.filter((r) => r.correct).length, results.length)
        : null;
    return {
        credit: submission.score,
        accuracy,
        adjusted:
            !!payload.teacherOverride ||
            (accuracy !== null && submission.score !== null && submission.score !== accuracy),
    };
}
export function buildRequiredQuizzes(input: {
    activities: (EvaluationActivity & {
        content: string;
        deletedAt: Date | null;
    })[];
    submissions: EvaluationSubmission[];
    assignmentIds: string[];
    since: Date;
    now: Date;
}): RequiredQuiz[] {
    const allowed = new Set(input.assignmentIds);
    return input.activities
        .flatMap((activity) => {
            const schedule = readWeeklyQuizSchedule(activity.content);
            // Only current-class map/assignment activities enter this function. Legacy
            // verb-only quizzes and quizzes due before enrollment are not requirements.
            if (!schedule || activity.deletedAt || schedule.dueAt < input.since) return [];
            const submission = input.submissions
                .filter(
                    (row) =>
                        row.activityId === activity.id &&
                        (row.assignmentId === null || allowed.has(row.assignmentId)) &&
                        within(row.completedAt ?? row.updatedAt, input.since, input.now) &&
                        ['submitted', 'graded', 'completed'].includes(row.status),
                )
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
            const status = submission
                ? 'completed'
                : input.now < schedule.opensAt
                  ? 'upcoming'
                  : input.now > schedule.dueAt
                    ? 'overdue'
                    : 'due';
            return [
                {
                    id: activity.id,
                    title: activity.title,
                    opensAt: schedule.opensAt.toISOString(),
                    dueAt: schedule.dueAt.toISOString(),
                    status,
                    submittedAt: submission
                        ? (submission.completedAt ?? submission.updatedAt).toISOString()
                        : null,
                    ...quizEvidence(submission),
                } satisfies RequiredQuiz,
            ];
        })
        .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}
export function isPracticeAward(entry: EvaluationLedger) {
    return (
        (entry.source === 'activity' ||
            entry.source === 'word-rescue' ||
            entry.source === 'award') &&
        !!entry.reason &&
        !/^(Achievements?:|Teacher adjustment:|Correction:)/i.test(entry.reason)
    );
}
function practiceCategory(activity: EvaluationActivity): string {
    const category = (activity.category || '').toLowerCase();
    if (category === 'vocab' || activity.type === 'vocabulary') return 'Vocabulary';
    if (category === 'pronunciation') return 'Listening & pronunciation';
    if (category === 'grammar' || activity.type === 'guide') return 'Grammar';
    if (category === 'numbers' || activity.id === 'numbers-game') return 'Numbers';
    if (category === 'games' || activity.type === 'game') return 'Games';
    return 'Other practice';
}
function completedModes(content: string | null) {
    const state = object(content);
    return [
        ['flashcards', 'Flashcards'],
        ['matching', 'Matching'],
        ['fill-blank', 'Fill in the blank'],
        ['word-list', 'Word list'],
    ]
        .filter(
            ([key]) =>
                (
                    state[key] as
                        | {
                              completed?: boolean;
                          }
                        | undefined
                )?.completed === true,
        )
        .map(([, title]) => title);
}
export function buildStudentEvaluation(input: {
    since: Date;
    now: Date;
    assignmentIds: string[];
    progress: EvaluationProgress[];
    submissions: EvaluationSubmission[];
    responses: EvaluationResponse[];
    ledger: EvaluationLedger[];
    quizzes: RequiredQuiz[];
}) {
    const { since, now } = input;
    const allowed = new Set(input.assignmentIds);
    const scoped = (row: { assignmentId: string | null }) =>
        row.assignmentId === null || allowed.has(row.assignmentId);
    const progress = input.progress.filter((r) => scoped(r) && within(r.updatedAt, since, now));
    const responses = input.responses.filter((r) => within(r.createdAt, since, now));
    const submissions = input.submissions.filter(
        (r) => scoped(r) && within(r.completedAt ?? r.updatedAt, since, now),
    );
    const ledger = input.ledger.filter((r) => within(r.createdAt, since, now));
    const overrideQuizzes = input.quizzes.filter((q) => q.adjusted && q.accuracy === null);
    const overrideIds = new Set(overrideQuizzes.map((q) => q.id));
    const overrides = new Set(overrideQuizzes.map((q) => `${q.title}|Quiz`));
    const practiceAwards = ledger.filter(
        (r) => isPracticeAward(r) && !overrides.has(r.reason || ''),
    );
    // Snapshots cannot reconstruct sessions. Count observed practice days only;
    // automatic rewards and manual recovery entries never create activity days.
    const dates = [
        ...progress
            .filter((r) => !overrideIds.has(r.activityId))
            .flatMap((r) => [r.createdAt, r.updatedAt]),
        ...responses.map((r) => r.createdAt),
        ...submissions
            .filter((r) => !object(r.content).teacherOverride)
            .map((r) => r.completedAt ?? r.updatedAt),
        ...practiceAwards.map((r) => r.createdAt),
    ].filter((d) => within(d, since, now));
    const days = new Set(dates.map(evaluationDay));
    const latest = dates.sort((a, b) => b.getTime() - a.getTime())[0];
    const today = evaluationDay(now);
    const monday = new Date(`${today}T12:00:00Z`);
    monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
    const weeks = Array.from({ length: 4 }, (_, i) => {
        const start = new Date(monday);
        start.setUTCDate(start.getUTCDate() - (3 - i) * 7);
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 7);
        const from = start.toISOString().slice(0, 10),
            to = end.toISOString().slice(0, 10);
        return {
            start: from,
            activeDays: [...days].filter((day) => day >= from && day < to).length,
            current: i === 3,
        };
    });
    const unique = new Map<string, EvaluationProgress>();
    for (const row of progress.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())) {
        if (!unique.has(row.activityId) && row.activity.type !== 'quiz')
            unique.set(row.activityId, row);
    }
    const practice = [...unique.values()].map((r) => ({
        id: r.activityId,
        title: r.activity.title,
        category: practiceCategory(r.activity),
        lastPracticedAt: r.updatedAt.toISOString(),
        progress: Math.max(0, Math.min(100, r.progress)),
        completed: r.status === 'completed' || r.progress >= 100,
        modes: completedModes(r.categoryData),
    }));
    const categories = [...new Set(practice.map((r) => r.category))].sort().map((category) => {
        const rows = practice.filter((r) => r.category === category);
        return {
            category,
            explored: rows.length,
            completed: rows.filter((r) => r.completed).length,
            lastPracticedAt: rows[0].lastPracticedAt,
        };
    });
    const byGuide = new Map<string, EvaluationResponse[]>();
    for (const row of responses) {
        const rows = byGuide.get(row.activityId) ?? [];
        rows.push(row);
        byGuide.set(row.activityId, rows);
    }
    const learning = [...byGuide.entries()]
        .map(([id, rows]) => {
            const attempts = new Map<string, Map<string, boolean>>();
            for (const row of rows) {
                const key = row.createdAt.toISOString();
                const batch = attempts.get(key) ?? new Map();
                batch.set(row.questionId, row.isCorrect);
                attempts.set(key, batch);
            }
            const batches = [...attempts.entries()].sort(([a], [b]) => a.localeCompare(b));
            const first = batches[0],
                last = batches[batches.length - 1];
            const matched = [...first[1].keys()].filter((id) => last[1].has(id));
            const comparable =
                batches.length > 1 &&
                matched.length === first[1].size &&
                matched.length === last[1].size;
            return {
                id,
                title: rows[0].activity.title,
                attempts: batches.length,
                first: percent([...first[1].values()].filter(Boolean).length, first[1].size),
                latest: percent([...last[1].values()].filter(Boolean).length, last[1].size),
                questions: last[1].size,
                comparable,
                lastAttemptAt: last[0],
                daysBetween: Math.floor(
                    (new Date(last[0]).getTime() - new Date(first[0]).getTime()) / 86400000,
                ),
            };
        })
        .sort((a, b) => b.lastAttemptAt.localeCompare(a.lastAttemptAt));
    // First response per question avoids letting repeated practice erase initial difficulty.
    const firstQuestions = new Map<string, EvaluationResponse>();
    for (const row of [...responses].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    )) {
        const key = `${row.activityId}:${row.questionId}`;
        if (!firstQuestions.has(key)) firstQuestions.set(key, row);
    }
    const skills = new Map<
        string,
        {
            correct: number;
            total: number;
        }
    >();
    for (const row of firstQuestions.values()) {
        if (!row.skillTag) continue;
        const skill = skills.get(row.skillTag) ?? { correct: 0, total: 0 };
        skill.total++;
        if (row.isCorrect) skill.correct++;
        skills.set(row.skillTag, skill);
    }
    const review = [...skills.entries()]
        .filter(([, s]) => s.correct < s.total)
        .map(([skill, s]) => ({ skill: SKILL_LABELS[skill] ?? skill.replace(/-/g, ' '), ...s }))
        .sort((a, b) => a.correct / a.total - b.correct / b.total)
        .slice(0, 5);
    const timeline = ledger
        .slice()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 30)
        .map((r) => ({
            id: r.id,
            title: r.reason || 'Points update',
            points: r.points,
            source: r.source,
            at: r.createdAt.toISOString(),
        }));
    return {
        quizzes: input.quizzes,
        practice,
        categories,
        learning,
        review,
        timeline,
        engagement: {
            activeDays: days.size,
            lastPracticedAt: latest?.toISOString() ?? null,
            weeks,
            weekendDays: [...days].filter((day) =>
                [0, 6].includes(new Date(`${day}T12:00:00Z`).getUTCDay()),
            ).length,
            pointsEarned: ledger.reduce((total, row) => total + row.points, 0),
        },
    };
}
export type StudentEvaluation = ReturnType<typeof buildStudentEvaluation> & {
    student: {
        id: string;
        name: string | null;
        username: string;
        points: number;
    };
    scope: {
        classId: string;
        className: string;
        since: string;
        asOf: string;
        timeZone: string;
    };
    classes: {
        id: string;
        name: string;
    }[];
};
