'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { GIExercise } from '@/types/gerund-infinitive';

interface ComboChallengeExerciseProps {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function ComboChallengeExercise({ exercise, onAnswer, answered }: ComboChallengeExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Reset when exercise changes
  useEffect(() => {
    setSelectedOption(null);
  }, [exercise.id]);

  const handleSelect = useCallback((option: string) => {
    if (answered) return;
    setSelectedOption(option);
  }, [answered]);

  const handleSubmit = useCallback(() => {
    if (!selectedOption || answered) return;
    const correct = selectedOption === exercise.correctAnswer;
    onAnswer(correct);
  }, [selectedOption, answered, exercise.correctAnswer, onAnswer]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (answered) return;
      if (e.key === 'Enter' && selectedOption) {
        handleSubmit();
      }
      // Number keys to select options
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4 && exercise.options) {
        const option = exercise.options[num - 1];
        if (option) handleSelect(option);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answered, selectedOption, handleSubmit, handleSelect, exercise.options]);

  // Parse the prompt to show the sentence with blanks highlighted
  const renderPrompt = () => {
    const parts = exercise.prompt.split('___');
    if (parts.length !== 3) {
      // Fallback if format is different
      return <span>{exercise.prompt}</span>;
    }

    return (
      <>
        {parts[0]}
        <span className="inline-flex items-center gap-1 mx-1">
          <span className="px-2 py-0.5 bg-secondary/10 border border-secondary/30 rounded text-secondary-dark font-semibold min-w-[2.5rem] text-center">
            {selectedOption ? selectedOption.split(' ')[0] : '?'}
          </span>
          <span className="px-2 py-0.5 bg-secondary/10 border border-secondary/30 rounded text-secondary-dark font-semibold min-w-[3rem] text-center">
            {selectedOption ? selectedOption.split(' ').slice(1).join(' ') : '?'}
          </span>
        </span>
        {parts[2]}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Base verb hint */}
      {exercise.baseVerb && (
        <div className="text-center">
          <span className="text-xs text-text-muted uppercase tracking-wider">Base verb: </span>
          <span className="text-sm font-semibold text-text">{exercise.baseVerb}</span>
        </div>
      )}

      {/* Sentence with blanks */}
      <div className="text-center py-4">
        <p className="text-sm text-text-muted mb-4">Choose the correct preposition and verb form to complete the sentence.</p>
        <p className="text-xl sm:text-2xl text-text leading-relaxed font-serif">
          {renderPrompt()}
        </p>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {exercise.options?.map((option) => {
          const isSelected = selectedOption === option;

          return (
            <motion.button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              whileHover={!answered ? { scale: 1.02 } : {}}
              whileTap={!answered ? { scale: 0.98 } : {}}
              className={`relative p-4 rounded-xl border-2 text-center transition-all flex items-center justify-center ${
                isSelected
                  ? 'border-secondary bg-secondary/10 shadow-md'
                  : 'border-border bg-white dark:bg-[#162b3d] hover:border-border-dark'
              } ${answered ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              <span className={`text-lg font-semibold ${isSelected ? 'text-secondary-dark' : 'text-text'}`}>
                {option}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!selectedOption || answered}
        whileHover={selectedOption && !answered ? { scale: 1.02 } : {}}
        whileTap={selectedOption && !answered ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          selectedOption && !answered
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-bg-gray text-text-muted cursor-not-allowed'
        }`}
      >
        Check Answer
      </motion.button>
    </div>
  );
}
