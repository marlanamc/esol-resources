'use client';

import { motion } from 'framer-motion';
import { Clock, Zap, Link2, Layers, Repeat } from 'lucide-react';
import type { TenseCategory } from '@/types/activity';
import { TIMELINE_TENSES_QUESTIONS } from '@/data/timeline-tenses-questions';
import type { CategoryProgress } from './hooks/useTimelineTensesState';

interface TenseFilterBarProps {
  selectedCategories: TenseCategory[];
  categoryProgress: Record<string, CategoryProgress>;
  onToggleCategory: (category: TenseCategory | 'all') => void;
}

const CATEGORY_CONFIG: Array<{
  id: TenseCategory | 'all';
  label: string;
  shortLabel: string;
  icon: typeof Clock;
  description: string;
  color: string;
}> = [
  {
    id: 'all',
    label: 'All Tenses',
    shortLabel: 'All',
    icon: Layers,
    description: 'A bit of everything',
    color: 'slate',
  },
  {
    id: 'simple',
    label: 'Simple',
    shortLabel: 'Simple',
    icon: Zap,
    description: 'Facts, habits & finished actions',
    color: 'blue',
  },
  {
    id: 'continuous',
    label: 'Continuous',
    shortLabel: 'Cont.',
    icon: Clock,
    description: 'What was happening at that moment',
    color: 'green',
  },
  {
    id: 'perfect',
    label: 'Perfect',
    shortLabel: 'Perf.',
    icon: Link2,
    description: 'Past that still matters right now',
    color: 'purple',
  },
  {
    id: 'perfect-continuous',
    label: 'Perfect Continuous',
    shortLabel: 'Perf. Cont.',
    icon: Clock,
    description: 'How long something has been happening',
    color: 'amber',
  },
  {
    id: 'mixed',
    label: 'Mixed',
    shortLabel: 'Mixed',
    icon: Layers,
    description: 'Two things — two different times',
    color: 'rose',
  },
  {
    id: 'used-to',
    label: 'Used To',
    shortLabel: 'Used To',
    icon: Repeat,
    description: 'Past habits & states that no longer exist',
    color: 'violet',
  },
];

const CATEGORY_STYLE: Record<string, { tone: string; iconBg: string; activeBg: string; border: string }> = {
  all: { tone: 'text-slate-600 dark:text-slate-400', iconBg: 'bg-slate-100 dark:bg-slate-800', activeBg: 'bg-slate-500', border: 'border-slate-200 dark:border-slate-700' },
  simple: { tone: 'text-[var(--tone-grammar-accent)]', iconBg: 'bg-[var(--tone-grammar-surface)]', activeBg: 'bg-[var(--tone-grammar-accent)]', border: 'border-[var(--tone-grammar-border)]' },
  continuous: { tone: 'text-[var(--tone-vocabulary-accent)]', iconBg: 'bg-[var(--tone-vocabulary-surface)]', activeBg: 'bg-[var(--tone-vocabulary-accent)]', border: 'border-[var(--tone-vocabulary-border)]' },
  perfect: { tone: 'text-[var(--tone-quizzes-accent)]', iconBg: 'bg-[var(--tone-quizzes-surface)]', activeBg: 'bg-[var(--tone-quizzes-accent)]', border: 'border-[var(--tone-quizzes-border)]' },
  'perfect-continuous': { tone: 'text-[var(--tone-speaking-accent)]', iconBg: 'bg-[var(--tone-speaking-surface)]', activeBg: 'bg-[var(--tone-speaking-accent)]', border: 'border-[var(--tone-speaking-border)]' },
  mixed: { tone: 'text-[var(--tone-games-accent)]', iconBg: 'bg-[var(--tone-games-surface)]', activeBg: 'bg-[var(--tone-games-accent)]', border: 'border-[var(--tone-games-border)]' },
  'used-to': { tone: 'text-[var(--tone-used-to-accent)]', iconBg: 'bg-[var(--tone-used-to-surface)]', activeBg: 'bg-[var(--tone-used-to-accent)]', border: 'border-[var(--tone-used-to-border)]' },
};

const CATEGORY_QUESTION_COUNTS = CATEGORY_CONFIG.reduce<Record<string, number>>(
  (acc, category) => {
    acc[category.id] =
      category.id === 'all'
        ? TIMELINE_TENSES_QUESTIONS.length
        : TIMELINE_TENSES_QUESTIONS.filter(
            (question) => question.tenseCategory === category.id
          ).length;
    return acc;
  },
  {}
);

export function TenseFilterBar({
  selectedCategories,
  categoryProgress,
  onToggleCategory,
}: TenseFilterBarProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {CATEGORY_CONFIG.map((category) => {
          const isSelected = category.id === 'all'
            ? selectedCategories.length === 0
            : selectedCategories.includes(category.id as TenseCategory);
          const progress = categoryProgress[category.id];
          const Icon = category.icon;
          const style = CATEGORY_STYLE[category.id] || CATEGORY_STYLE.all;
          const hasNewChallenges =
            !!progress &&
            typeof progress.questionPoolSize === 'number' &&
            CATEGORY_QUESTION_COUNTS[category.id] > progress.questionPoolSize;

          return (
            <motion.button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative p-4 rounded-3xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? `bg-white dark:bg-[var(--surface-base)] shadow-xl ${style.border}`
                  : `border-transparent bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 shadow-sm`
              }`}
            >
              {/* Level badge */}
              <div className="flex flex-col gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                    isSelected
                      ? `${style.activeBg} text-white shadow-inner`
                      : `${style.iconBg} ${style.tone}`
                  }`}
                >
                  <Icon size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-bold transition-colors ${isSelected ? 'text-text' : 'text-text-muted group-hover:text-text'}`}>
                    <span className="text-sm sm:text-base">{category.label}</span>
                  </div>
                  <div className="text-xs text-text-muted/60 font-medium leading-tight mt-1 line-clamp-2">
                    {category.description}
                  </div>
                </div>
              </div>

              {hasNewChallenges && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-accent/20 text-primary-dark border border-primary/20">
                    New challenges available
                  </span>
                </div>
              )}

              {/* Progress indicator */}
              {progress && progress.attempts > 0 && (
                <div className={`mt-4 pt-3 border-t transition-colors ${isSelected ? 'border-border' : 'border-border/30'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted/40 uppercase tracking-tighter">Best Score</span>
                    <span className={`text-xs font-bold ${isSelected ? style.tone : 'text-text-muted'}`}>
                      {progress.accuracy}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 bg-border/20 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${isSelected ? style.activeBg : 'bg-text-muted/20'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.accuracy}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Selection background glow */}
              {isSelected && (
                <motion.div
                  layoutId="category-active-bg"
                  className={`absolute inset-0 rounded-3xl blur-2xl -z-10 opacity-10 ${style.iconBg}`}
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
