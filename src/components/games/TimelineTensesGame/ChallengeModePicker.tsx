'use client';

import { motion } from 'framer-motion';
import { Lock, GitCompare, RefreshCw, MapPin, Wrench, BookOpen } from 'lucide-react';
import type { TimelinePracticeMode } from './timelineTensesUtils';
import type { CategoryProgress } from './hooks/useTimelineTensesState';

interface ChallengeModePickerProps {
  selectedMode: TimelinePracticeMode;
  categoryProgress: Record<string, CategoryProgress>;
  onSelectMode: (mode: TimelinePracticeMode) => void;
}

interface ChallengeModeMeta {
  id: TimelinePracticeMode;
  icon: React.ReactNode;
  label: string;
  desc: string;
  unlockLevel: number;
}

const CHALLENGE_MODE_META: ChallengeModeMeta[] = [
  {
    id: 'spot-the-difference',
    icon: <GitCompare size={22} />,
    label: 'Spot the Difference',
    desc: 'Choose the timeline that matches the meaning',
    unlockLevel: 2,
  },
  {
    id: 'transformer',
    icon: <RefreshCw size={22} />,
    label: 'Transformer',
    desc: 'Rewrite in a new tense',
    unlockLevel: 2,
  },
  {
    id: 'in-context',
    icon: <MapPin size={22} />,
    label: 'In Context',
    desc: 'Pick the right tense',
    unlockLevel: 2,
  },
  {
    id: 'fix-it',
    icon: <Wrench size={22} />,
    label: 'Fix It',
    desc: 'Correct tense errors',
    unlockLevel: 2,
  },
  {
    id: 'story-builder',
    icon: <BookOpen size={22} />,
    label: 'Story Builder',
    desc: 'Build a tense narrative',
    unlockLevel: 2,
  },
];

/** Returns true if any category has reached the required level */
function isUnlocked(categoryProgress: Record<string, CategoryProgress>, requiredLevel: number): boolean {
  return Object.values(categoryProgress).some((p) => (p.level ?? 1) >= requiredLevel);
}

export function ChallengeModePicker({
  selectedMode,
  categoryProgress,
  onSelectMode,
}: ChallengeModePickerProps) {
  const anyUnlocked = isUnlocked(categoryProgress, 2);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-display text-text">Challenge Modes</h2>
        {!anyUnlocked && (
          <span className="text-xs font-black text-text-muted/50 uppercase tracking-wider flex items-center gap-1.5">
            <Lock size={13} />
            Reach Level 2 to unlock
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CHALLENGE_MODE_META.map((mode, i) => {
          const unlocked = isUnlocked(categoryProgress, mode.unlockLevel);
          const isActive = selectedMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              onClick={() => { if (unlocked) onSelectMode(mode.id); }}
              disabled={!unlocked}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={unlocked ? { y: -2, scale: 1.01 } : {}}
              whileTap={unlocked ? { scale: 0.98 } : {}}
              className={`group relative p-4 rounded-3xl border-2 text-left transition-all duration-300 ${
                isActive && unlocked
                  ? 'border-primary bg-white dark:bg-[#162b3d] shadow-xl'
                  : !unlocked
                  ? 'border-transparent bg-white/20 dark:bg-white/3 cursor-not-allowed opacity-60'
                  : 'border-transparent bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 shadow-sm'
              }`}
            >
              {/* Lock overlay */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-[1px] z-10">
                  <div className="flex flex-col items-center gap-1">
                    <Lock size={18} className="text-text-muted/50" />
                    <span className="text-[10px] font-black text-text-muted/40 uppercase tracking-widest">Lvl {mode.unlockLevel}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-start gap-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive && unlocked
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                    : 'bg-surface-elevated text-text-muted group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  {mode.icon}
                </div>
                <div>
                  <div className={`font-bold text-sm leading-tight transition-colors ${isActive && unlocked ? 'text-text' : 'text-text-muted group-hover:text-text'}`}>
                    {mode.label}
                  </div>
                  <div className="text-xs text-text-muted/50 font-medium mt-0.5">
                    {mode.desc}
                  </div>
                </div>
              </div>

              {isActive && unlocked && (
                <motion.div
                  layoutId="challenge-active-bg"
                  className="absolute inset-0 rounded-3xl bg-primary/5 blur-2xl -z-10 opacity-50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
