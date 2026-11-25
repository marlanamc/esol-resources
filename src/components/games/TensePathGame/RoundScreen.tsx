'use client';

import { X } from 'lucide-react';
import { GameErrorBoundary } from '@/components/system/ErrorBoundary';
import type { RuleCardPanel } from '@/lib/tense-path/levels';
import { QUESTION_TYPE_LABEL, isChallengeQuestion, type TensePathQuestion } from '@/lib/tense-path/questions';
import { ContextTenseExercise } from '../TimelineTensesGame/exercises/ContextTenseExercise';
import { ErrorCorrectionExercise } from '../TimelineTensesGame/exercises/ErrorCorrectionExercise';
import { SentenceToTimelineExercise } from '../TimelineTensesGame/exercises/SentenceToTimelineExercise';
import { SentenceTransformerExercise } from '../TimelineTensesGame/exercises/SentenceTransformerExercise';
import { TenseComparisonExercise } from '../TimelineTensesGame/exercises/TenseComparisonExercise';
import { TimelineToVerbExercise } from '../TimelineTensesGame/exercises/TimelineToVerbExercise';
import { RulePanel } from './RuleCardScreen';
import { SURFACE } from './theme';

interface RoundScreenProps {
  title: string;
  tag: string;
  questions: TensePathQuestion[];
  index: number;
  /** One entry per answered question. */
  results: boolean[];
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
  /** Rule reminder after a wrong answer; null hides it (final challenge). */
  rulePanelsFor: (q: TensePathQuestion) => RuleCardPanel[] | null;
  onSubmit: (isCorrect: boolean) => void;
  onNext: () => void;
  onQuit: () => void;
}

export function RoundScreen({
  title,
  tag,
  questions,
  index,
  results,
  showFeedback,
  lastAnswerCorrect,
  rulePanelsFor,
  onSubmit,
  onNext,
  onQuit,
}: RoundScreenProps) {
  const question = questions[index];
  if (!question) return null;

  const exerciseProps = {
    onSubmit: (_answer: unknown, isCorrect: boolean) => onSubmit(isCorrect),
    onNext,
    showFeedback,
    lastAnswerCorrect,
  };
  const challenge = isChallengeQuestion(question);
  const reminder = showFeedback && lastAnswerCorrect === false ? rulePanelsFor(question) : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 pb-10 pt-3 sm:px-8 sm:pt-6">
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={onQuit}
          aria-label="Quit this round"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${SURFACE} bg-white! dark:bg-[#162b3d]! border! text-text-muted hover:text-text`}
        >
          <X size={20} />
        </button>
        <div className="hidden min-w-0 shrink-0 sm:block">
          <div className="truncate font-display text-xl text-text">{title}</div>
        </div>
        <span className="hidden shrink-0 rounded-full bg-accent-light px-3 py-1 text-xs font-bold text-[#5c4510] md:inline">{tag}</span>
        <ol className="flex flex-1 gap-1" aria-label={`Question ${index + 1} of ${questions.length}`}>
          {questions.map((q, i) => (
            <li
              key={`${q.id}-${i}`}
              className={`h-2.5 flex-1 rounded-full sm:h-3 ${
                i < results.length
                  ? results[i]
                    ? 'bg-secondary-dark'
                    : 'bg-error'
                  : i === index
                    ? 'bg-primary'
                    : 'bg-bg-gray dark:bg-white/10'
              }`}
            />
          ))}
        </ol>
        <span className="shrink-0 text-base font-bold text-text-muted sm:text-lg">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
            challenge ? 'bg-primary/15 text-primary-text' : 'bg-secondary/20 text-secondary-dark dark:text-secondary-light'
          }`}
        >
          {QUESTION_TYPE_LABEL[question.type]}
          {challenge ? ' · Challenge' : ''}
        </span>
        <span className="text-sm font-bold text-text sm:hidden">{title}</span>
      </div>

      <GameErrorBoundary gameName="Tense Path">
        <div key={`${question.id}-${index}`}>
          {question.type === 'sentence-to-timeline' ? (
            <SentenceToTimelineExercise question={question} {...exerciseProps} />
          ) : question.type === 'timeline-to-verb' ? (
            <TimelineToVerbExercise question={question} {...exerciseProps} />
          ) : question.type === 'tense-comparison' ? (
            <TenseComparisonExercise question={question} {...exerciseProps} />
          ) : question.type === 'sentence-transformer' ? (
            <SentenceTransformerExercise question={question} {...exerciseProps} />
          ) : question.type === 'context-tense-picker' ? (
            <ContextTenseExercise question={question} {...exerciseProps} />
          ) : (
            <ErrorCorrectionExercise question={question} {...exerciseProps} />
          )}
        </div>
      </GameErrorBoundary>

      {reminder && reminder.length > 0 ? (
        <section aria-label="Rule reminder" className="flex flex-col gap-3">
          <div className="text-sm font-bold uppercase tracking-widest text-text-muted">Remember the rule</div>
          <div className={`grid gap-3 ${reminder.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {reminder.map((panel) => (
              <RulePanel key={panel.label} panel={panel} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
