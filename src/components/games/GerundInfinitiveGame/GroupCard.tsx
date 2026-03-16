'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Star } from 'lucide-react';
import { getGroupStage } from '@/lib/gerund-infinitive-progress';
import type { GerundInfinitiveGroup, GIGroupProgress } from '@/types/gerund-infinitive';

interface GroupCardProps {
  group: GerundInfinitiveGroup;
  progress?: GIGroupProgress;
  unlocked: boolean;
  onClick: () => void;
}

export function GroupCard({ group, progress, unlocked, onClick }: GroupCardProps) {
  const stage = getGroupStage(progress);
  const accuracy = progress?.accuracy ?? 0;
  const attempts = progress?.attempts ?? 0;
  const mastered = stage === 'mastered';
  const passed = stage === 'passed';
  const started = attempts > 0;

  // Derive visual state
  const cardState: 'locked' | 'unlocked' | 'started' | 'passed' | 'mastered' =
    !unlocked ? 'locked'
    : mastered ? 'mastered'
    : passed ? 'passed'
    : started ? 'started'
    : 'unlocked';

  const stateStyles = {
    locked: 'bg-white dark:bg-[#162b3d] border-border opacity-60 cursor-not-allowed',
    unlocked: 'bg-white dark:bg-[#162b3d] border-border hover:border-primary/40 hover:shadow-md cursor-pointer',
    started: 'bg-white dark:bg-[#162b3d] border-primary/40 hover:shadow-md cursor-pointer',
    passed: 'bg-secondary/5 border-secondary/30 hover:shadow-md cursor-pointer',
    mastered: 'bg-accent/10 border-accent/40 hover:shadow-lg cursor-pointer',
  };

  const stateLabel = {
    locked: null,
    unlocked: null,
    started: accuracy > 0 ? `${accuracy}% last try` : 'In progress',
    passed: 'Passed ✓',
    mastered: 'Mastered ✦',
  };

  const iconBg = {
    locked: 'bg-bg-gray text-text-muted',
    unlocked: 'bg-primary/10 text-primary',
    started: 'bg-primary/10 text-primary',
    passed: 'bg-secondary/10 text-[#3d6b47] dark:text-secondary',
    mastered: 'bg-accent/20 text-primary-dark',
  };

  return (
    <motion.button
      onClick={unlocked ? onClick : undefined}
      disabled={!unlocked}
      whileHover={unlocked ? { y: -2, scale: 1.01 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
      transition={{ duration: 0.18 }}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${stateStyles[cardState]}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${iconBg[cardState]}`}>
          {!unlocked ? <Lock size={16} /> : group.icon ?? '📚'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-display text-base text-text leading-tight truncate">{group.shortTitle}</h3>
            {mastered && <Star size={14} className="text-accent flex-shrink-0" fill="currentColor" />}
            {passed && !mastered && <CheckCircle size={14} className="text-secondary flex-shrink-0" />}
          </div>

          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{group.patternExample}</p>

          {/* Round indicator - show for unlocked groups; checkpoints have single round */}
          {unlocked && !group.isCheckpoint && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-medium text-text-muted">2 Rounds:</span>
              {/* Round 1 dot */}
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  progress?.round1?.passed ? 'bg-secondary' : 'bg-border'
                }`}
                title={progress?.round1?.passed ? 'Round 1: Passed' : 'Round 1: Discover'}
              />
              {/* Round 2 dot */}
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  progress?.round2?.passed ? 'bg-secondary' : 'bg-border'
                }`}
                title={progress?.round2?.passed ? 'Round 2: Mastered' : 'Round 2: Master'}
              />
            </div>
          )}
          {unlocked && group.isCheckpoint && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-medium text-text-muted">Review</span>
            </div>
          )}

          {stateLabel[cardState] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                mastered
                  ? 'bg-accent/20 text-primary-dark'
                  : passed
                  ? 'bg-secondary/15 text-[#3d6b47] dark:text-secondary'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {stateLabel[cardState]}
            </motion.div>
          )}
        </div>
      </div>

      {/* Progress bar for started/passed */}
      {(started || passed || mastered) && accuracy > 0 && (
        <div className="mt-3 h-1.5 bg-bg-gray rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-full rounded-full ${mastered ? 'bg-accent' : passed ? 'bg-secondary' : 'bg-primary'}`}
          />
        </div>
      )}

      {!unlocked && group.prerequisite && (
        <p className="mt-2 text-xs text-text-muted opacity-70 flex items-center gap-1">
          <Lock size={10} />
          Complete the previous group to unlock
        </p>
      )}
    </motion.button>
  );
}
