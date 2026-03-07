'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { VerbQuizContent, VerbQuizAnswers } from '@/types/verb-quiz';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface VerbQuizProps {
  content: VerbQuizContent;
  activityId: string;
  activityTitle?: string;
  onComplete: (answers: VerbQuizAnswers, score: number) => void;
  isSubmitting?: boolean;
}

// Helper function to parse date string as local date (not UTC)
const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0); // noon local to avoid DST edge
};

export default function VerbQuiz({ content, activityId, activityTitle, onComplete, isSubmitting = false }: VerbQuizProps) {
  void activityId;
  const headerTitle = activityTitle ?? `${content.week} - Irregular Verb Quiz`;
  const [answers, setAnswers] = useState<VerbQuizAnswers>(() => {
    const initial: VerbQuizAnswers = {};
    Object.keys(content.verbs).forEach(verb => {
      initial[verb] = {
        v1_3rd: '',
        v1_ing: '',
        v2: '',
        v3: ''
      };
    });
    return initial;
  });

  const handleInputChange = (verb: string, form: keyof VerbQuizAnswers[string], value: string) => {
    setAnswers(prev => ({
      ...prev,
      [verb]: {
        ...prev[verb],
        [form]: value.trim()
      }
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    const total = Object.keys(content.verbs).length * 4; // 4 forms per verb

    Object.entries(content.verbs).forEach(([verb, correctAnswers]) => {
      const userAnswers = answers[verb];
      if (userAnswers.v1_3rd.toLowerCase() === correctAnswers.v1_3rd.toLowerCase()) correct++;
      if (userAnswers.v1_ing.toLowerCase() === correctAnswers.v1_ing.toLowerCase()) correct++;
      if (userAnswers.v2.toLowerCase() === correctAnswers.v2.toLowerCase()) correct++;
      if (userAnswers.v3.toLowerCase() === correctAnswers.v3.toLowerCase()) correct++;
    });

    return Math.round((correct / total) * 100);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    onComplete(answers, score);
  };

  const isComplete = Object.values(answers).every(verbAnswers =>
    Object.values(verbAnswers).every(answer => answer.length > 0)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-elevated)] rounded-2xl shadow-lg border border-[var(--color-border-subtle)] p-6"
      >
        <h2 className="text-2xl font-display font-bold text-[var(--color-text)] mb-2">
          {headerTitle}
        </h2>
        <p className="text-[var(--color-text)]">
          Complete the verb forms for each irregular verb. The base form (V1) is provided.
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          Due: {parseLocalDate(content.due_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </motion.div>

      {/* Quiz Table - Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden md:block bg-[var(--color-surface-elevated)] rounded-2xl shadow-lg border border-[var(--color-border-subtle)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-light)] border-b border-[var(--color-border-subtle)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Verb</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">V1<br /><span className="text-xs font-normal text-[var(--color-text-muted)]">(Base)</span></th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">V1 (3rd)<br /><span className="text-xs font-normal text-[var(--color-text-muted)]">(he/she/it)</span></th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">V1-ing<br /><span className="text-xs font-normal text-[var(--color-text-muted)]">(present)</span></th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">V2<br /><span className="text-xs font-normal text-[var(--color-text-muted)]">(past)</span></th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">V3<br /><span className="text-xs font-normal text-[var(--color-text-muted)]">(participle)</span></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(content.verbs).map(([verb, verbData], idx) => (
                <tr
                  key={verb}
                  className={`border-b border-[var(--color-border-subtle)] transition-colors ${
                    idx % 2 === 0 ? 'bg-[var(--color-surface-elevated)]' : 'bg-[var(--color-bg-light)]/45'
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-[var(--color-text)] capitalize">To {verb}</td>
                  <td className="px-6 py-4">
                    <div className="px-3 py-2 bg-[var(--color-bg-light)] rounded-lg text-[var(--color-text)] font-mono text-sm border border-[var(--color-border-subtle)]">
                      {verbData.v1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={answers[verb].v1_3rd}
                      onChange={(e) => handleInputChange(verb, 'v1_3rd', e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-[var(--color-primary)] transition-[border-color] font-mono text-sm"
                      disabled={isSubmitting}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={answers[verb].v1_ing}
                      onChange={(e) => handleInputChange(verb, 'v1_ing', e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-[var(--color-primary)] transition-[border-color] font-mono text-sm"
                      disabled={isSubmitting}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={answers[verb].v2}
                      onChange={(e) => handleInputChange(verb, 'v2', e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-[var(--color-primary)] transition-[border-color] font-mono text-sm"
                      disabled={isSubmitting}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={answers[verb].v3}
                      onChange={(e) => handleInputChange(verb, 'v3', e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-[var(--color-primary)] transition-[border-color] font-mono text-sm"
                      disabled={isSubmitting}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quiz Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {Object.entries(content.verbs).map(([verb, verbData], idx) => (
          <motion.div
            key={verb}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-[var(--color-surface-elevated)] rounded-2xl shadow-lg border border-[var(--color-border-subtle)] p-4"
          >
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-3 capitalize">To {verb}</h3>

            <div className="space-y-3">
              <div className="bg-[var(--color-bg-light)] rounded-lg p-3 border border-[var(--color-border-subtle)]">
                <label className="text-xs font-semibold text-[var(--color-text-muted)] mb-1 block">
                  V1 (Base Form)
                </label>
                <div className="px-3 py-2 bg-[var(--color-surface-elevated)] rounded-lg text-[var(--color-text)] font-mono text-sm border border-[var(--color-border-subtle)]">
                  {verbData.v1}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] mb-1 block">
                  V1 (3rd person) - he/she/it
                </label>
                <input
                  type="text"
                  value={answers[verb].v1_3rd}
                  onChange={(e) => handleInputChange(verb, 'v1_3rd', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-[var(--color-primary)] transition-[border-color] font-mono text-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] mb-1 block">
                  V1-ing (Present Participle)
                </label>
                <input
                  type="text"
                  value={answers[verb].v1_ing}
                  onChange={(e) => handleInputChange(verb, 'v1_ing', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-[var(--color-primary)] transition-[border-color] font-mono text-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] mb-1 block">
                  V2 (Simple Past)
                </label>
                <input
                  type="text"
                  value={answers[verb].v2}
                  onChange={(e) => handleInputChange(verb, 'v2', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-[var(--color-primary)] transition-[border-color] font-mono text-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] mb-1 block">
                  V3 (Past Participle)
                </label>
                <input
                  type="text"
                  value={answers[verb].v3}
                  onChange={(e) => handleInputChange(verb, 'v3', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-[var(--color-primary)] transition-[border-color] font-mono text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className={`
            px-8 py-4 rounded-xl font-semibold text-white text-lg
            transition-[transform,box-shadow] duration-300 transform hover:scale-105
            shadow-lg hover:shadow-xl
            flex items-center gap-3
            ${isComplete && !isSubmitting
              ? 'bg-terracotta hover:bg-terracotta/90'
              : 'bg-neutral-300 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Submit Quiz
            </>
          )}
        </button>
      </motion.div>

      {!isComplete && (
        <p className="text-center text-sm text-neutral-500">
          Complete all fields to submit your quiz
        </p>
      )}
    </div>
  );
}
