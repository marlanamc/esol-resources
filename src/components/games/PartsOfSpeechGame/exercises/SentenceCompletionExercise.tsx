'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { validatePOSAnswer } from '@/data/parts-of-speech-exercises';
import { POS_LABELS, POS_DEFINITIONS } from '@/types/parts-of-speech';
import type { POSExercise, PartOfSpeech } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export const SentenceCompletionExercise = memo(function SentenceCompletionExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const { prompt, options = [], optionPOS = [], correctAnswer } = exercise;
  const correctWord = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;

  // Render sentence with blank as a styled underline span
  const blankIndex = prompt.indexOf('___');
  const before = blankIndex !== -1 ? prompt.slice(0, blankIndex) : prompt;
  const after = blankIndex !== -1 ? prompt.slice(blankIndex + 3) : '';

  const handleSelect = (option: string) => {
    if (answered || selected) return;
    setSelected(option);
    onAnswer(validatePOSAnswer(exercise, option));
  };

  const isAnswered = !!selected;
  const isCorrect = isAnswered && validatePOSAnswer(exercise, selected);

  // Build feedback message
  const selectedIdx = selected ? options.indexOf(selected) : -1;
  const selectedPOS: PartOfSpeech | undefined = selectedIdx >= 0 ? (optionPOS[selectedIdx] as PartOfSpeech) : undefined;
  const correctPOS = optionPOS[options.indexOf(correctWord)] as PartOfSpeech | undefined;

  const feedbackMessage = isAnswered
    ? isCorrect
      ? `"${selected}" is ${correctPOS ? `a ${POS_LABELS[correctPOS]}` : 'correct'} — it ${correctPOS ? POS_DEFINITIONS[correctPOS] : ''}.`
      : `"${selected}" is ${selectedPOS ? `a ${POS_LABELS[selectedPOS]}` : 'incorrect'}. The blank needs a ${correctPOS ? POS_LABELS[correctPOS] : 'different part of speech'} — a word that ${correctPOS ? POS_DEFINITIONS[correctPOS] : ''}.`
    : null;

  // If this is an old free-text exercise (no options / no completionMode), fall back to text input
  if (!options.length || exercise.completionMode === 'text') {
    return <SentenceCompletionTextFallback exercise={exercise} onAnswer={onAnswer} answered={answered} />;
  }

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        Choose the word that fits the blank
      </p>

      {/* Sentence card */}
      <div className="bg-white dark:bg-[#162b3d] p-6 sm:p-8 rounded-2xl border-2 border-border">
        <p className="font-display text-lg sm:text-2xl text-text text-center leading-relaxed">
          {before}
          {!isAnswered ? (
            <span className="inline-block border-b-2 border-primary mx-1 min-w-[80px]">&nbsp;</span>
          ) : (
            <span className={`font-bold px-1 rounded ${isCorrect ? 'bg-secondary/20 text-secondary' : 'bg-error/20 text-error'}`}>
              {correctWord}
            </span>
          )}
          {after}
        </p>
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
            {isCorrect ? '✓ Correct!' : '✗ Not quite'}
          </p>
          {feedbackMessage && (
            <p className="text-xs text-text-muted mt-1 leading-relaxed capitalize-first">
              {feedbackMessage}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
});

// ─── Legacy text fallback (persisted exercises without options) ───────────────

function SentenceCompletionTextFallback({
  exercise,
  onAnswer,
  answered,
}: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { prompt, correctAnswer } = exercise;
  const correct = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
  const blankIndex = prompt.indexOf('___');
  const before = blankIndex !== -1 ? prompt.slice(0, blankIndex) : prompt;
  const after = blankIndex !== -1 ? prompt.slice(blankIndex + 3) : '';

  const handleSubmit = () => {
    if (!input.trim() || submitted || answered) return;
    setSubmitted(true);
    onAnswer(validatePOSAnswer(exercise, input.trim()));
  };
  const isCorrect = submitted && validatePOSAnswer(exercise, input.trim());

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        Complete the sentence
      </p>
      <div className="bg-white dark:bg-[#162b3d] p-6 sm:p-8 rounded-2xl border-2 border-border">
        <p className="font-display text-lg sm:text-2xl text-text text-center leading-relaxed">
          {before}
          {!submitted ? (
            <span className="inline-block border-b-2 border-primary mx-1 min-w-[80px]">&nbsp;</span>
          ) : (
            <span className={`font-bold px-1 rounded ${isCorrect ? 'bg-secondary/20 text-secondary' : 'bg-error/20 text-error'}`}>
              {input}
            </span>
          )}
          {after}
        </p>
      </div>
      {!submitted ? (
        <div className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white dark:bg-[#162b3d] text-text text-base focus:outline-none focus:border-primary transition-colors"
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
          className={`p-4 rounded-xl border ${isCorrect ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`text-sm font-semibold ${isCorrect ? 'text-secondary' : 'text-error'}`}>
            {isCorrect ? '✓ Correct!' : `✗ The answer is "${correct}"`}
          </p>
        </motion.div>
      )}
    </div>
  );
}
