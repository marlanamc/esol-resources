'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, Target, Sparkles } from 'lucide-react';
import {
  GI_GROUPS,
  GI_REVIEW_GROUP_ID,
  GI_FINAL_GROUP_ID,
} from '@/data/gerund-infinitive-groups';
import {
  getProgressSummary,
  getGroupStage,
  REVIEW_UNLOCK_COUNT,
} from '@/lib/gerund-infinitive-progress';
import { GroupCard } from './GroupCard';
import type { GerundInfinitiveGroup, GIGroupProgress } from '@/types/gerund-infinitive';

interface GroupSelectionScreenProps {
  categoryData: Record<string, GIGroupProgress>;
  onSelectGroup: (group: GerundInfinitiveGroup) => void;
}

export function GroupSelectionScreen({ categoryData, onSelectGroup }: GroupSelectionScreenProps) {
  const summary = getProgressSummary(categoryData);
  const progressPercent = summary.overallProgress;
  const reviewUnlocked = summary.reviewUnlocked;
  const finalUnlocked = summary.finalUnlocked;

  // Create virtual group objects for review and final
  const reviewGroup: GerundInfinitiveGroup = {
    id: GI_REVIEW_GROUP_ID,
    title: 'Mixed Pattern Review',
    shortTitle: 'Mixed Review',
    pattern: 'Practice a mix of all patterns you have learned — great for reinforcement.',
    patternExample: 'gerund + infinitive mixed patterns',
    colorClass: 'from-indigo-100 to-blue-100 border-indigo-200',
    difficulty: 3,
    prerequisite: null,
    icon: '🔀',
    patterns: [],
  };

  const finalGroup: GerundInfinitiveGroup = {
    id: GI_FINAL_GROUP_ID,
    title: 'Final Challenge: Grammar Guru',
    shortTitle: 'Grammar Guru',
    pattern: '20 exercises, all patterns, no hints. Earn the Grammar Guru badge + 50 bonus points!',
    patternExample: 'all patterns · no hints',
    colorClass: 'from-amber-100 to-orange-100 border-amber-300',
    difficulty: 3,
    prerequisite: null,
    icon: '🏆',
    patterns: [],
  };

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
          <span className="text-sm font-semibold tracking-wide uppercase">Pattern Discovery</span>
        </motion.div>

        <h1 className="font-display text-4xl sm:text-5xl text-text mb-2 tracking-tight">
          Gerunds & Infinitives
        </h1>

        {/* Visual Two-Round Structure */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 mx-auto max-w-md"
        >
          <p className="text-sm font-semibold text-text-muted mb-4 text-center">For each level:</p>
          <div className="flex items-center justify-center gap-8">
            {/* Round 1 */}
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-display text-xl text-primary mb-1">Round 1</div>
              <div className="text-xs text-text-muted mb-2">Learn</div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                80% pass
              </div>
            </div>

            {/* Separator */}
            <div className="h-16 w-px bg-border/40"></div>

            {/* Round 2 */}
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-display text-xl text-primary-dark mb-1">Round 2</div>
              <div className="text-xs text-text-muted mb-2">Master</div>
              <div className="px-3 py-1 rounded-full bg-accent/20 text-primary-dark text-xs font-bold border border-accent/30">
                90% master
              </div>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Stats Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-3 gap-3 sm:gap-4"
      >
        <StatsCard icon={<BookOpen size={20} />} value={`${summary.completedGroups}/${summary.totalGroups}`} label="Passed" color="primary" delay={0.25} />
        <StatsCard icon={<Target size={20} />} value={`${summary.masteredGroups}/${summary.totalGroups}`} label="Mastered" color="secondary" delay={0.3} />
        <StatsCard icon={<Trophy size={20} />} value={`${progressPercent}%`} label="Complete" color="accent" delay={0.35} />
      </motion.div>

      {/* Progress Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="relative">
        <div className="h-3 bg-bg-gray rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)' }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1.5 }}
            />
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-1">
          {[0, 25, 50, 75, 100].map(milestone => (
            <motion.div
              key={milestone}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + milestone * 0.005 }}
              className={`w-2 h-2 rounded-full transition-colors ${progressPercent >= milestone ? 'bg-white shadow-sm' : 'bg-border-dark'}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Progress teaser - "X more groups until Mixed Review!" */}
      {!reviewUnlocked && summary.completedGroups < REVIEW_UNLOCK_COUNT && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 border border-primary/20 text-center"
        >
          <p className="font-display text-lg text-primary-dark dark:text-primary">
            {REVIEW_UNLOCK_COUNT - summary.completedGroups === 1
              ? '1 more group to unlock Mixed Review!'
              : `${REVIEW_UNLOCK_COUNT - summary.completedGroups} more groups to unlock Mixed Review!`}
          </p>
          <p className="text-sm text-text-muted mt-0.5">Complete pattern groups to unlock the mixed challenge.</p>
        </motion.div>
      )}

      {/* Phase-Based Sections */}
      <div className="space-y-8">
        <GroupSection
          title="Foundation"
          subtitle="Spot -ing and to + verb first: what each form is for, then four starter patterns."
          groups={GI_GROUPS.filter(g => g.phase === 'foundation')}
          categoryData={categoryData}
          onSelectGroup={onSelectGroup}
          delay={0.5}
          accentColor="secondary"
        />
        <GroupSection
          title="Core Verbs"
          subtitle="Learn which verbs use -ing next, and which use to + verb—then mix them."
          groups={GI_GROUPS.filter(g => g.phase === 'core-verbs')}
          categoryData={categoryData}
          onSelectGroup={onSelectGroup}
          delay={0.6}
          accentColor="primary"
        />
        <GroupSection
          title="Development"
          subtitle="Prepositions come in fixed chunks—after a prep, use -ing. Other lessons add to + verb after adjectives, nouns, and why."
          groups={GI_GROUPS.filter(g => g.phase === 'development')}
          categoryData={categoryData}
          onSelectGroup={onSelectGroup}
          delay={0.7}
          accentColor="accent"
        />
        <GroupSection
          title="Mastery"
          subtitle="Fine-tune the hard parts: when both forms work, when meaning changes, and when to is part of a phrase (then use -ing)."
          groups={GI_GROUPS.filter(g => g.phase === 'mastery')}
          categoryData={categoryData}
          onSelectGroup={onSelectGroup}
          delay={0.8}
          accentColor="primary"
        />

        {/* Mixed Review */}
        {reviewUnlocked && (
          <GroupSection
            title="Mixed Review"
            subtitle="Reinforce patterns you have already learned"
            groups={[reviewGroup]}
            categoryData={categoryData}
            onSelectGroup={onSelectGroup}
            delay={0.9}
            accentColor="primary"
          />
        )}

        {/* Final Challenge */}
        {finalUnlocked && (
          <GroupSection
            title="Grammar Guru — Final Challenge"
            subtitle="Available anytime if students want the full mixed challenge"
            groups={[finalGroup]}
            categoryData={categoryData}
            onSelectGroup={onSelectGroup}
            delay={0.85}
            accentColor="accent"
          />
        )}
      </div>

      {/* Motivational footer */}
      <MotivationalMessage
        completedGroups={summary.completedGroups}
        totalGroups={summary.totalGroups}
        finalCompleted={categoryData[GI_FINAL_GROUP_ID]?.completed ?? false}
        finalUnlocked={finalUnlocked}
        reviewUnlocked={reviewUnlocked}
      />
    </div>
  );
}

