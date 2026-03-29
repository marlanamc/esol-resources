'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, Shuffle } from 'lucide-react';
import type { SentenceForm } from '@/types/activity';

interface SentenceFormFilterProps {
  selectedForm: SentenceForm | 'all';
  onSelectForm: (form: SentenceForm | 'all') => void;
  compact?: boolean;
}

const FORM_CONFIG: Array<{
  id: SentenceForm | 'all';
  label: string;
  icon: typeof CheckCircle2;
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
    icon: CheckCircle2,
    description: 'Positive statements',
    example: 'She works here.',
  },
  {
    id: 'negative',
    label: 'Negative',
    icon: XCircle,
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
      <div className="flex flex-wrap gap-2">
        {FORM_CONFIG.map((form) => {
          const isSelected = selectedForm === form.id;
          return (
            <button
              key={form.id}
              onClick={() => onSelectForm(form.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white/40 dark:bg-white/5 text-text-muted border-border/30 hover:text-text hover:bg-white/60 dark:hover:bg-white/10'
              }`}
            >
              {form.label}
            </button>
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
              className={`group relative p-5 rounded-3xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-primary bg-white dark:bg-[#162b3d] shadow-xl'
                  : 'border-transparent bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center sm:items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
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
