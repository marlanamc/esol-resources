'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Flame,
  RotateCcw,
  Timer,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react';
import { PointsToast } from '@/components/ui/PointsToast';
import { CourseMapReturnButton } from '@/components/navigation/CourseMapReturnButton';
import {
  isFormCorrect,
  resolveCorrectV3,
  v3IsSameAsV2,
  type SpeedRoundVerb,
} from '@/types/verb-speed-round';
import { pickRandomVerbs } from '@/data/verb-speed-round-pool';

const VERBS_PER_ROUND = 10;

// Brand colors are not all registered as Tailwind theme tokens (see tailwind.config.ts),
// so we use arbitrary-value classes with the brand hex codes to guarantee they render.
// terracotta #b05740 (primary), sage #6a8d73, gold #e9c46a (CLAUDE.md palette).
const SLOT_THEMES = {
  v2: {
    label: 'V2',
    name: 'Past Tense',
    badgeBg: 'bg-[#6a8d73] border-[#5a7d63] text-white',
    accentText: 'text-[#4a6d53]',
    inputBorder: 'border-[#6a8d73]',
    inputFocus: 'focus:border-[#4a6d53] focus:ring-[#6a8d73]/40',
    inputBg: 'bg-[#f3f7f4]',
    button: 'bg-[#6a8d73] text-white hover:bg-[#5a7d63]',
    softBg: 'bg-[#f3f7f4]',
    softBorder: 'border-[#6a8d73]/40',
    placeholder: 'past tense…',
    prompt: 'Type the past (V2)',
  },
  v3: {
    label: 'V3',
    name: 'Past Participle',
    badgeBg: 'bg-[#e9c46a] border-[#d4a82a] text-[#7a5a10]',
    accentText: 'text-[#9a6e1a]',
    inputBorder: 'border-[#e9c46a]',
    inputFocus: 'focus:border-[#d4a82a] focus:ring-[#e9c46a]/40',
    inputBg: 'bg-[#fcf6e4]',
    button: 'bg-[#e9c46a] text-[#5a4010] hover:bg-[#d4a82a]',
    softBg: 'bg-[#fcf6e4]',
    softBorder: 'border-[#e9c46a]/60',
    placeholder: 'past participle…',
    prompt: 'Type the past participle (V3)',
  },
} as const;

interface Props {
  activityId: string;
}

type Phase = 'intro' | 'playing' | 'results';

interface VerbResult {
  verb: SpeedRoundVerb;
  v2Answer: string;
  v3Answer: string;
  v2Correct: boolean;
  v3Correct: boolean;
}

