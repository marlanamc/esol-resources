'use client';

import { motion } from 'framer-motion';
import { Clock, Zap, Link2, Layers } from 'lucide-react';
import type { TenseCategory } from '@/types/activity';
import type { CategoryProgress } from './hooks/useTimelineTensesState';

interface TenseFilterBarProps {
  selectedCategory: TenseCategory | 'all';
  categoryProgress: Record<string, CategoryProgress>;
  onSelectCategory: (category: TenseCategory | 'all') => void;
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
    description: 'Practice all tense types',
    color: 'slate',
  },
  {
    id: 'simple',
    label: 'Simple',
    shortLabel: 'Simple',
    icon: Zap,
    description: 'Past, Present, Future Simple',
    color: 'blue',
  },
  {
    id: 'continuous',
    label: 'Continuous',
    shortLabel: 'Cont.',
    icon: Clock,
    description: 'Actions in progress',
    color: 'green',
  },
  {
    id: 'perfect',
    label: 'Perfect',
    shortLabel: 'Perf.',
    icon: Link2,
    description: 'Completed actions with connection',
    color: 'purple',
  },
  {
    id: 'perfect-continuous',
    label: 'Perfect Continuous',
    shortLabel: 'Perf. Cont.',
    icon: Clock,
    description: 'Duration up to a point',
    color: 'amber',
  },
  {
    id: 'mixed',
    label: 'Mixed',
    shortLabel: 'Mixed',
    icon: Layers,
    description: 'Multiple tenses in context',
    color: 'rose',
  },
];

export function TenseFilterBar({
  selectedCategory,
  categoryProgress,
  onSelectCategory,
}: TenseFilterBarProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-text mb-4 text-center">
        Choose a Tense Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORY_CONFIG.map((category) => {
          const isSelected = selectedCategory === category.id;
          const progress = categoryProgress[category.id];
          const Icon = category.icon;

          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/30 bg-white dark:bg-[#162b3d]'
              }`}
            >
              {/* Level badge */}
              {progress && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-sm">
                  Lvl {progress.level || 1}
                </div>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'bg-border/30 text-text-muted'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text truncate">
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.shortLabel}</span>
                  </div>
                  <div className="text-xs text-text-muted mt-0.5 hidden sm:block">
                    {category.description}
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              {progress && progress.attempts > 0 && (
                <div className="mt-3 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">
                      Best: {progress.accuracy}%
                    </span>
                    <span className="text-text-muted">
                      {progress.attempts} {progress.attempts === 1 ? 'try' : 'tries'}
                    </span>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
