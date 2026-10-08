'use client';

import { useState } from 'react';
import { getWeeklyQuizSchedule } from '@/lib/weekly-quiz-schedule';
import { useRouter } from 'next/navigation';
import type { WeeklyQuizContent, WeeklyQuizQuestion, WeeklyQuizSection, WeeklyQuizSubmission, WeeklyQuizVerbForm } from '@/types/weekly-quiz';
import { submitWithOutbox } from '@/lib/submissionOutbox';
import { displayWeeklyQuizTitle, withVerbFormsTable } from '@/lib/weekly-quiz';
import { PointsToast } from '@/components/ui/PointsToast';
import { CourseMapReturnButton } from '@/components/navigation/CourseMapReturnButton';

// Full class strings so Tailwind can see them; one existing tone per section.
const sections: { key: WeeklyQuizSection; title: string; instructions: string; card: string; badge: string }[] = [
  { key: 'forms', title: 'Verb forms', instructions: 'The base form (V1) is given. Write the other four forms.',
    card: 'border-[var(--tone-quizzes-border)] bg-[var(--tone-quizzes-surface)]', badge: 'bg-[var(--tone-quizzes-chip-bg)] text-[var(--tone-quizzes-chip-text)]' },
  { key: 'apply', title: 'Use the verbs', instructions: 'Read the whole sentence, then fill in the blank.',
    card: 'border-[var(--tone-games-border)] bg-[var(--tone-games-surface)]', badge: 'bg-[var(--tone-games-chip-bg)] text-[var(--tone-games-chip-text)]' },
  { key: 'vocabulary', title: 'Vocabulary', instructions: 'Use the meaning or the situation to help you.',
    card: 'border-[var(--tone-vocabulary-border)] bg-[var(--tone-vocabulary-surface)]', badge: 'bg-[var(--tone-vocabulary-chip-bg)] text-[var(--tone-vocabulary-chip-text)]' },
  { key: 'grammar', title: 'Grammar', instructions: 'Use what you practiced this week.',
    card: 'border-[var(--tone-grammar-border)] bg-[var(--tone-grammar-surface)]', badge: 'bg-[var(--tone-grammar-chip-bg)] text-[var(--tone-grammar-chip-text)]' },
];

const inputClass = 'min-h-11 w-full rounded-xl border border-border bg-bg px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-primary';

const formatDue = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' });

const formColumns: [WeeklyQuizVerbForm, string, string][] = [
  ['v1_3rd', 'V1-s', 'He / She / It'],
  ['v1_ing', 'V-ing', '-ing form'],
  ['v2', 'V2', 'Past'],
  ['v3', 'V3', 'Past participle'],
];

/** Group the forms-table cells by verb, in quiz order. */
function verbRows(questions: WeeklyQuizQuestion[]) {
  const rows = new Map<string, Partial<Record<WeeklyQuizVerbForm, WeeklyQuizQuestion>>>();
  for (const q of questions) {
    if (q.section !== 'forms' || !q.verb || !q.form) continue;
    rows.set(q.verb, { ...rows.get(q.verb), [q.form]: q });
  }
  return [...rows.entries()];
}

