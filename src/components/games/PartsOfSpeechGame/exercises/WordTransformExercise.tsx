'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { validatePOSAnswer } from '@/data/parts-of-speech-exercises';
import { POS_LABELS } from '@/types/parts-of-speech';
import type { POSExercise } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export const WordTransformExercise = memo(function WordTransformExercise({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { options = [], wordTransform } = exercise;

  if (!wordTransform) return null;

  const { fromWord, fromPOS, toPOS, correctAnswer, hint } = wordTransform;

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    onAnswer(validatePOSAnswer(exercise, option));
  };

  const isAnswered = !!selected;
  const isCorrect = isAnswered && validatePOSAnswer(exercise, selected);

  // If no choices generated (wordFamily < 2), fall back to text input
  if (!options.length) {
    return <WordTransformTextFallback exercise={exercise} onAnswer={onAnswer} answered={false} />;
  }

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        Change the part of speech
      </p>

      {/* Transformation header card */}
      <div className="bg-white dark:bg-[#162b3d] p-6 rounded-2xl border-2 border-border">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* From */}
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-primary">{fromWord}</div>
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wide">
              {POS_LABELS[fromPOS]} (original)
            </div>
          </div>

          {/* Arrow */}
          <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>

          {/* To */}
          <div className="text-center">
            {!isAnswered ? (
              <div className="text-2xl font-display font-bold text-border/60 italic">?</div>
            ) : (
              <div className={`text-2xl font-display font-bold ${isCorrect ? 'text-secondary' : 'text-error'}`}>
                {correctAnswer}
              </div>
            )}
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wide">
              {POS_LABELS[toPOS]} (new form)
            </div>
          </div>
        </div>
      </div>

      {/* 2×2 option grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, i) => {
          const isSelected = selected === option;
          const isOptionCorrect = validatePOSAnswer(exercise, option);

          let stateClass = 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 hover:shadow-sm cursor-pointer text-text';
          if (isAnswered) {
            if (isSelected && isOptionCorrect) stateClass = 'border-secondary bg-secondary/10 text-secondary';
            else if (isSelected && !isOptionCorrect) stateClass = 'border-error bg-error/10 text-error';
            else if (!isSelected && isOptionCorrect) stateClass = 'border-secondary bg-secondary/5 text-secondary';
            else stateClass = 'border-border bg-bg-gray opacity-50 cursor-not-allowed text-text-muted';
          }

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border-2 text-center font-semibold text-base transition-all duration-200 ${stateClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${isCorrect ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`text-sm font-semibold ${isCorrect ? 'text-secondary' : 'text-error'}`}>
            {isCorrect
              ? `✓ Correct! "${fromWord}" (${POS_LABELS[fromPOS]}) → "${correctAnswer}" (${POS_LABELS[toPOS]})`
              : `✗ The ${POS_LABELS[toPOS]} form of "${fromWord}" is "${correctAnswer}"`}
          </p>
          {hint && (
            <p className="text-xs text-text-muted mt-1 italic">Example: {hint}</p>
          )}
        </motion.div>
      )}
    </div>
  );
});

// ─── Legacy text fallback (wordFamily < 2, options not generated) ─────────────

function WordTransformTextFallback({ exercise, onAnswer }: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { wordTransform } = exercise;
  if (!wordTransform) return null;
  const { fromWord, fromPOS, toPOS, correctAnswer, hint } = wordTransform;

  const handleSubmit = () => {
    if (!input.trim() || submitted) return;
    setSubmitted(true);
    onAnswer(validatePOSAnswer(exercise, input.trim()));
  };
  const isCorrect = submitted && validatePOSAnswer(exercise, input.trim());

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        Change the part of speech
      </p>
      <div className="bg-white dark:bg-[#162b3d] p-6 rounded-2xl border-2 border-border">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-primary">{fromWord}</div>
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wide">{POS_LABELS[fromPOS]} (original)</div>
          </div>
          <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="text-center">
            {!submitted ? (
              <div className="text-2xl font-display font-bold text-border/60 italic">?</div>
            ) : (
              <div className={`text-2xl font-display font-bold ${isCorrect ? 'text-secondary' : 'text-error'}`}>
                {input || correctAnswer}
              </div>
            )}
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wide">{POS_LABELS[toPOS]} (new form)</div>
          </div>
        </div>
        {hint && !submitted && (
          <p className="text-xs text-text-muted text-center mt-4 italic border-t border-border pt-3">Hint: {hint}</p>
        )}
      </div>
      {!submitted ? (
        <div className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={`Type the ${POS_LABELS[toPOS].toLowerCase()} form...`}
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white dark:bg-[#162b3d] text-text text-base focus:outline-none focus:border-primary transition-colors text-center font-semibold"
            autoFocus
          />
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim()}
            whileHover={input.trim() ? { scale: 1.02 } : {}}
            whileTap={input.trim() ? { scale: 0.98 } : {}}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Check Answer
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-sm ${isCorrect ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`font-semibold ${isCorrect ? 'text-secondary' : 'text-error'}`}>
            {isCorrect ? `✓ Correct! "${fromWord}" → "${correctAnswer}" (${POS_LABELS[toPOS]})` : `✗ The answer is "${correctAnswer}" (${POS_LABELS[toPOS]})`}
          </p>
        </motion.div>
      )}
    </div>
  );
}
