'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ContextTenseQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { MiniTimelinePreview } from '../MiniTimelinePreview';
import { elementsUseSplitPast } from '../timelineTensesUtils';
import { useTimelineAudio } from '../hooks/useTimelineAudio';
import { AnswerFeedback } from '../AnswerFeedback';
import { TenseDialogueCard } from '../TenseDialogueCard';

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

export const ContextTenseExercise = memo(function ContextTenseExercise({
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
        <AnswerFeedback
          feedbackKey={question.id}
          isCorrect={lastAnswerCorrect ?? false}
          onContinue={onNext}
          answer={<p><strong>{question.options[correctIdx].tenseName}</strong> — {question.options[correctIdx].conjugatedVerb}</p>}
          details={<>
            <p>{question.explanation}</p>
            <TenseDialogueCard dialogue={question.realLifeDialogue} tenseName={question.options[correctIdx].tenseName} />
            <TimelineCanvas
              elements={question.options[correctIdx].elements}
              interactive={false}
              showLabels={true}
              pastTimelineLayout={elementsUseSplitPast(question.options[correctIdx].elements) ? 'split' : 'single'}
            />
          </>}
        />
      )}
    </div>
  );
});