// Sub-components

function StatsCard({ icon, value, label, color, delay }: {
  icon: React.ReactNode; value: string; label: string;
  color: 'primary' | 'secondary' | 'accent'; delay: number;
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-[#3d6b47] dark:text-secondary border-secondary/20',
    accent: 'bg-accent/30 text-primary-dark border-accent/40',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
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

function GroupSection({
  title, subtitle, groups, categoryData, onSelectGroup, delay, accentColor,
}: {
  title: string; subtitle: string; groups: GerundInfinitiveGroup[];
  categoryData: Record<string, GIGroupProgress>; onSelectGroup: (g: GerundInfinitiveGroup) => void;
  delay: number; accentColor: 'primary' | 'secondary' | 'accent';
}) {
  const completedCount = groups.filter(g => getGroupStage(categoryData[g.id]) !== 'not-started').length;
  const allCompleted = completedCount === groups.length;
  const accentClasses = { primary: 'bg-primary', secondary: 'bg-secondary', accent: 'bg-accent' };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-1 h-8 rounded-full ${accentClasses[accentColor]}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl sm:text-2xl text-text">{title}</h2>
            {allCompleted && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-secondary">
                <Sparkles size={18} />
              </motion.span>
            )}
          </div>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>
        <div className="text-sm text-text-muted font-medium">{completedCount}/{groups.length}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {groups.map((group, index) => {
          const progress = categoryData[group.id];
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
                onClick={() => onSelectGroup(group)}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function MotivationalMessage({ completedGroups, totalGroups, finalCompleted, finalUnlocked, reviewUnlocked }: {
  completedGroups: number; totalGroups: number; finalCompleted: boolean; finalUnlocked: boolean; reviewUnlocked: boolean;
}) {
  if (completedGroups === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="text-center p-6 bg-white dark:bg-[#162b3d] rounded-2xl border border-border shadow-sm">
        <p className="font-display text-lg text-text">Ready to discover some patterns?</p>
        <p className="text-text-muted mt-1">Pick any group to start — all patterns are open to explore!</p>
      </motion.div>
    );
  }

  if (completedGroups === totalGroups && finalCompleted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
        className="relative overflow-hidden text-center p-8 rounded-2xl border-2 border-accent"
        style={{ background: 'linear-gradient(135deg, rgba(233,196,106,0.15) 0%, rgba(176,87,64,0.1) 100%)' }}>
        <div className="text-4xl mb-3">🎓</div>
        <p className="font-display text-2xl text-text mb-2">Grammar Guru!</p>
        <p className="text-text-muted">You have mastered all gerund and infinitive patterns. Incredible work!</p>
      </motion.div>
    );
  }

  if (completedGroups === totalGroups && finalUnlocked) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="text-center p-6 bg-white dark:bg-[#162b3d] rounded-2xl border border-border shadow-sm">
        <p className="font-display text-lg text-text">All patterns completed! 🏆</p>
        <p className="text-text-muted mt-1">The Final Challenge awaits. Can you earn the Grammar Guru badge?</p>
      </motion.div>
    );
  }

  if (reviewUnlocked) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="text-center p-6 bg-white dark:bg-[#162b3d] rounded-2xl border border-border shadow-sm">
        <p className="font-display text-lg text-text">Mixed Review is unlocked! 🔀</p>
        <p className="text-text-muted mt-1"> Use it to reinforce everything you have learned so far.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
      className="text-center p-6 bg-white dark:bg-[#162b3d] rounded-2xl border border-border shadow-sm">
      <p className="font-display text-lg text-text">
        Great progress! {totalGroups - completedGroups} pattern{totalGroups - completedGroups !== 1 ? 's' : ''} remaining.
      </p>
      <p className="text-text-muted mt-1">Each pattern you learn makes the next one easier.</p>
    </motion.div>
  );
}
