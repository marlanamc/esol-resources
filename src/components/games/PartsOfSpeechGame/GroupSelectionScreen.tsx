'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Target, Trophy, RotateCcw } from 'lucide-react';
import { ALL_POS_GROUPS } from '@/data/parts-of-speech-groups';
import type { POSGroup, POSGroupProgress, POSPhase } from '@/types/parts-of-speech';
import { GroupCard } from './GroupCard';

// ─── Phase config ─────────────────────────────────────────────────────────────

interface PhaseConfig {
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  accent: string;               // Tailwind color name for the accent bar
  accentClass: string;          // bg-{color} for the vertical bar
  sectionBg: string;            // subtle bg for the section header
}

const PHASE_CONFIG: Record<POSPhase, PhaseConfig> = {
  'foundation': {
    label: 'Phase 1: Foundation',
    shortLabel: 'Foundation',
    description: 'Nouns, verbs, pronouns, and articles — the building blocks.',
    icon: '🔤',
    accent: 'primary',
    accentClass: 'bg-primary',
    sectionBg: 'from-primary/5 to-transparent',
  },
  'sentence-roles': {
    label: 'Phase 2: Sentence Roles',
    shortLabel: 'Sentence Roles',
    description: 'How words function together: subject, verb, object, complement.',
    icon: '🔗',
    accent: 'secondary',
    accentClass: 'bg-secondary',
    sectionBg: 'from-secondary/5 to-transparent',
  },
  'modifiers': {
    label: 'Phase 3: Modifiers',
    shortLabel: 'Modifiers',
    description: 'Words that describe: adjectives and adverbs.',
    icon: '✨',
    accent: 'accent',
    accentClass: 'bg-amber-400',
    sectionBg: 'from-amber-50/60 dark:from-amber-900/10 to-transparent',
  },
  'connectors': {
    label: 'Phase 4: Connectors',
    shortLabel: 'Connectors',
    description: 'Words that link ideas: prepositions and conjunctions.',
    icon: '🌉',
    accent: 'primary',
    accentClass: 'bg-teal-500',
    sectionBg: 'from-teal-50/50 dark:from-teal-900/10 to-transparent',
  },
  'application-bridge': {
    label: 'Phase 5: Application Bridge',
    shortLabel: 'Application Bridge',
    description: 'Connect what you know to real grammar patterns.',
    icon: '🏆',
    accent: 'primary',
    accentClass: 'bg-purple-500',
    sectionBg: 'from-purple-50/50 dark:from-purple-900/10 to-transparent',
  },
};

// ─── POS hero pills ───────────────────────────────────────────────────────────

