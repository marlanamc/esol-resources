'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, Target, Sparkles } from 'lucide-react';
import { VERB_GROUPS } from '@/data/irregular-verbs-groups';
import { isGroupUnlocked, getProgressSummary } from '@/lib/irregular-verbs-progress';
import { GroupCard } from './GroupCard';
import type { VerbGroup, GroupProgress } from '@/types/irregular-verbs';

interface GroupSelectionScreenProps {
  categoryData: Record<string, GroupProgress>;
  onSelectGroup: (group: VerbGroup) => void;
}

export function GroupSelectionScreen({
  categoryData,
  onSelectGroup
}: GroupSelectionScreenProps) {
  const summary = getProgressSummary(categoryData);
  const progressPercent = summary.overallProgress;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center pt-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-primary-dark mb-4"
        >
          <BookOpen size={18} />
          <span className="text-sm font-semibold tracking-wide uppercase">Pattern Mastery</span>
        </motion.div>

        <h1 className="font-display text-4xl sm:text-5xl text-text mb-3 tracking-tight">
          Irregular Verbs
        </h1>
        <p className="text-text-muted text-lg max-w-xl mx-auto leading-relaxed">
          Master English irregular verbs by discovering their hidden patterns.
          Each group unlocks as you progress.
        </p>
      </motion.header>

      {/* Stats Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-3 gap-3 sm:gap-4"
      >
        <StatsCard
          icon={<BookOpen size={20} />}
          value={`${summary.completedGroups}/${summary.totalGroups}`}
          label="Chapters"
          color="primary"
          delay={0.25}
        />
        <StatsCard
          icon={<Target size={20} />}
          value={`${summary.averageAccuracy}%`}
          label="Accuracy"
          color="secondary"
          delay={0.3}
        />
        <StatsCard
          icon={<Trophy size={20} />}
          value={`${progressPercent}%`}
          label="Complete"
          color="accent"
          delay={0.35}
        />
      </motion.div>

      {/* Progress Journey */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <div className="h-3 bg-bg-gray rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
            className="h-full rounded-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)'
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1.5 }}
            />
          </motion.div>
        </div>

        {/* Milestone markers */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-1">
          {[0, 25, 50, 75, 100].map((milestone) => (
            <motion.div
              key={milestone}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + milestone * 0.005 }}
              className={`w-2 h-2 rounded-full transition-colors ${
                progressPercent >= milestone
                  ? 'bg-white shadow-sm'
                  : 'bg-border-dark'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Difficulty Sections */}
      <div className="space-y-8">
        {/* Beginner Section */}
        <GroupSection
          title="Foundation"
          subtitle="Simple patterns to build your base"
          groups={VERB_GROUPS.filter(g => g.difficulty === 1)}
          categoryData={categoryData}
          onSelectGroup={onSelectGroup}
          delay={0.5}
          accentColor="secondary"
        />

        {/* Intermediate Section */}
        <GroupSection
          title="Development"
          subtitle="Expanding your pattern recognition"
          groups={VERB_GROUPS.filter(g => g.difficulty === 2)}
          categoryData={categoryData}
          onSelectGroup={onSelectGroup}
          delay={0.6}
          accentColor="primary"
        />

        {/* Advanced Section */}
        <GroupSection
          title="Mastery"
          subtitle="Complex patterns for fluent speakers"
          groups={VERB_GROUPS.filter(g => g.difficulty === 3)}
          categoryData={categoryData}
          onSelectGroup={onSelectGroup}
          delay={0.7}
          accentColor="accent"
        />
      </div>

      {/* Motivational Footer */}
      <MotivationalMessage
        completedGroups={summary.completedGroups}
        totalGroups={summary.totalGroups}
      />
    </div>
  );
}

// Stats Card Component
function StatsCard({
  icon,
  value,
  label,
  color,
  delay
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: 'primary' | 'secondary' | 'accent';
  delay: number;
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    accent: 'bg-accent/30 text-primary-dark border-accent/40'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`p-4 sm:p-5 rounded-2xl border text-center ${colorClasses[color]}`}
    >
      <div className="flex justify-center mb-2 opacity-80">
        {icon}
      </div>
      <div className="font-display text-2xl sm:text-3xl font-bold mb-1">
        {value}
      </div>
      <div className="text-xs sm:text-sm opacity-70 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

// Group Section Component
function GroupSection({
  title,
  subtitle,
  groups,
  categoryData,
  onSelectGroup,
  delay,
  accentColor
}: {
  title: string;
  subtitle: string;
  groups: VerbGroup[];
  categoryData: Record<string, GroupProgress>;
  onSelectGroup: (group: VerbGroup) => void;
  delay: number;
  accentColor: 'primary' | 'secondary' | 'accent';
}) {
  const completedCount = groups.filter(g => categoryData[g.id]?.completed).length;
  const allCompleted = completedCount === groups.length;

  const accentClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent'
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-1 h-8 rounded-full ${accentClasses[accentColor]}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl sm:text-2xl text-text">{title}</h2>
            {allCompleted && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-secondary"
              >
                <Sparkles size={18} />
              </motion.span>
            )}
          </div>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>
        <div className="text-sm text-text-muted font-medium">
          {completedCount}/{groups.length}
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {groups.map((group, index) => {
          const unlocked = isGroupUnlocked(group.id, categoryData);
          const progress = categoryData[group.id];
          const completed = progress?.completed ?? false;

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + index * 0.08 }}
            >
              <GroupCard
                group={group}
                progress={progress}
                unlocked={unlocked}
                completed={completed}
                onClick={() => onSelectGroup(group)}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// Motivational Message Component
function MotivationalMessage({
  completedGroups,
  totalGroups
}: {
  completedGroups: number;
  totalGroups: number;
}) {
  if (completedGroups === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center p-6 bg-white rounded-2xl border border-border shadow-sm"
      >
        <p className="font-display text-lg text-text">
          Ready to begin your journey?
        </p>
        <p className="text-text-muted mt-1">
          Start with the Foundation chapter to unlock more patterns.
        </p>
      </motion.div>
    );
  }

  if (completedGroups === totalGroups) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="relative overflow-hidden text-center p-8 rounded-2xl border-2 border-accent"
        style={{
          background: 'linear-gradient(135deg, rgba(233, 196, 106, 0.15) 0%, rgba(176, 87, 64, 0.1) 100%)'
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative z-10">
          <div className="text-4xl mb-3">🎓</div>
          <p className="font-display text-2xl text-text mb-2">
            Master of Irregular Verbs
          </p>
          <p className="text-text-muted">
            You've conquered all patterns! Continue practicing to maintain fluency.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="text-center p-6 bg-white rounded-2xl border border-border shadow-sm"
    >
      <p className="font-display text-lg text-text">
        Great progress! {totalGroups - completedGroups} chapter{totalGroups - completedGroups !== 1 ? 's' : ''} remaining.
      </p>
      <p className="text-text-muted mt-1">
        Each pattern you learn makes the next one easier.
      </p>
    </motion.div>
  );
}
