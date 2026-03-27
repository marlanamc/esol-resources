'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TenseFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormType = 'affirmative' | 'negative' | 'question';

const LEGEND = [
  { code: 'V1',     desc: 'base form',        eg: 'study' },
  { code: 'V1-3rd', desc: '3rd person -s',    eg: 'studies' },
  { code: 'V1-ing', desc: 'continuous -ing',  eg: 'studying' },
  { code: 'V2',     desc: 'past simple form', eg: 'studied' },
  { code: 'V3',     desc: 'past participle',  eg: 'studied' },
];

const TENSES: {
  tense: string;
  color: string;
  category: string;
  affirmative: string;
  negative: string;
  question: string;
  example: { affirmative: string; negative: string; question: string };
}[] = [
  {
    tense: 'Present Simple',
    color: 'text-emerald-700 dark:text-emerald-300',
    category: 'Simple',
    affirmative: 'subject + V1 / V1-3rd',
    negative:    'subject + do(es) + not + V1',
    question:    'Do(es) + subject + V1?',
    example: { affirmative: 'He studies every day.', negative: "He doesn't study today.", question: 'Does he study here?' },
  },
  {
    tense: 'Past Simple',
    color: 'text-amber-700 dark:text-amber-300',
    category: 'Simple',
    affirmative: 'subject + V2',
    negative:    'subject + did + not + V1',
    question:    'Did + subject + V1?',
    example: { affirmative: 'He studied last night.', negative: "He didn't study.", question: 'Did he study?' },
  },
  {
    tense: 'Future Simple',
    color: 'text-blue-700 dark:text-blue-300',
    category: 'Simple',
    affirmative: 'subject + will + V1',
    negative:    'subject + will + not + V1',
    question:    'Will + subject + V1?',
    example: { affirmative: 'He will study tomorrow.', negative: "He won't study.", question: 'Will he study?' },
  },
  {
    tense: 'Present Continuous',
    color: 'text-emerald-700 dark:text-emerald-300',
    category: 'Continuous',
    affirmative: 'subject + am/is/are + V1-ing',
    negative:    'subject + am/is/are + not + V1-ing',
    question:    'Am/Is/Are + subject + V1-ing?',
    example: { affirmative: 'He is studying right now.', negative: "He isn't studying.", question: 'Is he studying?' },
  },
  {
    tense: 'Past Continuous',
    color: 'text-amber-700 dark:text-amber-300',
    category: 'Continuous',
    affirmative: 'subject + was/were + V1-ing',
    negative:    'subject + was/were + not + V1-ing',
    question:    'Was/Were + subject + V1-ing?',
    example: { affirmative: 'He was studying at 8pm.', negative: "He wasn't studying.", question: 'Was he studying?' },
  },
  {
    tense: 'Future Continuous',
    color: 'text-blue-700 dark:text-blue-300',
    category: 'Continuous',
    affirmative: 'subject + will be + V1-ing',
    negative:    'subject + will not be + V1-ing',
    question:    'Will + subject + be + V1-ing?',
    example: { affirmative: 'He will be studying all night.', negative: "He won't be studying.", question: 'Will he be studying?' },
  },
  {
    tense: 'Present Perfect',
    color: 'text-emerald-700 dark:text-emerald-300',
    category: 'Perfect',
    affirmative: 'subject + have/has + V3',
    negative:    'subject + have/has + not + V3',
    question:    'Have/Has + subject + V3?',
    example: { affirmative: 'He has studied English.', negative: "He hasn't studied.", question: 'Has he studied?' },
  },
  {
    tense: 'Past Perfect',
    color: 'text-amber-700 dark:text-amber-300',
    category: 'Perfect',
    affirmative: 'subject + had + V3',
    negative:    'subject + had + not + V3',
    question:    'Had + subject + V3?',
    example: { affirmative: 'He had studied before the test.', negative: "He hadn't studied.", question: 'Had he studied?' },
  },
  {
    tense: 'Future Perfect',
    color: 'text-blue-700 dark:text-blue-300',
    category: 'Perfect',
    affirmative: 'subject + will + have + V3',
    negative:    'subject + will + not + have + V3',
    question:    'Will + subject + have + V3?',
    example: { affirmative: 'He will have studied by Friday.', negative: "He won't have studied.", question: 'Will he have studied?' },
  },
  {
    tense: 'Present Perfect Continuous',
    color: 'text-emerald-700 dark:text-emerald-300',
    category: 'Perfect Continuous',
    affirmative: 'subject + have/has + been + V1-ing',
    negative:    'subject + have/has + not + been + V1-ing',
    question:    'Have/Has + subject + been + V1-ing?',
    example: { affirmative: 'He has been studying for hours.', negative: "He hasn't been studying.", question: 'Has he been studying?' },
  },
  {
    tense: 'Past Perfect Continuous',
    color: 'text-amber-700 dark:text-amber-300',
    category: 'Perfect Continuous',
    affirmative: 'subject + had + been + V1-ing',
    negative:    'subject + had + not + been + V1-ing',
    question:    'Had + subject + been + V1-ing?',
    example: { affirmative: 'He had been studying when she called.', negative: "He hadn't been studying.", question: 'Had he been studying?' },
  },
  {
    tense: 'Future Perfect Continuous',
    color: 'text-blue-700 dark:text-blue-300',
    category: 'Perfect Continuous',
    affirmative: 'subject + will have been + V1-ing',
    negative:    "subject + won't have been + V1-ing",
    question:    'Will + subject + have been + V1-ing?',
    example: { affirmative: 'He will have been studying for a year.', negative: "He won't have been studying.", question: 'Will he have been studying?' },
  },
];

