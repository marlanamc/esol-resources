'use client';

import { motion } from 'framer-motion';
import { Trophy, Repeat, CheckCircle, ChevronRight, Award, BookOpen } from 'lucide-react';
import { CelebrationAnimation } from '@/components/ui/CelebrationAnimation';
import { GI_FINAL_GROUP_ID, GI_REVIEW_GROUP_ID } from '@/data/gerund-infinitive-groups';
import { REVIEW_UNLOCK_COUNT } from '@/lib/gerund-infinitive-progress';
import { formatMissedPatternsForDisplay } from '@/lib/csv/gerund-infinitive-csv';
import type { GerundInfinitiveGroup, GIRoundResults } from '@/types/gerund-infinitive';
import { GI_UNLOCK_THRESHOLD, GI_MASTERY_THRESHOLD } from '@/types/gerund-infinitive';

interface ResultsScreenProps {
  group: GerundInfinitiveGroup;
  results: GIRoundResults;
  nextGroup: GerundInfinitiveGroup | null;
  completedGroupsCount?: number;
  onRetry: () => void;
  onContinue: () => void;
}

const ACHIEVEMENT_LABELS: Record<string, { emoji: string; label: string }> = {
  'pattern-spotter': { emoji: '🔍', label: 'Pattern Spotter' },
  'preposition-pro': { emoji: '🔗', label: 'Preposition Pro' },
  'to-trap-master': { emoji: '🪤', label: 'TO Trap Master' },
  'meaning-master': { emoji: '⚠️', label: 'Meaning Master' },
  'grammar-guru': { emoji: '🎓', label: 'Grammar Guru' },
};

