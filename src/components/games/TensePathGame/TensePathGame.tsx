'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PointsToast } from '@/components/ui/PointsToast';
import { useResolvedLearnerReturnHref } from '@/hooks/useResolvedLearnerReturnHref';
import { practiceAttemptKey } from '@/lib/practice-attempt-key';
import {
  TENSE_PATH_FINAL_ID,
  getLevel,
  getWorld,
  type TensePathWorldId,
} from '@/lib/tense-path/levels';
import {
  checkpointId,
  emptyProgress,
  getLevelRoundMode,
  getStep,
  getSummary,
  getUpNext,
  normalizeProgress,
  processRound,
  toServerRoundMode,
  type TensePathProgress,
  type TensePathRoundResult,
} from '@/lib/tense-path/progress';
import {
  buildCheckpointRound,
  buildFinalRound,
  buildLevelRound,
  findLevelForQuestion,
  type TensePathQuestion,
  type TensePathRoundMode,
} from '@/lib/tense-path/questions';
import { MapScreen } from './MapScreen';
import { ResultsScreen } from './ResultsScreen';
import { RoundScreen } from './RoundScreen';
import { RuleCardScreen } from './RuleCardScreen';

interface TensePathGameProps {
  activityId: string;
  userRole?: string;
  /** The original Timeline Tenses game, linked as extra practice. */
  extraPracticeActivityId?: string;
}

type Selection =
  | { kind: 'level'; levelId: string; mode: 'round1' | 'round2' }
  | { kind: 'checkpoint'; world: TensePathWorldId }
  | { kind: 'final' };

type Phase = 'loading' | 'map' | 'rule' | 'round' | 'results';

function stepIdFor(sel: Selection): string {
  if (sel.kind === 'level') return sel.levelId;
  if (sel.kind === 'checkpoint') return checkpointId(sel.world);
  return TENSE_PATH_FINAL_ID;
}

function modeFor(sel: Selection): TensePathRoundMode {
  return sel.kind === 'level' ? sel.mode : sel.kind;
}

function titleFor(sel: Selection): string {
  if (sel.kind === 'level') return getLevel(sel.levelId)?.title ?? 'Tense Path';
  if (sel.kind === 'checkpoint') return `Checkpoint ${getWorld(sel.world).number}`;
  return 'Tense Master';
}

function tagFor(sel: Selection): string {
  if (sel.kind === 'level') return sel.mode === 'round1' ? 'Round 1 · Learn' : 'Round 2 · Master';
  if (sel.kind === 'checkpoint') return 'Checkpoint';
  return 'Final Challenge';
}

