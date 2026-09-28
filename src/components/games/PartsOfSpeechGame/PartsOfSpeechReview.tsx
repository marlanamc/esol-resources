'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useResolvedLearnerReturnHref } from '@/hooks/useResolvedLearnerReturnHref';
import { REVIEW_LESSONS, reviewSentence, type ReviewCategory, type ReviewItem, type ReviewLessonId } from '@/lib/parts-of-speech-review/content';
import { readReviewProgress, type ReviewAttempt, type ReviewProgress } from '@/lib/parts-of-speech-review/progression';
import styles from './PartsOfSpeechReview.module.css';
import { SpeakButton } from './SpeakButton';

type Stage = 'start' | 'example' | 'question' | 'results';
const primary = styles.primary + ' inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-[#ffffff] hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60';
const secondary = styles.secondary + ' inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 py-3 font-semibold text-text hover:bg-bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

export function ReviewSentence({ item }: { item: ReviewItem }) {
  return <p className="text-xl leading-relaxed text-text sm:text-2xl">{item.before}<mark className="rounded bg-accent/35 px-1 font-bold text-text underline decoration-2 underline-offset-4">{item.target}</mark>{item.after}</p>;
}

export function PartsOfSpeechReview({ activityId, onLibrary }: { activityId: string; onLibrary: () => void }) {
  const router = useRouter();
  const returnHref = useResolvedLearnerReturnHref({ fallbackHref: '/dashboard' });
  const [stage, setStage] = useState<Stage>('start');
  const [lessonId, setLessonId] = useState<ReviewLessonId>('nouns-verbs');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<ReviewAttempt['answers']>([]);
  const [selection, setSelection] = useState<ReviewCategory | null>(null);
  const [revisited, setRevisited] = useState(false);
  const [missed, setMissed] = useState<ReviewItem[] | null>(null);
  const [attemptId, setAttemptId] = useState('');
  const [progress, setProgress] = useState<ReviewProgress>(() => readReviewProgress(null));
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const pending = useRef<ReviewAttempt | null>(null);
  const saving = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const lesson = REVIEW_LESSONS[lessonId];
  const questions = missed ?? lesson.questions;
  const item = stage === 'example' ? lesson.examples[index] : questions[index];
  const correct = lesson.questions.filter(q => answers.find(a => a.questionId === q.id)?.answer === q.answer).length;
  const missedQuestions = lesson.questions.filter(q => answers.find(a => a.questionId === q.id)?.answer !== q.answer);

  async function load() {
    setLoadState('loading');
    try {
      const response = await fetch(`/api/activity/progress?activityId=${encodeURIComponent(activityId)}`);
      if (!response.ok) throw new Error('load');
      const data = await response.json();
      const category = typeof data.categoryData === 'string' ? JSON.parse(data.categoryData) : data.categoryData;
      setProgress(readReviewProgress(category?._partsOfSpeechReview));
      setLoadState('ready');
    } catch { setLoadState('error'); }
  }
  useEffect(() => { void load(); /* activity identifies this mounted review */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);
  useEffect(() => {
    screen.current?.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, [stage, index, lessonId]);

  async function save(attempt: ReviewAttempt) {
    if (saving.current) return;
    saving.current = true;
    pending.current = attempt;
    setSaveState('saving');
    try {
      const response = await fetch('/api/activity/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, reviewAttempt: attempt }),
      });
      if (!response.ok) throw new Error('save');
      const data = await response.json();
      setProgress(readReviewProgress(data.review));
      setSaveState('saved');
      pending.current = null;
    } catch { setSaveState('error'); }
    finally { saving.current = false; }
  }
  function start(id: ReviewLessonId) {
    setLessonId(id); setIndex(0); setAnswers([]); setSelection(null); setMissed(null);
    setRevisited(false); setAttemptId(crypto.randomUUID()); setSaveState('idle'); setStage('example');
  }
  function nextQuestion() {
    if (!selection) return;
    if (index + 1 < questions.length) { setIndex(index + 1); setSelection(null); return; }
    setStage('results');
    if (missed) setRevisited(true);
    if (!missed) void save({ version: 1, attemptId, lessonId, answers });
    setMissed(null);
  }
  function back() {
    if (stage === 'start') router.push(returnHref);
    else { setStage('start'); setMissed(null); }
  }
  const hasUnsaved = saveState === 'error' || saveState === 'saving';

  return <div ref={screen} className="fixed inset-0 z-20 overflow-y-auto bg-bg text-text">
    <div className="mx-auto max-w-2xl px-5 pb-12 pt-5 sm:px-8 sm:pt-8">
      <header className="mb-8">
        <button type="button" onClick={back} disabled={stage === 'start' && hasUnsaved} className="inline-flex min-h-12 items-center gap-2 rounded-lg text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <ArrowLeft size={18} aria-hidden="true" />{stage === 'start' ? 'Back to activities' : 'Back to review'}
        </button>
      </header>
      {hasUnsaved && <div role="status" className="mb-6 rounded-xl border border-border p-4 text-sm">
        {saveState === 'saving' ? 'Saving your review…' : <>Your review has not been saved. Keep this page open and retry. <button className={`${secondary} mt-2`} onClick={() => pending.current && void save(pending.current)}>Retry saving</button></>}
      </div>}
      {stage === 'start' ? <main>
        <p className="mb-3 text-sm font-semibold text-text-muted">About 10–15 minutes</p>
        <h1 ref={heading} tabIndex={-1} className={`${styles.heading} font-display text-3xl leading-tight sm:text-4xl`}>Parts of Speech Review</h1>
        <p className="mt-5 text-lg leading-relaxed">Refresh what you know about nouns and verbs. Read a sentence, notice one word, and choose its job.</p>
        <p className="mt-3 leading-relaxed text-text-muted">Two examples, then eight questions. Take your time. Every answer comes with an explanation.</p>
        {loadState === 'loading' && <p role="status" className="mt-5">Checking saved progress…</p>}
        {loadState === 'error' && <p role="alert" className="mt-5">We couldn’t check saved progress. You can still practice. <button className="underline" onClick={() => void load()}>Try loading again</button></p>}
        {progress.lessons['nouns-verbs'] && <p className="mt-5 font-semibold">Noun and verb review saved. You can practice again anytime.</p>}
        <button className={`${primary} mt-7 w-full sm:w-auto`} disabled={hasUnsaved} onClick={() => start('nouns-verbs')}>Start review <ArrowRight size={18} aria-hidden="true" /></button>
        {progress.lessons['nouns-verbs'] && <div className="mt-8 border-t border-border pt-6">
          <p className="mb-3 text-sm text-text-muted">Optional next lesson</p>
          <button className={`${secondary} text-left`} disabled={hasUnsaved} onClick={() => start('more-word-jobs')}>Adjectives, pronouns, and articles</button>
          {progress.lessons['more-word-jobs'] && <p className="mt-2 text-sm">Optional lesson saved.</p>}
        </div>}
        <div className="mt-10 border-t border-border pt-5"><button className="min-h-12 text-sm font-semibold underline underline-offset-4 disabled:opacity-60" disabled={hasUnsaved} onClick={onLibrary}>More practice</button><p className="text-sm text-text-muted">Explore the full lesson library.</p></div>
      </main> : stage === 'results' ? <main>
        <h1 ref={heading} tabIndex={-1} className={`${styles.heading} font-display text-3xl`}>{lessonId === 'nouns-verbs' ? 'Review complete' : 'Optional lesson complete'}</h1>
        <p className="mt-4 text-lg">On your review, you identified {correct} of {lesson.questions.length} words correctly.</p>
        {revisited && <p className="mt-3 font-semibold">You revisited the missed words. Your original review score stays the same.</p>}
        <p className="mt-3 leading-relaxed text-text-muted">{missedQuestions.length ? 'Use the explanations to revisit the words you missed. You do not need a perfect score to finish.' : 'You noticed the job each word does in its sentence.'}</p>
        {saveState === 'saved' && <p role="status" className="mt-4 font-semibold">Your completion is saved.</p>}
        <div className="mt-7 flex flex-col items-stretch gap-3">
          {missedQuestions.length > 0 && <button className={primary} onClick={() => { setMissed(missedQuestions); setIndex(0); setSelection(null); setStage('question'); }}>Review missed questions</button>}
          {lessonId === 'nouns-verbs' && <button className={secondary} disabled={hasUnsaved} onClick={() => start('more-word-jobs')}>Optional: adjectives, pronouns, and articles</button>}
          <button className={secondary} onClick={() => setStage('start')}>Finish</button>
        </div>
      </main> : <main>
        <p className="mb-3 text-sm font-semibold text-text-muted">{stage === 'example' ? `Example ${index + 1} of ${lesson.examples.length}` : `${missed ? 'Practice' : 'Question'} ${index + 1} of ${questions.length}`}</p>
        <h1 ref={heading} tabIndex={-1} className={`${styles.heading} font-display text-2xl sm:text-3xl`}>{stage === 'example' ? lesson.title : 'What is the highlighted word’s job?'}</h1>
        <div className="mt-7 rounded-2xl border border-border bg-white p-5 dark:bg-[#162b3d] sm:p-7">
          <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-3">
            <ReviewSentence item={item} />
            <SpeakButton key={item.id} text={reviewSentence(item)} className="!h-12 !w-12" />
          </div>
          {stage === 'example' ? <div className="mt-6 border-t border-border pt-5"><p className="font-semibold">{item.target} → {item.answer}</p><p className="mt-2 leading-relaxed">{item.explanation}</p></div> : <fieldset className="mt-6">
            <legend className="sr-only">Choose the category for {item.target}</legend>
            <div className={`grid gap-3 ${lesson.categories.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
              {lesson.categories.map(category => <button key={category} type="button" aria-pressed={selection === category} disabled={selection !== null}
                className={`${secondary} disabled:cursor-default`}
                onClick={() => { if (selection) return; setSelection(category); if (!missed) setAnswers(previous => [...previous, { questionId: item.id, answer: category }]); }}>{category}</button>)}
            </div>
          </fieldset>}
          {stage === 'question' && <div aria-live="polite" aria-atomic="true">{selection && <div className="mt-6 border-t border-border pt-5"><p className="font-semibold">{selection === item.answer ? 'Correct.' : `“${item.target}” is ${item.answer === 'Article' || item.answer === 'Adjective' ? 'an' : 'a'} ${item.answer.toLowerCase()}.`}</p><p className="mt-2 leading-relaxed">{item.explanation}</p></div>}</div>}
        {(stage === 'example' || selection) && <div className="mt-6 flex justify-end"><button className={`${primary} w-full sm:min-w-36 sm:w-auto`} onClick={() => {
          if (stage === 'question') nextQuestion();
          else if (index + 1 < lesson.examples.length) setIndex(index + 1);
          else { setStage('question'); setIndex(0); }
        }}>{stage === 'example' && index + 1 === lesson.examples.length ? 'Try it' : stage === 'question' && index + 1 === questions.length ? 'See results' : 'Next'} <ArrowRight size={18} aria-hidden="true" /></button></div>}
        </div>
      </main>}
    </div>
  </div>;
}
