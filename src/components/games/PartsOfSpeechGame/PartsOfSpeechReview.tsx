'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Check, MessageCircle } from 'lucide-react';
import { useResolvedLearnerReturnHref } from '@/hooks/useResolvedLearnerReturnHref';
import { REVIEW_LESSONS, WEEKLY_REVIEW_LESSONS, REVIEW_PHASES, reviewSentence, type ReviewCategory, type ReviewItem, type ReviewLessonId, type ReviewLesson } from '@/lib/parts-of-speech-review/content';
import { readReviewProgress, type ReviewAttempt, type ReviewProgress } from '@/lib/parts-of-speech-review/progression';
import styles from './PartsOfSpeechReview.module.css';
import { ReviewCategoryCue, categoryColorClass } from './ReviewCategoryCue';
import { SpeakButton } from './SpeakButton';

type Stage = 'start' | 'bridge' | 'example' | 'question' | 'results';
const primary = styles.primary + ' inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-[#ffffff] hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60';
const secondary = styles.secondary + ' inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 py-3 font-semibold text-text hover:bg-bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

export function ReviewSentence({ item, reveal = false }: { item: ReviewItem; reveal?: boolean }) {
  return <p className="text-xl leading-relaxed text-text sm:text-2xl">{item.before}<mark className={`${styles.target} ${reveal ? `${styles.revealed} ${categoryColorClass(item.answer)}` : ''}`}>{item.target}</mark>{item.after}</p>;
}