export function ResultsScreen({ group, results, nextGroup, completedGroupsCount = 0, onRetry, onContinue }: ResultsScreenProps) {
  const { accuracy, correctAnswers, exercisesCompleted, completed, pointsAwarded, streak, newAchievements, missedPatternIds } = results;
  const passed = completed;
  const isFinal = group.id === GI_FINAL_GROUP_ID;
  const returnHref = '/activity/gerund-infinitive-game';
  const isReview = group.id === GI_REVIEW_GROUP_ID;
  const mastered = results.masteryAchieved;

  const accuracyColor = accuracy >= 90 ? 'text-secondary' : accuracy >= GI_UNLOCK_THRESHOLD ? 'text-primary' : 'text-error';
  const accuracyBg = accuracy >= 90 ? 'bg-secondary/10' : accuracy >= GI_UNLOCK_THRESHOLD ? 'bg-primary/10' : 'bg-error/10';

  const continueLabel = isFinal || isReview
    ? 'Continue to Next Level'
    : results.nextStep === 'round2'
    ? 'Continue to Round 2'
    : nextGroup
    ? `Next: ${nextGroup.shortTitle}`
    : 'Continue to Next Level';

  const groupsUntilMixedReview = Math.max(0, REVIEW_UNLOCK_COUNT - completedGroupsCount);
  const showProgressTeaser = passed && nextGroup && groupsUntilMixedReview > 0 && !isReview && !isFinal;
  const showOneMoreNudge = passed && nextGroup && results.nextStep !== 'round2';


  // Trigger confetti on any pass — stars for 100% accuracy, confetti otherwise
  const showConfetti = passed;
  const confettiType = accuracy === 100 ? 'stars' : 'confetti';

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      {/* Confetti animation - 3 seconds to match Irregular Verb Game */}
      <CelebrationAnimation
        trigger={showConfetti}
        type={confettiType}
        durationMs={3000}
      />
      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="flex flex-col items-center text-center pt-4"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-secondary/10' : 'bg-error/10'}`}>
          {passed
            ? mastered
              ? <Trophy size={40} className="text-accent" />
              : <CheckCircle size={40} className="text-secondary" />
            : <BookOpen size={40} className="text-error" />
          }
        </div>

        <h1 className="font-display text-3xl text-text mb-2">
          {mastered ? 'Mastery Achieved! ✦' : passed ? (isFinal ? '🎓 Grammar Guru!' : 'Pattern Passed! ✓') : 'Keep Practicing'}
        </h1>
        <p className="text-text-muted max-w-sm leading-relaxed">
          {passed
            ? mastered
              ? `You have mastered ${group.title}! You can now move on to the next challenge.`
              : results.nextStep === 'round2'
              ? `Great work! You have unlocked Round 2 — targeted practice for your missed patterns.`
              : `You passed ${group.title}! ${nextGroup ? `You can keep going with ${nextGroup.shortTitle} or jump to any other level.` : 'You can jump to any other level from here.'}`
            : `Score ${GI_UNLOCK_THRESHOLD}% or more to pass this pattern group. You scored ${accuracy}%. Try again!`
          }
        </p>
      </motion.div>

      {/* Progress teaser - "X more groups until Mixed Review!" */}
      {showProgressTeaser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 border border-primary/20 text-center"
        >
          <p className="font-display text-lg text-primary-dark dark:text-primary">
            {groupsUntilMixedReview === 1
              ? '1 more group until Mixed Review!'
              : `${groupsUntilMixedReview} more groups until Mixed Review!`}
          </p>
          <p className="text-sm text-text-muted mt-0.5">You&apos;re so close — keep going!</p>
        </motion.div>
      )}

      {/* Round Progress Indicator - shows when advancing to Round 2 */}
      {results.nextStep === 'round2' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border border-blue-200 dark:border-blue-800/50"
        >
          <p className="font-display text-lg text-text mb-3 text-center">Level Progress</p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <CheckCircle size={18} className="text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-secondary">Round 1</p>
                <p className="text-xs text-text-muted">Completed</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-text-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-primary">Round 2</p>
                <p className="text-xs text-text-muted">Next Challenge</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-text-muted mt-3">
            Round 2 is a harder version of this pattern. Score {GI_MASTERY_THRESHOLD}% for mastery!
          </p>
        </motion.div>
      )}

      {/* Score grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <ScoreCard
          label="Accuracy"
          value={`${accuracy}%`}
          sublabel={`${correctAnswers}/${exercisesCompleted} correct`}
          className={`${accuracyColor} ${accuracyBg}`}
          delay={0.25}
        />
        <ScoreCard
          label="Points"
          value={`+${pointsAwarded}`}
          sublabel="earned this round"
          className="text-primary bg-primary/10"
          delay={0.3}
        />
        <ScoreCard
          label="Streak"
          value={`${streak}`}
          sublabel="best in a row"
          className="text-primary-dark bg-accent/10"
          delay={0.35}
        />
      </motion.div>

      {/* Achievements */}
      {newAchievements && newAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="p-5 rounded-2xl bg-accent/10 border border-accent/30 space-y-3"
        >
          <p className="font-display text-lg text-primary-dark flex items-center gap-2">
            <Award size={20} />
            New Achievements!
          </p>
          <div className="flex flex-wrap gap-3">
            {newAchievements.map(id => {
              const badge = ACHIEVEMENT_LABELS[id];
              if (!badge) return null;
              return (
                <motion.div
                  key={id}
                  initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#162b3d] rounded-xl border border-accent/30"
                >
                  <span className="text-xl">{badge.emoji}</span>
                  <span className="font-semibold text-sm text-text">{badge.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Missed patterns - student-friendly labels */}
      {missedPatternIds && missedPatternIds.length > 0 && (() => {
        const displayItems = formatMissedPatternsForDisplay(missedPatternIds.slice(0, 12));
        if (displayItems.length === 0) return null;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-xl bg-error/5 border border-error/20"
          >
            <p className="font-semibold text-text text-sm mb-2">
              {results.nextStep === 'round2'
                ? 'Round 2 will target these patterns — keep them in mind!'
                : 'Focus on these patterns:'}
            </p>
            <div className="space-y-2">
              {displayItems.map(({ label, verbs }) => (
                <div key={label} className="text-sm">
                  <span className="font-medium text-text">{label}</span>
                  {verbs.length > 0 && (
                    <>
                      <span className="text-text-muted"> — </span>
                      <span className="text-error font-medium">{verbs.join(', ')}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="space-y-3 pt-4 border-t border-border"
      >
        {/* "One more?" nudge when passed and next group available */}
        {showOneMoreNudge && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-primary font-semibold"
          >
            You&apos;re on a roll! One more?
          </motion.p>
        )}
        {/* Primary action row */}
        <div className="flex flex-col gap-3">
          {/* Failure: Try Again + Continue */}
          {!passed && (
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={onRetry}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-border bg-white dark:bg-[#162b3d] text-text font-semibold hover:border-primary/40 hover:shadow-md transition-all"
              >
                <Repeat size={18} />
                Try Again
              </motion.button>
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all"
              >
                {continueLabel}
                <ChevronRight size={20} />
              </motion.button>
            </div>
          )}

          {/* Pass: Play Again + Next Level/Continue */}
          {passed && (
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={onRetry}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-border bg-white dark:bg-[#162b3d] text-text font-semibold hover:border-primary/40 hover:shadow-md transition-all"
              >
                <Repeat size={18} />
                Play Again
              </motion.button>
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all"
              >
                {continueLabel}
                <ChevronRight size={20} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Secondary action - Return to game homepage (group selection) */}
        <motion.button
          onClick={() => window.location.href = returnHref}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex flex-col items-center justify-center gap-0.5 px-6 py-3 rounded-2xl border-2 border-dashed border-text-muted/20 text-text-muted hover:text-text hover:border-text-muted/40 transition-all font-medium"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={18} />
            Return to Game
          </span>
          <span className="text-xs opacity-80">Back to group selection</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

function ScoreCard({ label, value, sublabel, className, delay }: {
  label: string; value: string; sublabel: string; className: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`p-4 rounded-2xl text-center ${className} border border-transparent`}
    >
      <div className="font-display text-2xl sm:text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</div>
      <div className="text-xs opacity-60 mt-0.5">{sublabel}</div>
    </motion.div>
  );
}
