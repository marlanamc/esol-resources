'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  BookMarked,
  ChevronRight,
  Info,
  Microscope,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import { ErrorToast } from '@/components/ui/ErrorToast';
import { PointsToast } from '@/components/ui/PointsToast';
import { saveActivityProgress } from '@/lib/activityProgress';
import { GameErrorBoundary } from '@/components/system/ErrorBoundary';
import { useRouter } from 'next/navigation';
import { useTimelineTensesState } from './hooks/useTimelineTensesState';
import { TenseFilterBar } from './TenseFilterBar';
import { SentenceFormFilter } from './SentenceFormFilter';
import { TimeFrameFilter } from './TimeFrameFilter';
import { SentenceToTimelineExercise } from './exercises/SentenceToTimelineExercise';
import { TimelineToVerbExercise } from './exercises/TimelineToVerbExercise';
import { TenseComparisonExercise } from './exercises/TenseComparisonExercise';
import { SentenceTransformerExercise } from './exercises/SentenceTransformerExercise';
import { ContextTenseExercise } from './exercises/ContextTenseExercise';
import { ErrorCorrectionExercise } from './exercises/ErrorCorrectionExercise';
import { StoryBuilderExercise } from './exercises/StoryBuilderExercise';
import { ModeSelector } from './ModeSelector';
import { TimelineLab } from './TimelineLab';
import { ResultsScreen } from './ResultsScreen';
import { TutorialIntroScreen } from './TutorialIntroScreen';
import { TutorialCompleteScreen } from './TutorialCompleteScreen';
import { HowToPlayModal } from './HowToPlayModal';
import { TenseFormulaModal } from './TenseFormulaModal';
import { LearnTensesWalkthrough } from './LearnTensesWalkthrough';
import { TimeSignalsMode } from './TimeSignalsMode/TimeSignalsMode';
import { TenseToolsExerciseMenu, TenseToolsPanel } from './TenseToolsPanel';
import { useTimelineAudio } from './hooks/useTimelineAudio';
import type { SentenceForm, TimelineTimeFrame } from '@/types/activity';
import { categoriesToProgressKey, filterTimelineQuestions, isChallengeMode } from './timelineTensesUtils';
import {
  TIMELINE_TUTORIAL_QUESTIONS,
  TUTORIAL_HINTS,
} from '@/data/timeline-tenses-tutorial';

interface TimelineTensesGameProps {
  activityId: string;
  assignmentId?: string | null;
}

function StepLabel({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0">
        {step}
      </span>
      <span className="text-xs font-black uppercase tracking-[0.18em] text-text-muted/70">{label}</span>
    </div>
  );
}