export function PartsOfSpeechReview({ activityId, onLibrary }: { activityId: string; onLibrary: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assignedLesson, setAssignedLesson] = useState(() => {
    const raw = searchParams.get('lesson');
    const requested = raw === 'adjectives-articles' ? 'week-4-describing' : raw;
    return WEEKLY_REVIEW_LESSONS.find(lesson => lesson.id === requested)?.id ?? null;
  });
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
    setRevisited(false); setAttemptId(crypto.randomUUID()); setSaveState('idle'); setStage(REVIEW_LESSONS[id].bridge ? 'bridge' : 'example');
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
  const categories = item?.categories ?? lesson.categories;
  const transfer: NonNullable<ReviewLesson['transfer']> = lesson.transfer ?? {
    prompt: 'Say or write your own sentence using the pattern in this example.',
    example: reviewSentence(lesson.examples[0]),
    check: 'Point to the part you practiced and explain its job. You can ask your teacher for help.',
  };
  function lessonButton(id: ReviewLessonId) {
    return <button className={`${secondary} w-full !justify-between gap-3 !text-left`} disabled={hasUnsaved} onClick={() => start(id)}>
      <span>{REVIEW_LESSONS[id].title}</span><span className="shrink-0 text-sm text-text-muted">{progress.lessons[id] ? 'Saved' : 'Start'}</span>
    </button>;
  }
  function weekSection({ id, week, phase }: typeof WEEKLY_REVIEW_LESSONS[number]) {
    const current = REVIEW_LESSONS[id];
    const reviewCount = current.questions.filter(q => q.review).length;
    return <section key={id} className={styles.weekCard} aria-labelledby={`week-${week}-title`}>
      <p className="text-sm font-semibold text-text-muted">Week {week} · About 10–15 minutes</p>
      <h2 id={`week-${week}-title`} className="mt-2 font-display text-2xl">{current.title}</h2>
      <p className="mt-2 text-sm text-text-muted">{phase}</p>
      <div className={styles.cueRow}>{current.categories.map(category => <ReviewCategoryCue key={category} category={category} />)}</div>
      <p className="mt-2 text-text-muted">{reviewCount ? 'Two examples, six focus questions, and two familiar review questions.' : 'Two examples, then eight questions.'}</p>
      {progress.lessons[id] && <p className="mt-3 text-sm font-semibold">Completion saved. Practice again anytime.</p>}
      <button className={`${secondary} mt-4 w-full sm:w-auto`} disabled={hasUnsaved} onClick={() => start(id)}>{progress.lessons[id] ? 'Practice' : 'Start'} Week {week}</button>
    </section>;
  }

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
        <p className="mb-3 text-sm font-semibold text-text-muted">A little each week</p>
        <h1 ref={heading} tabIndex={-1} className={`${styles.heading} font-display text-3xl leading-tight sm:text-4xl`}>Parts of Speech Review</h1>
        <p className="mt-5 text-lg leading-relaxed">Choose the week your teacher assigned. One short lesson is enough for today.</p>
        {loadState === 'loading' && <p role="status" className="mt-5">Checking saved progress…</p>}
        {loadState === 'error' && <p role="alert" className="mt-5">We couldn’t check saved progress. You can still practice. <button className="underline" onClick={() => void load()}>Try loading again</button></p>}
        <div className="mt-6">
          {WEEKLY_REVIEW_LESSONS.filter(lesson => assignedLesson ? lesson.id === assignedLesson : lesson.week <= 4).map(weekSection)}
        </div>
        {assignedLesson && <button className="mt-6 min-h-12 font-semibold underline underline-offset-4" onClick={() => setAssignedLesson(null)}>See all lessons</button>}
        {!assignedLesson && <>
          <details className="mt-6">
            <summary className="min-h-12 cursor-pointer py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Coming up in October</summary>
            <p className="text-sm leading-relaxed text-text-muted">A first pass through sentence roles and describing words. Your teacher can slow down or revisit a lesson.</p>
            <div className="mt-4">{WEEKLY_REVIEW_LESSONS.filter(lesson => lesson.week > 4).map(weekSection)}</div>
          </details>
          <details className="mt-4">
            <summary className="min-h-12 cursor-pointer py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Quick foundation check-in</summary>
            <p className="mb-4 text-sm leading-relaxed text-text-muted">Revisit basic pronouns and a, an, the. This helps you and your teacher decide what to practice. It does not unlock or block other lessons.</p>
            {lessonButton('foundation-check-in')}
          </details>
          <details className="mt-4">
            <summary className="min-h-12 cursor-pointer py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Explore the five phases</summary>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">Choose one lesson with your teacher. You can move between phases and revisit familiar topics. Check-ins help you notice what needs practice; no passing score is required.</p>
            {REVIEW_PHASES.map(phase => <details key={phase.title} className="mt-4 border-t border-border pt-2">
              <summary className="min-h-12 cursor-pointer py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{phase.title}</summary>
              <p className="mb-4 text-sm leading-relaxed text-text-muted">{phase.description}</p>
              <ul className="space-y-3 pb-4">{phase.core.map(id => <li key={id}>{lessonButton(id)}</li>)}</ul>
              <p className="mb-2 text-sm font-semibold">Check-in · Revisit together</p>
              {lessonButton(phase.checkIn)}
              {phase.extra.length > 0 && <details className="my-4">
                <summary className="min-h-12 cursor-pointer py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">More detail for later</summary>
                <ul className="space-y-3">{phase.extra.map(id => <li key={id}>{lessonButton(id)}</li>)}</ul>
              </details>}
            </details>)}
            <div className="mt-6 border-t border-border pt-4">
              <button className="min-h-12 text-sm font-semibold underline underline-offset-4 disabled:opacity-60" disabled={hasUnsaved} onClick={onLibrary}>Original practice library</button>
              <p className="text-sm text-text-muted">The earlier activities and their saved progress.</p>
            </div>
          </details>
        </>}
      </main> : stage === 'bridge' ? <main>
        <p className="mb-3 text-sm font-semibold text-text-muted">From word types to sentence roles</p>
        <h1 ref={heading} tabIndex={-1} className={`${styles.heading} font-display text-2xl sm:text-3xl`}>A word type and a sentence job</h1>
        <div className="mt-7 rounded-2xl border border-border bg-white p-5 dark:bg-[#162b3d] sm:p-7">
          <div className="grid grid-cols-[minmax(0,1fr)_48px] items-center gap-3"><p className="text-xl leading-relaxed">The teacher helps us.</p><SpeakButton text="The teacher helps us." className="!h-[48px] !w-[48px]" /></div>
          <dl className="mt-6 space-y-5">
            <div className={`${styles.bridgeRow} ${categoryColorClass('Noun')}`}><dt className="font-semibold"><ReviewCategoryCue category="Noun" /> <span className="block mt-3">Teacher is a noun.</span></dt><dd className="mt-2 leading-relaxed">Noun tells us what kind of word teacher is. It names a person.</dd></div>
            <div className={`${styles.bridgeRow} ${categoryColorClass('Subject')}`}><dt className="font-semibold"><ReviewCategoryCue category="Subject" /> <span className="block mt-3">The teacher is the subject.</span></dt><dd className="mt-2 leading-relaxed">Subject tells us the job of this part in the sentence: who the sentence is about.</dd></div>
          </dl>
          <p className="mt-5 leading-relaxed">Both labels can be true. In this lesson, look for the subject and the verb.</p>
          <button className={`${primary} mt-6 w-full`} onClick={() => setStage('example')}>See the examples <ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </main> : stage === 'results' ? <main>
        <section className={styles.completion} aria-labelledby="completion-title">
          <div className={styles.completionTitle}><CheckCircle2 className={styles.completionIcon} size={32} aria-hidden="true" /><h1 id="completion-title" ref={heading} tabIndex={-1} className={`${styles.heading} font-display text-3xl`}>Lesson complete</h1></div>
          <p className="mt-3">One lesson is enough for today.</p>
          <p className="mt-4 font-semibold">{lesson.title}</p>
          <div className={styles.score}><strong>{correct} / {lesson.questions.length}</strong><span>correct on this review</span></div>
          <div className={styles.cueRow}>{lesson.categories.map(category => <ReviewCategoryCue key={category} category={category} />)}</div>
          {revisited && <p className="mt-3 text-sm">You revisited the missed words. Your original score stays the same.</p>}
          {saveState === 'saved' && <p role="status" className={styles.saved}><Check size={16} aria-hidden="true" />Your completion is saved.</p>}
        </section>
        <section className={styles.transfer} aria-labelledby="transfer-title">
          <div className={styles.transferTitle}><MessageCircle size={24} aria-hidden="true" /><h2 id="transfer-title" className="font-display text-xl">Your turn: use it</h2></div>
          <p className="mt-3 leading-relaxed">{transfer.prompt}</p>
          <div className={styles.sentenceExample}><span className="block text-xs font-semibold text-text-muted">EXAMPLE</span>{transfer.parts ? transfer.parts.map((part, index) => part.category ? <mark key={index} title={part.category} className={`${styles.target} ${styles.revealed} ${categoryColorClass(part.category)}`}>{part.text}</mark> : <span key={index}>{part.text}</span>) : transfer.example}
            {transfer.parts && <div className={styles.cueRow}>{[...new Set(transfer.parts.flatMap(part => part.category ? [part.category] : []))].map(category => <ReviewCategoryCue key={category} category={category} />)}</div>}
          </div>
          <p className="mt-3 leading-relaxed">{transfer.check}</p>
          <p className="mt-3 text-sm text-text-muted">Say it aloud or write on paper. Ungraded; not saved here.</p>
        </section>
        <div className="mt-7 flex flex-col items-stretch gap-3">
          <button className={primary} onClick={() => setStage('start')}>Finish for today</button>
          {missedQuestions.length > 0 && <button className={secondary} onClick={() => { setMissed(missedQuestions); setIndex(0); setSelection(null); setStage('question'); }}>Review missed questions</button>}
        </div>
      </main> : <main>
        <p className="mb-3 text-sm font-semibold text-text-muted">{stage === 'example' ? `Example ${index + 1} of ${lesson.examples.length}` : `${missed ? 'Practice' : item.review ? 'Familiar review · Question' : 'Question'} ${index + 1} of ${questions.length}`}</p>
        <h1 ref={heading} tabIndex={-1} className={`${styles.heading} font-display text-2xl sm:text-3xl`}>{stage === 'example' ? lesson.title : item.prompt ?? (item.review ? 'Remember this: choose the label for the highlighted part.' : lesson.prompt) ?? 'What is the highlighted word’s job?'}</h1>
        <div className={`${styles.panel} mt-7 rounded-2xl border border-border bg-white p-5 dark:bg-[#162b3d] sm:p-7`}>
          <div className="grid grid-cols-[minmax(0,1fr)_48px] items-center gap-3">
            <ReviewSentence item={item} reveal={stage === 'example' || selection !== null} />
            <SpeakButton key={item.id} text={reviewSentence(item)} className="!h-[48px] !w-[48px]" />
          </div>
          {stage === 'example' ? <div className={`${styles.feedback} ${categoryColorClass(item.answer)}`}><ReviewCategoryCue category={item.answer} /><p className="mt-2 leading-relaxed">{item.explanation}</p></div> : <fieldset className="mt-6">
            <legend className="sr-only">Choose the category for {item.target}</legend>
            <div className={styles.answers}>
              {categories.map(category => <button key={category} type="button" aria-pressed={selection === category} disabled={selection !== null}
                className={`${secondary} ${styles.categoryChoice} ${categoryColorClass(category)} disabled:cursor-default`}
                onClick={() => { if (selection) return; setSelection(category); if (!missed) setAnswers(previous => [...previous, { questionId: item.id, answer: category }]); }}><ReviewCategoryCue category={category} compact /></button>)}
            </div>
          </fieldset>}
          {stage === 'question' && <div aria-live="polite" aria-atomic="true">{selection && <div className={`${styles.feedback} ${categoryColorClass(item.answer)}`}><p className="mb-3 font-semibold">{selection === item.answer ? 'Correct.' : 'Take another look.'}</p><ReviewCategoryCue category={item.answer} /><p className="mt-2 leading-relaxed">{item.explanation}</p></div>}</div>}
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
