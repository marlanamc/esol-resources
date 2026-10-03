'use client';

import { useState } from 'react';
import { getWeeklyQuizSchedule, formatQuizScheduleDate } from '@/lib/weekly-quiz-schedule';
import { useRouter } from 'next/navigation';
import type { WeeklyQuizContent, WeeklyQuizSection, WeeklyQuizSubmission } from '@/types/weekly-quiz';
import { submitWithOutbox } from '@/lib/submissionOutbox';
import { PointsToast } from '@/components/ui/PointsToast';
import { CourseMapReturnButton } from '@/components/navigation/CourseMapReturnButton';

const sections: [WeeklyQuizSection, string, string][] = [
  ['forms', '1. Remember the forms', 'Write only the form requested.'],
  ['apply', '2. Use the verbs', 'Read the whole sentence, then fill in the blank.'],
  ['vocabulary', '3. Choose your words', 'Use the meaning or the situation to help you.'],
  ['grammar', '4. Put it together', 'Apply what you practiced this week.'],
];

export default function WeeklyQuiz({ content, activityId, assignmentId, existingSubmission }: {
  content: WeeklyQuizContent;
  activityId: string;
  assignmentId?: string | null;
  existingSubmission?: { content: unknown; pointsAwarded?: number } | null;
}) {
  const router = useRouter();
  const schedule = getWeeklyQuizSchedule(content.weekNumber);
  const saved = existingSubmission?.content as WeeklyQuizSubmission | undefined;
  const [result, setResult] = useState<WeeklyQuizSubmission | null>(saved?.type === 'weekly-quiz' ? saved : null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState('');
  const [points, setPoints] = useState(existingSubmission?.pointsAwarded ?? 0);
  const [showToast, setShowToast] = useState(false);
  const complete = content.questions.every(q => answers[q.id]?.trim());

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
    <header className="space-y-2">
      <p className="text-sm font-semibold text-text-muted">Week {content.weekNumber} · About {content.estimatedMinutes} minutes · No timer</p>
      <h2 className="font-display text-2xl font-bold text-text">{content.title}</h2>
      <p className="text-text-muted">Focus verbs: {content.focusVerbs.join(', ')}. Try every question—you earn points for completing the quiz, with more for accuracy.</p>
      {schedule && <p className="text-sm text-text-muted">Opens {formatQuizScheduleDate(schedule.opensAt)} · Due {formatQuizScheduleDate(schedule.dueAt)}. Stays open after the due date; you can still finish and earn points.</p>}
      {content.guided && <p className="rounded-xl bg-primary/10 p-3 text-text">Our first quiz is together in class. Follow your teacher, discuss the examples, and submit your own answers. Returning after testing? Ask your teacher to help you start.</p>}
    </header>
    {result ? <section aria-label="Quiz results" className="space-y-4">
      <div role="status" className="rounded-xl border border-border bg-bg-light p-5">
        <h3 className="text-xl font-bold text-text">Weekly quiz complete ✓</h3>
        <p className="text-text">{result.correctCount} of {result.totalQuestions} correct · {result.score}%</p>
        <p className="font-semibold text-primary">{points} points awarded</p>
        <p className="text-sm text-text-muted">Use the explanations to choose one thing to practice next.</p>
      </div>
      {result.results.map(item => {
        const question = content.questions.find(q => q.id === item.id);
        return <div key={item.id} className="border-b border-border pb-4 text-text">
          <p className="font-semibold">{item.correct ? '✓' : 'Try this next:'} {question?.prompt}</p>
          <p>Your answer: {result.answers[item.id]}</p>
          {!item.correct && <p>Answer: {item.expected}</p>}
          <p className="mt-1 text-sm text-text-muted">{item.explanation}</p>
        </div>;
      })}
      <CourseMapReturnButton />
    </section> : <form onSubmit={submit} className="space-y-8">
      {sections.map(([section, title, instructions]) => <section key={section} aria-label={title} className="space-y-5">
        <div className="border-b border-border pb-2"><h3 className="font-display text-xl font-bold text-text">{title}</h3><p className="text-sm text-text-muted">{instructions}</p></div>
        {content.questions.filter(q => q.section === section).map(q => <fieldset key={q.id} disabled={busy || queued} className="space-y-2">
          <legend className="mb-2 font-semibold text-text">{content.questions.indexOf(q) + 1}. {q.prompt}</legend>
          {q.options ? <div className="grid gap-2 sm:grid-cols-2">{q.options.map(option => <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-3 py-2 text-text has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <input type="radio" name={q.id} value={option} required checked={answers[q.id] === option} onChange={() => setAnswers(previous => ({ ...previous, [q.id]: option }))} className="accent-primary" />
            <span>{option}</span>
          </label>)}</div> : <input aria-label={q.prompt} name={q.id} required maxLength={500} autoComplete="off" spellCheck={false} value={answers[q.id] ?? ''} onChange={event => setAnswers(previous => ({ ...previous, [q.id]: event.target.value }))} className="min-h-11 w-full rounded-xl border border-border bg-bg px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-primary" />}
        </fieldset>)}
      </section>)}
      {queued && <p role="status" className="rounded-xl bg-bg-light p-4 text-text">Saved on this device. Your quiz will submit when you reconnect; points and the completion icon appear after it syncs.</p>}
      {error && <p role="alert" className="text-red-700 dark:text-red-300">{error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={!complete || busy || queued} className="min-h-11 rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : queued ? 'Waiting to sync' : 'Submit weekly quiz'}</button>
        <span className="text-sm text-text-muted">{content.questions.filter(q => answers[q.id]?.trim()).length} / {content.questions.length} answered</span>
      </div>
    </form>}
    {showToast && <PointsToast points={points} onComplete={() => setShowToast(false)} />}
  </div>;
}
