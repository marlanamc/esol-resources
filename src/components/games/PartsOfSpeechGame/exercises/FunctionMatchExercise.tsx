'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validatePOSAnswer } from '@/data/parts-of-speech-exercises';
import type { POSExercise, GrammaticalRole } from '@/types/parts-of-speech';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

const ROLE_LABELS: Record<GrammaticalRole, string> = {
  subject: 'Subject',
  verb: 'Verb',
  'direct-object': 'Object',
  'indirect-object': 'Indirect Object',
  modifier: 'Modifier',
  complement: 'Complement',
  connector: 'Connector',
};

const ROLE_DESCRIPTIONS: Record<GrammaticalRole, string> = {
  subject: 'Who or what does the action',
  verb: 'The action or state',
  'direct-object': 'Who or what receives the action',
  'indirect-object': 'To/for whom',
  modifier: 'Describes another word',
  complement: 'Completes the meaning',
  connector: 'Links parts of the sentence',
};

export function FunctionMatchExercise({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { functionMatch, options = [], highlightedWord } = exercise;

  if (!functionMatch) return null;

  const { sentence } = functionMatch;
  const correctRole = functionMatch.correctFunction as GrammaticalRole;

  const handleSelect = (opt: string) => {
    if (answered || selected) return;
    setSelected(opt);
    onAnswer(validatePOSAnswer(exercise, opt));
  };

  const renderSentence = () => {
    if (!highlightedWord || !sentence.includes(highlightedWord)) {
      return <span>{sentence}</span>;
    }
    const parts = sentence.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span className="bg-primary/20 text-primary font-bold px-1 rounded">
          {highlightedWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <p className="font-display text-lg sm:text-xl text-text-muted uppercase tracking-wider text-center">
        What is the grammatical role of the highlighted word?
      </p>

      <div className="bg-white dark:bg-[#162b3d] p-6 rounded-2xl border-2 border-border text-center">
        <p className="font-display text-lg sm:text-2xl text-text leading-relaxed">
          {renderSentence()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const roleKey = opt as GrammaticalRole;
          const isSelected = selected === opt;
          const isCorrect = validatePOSAnswer(exercise, opt);

          let stateClass = 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40 cursor-pointer';
          if (selected) {
            if (isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/10 text-secondary';
            else if (isSelected && !isCorrect) stateClass = 'border-error bg-error/10 text-error';
            else if (!isSelected && isCorrect) stateClass = 'border-secondary bg-secondary/5 text-secondary';
            else stateClass = 'border-border bg-bg-gray opacity-40 cursor-not-allowed';
          }

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={!selected ? { scale: 1.02 } : {}}
              whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${stateClass}`}
            >
              <div className="font-semibold text-sm">{ROLE_LABELS[roleKey] ?? opt}</div>
              {ROLE_DESCRIPTIONS[roleKey] && (
                <div className="text-xs opacity-70 mt-0.5">{ROLE_DESCRIPTIONS[roleKey]}</div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-sm ${validatePOSAnswer(exercise, selected) ? 'bg-secondary/5 border-secondary/30' : 'bg-error/5 border-error/20'}`}
        >
          <p className={`font-semibold ${validatePOSAnswer(exercise, selected) ? 'text-secondary' : 'text-error'}`}>
            {validatePOSAnswer(exercise, selected)
              ? `✓ Correct! "${highlightedWord}" is the ${ROLE_LABELS[correctRole]}.`
              : `✗ "${highlightedWord}" is the ${ROLE_LABELS[correctRole]}, not the ${ROLE_LABELS[selected as GrammaticalRole] ?? selected}.`}
          </p>
          <p className="text-xs text-text-muted mt-1">{ROLE_DESCRIPTIONS[correctRole]}</p>
        </motion.div>
      )}
    </div>
  );
}