function FormsTable({ questions, renderCell }: {
  questions: WeeklyQuizQuestion[];
  renderCell: (q: WeeklyQuizQuestion, label: string) => React.ReactNode;
}) {
  const rows = verbRows(questions);
  return <>
    <div className="hidden overflow-x-auto rounded-xl border border-[var(--tone-quizzes-border)] bg-bg md:block">
      <table className="w-full text-left">
        <thead className="bg-[var(--tone-quizzes-surface-muted)] text-sm text-text">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">V1<span className="block text-xs font-normal text-text-muted">Base form</span></th>
            {formColumns.map(([form, label, hint]) => <th key={form} scope="col" className="px-4 py-3 font-semibold">{label}<span className="block text-xs font-normal text-text-muted">{hint}</span></th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([verb, cells]) => <tr key={verb} className="border-t border-border">
            <th scope="row" className="bg-[var(--tone-quizzes-surface-muted)]/50 px-4 py-3 font-mono text-lg font-semibold text-text">{verb}</th>
            {formColumns.map(([form, label]) => <td key={form} className="px-4 py-3 align-top">{cells[form] && renderCell(cells[form], `${verb}: ${label}`)}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
    <div className="space-y-4 md:hidden">
      {rows.map(([verb, cells]) => <div key={verb} className="space-y-3 rounded-xl border border-[var(--tone-quizzes-border)] bg-bg p-4">
        <p className="text-sm font-semibold text-text-muted">V1 (base form) <span className="ml-1 font-mono text-lg text-text">{verb}</span></p>
        {formColumns.map(([form, label, hint]) => cells[form] && <div key={form}>
          <p className="mb-1 text-sm font-semibold text-text-muted">{label} ({hint})</p>
          {renderCell(cells[form], `${verb}: ${label}`)}
        </div>)}
      </div>)}
    </div>
  </>;
}

export default function WeeklyQuiz({ content: savedContent, activityId, assignmentId, existingSubmission }: {
  content: WeeklyQuizContent;
  activityId: string;
  assignmentId?: string | null;
  existingSubmission?: { content: unknown; pointsAwarded?: number } | null;
}) {
  const router = useRouter();
  const tableContent = withVerbFormsTable(savedContent);
  const schedule = getWeeklyQuizSchedule(savedContent.weekNumber);
  const saved = existingSubmission?.content as WeeklyQuizSubmission | undefined;
  const [result, setResult] = useState<WeeklyQuizSubmission | null>(saved?.type === 'weekly-quiz' ? saved : null);
  // Results saved before the table existed point at the old question ids.
  const content = result && !result.results.every(r => tableContent.questions.some(q => q.id === r.id)) ? savedContent : tableContent;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState('');
  const [points, setPoints] = useState(existingSubmission?.pointsAwarded ?? 0);
  const [showToast, setShowToast] = useState(false);
  const complete = content.questions.every(q => answers[q.id]?.trim());
  // Table cells are not numbered; the sentence questions below it are.
  const numbered = content.questions.filter(q => !(q.section === 'forms' && q.verb));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!complete || busy || queued) return;
    setBusy(true);
    setError('');
    try {
      const sent = await submitWithOutbox({ endpoint: '/api/activity/submit', method: 'POST', payload: {
        activityId, assignmentId: assignmentId ?? null, content: { type: 'weekly-quiz', version: 1, answers },
      } });
      if (sent.queued) { setQueued(true); return; }
      const data = await sent.response.json();
      if (!sent.response.ok) throw new Error(data.error || 'Your quiz could not be saved. Please try again.');
      if (!data.weeklyQuizResult) { router.refresh(); throw new Error('Your submission was received. Refresh this page to see your saved results.'); }
      setResult(data.weeklyQuizResult);
      setPoints(data.totalPointsAwarded ?? data.points ?? 0);
      setShowToast((data.points ?? 0) > 0);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    } finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-3xl space-y-6">
    <header className="space-y-3">
      <h2 className="font-display text-2xl font-bold text-text">{displayWeeklyQuizTitle(content)}</h2>
      <div className="flex flex-wrap gap-2 text-sm font-semibold">
        {schedule && <span className="rounded-full bg-[var(--tone-quizzes-chip-bg)] px-3 py-1 text-[var(--tone-quizzes-chip-text)]">Due {formatDue(schedule.dueAt)}</span>}
      </div>
      {content.guided && <p className="rounded-xl bg-primary/10 p-3 text-text">Our first quiz is together in class. Follow your teacher and submit your own answers.</p>}
    </header>
    {result ? <section aria-label="Quiz results" className="space-y-4">
      <div role="status" className="rounded-2xl border border-[var(--tone-quizzes-border)] bg-[var(--tone-quizzes-surface)] p-5">
        <h3 className="text-xl font-bold text-text">Weekly quiz complete ✓</h3>
        <p className="text-text">{result.correctCount} of {result.totalQuestions} correct · {result.score}%</p>
        <p className="font-semibold text-primary">{points} points awarded</p>
        <p className="text-sm text-text-muted">Use the explanations to choose one thing to practice next.</p>
      </div>
      <FormsTable questions={content.questions} renderCell={q => {
        const item = result.results.find(r => r.id === q.id);
        if (!item) return null;
        return <div className="font-mono text-text">
          <p>{item.correct ? '✓' : '✗'} {result.answers[item.id]}</p>
          {!item.correct && <p className="text-sm text-text-muted">Answer: {item.expected}</p>}
        </div>;
      }} />
      {result.results.map(item => {
        const question = content.questions.find(q => q.id === item.id);
        if (question?.section === 'forms' && question.verb) return null;
        return <div key={item.id} className="rounded-xl border border-border bg-bg p-4 text-text">
          <p className="font-semibold">{item.correct ? '✓' : 'Try this next:'} {question?.prompt}</p>
          <p>Your answer: {result.answers[item.id]}</p>
          {!item.correct && <p>Answer: {item.expected}</p>}
          <p className="mt-1 text-sm text-text-muted">{item.explanation}</p>
        </div>;
      })}
      <CourseMapReturnButton />
    </section> : <form onSubmit={submit} className="space-y-8">
      {sections.filter(({ key }) => content.questions.some(q => q.section === key)).map(({ key: section, title, instructions, card, badge }, index) => <section key={section} aria-label={title} className={`space-y-5 rounded-2xl border p-4 sm:p-6 ${card}`}>
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${badge}`}>{index + 1}</span>
          <div><h3 className="font-display text-xl font-bold text-text">{title}</h3><p className="text-sm text-text-muted">{instructions}</p></div>
        </div>
        {section === 'forms' && <FormsTable questions={content.questions} renderCell={(q, label) => <input aria-label={label} name={q.id} required maxLength={500} autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} disabled={busy || queued} placeholder={q.answers[0].includes('/') ? 'two forms: ___/___' : undefined} value={answers[q.id] ?? ''} onChange={event => setAnswers(previous => ({ ...previous, [q.id]: event.target.value }))} className={`${inputClass} font-mono`} />} />}
        {numbered.filter(q => q.section === section).map(q => <fieldset key={q.id} disabled={busy || queued} className="rounded-xl bg-bg p-4">
          {/* Floated so the prompt sits inside the card instead of straddling the fieldset's top edge. */}
          <legend className="float-left mb-3 w-full font-semibold leading-snug text-text">{numbered.indexOf(q) + 1}. {q.prompt}</legend>
          {q.options ? <div className="clear-left grid gap-2 sm:grid-cols-2">{q.options.map(option => <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border bg-bg px-3 py-2 text-text has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <input type="radio" name={q.id} value={option} required checked={answers[q.id] === option} onChange={() => setAnswers(previous => ({ ...previous, [q.id]: option }))} className="accent-primary" />
            <span>{option}</span>
          </label>)}</div> : <input aria-label={q.prompt} name={q.id} required maxLength={500} autoComplete="off" spellCheck={false} value={answers[q.id] ?? ''} onChange={event => setAnswers(previous => ({ ...previous, [q.id]: event.target.value }))} className={`clear-left ${inputClass}`} />}
        </fieldset>)}
      </section>)}
      {queued && <p role="status" className="rounded-xl bg-bg-light p-4 text-text">Saved on this device. Your quiz will submit when you reconnect; points and the completion icon appear after it syncs.</p>}
      {error && <p role="alert" className="text-red-700 dark:text-red-300">{error}</p>}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-bg-light p-4">
        <button type="submit" disabled={!complete || busy || queued} className="min-h-11 rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : queued ? 'Waiting to sync' : 'Submit weekly quiz'}</button>
        <span className="text-sm text-text-muted">{content.questions.filter(q => answers[q.id]?.trim()).length} / {content.questions.length} answered</span>
      </div>
    </form>}
    {showToast && <PointsToast points={points} onComplete={() => setShowToast(false)} />}
  </div>;
}
