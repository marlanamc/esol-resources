'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function DragOrderExercise({ exercise, onAnswer, answered }: Props) {
  const correctOrder = exercise.dragChunks ?? [];
  const [pool, setPool] = useState<string[]>(() => shuffleArray([...correctOrder]));
  const [built, setBuilt] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleTapChunk = (chunk: string, fromPool: boolean) => {
    if (submitted || answered) return;
    if (fromPool) {
      setPool(p => p.filter(c => c !== chunk));
      setBuilt(b => [...b, chunk]);
    } else {
      setBuilt(b => b.filter(c => c !== chunk));
      setPool(p => [...p, chunk]);
    }
  };

  const handleSubmit = () => {
    if (submitted || answered || built.length !== correctOrder.length) return;
    setSubmitted(true);
    const isCorrect = built.every((item, i) => item === correctOrder[i]);
    onAnswer(isCorrect);
  };

  const isComplete = built.length === correctOrder.length;
  const isCorrect =
    submitted && built.every((item, i) => item === correctOrder[i]);

  return (
    <div className="space-y-6">
      <p className="text-center text-text-muted text-sm font-medium">
        Tap chunks in order to build the sentence
      </p>
      <div className="min-h-[80px] p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          {built.length === 0 ? (
            <span className="text-text-muted text-sm">Tap below to start</span>
          ) : (
            built.map((chunk, i) => (
              <motion.button
                key={`built-${chunk}-${i}`}
                onClick={() => handleTapChunk(chunk, false)}
                disabled={submitted}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-4 py-2 rounded-xl border-2 font-medium text-sm ${
                  submitted
                    ? chunk === correctOrder[i]
                      ? 'border-secondary bg-secondary/10'
                      : 'border-error bg-error/10'
                    : 'border-primary/50 bg-white dark:bg-[#162b3d] hover:border-primary'
                }`}
              >
                {chunk}
              </motion.button>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {pool.map((chunk, i) => (
          <motion.button
            key={`pool-${chunk}-${i}`}
            onClick={() => handleTapChunk(chunk, true)}
            disabled={submitted}
            className="px-4 py-2 rounded-xl border-2 border-border bg-white dark:bg-[#162b3d] font-medium text-sm hover:border-primary/40"
          >
            {chunk}
          </motion.button>
        ))}
      </div>
      {isComplete && !submitted && (
        <motion.button
          onClick={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-lg"
        >
          Check order
        </motion.button>
      )}
      {submitted && !isCorrect && (
        <p className="text-center text-sm text-error font-medium">
          Correct: {correctOrder.join(' ')}
        </p>
      )}
    </div>
  );
}

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
