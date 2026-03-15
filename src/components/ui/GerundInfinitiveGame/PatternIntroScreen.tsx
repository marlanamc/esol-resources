'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Play, BookOpen, ChevronRight, Trophy, AlertCircle, Check, Lightbulb } from 'lucide-react';
import { GI_REVIEW_GROUP_ID, GI_FINAL_GROUP_ID } from '@/data/gerund-infinitive-groups';
import type { GerundInfinitiveGroup, GIRoundMode, PatternExample } from '@/types/gerund-infinitive';

/**
 * Get vocabulary reminder based on the group type
 */
function getVocabReminder(group: GerundInfinitiveGroup): { title: string; examples: string; note?: string } | null {
  // Preposition groups
  if (group.id === 'group-1' || group.id === 'group-1b' || group.id === 'group-1d') {
    return {
      title: 'What is a preposition?',
      examples: 'in, at, for, of, about, to, from, with, without, before, after',
      note: 'Prepositions are small words that show relationships (location, time, direction).',
    };
  }

  // "TO" trap group
  if (group.id === 'group-1c') {
    return {
      title: 'When is "to" a preposition?',
      examples: 'look forward to, be used to, get used to, committed to',
      note: 'In these phrases, "to" is a preposition (not part of an infinitive), so use gerund!',
    };
  }

  // Adjective + Infinitive group
  if (group.id === 'group-3a') {
    return {
      title: 'What is an adjective?',
      examples: 'happy, ready, important, easy, difficult, nice, hard, possible',
      note: 'Adjectives describe feelings or qualities. They often come after "be" (I\'m happy, It\'s easy).',
    };
  }

  return null;
}

interface PatternIntroScreenProps {
  group: GerundInfinitiveGroup;
  roundMode: GIRoundMode;
  onStartChallenge: () => void;
  onBack: () => void;
}

