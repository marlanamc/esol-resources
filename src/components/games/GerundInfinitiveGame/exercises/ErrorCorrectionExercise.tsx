'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GIExercise, ErrorToken } from '@/types/gerund-infinitive';

interface Props { exercise: GIExercise; onAnswer: (correct: boolean) => void; answered: boolean; }

export function ErrorCorrectionExercise({ exercise, onAnswer, answered }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const { errorTokens = [], prompt, correctAnswer } = exercise;

  const handleTokenClick = (token: ErrorToken) => {
    if (selectedWord !== null) return;
    setSelectedWord(token.text);
    onAnswer(token.isError);
  };

  const correctStr = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;

  return (
    <div className="space-y-5">
      <p className="text-text-muted text-sm text-center">
        {prompt.split(/(\bincorrect\b)/i).map((part, i) =>
          part.toLowerCase() === 'incorrect' ? (
            <strong key={i} className="font-semibold text-text">{part}</strong>
          ) : (
            part
          )
        )}
      </p>

      {/* Sentence with clickable tokens */}
      <div className="p-5 bg-white dark:bg-[#162b3d] rounded-2xl border-2 border-border text-center leading-loose">
        {errorTokens.map((token, i) => {
          const isSelected = selectedWord === token.text;
          let tokenClass = 'cursor-pointer rounded px-0.5 hover:bg-primary/10 hover:text-primary transition-colors';
          if (answered) {
            if (token.isError) tokenClass = 'underline decoration-wavy decoration-error text-error font-semibold cursor-default';
            else if (isSelected && !token.isError) tokenClass = 'bg-error/10 text-error rounded px-0.5 cursor-default line-through';
            else tokenClass = 'cursor-default';
          } else if (isSelected) {
            tokenClass = token.isError
              ? 'bg-error/10 text-error rounded px-0.5'
              : 'bg-error/10 text-error rounded px-0.5 line-through';
          }

          if (token.text.trim() === '') return <span key={i}>{token.text}</span>;

          return (
            <motion.span
              key={i}
              whileHover={!answered && !selectedWord ? { scale: 1.05 } : {}}
              onClick={() => handleTokenClick(token)}
              className={`font-display ${tokenClass}`}
            >
              {token.text}
            </motion.span>
          );
        })}
      </div>

      {answered && selectedWord && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm">
          {errorTokens.find(t => t.text === selectedWord)?.isError
            ? <span className="text-secondary font-medium">✓ You found it! The correct form is: <strong>{correctStr}</strong></span>
            : <span className="text-error">✗ That was not the error. The correct form is: <strong>{correctStr}</strong></span>
          }
        </motion.div>
      )}
    </div>
  );
}
