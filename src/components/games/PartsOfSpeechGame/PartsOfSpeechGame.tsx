'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { ErrorToast } from '@/components/ui/ErrorToast';
import { PointsToast } from '@/components/ui/PointsToast';
import { useRouter } from 'next/navigation';
import { ALL_POS_GROUPS } from '@/data/parts-of-speech-groups';
import { usePartsOfSpeechGameState } from '@/hooks/usePartsOfSpeechGameState';
import { GroupSelectionScreen } from './GroupSelectionScreen';
import { PatternIntroScreen } from './PatternIntroScreen';
import { PatternWalkthroughScreen } from './PatternWalkthroughScreen';
import { ExerciseScreen } from './ExerciseScreen';
import { ResultsScreen } from './ResultsScreen';
import type { PartsOfSpeechContent } from '@/types/parts-of-speech';
import type { POSGroup } from '@/types/parts-of-speech';

interface PartsOfSpeechGameProps {
  activityId: string;
  gameContent?: PartsOfSpeechContent | null;
}

export function PartsOfSpeechGame({ activityId, gameContent }: PartsOfSpeechGameProps) {
  const router = useRouter();
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

  const {
    state,
    selectGroup,
    startGroupChallenge,
    submitAnswer,
    saveProgress,
    retryGroup,
    returnToGroupIntro,
    continueToNext,
    quitGame,
    resetProgress,
    dismissSaveError,
    dismissLockedGroupError,
    isGroupUnlocked,
  } = usePartsOfSpeechGameState(activityId, { gameContent });

  // Save progress when round ends
  useEffect(() => {
    if (state.phase === 'results' && state.roundResults) {
      void saveProgress(state.roundResults).then(result => {
        if (result?.pointsAwarded && result.pointsAwarded > 0) {
          setPointsToast({ points: result.pointsAwarded, key: Date.now() });
        }
      });
    }
  }, [state.phase, state.roundResults, saveProgress]);

  // Scroll to top on phase change
  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [state.phase, state.currentExerciseIndex, state.selectedGroup?.id]);

  // Helper: get next group for results screen
  const getNextGroupForResults = (): POSGroup | null => {
    if (!state.roundResults?.unlocked || !state.selectedGroup) return null;
    const currentIndex = ALL_POS_GROUPS.findIndex(g => g.id === state.selectedGroup!.id);
    if (currentIndex < 0) return null;
    return ALL_POS_GROUPS[currentIndex + 1] ?? null;
  };

  // Loading state - uses CSS animation to avoid main thread work
  if (state.loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-border border-t-primary animate-spin" />
          <p className="text-text-muted font-display text-lg">
            Preparing your lesson...
          </p>
        </div>
      </div>
    );
  }

  if (state.error && state.phase === 'selection') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-bg flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full p-8 bg-white dark:bg-[#162b3d] rounded-2xl border border-border shadow-lg text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <AlertCircle size={32} className="text-error" />
          </div>
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
    <div
      ref={contentScrollRef}
      className="fixed inset-0 overflow-y-auto overscroll-contain bg-bg touch-manipulation"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3Ccircle cx='25' cy='10' r='0.8'/%3E%3Ccircle cx='45' cy='3' r='1'/%3E%3Ccircle cx='15' cy='25' r='0.6'/%3E%3Ccircle cx='35' cy='20' r='1'/%3E%3Ccircle cx='55' cy='28' r='0.7'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative z-10 mx-auto flex min-h-full w-full flex-col ${
          state.phase === 'exercise'
            ? 'w-full max-w-none px-0 py-2 sm:max-w-5xl sm:px-6 sm:py-10'
            : 'max-w-5xl px-4 py-6 sm:px-6 sm:py-10'
        }`}
      >
        {/* Back button — selection */}
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

        {/* Back button — intro (desktop only) */}
        {state.phase === 'intro' && (
          <div className="hidden sm:block px-3 sm:px-0 pb-2">
            <button
              onClick={quitGame}
              aria-label="Go back"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        )}

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
                onSelectGroup={selectGroup}
                isGroupUnlocked={isGroupUnlocked}
                onResetProgress={resetProgress}
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
              {state.selectedRoundMode === 'round1' && !state.selectedGroup.isCheckpoint ? (
                <PatternWalkthroughScreen
                  group={state.selectedGroup}
                  roundMode={state.selectedRoundMode}
                  onStartChallenge={startGroupChallenge}
                  onBack={quitGame}
                />
              ) : (
                <PatternIntroScreen
                  group={state.selectedGroup}
                  roundMode={state.selectedRoundMode}
                  onStartChallenge={startGroupChallenge}
                  onBack={quitGame}
                />
              )}
            </motion.div>
          )}

          {state.phase === 'exercise' && state.selectedGroup && (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex min-h-full flex-col"
            >
              <ExerciseScreen
                group={state.selectedGroup}
                exercises={state.exercises}
                currentIndex={state.currentExerciseIndex}
                roundMode={state.selectedRoundMode}
                onAnswer={submitAnswer}
                onBack={returnToGroupIntro}
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
                nextGroup={getNextGroupForResults()}
                onRetry={retryGroup}
                onContinue={continueToNext}
                onReturnToSelection={quitGame}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {state.saveError && (
        <ErrorToast message={state.saveError} onDismiss={dismissSaveError} />
      )}
      {state.lockedGroupError && (
        <ErrorToast message={state.lockedGroupError} onDismiss={dismissLockedGroupError} />
      )}
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
