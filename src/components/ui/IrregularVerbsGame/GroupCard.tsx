'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, ChevronRight, RotateCcw } from 'lucide-react';
import type { VerbGroup, GroupProgress } from '@/types/irregular-verbs';

interface GroupCardProps {
  group: VerbGroup;
  progress?: GroupProgress;
  unlocked: boolean;
  completed: boolean;
  onClick: () => void;
}

// Pattern-based color palette - sophisticated and distinct
const PATTERN_COLORS: Record<string, { bg: string; border: string; accent: string; glow: string }> = {
  'group-1': {
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
    glow: 'hover:shadow-emerald-100'
  },
  'group-2a': {
    bg: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
    accent: 'bg-sky-500',
    glow: 'hover:shadow-sky-100'
  },
  'group-2b': {
    bg: 'from-cyan-50 to-sky-50',
    border: 'border-cyan-200',
    accent: 'bg-cyan-500',
    glow: 'hover:shadow-cyan-100'
  },
  'group-2c': {
    bg: 'from-indigo-50 to-violet-50',
    border: 'border-indigo-200',
    accent: 'bg-indigo-500',
    glow: 'hover:shadow-indigo-100'
  },
  'group-2d': {
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    accent: 'bg-violet-500',
    glow: 'hover:shadow-violet-100'
  },
  'group-2e': {
    bg: 'from-fuchsia-50 to-pink-50',
    border: 'border-fuchsia-200',
    accent: 'bg-fuchsia-500',
    glow: 'hover:shadow-fuchsia-100'
  },
  'group-3a': {
    bg: 'from-rose-50 to-red-50',
    border: 'border-rose-200',
    accent: 'bg-rose-500',
    glow: 'hover:shadow-rose-100'
  },
  'group-3b': {
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    accent: 'bg-orange-500',
    glow: 'hover:shadow-orange-100'
  },
  'group-3c': {
    bg: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    glow: 'hover:shadow-amber-100'
  },
  'group-3d': {
    bg: 'from-lime-50 to-green-50',
    border: 'border-lime-200',
    accent: 'bg-lime-600',
    glow: 'hover:shadow-lime-100'
  }
};

export function GroupCard({
  group,
  progress,
  unlocked,
  completed,
  onClick
}: GroupCardProps) {
  const accuracy = progress?.accuracy ?? 0;
  const colors = PATTERN_COLORS[group.id] || PATTERN_COLORS['group-1'];

  return (
    <motion.button
      whileHover={unlocked ? { y: -4, transition: { duration: 0.2 } } : undefined}
      whileTap={unlocked ? { scale: 0.98 } : undefined}
      onClick={unlocked ? onClick : undefined}
      disabled={!unlocked}
      className={`
        relative w-full text-left rounded-2xl p-5
        transition-all duration-300 overflow-hidden
        ${unlocked
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} border-2 cursor-pointer shadow-sm ${colors.glow} hover:shadow-lg`
          : 'bg-bg-gray border-2 border-border cursor-not-allowed'
        }
      `}
    >
      {/* Locked Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 bg-bg-gray/60 backdrop-blur-[2px] flex items-center justify-center z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <Lock size={20} className="text-text-muted" />
          </motion.div>
        </div>
      )}

      {/* Completion Badge - Floating */}
      {completed && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="absolute -top-1 -right-1 z-20"
        >
          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-md">
            <CheckCircle size={18} />
          </div>
        </motion.div>
      )}

      {/* Card Content */}
      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Pattern Indicator */}
          <div className={`w-1.5 h-12 rounded-full ${colors.accent} flex-shrink-0`} />

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-text font-semibold leading-tight mb-1">
              {group.title}
            </h3>
            <p className="text-sm text-text-muted line-clamp-2 leading-snug">
              {group.pattern}
            </p>
          </div>
        </div>

        {/* Pattern Example */}
        <div className="px-3 py-2 bg-white/60 rounded-lg border border-white/80">
          <code className="text-sm font-mono text-text-muted">
            {group.patternExample}
          </code>
        </div>

        {/* Progress Section */}
        {progress?.attempts && progress.attempts > 0 && unlocked && (
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(accuracy, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  accuracy >= 80
                    ? 'bg-secondary'
                    : accuracy >= 60
                      ? 'bg-accent'
                      : 'bg-warning'
                }`}
              />
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-end text-xs">
              <span className={`font-semibold ${
                accuracy >= 80 ? 'text-secondary-dark' : 'text-text-muted'
              }`}>
                {accuracy}% accuracy
              </span>
            </div>
          </div>
        )}

        {/* CTA Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            {/* Difficulty dots */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i < group.difficulty
                    ? unlocked ? colors.accent : 'bg-text-muted'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>

          {unlocked && (
            <motion.div
              className="flex items-center gap-1 text-sm font-semibold"
              whileHover={{ x: 2 }}
            >
              {completed ? (
                <>
                  <RotateCcw size={14} />
                  <span>Review</span>
                </>
              ) : (
                <>
                  <span>Start</span>
                  <ChevronRight size={16} />
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative Corner Accent */}
      {unlocked && (
        <div
          className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full ${colors.accent} opacity-10`}
        />
      )}
    </motion.button>
  );
}
