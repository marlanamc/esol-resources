'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { ErrorToast } from '@/components/ui/ErrorToast';
import { PointsToast } from '@/components/ui/PointsToast';
import { useRouter } from 'next/navigation';
import { useResolvedLearnerReturnHref } from '@/hooks/useResolvedLearnerReturnHref';
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
  const returnHref = useResolvedLearnerReturnHref({ fallbackHref: '/dashboard' });
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
  const isCourseMapPreset = gameContent?.courseMapPreset === true;
  // A wrapper that pins an exact round and never resumes (Week 2's Word Sort)
  // replays that one round on every visit. The Round 1 walkthrough is the
  // teaching screen for a learner meeting a group for the first time -- in
  // front of a drill it is a long lecture, and both intro screens advertise a
  // "rounds to mastery" ladder this activity can never climb.
  const isPinnedRound =
    isCourseMapPreset && !!gameContent?.roundMode && gameContent?.resumeFromProgress !== true;
  const courseMapTitle = gameContent?.courseMapTitle ?? 'Course Map Activity';
  const courseMapDirections =
    gameContent?.courseMapDirections ?? 'Follow this guided step. You do not need to choose settings.';

  // Rendered identically across the loading, error, and play states so the guided banner is
  // present on the very first paint — no pop-in / content shift when the game finishes loading.
  const renderCourseMapBanner = (showDirections: boolean) =>
    isCourseMapPreset ? (
      <div className="mb-4 rounded-2xl border border-[var(--tone-vocab-accent,#6a8d73)]/25 bg-[var(--tone-vocab-surface,rgba(106,141,115,0.08))] px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--tone-vocab-accent,#6a8d73)]">
          Guided Course Map Step
        </p>
        <h1 className="mt-1 text-lg font-display font-bold text-text">{courseMapTitle}</h1>
        {/*
          Directions belong on the way in. Once the learner is playing, the
          exercise card states the same thing, and a banner repeating it is one
          more block of text between them and the word they are sorting.
        */}
        {showDirections && (
          <p className="mt-1 text-sm leading-snug text-text-muted">{courseMapDirections}</p>
        )}
      </div>
    ) : null;

  const courseMapBanner = renderCourseMapBanner(true);

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
      <div className="fixed inset-0 bg-bg flex flex-col">
        {courseMapBanner && (
          <div className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10">
            {isCourseMapPreset && (
              <div className="px-3 sm:px-0 pb-3 flex items-center">
                <button
                  type="button"
                  onClick={() => router.push(returnHref)}
                  aria-label="Back to Course Map"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-sm font-medium text-text hover:bg-bg-light dark:hover:bg-white/5 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <ArrowLeft size={16} className="shrink-0" />
                  <span>Back to Course Map</span>
                </button>
              </div>
            )}
            {courseMapBanner}
          </div>
        )}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-border border-t-primary animate-spin" />
            <p className="text-text-muted font-display text-lg">
              Preparing your lesson...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state.error && state.phase === 'selection') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-0 bg-bg flex items-center justify-center p-4"
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
        {/* Back navigation in the upper left */}
        {state.phase !== 'exercise' && (
          <div className="px-3 sm:px-0 pb-3 flex items-center">
            {isCourseMapPreset ? (
              <button
                type="button"
                onClick={() => router.push(returnHref)}
                aria-label="Back to Course Map"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-sm font-medium text-text hover:bg-bg-light dark:hover:bg-white/5 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <ArrowLeft size={16} className="shrink-0" />
                <span>Back to Course Map</span>
              </button>
            ) : state.phase === 'selection' ? (
              <button
                type="button"
                onClick={() => router.push(returnHref)}
                aria-label="Go back"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-text-muted hover:text-text transition-colors shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
            ) : state.phase === 'intro' ? (
              <button
                type="button"
                onClick={quitGame}
                aria-label="Go back"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 text-text-muted hover:text-text transition-colors shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
            ) : null}
          </div>
        )}

        {state.phase === 'exercise' ? null : renderCourseMapBanner(true)}

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
              {state.selectedRoundMode === 'round1' && !state.selectedGroup.isCheckpoint && !isPinnedRound ? (
                <PatternWalkthroughScreen
                  group={state.selectedGroup}
                  roundMode={state.selectedRoundMode}
                  onStartChallenge={startGroupChallenge}
                  onBack={isCourseMapPreset ? () => router.push(returnHref) : quitGame}
                />
              ) : (
                <PatternIntroScreen
                  group={state.selectedGroup}
                  roundMode={state.selectedRoundMode}
                  onStartChallenge={startGroupChallenge}
                  onBack={isCourseMapPreset ? () => router.push(returnHref) : quitGame}
                  hideRoundLadder={isPinnedRound}
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
              className="flex min-h-full flex-1 flex-col"
            >
              <ExerciseScreen
                group={state.selectedGroup}
                exercises={state.exercises}
                currentIndex={state.currentExerciseIndex}
                roundMode={state.selectedRoundMode}
                onAnswer={submitAnswer}
                onBack={isCourseMapPreset ? () => router.push(returnHref) : returnToGroupIntro}
                minimalChrome={isPinnedRound}
                titleOverride={isPinnedRound ? courseMapTitle : undefined}
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
                onContinue={isCourseMapPreset ? () => router.push(returnHref) : continueToNext}
                onReturnToSelection={isCourseMapPreset ? () => router.push(returnHref) : quitGame}
                courseMapPreset={isCourseMapPreset}
                pinnedRound={isPinnedRound}
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
