'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { ErrorToast } from '@/components/ui/ErrorToast';
import { PointsToast } from '@/components/ui/PointsToast';
import { useRouter } from 'next/navigation';
import { useTimelineTensesState } from './hooks/useTimelineTensesState';
import { TenseFilterBar } from './TenseFilterBar';
import { SentenceFormFilter } from './SentenceFormFilter';
import { PracticeModeBar } from './PracticeModeBar';
import { SentenceToTimelineExercise } from './exercises/SentenceToTimelineExercise';
import { TimelineToVerbExercise } from './exercises/TimelineToVerbExercise';
import { ResultsScreen } from './ResultsScreen';
import { TutorialIntroScreen } from './TutorialIntroScreen';
import { TutorialCompleteScreen } from './TutorialCompleteScreen';
import type { SentenceForm, TenseCategory } from '@/types/activity';
import { filterTimelineQuestions } from './timelineTensesUtils';
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
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

  const {
    state,
    selectTenseFilter,
    selectSentenceForm,
    selectPracticeMode,
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
  } = useTimelineTensesState(activityId, assignmentId);

  // Save progress when round completes
  useEffect(() => {
    if (state.phase === 'results' && state.roundResults) {
      void saveProgress().then((result) => {
        if (result?.pointsAwarded && result.pointsAwarded > 0) {
          setPointsToast({ points: result.pointsAwarded, key: Date.now() });
        }
      });
    }
  }, [state.phase, state.roundResults, saveProgress]);

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
    state.selectedCategory,
    state.selectedPracticeMode,
    state.selectedSentenceForm
  ).length;
  const totalRoundQuestions = state.roundQuestions.length;
  const totalTutorialQuestions = TIMELINE_TUTORIAL_QUESTIONS.length;

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
        {state.phase === 'selection' && (
          <div className="px-3 sm:px-0 pb-2">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
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
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-text mb-3">
                  Timeline Tenses
                </h1>
                <p className="text-text-muted text-lg max-w-2xl mx-auto">
                  Visualize verb tenses on a timeline. Draw timelines from sentences
                  or fill in verbs from timeline diagrams.
                </p>
              </div>

              <TenseFilterBar
                selectedCategory={state.selectedCategory}
                categoryProgress={state.categoryProgress}
                onSelectCategory={(category: TenseCategory | 'all') => selectTenseFilter(category)}
              />

              <div className="mt-6">
                <SentenceFormFilter
                  selectedForm={state.selectedSentenceForm}
                  onSelectForm={(form: SentenceForm | 'all') => selectSentenceForm(form)}
                />
              </div>

              <PracticeModeBar
                selectedPracticeMode={state.selectedPracticeMode}
                onSelectPracticeMode={selectPracticeMode}
              />

              <div className="mt-8 text-center">
                <button
                  onClick={startRound}
                  disabled={availableQuestionCount === 0}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  Start Practice
                </button>
                <p className="mt-4 text-text-muted text-sm">
                  {availableQuestionCount} questions available in this practice style
                </p>
              </div>
            </motion.div>
          )}

          {/* Tutorial Intro Phase */}
          {state.phase === 'tutorial-intro' && (
            <TutorialIntroScreen
              onStart={startTutorial}
              onSkip={skipTutorial}
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
                  <span className="text-sm font-medium text-text-muted">
                    Example {state.tutorialStep + 1} of {totalTutorialQuestions}
                  </span>
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
                    onClick={() => router.back()}
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-text-muted">
                    Question {state.currentQuestionIndex + 1} of {totalRoundQuestions}
                  </span>
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
              {currentQuestion.type === 'sentence-to-timeline' ? (
                <SentenceToTimelineExercise
                  question={currentQuestion}
                  onSubmit={submitAnswer}
                  onNext={nextQuestion}
                  showFeedback={state.showFeedback}
                  lastAnswerCorrect={state.lastAnswerCorrect}
                />
              ) : (
                <TimelineToVerbExercise
                  question={currentQuestion}
                  onSubmit={submitAnswer}
                  onNext={nextQuestion}
                  showFeedback={state.showFeedback}
                  lastAnswerCorrect={state.lastAnswerCorrect}
                />
              )}
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
                onBack={() => router.back()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error toast */}
      {state.error && state.phase !== 'selection' && (
        <ErrorToast
          message={state.error}
          onDismiss={dismissError}
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
