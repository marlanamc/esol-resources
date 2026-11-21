'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PointsToast } from '@/components/ui/PointsToast';
import { useResolvedLearnerReturnHref } from '@/hooks/useResolvedLearnerReturnHref';
import { practiceAttemptKey } from '@/lib/practice-attempt-key';
import {
  checkpointId,
  emptyProgress,
  getLevelRoundMode,
  getStep,
  normalizeProgress,
  toServerRoundMode,
  type PathProgress,
  type PathRoundMode,
  type PathRoundResult,
} from '@/lib/pattern-path/engine';
import { SOUND_PATH_FINAL_ID, getSoundLevel, getSoundWorld, type SoundPathWorldId } from '@/lib/sound-path/levels';
import { getSummary, getUpNext, processRound } from '@/lib/sound-path/progress';
import {
  buildCheckpointRound,
  buildFinalRound,
  buildLevelRound,
  findLevelForQuestion,
  isCorrect,
  type SoundQuestion,
} from '@/lib/sound-path/questions';
import { MapScreen } from './MapScreen';
import { ResultsScreen } from './ResultsScreen';
import { RoundScreen } from './RoundScreen';
import { RuleCardScreen } from './RuleCardScreen';
import { useSpeak } from './useSpeak';

interface SoundPathGameProps {
  activityId: string;
  userRole?: string;
  /** The original -ed Sounds game, linked as extra practice. */
  extraPracticeActivityId?: string;
}

type Selection =
  | { kind: 'level'; levelId: string; mode: 'round1' | 'round2' }
  | { kind: 'checkpoint'; world: SoundPathWorldId }
  | { kind: 'final' };

type Phase = 'loading' | 'map' | 'rule' | 'round' | 'results';

const stepIdFor = (sel: Selection) =>
  sel.kind === 'level' ? sel.levelId : sel.kind === 'checkpoint' ? checkpointId(sel.world) : SOUND_PATH_FINAL_ID;
const modeFor = (sel: Selection): PathRoundMode => (sel.kind === 'level' ? sel.mode : sel.kind);
const titleFor = (sel: Selection) =>
  sel.kind === 'level' ? getSoundLevel(sel.levelId)?.title ?? 'Sound Path' : sel.kind === 'checkpoint' ? `Checkpoint ${getSoundWorld(sel.world).number}` : 'Sound Master';
const tagFor = (sel: Selection) =>
  sel.kind === 'level' ? (sel.mode === 'round1' ? 'Round 1 · Learn' : 'Round 2 · Master') : sel.kind === 'checkpoint' ? 'Checkpoint' : 'Final Challenge';

function bestStreakOf(results: boolean[]): number {
  let best = 0;
  let run = 0;
  for (const r of results) {
    run = r ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

export function SoundPathGame({ activityId, userRole, extraPracticeActivityId }: SoundPathGameProps) {
  const router = useRouter();
  const returnHref = useResolvedLearnerReturnHref({ fallbackHref: '/dashboard' });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { playWord, speakText } = useSpeak();
  const unlockAll = userRole === 'teacher';

  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState<PathProgress>(emptyProgress);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [questions, setQuestions] = useState<SoundQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [roundResult, setRoundResult] = useState<PathRoundResult | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const [toast, setToast] = useState<{ points: number; key: number } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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
      const level = sel.kind === 'level' ? getSoundLevel(sel.levelId) : undefined;
      const qs =
        sel.kind === 'level'
          ? level
            ? buildLevelRound(level, sel.mode, { recentIds })
            : []
          : sel.kind === 'checkpoint'
            ? buildCheckpointRound(sel.world, { recentIds })
            : buildFinalRound({ recentIds });
      setSelection(sel);
      setQuestions(qs);
      setIndex(0);
      setResults([]);
      setChosen(null);
      setRoundResult(null);
      setPointsAwarded(null);
      setPhase('round');
    },
    [progress]
  );

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

  const save = useCallback(
    async (result: PathRoundResult) => {
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

  const handleAnswer = useCallback(
    (answer: string) => {
      const q = questions[index];
      if (!q || chosen !== null) return;
      setChosen(answer);
      setResults((prev) => [...prev, isCorrect(q, answer)]);
    },
    [questions, index, chosen]
  );

  const handleNext = useCallback(() => {
    if (!selection) return;
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setChosen(null);
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
    (q: SoundQuestion) => {
      if (!selection || selection.kind === 'final') return null;
      const level = selection.kind === 'level' ? getSoundLevel(selection.levelId) : findLevelForQuestion(q);
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
      return { label: `Next: ${getSoundLevel(next.levelId)?.title ?? 'level'}`, run: () => open({ kind: 'level', levelId: next.levelId, mode: next.mode }) };
    }
    if (next.kind === 'checkpoint') {
      return { label: `Next: Checkpoint ${getSoundWorld(next.world).number}`, run: () => open({ kind: 'checkpoint', world: next.world }) };
    }
    if (next.kind === 'final') return { label: 'Next: Final Challenge', run: () => open({ kind: 'final' }) };
    return { label: 'Back to the map', run: () => setPhase('map') };
  }, [roundResult, selection, startRound, open]);

  const missed = useMemo(() => questions.filter((_, i) => results[i] === false), [questions, results]);
  const level = selection?.kind === 'level' ? getSoundLevel(selection.levelId) : undefined;

  return (
    <div ref={scrollRef} className="fixed inset-0 overflow-y-auto overscroll-contain bg-bg touch-manipulation" style={{ WebkitOverflowScrolling: 'touch' }}>
      {toast ? <PointsToast key={toast.key} points={toast.points} onComplete={() => setToast(null)} /> : null}

      {saveError ? (
        <div role="status" className="mx-auto mt-3 max-w-3xl rounded-xl border border-error/30 bg-error/10 px-4 py-2 text-center text-sm font-bold text-error">
          {saveError}
        </div>
      ) : null}

      {phase === 'loading' ? (
        <div className="flex min-h-dvh items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" aria-hidden="true" />
            <p className="text-lg font-bold text-text-muted">Loading your path…</p>
          </div>
        </div>
      ) : null}

      {phase === 'map' ? (
        <MapScreen
          progress={progress}
          unlockAll={unlockAll}
          extraPracticeHref={extraPracticeActivityId ? `/activity/${extraPracticeActivityId}` : undefined}
          onBack={() => router.push(returnHref)}
          onPlayLevel={(levelId) => open({ kind: 'level', levelId, mode: getLevelRoundMode(progress, levelId) })}
          onPlayCheckpoint={(world) => open({ kind: 'checkpoint', world })}
          onPlayFinal={() => open({ kind: 'final' })}
        />
      ) : null}

      {phase === 'rule' && level && selection?.kind === 'level' ? (
        <RuleCardScreen level={level} mode={selection.mode} onStart={() => startRound(selection)} onBack={() => setPhase('map')} onPlayWord={playWord} />
      ) : null}

      {phase === 'round' && selection ? (
        <RoundScreen
          title={titleFor(selection)}
          tag={tagFor(selection)}
          questions={questions}
          index={index}
          results={results}
          chosen={chosen}
          rulePanelsFor={rulePanelsFor}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onQuit={() => setPhase('map')}
          playWord={playWord}
          speakText={speakText}
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
          playWord={playWord}
        />
      ) : null}
    </div>
  );
}
