'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lightbulb, ArrowRight } from 'lucide-react';
import type { ContextTenseQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { MiniTimelinePreview } from '../MiniTimelinePreview';
import { elementsUseSplitPast } from '../timelineTensesUtils';
import { useTimelineAudio } from '../hooks/useTimelineAudio';

interface ContextTenseExerciseProps {
  question: ContextTenseQuestion;
  onSubmit: (answer: { selectedTense: string | null }, isCorrect: boolean, tenseName?: string) => void;
  onNext: () => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}

/** Highlight context clue words/phrases in the scenario text */
function highlightClues(scenario: string, clues: string[], highlight: boolean): React.ReactNode {
  if (!highlight || clues.length === 0) {
    return <>{scenario}</>;
  }

  // Build a regex that matches any of the clue strings (case-insensitive)
  const escaped = clues.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = scenario.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const isClue = clues.some((c) => c.toLowerCase() === part.toLowerCase());
        return isClue ? (
          <mark key={i} className="bg-accent/40 text-text rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </>
  );
}

export function ContextTenseExercise({
  question,
  onSubmit,
  onNext,
  showFeedback,
  lastAnswerCorrect,
}: ContextTenseExerciseProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const { playPing, playThump } = useTimelineAudio();

  const correctIdx = question.options.findIndex((o) => o.isCorrect);

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = question.options[selected].isCorrect;
    if (isCorrect) playPing(); else playThump();
    const tenseName = question.options[selected].tenseName;
    onSubmit({ selectedTense: tenseName }, isCorrect, tenseName);
  };

  return (
    <div className="px-2 sm:px-0 max-w-full overflow-hidden">
      {/* Scenario card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-6 sm:p-10 mb-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-primary" />
          <div className="text-xs font-black text-primary uppercase tracking-[0.3em]">
            In Context
          </div>
        </div>
        <p className="text-base text-text-muted font-medium mb-3">
          Choose the correct form of <span className="font-black text-text">({question.blankVerb})</span>:
        </p>
        <p className={`text-xl sm:text-2xl font-display font-black text-text leading-snug italic ${showFeedback ? '' : ''}`}>
          &ldquo;{showFeedback
            ? highlightClues(question.scenario, question.contextClues, true)
            : question.scenario}&rdquo;
        </p>
      </motion.div>

      {!showFeedback ? (
        <>
          {/* Option cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {question.options.map((option, idx) => {
              const isSelected = selected === idx;
              return (
                <motion.button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  whileTap={{ scale: 0.99 }}
                  className={`rounded-[1.75rem] border-2 p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-white/30 bg-white/40 dark:bg-[#162b3d]/40 hover:border-primary/30 hover:bg-white/60 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-black uppercase tracking-wider ${isSelected ? 'text-primary' : 'text-text-muted/70'}`}>
                      {option.tenseName}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check size={11} strokeWidth={3} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                  <p className={`text-lg font-display font-black mb-3 ${isSelected ? 'text-text' : 'text-text-muted'}`}>
                    &ldquo;{option.conjugatedVerb}&rdquo;
                  </p>
                  <MiniTimelinePreview elements={option.elements} />
                </motion.button>
              );
            })}
          </div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-4 sm:p-6 shadow-lg"
          >
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="w-full py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check Answer
            </button>
          </motion.div>
        </>
      ) : (
        /* Feedback */
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Result */}
            <motion.div
              className={`rounded-[2.5rem] p-6 sm:p-8 border border-white/30 backdrop-blur-2xl shadow-2xl ${
                lastAnswerCorrect ? 'bg-white/40 dark:bg-emerald-500/10' : 'bg-white/40 dark:bg-amber-500/10'
              }`}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  lastAnswerCorrect ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {lastAnswerCorrect ? <Check size={28} strokeWidth={3} /> : <X size={28} strokeWidth={3} />}
                </div>
                <div>
                  <h3 className={`text-2xl font-black font-display ${lastAnswerCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {lastAnswerCorrect ? 'Stellar Work!' : 'Almost There'}
                  </h3>
                  <p className="text-sm font-bold text-text-muted mt-1">
                    Correct: <span className="text-text">{question.options[correctIdx].tenseName} — &ldquo;{question.options[correctIdx].conjugatedVerb}&rdquo;</span>
                  </p>
                </div>
              </div>

              {/* Explanation */}
              <div className={`p-5 rounded-2xl border-l-4 mb-4 ${lastAnswerCorrect ? 'bg-emerald-500/5 border-emerald-500/40' : 'bg-amber-500/5 border-amber-500/40'}`}>
                <div className="flex items-start gap-3">
                  <Lightbulb size={20} className={`${lastAnswerCorrect ? 'text-emerald-600' : 'text-amber-600'} mt-0.5`} />
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-text-muted/40 mb-1">Grammar Logic</div>
                    <p className="text-base font-medium text-text leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Correct option with full timeline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2rem] border border-white/30 bg-white/60 dark:bg-[#162b3d]/60 p-5 sm:p-6 shadow-md"
            >
              <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-1">Correct Timeline</div>
              <p className="text-lg font-display font-black text-text mb-4">{question.options[correctIdx].tenseName}</p>
              <TimelineCanvas
                elements={question.options[correctIdx].elements}
                interactive={false}
                showLabels={true}
                pastTimelineLayout={elementsUseSplitPast(question.options[correctIdx].elements) ? 'split' : 'single'}
              />
            </motion.div>

            {/* Continue */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onNext}
              className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <span>Next Question</span>
              <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
