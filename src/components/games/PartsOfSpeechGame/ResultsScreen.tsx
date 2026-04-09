'use client';

import { motion } from 'framer-motion';
import { Trophy, Repeat, CheckCircle, ChevronRight, BookOpen } from 'lucide-react';
import { CelebrationAnimation } from '@/components/ui/CelebrationAnimation';
import type { POSGroup, POSRoundResults } from '@/types/parts-of-speech';
import { POS_UNLOCK_THRESHOLD, POS_MASTERY_THRESHOLD } from '@/types/parts-of-speech';

interface ResultsScreenProps {
  group: POSGroup;
  results: POSRoundResults;
  nextGroup: POSGroup | null;
  onRetry: () => void;
  onContinue: () => void;
  onReturnToSelection: () => void;
}

export function ResultsScreen({ group, results, nextGroup, onRetry, onContinue, onReturnToSelection }: ResultsScreenProps) {
  const { accuracy, correctAnswers, exercisesCompleted, completed, pointsAwarded, streak, missedPatternIds } = results;
  const passed = completed;
  const mastered = results.masteryAchieved;

  const accuracyColor = accuracy >= POS_MASTERY_THRESHOLD ? 'text-secondary' : accuracy >= POS_UNLOCK_THRESHOLD ? 'text-primary' : 'text-error';
  const accuracyBg = accuracy >= POS_MASTERY_THRESHOLD ? 'bg-secondary/10' : accuracy >= POS_UNLOCK_THRESHOLD ? 'bg-primary/10' : 'bg-error/10';

  const continueLabel = results.nextStep === 'round2'
    ? 'Continue to Round 2'
    : nextGroup
    ? `Next: ${nextGroup.shortTitle}`
    : 'Continue';

  const showConfetti = passed;
  const confettiType = accuracy === 100 ? 'stars' : 'confetti';

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      <CelebrationAnimation trigger={showConfetti} type={confettiType} durationMs={3000} />

      {/* Status */}
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
          {mastered
            ? 'Mastery Achieved! ✦'
            : passed
            ? 'Level Passed! ✓'
            : 'Keep Practicing'}
        </h1>
        <p className="text-text-muted max-w-sm leading-relaxed">
          {passed
            ? mastered
              ? `You have mastered ${group.title}!`
              : results.nextStep === 'round2'
              ? `Great work! You unlocked Round 2 — targeted practice for your tricky patterns.`
              : `You passed ${group.title}! ${nextGroup ? `Keep going with ${nextGroup.shortTitle}.` : ''}`
            : `Score ${POS_UNLOCK_THRESHOLD}% or more to pass. You scored ${accuracy}%. Try again!`
          }
        </p>
      </motion.div>

      {/* Round 2 transition */}
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
            Score {POS_MASTERY_THRESHOLD}% for mastery!
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

      {/* Missed patterns */}
      {missedPatternIds && missedPatternIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-error/5 border border-error/20"
        >
          <p className="font-semibold text-text text-sm mb-2">
            {results.nextStep === 'round2'
              ? 'Round 2 will focus on these patterns:'
              : 'Review these patterns:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {missedPatternIds.slice(0, 8).map(id => (
              <span key={id} className="text-xs px-2 py-1 rounded-lg bg-error/10 text-error font-medium">
                {id.split('-').slice(2).join(' ') || id}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="space-y-3 pt-4 border-t border-border"
      >
        {passed && nextGroup && results.nextStep !== 'round2' && (
          <p className="text-center text-primary font-semibold">You&apos;re on a roll! One more?</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-border bg-white dark:bg-[#162b3d] text-text font-semibold hover:border-primary/40 transition-all"
          >
            <Repeat size={18} />
            {passed ? 'Play Again' : 'Try Again'}
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

        <motion.button
          onClick={onReturnToSelection}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex flex-col items-center justify-center gap-0.5 px-6 py-3 rounded-2xl border-2 border-dashed border-text-muted/20 text-text-muted hover:text-text hover:border-text-muted/40 transition-all font-medium"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={18} />
            Return to Game
          </span>
          <span className="text-xs opacity-70">Back to group selection</span>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-2xl text-center ${className} border border-transparent`}
    >
      <div className="font-display text-2xl sm:text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</div>
      <div className="text-xs opacity-60 mt-0.5">{sublabel}</div>
    </motion.div>
  );
}