function bestStreakOf(results: boolean[]): number {
  let best = 0;
  let run = 0;
  for (const r of results) {
    run = r ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

export function TensePathGame({ activityId, userRole, extraPracticeActivityId }: TensePathGameProps) {
  const router = useRouter();
  const returnHref = useResolvedLearnerReturnHref({ fallbackHref: '/dashboard' });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const unlockAll = userRole === 'teacher';

  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState<TensePathProgress>(emptyProgress);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [questions, setQuestions] = useState<TensePathQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [roundResult, setRoundResult] = useState<TensePathRoundResult | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const [toast, setToast] = useState<{ points: number; key: number } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load saved progress.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/activity/progress?activityId=${encodeURIComponent(activityId)}`);
        const data = res.ok ? ((await res.json()) as { categoryData?: unknown }) : null;
        if (!cancelled) setProgress(normalizeProgress(data?.categoryData));
      } catch {
        if (!cancelled) setSaveError('Your saved progress could not load. You can still play.');
      } finally {
        if (!cancelled) setPhase('map');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activityId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [phase, index]);

  const startRound = useCallback(
    (sel: Selection) => {
      const recentIds = getStep(progress, stepIdFor(sel)).recentIds;
      const qs =
        sel.kind === 'level'
          ? (() => {
              const level = getLevel(sel.levelId);
              return level ? buildLevelRound(level, sel.mode, { recentIds }) : [];
            })()
          : sel.kind === 'checkpoint'
            ? buildCheckpointRound(sel.world, { recentIds })
            : buildFinalRound({ recentIds });
      setSelection(sel);
      setQuestions(qs);
      setIndex(0);
      setResults([]);
      setShowFeedback(false);
      setLastAnswerCorrect(null);
      setRoundResult(null);
      setPointsAwarded(null);
      setPhase('round');
    },
    [progress]
  );

  /** Levels open on their rule card; checkpoints and the final start right away. */
  const open = useCallback(
    (sel: Selection) => {
      if (sel.kind === 'level') {
        setSelection(sel);
        setPhase('rule');
      } else {
        startRound(sel);
      }
    },
    [startRound]
  );

  const openLevel = useCallback(
    (levelId: string) => open({ kind: 'level', levelId, mode: getLevelRoundMode(progress, levelId) }),
    [open, progress]
  );

  const save = useCallback(
    async (result: TensePathRoundResult) => {
      try {
        const summary = getSummary(result.progress);
        const res = await fetch('/api/activity/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': practiceAttemptKey(result) },
          body: JSON.stringify({
            activityId,
            progress: summary.percent,
            status: summary.percent >= 100 ? 'completed' : 'in_progress',
            categoryData: result.progress,
            groupId: result.stepId,
            roundMode: toServerRoundMode(result.mode),
            roundAccuracy: result.accuracy,
            roundExercisesCompleted: result.total,
          }),
        });
        if (!res.ok) throw new Error('save failed');
        const data = (await res.json()) as { pointsAwarded?: number };
        const points = data.pointsAwarded ?? 0;
        setPointsAwarded(points);
        if (points > 0) setToast({ points, key: Date.now() });
      } catch {
        setPointsAwarded(0);
        setSaveError('Progress could not be saved. Check your internet and play again.');
      }
    },
    [activityId]
  );

  const handleSubmit = useCallback(
    (isCorrect: boolean) => {
      if (showFeedback) return;
      setShowFeedback(true);
      setLastAnswerCorrect(isCorrect);
      setResults((prev) => [...prev, isCorrect]);
    },
    [showFeedback]
  );

  const handleNext = useCallback(() => {
    if (!selection) return;
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setShowFeedback(false);
      setLastAnswerCorrect(null);
      return;
    }
    const answers = questions.map((q, i) => ({ questionId: q.id, correct: results[i] === true }));
    const result = processRound(progress, stepIdFor(selection), modeFor(selection), answers);
    setProgress(result.progress);
    setRoundResult(result);
    setPhase('results');
    void save(result);
  }, [index, questions, results, selection, progress, save]);

  const rulePanelsFor = useCallback(
    (q: TensePathQuestion) => {
      if (!selection || selection.kind === 'final') return null;
      const level = selection.kind === 'level' ? getLevel(selection.levelId) : findLevelForQuestion(q);
      return level?.ruleCard.panels ?? null;
    },
    [selection]
  );

  const nextAction = useMemo(() => {
    if (!roundResult || !selection) return null;
    if (!roundResult.passed) return { label: 'Try again', run: () => startRound(selection) };
    if (selection.kind === 'level' && selection.mode === 'round1') {
      return { label: 'Start Round 2', run: () => startRound({ ...selection, mode: 'round2' }) };
    }
    const next = getUpNext(roundResult.progress);
    if (next.kind === 'level') {
      const level = getLevel(next.levelId);
      return { label: `Next: ${level?.title ?? 'level'}`, run: () => open({ kind: 'level', levelId: next.levelId, mode: next.mode }) };
    }
    if (next.kind === 'checkpoint') {
      return { label: `Next: Checkpoint ${getWorld(next.world).number}`, run: () => open({ kind: 'checkpoint', world: next.world }) };
    }
    if (next.kind === 'final') return { label: 'Next: Final Challenge', run: () => open({ kind: 'final' }) };
    return { label: 'Back to the map', run: () => setPhase('map') };
  }, [roundResult, selection, startRound, open]);

  const missed = useMemo(() => questions.filter((_, i) => results[i] === false), [questions, results]);
  const level = selection?.kind === 'level' ? getLevel(selection.levelId) : undefined;

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 overflow-y-auto overscroll-contain bg-bg touch-manipulation"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {toast ? <PointsToast key={toast.key} points={toast.points} onComplete={() => setToast(null)} /> : null}

      {saveError ? (
        <div role="status" className="mx-auto mt-3 max-w-3xl rounded-xl border border-error/30 bg-error/10 px-4 py-2 text-center text-sm font-bold text-error">
          {saveError}
        </div>
      ) : null}

      {phase === 'loading' ? (
        <div className="flex min-h-dvh items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-border border-t-primary" aria-hidden="true" />
            <p className="font-display text-lg text-text-muted">Loading your path…</p>
          </div>
        </div>
      ) : null}

      {phase === 'map' ? (
        <MapScreen
          progress={progress}
          unlockAll={unlockAll}
          extraPracticeHref={extraPracticeActivityId ? `/activity/${extraPracticeActivityId}` : undefined}
          onBack={() => router.push(returnHref)}
          onPlayLevel={openLevel}
          onPlayCheckpoint={(world) => open({ kind: 'checkpoint', world })}
          onPlayFinal={() => open({ kind: 'final' })}
        />
      ) : null}

      {phase === 'rule' && level && selection?.kind === 'level' ? (
        <RuleCardScreen level={level} mode={selection.mode} onStart={() => startRound(selection)} onBack={() => setPhase('map')} />
      ) : null}

      {phase === 'round' && selection ? (
        <RoundScreen
          title={titleFor(selection)}
          tag={tagFor(selection)}
          questions={questions}
          index={index}
          results={results}
          showFeedback={showFeedback}
          lastAnswerCorrect={lastAnswerCorrect}
          rulePanelsFor={rulePanelsFor}
          onSubmit={handleSubmit}
          onNext={handleNext}
          onQuit={() => setPhase('map')}
        />
      ) : null}

      {phase === 'results' && roundResult && selection && nextAction ? (
        <ResultsScreen
          title={`${titleFor(selection)} · ${tagFor(selection)}`}
          result={roundResult}
          missed={missed}
          bestStreak={bestStreakOf(results)}
          pointsAwarded={pointsAwarded}
          primaryLabel={nextAction.label}
          onPrimary={nextAction.run}
          onMap={() => setPhase('map')}
        />
      ) : null}
    </div>
  );
}