export function VerbSpeedRoundGame({ activityId }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [verbs, setVerbs] = useState<SpeedRoundVerb[]>([]);
  const [results, setResults] = useState<VerbResult[]>([]);
  const [bestCombo, setBestCombo] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
  const [hasSubmittedProgress, setHasSubmittedProgress] = useState(false);

  const start = useCallback(() => {
    setVerbs(pickRandomVerbs(VERBS_PER_ROUND));
    setResults([]);
    setBestCombo(0);
    setElapsedMs(0);
    setHasSubmittedProgress(false);
    setPhase('playing');
  }, []);

  const handleRoundComplete = useCallback(
    (finalResults: VerbResult[], finalBestCombo: number, finalElapsedMs: number) => {
      setResults(finalResults);
      setBestCombo(finalBestCombo);
      setElapsedMs(finalElapsedMs);
      setPhase('results');
    },
    []
  );

  // Submit progress (and award points) once when results land
  useEffect(() => {
    if (phase !== 'results' || hasSubmittedProgress) return;
    setHasSubmittedProgress(true);

    const totalForms = results.reduce(
      (sum, r) => sum + 1 + (v3IsSameAsV2(r.verb.v3) ? 0 : 1),
      0
    );
    const correctForms = results.reduce(
      (sum, r) => sum + (r.v2Correct ? 1 : 0) + (v3IsSameAsV2(r.verb.v3) ? 0 : r.v3Correct ? 1 : 0),
      0
    );
    const accuracy = totalForms > 0 ? Math.round((correctForms / totalForms) * 100) : 0;

    (async () => {
      try {
        const res = await fetch('/api/activity/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId,
            progress: 100,
            status: 'completed',
            accuracy,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { pointsAwarded?: number };
          if (data.pointsAwarded && data.pointsAwarded > 0) {
            setPointsToast({ points: data.pointsAwarded, key: Date.now() });
          }
        }
      } catch (err) {
        console.error('Failed to save speed round progress', err);
      }
    })();
  }, [phase, hasSubmittedProgress, results, activityId]);

  return (
    <div className="min-h-full bg-bg">
      {pointsToast && (
        <PointsToast
          key={pointsToast.key}
          points={pointsToast.points}
          onComplete={() => setPointsToast(null)}
        />
      )}
      <AnimatePresence mode="wait">
        {phase === 'intro' && <IntroScreen key="intro" onStart={start} />}
        {phase === 'playing' && (
          <PlayingScreen key="playing" verbs={verbs} onComplete={handleRoundComplete} />
        )}
        {phase === 'results' && (
          <ResultsScreen
            key="results"
            results={results}
            bestCombo={bestCombo}
            elapsedMs={elapsedMs}
            onPlayAgain={start}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-10 text-center sm:py-16"
    >
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#b05740]/15 text-[#b05740]">
        <Zap className="h-10 w-10" />
      </span>
      <h1 className="mt-6 text-3xl font-display font-bold text-[var(--color-text)] sm:text-4xl">
        Verb Speed Round
      </h1>
      <p className="mt-3 text-base text-[var(--color-text-muted)]">
        Type the <strong className="text-[#4a6d53]">past (V2)</strong> and{' '}
        <strong className="text-[#9a6e1a]">past participle (V3)</strong> for {VERBS_PER_ROUND}{' '}
        random verbs. Build a combo, beat your time.
      </p>
      <div className="mt-6 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-3">
        <Tip
          tone="sage"
          icon={<span className="font-display text-lg font-bold">V2</span>}
          title="Past tense"
          body="The simple past — e.g. go → went."
        />
        <Tip
          tone="gold"
          icon={<span className="font-display text-lg font-bold">V3</span>}
          title="Past participle"
          body="Used with have/has — e.g. go → gone."
        />
        <Tip
          tone="terracotta"
          icon={<Flame className="h-5 w-5" />}
          title="Build a combo"
          body="Every correct form in a row earns more points."
        />
      </div>
      <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b05740] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-[background-color,transform,box-shadow] hover:scale-[1.02] hover:bg-[#9a4830] hover:shadow-xl sm:w-auto"
        >
          <Zap className="h-5 w-5" />
          Start Round
        </button>
        <CourseMapReturnButton className="w-full sm:w-auto" />
      </div>
    </motion.div>
  );
}

function Tip({
  icon,
  title,
  body,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: 'sage' | 'gold' | 'terracotta';
}) {
  const toneClasses =
    tone === 'sage'
      ? 'border-[#6a8d73] bg-[#e8f0ea] text-[#3a5d43]'
      : tone === 'gold'
      ? 'border-[#d4a82a] bg-[#fcf6e4] text-[#7a5a10]'
      : 'border-[#b05740] bg-[#f5e6e0] text-[#7a3920]';
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClasses}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{body}</p>
    </div>
  );
}

type FormSlot = 'v2' | 'v3';

interface FeedbackState {
  slot: FormSlot;
  correct: boolean;
  expected: string;
}

interface Prompt {
  verbIndex: number;
  verb: SpeedRoundVerb;
  slot: FormSlot;
}

function buildShuffledPrompts(verbs: SpeedRoundVerb[]): Prompt[] {
  const prompts: Prompt[] = [];
  verbs.forEach((verb, verbIndex) => {
    prompts.push({ verbIndex, verb, slot: 'v2' });
    if (!v3IsSameAsV2(verb.v3)) {
      prompts.push({ verbIndex, verb, slot: 'v3' });
    }
  });
  // Fisher–Yates shuffle
  for (let i = prompts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
  }
  return prompts;
}