export function TimelineTensesGame({ activityId, assignmentId }: TimelineTensesGameProps) {
  const router = useRouter();
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const lastProcessedResultsKeyRef = useRef<string | null>(null);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number; message?: string } | null>(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [tenseToolsExpanded, setTenseToolsExpanded] = useState(false);
  const [exerciseTenseToolsOpen, setExerciseTenseToolsOpen] = useState(false);
  const exerciseTenseToolsRef = useRef<HTMLDivElement | null>(null);
  const { playLevelUp } = useTimelineAudio();

  const {
    state,
    toggleTenseCategory,
    selectSentenceForm,
    selectTimeFrame,
    selectPracticeMode,
    startLab,
    startLearnTenses,
    closeLearnTenses,
    startTimeSignals,
    closeTimeSignals,
    exitLab,
    startRound,
    startTutorial,
    submitTutorialAnswer,
    nextTutorialStep,
    skipTutorial,
    startAfterTutorial,
    submitAnswer,
    nextQuestion,
    saveProgress,
    retryRound,
    dismissError,
    resetProgress,
  } = useTimelineTensesState(activityId, assignmentId);

  const handleSaveProgress = useCallback(async () => {
    const result = await saveProgress();
    if (result?.pointsAwarded && result.pointsAwarded > 0) {
      setPointsToast({ points: result.pointsAwarded, key: Date.now() });
    }
  }, [saveProgress]);

  const handleTimeSignalsQuizComplete = useCallback(
    async (correct: number, total: number) => {
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

      const result = await saveActivityProgress(
        activityId,
        100,
        'completed',
        accuracy,
        'time-signals',
        assignmentId ?? undefined
      );

      if (result?.pointsAwarded && result.pointsAwarded > 0) {
        setPointsToast({
          points: result.pointsAwarded,
          key: Date.now(),
          message: 'Time Signals Quiz',
        });
      }
    },
    [activityId, assignmentId]
  );

  // Save progress when round completes
  useEffect(() => {
    if (state.phase === 'results' && state.roundResults) {
      const resultsKey = [
        state.roundResults.category,
        state.roundResults.totalQuestions,
        state.roundResults.correctAnswers,
        state.roundResults.accuracy,
        state.roundResults.questionResults.map((result) => `${result.questionId}:${result.correct ? '1' : '0'}`).join('|'),
      ].join('::');

      // Guard against effect re-runs while staying on the same results screen.
      if (lastProcessedResultsKeyRef.current === resultsKey) {
        return;
      }
      lastProcessedResultsKeyRef.current = resultsKey;

      if (state.roundResults.accuracy >= 70) {
        playLevelUp();
      }
      void handleSaveProgress();
    }
  }, [state.phase, state.roundResults, handleSaveProgress, playLevelUp]);

  // Scroll to top on phase change
  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [state.phase, state.currentQuestionIndex, state.tutorialStep]);

  useEffect(() => {
    if (!exerciseTenseToolsOpen) return;
    const close = (e: MouseEvent) => {
      if (
        exerciseTenseToolsRef.current &&
        !exerciseTenseToolsRef.current.contains(e.target as Node)
      ) {
        setExerciseTenseToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [exerciseTenseToolsOpen]);

  useEffect(() => {
    if (state.phase !== 'exercise') {
      setExerciseTenseToolsOpen(false);
    }
  }, [state.phase]);

  // Memoize derived values to prevent child re-renders
  // These must come before any early returns to satisfy hooks rules
  const currentQuestion = useMemo(
    () => state.roundQuestions[state.currentQuestionIndex],
    [state.roundQuestions, state.currentQuestionIndex]
  );
  const currentTutorialQuestion = useMemo(
    () => TIMELINE_TUTORIAL_QUESTIONS[state.tutorialStep],
    [state.tutorialStep]
  );
  const currentTutorialHint = useMemo(
    () => currentTutorialQuestion ? TUTORIAL_HINTS[currentTutorialQuestion.id] : undefined,
    [currentTutorialQuestion]
  );
  const availableQuestionCount = useMemo(
    () => filterTimelineQuestions(
      state.questionBank,
      state.selectedCategories,
      state.selectedPracticeMode,
      state.selectedSentenceForm,
      state.selectedTimeFrame
    ).length,
    [state.questionBank, state.selectedCategories, state.selectedPracticeMode, state.selectedSentenceForm, state.selectedTimeFrame]
  );
  const totalRoundQuestions = state.roundQuestions.length;
  const totalTutorialQuestions = TIMELINE_TUTORIAL_QUESTIONS.length;

  // Loading state - uses CSS animation to avoid main thread work
  if (state.loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-border border-t-primary animate-spin"
          />
          <p className="text-text-muted font-display text-lg">
            Loading timeline activity...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error && state.phase === 'selection') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-bg flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full p-8 bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 shadow-lg text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center"
          >
            <AlertCircle size={32} className="text-error" />
          </motion.div>
          <h2 className="font-display text-2xl text-text mb-3">Unable to Load</h2>
          <p className="text-text-muted mb-6">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  const TENSE_LABELS: Record<string, string> = {
    all: 'All Tenses',
    simple: 'Simple',
    continuous: 'Continuous',
    perfect: 'Perfect',
    'perfect-continuous': 'Perfect Continuous',
    mixed: 'Mixed',
    'used-to': 'Used To',
  };
  const MODE_LABELS: Record<string, string> = {
    'read-the-timeline': 'Read',
    'build-the-timeline': 'Build',
    'mixed-practice': 'Mixed',
    'lab': 'Lab',
    'spot-the-difference': 'Spot the Diff',
    'transformer': 'Transformer',
    'in-context': 'In Context',
    'fix-it': 'Fix It',
    'story-builder': 'Story Builder',
  };
  const FORM_LABELS: Record<string, string> = {
    'all': 'Any Form', 'affirmative': 'Affirmative', 'negative': 'Negative', 'question': 'Questions'
  };
  const TIME_FRAME_LABELS: Record<string, string> = {
    'all': 'Any Time',
    'past': 'Past',
    'present': 'Present',
    'future': 'Future',
  };

  return (
    <div
      ref={contentScrollRef}
      className="fixed inset-0 overflow-y-auto overscroll-contain bg-bg touch-manipulation"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] sm:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3Ccircle cx='25' cy='10' r='0.8'/%3E%3Ccircle cx='45' cy='3' r='1'/%3E%3Ccircle cx='15' cy='25' r='0.6'/%3E%3Ccircle cx='35' cy='20' r='1'/%3E%3Ccircle cx='55' cy='28' r='0.7'/%3E%3Ccircle cx='10' cy='40' r='0.8'/%3E%3Ccircle cx='30' cy='45' r='1'/%3E%3Ccircle cx='50' cy='38' r='0.6'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative z-10 mx-auto flex min-h-full w-full flex-col ${
          state.phase === 'exercise' || state.phase === 'tutorial'
            ? 'w-full max-w-none px-0 py-2 sm:max-w-4xl sm:px-6 sm:py-10'
            : 'max-w-4xl px-4 py-6 sm:px-6 sm:py-10'
        }`}
      >
        {/* Back button for selection phase */}
        {/* Header toolbar for selection phase */}
        {state.phase === 'selection' && (
          <div className="px-3 sm:px-0 pb-2 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHowToPlayOpen(true)}
                aria-label="How to play"
                title="How to play"
                className="inline-flex items-center justify-center gap-2 px-3 h-11 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-text-muted hover:text-primary transition-colors text-sm font-medium"
              >
                <Info size={20} />
                <span className="hidden sm:inline">How to Play</span>
              </button>
              
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to reset all your mastery levels and progress? This cannot be undone.')) {
                    await resetProgress();
                  }
                }}
                aria-label="Reset all progress"
                title="Reset all progress"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-text-muted hover:text-error transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Selection Phase - Choose tense category */}
          {state.phase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-12 pt-4">
                <h1 className="font-display text-5xl sm:text-6xl font-black text-text mb-4 tracking-tighter">
                  Timeline Tenses
                </h1>
                <p className="text-text-muted text-xl max-w-xl mx-auto mb-2 leading-relaxed font-medium">
                  See time <span className="text-primary italic">clearly</span>. 
                </p>
                <p className="text-text-muted/60 text-base max-w-lg mx-auto">
                  Map English verb tenses to visual timelines and master every moment.
                </p>
              </div>

              {/* Selection Sections */}
              <div className="flex flex-col gap-8">
                <div className="flex justify-center px-1">
                  <TenseToolsPanel
                    expanded={tenseToolsExpanded}
                    onToggleExpanded={() => setTenseToolsExpanded((v) => !v)}
                    onOpenLab={startLab}
                    onOpenWalkthrough={startLearnTenses}
                    onOpenTimeSignals={startTimeSignals}
                  />
                </div>

                {/* Step 1: Choose Tenses */}
                <div>
                  <StepLabel step={1} label="Choose Your Focus" />
                  <p className="text-sm text-text-muted/60 font-medium mb-5 -mt-2">
                    Pick one tense to focus on, or mix a few together for variety.
                  </p>
                  <TenseFilterBar
                    selectedCategories={state.selectedCategories}
                    categoryProgress={state.categoryProgress}
                    onToggleCategory={toggleTenseCategory}
                  />
                </div>

                {/* Step 2: Choose Mode */}
                <div>
                  <StepLabel step={2} label="Choose Your Mode" />
                  <ModeSelector
                    selectedMode={state.selectedPracticeMode}
                    categoryProgress={state.categoryProgress}
                    onSelectMode={selectPracticeMode}
                  />
                  {/* Sentence Form — premium pills, hidden for challenge modes */}
                  {!isChallengeMode(state.selectedPracticeMode) && (
                    <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:gap-12">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-text-muted/40">
                            Sentence Form
                          </p>
                        </div>
                        <SentenceFormFilter
                          selectedForm={state.selectedSentenceForm}
                          onSelectForm={(form: SentenceForm | 'all') => selectSentenceForm(form)}
                          compact
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
                          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-text-muted/40">
                            Time Frame
                          </p>
                        </div>
                        <TimeFrameFilter
                          selectedTimeFrame={state.selectedTimeFrame}
                          onSelectTimeFrame={(timeFrame: TimelineTimeFrame | 'all') => selectTimeFrame(timeFrame)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Start Game */}
                <div className="mb-12 rounded-[2rem] border border-white/30 bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
                  <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-text-muted/50 mb-4">
                    Current Selection
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/10">
                      {state.selectedCategories.length === 0
                        ? 'All Tenses'
                        : state.selectedCategories.map((c) => TENSE_LABELS[c]).join(' + ')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-xs border border-secondary/10">
                      {MODE_LABELS[state.selectedPracticeMode] || 'Read'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-border/20 text-text-muted font-bold text-xs border border-border/20">
                      {FORM_LABELS[state.selectedSentenceForm] || 'All Forms'}
                    </span>
                    {!isChallengeMode(state.selectedPracticeMode) && (
                      <span className="px-3 py-1 rounded-full bg-border/20 text-text-muted font-bold text-xs border border-border/20">
                        {TIME_FRAME_LABELS[state.selectedTimeFrame] || 'Any Time'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={startRound}
                    disabled={availableQuestionCount === 0}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:shadow-[0_20px_32px_-12px_rgba(var(--primary-color-rgb),0.6)] hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <span>Start Game</span>
                    <ChevronRight size={24} />
                  </button>

                  {availableQuestionCount > 0 ? (
                    <p className="mt-4 text-center text-text-muted/60 text-sm font-medium">
                      <span className="text-primary font-bold">{availableQuestionCount}</span> practice items ready
                    </p>
                  ) : (
                    <p className="mt-4 text-center text-error font-bold text-sm">
                      No questions available. Try different filters.
                    </p>
                  )}

                </div>
              </div>
            </motion.div>
          )}

          {state.phase === 'learn-tenses' && (
            <LearnTensesWalkthrough
              selectedCategories={state.selectedCategories}
              onBack={closeLearnTenses}
              onStartPractice={startRound}
              onOpenFormulas={() => setIsFormulaOpen(true)}
            />
          )}

          {state.phase === 'time-signals' && (
            <TimeSignalsMode onBack={closeTimeSignals} onTimeSignalsQuizComplete={handleTimeSignalsQuizComplete} />
          )}

          {/* Tutorial Intro Phase */}
          {state.phase === 'tutorial-intro' && (
            <TutorialIntroScreen
              onStart={startTutorial}
              onSkip={skipTutorial}
              tenseCategory={categoriesToProgressKey(state.selectedCategories)}
            />
          )}

          {/* Tutorial Phase - Interactive Examples */}
          {state.phase === 'tutorial' && currentTutorialQuestion && (
            <motion.div
              key={`tutorial-${state.tutorialStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-col"
            >
              {/* Tutorial progress bar */}
              <div className="px-4 sm:px-0 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={skipTutorial}
                    className="text-text-muted hover:text-text transition-colors text-sm"
                  >
                    Skip Tutorial
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-muted">
                      Example {state.tutorialStep + 1} of {totalTutorialQuestions}
                    </span>
                    <button
                      onClick={() => setIsFormulaOpen(true)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title="Tense Formulas"
                      aria-label="Show tense formulas"
                    >
                      <BookMarked size={18} />
                    </button>
                  </div>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-[width] duration-300 ease-out"
                    style={{ width: `${((state.tutorialStep + 1) / totalTutorialQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tutorial hint */}
              {currentTutorialHint && !state.showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 sm:px-0 mb-4"
                >
                  <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center">
                    <p className="text-sm text-text font-medium">
                      {currentTutorialHint}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Tutorial question content */}
              <SentenceToTimelineExercise
                question={currentTutorialQuestion}
                onSubmit={submitTutorialAnswer}
                onNext={nextTutorialStep}
                showFeedback={state.showFeedback}
                lastAnswerCorrect={state.lastAnswerCorrect}
              />
            </motion.div>
          )}

          {/* Tutorial Complete Phase */}
          {state.phase === 'tutorial-complete' && (
            <TutorialCompleteScreen onContinue={startAfterTutorial} />
          )}

          {/* Exercise Phase */}
          {state.phase === 'exercise' && currentQuestion && (
            <motion.div
              key={`exercise-${state.currentQuestionIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-col"
            >
              {/* Progress bar */}
              <div className="px-4 sm:px-0 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={retryRound}
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-muted">
                      Question {state.currentQuestionIndex + 1} of {totalRoundQuestions}
                    </span>
                    <div className="relative" ref={exerciseTenseToolsRef}>
                      <button
                        type="button"
                        onClick={() => setExerciseTenseToolsOpen((open) => !open)}
                        aria-expanded={exerciseTenseToolsOpen}
                        aria-haspopup="true"
                        aria-label="Tense Tools — review anytime"
                        title="Tense Tools — review anytime"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-white/90 text-text-muted shadow-sm transition-colors hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-[#162b3d]"
                      >
                        <Microscope className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                      </button>
                      <TenseToolsExerciseMenu
                        open={exerciseTenseToolsOpen}
                        onClose={() => setExerciseTenseToolsOpen(false)}
                        onOpenLab={startLab}
                        onOpenWalkthrough={startLearnTenses}
                        onOpenTimeSignals={startTimeSignals}
                      />
                    </div>
                    <button
                      onClick={() => setIsFormulaOpen(true)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title="Tense Formulas"
                      aria-label="Show tense formulas"
                    >
                      <BookMarked size={18} />
                    </button>
                    {state.selectedPracticeMode === 'build-the-timeline' ? (
                      <button
                        onClick={() => {
                          startTutorial();
                        }}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="Interactive tutorial"
                        aria-label="Interactive tutorial"
                      >
                        <HelpCircle size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsHowToPlayOpen(true)}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="How to play"
                        aria-label="How to play"
                      >
                        <HelpCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-[width] duration-300 ease-out"
                    style={{
                      width: totalRoundQuestions > 0
                        ? `${((state.currentQuestionIndex + 1) / totalRoundQuestions) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>

              {/* Question content */}
              <GameErrorBoundary gameName="Timeline Tenses">
                {currentQuestion.type === 'sentence-to-timeline' ? (
                  <SentenceToTimelineExercise
                    question={currentQuestion}
                    onSubmit={submitAnswer}
                    onNext={nextQuestion}
                    showFeedback={state.showFeedback}
                    lastAnswerCorrect={state.lastAnswerCorrect}
                  />
                ) : currentQuestion.type === 'timeline-to-verb' ? (
                  <TimelineToVerbExercise
                    question={currentQuestion}
                    onSubmit={submitAnswer}
                    onNext={nextQuestion}
                    showFeedback={state.showFeedback}
                    lastAnswerCorrect={state.lastAnswerCorrect}
                  />
                ) : currentQuestion.type === 'tense-comparison' ? (
                  <TenseComparisonExercise
                    question={currentQuestion}
                    onSubmit={submitAnswer}
                    onNext={nextQuestion}
                    showFeedback={state.showFeedback}
                    lastAnswerCorrect={state.lastAnswerCorrect}
                  />
                ) : currentQuestion.type === 'sentence-transformer' ? (
                  <SentenceTransformerExercise
                    question={currentQuestion}
                    onSubmit={submitAnswer}
                    onNext={nextQuestion}
                    showFeedback={state.showFeedback}
                    lastAnswerCorrect={state.lastAnswerCorrect}
                  />
                ) : currentQuestion.type === 'context-tense-picker' ? (
                  <ContextTenseExercise
                    question={currentQuestion}
                    onSubmit={submitAnswer}
                    onNext={nextQuestion}
                    showFeedback={state.showFeedback}
                    lastAnswerCorrect={state.lastAnswerCorrect}
                  />
                ) : currentQuestion.type === 'error-correction' ? (
                  <ErrorCorrectionExercise
                    question={currentQuestion}
                    onSubmit={submitAnswer}
                    onNext={nextQuestion}
                    showFeedback={state.showFeedback}
                    lastAnswerCorrect={state.lastAnswerCorrect}
                  />
                ) : currentQuestion.type === 'story-builder' ? (
                  <StoryBuilderExercise
                    question={currentQuestion}
                    onSubmit={submitAnswer}
                    onNext={nextQuestion}
                    showFeedback={state.showFeedback}
                    lastAnswerCorrect={state.lastAnswerCorrect}
                  />
                ) : null}
              </GameErrorBoundary>
            </motion.div>
          )}

          {state.phase === 'lab' && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-col"
            >
              <TimelineLab onBack={exitLab} onOpenFormulas={() => setIsFormulaOpen(true)} />
            </motion.div>
          )}

          {/* Results Phase */}
          {state.phase === 'results' && state.roundResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <ResultsScreen
                results={state.roundResults}
                questions={state.roundQuestions}
                onRetry={retryRound}
                onBack={retryRound}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tense Formula Modal */}
      <TenseFormulaModal isOpen={isFormulaOpen} onClose={() => setIsFormulaOpen(false)} />

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        mode={
          state.phase !== 'exercise'
            ? 'overview'
            : state.selectedPracticeMode === 'read-the-timeline'
              ? 'read'
              : state.selectedPracticeMode === 'build-the-timeline'
                ? 'build'
                : 'challenge'
        }
      />

      {/* Error toast */}
      {state.error && state.phase !== 'selection' && (
        <ErrorToast
          message={state.error}
          onDismiss={dismissError}
          onRetry={state.phase === 'results' ? () => { dismissError(); void handleSaveProgress(); } : undefined}
        />
      )}

      {/* Points earned toast */}
      {pointsToast && (
        <PointsToast
          key={pointsToast.key}
          points={pointsToast.points}
          message={pointsToast.message}
          onComplete={() => setPointsToast(null)}
        />
      )}
    </div>
  );
}
