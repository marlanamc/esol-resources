'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { validateAnswer } from '@/data/gerund-infinitive-exercises';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function ScenarioChoiceExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { prompt, options = [], scenario, baseVerb } = exercise;

  const parts = prompt.split('___');
  const before = parts[0] ?? '';
  const after = parts[1] ?? '';

  const handleOptionSelect = (opt: string) => {
    if (submitted || answered) return;
    setSelected(opt);
    const correct = validateAnswer(exercise, opt);
    onAnswer(correct);
    setSubmitted(true);
  };

  const handleTypeSubmit = () => {
    if (submitted || answered || !inputValue.trim()) return;
    const correct = validateAnswer(exercise, inputValue);
    setSubmitted(true);
    onAnswer(correct);
  };

  const hasOptions = options.length > 0;

  return (
    <div className="space-y-6">
      {scenario && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">
            {scenario}
          </p>
        </div>
      )}
      <p className="font-display text-lg sm:text-xl text-text text-center leading-relaxed">
        {before}
        {hasOptions ? (
          <span className="inline-block mx-1 font-bold text-primary">___</span>
        ) : (
          <span className="inline-flex flex-col items-center mx-1 align-middle">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTypeSubmit()}
              disabled={submitted}
              placeholder="......"
              autoComplete="off"
              spellCheck={false}
              className="border-b-4 bg-transparent text-center outline-none text-primary font-bold w-28 sm:w-36 px-2 pb-1 border-primary/30 focus:border-primary"
            />
            {baseVerb && (
              <span className="text-xs text-text-muted mt-1">({baseVerb})</span>
            )}
          </span>
        )}
        {after}
      </p>
      {hasOptions ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = validateAnswer(exercise, opt);
            let stateClass = 'border-border bg-white dark:bg-[#162b3d]';
            if (submitted) {
              if (isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/10';
              else if (isSelected && !isCorrect) stateClass = 'border-error bg-error/10';
              else if (isCorrect) stateClass = 'border-secondary/50 bg-secondary/5';
            }
            return (
              <motion.button
                key={i}
                onClick={() => handleOptionSelect(opt)}
                disabled={submitted}
                whileHover={!submitted ? { scale: 1.02 } : {}}
                whileTap={!submitted ? { scale: 0.98 } : {}}
                className={`p-4 rounded-2xl border-2 text-center font-medium transition-all ${stateClass}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      ) : (
        !submitted && (
          <motion.button
            onClick={handleTypeSubmit}
            disabled={!inputValue.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50"
          >
            Check
          </motion.button>
        )
      )}
    </div>
  );
}
