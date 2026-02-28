'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VERB_GROUPS } from '@/data/irregular-verbs-groups';
import { useVerbGameState } from '@/hooks/useVerbGameState';
import { useVerbPreferences } from '@/hooks/useVerbPreferences';
import { GroupSelectionScreen } from './GroupSelectionScreen';
import { IntroScreen } from './IntroScreen';
import { ExerciseScreen } from './ExerciseScreen';
import { ResultsScreen } from './ResultsScreen';
import type { VerbGroup } from '@/types/irregular-verbs';

interface IrregularVerbsGameProps {
  activityId: string;
}

export function IrregularVerbsGame({ activityId }: IrregularVerbsGameProps) {
  const router = useRouter();
  const { preferences } = useVerbPreferences();
  const {
    state,
    selectGroup,
    startGroupChallenge,
    returnToGroupIntro,
    submitAnswer,
    saveProgress,
    retryGroup,
    continueToNext,
    quitGame
  } =
    useVerbGameState(activityId, preferences?.hideVerbExplanations ?? false);

  useEffect(() => {
    if (state.phase === 'results' && state.roundResults) {
      saveProgress(state.roundResults);
    }
  }, [state.phase, state.roundResults, saveProgress]);

  // Loading state - elegant spinner
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
            Preparing your lesson...
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
        <div className="max-w-md w-full p-8 bg-white rounded-2xl border border-border shadow-lg text-center">
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

  return (
    <div className="min-h-screen bg-bg">
      {/* Very subtle grain texture overlay - kept light for readability */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.08] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative z-10 mx-auto ${
          state.phase === 'exercise'
            ? 'w-full max-w-none px-0 py-2 sm:max-w-5xl sm:px-6 sm:py-10'
            : 'max-w-5xl px-4 sm:px-6 py-6 sm:py-10'
        }`}
      >
        <div className="px-3 sm:px-0 pb-2">
          <button
            onClick={() => {
              if (state.phase === 'selection') {
                router.back();
                return;
              }
              if (state.phase === 'intro') {
                quitGame();
                return;
              }
              returnToGroupIntro();
            }}
            aria-label="Go back"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border border-border text-text-muted hover:text-text hover:border-border-dark transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {state.phase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <GroupSelectionScreen
                categoryData={state.categoryData}
                onSelectGroup={(group: VerbGroup) => selectGroup(group)}
              />
            </motion.div>
          )}

          {state.phase === 'exercise' && state.selectedGroup && (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <ExerciseScreen
                group={state.selectedGroup}
                exercises={state.exercises}
                currentIndex={state.currentExerciseIndex}
                showPattern={!preferences?.hideVerbExplanations || preferences === undefined}
                onAnswer={submitAnswer}
              />
            </motion.div>
          )}

          {state.phase === 'intro' && state.selectedGroup && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <IntroScreen
                group={state.selectedGroup}
                onStartChallenge={startGroupChallenge}
              />
            </motion.div>
          )}

          {state.phase === 'results' && state.selectedGroup && state.roundResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <ResultsScreen
                group={state.selectedGroup}
                results={state.roundResults}
                nextGroup={
                  state.roundResults.unlocked && state.selectedGroup
                    ? VERB_GROUPS[VERB_GROUPS.findIndex(g => g.id === state.selectedGroup!.id) + 1] ?? null
                    : null
                }
                onRetry={retryGroup}
                onContinue={continueToNext}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
