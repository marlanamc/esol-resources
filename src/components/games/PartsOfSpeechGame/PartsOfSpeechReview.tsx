'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Check, ChevronDown, MessageCircle } from 'lucide-react';
import { useResolvedLearnerReturnHref } from '@/hooks/useResolvedLearnerReturnHref';
import { REVIEW_LESSONS, REVIEW_TOPICS, reviewSentence, type ReviewCategory, type ReviewItem, type ReviewLessonId, type ReviewLesson } from '@/lib/parts-of-speech-review/content';
import { readReviewProgress, type ReviewAttempt, type ReviewProgress } from '@/lib/parts-of-speech-review/progression';
import styles from './PartsOfSpeechReview.module.css';
import { ReviewCategoryCue, categoryColorClass } from './ReviewCategoryCue';
import { SpeakButton } from './SpeakButton';

type Stage = 'start' | 'bridge' | 'example' | 'question' | 'results';
const primary = styles.primary + ' inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-[#ffffff] hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60';
const secondary = styles.secondary + ' inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 py-3 font-semibold text-text hover:bg-bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

// Ungraded warm-up on the start screen; nothing here is saved.
const HERO_WORDS: { text: string; category: ReviewCategory }[] = [
  { text: 'The', category: 'Article' }, { text: 'teacher', category: 'Noun' },
  { text: 'helps', category: 'Verb' }, { text: 'us.', category: 'Pronoun' },
];
const CORE_ORDER = REVIEW_TOPICS.flatMap(topic => topic.core);

export function ReviewSentence({ item, reveal = false }: { item: ReviewItem; reveal?: boolean }) {
  return <p className="text-xl leading-relaxed text-text sm:text-2xl">{item.before}<mark className={`${styles.target} ${reveal ? `${styles.revealed} ${categoryColorClass(item.answer)}` : ''}`}>{item.target}</mark>{item.after}</p>;
}

