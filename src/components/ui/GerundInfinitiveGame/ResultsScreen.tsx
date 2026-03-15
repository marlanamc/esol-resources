'use client';

import { motion } from 'framer-motion';
import { Trophy, Repeat, CheckCircle, ChevronRight, Award, BookOpen } from 'lucide-react';
import CelebrationAnimation from '@/components/ui/CelebrationAnimation';
import { GI_FINAL_GROUP_ID, GI_REVIEW_GROUP_ID } from '@/data/gerund-infinitive-groups';
import type { GerundInfinitiveGroup, GIRoundResults } from '@/types/gerund-infinitive';
import { GI_UNLOCK_THRESHOLD } from '@/types/gerund-infinitive';

interface ResultsScreenProps {
  group: GerundInfinitiveGroup;
  results: GIRoundResults;
  nextGroup: GerundInfinitiveGroup | null;
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

export function ResultsScreen({ group, results, nextGroup, onRetry, onContinue }: ResultsScreenProps) {
  const { accuracy, correctAnswers, exercisesCompleted, completed, pointsAwarded, streak, newAchievements, missedPatternIds } = results;
  const passed = completed;
  const isFinal = group.id === GI_FINAL_GROUP_ID;
  const isReview = group.id === GI_REVIEW_GROUP_ID;
  const mastered = results.masteryAchieved;

  const accuracyColor = accuracy >= 90 ? 'text-secondary' : accuracy >= GI_UNLOCK_THRESHOLD ? 'text-primary' : 'text-error';
  const accuracyBg = accuracy >= 90 ? 'bg-secondary/10' : accuracy >= GI_UNLOCK_THRESHOLD ? 'bg-primary/10' : 'bg-error/10';

  const continueLabel = isFinal || isReview
    ? 'Return to Groups'
    : results.nextStep === 'round2'
    ? 'Continue to Round 2'
    : nextGroup
    ? `Next: ${nextGroup.shortTitle}`
    : 'Return to Groups';

  // Trigger confetti on group pass or mastery
  const showConfetti = passed && (mastered || results.nextStep === 'round2');

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      {/* Confetti animation */}
      <CelebrationAnimation
        trigger={showConfetti}
        type={mastered ? "stars" : "confetti"}
        durationMs={3500}
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
              : `You passed ${group.title}! ${nextGroup ? `${nextGroup.shortTitle} is now unlocked!` : 'All groups complete!'}`
            : `Score ${GI_UNLOCK_THRESHOLD}% or more to pass this pattern group. You scored ${accuracy}%. Try again!`
          }
        </p>
      </motion.div>

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

      {/* Missed patterns */}
      {missedPatternIds && missedPatternIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-error/5 border border-error/20"
        >
          <p className="font-semibold text-text text-sm mb-2">Patterns to review:</p>
          <div className="flex flex-wrap gap-2">
            {missedPatternIds.slice(0, 6).map((id: string) => (
              <span key={id} className="px-2 py-0.5 rounded bg-error/10 text-error text-xs font-mono">
                {id.replace('special-', '').replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        <button
          onClick={onRetry}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-text-muted hover:text-text hover:border-border-dark transition-colors font-semibold"
        >
          <Repeat size={16} />
          Try Again
        </button>
        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          {continueLabel}
          <ChevronRight size={18} />
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