const POS_PILLS = [
  { label: 'Noun', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700' },
  { label: 'Verb', color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700' },
  { label: 'Adjective', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700' },
  { label: 'Adverb', color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700' },
  { label: 'Preposition', color: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-200 dark:border-teal-700' },
  { label: 'Conjunction', color: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700' },
  { label: 'Pronoun', color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700' },
  { label: 'Article', color: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface GroupSelectionScreenProps {
  categoryData: Record<string, POSGroupProgress>;
  onSelectGroup: (group: POSGroup) => void;
  isGroupUnlocked: (group: POSGroup) => boolean;
  onResetProgress: () => Promise<boolean>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GroupSelectionScreen({
  categoryData,
  onSelectGroup,
  isGroupUnlocked,
  onResetProgress,
}: GroupSelectionScreenProps) {
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);
  const phases = Object.keys(PHASE_CONFIG) as POSPhase[];

  const contentGroups = ALL_POS_GROUPS.filter(g => !g.isCheckpoint);
  const passedCount = contentGroups.filter(g => categoryData[g.id]?.completed).length;
  const masteredCount = contentGroups.filter(g => categoryData[g.id]?.stage === 'mastered').length;
  const overallPct = Math.round((passedCount / contentGroups.length) * 100);

  return (
    <div className="space-y-10 pb-12">

      {/* ── Hero Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center pt-4"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary mb-5"
        >
          <BookOpen size={16} />
          <span className="text-sm font-semibold tracking-wide uppercase">Pattern Discovery</span>
        </motion.div>

        <h1 className="font-display text-4xl sm:text-5xl text-text mb-3 tracking-tight">
          Parts of Speech
        </h1>
        <p className="text-text-muted text-base max-w-md mx-auto leading-relaxed">
          Discover all 8 parts of speech through real-world examples from East Boston life.
        </p>

        {/* POS pill cloud */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mt-6"
        >
          {POS_PILLS.map((pill, i) => (
            <motion.span
              key={pill.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className={`px-3 py-1 rounded-full text-xs font-bold border ${pill.color}`}
            >
              {pill.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Two-round structure */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 mx-auto max-w-xs"
        >
          <p className="text-xs font-semibold text-text-muted mb-4 uppercase tracking-wide">For each level:</p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-display text-lg text-primary mb-0.5">Round 1</div>
              <div className="text-xs text-text-muted mb-2">Discover</div>
              <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                80% pass
              </div>
            </div>
            <div className="h-14 w-px bg-border/40" />
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-display text-lg text-primary-dark mb-0.5">Round 2</div>
              <div className="text-xs text-text-muted mb-2">Master</div>
              <div className="px-2.5 py-0.5 rounded-full bg-accent/20 text-primary-dark text-xs font-bold border border-accent/30">
                90% master
              </div>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* ── Stats Dashboard ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3 sm:gap-4"
      >
        <StatsCard icon={<BookOpen size={20} />} value={`${passedCount}/${contentGroups.length}`} label="Passed" color="primary" delay={0.35} />
        <StatsCard icon={<Target size={20} />} value={`${masteredCount}/${contentGroups.length}`} label="Mastered" color="secondary" delay={0.4} />
        <StatsCard icon={<Trophy size={20} />} value={`${overallPct}%`} label="Complete" color="accent" delay={0.45} />
      </motion.div>

      {/* ── Progress Bar ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="relative">
        <div className="h-3 bg-bg-gray rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 1.3, ease: [0.23, 1, 0.32, 1], delay: 0.55 }}
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)' }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1.8 }}
            />
          </motion.div>
        </div>
        {/* Milestone dots */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-1">
          {[0, 25, 50, 75, 100].map(m => (
            <motion.div
              key={m}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + m * 0.005 }}
              className={`w-2 h-2 rounded-full transition-colors ${overallPct >= m ? 'bg-white shadow-sm' : 'bg-border-dark'}`}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Phase Sections ── */}
      <div className="space-y-10">
        {phases.map((phase, phaseIndex) => {
          const cfg = PHASE_CONFIG[phase];
          const allGroups = ALL_POS_GROUPS.filter(g => g.phase === phase);
          const contentOnly = allGroups.filter(g => !g.isCheckpoint);
          const checkpoints = allGroups.filter(g => g.isCheckpoint);
          const phasePassedCount = contentOnly.filter(g => categoryData[g.id]?.completed).length;
          const phaseIsUnlocked = phaseIndex === 0 || contentOnly.some(g => isGroupUnlocked(g));
          const allPhaseComplete = contentOnly.length > 0 && phasePassedCount === contentOnly.length;

          return (
            <motion.section
              key={phase}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + phaseIndex * 0.1, duration: 0.5 }}
            >
              {/* Phase header */}
              <div className={`flex items-center gap-3 mb-4 px-1 ${!phaseIsUnlocked ? 'opacity-40' : ''}`}>
                <div className={`w-1 h-10 rounded-full flex-shrink-0 ${cfg.accentClass}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cfg.icon}</span>
                    <h2 className="font-display text-xl sm:text-2xl text-text">{cfg.label}</h2>
                    {allPhaseComplete && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-secondary">
                        <Sparkles size={16} />
                      </motion.span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted pl-7">{cfg.description}</p>
                </div>
                {contentOnly.length > 0 && (
                  <div className="text-sm text-text-muted font-medium flex-shrink-0">
                    {phasePassedCount}/{contentOnly.length}
                  </div>
                )}
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contentOnly.map((group, idx) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + phaseIndex * 0.1 + idx * 0.07 }}
                  >
                    <GroupCard
                      group={group}
                      progress={categoryData[group.id]}
                      locked={!isGroupUnlocked(group)}
                      onClick={() => onSelectGroup(group)}
                    />
                  </motion.div>
                ))}

                {/* Checkpoints span full width */}
                {checkpoints.map((group, idx) => (
                  <motion.div
                    key={group.id}
                    className="sm:col-span-2"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 + phaseIndex * 0.1 + idx * 0.07 }}
                  >
                    <GroupCard
                      group={group}
                      progress={categoryData[group.id]}
                      locked={!isGroupUnlocked(group)}
                      onClick={() => onSelectGroup(group)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* ── Motivational footer ── */}
      <MotivationalFooter
        passedCount={passedCount}
        totalGroups={contentGroups.length}
        overallPct={overallPct}
      />

      {/* ── Reset progress ── */}
      {passedCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center pb-4"
        >
          <AnimatePresence mode="wait">
            {!confirming ? (
              <motion.button
                key="trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={() => setConfirming(true)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-error transition-colors py-2 px-3 rounded-lg hover:bg-error/5"
              >
                <RotateCcw size={12} />
                Reset progress
              </motion.button>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-error/20 bg-error/5"
              >
                <span className="text-xs text-error/90 font-medium">Reset all progress?</span>
                <button
                  type="button"
                  onClick={async () => {
                    setResetting(true);
                    await onResetProgress();
                    setResetting(false);
                    setConfirming(false);
                  }}
                  disabled={resetting}
                  className="text-xs font-semibold text-white bg-error hover:bg-error/90 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  {resetting ? 'Resetting…' : 'Yes, reset'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={resetting}
                  className="text-xs font-medium text-text-muted hover:text-text transition-colors px-2 py-1.5"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatsCard({ icon, value, label, color, delay }: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: 'primary' | 'secondary' | 'accent';
  delay: number;
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-[#3d6b47] dark:text-secondary border-secondary/20',
    accent: 'bg-accent/30 text-primary-dark border-accent/40',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`p-4 sm:p-5 rounded-2xl border text-center ${colorClasses[color]}`}
    >
      <div className="flex justify-center mb-2 opacity-80">{icon}</div>
      <div className="font-display text-2xl sm:text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs sm:text-sm opacity-70 font-medium">{label}</div>
    </motion.div>
  );
}

function MotivationalFooter({ passedCount, totalGroups, overallPct }: {
  passedCount: number;
  totalGroups: number;
  overallPct: number;
}) {
  if (passedCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center p-6 bg-white dark:bg-[#162b3d] rounded-2xl border border-border shadow-sm"
      >
        <p className="font-display text-lg text-text">Ready to discover the building blocks of English?</p>
        <p className="text-text-muted mt-1 text-sm">Start with Phase 1 — all foundation groups are open!</p>
      </motion.div>
    );
  }

  if (overallPct === 100) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="relative overflow-hidden text-center p-8 rounded-2xl border-2 border-accent"
        style={{ background: 'linear-gradient(135deg, rgba(233,196,106,0.15) 0%, rgba(176,87,64,0.1) 100%)' }}
      >
        <div className="text-4xl mb-3">🎓</div>
        <p className="font-display text-2xl text-text mb-2">Parts of Speech Pro!</p>
        <p className="text-text-muted text-sm">You have completed all groups. Your grammar foundation is solid!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="text-center p-6 bg-white dark:bg-[#162b3d] rounded-2xl border border-border shadow-sm"
    >
      <p className="font-display text-lg text-text">
        Great progress! {totalGroups - passedCount} group{totalGroups - passedCount !== 1 ? 's' : ''} remaining.
      </p>
      <p className="text-text-muted mt-1 text-sm">Each part of speech you master makes the next one easier to spot.</p>
    </motion.div>
  );
}
