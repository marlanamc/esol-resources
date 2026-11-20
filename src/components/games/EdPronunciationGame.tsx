'use client';

import { resolveAudioUrl } from "@/lib/audio/url";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLiveRegion } from './shared/GameLiveRegion';
import { useModalFocus } from '@/hooks/useModalFocus';
import {
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Target,
  Coins,
  Lightbulb,
  Ear,
  ArrowLeft,
  ArrowLeftRight,
  Info,
  Hand,
  X
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { saveActivityProgress } from '@/lib/activityProgress';
import { PointsToast } from '@/components/ui/PointsToast';
import {
  RETURN_TO_QUERY_PARAM,
  resolveLearnerReturnHrefSync,
  sanitizeInternalHref,
} from '@/lib/learner/navigation';
import { useMapReturnCountdown } from '@/hooks/useMapReturnCountdown';
import { useTheme } from '@/components/layout/ThemeProvider';
import {
  EdVerb,
  EdSound,
  SOUND_RULES,
  getGameRound,
  getMinimalPairs,
  getClapRound,
  getEndingTD,
  hasExtraClap,
} from '@/lib/ed-pronunciation-data';

type GameMode = 'clap-count' | 'sorting' | 'minimal-pairs';
type ClapAnswer = 'clap' | 'no-clap';
type AnswerChoice = EdSound | 'base' | 'past' | ClapAnswer;
type GamePhase = 'menu' | 'playing' | 'feedback' | 'results';
type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

function normalizeGameMode(mode: unknown): GameMode {
  if (mode === 'minimal-pairs' || mode === 'clap-count') return mode;
  return 'sorting';
}

const MODE_LABELS: Record<GameMode, string> = {
  'clap-count': 'Clap Count',
  sorting: 'Sound Sorting',
  'minimal-pairs': 'Minimal Pairs',
};

function pickMinimalPairTarget(): 'base' | 'past' {
  return Math.random() > 0.5 ? 'base' : 'past';
}

interface GameState {
  mode: GameMode;
  phase: GamePhase;
  difficulty: Difficulty;
  verbs: EdVerb[];
  currentIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  answers: Array<{ verb: EdVerb; userAnswer: AnswerChoice; correct: boolean }>;
  selectedAnswer: AnswerChoice | null;
  showFeedback: boolean;
  discoveryPhase: number; // 0-5: no hints, 5-10: pattern hints, 10+: full rules
  pointsToast: { points: number; key: number } | null;
  // For minimal pairs mode
  minimalPairTarget: 'base' | 'past' | null;
  audioPlayed: boolean;
  showInfo: boolean;
}

interface Props {
  contentStr: string;
  activityId?: string;
  assignmentId?: string | null;
}

// Sound button colors. These match the class slides and handout:
// blue /t/, orange /d/, purple /id/.
const SOUND_COLORS: Record<EdSound, { bg: string; hover: string; active: string; text: string }> = {
  t: { bg: 'bg-sky-100', hover: 'hover:bg-sky-200', active: 'bg-sky-500', text: 'text-sky-700' },
  d: { bg: 'bg-amber-100', hover: 'hover:bg-amber-200', active: 'bg-amber-500', text: 'text-amber-800' },
  id: { bg: 'bg-violet-100', hover: 'hover:bg-violet-200', active: 'bg-violet-500', text: 'text-violet-700' },
};

const SOUND_ORDER: EdSound[] = ['t', 'd', 'id'];

/** Teaching feedback for Clap Count mode, in the slides' words. */
function getClapExplanation(verb: EdVerb): string {
  if (hasExtraClap(verb)) {
    const ending = getEndingTD(verb.base);
    return ending
      ? `"${verb.base}" ends in a ${ending} sound, so we add a clap: ${verb.base} · id.`
      : `"${verb.past}" gets an extra clap: /id/.`;
  }
  return verb.sound === 't'
    ? `No extra clap. "${verb.past}" is ${verb.base} + a tiny /t/.`
    : `No extra clap. "${verb.past}" is ${verb.base} + a tiny /d/.`;
}

export default function EdPronunciationGame({ contentStr, activityId, assignmentId }: Props) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const exitGame = () =>
    router.push(
      resolveLearnerReturnHrefSync({ pathname, search: searchParams.toString() })
    );
  const [state, setState] = useState<GameState>({
    mode: 'sorting',
    phase: 'menu',
    difficulty: 'mixed',
    verbs: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    answers: [],
    selectedAnswer: null,
    showFeedback: false,
    discoveryPhase: 0,
    pointsToast: null,
    minimalPairTarget: null,
    audioPlayed: false,
    showInfo: false,
  });

  const [isAudioSupported, setIsAudioSupported] = useState(true);
  const infoModalRef = useRef<HTMLDivElement>(null);
  const infoCloseRef = useRef<HTMLButtonElement>(null);
  useModalFocus(state.showInfo, infoModalRef, {
    onEscape: () => setState(prev => ({ ...prev, showInfo: false })),
    initialFocusRef: infoCloseRef,
  });
  const autoStartedRef = useRef(false);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // On small phones the feedback card can push "Next" below the screen.
  useEffect(() => {
    if (state.showFeedback) {
      nextButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [state.showFeedback]);
  const countdown = useMapReturnCountdown({ active: state.phase === 'results' });
  const isDark = resolvedTheme === 'dark';

  const quickViewColors = {
    t: {
      label: isDark ? '#7dd3fc' : '#075985',
      example: isDark ? '#38bdf8' : '#0369a1',
    },
    d: {
      label: isDark ? '#fcd34d' : '#92400e',
      example: isDark ? '#fbbf24' : '#b45309',
    },
    id: {
      label: isDark ? '#c4b5fd' : '#5b21b6',
      example: isDark ? '#a78bfa' : '#6d28d9',
    },
  } satisfies Record<EdSound, { label: string; example: string }>;

  // Check for Web Speech API support
  useEffect(() => {
    setIsAudioSupported('speechSynthesis' in window);
  }, []);

  // Parse content for custom settings
  useEffect(() => {
    try {
      const content = JSON.parse(contentStr);
      if (content.mode) {
        // "mixed" means learners pick a mode in the menu; course-map auto-start uses sorting.
        setState(prev => ({ ...prev, mode: normalizeGameMode(content.mode) }));
      }
      if (content.difficulty) {
        setState(prev => ({ ...prev, difficulty: content.difficulty }));
      }
    } catch {
      // Use defaults
    }
  }, [contentStr]);

  const playAudio = useCallback(async (word: string) => {
    // Try pre-recorded audio first
    const audioPath = resolveAudioUrl(`/audio/verbs/${word.toLowerCase()}.mp3`);

    try {
      const audio = new Audio(audioPath);

      // Check if the file exists by trying to load it
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject();
        audio.load();
      });

      audio.play();
      setState(prev => ({ ...prev, audioPlayed: true }));
      return;
    } catch {
      // File doesn't exist, fall back to Web Speech API
    }

    // Fallback to Web Speech API
    if (!isAudioSupported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.lang = 'en-US';

    // Try to get an American English voice
    const voices = window.speechSynthesis.getVoices();
    const americanVoice = voices.find(v =>
      v.lang.startsWith('en-US') ||
      v.name.includes('US') ||
      v.name.includes('American')
    );
    if (americanVoice) {
      utterance.voice = americanVoice;
    }

    window.speechSynthesis.speak(utterance);
    setState(prev => ({ ...prev, audioPlayed: true }));
  }, [isAudioSupported]);

  const startGame = useCallback((mode: GameMode) => {
    const gameMode = normalizeGameMode(mode);
    const roundSize = 15;
    let verbs: EdVerb[];

    if (gameMode === 'clap-count') {
      // Shorter round: this is the "start here" mode for overwhelmed beginners.
      verbs = getClapRound(12, state.difficulty);
    } else if (gameMode === 'sorting') {
      verbs = getGameRound(roundSize, state.difficulty);
    } else {
      // For minimal pairs, we need base/past pairs
      const pairs = getMinimalPairs(roundSize);
      verbs = pairs.map(p => p.verb);
    }

    setState(prev => ({
      ...prev,
      mode: gameMode,
      phase: 'playing',
      verbs,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      selectedAnswer: null,
      showFeedback: false,
      discoveryPhase: 0,
      minimalPairTarget: gameMode === 'minimal-pairs' ? pickMinimalPairTarget() : null,
      audioPlayed: false,
    }));
  }, [state.difficulty]);

  // Auto-start from the course map only — the menu is informational but not needed in the course path.
  // Everywhere else (home featured items, activities list) students see the menu first.
  const launchedFromCourseMap = Boolean(
    sanitizeInternalHref(searchParams.get(RETURN_TO_QUERY_PARAM))?.startsWith('/dashboard/map')
  );
  useEffect(() => {
    if (!launchedFromCourseMap || autoStartedRef.current || state.phase !== 'menu') return;
    autoStartedRef.current = true;
    startGame(state.mode);
  }, [launchedFromCourseMap, state.phase, state.mode, startGame]);

  const handleSortingAnswer = useCallback((answer: EdSound) => {
    if (state.showFeedback) return;

    const currentVerb = state.verbs[state.currentIndex];
    const isCorrect = answer === currentVerb.sound;

    setState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0),
      discoveryPhase: prev.discoveryPhase + 1,
      answers: [...prev.answers, { verb: currentVerb, userAnswer: answer, correct: isCorrect }],
    }));
  }, [state.currentIndex, state.verbs, state.showFeedback]);

  const handleClapAnswer = useCallback((answer: ClapAnswer) => {
    if (state.showFeedback) return;

    const currentVerb = state.verbs[state.currentIndex];
    const isCorrect = (answer === 'clap') === hasExtraClap(currentVerb);

    setState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0),
      answers: [...prev.answers, { verb: currentVerb, userAnswer: answer, correct: isCorrect }],
    }));
  }, [state.currentIndex, state.verbs, state.showFeedback]);

  const handleMinimalPairAnswer = useCallback((answer: 'base' | 'past') => {
    if (state.showFeedback) return;

    const isCorrect = answer === state.minimalPairTarget;

    setState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0),
      answers: [...prev.answers, {
        verb: prev.verbs[prev.currentIndex],
        userAnswer: answer,
        correct: isCorrect
      }],
    }));
  }, [state.showFeedback, state.minimalPairTarget]);

  const nextQuestion = useCallback(async () => {
    if (state.currentIndex >= state.verbs.length - 1) {
      // Game complete
      setState(prev => ({ ...prev, phase: 'results' }));

      if (activityId) {
        const accuracy = (state.score / state.verbs.length) * 100;
        const result = await saveActivityProgress(
          activityId,
          100,
          'completed',
          accuracy,
          state.mode,
          assignmentId
        );

        if (result?.pointsAwarded && result.pointsAwarded > 0) {
          setState(prev => ({
            ...prev,
            pointsToast: { points: result.pointsAwarded!, key: Date.now() }
          }));
        }
      }
    } else {
      // Next question
      const nextTarget = state.mode === 'minimal-pairs'
        ? pickMinimalPairTarget()
        : null;

      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedAnswer: null,
        showFeedback: false,
        minimalPairTarget: nextTarget,
        audioPlayed: false,
      }));
    }
  }, [state.currentIndex, state.verbs.length, state.score, state.mode, activityId, assignmentId]);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'menu',
      verbs: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      selectedAnswer: null,
      showFeedback: false,
      discoveryPhase: 0,
      pointsToast: null,
      minimalPairTarget: null,
      audioPlayed: false,
    }));
  }, []);

  // Get feedback message based on discovery phase
  const getFeedbackMessage = useCallback((verb: EdVerb, isCorrect: boolean): string => {
    if (isCorrect) {
      if (state.discoveryPhase < 5) {
        return "Correct!";
      } else if (state.discoveryPhase < 10) {
        // Show pattern hint
        const sameSound = state.answers.filter(a => a.verb.sound === verb.sound && a.correct);
        if (sameSound.length >= 2) {
          const examples = sameSound.slice(-2).map(a => a.verb.past).join(', ');
          return `Yes! Notice: ${examples}, ${verb.past} all end in ${SOUND_RULES[verb.sound].symbol}`;
        }
        return `Correct! ${verb.past} ends in ${SOUND_RULES[verb.sound].symbol}`;
      } else {
        // Show full rule
        return `Correct! ${SOUND_RULES[verb.sound].shortRule}`;
      }
    } else {
      if (state.discoveryPhase < 5) {
        return `Not quite. Listen again to "${verb.past}"`;
      } else if (state.discoveryPhase < 10) {
        return `The -ed in "${verb.past}" sounds like ${SOUND_RULES[verb.sound].symbol}`;
      } else {
        return `${verb.past} → ${SOUND_RULES[verb.sound].symbol}. ${SOUND_RULES[verb.sound].shortRule}`;
      }
    }
  }, [state.discoveryPhase, state.answers]);

  // Menu screen
  if (state.phase === 'menu') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-bg md:relative md:inset-auto md:z-auto md:bg-transparent md:max-w-4xl md:mx-auto md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-full border-border/20 dark:border-white/10 bg-[var(--surface-elevated)] text-text md:min-h-0 md:overflow-hidden md:rounded-3xl md:border md:shadow-xl"
        >
          <div className="bg-gradient-to-br from-violet-300 to-fuchsia-400 p-6 sm:p-8 text-white text-center pb-12 rounded-b-[2.5rem] md:rounded-b-none shadow-lg md:shadow-none relative">
            <button
              onClick={exitGame}
              aria-label="Leave game"
              className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors"
              style={{ color: '#ffffff' }}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setState(prev => ({ ...prev, showInfo: true }))}
              aria-label="Rules"
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors flex items-center gap-2 px-3"
              style={{ color: '#ffffff' }}
            >
              <Info className="w-5 h-5" />
              <span className="text-sm font-bold hidden sm:inline">Rules</span>
            </button>
            <Volume2 className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 opacity-90" style={{ color: '#ffffff' }} />
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2" style={{ color: '#ffffff' }}>-ed Sounds</h1>
            <p className="font-medium" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>Hear it. Clap it. Say it.</p>
          </div>

          <div className="px-4 pb-8 -mt-6 md:mt-0 md:p-8 space-y-6 md:space-y-8 max-w-lg mx-auto md:max-w-none">
            {/* The three sounds explanation (Quick View) */}
            <div className="relative z-10 grid grid-cols-3 gap-3 rounded-2xl border border-border/20 dark:border-white/10 bg-[var(--surface-elevated)] p-4 text-center shadow-lg md:border-0 md:shadow-none">
              <div className="p-3 md:p-4 rounded-2xl bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-700/60">
                <div className="text-xl md:text-2xl font-black" style={{ color: quickViewColors.t.label }}>/t/</div>
                <div className="text-[0.625rem] md:text-xs mt-1 font-bold" style={{ color: quickViewColors.t.example }}>walked · 1 clap</div>
              </div>
              <div className="p-3 md:p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-700/60">
                <div className="text-xl md:text-2xl font-black" style={{ color: quickViewColors.d.label }}>/d/</div>
                <div className="text-[0.625rem] md:text-xs mt-1 font-bold" style={{ color: quickViewColors.d.example }}>played · 1 clap</div>
              </div>
              <div className="p-3 md:p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-700/60">
                <div className="text-xl md:text-2xl font-black" style={{ color: quickViewColors.id.label }}>/id/</div>
                <div className="text-[0.625rem] md:text-xs mt-1 font-bold" style={{ color: quickViewColors.id.example }}>wanted · 2 claps</div>
              </div>
            </div>

            {/* Info Modal */}
            <AnimatePresence>
              {state.showInfo && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <motion.div
                    ref={infoModalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ed-info-title"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg max-h-[90dvh] flex flex-col overflow-hidden rounded-3xl bg-[var(--surface-elevated)] text-text shadow-2xl border border-white/10"
                  >
                    <div className="flex items-center justify-between shrink-0 border-b border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/30 p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-white/10 rounded-full shadow-sm">
                          <Lightbulb className="w-5 h-5 text-violet-600 dark:text-violet-400 fill-violet-100 dark:fill-violet-900/50" />
                        </div>
                        <h2 id="ed-info-title" className="text-xl font-bold" style={{ color: '#2e1065' }}>How to Pronounce -ed</h2>
                      </div>
                      <button 
                        ref={infoCloseRef}
                        type="button"
                        aria-label="Close"
                        onClick={() => setState(prev => ({ ...prev, showInfo: false }))}
                        className="p-2 hover:bg-violet-100 dark:hover:bg-violet-800/50 rounded-full transition-colors text-violet-400 dark:text-violet-300 hover:text-violet-700 dark:hover:text-violet-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-6 overflow-y-auto">
                      <p className="text-sm md:text-base" style={{ color: '#1f2937' }}>
                        We write <strong>-ed</strong>, but we say 3 sounds. Ask 2 questions.
                      </p>

                      {/* Question 1: extra clap → /id/ */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
                            <span className="text-base font-black text-violet-700 dark:text-violet-300">/id/</span>
                          </div>
                          <h3 className="text-lg font-bold" style={{ color: '#1f2937' }}>1. Extra clap?</h3>
                        </div>
                        <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-2xl border border-violet-100 dark:border-violet-800/60 text-sm md:text-base">
                          <p className="mb-2" style={{ color: '#1f2937' }}>Only when the verb ends in a <strong className="font-bold" style={{ color: '#111827' }}>T</strong> or <strong className="font-bold" style={{ color: '#111827' }}>D</strong> sound. Then add a clap: /id/.</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded border border-violet-200 dark:border-violet-700/60 font-medium" style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', color: '#6d28d9' }}>want ➝ want · id</span>
                            <span className="px-2 py-1 rounded border border-violet-200 dark:border-violet-700/60 font-medium" style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', color: '#6d28d9' }}>need ➝ need · id</span>
                          </div>
                        </div>
                      </div>

                      {/* Question 2a: whisper sound → /t/ */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center shrink-0">
                            <span className="text-lg font-black text-sky-700 dark:text-sky-300">/t/</span>
                          </div>
                          <h3 className="text-lg font-bold" style={{ color: '#1f2937' }}>2. No clap + whisper sound</h3>
                        </div>
                        <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-2xl border border-sky-100 dark:border-sky-800/60 text-sm md:text-base">
                          <p className="mb-2" style={{ color: '#1f2937' }}>The verb ends in a sound that is only air: <strong className="font-bold" style={{ color: '#111827' }}>s, sh, ch, k, p, f, x</strong>. Add a tiny /t/.</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded border border-sky-200 dark:border-sky-700/60 font-medium" style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', color: '#0369a1' }}>help ➝ helped</span>
                            <span className="px-2 py-1 rounded border border-sky-200 dark:border-sky-700/60 font-medium" style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', color: '#0369a1' }}>wash ➝ washed</span>
                          </div>
                        </div>
                      </div>

                      {/* Question 2b: everything else → /d/ */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                            <span className="text-lg font-black text-amber-800 dark:text-amber-300">/d/</span>
                          </div>
                          <h3 className="text-lg font-bold" style={{ color: '#1f2937' }}>2. No clap + everything else</h3>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/60 text-sm md:text-base">
                          <p className="mb-2" style={{ color: '#1f2937' }}>All other endings (vowels, l, m, n, r, v, z…). Add a tiny /d/.</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded border border-amber-200 dark:border-amber-700/60 font-medium" style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', color: '#92400e' }}>play ➝ played</span>
                            <span className="px-2 py-1 rounded border border-amber-200 dark:border-amber-700/60 font-medium" style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', color: '#92400e' }}>love ➝ loved</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm font-semibold" style={{ color: '#4c1d95' }}>
                        Not sure about /t/ or /d/? Don&apos;t worry. Just don&apos;t add a clap!
                      </p>
                    </div>
                    
                    <div className="shrink-0 border-t border-border/60 bg-[var(--surface-overlay)] p-4">
                      <button 
                         onClick={() => setState(prev => ({ ...prev, showInfo: false }))}
                         className="w-full rounded-xl py-3 font-bold text-white transition-colors shadow-lg shadow-violet-950/20 hover:bg-violet-700"
                         style={{ backgroundColor: '#7c3aed', color: '#ffffff' }}
                      >
                        Got it!
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Game mode buttons */}
            <div className="space-y-4">
              <button
                onClick={() => startGame('clap-count')}
                className="relative w-full border-b-4 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:brightness-105 transition-all flex items-center justify-center gap-3 active:scale-95 active:border-b-0 active:translate-y-1"
                style={{
                  background: 'linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)',
                  borderBottomColor: '#9a3412',
                  boxShadow: '0 18px 36px rgba(154, 52, 18, 0.25)',
                  color: '#ffffff',
                }}
              >
                <Hand className="w-7 h-7" />
                Clap Count
                <span
                  className="absolute -top-2.5 right-3 rounded-full px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider shadow"
                  style={{ backgroundColor: '#ffffff', color: '#9a3412' }}
                >
                  Start here
                </span>
              </button>
              <button
                onClick={() => startGame('sorting')}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 border-b-4 border-fuchsia-800 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:brightness-105 transition-all flex items-center justify-center gap-3 active:scale-95 active:border-b-0 active:translate-y-1"
                style={{
                  background: 'linear-gradient(90deg, #c026d3 0%, #7c3aed 100%)',
                  borderBottomColor: '#86198f',
                  boxShadow: '0 18px 36px rgba(76, 29, 149, 0.28)',
                  color: '#ffffff',
                }}
              >
                <ArrowLeftRight className="w-7 h-7" />
                Sound Sorting
              </button>
              <button
                onClick={() => startGame('minimal-pairs')}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 border-b-4 border-violet-800 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:brightness-105 transition-all flex items-center justify-center gap-3 active:scale-95 active:border-b-0 active:translate-y-1"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed 0%, #4338ca 100%)',
                  borderBottomColor: '#5b21b6',
                  boxShadow: '0 18px 36px rgba(49, 46, 129, 0.28)',
                  color: '#ffffff',
                }}
              >
                <Ear className="w-7 h-7" />
                Minimal Pairs
              </button>
            </div>

            {/* Mode descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/60">
                <div className="mb-1 font-bold" style={{ color: '#9a3412' }}>Clap Count</div>
                <p style={{ color: '#374151' }}>One question: extra clap or no extra clap?</p>
              </div>
              <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800/60">
                <div className="mb-1 font-bold" style={{ color: '#6d28d9' }}>Sound Sorting</div>
                <p style={{ color: '#374151' }}>See a verb. Choose /t/, /d/, or /id/.</p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/60">
                <div className="mb-1 font-bold" style={{ color: '#4338ca' }}>Minimal Pairs</div>
                <p style={{ color: '#374151' }}>Hear a word - is it "walk" or "walked"?</p>
              </div>
            </div>

            {!isAudioSupported && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-700/60 flex items-center gap-3">
                <VolumeX className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-200">
                  Audio not supported in this browser. The game will still work, but without sound.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Results screen
  if (state.phase === 'results') {
    const accuracy = Math.round((state.score / state.verbs.length) * 100);

    // Group answers by sound for summary
    const bySound: Record<EdSound, { correct: number; total: number }> = {
      d: { correct: 0, total: 0 },
      t: { correct: 0, total: 0 },
      id: { correct: 0, total: 0 },
    };

    state.answers.forEach(a => {
      bySound[a.verb.sound].total++;
      if (a.correct) bySound[a.verb.sound].correct++;
    });

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-bg md:relative md:inset-auto md:z-auto md:bg-transparent md:max-w-2xl md:mx-auto md:p-6">
        {state.pointsToast && (
          <PointsToast
            key={state.pointsToast.key}
            points={state.pointsToast.points}
            onComplete={() => setState(prev => ({ ...prev, pointsToast: null }))}
          />
        )}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-h-full border-border/20 bg-[var(--surface-elevated)] text-text md:min-h-0 md:overflow-hidden md:rounded-3xl md:border md:shadow-2xl"
        >
          <div className="bg-gradient-to-br from-violet-300 to-fuchsia-400 p-10 text-white text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-4xl font-display font-bold mb-1">Great Practice!</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
              {MODE_LABELS[state.mode]}
            </span>
          </div>

          <div className="p-6 md:p-10 max-w-lg mx-auto md:max-w-none">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl border border-border/40 bg-[var(--surface-overlay)] p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                <div className="text-2xl font-black tracking-tight text-text">{accuracy}%</div>
                <div className="text-[0.625rem] font-black uppercase tracking-widest text-muted">Accuracy</div>
              </div>
              <div className="rounded-2xl border border-border/40 bg-[var(--surface-overlay)] p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-black tracking-tight text-text">{state.maxStreak}</div>
                <div className="text-[0.625rem] font-black uppercase tracking-widest text-muted">Best Streak</div>
              </div>
              <div className="rounded-2xl border border-border/40 bg-[var(--surface-overlay)] p-4 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-black tracking-tight text-text">{state.score}/{state.verbs.length}</div>
                <div className="text-[0.625rem] font-black uppercase tracking-widest text-muted">Correct</div>
              </div>
              <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 shadow-sm text-center">
                <Coins className="w-6 h-6 mx-auto mb-2 text-violet-600" />
                <div className="text-2xl font-black text-violet-600 tracking-tight">6</div>
                <div className="text-[0.625rem] text-violet-600 uppercase font-black tracking-widest">Points</div>
              </div>
            </div>

            {/* Clap breakdown (for clap count mode) */}
            {state.mode === 'clap-count' && (() => {
              const clapAnswers = state.answers.filter(a => hasExtraClap(a.verb));
              const noClapAnswers = state.answers.filter(a => !hasExtraClap(a.verb));
              return (
                <div className="mb-8">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted">By Clap</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-sky-100 text-center">
                      <div className="text-base font-black text-sky-700">No extra clap</div>
                      <div className="text-sm font-bold text-sky-700">
                        {noClapAnswers.filter(a => a.correct).length}/{noClapAnswers.length}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-violet-100 text-center">
                      <div className="text-base font-black text-violet-700">Extra clap</div>
                      <div className="text-sm font-bold text-violet-700">
                        {clapAnswers.filter(a => a.correct).length}/{clapAnswers.length}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Sound breakdown (for sorting mode) */}
            {state.mode === 'sorting' && (
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted">By Sound</h3>
                <div className="grid grid-cols-3 gap-3">
                  {SOUND_ORDER.map(sound => (
                    <div key={sound} className={`p-3 rounded-xl ${SOUND_COLORS[sound].bg} text-center`}>
                      <div className={`text-xl font-black ${SOUND_COLORS[sound].text}`}>
                        {SOUND_RULES[sound].symbol}
                      </div>
                      <div className={`text-sm font-bold ${SOUND_COLORS[sound].text}`}>
                        {bySound[sound].correct}/{bySound[sound].total}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules summary */}
            <div className="mb-8 rounded-2xl border border-border/40 bg-[var(--surface-overlay)] p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-text">Remember the Rules</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-violet-700"><strong>/id/</strong> — Ends in a T or D sound → extra clap (want · id)</p>
                <p className="text-sky-700"><strong>/t/</strong> — No clap. Whisper sound (s, sh, ch, k, p, f, x) → tiny /t/</p>
                <p className="text-amber-800"><strong>/d/</strong> — No clap. Everything else → tiny /d/</p>
              </div>
            </div>

            {/* Action buttons */}
            {countdown.isActive && (
              <button
                onClick={countdown.goNow}
                className="mb-3 w-full rounded-2xl bg-[var(--tone-vocab-chip-bg,#eef3ee)] border border-[var(--tone-vocab-accent,#6a8d73)]/30 py-3.5 font-bold text-[var(--tone-vocab-accent,#6a8d73)] transition-all hover:bg-[var(--tone-vocab-accent,#6a8d73)]/15 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Course Map
              </button>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => { countdown.cancel(); resetGame(); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border/40 py-4 font-bold text-text transition-all hover:bg-white/5"
              >
                Change Mode
              </button>
              <button
                onClick={() => { countdown.cancel(); startGame(state.mode); }}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
            {countdown.isActive && (
              <div className="mt-4">
                <div className="mb-1.5 text-center text-xs text-text-muted">
                  Continuing to {countdown.destinationLabel} in {countdown.secondsLeft}s…
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-border/30">
                  <div
                    className="h-full rounded-full bg-[var(--tone-vocab-accent,#6a8d73)] transition-all duration-1000 ease-linear"
                    style={{ width: `${(countdown.secondsLeft / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing screen
  const currentVerb = state.verbs[state.currentIndex];
  const progress = ((state.currentIndex + 1) / state.verbs.length) * 100;
  const minimalPairTargetWord = state.minimalPairTarget === 'base' ? currentVerb.base : currentVerb.past;
  const minimalPairOtherWord = state.minimalPairTarget === 'base' ? currentVerb.past : currentVerb.base;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex min-h-[100dvh] max-w-2xl flex-col overflow-y-auto bg-bg md:overflow-visible md:relative md:inset-auto md:z-auto md:min-h-[calc(100dvh-14rem)] md:bg-transparent md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-[var(--surface-elevated)] px-4 py-3 text-text md:hidden">
        <button
          onClick={resetGame}
          className="ml-[-0.5rem] rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-text"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
             <span className="text-xs font-bold uppercase tracking-wider text-muted">
               {state.currentIndex + 1}/{state.verbs.length}
             </span>
           </div>
           
           <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold">{state.streak}</span>
           </div>
           
           <div className="min-w-[40px] text-right font-black text-violet-300">
             {state.score}
           </div>
        </div>
      </div>
      
      {/* Mobile progress bar added to top */}
      <div className="h-1 bg-white/10 md:hidden">
        <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
          />
      </div>

      <div className="mb-6 hidden items-center justify-between gap-2 text-text sm:flex">
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-[var(--surface-elevated)] px-3 py-2 text-sm font-semibold text-text transition-all hover:bg-white/10 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Settings
        </button>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted">Question</span>
            <span className="text-xl font-bold text-text">
              {state.currentIndex + 1} / {state.verbs.length}
            </span>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div className="flex flex-col">
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted">Streak</span>
            <div className="flex items-center gap-1">
              <Zap className={`w-4 h-4 ${state.streak > 0 ? 'fill-amber-500 text-amber-500' : 'text-white/20'}`} />
              <span className="text-xl font-bold text-text">{state.streak}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted">Score</span>
          <div className="text-xl font-bold text-violet-300">{state.score}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10 sm:mb-8">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
        />
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 pb-2 sm:pb-4">
        {state.mode === 'clap-count' ? (
          // Clap Count Mode
          <>
            <motion.div
              key={state.currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-2"
            >
              <div className="mb-1 text-lg font-semibold text-muted sm:text-xl">
                {currentVerb.base} →
              </div>
              <div className="mb-3 text-4xl font-black text-text sm:text-5xl md:text-6xl">
                {currentVerb.past}
              </div>
              <button
                onClick={() => playAudio(currentVerb.past)}
                disabled={!isAudioSupported}
                className={`flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full font-bold transition-all ${
                  isAudioSupported
                    ? 'bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-100 dark:hover:bg-violet-500/30 active:scale-95'
                    : 'bg-white/10 text-muted cursor-not-allowed'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                Listen
              </button>
              {!state.showFeedback && (
                <div className="mt-4 text-xl font-bold text-text sm:text-2xl">Extra clap?</div>
              )}
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mb-2">
              {(['no-clap', 'clap'] as const).map((choice) => {
                const rightChoice: ClapAnswer = hasExtraClap(currentVerb) ? 'clap' : 'no-clap';
                const isSelected = state.selectedAnswer === choice;
                const isCorrect = state.showFeedback && choice === rightChoice;
                const isWrong = state.showFeedback && isSelected && choice !== rightChoice;
                const idle = choice === 'clap'
                  ? 'bg-violet-100 text-violet-800 hover:bg-violet-200'
                  : 'bg-sky-100 text-sky-800 hover:bg-sky-200';

                return (
                  <button
                    key={choice}
                    onClick={() => handleClapAnswer(choice)}
                    disabled={state.showFeedback}
                    aria-label={choice === 'clap' ? 'Extra clap' : 'No extra clap'}
                    className={`
                      p-4 sm:p-5 rounded-2xl font-black transition-all border-2
                      ${state.showFeedback
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                          : isWrong
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-white/10 text-white/40 border-white/10'
                        : `${idle} border-transparent active:scale-95`
                      }
                    `}
                  >
                    <div className="flex justify-center gap-1.5 mb-2" aria-hidden="true">
                      <Hand className="w-6 h-6" />
                      {choice === 'clap' && <Hand className="w-6 h-6" />}
                    </div>
                    <div className="text-lg sm:text-xl leading-tight">
                      {choice === 'clap' ? 'Extra clap' : 'No extra clap'}
                    </div>
                    <div className={`mt-1 text-xs font-bold ${
                      state.showFeedback && (isCorrect || isWrong) ? 'text-white/80' : 'opacity-70'
                    }`}>
                      {choice === 'clap' ? 'like wanted' : 'like walked'}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : state.mode === 'sorting' ? (
          // Sound Sorting Mode
          <>
            {/* Word display */}
            <motion.div
              key={state.currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-2"
            >
              <div className="mb-3 text-4xl font-black text-text sm:text-5xl md:text-6xl">
                {currentVerb.past}
              </div>
              <button
                onClick={() => playAudio(currentVerb.past)}
                disabled={!isAudioSupported}
                className={`flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full font-bold transition-all ${
                  isAudioSupported
                    ? 'bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-100 dark:hover:bg-violet-500/30 active:scale-95'
                    : 'bg-white/10 text-muted cursor-not-allowed'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                Listen
              </button>
            </motion.div>

            {/* Sound buttons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md mb-2">
              {SOUND_ORDER.map((sound) => {
                const isSelected = state.selectedAnswer === sound;
                const isCorrect = state.showFeedback && sound === currentVerb.sound;
                const isWrong = state.showFeedback && isSelected && sound !== currentVerb.sound;

                return (
                  <button
                    key={sound}
                    onClick={() => handleSortingAnswer(sound)}
                    disabled={state.showFeedback}
                    className={`
                      p-4 sm:p-6 rounded-2xl font-black text-xl sm:text-2xl transition-all border-2
                      ${state.showFeedback
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                          : isWrong
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-white/10 text-white/40 border-white/10'
                        : `${SOUND_COLORS[sound].bg} ${SOUND_COLORS[sound].text} ${SOUND_COLORS[sound].hover} border-transparent hover:border-neutral-200 active:scale-95`
                      }
                    `}
                  >
                    {SOUND_RULES[sound].symbol}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // Minimal Pairs Mode
          <>
            {/* Audio prompt */}
            <motion.div
              key={state.currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-2"
            >
              <div className="mb-3 text-lg text-muted sm:text-xl">What did you hear?</div>
              <button
                onClick={() => playAudio(minimalPairTargetWord)}
                disabled={!isAudioSupported}
                className={`flex items-center gap-3 mx-auto px-6 py-3 rounded-full font-bold text-lg sm:text-xl transition-all ${
                  isAudioSupported
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 shadow-lg'
                    : 'bg-white/10 text-muted cursor-not-allowed'
                }`}
              >
                <Volume2 className="w-6 h-6" />
                {state.audioPlayed ? 'Play Again' : 'Play Sound'}
              </button>
            </motion.div>

            {/* Choice buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mb-2">
              {(['base', 'past'] as const).map((choice) => {
                const word = choice === 'base' ? currentVerb.base : currentVerb.past;
                const isSelected = state.selectedAnswer === choice;
                const isCorrect = state.showFeedback && choice === state.minimalPairTarget;
                const isWrong = state.showFeedback && isSelected && choice !== state.minimalPairTarget;

                return (
                  <button
                    key={choice}
                    onClick={() => handleMinimalPairAnswer(choice)}
                    disabled={state.showFeedback}
                    className={`
                      p-4 sm:p-5 rounded-2xl font-black transition-all border-2
                      ${state.showFeedback
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                          : isWrong
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-white/10 text-white/40 border-white/10'
                        : 'bg-[var(--surface-elevated)] text-text border-border/50 hover:border-indigo-300/70 hover:bg-indigo-500/10 active:scale-95'
                      }
                    `}
                  >
                    <div className="text-2xl sm:text-3xl">{word}</div>
                    <div className={`mt-1 text-xs font-bold uppercase tracking-[0.2em] ${
                      state.showFeedback && (isCorrect || isWrong) ? 'text-white/80' : 'text-muted'
                    }`}>
                      {choice === 'base' ? 'Base' : 'Past'}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Feedback */}
        <GameLiveRegion
          message={
            state.showFeedback
              ? state.mode === 'clap-count'
                ? `${state.answers[state.answers.length - 1]?.correct ? 'Correct!' : 'Not quite.'} ${getClapExplanation(currentVerb)}`
                : state.mode === 'sorting'
                ? getFeedbackMessage(currentVerb, state.answers[state.answers.length - 1]?.correct)
                : state.answers[state.answers.length - 1]?.correct
                  ? 'Correct!'
                  : `Not correct. It was "${minimalPairTargetWord}".`
              : null
            }
        />
        <AnimatePresence>
          {state.showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 w-full max-w-md rounded-2xl p-4 ${
                state.answers[state.answers.length - 1]?.correct
                  ? 'border border-emerald-300/40 dark:border-emerald-700/60 bg-emerald-100 dark:bg-emerald-900/30'
                  : 'border border-rose-300/40 dark:border-rose-700/60 bg-rose-100 dark:bg-rose-900/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {state.answers[state.answers.length - 1]?.correct ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-bold ${
                    state.answers[state.answers.length - 1]?.correct
                      ? 'text-emerald-900 dark:text-emerald-100'
                      : 'text-rose-900 dark:text-rose-100'
                  }`}>
                    {state.mode === 'clap-count'
                      ? state.answers[state.answers.length - 1]?.correct ? 'Correct!' : 'Not quite.'
                      : state.mode === 'sorting'
                      ? getFeedbackMessage(currentVerb, state.answers[state.answers.length - 1]?.correct)
                      : state.answers[state.answers.length - 1]?.correct
                        ? "Correct!"
                        : `It was "${minimalPairTargetWord}"`
                    }
                  </p>
                  {state.mode === 'clap-count' && (
                    <>
                      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {getClapExplanation(currentVerb)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-sm font-black ${SOUND_COLORS[currentVerb.sound].bg} ${SOUND_COLORS[currentVerb.sound].text}`}>
                          {SOUND_RULES[currentVerb.sound].symbol} team
                        </span>
                        <button
                          onClick={() => playAudio(currentVerb.past)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 px-3 py-1 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-white/20"
                        >
                          <Volume2 className="w-4 h-4" />
                          Hear it again
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        &quot;{currentVerb.example}&quot;
                      </p>
                    </>
                  )}
                  {state.mode === 'sorting' && (
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      &quot;{currentVerb.example}&quot;
                    </p>
                  )}
                  {state.mode === 'minimal-pairs' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => playAudio(minimalPairTargetWord)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-white/20"
                      >
                        <Volume2 className="w-4 h-4" />
                        Hear correct: {minimalPairTargetWord}
                      </button>
                      <button
                        onClick={() => playAudio(minimalPairOtherWord)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-white/20"
                      >
                        <Volume2 className="w-4 h-4" />
                        Hear other: {minimalPairOtherWord}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        {state.showFeedback && (
          <motion.button
            ref={nextButtonRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextQuestion}
            className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 sm:px-12 sm:py-4 sm:text-lg"
          >
            {state.currentIndex < state.verbs.length - 1 ? 'Next' : 'See Results'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
