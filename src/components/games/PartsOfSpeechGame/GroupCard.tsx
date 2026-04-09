'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Lock, Star } from 'lucide-react';
import type { POSGroup, POSGroupProgress } from '@/types/parts-of-speech';

interface GroupCardProps {
  group: POSGroup;
  progress?: POSGroupProgress;
  locked?: boolean;
  onClick: () => void;
}

// Maps each group colorClass to accent colors — all values spelled out for Tailwind JIT
const COLOR_ACCENTS: Record<string, { bar: string; iconBg: string; iconText: string }> = {
  'bg-red-50 border-red-300':          { bar: 'bg-red-300',    iconBg: 'bg-red-100',    iconText: 'text-red-800' },
  'bg-red-50 border-red-400':          { bar: 'bg-red-400',    iconBg: 'bg-red-100',    iconText: 'text-red-800' },
  'bg-blue-50 border-blue-300':        { bar: 'bg-blue-300',   iconBg: 'bg-blue-100',   iconText: 'text-blue-800' },
  'bg-blue-50 border-blue-400':        { bar: 'bg-blue-400',   iconBg: 'bg-blue-100',   iconText: 'text-blue-800' },
  'bg-green-50 border-green-300':      { bar: 'bg-green-300',  iconBg: 'bg-green-100',  iconText: 'text-green-800' },
  'bg-gray-50 border-gray-300':        { bar: 'bg-gray-300',   iconBg: 'bg-gray-100',   iconText: 'text-gray-700' },
  'bg-yellow-50 border-yellow-400':    { bar: 'bg-yellow-400', iconBg: 'bg-yellow-100', iconText: 'text-yellow-800' },
  'bg-amber-50 border-amber-300':      { bar: 'bg-amber-300',  iconBg: 'bg-amber-100',  iconText: 'text-amber-800' },
  'bg-amber-50 border-amber-400':      { bar: 'bg-amber-400',  iconBg: 'bg-amber-100',  iconText: 'text-amber-800' },
  'bg-purple-50 border-purple-300':    { bar: 'bg-purple-300', iconBg: 'bg-purple-100', iconText: 'text-purple-800' },
  'bg-purple-50 border-purple-400':    { bar: 'bg-purple-400', iconBg: 'bg-purple-100', iconText: 'text-purple-800' },
  'bg-teal-50 border-teal-300':        { bar: 'bg-teal-300',   iconBg: 'bg-teal-100',   iconText: 'text-teal-800' },
  'bg-teal-50 border-teal-400':        { bar: 'bg-teal-400',   iconBg: 'bg-teal-100',   iconText: 'text-teal-800' },
  'bg-orange-50 border-orange-300':    { bar: 'bg-orange-300', iconBg: 'bg-orange-100', iconText: 'text-orange-800' },
  'bg-orange-50 border-orange-400':    { bar: 'bg-orange-400', iconBg: 'bg-orange-100', iconText: 'text-orange-800' },
  'bg-violet-50 border-violet-300':    { bar: 'bg-violet-300', iconBg: 'bg-violet-100', iconText: 'text-violet-800' },
  'bg-violet-50 border-violet-400':    { bar: 'bg-violet-400', iconBg: 'bg-violet-100', iconText: 'text-violet-800' },
  'bg-gradient-to-r from-violet-50 to-red-50 border-violet-400':
                                        { bar: 'bg-violet-400', iconBg: 'bg-violet-100', iconText: 'text-violet-800' },
  'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-500':
                                        { bar: 'bg-yellow-500', iconBg: 'bg-yellow-100', iconText: 'text-yellow-800' },
};

const FALLBACK_ACCENT = { bar: 'bg-primary/40', iconBg: 'bg-primary/10', iconText: 'text-primary' };

function getStage(progress?: POSGroupProgress): 'not-started' | 'in-progress' | 'passed' | 'mastered' {
  if (!progress) return 'not-started';
  if (progress.stage === 'mastered') return 'mastered';
  const highest = progress.highestRoundPassed ?? 0;
  if (highest >= 2) return 'in-progress';
  if (highest >= 1) return 'passed';
  return 'not-started';
}