interface VerbAnswers {
  v2?: { answer: string; correct: boolean };
  v3?: { answer: string; correct: boolean };
}

function PlayingScreen({
  verbs,
  onComplete,
}: {
  verbs: SpeedRoundVerb[];
  onComplete: (results: VerbResult[], bestCombo: number, elapsedMs: number) => void;
}) {
  const prompts = useMemo(() => buildShuffledPrompts(verbs), [verbs]);
  const [promptIndex, setPromptIndex] = useState(0);
  const [input, setInput] = useState('');
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correctForms, setCorrectForms] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [answers, setAnswers] = useState<Record<number, VerbAnswers>>({});
  const startedAtRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [now, setNow] = useState(Date.now());

  // Tick clock for the on-screen timer
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(interval);
  }, []);

  // Refocus input whenever the active prompt changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [promptIndex]);

  const totalForms = prompts.length;
  const current = prompts[promptIndex];

  const finish = useCallback(
    (finalAnswers: Record<number, VerbAnswers>, finalBestCombo: number) => {
      const finalResults: VerbResult[] = verbs.map((verb, verbIndex) => {
        const a = finalAnswers[verbIndex] ?? {};
        const v3Skipped = v3IsSameAsV2(verb.v3);
        return {
          verb,
          v2Answer: a.v2?.answer ?? '',
          v3Answer: a.v3?.answer ?? '',
          v2Correct: a.v2?.correct ?? false,
          v3Correct: v3Skipped ? true : a.v3?.correct ?? false,
        };
      });
      onComplete(finalResults, finalBestCombo, Date.now() - startedAtRef.current);
    },
    [onComplete, verbs]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!current) return;
      const trimmed = input.trim();
      if (!trimmed) return;

      const expected = current.slot === 'v2' ? current.verb.v2 : resolveCorrectV3(current.verb);
      const isCorrect = isFormCorrect(trimmed, expected);

      // Update combo + counters
      let nextBestCombo = bestCombo;
      if (isCorrect) {
        setCorrectForms((c) => c + 1);
        setCombo((prev) => {
          const next = prev + 1;
          nextBestCombo = Math.max(bestCombo, next);
          setBestCombo(nextBestCombo);
          return next;
        });
      } else {
        setCombo(0);
      }

      const nextAnswers: Record<number, VerbAnswers> = {
        ...answers,
        [current.verbIndex]: {
          ...answers[current.verbIndex],
          [current.slot]: { answer: trimmed, correct: isCorrect },
        },
      };
      setAnswers(nextAnswers);

      setFeedback({ slot: current.slot, correct: isCorrect, expected });
      const isLast = promptIndex >= prompts.length - 1;
      window.setTimeout(
        () => {
          setFeedback(null);
          if (isLast) {
            finish(nextAnswers, nextBestCombo);
          } else {
            setPromptIndex((i) => i + 1);
            setInput('');
          }
        },
        isCorrect ? 350 : 900
      );
    },
    [answers, bestCombo, current, finish, input, promptIndex, prompts.length]
  );

  if (!current) return null;

  const slotTheme = SLOT_THEMES[current.slot];
  const elapsedSec = Math.floor((now - startedAtRef.current) / 1000);
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;
  const progressPct = totalForms > 0 ? Math.round((correctForms / totalForms) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto flex max-w-xl flex-col px-4 py-6"
    >
      {/* HUD */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <HudStat
          icon={<Timer className="h-4 w-4" />}
          label="Time"
          value={`${minutes}:${seconds.toString().padStart(2, '0')}`}
        />
        <HudStat
          icon={<Flame className="h-4 w-4" />}
          label="Combo"
          value={combo.toString()}
          highlight={combo >= 3}
        />
        <HudStat
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Correct"
          value={`${correctForms}/${totalForms}`}
        />
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-light)]">
        <motion.div
          className="h-full bg-[#b05740]"
          animate={{ width: `${progressPct}%` }}
          transition={{ type: 'spring', stiffness: 80 }}
        />
      </div>

      {/* Verb card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={promptIndex}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 text-center shadow-xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Prompt {promptIndex + 1} of {prompts.length}
          </p>
          <p className="mt-2 text-5xl font-display font-bold text-[var(--color-text)] sm:text-6xl">
            {current.verb.v1}
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] shadow-sm ${slotTheme.badgeBg}`}
            >
              {slotTheme.label}
              <span className="font-semibold normal-case tracking-normal opacity-90">
                · {slotTheme.name}
              </span>
            </span>
          </div>
          <p className={`mt-3 text-sm font-bold uppercase tracking-wider ${slotTheme.accentText}`}>
            {slotTheme.prompt}
          </p>

          <form onSubmit={handleSubmit} className="mt-5">
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              enterKeyHint="go"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!!feedback}
              className={`w-full rounded-2xl border-[3px] px-4 py-4 text-center font-mono text-2xl outline-none transition-colors focus:ring-4 ${
                feedback
                  ? feedback.correct
                    ? 'border-[#6a8d73] bg-[#e8f0ea] text-[#3a5d43]'
                    : 'border-[#b05740] bg-[#f5e6e0] text-[#7a3920]'
                  : `${slotTheme.inputBorder} ${slotTheme.inputBg} ${slotTheme.inputFocus} text-[var(--color-text)]`
              }`}
              placeholder={slotTheme.placeholder}
            />
            <button
              type="submit"
              disabled={!input.trim() || !!feedback}
              className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold transition-[background-color,transform,box-shadow] sm:w-auto ${
                input.trim() && !feedback
                  ? `${slotTheme.button} shadow-lg hover:scale-[1.02]`
                  : 'cursor-not-allowed bg-[var(--color-bg-light)] text-[var(--color-text-muted)]'
              }`}
            >
              Check
            </button>
          </form>

          {/* Feedback line */}
          <div className="mt-4 h-6">
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  {feedback.correct ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-[#4a6d53]" />
                      <span className="text-[#4a6d53]">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-[#b05740]" />
                      <span className="text-[#b05740]">
                        Answer: <span className="font-mono">{feedback.expected}</span>
                      </span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function HudStat({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-2 text-center shadow-sm transition-colors ${
        highlight
          ? 'border-[#b05740] bg-[#b05740]/10 text-[#b05740]'
          : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)]'
      }`}
    >
      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {icon}
        {label}
      </div>
      <p className="text-lg font-bold leading-tight">{value}</p>
    </div>
  );
}

function ResultsScreen({
  results,
  bestCombo,
  elapsedMs,
  onPlayAgain,
}: {
  results: VerbResult[];
  bestCombo: number;
  elapsedMs: number;
  onPlayAgain: () => void;
}) {
  const totalForms = results.reduce(
    (sum, r) => sum + 1 + (v3IsSameAsV2(r.verb.v3) ? 0 : 1),
    0
  );
  const correctForms = results.reduce(
    (sum, r) => sum + (r.v2Correct ? 1 : 0) + (v3IsSameAsV2(r.verb.v3) ? 0 : r.v3Correct ? 1 : 0),
    0
  );
  const accuracy = totalForms > 0 ? Math.round((correctForms / totalForms) * 100) : 0;
  const isPerfect = accuracy === 100;
  const isExcellent = accuracy >= 90;
  const isGood = accuracy >= 80;
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;

  const grade = isPerfect
    ? { text: 'Perfect Round!', color: 'text-[#b05740]', Icon: Trophy }
    : isExcellent
    ? { text: 'Amazing!', color: 'text-[#4a6d53]', Icon: Zap }
    : isGood
    ? { text: 'Nice Run!', color: 'text-[#9a6e1a]', Icon: CheckCircle2 }
    : { text: 'Keep Practicing', color: 'text-[var(--color-text-muted)]', Icon: RotateCcw };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6"
    >
      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 text-center shadow-xl">
        <div
          className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${
            isPerfect ? 'bg-[#b05740]/10' : isExcellent ? 'bg-[#6a8d73]/10' : 'bg-[#e9c46a]/10'
          }`}
        >
          <grade.Icon className={`h-8 w-8 ${grade.color}`} />
        </div>
        <h2 className={`mt-3 text-4xl font-display font-bold ${grade.color}`}>{accuracy}%</h2>
        <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">{grade.text}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultStat label="Correct" value={`${correctForms}/${totalForms}`} />
          <ResultStat label="Best Combo" value={bestCombo.toString()} highlight={bestCombo >= 5} />
          <ResultStat label="Time" value={`${minutes}:${seconds.toString().padStart(2, '0')}`} />
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5 shadow-lg">
        <h3 className="mb-3 text-lg font-display font-bold text-[#b05740]">Recap</h3>
        <div className="space-y-2">
          {results.map((r, idx) => {
            const v3Needed = !v3IsSameAsV2(r.verb.v3);
            const expectedV3 = resolveCorrectV3(r.verb);
            const allRight = r.v2Correct && (!v3Needed || r.v3Correct);
            return (
              <div
                key={`${r.verb.v1}-${idx}`}
                className="rounded-2xl border p-3"
                style={{
                  borderColor: allRight
                    ? 'var(--tone-grammar-border)'
                    : 'var(--tone-quizzes-border)',
                  backgroundColor: allRight
                    ? 'var(--tone-grammar-surface)'
                    : 'var(--tone-quizzes-surface)',
                }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-base font-bold capitalize text-[var(--color-text)]">
                    {r.verb.v1}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    V2 / V3 should be{' '}
                    <span className="font-mono font-semibold">{r.verb.v2}</span>
                    {v3Needed && (
                      <>
                        {' '}/ <span className="font-mono font-semibold">{expectedV3}</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <ResultCell
                    slot="v2"
                    correct={r.v2Correct}
                    user={r.v2Answer}
                  />
                  {v3Needed ? (
                    <ResultCell
                      slot="v3"
                      correct={r.v3Correct}
                      user={r.v3Answer}
                    />
                  ) : (
                    <div className="flex items-center justify-center rounded-xl border border-[#e9c46a]/30 bg-[#e9c46a]/10 p-2 text-center text-xs font-semibold text-[#9a6e1a]">
                      V3 = V2 (auto)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onPlayAgain}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b05740] px-6 py-3 text-base font-semibold text-white shadow-lg transition-[background-color,transform,box-shadow] hover:scale-[1.02] hover:bg-[#b05740]/90 sm:w-auto"
        >
          <RotateCcw className="h-5 w-5" />
          Play Again
        </button>
        <CourseMapReturnButton className="w-full sm:w-auto" />
      </div>
    </motion.div>
  );
}

function ResultStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-2 text-center ${
        highlight
          ? 'border-[#b05740] bg-[#b05740]/10 text-[#b05740]'
          : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)]'
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="text-lg font-bold leading-tight">{value}</p>
    </div>
  );
}

function ResultCell({
  slot,
  correct,
  user,
}: {
  slot: 'v2' | 'v3';
  correct: boolean;
  user: string;
}) {
  const theme = SLOT_THEMES[slot];
  return (
    <div
      className={`rounded-xl border-2 p-2 ${theme.softBg} ${
        correct ? theme.softBorder : 'border-[#b05740]/50'
      }`}
    >
      <div className="mb-1 flex items-center gap-1">
        {correct ? (
          <CheckCircle2 className={`h-3.5 w-3.5 ${theme.accentText}`} />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-[#b05740]" />
        )}
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${theme.accentText}`}
        >
          {theme.label}
        </span>
      </div>
      <p
        className={`font-mono text-xs ${
          correct
            ? 'font-semibold text-[var(--color-text)]'
            : 'text-[var(--color-text-muted)] line-through'
        }`}
      >
        {user || '—'}
      </p>
    </div>
  );
}

export default VerbSpeedRoundGame;