const CATEGORY_BADGE: Record<string, string> = {
  'Simple':            'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200',
  'Continuous':        'bg-teal-50 text-teal-700 dark:bg-teal-700/30 dark:text-teal-200',
  'Perfect':           'bg-violet-50 text-violet-700 dark:bg-violet-700/30 dark:text-violet-200',
  'Perfect Continuous':'bg-rose-50 text-rose-700 dark:bg-rose-700/30 dark:text-rose-200',
};

/** Bold any Vx code in a formula string */
function FormulaText({ text }: { text: string }) {
  const parts = text.split(/(V1-3rd|V1-ing|V1|V2|V3)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^(V1-3rd|V1-ing|V1|V2|V3)$/.test(part)
          ? <strong key={i} className="font-black text-text">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

const FORM_LABELS: { key: FormType; label: string }[] = [
  { key: 'affirmative', label: 'Affirmative' },
  { key: 'negative',    label: 'Negative' },
  { key: 'question',    label: 'Question' },
];

export function TenseFormulaModal({ isOpen, onClose }: TenseFormulaModalProps) {
  const [form, setForm] = useState<FormType>('affirmative');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="formula-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="formula-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[201] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full"
          >
            <div className="bg-white dark:bg-[#162b3d] rounded-t-[2rem] sm:rounded-[2rem] border border-white/20 shadow-2xl max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                <div>
                  <h2 className="font-display text-xl font-black text-text tracking-tight">Tense Formulas</h2>
                  <p className="text-xs text-text-muted/60 font-medium mt-0.5">subject + verb form structure</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-border/40 text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form toggle */}
              <div className="px-6 pb-4 shrink-0">
                <div className="inline-flex rounded-xl border border-border/30 bg-surface-elevated p-1 gap-1">
                  {FORM_LABELS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setForm(key)}
                      style={form === key ? { backgroundColor: '#d97757', color: '#fff' } : {}}
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                        form === key
                          ? 'shadow-md scale-105'
                          : 'text-text-muted/60 hover:text-text hover:bg-surface'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-y-auto px-6 space-y-5">
                {(['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'] as const).map((category) => {
                  const rows = TENSES.filter((t) => t.category === category);
                  return (
                    <div key={category}>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${CATEGORY_BADGE[category]}`}>
                        {category}
                      </span>
                      <div className="overflow-x-auto -mx-1 px-1">
                      <table className="min-w-full text-xs border-collapse">
                        <tbody>
                          {rows.map(({ tense, color, affirmative, negative, question, example }) => {
                            const formula = form === 'affirmative' ? affirmative : form === 'negative' ? negative : question;
                            const ex = example[form];
                            return (
                              <tr key={tense} className="border-b border-border/15 last:border-0">
                                <td className={`py-2.5 pr-4 font-black text-[11px] uppercase tracking-wide whitespace-nowrap w-px ${color}`}>
                                  {tense}
                                </td>
                                <td className="py-2.5 pr-4 text-text-muted/80 font-medium">
                                  <FormulaText text={formula} />
                                </td>
                                <td className="py-2.5 pl-4 text-text-muted/55 italic text-[11px] whitespace-nowrap">
                                  {ex}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  );
                })}
                {/* Legend */}
                <div className="pt-4 pb-6 border-t border-border/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/40 mb-2">Verb Form Key</p>
                  <div className="flex flex-wrap gap-2">
                    {LEGEND.map(({ code, desc, eg }) => (
                      <div key={code} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border/30 text-xs">
                        <strong className="font-black text-text">{code}</strong>
                        <span className="text-text-muted/60">= {desc}</span>
                        <span className="italic text-text-muted/50">({eg})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
