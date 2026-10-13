'use client';

import Link from 'next/link';
import styles from './StudentDetailView.module.css';
import { useEffect, useState } from 'react';
import type { RequiredQuiz, StudentEvaluation } from '@/lib/teacher-student-evaluation';

function date(value: string, time = false) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        ...(time ? ({ hour: 'numeric', minute: '2-digit', timeZoneName: 'short' } as const) : {}),
    }).format(new Date(value.length === 10 ? `${value}T12:00:00Z` : value));
}
const statusLabels: Record<RequiredQuiz['status'], string> = {
    completed: 'Completed',
    due: 'Due soon',
    overdue: 'Past due',
    upcoming: 'Not open yet',
};
function QuizRow({ quiz }: { quiz: RequiredQuiz }) {
    return (
        <li className="grid gap-3 border-b border-border py-5 last:border-0 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
                <Link
                    className="font-semibold text-text underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                    href={`/activity/${encodeURIComponent(quiz.id)}`}
                >
                    {quiz.title}
                </Link>
                <p className="mt-1 text-sm text-text-muted">
                    {quiz.status === 'upcoming'
                        ? `Opens ${date(quiz.opensAt, true)}`
                        : `Due ${date(quiz.dueAt, true)}`}
                </p>
                {quiz.submittedAt ? (
                    <p className="mt-1 text-xs text-text-muted">
                        Recorded {date(quiz.submittedAt, true)}
                    </p>
                ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${quiz.status === 'overdue' ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200' : quiz.status === 'completed' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-bg text-text-muted'}`}
                >
                    {statusLabels[quiz.status]}
                </span>
                {quiz.status === 'completed' ? (
                    <div className="text-right text-sm">
                        <p className="font-semibold text-text">
                            {quiz.credit === null ? 'Credit recorded' : `${quiz.credit}% credit`}
                        </p>
                        <p className="text-text-muted">
                            {quiz.accuracy === null
                                ? 'No answer-level score saved'
                                : `${quiz.accuracy}% answer accuracy`}
                        </p>
                        {quiz.adjusted ? (
                            <p className="mt-1 text-xs text-text-muted">Teacher-adjusted credit</p>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </li>
    );
}

/** Rendered separately so the complete view can also be previewed with safe fixtures. */
export function StudentEvaluationContent({ data }: { data: StudentEvaluation }) {
    const [category, setCategory] = useState('All practice');
    const open = data.quizzes.filter((q) => q.status !== 'upcoming');
    const completed = open.filter((q) => q.status === 'completed');
    const overdue = open.filter((q) => q.status === 'overdue');
    const due = open.filter((q) => q.status === 'due');
    const upcoming = data.quizzes.filter((q) => q.status === 'upcoming');
    const rows = data.practice.filter(
        (p) => category === 'All practice' || p.category === category,
    );
    return (
        <div className="space-y-10">
            <section aria-labelledby="quiz-heading">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                            Required work
                        </p>
                        <h2 id="quiz-heading" className="mt-2 text-2xl font-bold text-text">
                            Weekly quizzes
                        </h2>
                        <p className="mt-2 text-sm text-text-muted">
                            Quizzes are required before class. All other activities are optional
                            practice.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold tabular-nums text-text">
                            {completed.length}
                            <span className="text-lg font-normal text-text-muted">
                                {' '}
                                / {open.length}
                            </span>
                        </p>
                        <p className="text-sm text-text-muted">open quizzes completed</p>
                    </div>
                </div>
                <p className="mt-4 text-sm text-text" role="status">
                    {overdue.length
                        ? `${overdue.length} past-due ${overdue.length === 1 ? 'quiz needs' : 'quizzes need'} a reminder.`
                        : due.length
                          ? `${due.length} ${due.length === 1 ? 'quiz is' : 'quizzes are'} open. Next deadline: ${date(due[0].dueAt, true)}.`
                          : open.length
                            ? 'All open quizzes are completed.'
                            : 'No required quizzes are open for this class yet.'}
                </p>
                <ul>
                    {[...overdue, ...due, ...completed.slice().reverse()].map((q) => (
                        <QuizRow key={q.id} quiz={q} />
                    ))}
                </ul>
                {upcoming.length ? (
                    <details className="mt-4 rounded-lg bg-bg px-4 py-3">
                        <summary className="cursor-pointer text-sm font-semibold text-text">
                            Upcoming quizzes ({upcoming.length})
                        </summary>
                        <ul>
                            {upcoming.map((q) => (
                                <QuizRow key={q.id} quiz={q} />
                            ))}
                        </ul>
                    </details>
                ) : null}
            </section>

            <section aria-labelledby="practice-heading">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                            Student choice
                        </p>
                        <h2 id="practice-heading" className="mt-2 text-2xl font-bold text-text">
                            Optional practice
                        </h2>
                        <p className="mt-2 text-sm text-text-muted">
                            Recognize exploration and effort. Unfinished practice is not missing
                            work.
                        </p>
                    </div>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-y-5 border-y border-border py-5 lg:grid-cols-4">
                    {[
                        [data.practice.length, 'Activities explored'],
                        [data.engagement.activeDays, 'Recorded practice days'],
                        [data.engagement.weekendDays, 'Weekend practice days'],
                        [data.student.points, 'Total points balance'],
                    ].map(([value, label]) => (
                        <div key={label} className="pr-4">
                            <dt className="text-sm text-text-muted">{label}</dt>
                            <dd className="mt-1 text-2xl font-bold tabular-nums text-text">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
                    <div>
                        <h3 className="font-semibold text-text">Practice rhythm</h3>
                        <p className="mt-1 text-xs text-text-muted">
                            Recorded days per week, including quizzes. Current week is partial.
                        </p>
                        <div className="mt-4 space-y-3">
                            {data.engagement.weeks.map((w) => (
                                <div
                                    key={w.start}
                                    className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 text-sm"
                                >
                                    <span className="text-text-muted">
                                        {date(w.start)}
                                        {w.current ? ' · now' : ''}
                                    </span>
                                    <div className="h-2 rounded-full bg-bg" aria-hidden="true">
                                        <div
                                            className="h-2 rounded-full bg-primary motion-safe:transition-[width]"
                                            style={{ width: `${(w.activeDays / 7) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-right tabular-nums text-text">
                                        {w.activeDays}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm text-text-muted">
                        <h3 className="font-semibold text-text">What these records tell us</h3>
                        <p className="mt-2">
                            {data.engagement.lastPracticedAt
                                ? `Latest saved practice: ${date(data.engagement.lastPracticedAt, true)}.`
                                : 'No practice recorded in this class period yet.'}
                        </p>
                        <p className="mt-2">
                            Saved actions show participation, not minutes spent or independent
                            mastery. Points recognize effort and may include bonuses or teacher
                            adjustments.
                        </p>
                        <p className="mt-2">
                            {data.engagement.pointsEarned >= 0 ? '+' : ''}
                            {data.engagement.pointsEarned} net points recorded during this class
                            period.
                        </p>
                    </div>
                </div>
                <div
                    className="mt-7 flex flex-wrap gap-2"
                    role="group"
                    aria-label="Filter optional practice"
                >
                    {['All practice', ...data.categories.map((c) => c.category)].map((c) => (
                        <button
                            key={c}
                            type="button"
                            aria-pressed={category === c}
                            onClick={() => setCategory(c)}
                            className={`${styles.control} rounded-full border px-3 py-2 text-sm motion-safe:transition-colors ${category === c ? 'border-primary bg-primary text-white' : 'border-border text-text hover:border-primary'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                {rows.length ? (
                    <ul className="mt-3 divide-y divide-border">
                        {rows.map((p) => (
                            <li
                                key={p.id}
                                className="flex flex-wrap items-center justify-between gap-3 py-4"
                            >
                                <div className="min-w-0">
                                    <Link
                                        href={`/activity/${encodeURIComponent(p.id)}`}
                                        className="font-medium text-text hover:text-primary"
                                    >
                                        {p.title}
                                    </Link>
                                    <p className="mt-1 text-xs text-text-muted">
                                        {p.category} · Last saved {date(p.lastPracticedAt)}
                                    </p>
                                    {p.modes.length ? (
                                        <p className="mt-1 text-sm text-text-muted">
                                            Completed: {p.modes.join(', ')}
                                        </p>
                                    ) : null}
                                </div>
                                <span className="text-sm text-text-muted">
                                    {p.completed
                                        ? 'Completion recorded'
                                        : p.progress > 0
                                          ? `${p.progress}% saved progress`
                                          : 'Explored'}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-5 rounded-lg bg-bg p-5 text-sm text-text-muted">
                        No optional practice recorded here yet. There is no practice requirement to
                        catch up on.
                    </p>
                )}
                <p className="mt-3 text-xs text-text-muted">
                    Progress is the latest saved state; a returning student may retain earlier
                    completions.
                </p>
            </section>

            <section aria-labelledby="learning-heading">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Learning evidence
                </p>
                <h2 id="learning-heading" className="mt-2 text-2xl font-bold text-text">
                    Practice checks & growth
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                    First and latest saved answers on optional guide quizzes. Retrying the same
                    questions shows correction, not necessarily lasting learning.
                </p>
                {data.learning.length ? (
                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-border text-text-muted">
                                <tr>
                                    <th scope="col" className="py-3 pr-4 font-medium">
                                        Practice check
                                    </th>
                                    <th scope="col" className="p-3 font-medium">
                                        First
                                    </th>
                                    <th scope="col" className="p-3 font-medium">
                                        Latest
                                    </th>
                                    <th scope="col" className="p-3 font-medium">
                                        Evidence
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.learning.map((l) => (
                                    <tr key={l.id}>
                                        <th scope="row" className="py-4 pr-4 font-medium text-text">
                                            {l.title}
                                            <span className="mt-1 block text-xs font-normal text-text-muted">
                                                {date(l.lastAttemptAt)} · {l.questions} questions
                                            </span>
                                        </th>
                                        <td className="p-3 tabular-nums text-text">{l.first}%</td>
                                        <td className="p-3 tabular-nums text-text">{l.latest}%</td>
                                        <td className="p-3 text-text-muted">
                                            {l.attempts === 1
                                                ? 'One recorded attempt'
                                                : !l.comparable
                                                  ? 'Question sets differ'
                                                  : `${l.attempts} attempts · ${l.daysBetween ? `${l.daysBetween} days apart` : 'retries within 24h'}`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-5 rounded-lg bg-bg p-5 text-sm text-text-muted">
                        No question-level practice checks recorded in this class period. Quiz credit
                        alone does not establish learning growth.
                    </p>
                )}
                {data.review.length ? (
                    <details className="mt-5 border-y border-border py-4">
                        <summary className="cursor-pointer font-semibold text-text">
                            Possible review topics
                        </summary>
                        <p className="mt-2 text-sm text-text-muted">
                            Based on first saved answers only. Small samples are conversation
                            starters, not a diagnosis.
                        </p>
                        <ul className="mt-3 space-y-2">
                            {data.review.map((r) => (
                                <li key={r.skill} className="flex justify-between gap-4 text-sm">
                                    <span className="capitalize text-text">{r.skill}</span>
                                    <span className="shrink-0 text-text-muted">
                                        {r.correct}/{r.total} correct
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </details>
                ) : null}
            </section>
            <details className="border-t border-border pt-5">
                <summary className="cursor-pointer font-semibold text-text">
                    Recent points & effort record
                </summary>
                <p className="mt-2 text-sm text-text-muted">
                    The latest 30 ledger entries in this class period, including adjustments. These
                    are awards, not counts of games played.
                </p>
                <ul className="mt-4 divide-y divide-border">
                    {data.timeline.map((e) => (
                        <li
                            key={e.id}
                            className="flex items-start justify-between gap-4 py-3 text-sm"
                        >
                            <div>
                                <p className="break-words text-text">
                                    {e.title.replace(/\|/g, ' · ')}
                                </p>
                                <p className="mt-1 text-xs text-text-muted">
                                    {date(e.at, true)} · {e.source || 'Points'}
                                </p>
                            </div>
                            <span className="shrink-0 font-semibold tabular-nums text-text">
                                {e.points > 0 ? '+' : ''}
                                {e.points}
                            </span>
                        </li>
                    ))}
                </ul>
                {!data.timeline.length ? (
                    <p className="mt-3 text-sm text-text-muted">
                        No points recorded in this period.
                    </p>
                ) : null}
            </details>
        </div>
    );
}

export function StudentDetailView({ studentId }: { studentId: string }) {
    const [data, setData] = useState<StudentEvaluation | null>(null);
    const [selection, setSelection] = useState({ studentId, classId: '' });
    const classId = selection.studentId === studentId ? selection.classId : '';
    const [revision, setRevision] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        setData(null);
        const query = classId ? `?classId=${encodeURIComponent(classId)}` : '';
        fetch(`/api/teacher/student-analytics/${encodeURIComponent(studentId)}${query}`, {
            signal: controller.signal,
            cache: 'no-store',
        })
            .then(async (response) => {
                if (!response.ok)
                    throw new Error(
                        response.status === 404
                            ? 'No active class enrollment is available for this student.'
                            : 'Unable to load this evaluation. Please try again.',
                    );
                return response.json() as Promise<StudentEvaluation>;
            })
            .then((result) => {
                if (!controller.signal.aborted) {
                    setData(result);
                    setLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error ? err.message : 'Unable to load this evaluation.',
                    );
                    setLoading(false);
                }
            });
        return () => controller.abort();
    }, [studentId, classId, revision]);
    if (loading)
        return (
            <div role="status" className="py-16 text-center text-text-muted">
                Loading current-class evaluation…
            </div>
        );
    if (error || !data)
        return (
            <div role="alert" className="rounded-lg border border-border p-6">
                <p className="text-text">{error}</p>
                <button
                    type="button"
                    className="mt-4 font-semibold text-primary underline"
                    onClick={() => setRevision((r) => r + 1)}
                >
                    Try again
                </button>
            </div>
        );
    return (
        <div className="rounded-2xl border border-border bg-surface-elevated p-5 sm:p-8">
            <header className="mb-9 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text">
                        {data.student.name || data.student.username}
                    </h1>
                    <p className="mt-1 text-sm text-text-muted">
                        {data.scope.className} · Since {date(data.scope.since)} · Eastern time
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                        Updated {date(data.scope.asOf, true)} · Previous-class quizzes excluded
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {data.classes.length > 1 ? (
                        <label className="text-sm text-text">
                            Class{' '}
                            <select
                                value={data.scope.classId}
                                onChange={(e) =>
                                    setSelection({ studentId, classId: e.target.value })
                                }
                                className="ml-2 rounded border border-border bg-bg p-2"
                            >
                                {data.classes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => setRevision((r) => r + 1)}
                        className={`${styles.control} rounded-lg px-4 py-2`}
                    >
                        Refresh
                    </button>
                </div>
            </header>
            <StudentEvaluationContent key={`${studentId}:${data.scope.classId}`} data={data} />
        </div>
    );
}
