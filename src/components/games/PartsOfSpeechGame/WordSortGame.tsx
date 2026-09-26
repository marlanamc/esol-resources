'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useResolvedLearnerReturnHref } from '@/hooks/useResolvedLearnerReturnHref';
import { SwipeSortExercise } from './exercises/SwipeSortExercise';
import { applyWordSortAttempt, buildWordSortDecks, buildWordSortReview, isWordSortLevelUnlocked, readWordSortProgress } from '@/lib/word-sort/progression';
import { WORD_SORT_GROUPS, WORD_SORT_LABELS, WORD_SORT_LEVELS, WORD_SORT_THRESHOLDS } from '@/lib/word-sort/types';
import type { WordSortAttempt, WordSortConfig, WordSortDeck, WordSortLevel, WordSortProgress } from '@/lib/word-sort/types';
import type { POSAnswerDetail, POSExercise } from '@/types/parts-of-speech';

type Session = { attempt: WordSortAttempt; decks: WordSortDeck[]; index: number };
type Result = { level: WordSortLevel; review: boolean; accuracy: number; passed: boolean; remaining: number };
const buttonStyle = 'flex min-h-11 items-center justify-center rounded-xl border-2 border-solid border-primary px-4 py-2 font-bold text-text';

export function WordSortGame({ activityId, config, title }: { activityId: string; config: WordSortConfig; title: string }) {
  const router = useRouter();
  const returnHref = useResolvedLearnerReturnHref({ fallbackHref: '/dashboard' });
  const [progress, setProgress] = useState<WordSortProgress | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadVersion, setLoadVersion] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState<WordSortAttempt | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [points, setPoints] = useState(0);
  const [gameError, setGameError] = useState('');
  const [confirmExit, setConfirmExit] = useState(false);
  const submitting = useRef(false);
  const answeredDeck = useRef('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const exitDialogRef = useRef<HTMLDialogElement>(null);
  const target = config.target;

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoadError(false);
      try {
        const response = await fetch(`/api/activity/progress?activityId=${encodeURIComponent(activityId)}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load progress');
        const data = await response.json();
        setProgress(readWordSortProgress(data.categoryData, target, data.progress >= 100 || data.status === 'completed'));
      } catch { if (!controller.signal.aborted) setLoadError(true); }
    }
    void load();
    return () => controller.abort();
  }, [activityId, target, loadVersion]);

  const loading = progress === null;
  useEffect(() => { headingRef.current?.focus(); }, [session?.index, session?.attempt.id, result, loading]);
  useEffect(() => {
    if (confirmExit) exitDialogRef.current?.showModal();
    else exitDialogRef.current?.close();
  }, [confirmExit]);
  useEffect(() => {
    if (!pending && !session) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [pending, session]);

  const save = useCallback(async (attempt: WordSortAttempt) => {
    if (submitting.current) return;
    submitting.current = true;
    setSaveState('saving');
    try {
      const response = await fetch('/api/activity/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, wordSortAttempt: attempt }),
      });
      if (!response.ok) throw new Error('Save failed');
      const data = await response.json();
      if (!data.wordSort) throw new Error('Missing saved progress');
      setProgress(readWordSortProgress({ wordSort: data.wordSort }, target));
      setPoints(data.pointsAwarded ?? 0);
      setPending(null);
      setSaveState('saved');
    } catch { setSaveState('error'); }
    finally { submitting.current = false; }
  }, [activityId, target]);

  function start(level: WordSortLevel, review = false) {
    if (!progress || pending || !isWordSortLevelUnlocked(progress, level)) return;
    try {
      const decks = review ? buildWordSortReview(progress.levels[level].pendingReview)
        : buildWordSortDecks(target, level, progress.levels[level].recentCardIds);
      if (!decks.length) return;
      setSession({ attempt: { id: crypto.randomUUID(), level, review, responses: [] }, decks, index: 0 });
      setResult(null); setPoints(0); setSaveState('idle'); setGameError('');
      answeredDeck.current = '';
    } catch { setGameError('This level could not start. Please try again.'); }
  }

  function answer(_correct: boolean, detail?: POSAnswerDetail) {
    if (!session || !progress || !detail?.sortResponses) return;
    const key = `${session.attempt.id}:${session.index}`;
    if (answeredDeck.current === key) return;
    answeredDeck.current = key;
    const deck = session.decks[session.index];
    const attempt: WordSortAttempt = { ...session.attempt, responses: [...session.attempt.responses,
      ...detail.sortResponses.map(response => ({ ...response, leftBucket: deck.leftBucket, rightBucket: deck.rightBucket }))] };
    if (session.index + 1 < session.decks.length) {
      setSession({ ...session, attempt, index: session.index + 1 });
      return;
    }
    try {
      const outcome = applyWordSortAttempt(progress, target, attempt);
      setProgress(outcome.progress);
      setResult({ level: attempt.level, review: attempt.review, accuracy: outcome.accuracy, passed: outcome.passed, remaining: outcome.progress.levels[attempt.level].pendingReview.length });
      setSession(null); setPending(attempt);
      void save(attempt);
    } catch {
      // Keep the attempt visible rather than silently losing learner work.
      setGameError('This attempt could not be scored. Return to levels and try again.');
    }
  }

  const deck = session?.decks[session.index];
  const exercise: POSExercise | null = deck && session ? {
    id: `${session.attempt.id}:${session.index}`, groupId: WORD_SORT_GROUPS[target], patternId: 'word-sort',
    type: 'swipe-sort', prompt: 'Sort each card.', correctAnswer: target, swipeSortData: deck, showPattern: true,
  } : null;
  // After a scored pass, offer the level it just unlocked as the first button.
  const nextLevel = result && result.passed && !result.review ? WORD_SORT_LEVELS[WORD_SORT_LEVELS.indexOf(result.level) + 1] : undefined;
  const recommended = progress ?WORD_SORT_LEVELS.find(level => !progress.levels[level].passed && isWordSortLevelUnlocked(progress, level)) : undefined;

  return <MotionConfig reducedMotion="user">
    <div data-word-sort-game className={`fixed inset-0 bg-bg text-text ${session ? 'overflow-y-auto sm:overflow-y-auto' : 'overflow-y-auto'}`}>
      <div className={`mx-auto flex w-full max-w-4xl flex-col px-3 py-3 sm:px-6 sm:py-8 ${session ? 'h-[100dvh] min-h-[640px] sm:h-auto' : 'min-h-full'}`}>
        <header className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <button type="button" onClick={() => { if (session || pending) setConfirmExit(true); else router.push(returnHref); }}><span className={buttonStyle}>Back</span></button>
          <h1 className="text-right font-display text-lg font-bold sm:text-2xl">{title}</h1>
        </header>
        <dialog ref={exitDialogRef} onCancel={() => setConfirmExit(false)} aria-label="Leave Word Sort?" className="m-auto max-w-md rounded-xl border-2 border-border bg-bg p-4 text-text backdrop:bg-black/50">
          <p>{pending ? 'Your completed attempt has not been saved. Stay here and retry saving to keep it.' : 'Leaving restarts this unfinished attempt. Your earlier progress is saved.'}</p>
          <div className="mt-3 flex gap-3">
            <button autoFocus type="button" onClick={() => setConfirmExit(false)}><span className={buttonStyle}>Stay</span></button>
            <button type="button" onClick={() => router.push(returnHref)}><span className={buttonStyle}>Leave</span></button>
          </div>
        </dialog>
        {!progress && !loadError && <p role="status">Loading your levels…</p>}
        {loadError && <div role="alert"><p>Progress could not be loaded.</p><button type="button" onClick={() => setLoadVersion(value => value + 1)}><span className={buttonStyle}>Try again</span></button></div>}
        {gameError && <p role="alert">{gameError}</p>}
        {session && exercise ? <>
          <h2 ref={headingRef} tabIndex={-1} className="mb-2 shrink-0 text-center font-bold outline-none">
            {WORD_SORT_LABELS[session.attempt.level]}{session.attempt.review ? ' · Practice' : ''} · Deck {session.index + 1} of {session.decks.length}
          </h2>
          <SwipeSortExercise key={exercise.id} exercise={exercise} answered={confirmExit} onAnswer={answer} />
          <button type="button" className="mt-2 shrink-0 self-center" onClick={() => { setSession(null); setGameError(''); }}><span className="inline-block min-h-11 px-3 py-2 text-sm underline">Return to levels (restart this attempt)</span></button>
        </> : progress ? <>
          {result ? <section className="mb-6 rounded-2xl border-2 border-border p-4 sm:p-6">
            <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none">{result.review ? 'Practice complete' : `${WORD_SORT_LABELS[result.level]}: ${result.accuracy}% correct`}</h2>
            <p className="mt-2">{result.review
              ? `${result.remaining} ${result.remaining === 1 ? 'card still needs' : 'cards still need'} practice. Review does not change your score.`
              : result.passed ? result.level === 'words' ? 'Words passed! Your assignment is complete and Sentences is unlocked.' : result.level === 'sentences' ? 'Sentences passed! Challenge is unlocked.' : 'Challenge passed! You have completed all three levels.'
              : `Keep practicing. Get ${WORD_SORT_THRESHOLDS[result.level]}% to pass this level.`}</p>
            <p role="status" className="mt-2 text-sm">{saveState === 'saving' ? 'Saving progress…' : saveState === 'saved' ? `Progress saved.${points ? ` +${points} points` : ''}` : ''}</p>
            {saveState === 'error' && <div role="alert" className="mt-3"><p>Your work is still here, but it has not synced. Retry saving before starting another attempt.</p><button type="button" onClick={() => pending && void save(pending)}><span className={buttonStyle}>Retry save</span></button></div>}
            <div className="mt-4 flex flex-wrap gap-3">
              {nextLevel && <button type="button" disabled={!!pending} onClick={() => start(nextLevel)}><span className={buttonStyle}>Start {WORD_SORT_LABELS[nextLevel]}</span></button>}
              <button type="button" disabled={!!pending} onClick={() => start(result.level)}><span className={buttonStyle}>Play again</span></button>
              {progress.levels[result.level].pendingReview.length > 0 && <button type="button" disabled={!!pending} onClick={() => start(result.level, true)}><span className={buttonStyle}>Practice missed cards</span></button>}
            </div>
          </section> : <>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-display font-bold outline-none">Build your word skills</h2>
            <p className="mb-5 mt-2 text-text-muted">Pass Words to complete this activity. Unlock two optional levels with words in sentences. Tap a box or swipe to sort.</p>
          </>}
          <div className="grid gap-3 sm:grid-cols-3">
            {WORD_SORT_LEVELS.map(level => {
              const unlocked = isWordSortLevelUnlocked(progress, level);
              const entry = progress.levels[level];
              return <section key={level} className="flex flex-col rounded-2xl border-2 border-border p-4">
                <h3 className="text-lg font-bold">{WORD_SORT_LABELS[level]}</h3>
                <p className="mt-1 text-sm text-text-muted">{level === 'words' ? 'Familiar words and category definitions.' : level === 'sentences' ? 'Find the role of a highlighted word.' : 'Closer distinctions and more categories.'}</p>
                <p className="my-3 text-sm">{entry.passed ? 'Passed · ' : ''}{entry.attempts > 0 || entry.bestAccuracy > 0 ? `Best: ${entry.bestAccuracy}%` : `Pass: ${WORD_SORT_THRESHOLDS[level]}%`}</p>
                <button type="button" disabled={!unlocked || !!pending} className="mt-auto disabled:opacity-50" onClick={() => start(level)}><span className={buttonStyle}>{!unlocked ? 'Locked' : recommended === level ? `Start ${WORD_SORT_LABELS[level]} · Next` : `Play ${WORD_SORT_LABELS[level]}`}</span></button>
                {!unlocked && <p className="mt-2 text-sm">Pass {level === 'sentences' ? 'Words' : 'Sentences'} to unlock.</p>}
                {entry.pendingReview.length > 0 && <button disabled={!!pending || !unlocked} type="button" onClick={() => start(level, true)}><span className="mt-2 inline-block min-h-11 py-2 text-sm underline">Practice {entry.pendingReview.length} missed {entry.pendingReview.length === 1 ? 'card' : 'cards'}</span></button>}
              </section>;
            })}
          </div>
        </> : null}
      </div>
    </div>
  </MotionConfig>;
}
