'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Zap,
  Trophy,
  Lock,
  GitCompare,
  RefreshCw,
  MapPin,
  Wrench,
} from 'lucide-react';
import type { TimelinePracticeMode } from './timelineTensesUtils';
import { isChallengeMode } from './timelineTensesUtils';
import type { CategoryProgress } from './hooks/useTimelineTensesState';

interface ModeSelectorProps {
  selectedMode: TimelinePracticeMode;
  categoryProgress: Record<string, CategoryProgress>;
  onSelectMode: (mode: TimelinePracticeMode) => void;
}

const PRACTICE_MODE_META = [
  {
    id: 'read-the-timeline' as TimelinePracticeMode,
    icon: <Clock size={24} />,
    label: 'Read',
    desc: 'Timeline → Verb',
  },
  {
    id: 'build-the-timeline' as TimelinePracticeMode,
    icon: <Zap size={24} />,
    label: 'Build',
    desc: 'Sentence → Map',
  },
  {
    id: 'mixed-practice' as TimelinePracticeMode,
    icon: <Trophy size={24} />,
    label: 'Mixed',
    desc: 'Both modes',
  },
];

const CHALLENGE_MODE_META = [
  {
    id: 'spot-the-difference' as TimelinePracticeMode,
    icon: <GitCompare size={22} />,
    label: 'Spot the Difference',
    desc: 'Choose the timeline that matches the meaning',
    unlockLevel: 2,
  },
  {
    id: 'transformer' as TimelinePracticeMode,
    icon: <RefreshCw size={22} />,
    label: 'Transformer',
    desc: 'Rewrite in a new tense',
    unlockLevel: 2,
  },
  {
    id: 'in-context' as TimelinePracticeMode,
    icon: <MapPin size={22} />,
    label: 'In Context',
    desc: 'Pick the right tense',
    unlockLevel: 2,
  },
  {
    id: 'fix-it' as TimelinePracticeMode,
    icon: <Wrench size={22} />,
    label: 'Fix It',
    desc: 'Correct tense errors',
    unlockLevel: 2,
  },
  // Story Builder temporarily hidden — questions need full audit before going live
  // {
  //   id: 'story-builder' as TimelinePracticeMode,
  //   icon: <BookOpen size={22} />,
  //   label: 'Story Builder',
  //   desc: 'Build a tense narrative',
  //   unlockLevel: 2,
  // },
];

function isUnlocked(
  categoryProgress: Record<string, CategoryProgress>,
  requiredLevel: number
): boolean {
  return Object.values(categoryProgress).some(
    (p) => (p.level ?? 1) >= requiredLevel
  );
}

export function ModeSelector({
  selectedMode,
  categoryProgress,
  onSelectMode,
}: ModeSelectorProps) {
  const [activeTab, setActiveTab] = useState<'practice' | 'challenge'>(
    () => (isChallengeMode(selectedMode) ? 'challenge' : 'practice')
  );

  const anyUnlocked = true;

  function handleTabChange(tab: 'practice' | 'challenge') {
    setActiveTab(tab);
    if (tab === 'practice' && isChallengeMode(selectedMode)) {
      onSelectMode('read-the-timeline');
    }
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => handleTabChange('practice')}
          className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
            activeTab === 'practice'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white/40 dark:bg-white/5 text-text-muted hover:text-text hover:bg-white/60 dark:hover:bg-white/10'
          }`}
        >
          Practice
        </button>

        <button
          onClick={() => handleTabChange('challenge')}
          className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
            activeTab === 'challenge'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white/40 dark:bg-white/5 text-text-muted hover:text-text hover:bg-white/60 dark:hover:bg-white/10'
          }`}
        >
          Challenge Modes
          {!anyUnlocked ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider opacity-60">
              <Lock size={10} />
              Tier 2
            </span>
          ) : (
            <span className="text-[10px] font-black text-amber-400 opacity-90">★</span>
          )}
        </button>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="grid grid-cols-3 gap-4">
              {PRACTICE_MODE_META.map((mode) => {
                const isActive = selectedMode === mode.id;
                return (
                  <motion.button
                    key={mode.id}
                    onClick={() => onSelectMode(mode.id)}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative p-4 sm:p-5 rounded-3xl border-2 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-primary bg-white dark:bg-[#162b3d] shadow-xl'
                        : 'border-transparent bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col items-center sm:items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                            : 'bg-surface-elevated text-text-muted group-hover:bg-primary/10 group-hover:text-primary'
                        }`}
                      >
                        {mode.icon}
                      </div>
                      <div className="text-center sm:text-left">
                        <div
                          className={`font-bold text-base transition-colors ${
                            isActive ? 'text-text' : 'text-text-muted group-hover:text-text'
                          }`}
                        >
                          {mode.label}
                        </div>
                        <div className="text-xs text-text-muted/60 font-medium mt-1">
                          {mode.desc}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="mode-active-bg"
                        className="absolute inset-0 rounded-3xl bg-primary/5 blur-2xl -z-10 opacity-50"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'challenge' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {!anyUnlocked ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 rounded-3xl border border-dashed border-border/40 bg-white/20 dark:bg-white/3 text-center gap-3">
                <Lock size={28} className="text-text-muted/30" />
                <p className="text-sm font-bold text-text-muted/50">
                  Challenge Modes unlock at Tier 2
                </p>
                <p className="text-xs text-text-muted/40 font-medium">
                  Spot the Diff · Transformer · In Context · Fix It · Story Builder
                </p>
                <p className="text-xs text-primary/60 font-semibold mt-1">
                  Play a few Practice rounds to unlock
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CHALLENGE_MODE_META.map((mode, i) => {
                  const unlocked = true;
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
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-[1px] z-10">
                          <div className="flex flex-col items-center gap-1">
                            <Lock size={18} className="text-text-muted/50" />
                            <span className="text-[10px] font-black text-text-muted/40 uppercase tracking-widest">
                              Lvl {mode.unlockLevel}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-start gap-2">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            isActive && unlocked
                              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                              : 'bg-surface-elevated text-text-muted group-hover:bg-primary/10 group-hover:text-primary'
                          }`}
                        >
                          {mode.icon}
                        </div>
                        <div>
                          <div
                            className={`font-bold text-sm leading-tight transition-colors ${
                              isActive && unlocked ? 'text-text' : 'text-text-muted group-hover:text-text'
                            }`}
                          >
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