export function GroupCard({ group, progress, locked = false, onClick }: GroupCardProps) {
  const stage = getStage(progress);
  const accuracy = progress?.accuracy ?? 0;
  const attempts = progress?.attempts ?? 0;
  const mastered = stage === 'mastered';
  const inProgress = stage === 'in-progress';
  const passed = stage === 'passed';
  const started = attempts > 0;
  const highestRound = progress?.highestRoundPassed ?? 0;

  const cardState: 'locked' | 'unlocked' | 'started' | 'passed' | 'in-progress' | 'mastered' =
    locked ? 'locked'
    : mastered ? 'mastered'
    : inProgress ? 'in-progress'
    : passed ? 'passed'
    : started ? 'started'
    : 'unlocked';

  const accent = COLOR_ACCENTS[group.colorClass] ?? FALLBACK_ACCENT;

  const stateStyles: Record<typeof cardState, string> = {
    locked:      'bg-bg-gray border-border opacity-60 cursor-not-allowed',
    unlocked:    'bg-white dark:bg-[#162b3d] border-border hover:border-primary/40 hover:shadow-md cursor-pointer',
    started:     'bg-white dark:bg-[#162b3d] border-primary/40 hover:shadow-md cursor-pointer',
    passed:      'bg-secondary/5 border-secondary/30 hover:shadow-md cursor-pointer',
    'in-progress': 'bg-primary/3 border-primary/25 hover:shadow-md cursor-pointer',
    mastered:    'bg-accent/10 border-accent/40 hover:shadow-lg cursor-pointer',
  };

  const stateLabel: Record<typeof cardState, string | null> = {
    locked:      'Locked',
    unlocked:    null,
    started:     accuracy > 0 ? `${accuracy}% last try` : 'In progress',
    passed:      'Round 1 done ✓',
    'in-progress': `Round ${highestRound} done`,
    mastered:    'Mastered ✦',
  };

  const badgeStyles: Record<typeof cardState, string> = {
    locked:      'bg-border text-text-muted',
    unlocked:    'bg-primary/10 text-primary',
    started:     'bg-primary/10 text-primary',
    passed:      'bg-secondary/15 text-[#3d6b47] dark:text-secondary',
    'in-progress': 'bg-primary/10 text-primary',
    mastered:    'bg-accent/20 text-primary-dark',
  };

  const iconBgClass: string =
    locked ? 'bg-border text-text-muted'
    : mastered ? 'bg-accent/20 text-primary-dark'
    : (passed || inProgress) ? 'bg-secondary/10 text-[#3d6b47] dark:text-secondary'
    : `${accent.iconBg} ${accent.iconText}`;

  return (
    <motion.button
      onClick={locked ? undefined : onClick}
      whileHover={locked ? {} : { y: -2, scale: 1.01 }}
      whileTap={locked ? {} : { scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className={`relative w-full text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 ${stateStyles[cardState]}`}
    >
      {/* Colored left accent bar */}
      {!locked && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${mastered ? 'bg-accent' : passed ? 'bg-secondary' : accent.bar}`} />
      )}

      <div className="pl-4 pr-4 pt-4 pb-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${iconBgClass}`}>
            {locked ? <Lock size={18} /> : (group.icon ?? '📚')}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h3 className="font-display text-base text-text leading-tight truncate">{group.shortTitle}</h3>
              {mastered && <Star size={14} className="text-accent flex-shrink-0" fill="currentColor" />}
              {passed && !mastered && <CheckCircle size={14} className="text-secondary flex-shrink-0" />}
            </div>

            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{group.patternExample}</p>

            {/* Round progress dots + difficulty */}
            <div className="flex items-center gap-2 mt-2">
              {!group.isCheckpoint ? (
                <>
                  <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">Rounds:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: group.maxRounds }, (_, i) => {
                      const roundNum = i + 1;
                      const roundKey = `round${roundNum}` as 'round1' | 'round2' | 'round3' | 'round4' | 'round5';
                      const roundPassed = progress?.[roundKey]?.passed ?? false;
                      const isFinal = roundNum === group.maxRounds;
                      return (
                        <div
                          key={roundNum}
                          className={`rounded-full transition-colors ${
                            roundPassed
                              ? isFinal ? 'w-2.5 h-2.5 bg-accent' : 'w-2 h-2 bg-secondary'
                              : 'w-2 h-2 bg-border'
                          }`}
                          title={`Round ${roundNum}${roundPassed ? ': Done' : ''}`}
                        />
                      );
                    })}
                  </div>
                  {/* Difficulty dots */}
                  <span className="ml-auto flex items-center gap-0.5">
                    {[1, 2, 3].map(d => (
                      <div
                        key={d}
                        className={`w-1.5 h-1.5 rounded-full ${
                          d <= group.difficulty
                            ? mastered ? 'bg-accent' : (passed || inProgress) ? 'bg-secondary' : accent.bar
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">
                  ★ Review checkpoint
                </span>
              )}
            </div>

            {stateLabel[cardState] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeStyles[cardState]}`}
              >
                {stateLabel[cardState]}
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!locked && started && accuracy > 0 && (
          <div className="mt-3 h-1.5 bg-bg-gray rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full rounded-full ${mastered ? 'bg-accent' : passed ? 'bg-secondary' : 'bg-primary'}`}
            />
          </div>
        )}
      </div>
    </motion.button>
  );
}
