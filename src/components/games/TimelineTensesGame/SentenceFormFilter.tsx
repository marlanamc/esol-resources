'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Shuffle, Check, Plus, Minus } from 'lucide-react';
import type { SentenceForm } from '@/types/activity';

interface SentenceFormFilterProps {
  selectedForm: SentenceForm | 'all';
  onSelectForm: (form: SentenceForm | 'all') => void;
  compact?: boolean;
}

const FORM_CONFIG: Array<{
  id: SentenceForm | 'all';
  label: string;
  icon: typeof Plus;
  description: string;
  example: string;
}> = [
  {
    id: 'all',
    label: 'All Forms',
    icon: Shuffle,
    description: 'Mix of all sentence types',
    example: 'Random mix',
  },
  {
    id: 'affirmative',
    label: 'Affirmative',
    icon: Plus,
    description: 'Positive statements',
    example: 'She works here.',
  },
  {
    id: 'negative',
    label: 'Negative',
    icon: Minus,
    description: 'Negative statements',
    example: "She doesn't work here.",
  },
  {
    id: 'question',
    label: 'Questions',
    icon: HelpCircle,
    description: 'Question forms',
    example: 'Does she work here?',
  },
];

export function SentenceFormFilter({
  selectedForm,
  onSelectForm,
  compact = false,
}: SentenceFormFilterProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2.5">
        {FORM_CONFIG.map((form) => {
          const isSelected = selectedForm === form.id;
          const Icon = form.icon;

          return (
            <motion.button
              key={form.id}
              onClick={() => onSelectForm(form.id)}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={isSelected}
              className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                isSelected
                  ? 'bg-secondary text-white border-secondary-dark shadow-[0_8px_16px_-4px_rgba(106,141,115,0.3)] pr-5'
                  : 'bg-white/50 dark:bg-white/5 text-text-muted border-transparent hover:bg-white/80 dark:hover:bg-white/10 hover:text-text'
              }`}
            >
              <div className="relative">
                <Icon size={16} className={isSelected ? 'text-white' : 'text-text-muted/60 group-hover:text-primary'} />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-1.5 -right-1.5 bg-white text-secondary rounded-full p-1 shadow-sm"
                  >
                    <Check size={12} strokeWidth={4} />
                  </motion.div>
                )}
              </div>
              {form.label}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold font-display text-text mb-6">Sentence Form</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {FORM_CONFIG.map((form) => {
          const isSelected = selectedForm === form.id;
          const Icon = form.icon;

          return (
            <motion.button
              key={form.id}
              onClick={() => onSelectForm(form.id)}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isSelected}
              className={`group relative p-5 rounded-3xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-primary bg-gradient-to-br from-primary/10 via-white to-white dark:from-primary/20 dark:via-[#162b3d] dark:to-[#162b3d] ring-2 ring-primary/20 shadow-[0_18px_36px_-18px_rgba(var(--primary-color-rgb),0.45)]'
                  : 'border-transparent bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute right-4 top-4 rounded-full border border-primary/25 bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                  Selected
                </div>
              )}
              <div className="flex flex-col items-center sm:items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110 ring-4 ring-primary/10'
                      : 'bg-surface-elevated text-text-muted group-hover:bg-primary/10 group-hover:text-primary'
                  }`}
                >
                  <Icon size={24} />
                </div>
                
                <div className="text-center sm:text-left">
                  <div className={`font-bold text-base transition-colors ${isSelected ? 'text-text' : 'text-text-muted group-hover:text-text'}`}>
                    {form.label}
                  </div>
                  <div className="text-xs text-text-muted/60 font-medium leading-tight mt-1 line-clamp-2">
                    {form.description}
                  </div>
                  <div className={`text-xs font-bold mt-2 italic px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-elevated text-text-muted/40'
                  }`}>
                    "{form.example}"
                  </div>
                </div>
              </div>

              {/* Selection background glow */}
              {isSelected && (
                <motion.div
                  layoutId="form-active-bg"
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
