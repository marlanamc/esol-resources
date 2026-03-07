'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Ear,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
  Zap,
  Coins,
} from 'lucide-react';
import { saveActivityProgress, fetchActivityProgress, type FetchedActivityProgress } from '@/lib/activityProgress';
import { PointsToast } from '@/components/ui/PointsToast';
import {
  type MinimalPairContrastId,
  type MinimalPairDifficulty,
  type MinimalPairQuestion,
  type MinimalPairSide,
  MINIMAL_PAIR_CONTRASTS,
  getMinimalPairsRound,
} from '@/lib/minimal-pairs-data';

type ContrastSelection = MinimalPairContrastId | 'mixed';
type DifficultySelection = MinimalPairDifficulty | 'mixed';
type GamePhase = 'menu' | 'playing' | 'results';

interface GameState {
  phase: GamePhase;
  contrast: ContrastSelection;
  difficulty: DifficultySelection;
  roundSize: number;
  questions: MinimalPairQuestion[];
  currentIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  selectedAnswer: MinimalPairSide | null;
  showFeedback: boolean;
  answers: Array<{ question: MinimalPairQuestion; userAnswer: MinimalPairSide; correct: boolean }>;
  pointsToast: { points: number; key: number } | null;
  audioPlayed: boolean;
  completedContrasts: Set<string>;
}

interface ContentConfig {
  type?: string;
  contrastId?: ContrastSelection;
  difficulty?: DifficultySelection;
  roundSize?: number;
}

interface Props {
  contentStr: string;
  activityId?: string;
  assignmentId?: string | null;
}

const ROUND_OPTIONS = [10, 12, 15];

