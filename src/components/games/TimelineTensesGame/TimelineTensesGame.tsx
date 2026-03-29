'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  BookMarked,
  BookOpen,
  FlaskConical,
  ChevronRight,
  Info,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { ErrorToast } from '@/components/ui/ErrorToast';
import { PointsToast } from '@/components/ui/PointsToast';
import { GameErrorBoundary } from '@/components/system/ErrorBoundary';
import { useRouter } from 'next/navigation';
import { useTimelineTensesState } from './hooks/useTimelineTensesState';
import { TenseFilterBar } from './TenseFilterBar';
import { SentenceFormFilter } from './SentenceFormFilter';
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
import { useTimelineAudio } from './hooks/useTimelineAudio';
import type { SentenceForm, TenseCategory } from '@/types/activity';
import { categoriesToProgressKey, filterTimelineQuestions, isChallengeMode } from './timelineTensesUtils';
import {
  TIMELINE_TUTORIAL_QUESTIONS,
  TUTORIAL_HINTS,
} from '@/data/timeline-tenses-tutorial';

interface TimelineTensesGameProps {
  activityId: string;
  assignmentId?: string | null;
}

export function TimelineTensesGame({ activityId, assignmentId }: TimelineTensesGameProps) {
  const router = useRouter();
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const lastProcessedResultsKeyRef = useRef<string | null>(null);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const { playLevelUp } = useTimelineAudio();

  const {
    state,
    toggleTenseCategory,
    selectSentenceForm,
    selectPracticeMode,
    startLab,
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

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-border border-t-primary"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-muted font-display text-lg"
          >
            Loading timeline activity...
          </motion.p>
        </motion.div>
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

  const currentQuestion = state.roundQuestions[state.currentQuestionIndex];
  const currentTutorialQuestion = TIMELINE_TUTORIAL_QUESTIONS[state.tutorialStep];
  const currentTutorialHint = currentTutorialQuestion
    ? TUTORIAL_HINTS[currentTutorialQuestion.id]
    : undefined;
  const availableQuestionCount = filterTimelineQuestions(
    state.questionBank,
    state.selectedCategories,
    state.selectedPracticeMode,
    state.selectedSentenceForm
  ).length;
  const totalRoundQuestions = state.roundQuestions.length;
  const totalTutorialQuestions = TIMELINE_TUTORIAL_QUESTIONS.length;

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

  const TENSE_LABELS: Record<string, string> = {
    all: 'All Tenses',
    simple: 'Simple',
    continuous: 'Continuous',
    perfect: 'Perfect',
    'perfect-continuous': 'Perfect Continuous',
    mixed: 'Mixed',
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

  return (
    <div
      ref={contentScrollRef}
      className="fixed inset-0 overflow-y-auto overscroll-contain bg-bg touch-manipulation"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-0"
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
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-primary-dark mb-6"
                >
                  <BookOpen size={18} />
                  <span className="text-xs font-black tracking-[0.2em] uppercase">Timeline Practice</span>
                </motion.div>

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
                {/* Timeline Practice Lab */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={startLab}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-amber-200/70 bg-gradient-to-r from-[#ffe5b8] via-[#ffd3dc] to-[#cdeeff] px-6 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-slate-900 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.42)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_42px_-18px_rgba(14,116,144,0.35)] dark:border-white/10 dark:from-amber-400/20 dark:via-rose-400/20 dark:to-cyan-400/20 dark:text-white"
                  >
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_30%)] opacity-90 transition-opacity group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />
                    <span className="absolute inset-[1px] rounded-full bg-gradient-to-r from-[#fff1cf]/90 via-[#ffe0ea]/80 to-[#e0f5ff]/90 dark:from-amber-300/12 dark:via-rose-300/10 dark:to-cyan-300/12" />
                    <span className="relative flex items-center gap-3">
                      <FlaskConical size={18} />
                      <span>Timeline Practice Lab</span>
                    </span>
                  </button>
                </motion.div>

                {/* Step 1: Choose Tenses */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <StepLabel step={1} label="Choose Your Tenses" />
                  <p className="text-sm text-text-muted/60 font-medium mb-5 -mt-2">
                    Pick one tense to focus on, or mix a few together for variety.
                  </p>
                  <TenseFilterBar
                    selectedCategories={state.selectedCategories}
                    categoryProgress={state.categoryProgress}
                    onToggleCategory={toggleTenseCategory}
                  />
                </motion.div>

                {/* Step 2: Choose Mode */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <StepLabel step={2} label="Choose Your Mode" />
                  <ModeSelector
                    selectedMode={state.selectedPracticeMode}
                    categoryProgress={state.categoryProgress}
                    onSelectMode={selectPracticeMode}
                  />
                </motion.div>

                {/* Start Game */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-12 rounded-[2rem] border border-white/30 bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl p-5 sm:p-6 shadow-xl"
                >
                  {/* Sentence Form — compact pills, hidden for challenge modes */}
                  {!isChallengeMode(state.selectedPracticeMode) && (
                    <div className="mb-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted/50 mb-3">
                        Sentence Form
                      </p>
                      <SentenceFormFilter
                        selectedForm={state.selectedSentenceForm}
                        onSelectForm={(form: SentenceForm | 'all') => selectSentenceForm(form)}
                        compact
                      />
                    </div>
                  )}

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

                </motion.div>
              </div>
            </motion.div>
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
                  <motion.div
                    className="h-full bg-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((state.tutorialStep + 1) / totalTutorialQuestions) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
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
                    <button
                      onClick={() => setIsFormulaOpen(true)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title="Tense Formulas"
                      aria-label="Show tense formulas"
                    >
                      <BookMarked size={18} />
                    </button>
                    {(state.selectedPracticeMode === 'build-the-timeline' || state.selectedPracticeMode === 'read-the-timeline') && (
                      <button
                        onClick={() => {
                          if (state.selectedPracticeMode === 'build-the-timeline') {
                            startTutorial();
                          } else {
                            setIsHowToPlayOpen(true);
                          }
                        }}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="Help"
                      >
                        <HelpCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: totalRoundQuestions > 0
                        ? `${((state.currentQuestionIndex + 1) / totalRoundQuestions) * 100}%`
                        : '0%'
                    }}
                    transition={{ duration: 0.3 }}
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
              <TimelineLab onBack={retryRound} onOpenFormulas={() => setIsFormulaOpen(true)} />
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
          state.phase === 'exercise'
            ? state.selectedPracticeMode === 'read-the-timeline' ? 'read'
              : state.selectedPracticeMode === 'build-the-timeline' ? 'build'
              : 'overview'
            : 'overview'
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
          onComplete={() => setPointsToast(null)}
        />
      )}
    </div>
  );
}
