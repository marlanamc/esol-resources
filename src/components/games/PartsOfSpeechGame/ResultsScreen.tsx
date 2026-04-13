'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Repeat, CheckCircle, ChevronRight, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { CelebrationAnimation } from '@/components/ui/CelebrationAnimation';
import type { POSGroup, POSRoundResults } from '@/types/parts-of-speech';
import { POS_UNLOCK_THRESHOLD, POS_MASTERY_THRESHOLD, POS_ROUND_LABELS, POS_COLORS, POS_LABELS } from '@/types/parts-of-speech';
import { SpeakButton } from './SpeakButton';

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

  // Show memory card when a Foundation group's Round 1 is passed for the first time
  const isMemoryCardMoment =
    passed &&
    results.roundMode === 'round1' &&
    group.phase === 'foundation' &&
    (group.photoGallery?.length ?? 0) > 0;
  const [memoryCardDismissed, setMemoryCardDismissed] = useState(false);
  const showMemoryCard = isMemoryCardMoment && !memoryCardDismissed;
  const mastered = results.masteryAchieved;
  const nextRoundMode = results.nextStep && results.nextStep in POS_ROUND_LABELS
    ? results.nextStep as keyof typeof POS_ROUND_LABELS
    : null;
  const nextRoundLabel = nextRoundMode ? POS_ROUND_LABELS[nextRoundMode].name : null;

  const accuracyColor = accuracy >= POS_MASTERY_THRESHOLD ? 'text-secondary' : accuracy >= POS_UNLOCK_THRESHOLD ? 'text-primary' : 'text-error';
  const accuracyBg = accuracy >= POS_MASTERY_THRESHOLD ? 'bg-secondary/10' : accuracy >= POS_UNLOCK_THRESHOLD ? 'bg-primary/10' : 'bg-error/10';

  const continueLabel = nextRoundLabel
    ? `Continue to ${nextRoundLabel}`
    : nextGroup
    ? `Next: ${nextGroup.shortTitle}`
    : 'Continue';

  const showConfetti = passed;
  const confettiType = accuracy === 100 ? 'stars' : 'confetti';

  // Unique POS types across all patterns in this group
  const groupPOS = [...new Set(group.patterns.map(p => p.partOfSpeech))];

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      <CelebrationAnimation trigger={showConfetti} type={confettiType} durationMs={3000} />

      {/* ── Memory Card celebration overlay ─────────────────────── */}
      <AnimatePresence>
        {showMemoryCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="w-full max-w-sm bg-white dark:bg-[#162b3d] rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className={`px-6 pt-6 pb-4 text-center ${group.colorClass} border-b-0`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-white/10 flex items-center justify-center text-4xl mx-auto mb-3 shadow-md"
                >
                  {group.icon ?? '📚'}
                </motion.div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">You earned</p>
                <h2 className="font-display text-2xl font-bold text-text leading-tight">
                  The {group.shortTitle} Card!
                </h2>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {groupPOS.map(pos => (
                    <span key={pos} className={`px-3 py-1 rounded-xl text-sm font-bold border-2 ${POS_COLORS[pos]}`}>
                      {POS_LABELS[pos]}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2×2 photo grid */}
              {group.photoGallery && (
                <div className="grid grid-cols-2 gap-2 p-4">
                  {group.photoGallery.map((entry, i) => (
                    <motion.div
                      key={entry.word}
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.08, type: 'spring', stiffness: 280, damping: 22 }}
                      className="relative aspect-square rounded-2xl overflow-hidden border-2 border-border shadow-sm"
                    >
                      <Image
                        src={entry.imageUrl}
                        alt={entry.altText}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 40vw, 200px"
                        unoptimized
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10 pb-3 px-3">
                        {entry.subcategoryLabel && (
                          <p className="text-xs font-bold text-[#f8fafc]/80 uppercase tracking-wider leading-none mb-1">
                            {entry.subcategoryLabel}
                          </p>
                        )}
                        <p className="text-base font-bold text-[#f8fafc] leading-tight">{entry.word}</p>
                      </div>
                      <div className="absolute bottom-2 right-2" onClick={e => e.stopPropagation()}>
                        <SpeakButton text={entry.word} size="sm" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Dismiss button */}
              <div className="px-4 pb-5">
                <motion.button
                  type="button"
                  onClick={() => setMemoryCardDismissed(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary-dark transition-colors"
                >
                  <Star size={16} className="fill-current" />
                  Got it! See my score
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              : nextRoundLabel
              ? `Great work! ${nextRoundLabel} is ready. Keep building this same skill before moving on.`
              : `You passed ${group.title}! ${nextGroup ? `Keep going with ${nextGroup.shortTitle}.` : ''}`
            : `Score ${POS_UNLOCK_THRESHOLD}% or more to pass. You scored ${accuracy}%. Try again!`
          }
        </p>
      </motion.div>

      {/* Round transition */}
      {nextRoundLabel && (
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
                <p className="font-semibold text-sm text-secondary">{results.roundMode.replace('round', 'Round ')}</p>
                <p className="text-xs text-text-muted">Completed</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-text-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <span className="text-primary font-bold text-sm">
                  {nextRoundMode?.replace('round', '')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm text-primary">{nextRoundLabel}</p>
                <p className="text-xs text-text-muted">Next Challenge</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-text-muted mt-3">
            {nextRoundMode === 'round5'
              ? `Score ${POS_MASTERY_THRESHOLD}% for mastery!`
              : 'Complete the next round to keep leveling up this group.'}
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
            {nextRoundLabel
              ? `${nextRoundLabel} will focus on these patterns:`
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
        {passed && nextGroup && !nextRoundLabel && (
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
