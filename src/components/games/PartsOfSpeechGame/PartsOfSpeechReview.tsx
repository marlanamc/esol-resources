'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Check, ChevronDown, Star, XCircle } from 'lucide-react';
import { useResolvedLearnerReturnHref } from '@/hooks/useResolvedLearnerReturnHref';
import { REVIEW_LESSONS, REVIEW_TOPICS, reviewCorrectAnswer, reviewSentence, reviewWords, type ReviewItem, type ReviewLessonId, type ReviewLesson } from '@/lib/parts-of-speech-review/content';
import { readReviewProgress, type ReviewAttempt, type ReviewProgress } from '@/lib/parts-of-speech-review/progression';
import { WORD_JOBS_LESSON_POINTS } from '@/lib/parts-of-speech-review/rewards';
import styles from './PartsOfSpeechReview.module.css';
import { ReviewCategoryCue, categoryColorClass } from './ReviewCategoryCue';
import { SpeakButton } from './SpeakButton';

type Stage = 'start' | 'bridge' | 'example' | 'round' | 'question' | 'results';
const primary = styles.primary + ' inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';
const secondary = styles.secondary + ' inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

const CORE_ORDER = REVIEW_TOPICS.flatMap(topic => topic.core);

function questionPrompt(item: ReviewItem, lesson: ReviewLesson) {
  if (item.prompt) return item.prompt;
  if (item.kind === 'find') return `Tap the ${item.answer.toLowerCase()}.`;
  if (item.kind === 'choose') return 'Choose the word that fits.';
  return (item.review ? 'Remember this: choose the label for the highlighted part.' : lesson.prompt) ?? 'What is the highlighted word’s job?';
}

