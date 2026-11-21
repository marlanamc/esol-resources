'use client';

import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';

interface AnswerFeedbackProps {
  feedbackKey: string;
  isCorrect: boolean;
  answer: ReactNode;
  details?: ReactNode;
  onContinue: () => void;
  continueLabel?: string;
  detailsLabel?: string;
  resultLabel?: string;
}

/** One short result and a clear next step; teaching details stay optional. */
export function AnswerFeedback({
  feedbackKey,
  isCorrect,
  answer,
  details,
  onContinue,
  continueLabel = 'Next Question',
  detailsLabel = 'Why?',
  resultLabel,
}: AnswerFeedbackProps) {
  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-border bg-bg-light p-4 sm:p-5 text-text [overflow-wrap:anywhere] [&_p]:mb-0">
      <div role="status" aria-live="polite" aria-atomic="true" className="space-y-2">
        <h3 className={`flex items-center gap-2 text-lg font-bold ${isCorrect ? 'text-emerald-700! dark:text-emerald-400!' : 'text-amber-800! dark:text-amber-300!'}`}>
          {isCorrect ? <Check size={20} aria-hidden="true" className="shrink-0" /> : <X size={20} aria-hidden="true" className="shrink-0" />}
          {resultLabel ?? (isCorrect ? 'Correct' : 'Not quite')}
        </h3>
        <div className="space-y-2 text-base leading-relaxed">{answer}</div>
      </div>
      {/* Before the details in reading order (keyboard, screen readers). On
          phones it is shown last and pinned to the bottom of the screen so it
          stays reachable while "Why?" is open. */}
      <div className="order-last sticky bottom-0 z-10 -mx-4 -mb-4 mt-3 rounded-b-2xl bg-linear-to-t from-bg-light from-70% to-bg-light/0 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:static sm:order-none sm:mx-0 sm:mb-0 sm:mt-4 sm:rounded-none sm:bg-none sm:p-0">
        <button
          type="button"
          onClick={onContinue}
          className="min-h-11 w-full rounded-xl bg-primary! px-4 py-3 text-base font-bold text-text-on-accent! hover:bg-primary-dark! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {continueLabel}
        </button>
      </div>
      {details ? (
        <details key={feedbackKey} className="mt-2">
          <summary className="min-h-11 cursor-pointer rounded-lg py-3 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {detailsLabel}
          </summary>
          <div className="min-w-0 space-y-3 pt-1 text-base leading-relaxed">{details}</div>
        </details>
      ) : null}
    </section>
  );
}
