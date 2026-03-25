'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, Shuffle } from 'lucide-react';
import type { SentenceForm } from '@/types/activity';

interface SentenceFormFilterProps {
  selectedForm: SentenceForm | 'all';
  onSelectForm: (form: SentenceForm | 'all') => void;
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
}: SentenceFormFilterProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-text mb-4 text-center">
        Choose Sentence Form
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FORM_CONFIG.map((form) => {
          const isSelected = selectedForm === form.id;
          const Icon = form.icon;

          return (
            <motion.button
              key={form.id}
              onClick={() => onSelectForm(form.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/30 bg-white dark:bg-[#162b3d]'
              }`}
            >
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'bg-border/30 text-text-muted'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-text text-sm sm:text-base">
                    {form.label}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5 hidden sm:block">
                    {form.description}
                  </div>
                  <div className="text-xs text-primary/70 mt-1 italic hidden sm:block">
                    {form.example}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