export function ReviewSentence({ item, reveal = false }: { item: ReviewItem; reveal?: boolean }) {
  return <p className={styles.sentence}>{item.before}<mark className={`${styles.target} ${reveal ? `${styles.revealed} ${categoryColorClass(item.answer)}` : ''}`}>{item.target}</mark>{item.after}</p>;
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
  // A course map link (?lesson=) opens that week's lesson directly, and Back returns straight to the map.
  const [stage, setStage] = useState<Stage>(() => assignedLesson ? (REVIEW_LESSONS[assignedLesson].bridge ? 'bridge' : 'example') : 'start');
  const [lessonId, setLessonId] = useState<ReviewLessonId>(assignedLesson ?? 'nouns-verbs');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<ReviewAttempt['answers']>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [revisited, setRevisited] = useState(false);
  const [missed, setMissed] = useState<ReviewItem[] | null>(null);
  const [attemptId, setAttemptId] = useState(() => assignedLesson ? crypto.randomUUID() : '');
  const [progress, setProgress] = useState<ReviewProgress>(() => readReviewProgress(null));
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [openTopic, setOpenTopic] = useState<number | null>(null);
  const [extraOpen, setExtraOpen] = useState<Record<number, boolean>>({});
  const pending = useRef<ReviewAttempt | null>(null);
  const saving = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const lesson = REVIEW_LESSONS[lessonId];
  const questions = missed ?? lesson.questions;
  const item = stage === 'example' ? lesson.examples[index] : questions[index];
  const correct = lesson.questions.filter(q => answers.find(a => a.questionId === q.id)?.answer === reviewCorrectAnswer(q)).length;
  const missedQuestions = lesson.questions.filter(q => answers.find(a => a.questionId === q.id)?.answer !== reviewCorrectAnswer(q));
  const kind = item?.kind ?? 'label';
  const correctAnswer = item ? reviewCorrectAnswer(item) : '';
  // Missed-question practice is one flat list, so rounds only apply to the first pass.
  const lessonRounds = missed ? undefined : lesson.rounds;
  const roundStarts = (lessonRounds ?? []).reduce<number[]>((starts, round, i) => [...starts, i ? starts[i - 1] + lessonRounds![i - 1].questions.length : 0], []);
  const roundIndex = lessonRounds ? roundStarts.filter(start => start <= index).length - 1 : -1;
  const round = lessonRounds?.[roundIndex];
  const isCorrect = (q: ReviewItem) => answers.find(a => a.questionId === q.id)?.answer === reviewCorrectAnswer(q);

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
      setPointsAwarded(data.pointsAwarded ?? 0);
      setSaveState('saved');
      pending.current = null;
    } catch { setSaveState('error'); }
    finally { saving.current = false; }
  }
  function start(id: ReviewLessonId) {
    setLessonId(id); setIndex(0); setAnswers([]); setSelection(null); setMissed(null); setPointsAwarded(0);
    setRevisited(false); setAttemptId(crypto.randomUUID()); setSaveState('idle'); setStage(REVIEW_LESSONS[id].bridge ? 'bridge' : 'example');
  }
  function choose(answer: string) {
    if (selection) return;
    setSelection(answer);
    if (!missed) setAnswers(previous => [...previous, { questionId: item.id, answer }]);
    // Answering disables every choice, which would drop focus to the page; carry it to Next instead.
    requestAnimationFrame(() => nextButton.current?.focus());
  }
  function nextQuestion() {
    if (!selection) return;
    if (index + 1 < questions.length) {
      setIndex(index + 1); setSelection(null);
      if (roundStarts.includes(index + 1)) setStage('round');
      return;
    }
    setStage('results');
    if (missed) setRevisited(true);
    if (!missed) void save({ version: 1, attemptId, lessonId, answers });
    setMissed(null);
  }
  function back() {
    if (stage === 'start' || assignedLesson) router.push(returnHref);
    else { setStage('start'); setMissed(null); }
  }
  const hasUnsaved = saveState === 'error' || saveState === 'saving';
  const categories = item?.categories ?? lesson.categories;
  const isSaved = (id: ReviewLessonId) => !!progress.lessons[id];
  const nextLessonId = assignedLesson ?? CORE_ORDER.find(id => !isSaved(id)) ?? CORE_ORDER[0];
  const nextLesson = REVIEW_LESSONS[nextLessonId];
  // Until a student taps a topic, open the one holding their next lesson; -1 means all closed.
  const shownTopic = openTopic ?? Math.max(0, REVIEW_TOPICS.findIndex(topic => [...topic.core, topic.check, ...topic.extra].includes(nextLessonId)));

  const started = Object.keys(progress.lessons).length > 0;
  const nextLabel = stage === 'example' && index + 1 === lesson.examples.length ? 'Try it' : stage === 'question' && index + 1 === questions.length ? 'See results' : stage === 'question' && roundStarts.includes(index + 1) ? 'Next round' : 'Next';
  const progressTrack = (count: number, breaks: number[] = []) => <span className={styles.track} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => <i key={i} data-break={(i > 0 && breaks.includes(i)) || undefined} data-state={i < index || (i === index && selection !== null && stage === 'question') ? 'done' : i === index ? 'current' : undefined} />)}
  </span>;

  return <div ref={screen} className={`${styles.root} fixed inset-0 z-20 overflow-y-auto bg-bg text-text`}>
    <div className="mx-auto max-w-2xl px-5 pb-12 pt-5 sm:px-8 sm:pt-8">
      <header className={styles.topBar}>
        <button type="button" onClick={back} disabled={(stage === 'start' || !!assignedLesson) && hasUnsaved} className={`${styles.back} focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}>
          <ArrowLeft size={18} aria-hidden="true" />{assignedLesson ? 'Back to course map' : stage === 'start' ? 'Back to activities' : 'All lessons'}
        </button>
      </header>
      {hasUnsaved && <div role={saveState === 'error' ? 'alert' : 'status'} className={styles.notice}>
        {saveState === 'saving' ? 'Saving your review…' : <>Your review has not been saved. Keep this page open and retry. <button className={`${secondary} mt-3 w-full`} onClick={() => pending.current && void save(pending.current)}>Retry saving</button></>}
      </div>}
      {stage === 'start' ? <main className={styles.startStack}>
        {loadState === 'loading' && <p role="status" className="text-text-muted">Checking saved progress…</p>}
        {loadState === 'error' && <p role="alert" className={styles.notice}>We couldn’t check saved progress. You can still practice. <button className="min-h-11 font-semibold underline underline-offset-4" onClick={() => void load()}>Try loading again</button></p>}
        <section aria-labelledby="word-jobs-title">
          <h1 id="word-jobs-title" ref={heading} tabIndex={-1} className={`${styles.heading} ${styles.title} font-display`}>Word Jobs</h1>
          <p className={styles.lead}>Every word has a job. Can you find it?</p>
        </section>
        <section className={styles.upNext} aria-labelledby="up-next-title">
          <div className={styles.upNextCues} aria-hidden="true">{nextLesson.categories.map(category => <ReviewCategoryCue key={category} category={category} />)}</div>
          <h2 id="up-next-title" className={`${styles.upNextTitle} font-display`}>{nextLesson.title}</h2>
          <p className={styles.meta}>{assignedLesson ? 'From your teacher' : started ? 'Your next lesson' : 'Start here'} · {nextLesson.questions.length} questions · {WORD_JOBS_LESSON_POINTS} points</p>
          <span className="sr-only">Word jobs in this lesson: {nextLesson.categories.join(', ')}</span>
          <button className={`${primary} ${styles.big} w-full`} disabled={hasUnsaved} onClick={() => start(nextLessonId)}>{isSaved(nextLessonId) ? 'Practice again' : 'Start'} <ArrowRight size={18} aria-hidden="true" /></button>
        </section>
        <section aria-labelledby="all-topics-title">
          <h2 id="all-topics-title" className={`${styles.sectionTitle} font-display`}>All topics</h2>
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
                  {isSaved(id) ? <span className={styles.doneTag}>Done</span> : <ArrowRight size={16} aria-hidden="true" className={styles.rowArrow} />}
                </button>
              </li>;
              return <li key={topic.title} className={styles.topic} data-open={open || undefined}>
                <button type="button" aria-expanded={open} aria-controls={`topic-${topicIndex}-body`} className={`${styles.topicHeader} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary`}
                  onClick={() => setOpenTopic(open ? -1 : topicIndex)}>
                  <span className={`${styles.topicNum} ${numberClass}`} aria-hidden="true">{done === counted.length ? <Check size={20} strokeWidth={3} /> : topicIndex + 1}</span>
                  <span className="min-w-0 text-left">
                    <span className={`${styles.topicTitle} font-display`}>{topic.title}</span>
                    <span className={styles.topicWhat}>{topic.what}</span>
                  </span>
                  <span className={styles.topicCount}>
                    <span><span className="sr-only">Done: </span>{done}/{counted.length}</span>
                    <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />
                  </span>
                  <span className={styles.topicMeter} aria-hidden="true"><i style={{ width: `${(done / counted.length) * 100}%` }} /></span>
                </button>
                {open && <div id={`topic-${topicIndex}-body`} className={styles.topicBody}>
                  <div className={`${styles.miniCue} flex flex-wrap gap-2 pb-1 pt-3`}>{topic.cues.map(category => <ReviewCategoryCue key={category} category={category} />)}</div>
                  <ul className="flex flex-col gap-2">
                    {topic.core.map(id => row(id, REVIEW_LESSONS[id].title))}
                    {row(topic.check, 'Quick check')}
                  </ul>
                  {topic.extra.length > 0 && <>
                    <button type="button" aria-expanded={extra} aria-controls={`topic-${topicIndex}-extra`} className={`${styles.extraToggle} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}
                      onClick={() => setExtraOpen(previous => ({ ...previous, [topicIndex]: !extra }))}>
                      {extra ? 'Hide extra practice' : `Extra practice (${topic.extra.length})`}
                      <ChevronDown size={18} aria-hidden="true" className={styles.chevron} data-open={extra || undefined} />
                    </button>
                    {extra && <ul id={`topic-${topicIndex}-extra`} className="flex flex-col gap-2">{topic.extra.map(id => row(id, REVIEW_LESSONS[id].title, true))}</ul>}
                  </>}
                </div>}
              </li>;
            })}
          </ul>
        </section>
        <footer className={styles.footer}>
          <button className="min-h-11 text-sm font-semibold text-text-muted underline underline-offset-4 disabled:opacity-60" disabled={hasUnsaved} onClick={onLibrary}>Original practice library</button>
        </footer>
      </main> : stage === 'bridge' ? <main>
        <h1 ref={heading} tabIndex={-1} className={`${styles.heading} ${styles.questionTitle} font-display`}>A word type and a sentence job</h1>
        <p className={styles.lead}>From word types to sentence roles.</p>
        <div className={styles.panel}>
          <div className={styles.sentenceRow}><p className={styles.sentence}>The teacher helps us.</p><SpeakButton text="The teacher helps us." size="lg" /></div>
          <dl className="mt-6 space-y-3">
            <div className={`${styles.bridgeRow} ${categoryColorClass('Noun')}`}><dt className="font-semibold"><ReviewCategoryCue category="Noun" /> <span className="block mt-3">Teacher is a noun.</span></dt><dd className="mt-2 leading-relaxed">Noun tells us what kind of word teacher is. It names a person.</dd></div>
            <div className={`${styles.bridgeRow} ${categoryColorClass('Subject')}`}><dt className="font-semibold"><ReviewCategoryCue category="Subject" /> <span className="block mt-3">The teacher is the subject.</span></dt><dd className="mt-2 leading-relaxed">Subject tells us the job of this part in the sentence: who the sentence is about.</dd></div>
          </dl>
          <p className="mt-5 leading-relaxed">Both labels can be true. In this lesson, look for the subject and the verb.</p>
          <button className={`${primary} mt-6 w-full`} onClick={() => setStage('example')}>See the examples <ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </main> : stage === 'round' && round ? <main>
        <section className={styles.roundCard} aria-labelledby="round-title">
          <span className={`${styles.roundBadge} font-display`} aria-hidden="true">{roundIndex + 1}</span>
          <h1 id="round-title" ref={heading} tabIndex={-1} className={`${styles.heading} ${styles.roundTitle} font-display`}><span className="sr-only">Round {roundIndex + 1} of {lessonRounds!.length}: </span>{round.title}</h1>
          <p className={styles.lead}>{round.intro}</p>
          <ol className={styles.roundDots} aria-label="Rounds">
            {lessonRounds!.map((r, i) => <li key={r.kind} className={i < roundIndex ? styles.roundDone : i === roundIndex ? styles.roundCurrent : ''}>
              <span className="sr-only">{r.title}{i < roundIndex ? ', done' : i === roundIndex ? ', now' : ''}</span>
            </li>)}
          </ol>
          {roundIndex > 0 && <p className={styles.roundDoneNote}><Check size={16} aria-hidden="true" />{lessonRounds![roundIndex - 1].title}: {lessonRounds![roundIndex - 1].questions.filter(isCorrect).length} / {lessonRounds![roundIndex - 1].questions.length} correct</p>}
          <p className={styles.meta}>Round {roundIndex + 1} of {lessonRounds!.length} · {round.questions.length} questions</p>
          <button className={`${primary} ${styles.big} w-full`} onClick={() => setStage('question')}>Start round <ArrowRight size={18} aria-hidden="true" /></button>
        </section>
      </main> : stage === 'results' ? <main>
        <section className={styles.completion} aria-labelledby="completion-title">
          <div className={styles.completionTitle}><CheckCircle2 className={styles.completionIcon} size={28} aria-hidden="true" /><h1 id="completion-title" ref={heading} tabIndex={-1} className={`${styles.heading} font-display`}>Lesson complete</h1></div>
          <p className={styles.completionLesson}>{lesson.title}</p>
          <div className={styles.score}><strong className="font-display">{correct}<span>/{lesson.questions.length}</span></strong><span>correct on this review</span></div>
          {saveState === 'saved' && pointsAwarded > 0 && <p className={styles.pointsEarned}><Star size={18} aria-hidden="true" fill="currentColor" />+{pointsAwarded} points</p>}
          {lesson.rounds && <ul className={styles.roundScores}>{lesson.rounds.map(r => {
            const got = r.questions.filter(isCorrect).length;
            return <li key={r.kind}><span>{r.title}</span><span className={styles.roundScoreMeter} aria-hidden="true">{r.questions.map((q, i) => <i key={q.id} data-hit={i < got || undefined} />)}</span><strong>{got} / {r.questions.length}</strong></li>;
          })}</ul>}
          <div className={styles.cueRow}>{lesson.categories.map(category => <ReviewCategoryCue key={category} category={category} />)}</div>
          {revisited && <p className="mt-3 text-sm">You revisited the missed words. Your original score stays the same.</p>}
          {saveState === 'saved' && <p role="status" className={styles.saved}><Check size={16} aria-hidden="true" />Your completion is saved.</p>}
        </section>
        <div className="mt-7 flex flex-col items-stretch gap-3">
          {/* Finish where the student started: the course map for an assigned lesson, otherwise the Word Jobs menu. */}
          <button className={`${primary} ${styles.big}`} disabled={hasUnsaved} onClick={() => assignedLesson ? router.push(returnHref) : setStage('start')}>{assignedLesson ? 'Back to course map' : 'Back to Word Jobs'} <ArrowRight size={18} aria-hidden="true" /></button>
          {missedQuestions.length > 0 && <button className={secondary} onClick={() => { setMissed(missedQuestions); setIndex(0); setSelection(null); setStage('question'); }}>Review missed questions</button>}
        </div>
      </main> : <main>
        <div className={styles.progress}>
          <p className={styles.progressText}>
            {stage === 'example' ? `Example ${index + 1} of ${lesson.examples.length}` : round ? `Round ${roundIndex + 1} · Question ${index - roundStarts[roundIndex] + 1} of ${round.questions.length}` : `${missed ? 'Practice' : 'Question'} ${index + 1} of ${questions.length}`}
            {stage === 'question' && item.review && <span className={styles.reviewTag}>Familiar review</span>}
          </p>
          {stage === 'example' ? progressTrack(lesson.examples.length) : progressTrack(questions.length, roundStarts)}
        </div>
        <h1 ref={heading} tabIndex={-1} className={`${styles.heading} ${styles.questionTitle} font-display`}>{stage === 'example' ? lesson.title : questionPrompt(item, lesson)}</h1>
        <div className={styles.panel} data-answered={(stage === 'question' && selection !== null) || undefined}>
          <div className={styles.sentenceRow}>
            {stage === 'question' && kind === 'find' ? <fieldset>
              <legend className="sr-only">Tap the {item.answer.toLowerCase()} in this sentence</legend>
              <p className={styles.findWords}>{reviewWords(item).map((word, wordIndex) => {
                const value = String(wordIndex);
                const isAnswer = selection !== null && value === correctAnswer;
                return <button key={wordIndex} type="button" aria-pressed={selection === value} disabled={selection !== null}
                  className={`${styles.findWord} ${isAnswer ? `${styles.revealed} ${categoryColorClass(item.answer)}` : ''} ${selection === value && !isAnswer ? styles.findMiss : ''} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}
                  onClick={() => choose(value)}>{word}</button>;
              })}</p>
            </fieldset> : stage === 'question' && kind === 'choose' && selection === null
              ? <p className={styles.sentence}>{item.before}<span className={styles.blank}><span className="sr-only">blank</span></span>{item.after}</p>
              : <ReviewSentence item={item} reveal={stage === 'example' || selection !== null} />}
            {/* A choose sentence read aloud would give away the blank, so it waits for the answer. */}
            {(kind !== 'choose' || stage === 'example' || selection !== null) && <SpeakButton key={item.id} text={reviewSentence(item)} size="lg" />}
          </div>
          {stage === 'example' ? <div className={`${styles.feedback} ${categoryColorClass(item.answer)}`}><ReviewCategoryCue category={item.answer} /><p className="mt-2 leading-relaxed">{item.explanation}</p></div> : kind === 'choose' ? <fieldset className="mt-6">
            <legend className="sr-only">Choose the word for the blank</legend>
            <div className={styles.answers}>
              {(item.options ?? []).map(option => {
                const isAnswer = selection !== null && option === correctAnswer;
                const isWrongPick = selection === option && option !== correctAnswer;
                return <button key={option} type="button" aria-pressed={selection === option} disabled={selection !== null}
                  className={`${secondary} ${styles.choice} ${isAnswer ? styles.correct : ''} ${isWrongPick ? styles.incorrect : ''}`}
                  onClick={() => choose(option)}>{option}
                  {isAnswer && <CheckCircle2 size={18} aria-hidden="true" className={styles.resultIcon} />}
                  {isWrongPick && <XCircle size={18} aria-hidden="true" className={styles.resultIcon} />}
                  {(isAnswer || isWrongPick) && <span className="sr-only">{isAnswer ? ', correct answer' : ', your answer, incorrect'}</span>}
                </button>;
              })}
            </div>
          </fieldset> : kind === 'label' && <fieldset className="mt-6">
            <legend className="sr-only">Choose the category for {item.target}</legend>
            <div className={styles.answers}>
              {categories.map(category => {
                const isAnswer = selection !== null && category === correctAnswer;
                const isWrongPick = selection === category && category !== correctAnswer;
                return <button key={category} type="button" aria-pressed={selection === category} disabled={selection !== null}
                  className={`${secondary} ${styles.categoryChoice} ${categoryColorClass(category)} ${isAnswer ? styles.correct : ''} ${isWrongPick ? styles.incorrect : ''}`}
                  onClick={() => choose(category)}>
                  <ReviewCategoryCue category={category} compact />
                  {isAnswer && <CheckCircle2 size={18} aria-hidden="true" className={styles.resultIcon} />}
                  {isWrongPick && <XCircle size={18} aria-hidden="true" className={styles.resultIcon} />}
                  {(isAnswer || isWrongPick) && <span className="sr-only">{isAnswer ? ', correct answer' : ', your answer, incorrect'}</span>}
                </button>;
              })}
            </div>
          </fieldset>}
          {stage === 'question' && <div aria-live="polite" aria-atomic="true">{selection && <div className={`${styles.feedback} ${categoryColorClass(item.answer)}`}><p className={`${styles.verdict} ${selection === correctAnswer ? styles.correctText : styles.incorrectText}`}>{selection === correctAnswer ? <CheckCircle2 size={22} aria-hidden="true" /> : <XCircle size={22} aria-hidden="true" />}{selection === correctAnswer ? 'Correct!' : 'Take another look.'}</p><ReviewCategoryCue category={item.answer} /><p className="mt-2 leading-relaxed">{item.explanation}</p></div>}</div>}
          {(stage === 'example' || selection) && <div className="mt-6 flex justify-end"><button ref={nextButton} className={`${primary} ${styles.big} w-full sm:min-w-40 sm:w-auto`} onClick={() => {
            if (stage === 'question') nextQuestion();
            else if (index + 1 < lesson.examples.length) setIndex(index + 1);
            else { setStage(lesson.rounds ? 'round' : 'question'); setIndex(0); }
          }}>{nextLabel} <ArrowRight size={18} aria-hidden="true" /></button></div>}
        </div>
      </main>}
    </div>
  </div>;
}
