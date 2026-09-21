'use client';

import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { TenseComparisonPromptType, TenseComparisonQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { elementsUseSplitPast } from '../timelineTensesUtils';
import { useTimelineAudio } from '../hooks/useTimelineAudio';
import { AnswerFeedback } from '../AnswerFeedback';
import { TenseDialogueCard } from '../TenseDialogueCard';
import { highlightTimeClues } from '../highlightUtils';

interface TenseComparisonExerciseProps {
  question: TenseComparisonQuestion;
  onSubmit: (
    answer: {
      selectedTimeline: 'A' | 'B' | null;
      correctTimeline?: 'A' | 'B';
      promptType?: TenseComparisonPromptType;
    },
    isCorrect: boolean,
    tenseName?: string
  ) => void;
  onNext: () => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}

export function getTenseComparisonPromptLabel(promptType: TenseComparisonPromptType): string {
  if (promptType === 'clue-to-timeline') {
    return 'Which timeline matches this meaning clue?';
  }
  if (promptType === 'timeline-to-sentence') {
    return 'Which option matches this timeline contrast?';
  }
  return 'Which timeline matches this sentence?';
}

export function getTenseComparisonOptionOrder(): Array<'A' | 'B'> {
  return ['A', 'B'];
}

export function isTenseComparisonSelectionCorrect(
  selected: 'A' | 'B' | null,
  correctOption: 'A' | 'B'
): boolean {
  return selected === correctOption;
}

export const TenseComparisonExercise = memo(function TenseComparisonExercise({
  question,
  onSubmit,
  onNext,
  showFeedback,
  lastAnswerCorrect,
}: TenseComparisonExerciseProps) {
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [optionOrder, setOptionOrder] = useState<Array<'A' | 'B'>>(() =>
    getTenseComparisonOptionOrder()
  );
  const { playPing, playThump } = useTimelineAudio();

  useEffect(() => {
    setSelected(null);
    setOptionOrder(getTenseComparisonOptionOrder());
  }, [question.id]);

  const splitA = elementsUseSplitPast(question.elementsA);
  const splitB = elementsUseSplitPast(question.elementsB);
  const handleSubmit = () => {
    const isCorrect = isTenseComparisonSelectionCorrect(selected, question.correctOption);
    if (isCorrect) playPing(); else playThump();
    onSubmit(
      {
        selectedTimeline: selected,
        correctTimeline: question.correctOption,
        promptType: question.promptType,
      },
      isCorrect,
      question.correctOption === 'A' ? question.tenseA : question.tenseB
    );
  };

  const promptLabel = getTenseComparisonPromptLabel(question.promptType);
  const displayedOptions = optionOrder.map((label) => {
    const elements = label === 'A' ? question.elementsA : question.elementsB;
    const sentence = label === 'A' ? question.optionA.sentence : question.optionB.sentence;
    const tenseName = label === 'A' ? question.tenseA : question.tenseB;
    const useSplit = label === 'A' ? splitA : splitB;

    return { label, elements, sentence, tenseName, useSplit };
  });
  const correctTenseName = question.correctOption === 'A' ? question.tenseA : question.tenseB;
  // Map the data label (A/B) to the display label the student actually sees on screen
  const correctDisplayLabel = optionOrder.indexOf(question.correctOption) === 0 ? optionOrder[0] : optionOrder[1];

  return (
    <div className="px-2 sm:px-0 max-w-full overflow-hidden">
      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-6 sm:p-10 mb-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-primary" />
          <div className="text-xs font-black text-primary uppercase tracking-[0.3em]">
            Spot the Difference
          </div>
        </div>
        <p className="text-base font-medium text-text-muted mb-4">
          {promptLabel}
        </p>
        <p className="text-2xl sm:text-3xl font-display font-black text-text leading-tight tracking-tight">
          &ldquo;{question.promptText}&rdquo;
        </p>
      </motion.div>

      {!showFeedback ? (
        <>
          {/* Two timelines */}
          <div className="flex flex-col gap-4 mb-8">
            {displayedOptions.map(({ label, elements, useSplit }) => {
              const isSelected = selected === label;

              return (
                <motion.button
                  key={label}
                  onClick={() => setSelected(label)}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full rounded-[2rem] border-2 p-4 sm:p-6 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-white/30 bg-white/40 dark:bg-[#162b3d]/40 hover:border-primary/30 hover:bg-white/60 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white/60 dark:bg-white/10 text-text-muted'
                    }`}>
                      {label}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-text-muted/50'}`}>
                      Timeline {label}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check size={12} strokeWidth={3} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                  <TimelineCanvas
                    elements={elements}
                    interactive={false}
                    showLabels={false}
                    pastTimelineLayout={useSplit ? 'split' : 'single'}
                  />
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
              className="w-full py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
          answer={<p>Timeline {correctDisplayLabel}: <strong>{correctTenseName}</strong></p>}
          details={<>
            <p>{question.keyDifference}</p>
            <p>{question.confusionExplanation}</p>
            <TenseDialogueCard dialogue={question.realLifeDialogue} tenseName={correctTenseName} />
            {displayedOptions.map(({ label, elements, useSplit, tenseName, sentence }) => (
              <div key={label} className="space-y-2">
                <p className="font-semibold">Timeline {label}: {tenseName}</p>
                <p>{highlightTimeClues(sentence)}</p>
                <TimelineCanvas elements={elements} interactive={false} showLabels={true} pastTimelineLayout={useSplit ? 'split' : 'single'} />
              </div>
            ))}
          </>}
        />
      )}
    </div>
  );
});
