'use client';

import { motion } from 'framer-motion';
import { VerbQuizContent, VerbQuizSubmission } from '@/types/verb-quiz';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Star } from 'lucide-react';
import { getVerbDefinition } from '@/lib/verb-definitions';
import { CourseMapReturnButton } from '@/components/navigation/CourseMapReturnButton';

interface VerbQuizResultsProps {
  content: VerbQuizContent;
  submission: VerbQuizSubmission;
  onRetake?: () => void;
}

const FORM_KEYS = ['v1_3rd', 'v1_ing', 'v2', 'v3'] as const;

const FORM_LABELS: Record<(typeof FORM_KEYS)[number], string> = {
  v1_3rd: 'V1 3rd',
  v1_ing: 'V1-ing',
  v2: 'V2',
  v3: 'V3',
};

export default function VerbQuizResults({ content, submission, onRetake }: VerbQuizResultsProps) {
  const percentage = submission.score;
  const isPerfect = percentage === 100;
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 80;

  const getGrade = () => {
    if (isPerfect) return { text: 'Perfect!', color: 'text-terracotta', icon: Trophy };
    if (isExcellent) return { text: 'Excellent!', color: 'text-sage', icon: Star };
    if (isGood) return { text: 'Good Job!', color: 'text-gold', icon: CheckCircle2 };
    return { text: 'Keep Practicing', color: 'text-[var(--color-text-muted)]', icon: RotateCcw };
  };

  const grade = getGrade();
  const GradeIcon = grade.icon;

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border/40 bg-[var(--color-surface-elevated)] p-8 text-center shadow-lg"
      >
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
          isPerfect ? 'bg-terracotta/10' : isExcellent ? 'bg-sage/10' : 'bg-gold/10'
        } mb-4`}>
          <GradeIcon className={`w-10 h-10 ${grade.color}`} />
        </div>

        <h2 className={`text-4xl font-display font-bold mb-2 ${grade.color}`}>
          {percentage}%
        </h2>
        <p className="mb-4 text-2xl font-semibold text-[var(--color-text)]">{grade.text}</p>

        <div className="flex items-center justify-center gap-6 text-sm text-[var(--color-text-muted)]">
          <div>
            <span className="font-semibold text-sage">{submission.correctCount}</span> correct
          </div>
          <div className="h-1 w-1 rounded-full bg-border"></div>
          <div>
            <span className="font-semibold text-[var(--color-text)]">{submission.totalForms}</span> total
          </div>
          <div className="h-1 w-1 rounded-full bg-border"></div>
          <div>
            <span className="font-semibold text-terracotta">+{submission.totalPoints}</span> points
          </div>
        </div>
      </motion.div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/40 bg-[var(--color-surface-elevated)] p-6 shadow-lg"
      >
        <h3 className="text-xl font-display font-bold text-terracotta mb-4">
          Detailed Results
        </h3>

        <div className="space-y-4">
          {Object.entries(content.verbs).map(([verb, correctAnswers], idx) => {
            const userAnswers = submission.answers[verb];
            const results = submission.results[verb];
            const verbCorrect = Object.values(results).filter(Boolean).length;
            const verbTotal = 4;
            const isVerbPerfect = verbCorrect === verbTotal;
            const definition = getVerbDefinition(verb, correctAnswers);
            const verbCardStyle = isVerbPerfect
              ? {
                  borderColor: 'var(--tone-grammar-border)',
                  backgroundColor: 'var(--tone-grammar-surface)',
                }
              : {
                  borderColor: 'var(--tone-quizzes-border)',
                  backgroundColor: 'var(--tone-quizzes-surface)',
                };

            return (
              <motion.div
                key={verb}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="rounded-[28px] border-2 p-4 shadow-[0_14px_34px_rgba(24,32,38,0.08)]"
                style={verbCardStyle}
              >
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
                        style={{
                          borderColor: 'var(--tone-vocabulary-border)',
                          backgroundColor: 'var(--tone-vocabulary-chip-bg)',
                          color: 'var(--tone-vocabulary-chip-text)',
                        }}
                      >
                        Term
                      </span>
                      {definition && (
                        <span
                          className="inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
                          style={{
                            borderColor: 'var(--tone-quizzes-border)',
                            backgroundColor: 'var(--tone-quizzes-chip-bg)',
                            color: 'var(--tone-quizzes-chip-text)',
                          }}
                        >
                          Definition
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold capitalize text-[var(--color-text)]">
                        To {verb}
                      </h4>
                      {definition && (
                        <p className="mt-1 text-sm leading-relaxed text-[var(--color-text)]">
                          {definition}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {correctAnswers.v1} • {correctAnswers.v1_3rd} • {correctAnswers.v1_ing} • {correctAnswers.v2} • {correctAnswers.v3}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold sm:text-right">
                    <span className={verbCorrect === verbTotal ? 'text-[var(--tone-grammar-accent-strong)]' : 'text-[var(--color-text-muted)]'}>
                      {verbCorrect}/{verbTotal}
                    </span>
                  </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-4 gap-3">
                  {FORM_KEYS.map((formKey) => {
                    const isCorrect = results[formKey];
                    const userAnswer = userAnswers[formKey];
                    const correctAnswer = correctAnswers[formKey];
                    const formStyle = isCorrect
                      ? {
                          borderColor: 'var(--tone-grammar-border)',
                          backgroundColor: 'color-mix(in srgb, var(--tone-grammar-surface) 88%, var(--surface-base))',
                        }
                      : {
                          borderColor: 'var(--tone-quizzes-border)',
                          backgroundColor: 'color-mix(in srgb, var(--tone-quizzes-surface) 92%, var(--surface-base))',
                        };

                    return (
                      <div
                        key={formKey}
                        className="rounded-2xl border p-3"
                        style={formStyle}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-[var(--tone-grammar-accent-strong)]" />
                          ) : (
                            <XCircle className="w-4 h-4 text-[var(--tone-quizzes-accent-strong)]" />
                          )}
                          <span
                            className="text-xs font-semibold uppercase"
                            style={{ color: isCorrect ? 'var(--tone-grammar-accent-strong)' : 'var(--tone-quizzes-accent-strong)' }}
                          >
                            {FORM_LABELS[formKey]}
                          </span>
                        </div>
                        <div className="font-mono text-sm">
                          <div
                            className={isCorrect ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text-muted)] line-through'}
                          >
                            {userAnswer || '—'}
                          </div>
                          {!isCorrect && (
                            <div className="mt-1 font-semibold text-[var(--tone-grammar-accent-strong)]">
                              ✓ {correctAnswer}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Stack */}
                <div className="md:hidden space-y-2">
                  {FORM_KEYS.map((formKey) => {
                    const isCorrect = results[formKey];
                    const userAnswer = userAnswers[formKey];
                    const correctAnswer = correctAnswers[formKey];
                    const formStyle = isCorrect
                      ? {
                          borderColor: 'var(--tone-grammar-border)',
                          backgroundColor: 'color-mix(in srgb, var(--tone-grammar-surface) 88%, var(--surface-base))',
                        }
                      : {
                          borderColor: 'var(--tone-quizzes-border)',
                          backgroundColor: 'color-mix(in srgb, var(--tone-quizzes-surface) 92%, var(--surface-base))',
                        };

                    return (
                      <div
                        key={formKey}
                        className="flex items-center justify-between rounded-2xl border p-3"
                        style={formStyle}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-[var(--tone-grammar-accent-strong)]" />
                          ) : (
                            <XCircle className="w-4 h-4 text-[var(--tone-quizzes-accent-strong)]" />
                          )}
                          <span
                            className="text-xs font-semibold uppercase"
                            style={{ color: isCorrect ? 'var(--tone-grammar-accent-strong)' : 'var(--tone-quizzes-accent-strong)' }}
                          >
                            {FORM_LABELS[formKey]}
                          </span>
                        </div>
                        <div className="font-mono text-sm text-right">
                          <div
                            className={isCorrect ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text-muted)] line-through'}
                          >
                            {userAnswer || '—'}
                          </div>
                          {!isCorrect && (
                            <div className="font-semibold text-[var(--tone-grammar-accent-strong)]">
                              ✓ {correctAnswer}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <CourseMapReturnButton className="w-full sm:w-auto" />
        {onRetake && (
          <button
            onClick={onRetake}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-6 py-3 font-semibold text-[var(--color-text)] shadow-sm transition-[background-color,transform,box-shadow] duration-300 hover:border-terracotta/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:w-auto dark:bg-[#162b3d]"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        )}
      </motion.div>

      {/* Study Tips */}
      {!isPerfect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-gold/10 to-terracotta/10 rounded-2xl border border-gold/30 p-6"
        >
          <h3 className="text-lg font-bold text-terracotta mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Study Tips
          </h3>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">•</span>
              <span>Review the verbs you missed and practice writing them out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">•</span>
              <span>Create flashcards for irregular verbs to help memorize the forms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta font-bold">•</span>
              <span>Try using the verbs in sentences to understand their context better</span>
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
