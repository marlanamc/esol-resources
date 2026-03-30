'use client';

import { motion } from 'framer-motion';
import { Check, X, Lightbulb, ArrowRight } from 'lucide-react';
import type { RealLifeDialogue, ValidVerbAnswer } from '@/types/activity';
import {
  type TimelineVerbBlankResult,
} from './timelineTensesUtils';
import { TenseDialogueCard } from './TenseDialogueCard';
import { highlightTimeClues } from './highlightUtils';

interface FeedbackPanelProps {
  isCorrect: boolean;
  tenseName: string;
  explanation: string;
  onContinue: () => void;
  // For Type 2 questions with multiple valid answers
  matchedAnswer?: ValidVerbAnswer;
  allValidAnswers?: ValidVerbAnswer[];
  blankFeedback?: TimelineVerbBlankResult[];
  /** Original sentence template for showing full correct sentence */
  sentenceTemplate?: string;
  /** Original sentence (SentenceToTimeline) — shown with time clue highlighting */
  sentence?: string;
  /** Optional per-question real-life dialogue */
  realLifeDialogue?: RealLifeDialogue;
}

export function FeedbackPanel({
  isCorrect,
  tenseName,
  explanation,
  onContinue,
  blankFeedback,
  sentenceTemplate,
  sentence,
  realLifeDialogue,
}: FeedbackPanelProps) {
  const hasBlankFeedback = (blankFeedback?.length ?? 0) > 0;

  // Escape special regex characters in a string
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Build the full correct sentence by replacing blanks with correct answers
  const buildCorrectSentence = (): string | null => {
    if (!sentenceTemplate || !blankFeedback || blankFeedback.length === 0) {
      return null;
    }

    let sentence = sentenceTemplate;
    for (const blank of blankFeedback) {
      // Get the correct answer (matched if correct, or first valid answer)
      const correctAnswer =
        blank.matchedAnswer?.answer ?? blank.validAnswers[0]?.answer ?? '';
      // Replace the blank pattern like ___[verb]___ with the correct answer
      // Escape special regex characters in the prompt label to prevent issues
      const escapedLabel = escapeRegex(blank.promptLabel);
      const blankPattern = new RegExp(`___\\[${escapedLabel}\\]___`, 'g');
      sentence = sentence.replace(blankPattern, correctAnswer);
    }
    return sentence;
  };

  const correctSentence = buildCorrectSentence();

  const getTenseColor = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('future')) return 'bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300';
    if (lower.includes('past')) return 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300';
    return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      aria-live="polite"
      className={`rounded-[2.5rem] p-8 border border-white/30 backdrop-blur-2xl shadow-2xl overflow-hidden relative ${
        isCorrect
          ? 'bg-white/40 dark:bg-emerald-500/10'
          : 'bg-white/40 dark:bg-amber-500/10'
      }`}
    >
      {/* Background Glows */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 opacity-20 ${
        isCorrect ? 'bg-emerald-500' : 'bg-amber-500'
      }`} />

      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
            isCorrect
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-amber-500 text-white shadow-amber-500/20'
          }`}
        >
          {isCorrect ? (
            <Check size={32} strokeWidth={3} />
          ) : (
            <X size={32} strokeWidth={3} />
          )}
        </motion.div>

        <div className="flex-1">
          <h3
            className={`text-3xl font-black font-display tracking-tight ${
              isCorrect
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {isCorrect ? 'Stellar Work!' : 'Almost There'}
          </h3>
          <div className="mt-2">
            <span
              className={`inline-flex px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getTenseColor(tenseName)}`}
            >
              {tenseName}
            </span>
          </div>
        </div>
      </div>

      {/* Full correct sentence (TimelineToVerb) with time clue highlighting */}
      {correctSentence && (
        <div className="mb-8 p-6 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20 shadow-inner">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-text-muted/40 mb-4">
            Master Sentence:
          </div>
          <p className="text-xl sm:text-2xl font-display font-black text-text leading-snug tracking-tight">
            {highlightTimeClues(correctSentence)}
          </p>
          <p className="text-[10px] text-text-muted/40 font-medium mt-3">
            Highlighted words are time clues — they signal which tense to use.
          </p>
        </div>
      )}

      {/* Original sentence (SentenceToTimeline) with time clue highlighting */}
      {sentence && !correctSentence && (
        <div className="mb-8 p-6 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20 shadow-inner">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-text-muted/40 mb-4">
            The Sentence:
          </div>
          <p className="text-xl sm:text-2xl font-display font-black text-text leading-snug tracking-tight">
            &ldquo;{highlightTimeClues(sentence)}&rdquo;
          </p>
          <p className="text-[10px] text-text-muted/40 font-medium mt-3">
            Highlighted words are time clues — they signal which tense to use.
          </p>
        </div>
      )}

      {/* Teaching Logic */}
      <div
        className={`mb-8 p-6 rounded-3xl border-l-[6px] shadow-sm ${
          isCorrect
            ? 'bg-emerald-500/5 border-emerald-500/40'
            : 'bg-amber-500/5 border-amber-500/40'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isCorrect ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
          }`}>
            <Lightbulb size={22} />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-text-muted/40 mb-1">
              Grammar Logic
            </div>
            <p className="text-base font-medium text-text leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Mini-dialogue */}
      <div className="mb-8">
        <TenseDialogueCard dialogue={realLifeDialogue} tenseName={tenseName} />
      </div>

      {/* Blank-specific feedback journey */}
      {hasBlankFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border/40" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-text-muted/40">
              Breakdown
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>

          <div className="space-y-4">
            {blankFeedback?.map((blank) => {
              const targetAnswer = blank.validAnswers[0];

              return (
                <div
                  key={blank.blankId}
                  className={`rounded-[1.5rem] border transition-all duration-300 ${
                    blank.isCorrect
                      ? 'bg-emerald-500/5 border-emerald-500/10'
                      : 'bg-amber-500/5 border-amber-500/10'
                  }`}
                >
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                        blank.isCorrect ? 'bg-emerald-500 text-white shadow-lg' : 'bg-amber-500 text-white shadow-lg'
                      }`}>
                        {blank.isCorrect ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                      </div>
                      <div>
                        <div className="text-xs font-black text-text-muted/40 uppercase tracking-widest mb-0.5">Verb: {blank.promptLabel}</div>
                        <div className="flex flex-wrap items-baseline gap-2">
                           <span className={`text-lg font-black ${blank.isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                             {blank.userAnswer ? `"${blank.userAnswer}"` : '(missing)'}
                           </span>
                           {!blank.isCorrect && targetAnswer && (
                             <>
                               <ArrowRight size={14} className="text-text-muted/20" />
                               <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                 "{targetAnswer.answer}"
                               </span>
                             </>
                           )}
                        </div>
                      </div>
                    </div>
                    {blank.isCorrect && blank.matchedAnswer && (
                      <div className="px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-widest border border-emerald-500/10">
                        {blank.matchedAnswer.tenseName}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onContinue}
        className="mt-10 w-full py-6 bg-primary text-white rounded-[1.5rem] font-black text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:shadow-[0_20px_32px_-12px_rgba(var(--primary-color-rgb),0.6)] hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
      >
        <span className="relative z-10">Next Question</span>
        <ArrowRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.button>
    </motion.div>
  );
}