export default function MinimalPairsGame({ contentStr, activityId, assignmentId }: Props) {
  const [state, setState] = useState<GameState>({
    phase: 'menu',
    contrast: 'mixed',
    difficulty: 'mixed',
    roundSize: 10,
    questions: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    selectedAnswer: null,
    showFeedback: false,
    answers: [],
    pointsToast: null,
    audioPlayed: false,
    completedContrasts: new Set(),
  });

  const [isAudioSupported, setIsAudioSupported] = useState(true);

  useEffect(() => {
    setIsAudioSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    try {
      const parsed = JSON.parse(contentStr) as ContentConfig;
      if (!parsed || typeof parsed !== 'object') return;

      setState((prev) => ({
        ...prev,
        contrast: parsed.contrastId ?? prev.contrast,
        difficulty: parsed.difficulty ?? prev.difficulty,
        roundSize: parsed.roundSize && ROUND_OPTIONS.includes(parsed.roundSize) ? parsed.roundSize : prev.roundSize,
      }));
    } catch {
      // Keep defaults if content is not JSON.
    }
  }, [contentStr]);

  const playAudio = useCallback(async (word: string) => {
    const audioPath = `/audio/minimal-pairs/${word.toLowerCase()}.mp3`;

    try {
      const audio = new Audio(audioPath);
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject();
        audio.load();
      });
      await audio.play();
      setState((prev) => ({ ...prev, audioPlayed: true }));
      return;
    } catch {
      // Fall through to speech synthesis.
    }

    if (!isAudioSupported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.75;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const americanVoice = voices.find((voice) =>
      voice.lang.startsWith('en-US') || voice.name.includes('US') || voice.name.includes('American')
    );
    if (americanVoice) utterance.voice = americanVoice;

    window.speechSynthesis.speak(utterance);
    setState((prev) => ({ ...prev, audioPlayed: true }));
  }, [isAudioSupported]);

  const startGame = useCallback(() => {
    let questions = getMinimalPairsRound({
      contrastId: state.contrast,
      difficulty: state.difficulty,
      roundSize: state.roundSize,
    });

    // Fallback for strict filters that produce 0 questions.
    if (questions.length === 0) {
      questions = getMinimalPairsRound({
        contrastId: state.contrast,
        difficulty: 'mixed',
        roundSize: state.roundSize,
      });
    }

    setState((prev) => ({
      ...prev,
      phase: 'playing',
      questions,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      selectedAnswer: null,
      showFeedback: false,
      answers: [],
      audioPlayed: false,
    }));
  }, [state.contrast, state.difficulty, state.roundSize]);

  const resetToMenu = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'menu',
      questions: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      selectedAnswer: null,
      showFeedback: false,
      answers: [],
      audioPlayed: false,
    }));
  }, []);

  const handleAnswer = useCallback((answer: MinimalPairSide) => {
    if (state.showFeedback || state.phase !== 'playing') return;
    const question = state.questions[state.currentIndex];
    if (!question) return;

    const isCorrect = answer === question.targetSide;

    setState((prev) => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0),
      answers: [...prev.answers, { question, userAnswer: answer, correct: isCorrect }],
    }));
  }, [state.currentIndex, state.phase, state.questions, state.showFeedback]);

  // Fetch existing progress
  useEffect(() => {
    if (!activityId) return;
    
    fetchActivityProgress(activityId, assignmentId).then((data: FetchedActivityProgress | null) => {
      if (data?.categoryData) {
        const completed = new Set<string>();
        Object.entries(data.categoryData).forEach(([key, val]) => {
            const castVal = val as { completed?: boolean } | null;
            if (castVal && castVal.completed) {
                completed.add(key);
            }
        });
        setState(prev => ({ ...prev, completedContrasts: completed }));
      }
    });
  }, [activityId, assignmentId]);

  const nextQuestion = useCallback(async () => {
    const isFinalQuestion = state.currentIndex >= state.questions.length - 1;

    if (isFinalQuestion) {
      // Calculate results
      const accuracy = Math.round((state.score / state.questions.length) * 100);
      
      // Update completed contrasts
      const newCompletedContrasts = new Set(state.completedContrasts);
      
      // Only mark as complete if not 'mixed' and accuracy is decent (> 50%?)
      // For now, completion = finishing the round, similar to other games, 
      // but strictly for the specific contrast.
      if (state.contrast !== 'mixed') {
        newCompletedContrasts.add(state.contrast);
      }

      // Calculate overall progress: (completed contrasts / total contrasts) * 100
      const totalContrasts = MINIMAL_PAIR_CONTRASTS.length;
      const percentComplete = Math.min(100, Math.round((newCompletedContrasts.size / totalContrasts) * 100));
      const status = percentComplete >= 100 ? 'completed' : 'in_progress';

      setState((prev) => ({ 
          ...prev, 
          phase: 'results', 
          completedContrasts: newCompletedContrasts 
      }));

      if (activityId) {
        // If it's a specific contrast, save it as a completed category
        const categoryToSave = state.contrast !== 'mixed' ? state.contrast : undefined;

        const result = await saveActivityProgress(
          activityId,
          percentComplete,
          status,
          accuracy,
          categoryToSave,
          assignmentId
        );

        if (result?.pointsAwarded && result.pointsAwarded > 0) {
          setState((prev) => ({
            ...prev,
            pointsToast: { points: result.pointsAwarded!, key: Date.now() },
          }));
        }
      }
      return;
    }

    setState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      selectedAnswer: null,
      showFeedback: false,
      audioPlayed: false,
    }));
  }, [activityId, assignmentId, state.contrast, state.currentIndex, state.questions.length, state.score, state.completedContrasts]);

  if (state.phase === 'menu') {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--color-bg)] overflow-y-auto md:relative md:inset-auto md:z-auto md:bg-transparent md:max-w-4xl md:mx-auto md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-full md:min-h-0 bg-[var(--color-surface-elevated)] md:rounded-3xl md:shadow-xl md:overflow-hidden md:border border-white/10"
        >
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 sm:p-8 text-white text-center pb-12 rounded-b-[2.5rem] md:rounded-b-none shadow-lg md:shadow-none relative">
            <button 
              onClick={() => window.history.back()}
              className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <Ear className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">Minimal Pairs Lab</h1>
            <p className="text-white/90 font-medium">Train your ear with high-impact contrasts.</p>
          </div>

          <div className="px-4 pb-8 -mt-6 md:mt-0 md:p-8 space-y-6 md:space-y-8 max-w-lg mx-auto md:max-w-none">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 px-1">
                <Target className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Contrast Focus</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[var(--color-surface-elevated)] rounded-2xl md:bg-transparent shadow-sm md:shadow-none border border-[var(--color-border-subtle)] md:border-0 p-2 md:p-0">
                {(() => {
                  const isSelected = state.contrast === 'mixed';
                  return (
                    <button
                      onClick={() => setState((prev) => ({ ...prev, contrast: 'mixed' }))}
                      className={`text-left p-4 rounded-xl md:rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-cyan-600 bg-cyan-100 shadow-md ring-2 ring-cyan-200'
                          : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] hover:border-cyan-300 hover:bg-cyan-50/10'
                      }`}
                    >
                      <div className={`font-bold ${isSelected ? 'text-cyan-900' : 'text-[var(--color-text)]'}`}>Mixed Practice</div>
                      <p className={`text-sm mt-1 ${isSelected ? 'text-cyan-800' : 'text-[var(--color-text-muted)]'}`}>
                        Rotate through all contrast types in one round.
                      </p>
                    </button>
                  );
                })()}

                {MINIMAL_PAIR_CONTRASTS.map((contrast) => (
                  (() => {
                    const isSelected = state.contrast === contrast.id;
                    return (
                      <button
                        key={contrast.id}
                        onClick={() => setState((prev) => ({ ...prev, contrast: contrast.id }))}
                        className={`text-left p-4 rounded-xl md:rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-cyan-600 bg-cyan-100 shadow-md ring-2 ring-cyan-200'
                            : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] hover:border-cyan-300 hover:bg-cyan-50/10'
                        }`}
                      >
                        <div className={`font-bold ${isSelected ? 'text-cyan-900' : 'text-[var(--color-text)]'}`}>{contrast.label}</div>
                        <p className={`text-sm mt-1 ${isSelected ? 'text-cyan-800' : 'text-[var(--color-text-muted)]'}`}>{contrast.description}</p>
                      </button>
                    );
                  })()
                ))}
              </div>
            </div>

            {state.contrast !== 'mixed' && (
              <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50" style={{ color: '#4a3422' }}>
                <p className="text-sm" style={{ color: '#4a3422' }}>
                  {MINIMAL_PAIR_CONTRASTS.find((contrast) => contrast.id === state.contrast)?.spanishTip}
                </p>
              </div>
            )}

            {!isAudioSupported && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <VolumeX className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Web Speech fallback is unavailable in this browser. Pre-recorded audio still works if files exist.
                </p>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 active:translate-y-1 border-b-4 border-cyan-800 active:border-b-0"
            >
              Start Listening Round
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (state.phase === 'results') {
    const total = state.questions.length;
    const accuracy = total === 0 ? 0 : Math.round((state.score / total) * 100);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-bg md:relative md:inset-auto md:z-auto md:bg-transparent md:max-w-2xl md:mx-auto md:p-6">
        {state.pointsToast && (
          <PointsToast
            key={state.pointsToast.key}
            points={state.pointsToast.points}
            onComplete={() => setState((prev) => ({ ...prev, pointsToast: null }))}
          />
        )}

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-h-full border-border/20 bg-[var(--surface-elevated)] text-text md:min-h-0 md:overflow-hidden md:rounded-3xl md:border md:shadow-2xl"
        >
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-10 text-white text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-4xl font-display font-bold mb-1">Listening Complete</h2>
            <p className="text-white/90">Keep training your ear every day.</p>
          </div>

          <div className="p-6 md:p-10 max-w-lg mx-auto md:max-w-none">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl border border-border/40 bg-[var(--surface-overlay)] p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
                <div className="text-2xl font-black text-text">{accuracy}%</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-muted">Accuracy</div>
              </div>
              <div className="rounded-2xl border border-border/40 bg-[var(--surface-overlay)] p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-black text-text">{state.maxStreak}</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-muted">Best Streak</div>
              </div>
              <div className="rounded-2xl border border-border/40 bg-[var(--surface-overlay)] p-4 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-black text-text">{state.score}/{total}</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-muted">Correct</div>
              </div>
              <div className="rounded-2xl border border-cyan-300/40 bg-cyan-100 p-4 text-center shadow-sm">
                <Coins className="w-6 h-6 mx-auto mb-2 text-cyan-700" />
                <div className="text-2xl font-black text-cyan-700">6</div>
                <div className="text-[10px] text-cyan-700 uppercase font-black tracking-widest">Points</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetToMenu}
                className="flex-1 rounded-2xl border-2 border-border/40 py-4 font-bold text-text transition-all hover:bg-white/5"
              >
                Change Settings
              </button>
              <button
                onClick={startGame}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = state.questions[state.currentIndex];
  const progress = state.questions.length === 0 ? 0 : ((state.currentIndex + 1) / state.questions.length) * 100;
  const targetWord = question?.targetSide === 'left' ? question.pair.leftWord : question?.pair.rightWord;
  const contrastWord = question?.targetSide === 'left' ? question.pair.rightWord : question?.pair.leftWord;

  if (!question) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-2xl border border-border/40 bg-[var(--surface-elevated)] p-6 text-center text-text">
          <p className="text-text">No pairs found for this setting. Try mixed difficulty.</p>
          <button
            onClick={resetToMenu}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex min-h-[100dvh] max-w-2xl flex-col bg-bg md:relative md:inset-auto md:z-auto md:min-h-[calc(100dvh-14rem)] md:bg-transparent md:p-6">
      <div className="flex items-center justify-between border-b border-border/40 bg-[var(--surface-elevated)] px-4 py-3 text-text md:hidden">
        <button
          onClick={resetToMenu}
          className="ml-[-0.5rem] rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-text"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
             <span className="text-xs font-bold uppercase tracking-wider text-muted">
               {state.currentIndex + 1}/{state.questions.length}
             </span>
           </div>
           
           <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold">{state.streak}</span>
           </div>
           
           <div className="min-w-[40px] text-right font-black text-cyan-300">
             {state.score}
           </div>
        </div>
      </div>

       {/* Mobile progress bar added to top */}
      <div className="h-1 bg-white/10 md:hidden">
        <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-cyan-600 to-blue-600"
          />
      </div>

      <div className="mb-6 hidden items-center justify-between gap-2 text-text sm:flex">
        <button
          onClick={resetToMenu}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-[var(--surface-elevated)] px-3 py-2 text-sm font-semibold text-text transition-all hover:bg-white/10 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Settings
        </button>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Question</span>
            <span className="text-xl font-bold text-text">{state.currentIndex + 1} / {state.questions.length}</span>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Streak</span>
            <div className="flex items-center gap-1">
              <Zap className={`w-4 h-4 ${state.streak > 0 ? 'fill-amber-500 text-amber-500' : 'text-white/20'}`} />
              <span className="text-xl font-bold text-text">{state.streak}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Score</span>
          <div className="text-xl font-bold text-cyan-300">{state.score}</div>
        </div>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10 sm:mb-8">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-cyan-600 to-blue-600"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 pb-2 sm:pb-4">
        <div className="text-center mb-2">
          <div className="mb-4 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
            {question.contrastLabel}
          </div>
          <div className="mb-3 text-lg text-muted sm:text-xl">What word did you hear?</div>
          <button
            onClick={() => targetWord && playAudio(targetWord)}
            className="flex items-center gap-3 mx-auto px-6 py-3 rounded-full font-bold text-lg sm:text-xl transition-all bg-cyan-600 text-white hover:bg-cyan-700 active:scale-95 shadow-lg"
          >
            <Volume2 className="w-6 h-6" />
            {state.audioPlayed ? 'Play Again' : 'Play Sound'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mb-2">
          {(['left', 'right'] as const).map((choice) => {
            const word = choice === 'left' ? question.pair.leftWord : question.pair.rightWord;
            const ipa = choice === 'left' ? question.pair.leftIpa : question.pair.rightIpa;
            const isSelected = state.selectedAnswer === choice;
            const isCorrect = state.showFeedback && choice === question.targetSide;
            const isWrong = state.showFeedback && isSelected && choice !== question.targetSide;

            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={state.showFeedback}
                className={`
                  p-4 sm:p-5 rounded-2xl font-black transition-all border-2
                  ${state.showFeedback
                    ? isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                      : isWrong
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-white/10 text-white/40 border-white/10'
                    : 'bg-[var(--surface-elevated)] text-text border-border/50 hover:border-cyan-400 hover:bg-cyan-500/10 active:scale-95'
                  }
                `}
              >
                <div className="text-2xl">{word}</div>
                <div className={`mt-1 text-sm ${state.showFeedback && (isCorrect || isWrong) ? 'text-white/90' : 'text-muted'}`}>
                  {ipa}
                </div>
              </button>
            );
          })}
        </div>

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
                    state.answers[state.answers.length - 1]?.correct ? 'text-emerald-900 dark:text-emerald-100' : 'text-rose-900 dark:text-rose-100'
                  }`}>
                    {state.answers[state.answers.length - 1]?.correct
                      ? `Correct! You heard "${targetWord}".`
                      : `Not quite. The correct answer was "${targetWord}".`
                    }
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => targetWord && playAudio(targetWord)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-white/20"
                    >
                      <Volume2 className="w-4 h-4" />
                      Hear correct: {targetWord}
                    </button>
                    <button
                      onClick={() => contrastWord && playAudio(contrastWord)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-white/20"
                    >
                      <Volume2 className="w-4 h-4" />
                      Hear other: {contrastWord}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {state.showFeedback && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextQuestion}
            className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 sm:px-12 sm:py-4 sm:text-lg"
          >
            {state.currentIndex < state.questions.length - 1 ? 'Next' : 'See Results'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