export function PartsOfSpeechReview({ activityId, onLibrary }: { activityId: string; onLibrary: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assignedLesson] = useState(() => {
    const raw = searchParams.get('lesson');
    const requested = raw === 'adjectives-articles' ? 'week-4-describing' : raw;
    return requested && Object.hasOwn(REVIEW_LESSONS, requested) ? requested as ReviewLessonId : null;
  });
  const returnHref = useResolvedLearnerReturnHref({ fallbackHref: '/dashboard' });
  // A course map link (?lesson=) opens that week's lesson directly; Back leads to the Word Jobs start screen.
  const [stage, setStage] = useState<Stage>(() => assignedLesson ? (REVIEW_LESSONS[assignedLesson].bridge ? 'bridge' : 'example') : 'start');
  const [lessonId, setLessonId] = useState<ReviewLessonId>(assignedLesson ?? 'nouns-verbs');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<ReviewAttempt['answers']>([]);
  const [selection, setSelection] = useState<ReviewCategory | null>(null);
  const [revisited, setRevisited] = useState(false);
  const [missed, setMissed] = useState<ReviewItem[] | null>(null);
  const [attemptId, setAttemptId] = useState(() => assignedLesson ? crypto.randomUUID() : '');
  const [progress, setProgress] = useState<ReviewProgress>(() => readReviewProgress(null));
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [openTopic, setOpenTopic] = useState<number | null>(null);
  const [extraOpen, setExtraOpen] = useState<Record<number, boolean>>({});
  const [revealedWords, setRevealedWords] = useState<Record<number, boolean>>({});
  const [lastWord, setLastWord] = useState<number | null>(null);
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
  const isSaved = (id: ReviewLessonId) => !!progress.lessons[id];
  const nextLessonId = assignedLesson ?? CORE_ORDER.find(id => !isSaved(id)) ?? CORE_ORDER[0];
  const nextLesson = REVIEW_LESSONS[nextLessonId];
  // Until a student taps a topic, open the one holding their next lesson; -1 means all closed.
  const shownTopic = openTopic ?? Math.max(0, REVIEW_TOPICS.findIndex(topic => [...topic.core, topic.check, ...topic.extra].includes(nextLessonId)));

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
      {stage === 'start' ? <main className={styles.startStack}>
        {loadState === 'loading' && <p role="status">Checking saved progress…</p>}
        {loadState === 'error' && <p role="alert">We couldn’t check saved progress. You can still practice. <button className="underline" onClick={() => void load()}>Try loading again</button></p>}
        <section aria-labelledby="word-jobs-title">
          <h1 id="word-jobs-title" ref={heading} tabIndex={-1} className={`${styles.heading} font-display text-4xl font-medium leading-[1.1] tracking-[-0.01em] sm:text-[44px]`}>Word Jobs</h1>
          <p className="mt-2 text-lg leading-normal text-text">Every word has a job. Can you find it?</p>
          <div className={`${styles.heroCard} mt-5`}>
            <div className="grid grid-cols-[minmax(0,1fr)_48px] items-start gap-3">
              <div className={styles.heroWords}>
                {HERO_WORDS.map(({ text, category }, wordIndex) => {
                  const shown = !!revealedWords[wordIndex];
                  return <span key={text} className={styles.heroWordWrap}>
                    <button type="button" aria-pressed={shown} aria-label={`${text.replace('.', '')}: tap to see its job`}
                      className={`${styles.heroWord} ${categoryColorClass(category)} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}
                      onClick={() => { setRevealedWords(previous => ({ ...previous, [wordIndex]: !shown })); setLastWord(shown ? null : wordIndex); }}>{text}</button>
                    {shown && <span className={styles.miniCue}><ReviewCategoryCue category={category} /></span>}
                  </span>;
                })}
              </div>
              <SpeakButton text="The teacher helps us." className="!h-[48px] !w-[48px]" />
            </div>
            <p aria-live="polite" className="text-sm font-semibold text-text-muted">
              {lastWord !== null && revealedWords[lastWord] && <span className="sr-only">{HERO_WORDS[lastWord].text.replace('.', '')}: {HERO_WORDS[lastWord].category}. </span>}
              {Object.values(revealedWords).some(Boolean) ? 'Nice. Tap another word.' : 'Tap a word to see its job.'}
            </p>
          </div>
        </section>
        <section className={styles.upNext} aria-labelledby="up-next-title">
          <p className="text-sm font-bold tracking-[0.02em] text-primary">{assignedLesson ? 'From your teacher' : Object.keys(progress.lessons).length ? 'Up next' : 'Start here'}</p>
          <h2 id="up-next-title" className="font-display text-[28px] font-medium leading-[1.2]">{nextLesson.title}</h2>
          <div className="flex flex-wrap gap-2">{nextLesson.categories.map(category => <ReviewCategoryCue key={category} category={category} />)}</div>
          <p className="text-[15px] text-text-muted">{nextLesson.questions.length} questions</p>
          <button className={`${primary} min-h-[52px] w-full text-[17px]`} disabled={hasUnsaved} onClick={() => start(nextLessonId)}>Start <ArrowRight size={18} aria-hidden="true" /></button>
        </section>
        <section aria-labelledby="all-topics-title">
          <h2 id="all-topics-title" className="mb-3 font-display text-2xl font-medium">All topics</h2>
          <ul className="flex flex-col gap-2.5">
            {REVIEW_TOPICS.map((topic, topicIndex) => {
              const counted = [...topic.core, topic.check];
              const done = counted.filter(isSaved).length;
              const open = shownTopic === topicIndex;
              const extra = !!extraOpen[topicIndex];
              const numberClass = done === 0 ? styles.topicNumNone : done === counted.length ? styles.topicNumAll : styles.topicNumSome;
              const row = (id: ReviewLessonId, label: string, dashed = false) => <li key={id}>
                <button type="button" className={`${dashed ? styles.extraRow : styles.lessonRow} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`} disabled={hasUnsaved} onClick={() => start(id)}>
                  <span className={`${styles.statusDot} ${isSaved(id) ? styles.statusDone : ''}`}>{isSaved(id) && <Check size={16} strokeWidth={3} aria-hidden="true" />}</span>
                  <span className="min-w-0">{label}</span>
                  <span className="text-sm font-medium text-text-muted">{isSaved(id) ? 'Done' : ''}</span>
                </button>
              </li>;
              return <li key={topic.title} className={styles.topic}>
                <button type="button" aria-expanded={open} aria-controls={`topic-${topicIndex}-body`} className={`${styles.topicHeader} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary`}
                  onClick={() => setOpenTopic(open ? -1 : topicIndex)}>
                  <span className={`${styles.topicNum} ${numberClass}`} aria-hidden="true">{topicIndex + 1}</span>
                  <span className="min-w-0 text-left">
                    <span className="block font-display text-xl font-medium leading-[1.3]">{topic.title}</span>
                    <span className="block text-sm text-text-muted">{topic.what}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-muted"><span className="sr-only">Done: </span>{done}/{counted.length}</span>
                    <ChevronDown size={20} aria-hidden="true" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {open && <div id={`topic-${topicIndex}-body`} className={styles.topicBody}>
                  <div className={`${styles.miniCue} flex flex-wrap gap-2 pb-1 pt-3`}>{topic.cues.map(category => <ReviewCategoryCue key={category} category={category} />)}</div>
                  <ul className="flex flex-col gap-2.5">
                    {topic.core.map(id => row(id, REVIEW_LESSONS[id].title))}
                    {row(topic.check, 'Quick check')}
                  </ul>
                  {topic.extra.length > 0 && <>
                    <button type="button" aria-expanded={extra} aria-controls={`topic-${topicIndex}-extra`} className={`${styles.extraToggle} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}
                      onClick={() => setExtraOpen(previous => ({ ...previous, [topicIndex]: !extra }))}>
                      {extra ? 'Hide extra practice' : `Extra practice (${topic.extra.length})`}
                      <ChevronDown size={18} aria-hidden="true" className={`transition-transform duration-200 ${extra ? 'rotate-180' : ''}`} />
                    </button>
                    {extra && <ul id={`topic-${topicIndex}-extra`} className="flex flex-col gap-2">{topic.extra.map(id => row(id, REVIEW_LESSONS[id].title, true))}</ul>}
                  </>}
                </div>}
              </li>;
            })}
          </ul>
        </section>
        <footer className="border-t border-border pt-4">
          <button className="min-h-11 text-sm font-semibold text-text-muted underline underline-offset-4 disabled:opacity-60" disabled={hasUnsaved} onClick={onLibrary}>Original practice library</button>
        </footer>
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