export function PatternIntroScreen({
  group,
  roundMode,
  onStartChallenge,
  onBack,
}: PatternIntroScreenProps) {
  const isReview = group.id === GI_REVIEW_GROUP_ID;
  const isFinal = group.id === GI_FINAL_GROUP_ID;
  const isRound2 = roundMode === 'round2';

  // Gather ONE example from each pattern for diversity, then limit to 6
  const displayExamples: (PatternExample & { trigger: string })[] = group.patterns
    .slice(0, 6)
    .map(p => ({
      ...p.examples[0],
      trigger: p.trigger
    }));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back button (mobile) */}
      <div className="sm:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-text transition-colors"
        >
          <ArrowLeft size={16} />
          Back to groups
        </button>
      </div>

      {/* Group badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{group.icon ?? '📚'}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {group.difficulty === 1 ? 'Foundation' : group.difficulty === 2 ? 'Development' : 'Mastery'} Pattern
          </span>
        </div>
        {isRound2 && (
          <span className="px-3 py-1 rounded-full bg-accent/20 text-primary-dark text-xs font-semibold">
            Round 2 · Targeted Practice
          </span>
        )}
      </motion.div>

      {/* Title & Pattern */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h1 className="font-display text-3xl sm:text-4xl text-text leading-tight">{group.title}</h1>
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-sm text-primary-dark font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <BookOpen size={14} />
            The Pattern
          </p>
          <p className="text-text leading-relaxed">{group.pattern}</p>
        </div>

        {/* Vocabulary reminder */}
        {(() => {
          const reminder = getVocabReminder(group);
          if (!reminder) return null;
          return (
            <div className="p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl">
              <p className="text-sm text-sky-800 dark:text-sky-300 font-semibold mb-1 flex items-center gap-1.5">
                <Lightbulb size={14} />
                {reminder.title}
              </p>
              <p className="text-sky-700 dark:text-sky-400 text-sm font-medium">{reminder.examples}</p>
              {reminder.note && (
                <p className="text-sky-600 dark:text-sky-500 text-xs mt-1">{reminder.note}</p>
              )}
            </div>
          );
        })()}

        {group.memoryTrick && (
          <div className="p-3 bg-accent/10 border border-accent/30 rounded-xl">
            <p className="text-sm text-primary-dark font-semibold mb-0.5">💡 Memory Trick</p>
            <p className="text-text-muted text-sm">{group.memoryTrick}</p>
          </div>
        )}
      </motion.div>

      {/* Examples */}
      {displayExamples.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="font-display text-lg text-text flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-secondary/20 text-xs flex items-center justify-center text-[#3d6b47]">★</span>
            Examples
          </h2>

          <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden bg-white dark:bg-[#162b3d]">
            {displayExamples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="flex items-center gap-3 p-4"
              >
                <ChevronRight size={14} className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-text text-sm leading-relaxed">
                    {ex.sentence.includes('___') ? (
                      <>
                        {ex.sentence.split('___')[0]}
                        <span className="font-semibold text-primary bg-primary/10 px-1 rounded">
                          {ex.blank}
                        </span>
                        {ex.sentence.split('___')[1]}
                      </>
                    ) : (
                      ex.sentence
                    )}
                  </p>
                  {ex.context && (
                    <span className="text-xs text-text-muted mt-0.5 block">{ex.context}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Combo Challenge - Show full adjective + preposition + gerund reference */}
      {group.id === 'group-1d' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="font-display text-lg text-text flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            Master These Pairings
          </h2>
          <p className="text-sm text-text-muted">Remember: each adjective has ONE correct preposition, then add the gerund (-ing).</p>

          <div className="rounded-xl border border-border overflow-hidden bg-white dark:bg-[#162b3d]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-light dark:bg-white/5 border-b border-border">
                  <th className="text-left px-4 py-2 font-semibold text-text-muted">Adjective</th>
                  <th className="text-left px-4 py-2 font-semibold text-primary">Preposition</th>
                  <th className="text-left px-4 py-2 font-semibold text-secondary">+ Gerund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...group.patterns]
                  .sort((a, b) => (a.correctPreposition || '').localeCompare(b.correctPreposition || ''))
                  .map((pattern, i) => (
                  <tr key={i} className="hover:bg-bg-light/50 dark:hover:bg-white/5">
                    <td className="px-4 py-2 text-text font-medium">{pattern.trigger}</td>
                    <td className="px-4 py-2 text-primary font-bold">{pattern.correctPreposition}</td>
                    <td className="px-4 py-2 text-secondary">+ -ing</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-error/5 border border-error/20 rounded-xl">
            <p className="text-sm text-error/80 font-medium mb-2">Common Mistakes to Avoid:</p>
            <ul className="text-xs text-error/70 space-y-1">
              <li>✗ interested <strong>for</strong> learning → ✓ interested <strong>in</strong> learning</li>
              <li>✗ good <strong>in</strong> cooking → ✓ good <strong>at</strong> cooking</li>
              <li>✗ tired <strong>from</strong> waiting → ✓ tired <strong>of</strong> waiting</li>
              <li>✗ sorry <strong>about</strong> being late → ✓ sorry <strong>for</strong> being late</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Common Mistakes - Condensed table for preposition-choice, cards for others */}
      {group.id !== 'group-1d' && group.patterns.some(p => p.commonError) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="font-display text-lg text-text flex items-center gap-2">
            <AlertCircle size={18} className="text-error" />
            Quick Reference: Common Mistakes
          </h2>

          {/* If this is a preposition-choice group (many patterns), show as table */}
          {group.patterns[0]?.category === 'preposition-choice' ? (
            <div className="rounded-xl border border-border overflow-hidden bg-white dark:bg-[#162b3d]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-light dark:bg-white/5 border-b border-border">
                    <th className="text-left px-4 py-2 font-semibold text-text-muted">Adjective</th>
                    <th className="text-left px-4 py-2 font-semibold text-secondary">✓ Correct</th>
                    <th className="text-left px-4 py-2 font-semibold text-error">✗ Wrong</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...group.patterns]
                    .sort((a, b) => (a.correctPreposition || '').localeCompare(b.correctPreposition || ''))
                    .map((pattern, i) => (
                    <tr key={i} className="hover:bg-bg-light/50 dark:hover:bg-white/5">
                      <td className="px-4 py-2 text-text font-medium">{pattern.trigger}</td>
                      <td className="px-4 py-2 text-secondary font-semibold">{pattern.correctPreposition || pattern.correctForm}</td>
                      <td className="px-4 py-2 text-error/70 text-xs">{pattern.commonError?.replace(pattern.trigger + ' ', '').replace(pattern.trigger.toUpperCase() + ' ', '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* For other groups with fewer patterns, show compact cards */
            <div className="space-y-2">
              {group.patterns.slice(0, 3).map((pattern, i) => (
                pattern.commonError && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="p-3 rounded-xl bg-error/5 border border-error/20 flex items-center gap-3"
                  >
                    <span className="text-error text-sm">✗</span>
                    <span className="text-sm text-error/80">{pattern.commonError}</span>
                    <span className="text-text-muted mx-1">→</span>
                    <span className="text-sm text-secondary font-medium flex items-center gap-1">
                      <Check size={12} />
                      {pattern.trigger} {pattern.correctForm === 'gerund' ? '-ing' : 'to + verb'}
                    </span>
                  </motion.div>
                )
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Special notes for mixed/final */}
      {(isReview || isFinal) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className={`p-4 rounded-xl border ${isFinal ? 'bg-accent/10 border-accent/30' : 'bg-secondary/5 border-secondary/20'}`}
        >
          {isFinal ? (
            <div className="flex items-start gap-3">
              <Trophy size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text">20 exercises · All patterns · No hints</p>
                <p className="text-text-muted text-sm mt-1">Earn the Grammar Guru badge and 50 bonus points for completing this challenge!</p>
              </div>
            </div>
          ) : (
            <p className="text-text-muted text-sm">
              This review session mixes patterns from all the groups you have completed. Exercises focus on your weakest patterns.
            </p>
          )}
        </motion.div>
      )}

      {/* Round 2 notice */}
      {isRound2 && !isReview && !isFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <p className="text-sm text-text">
            <strong>Round 2 — Mastery Check:</strong> These exercises focus on the patterns you found most difficult in Round 1.
            Score <strong>85%+</strong> to achieve mastery and earn the ✦ badge.
          </p>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        <button
          onClick={onBack}
          className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-border text-text-muted hover:text-text hover:border-border-dark transition-colors font-semibold"
        >
          ← Back
        </button>
        <motion.button
          onClick={onStartChallenge}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          <Play size={18} />
          {isFinal ? 'Start Final Challenge' : isReview ? 'Start Review' : isRound2 ? 'Start Round 2' : 'Start Challenge'}
        </motion.button>
      </motion.div>
    </div>
  );
}
