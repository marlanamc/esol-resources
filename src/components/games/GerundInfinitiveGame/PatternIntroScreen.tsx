'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Play, BookOpen, ChevronRight, Trophy, AlertCircle, Check, Lightbulb, Sparkles } from 'lucide-react';
import { GI_REVIEW_GROUP_ID, GI_FINAL_GROUP_ID } from '@/data/gerund-infinitive-groups';
import type { GerundInfinitiveGroup, GIRoundMode, PatternExample } from '@/types/gerund-infinitive';

/** Split pattern text into scannable bullets (by sentence) */
function patternToBullets(pattern: string): string[] {
  return pattern
    .split(/(?<=[.!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

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

  // Gerund Verbs group
  if (group.id === 'group-2a') {
    return {
      title: 'What makes these "experience" verbs?',
      examples: 'enjoy, finish, avoid, consider, suggest, keep, quit, miss',
      note: 'These verbs focus on the activity happening NOW or in the past (not your future goal).',
    };
  }

  // Infinitive Verbs group
  if (group.id === 'group-2b') {
    return {
      title: 'What makes these "goal" verbs?',
      examples: 'want, hope, plan, decide, need, learn, offer, agree, refuse',
      note: 'These verbs express what you WANT or INTEND to do in the future.',
    };
  }

  // Noun + Infinitive group
  if (group.id === 'group-3b') {
    return {
      title: 'What is a noun?',
      examples: 'ability, chance, time, decision, opportunity, way, permission, reason',
      note: 'Nouns are people, places, things, or concepts. These nouns describe possibilities or potential actions.',
    };
  }

  // GO + Gerund group
  if (group.id === 'group-4') {
    return {
      title: 'What activities use GO + gerund?',
      examples: 'swimming, shopping, hiking, fishing, dancing, skiing, bowling, camping',
      note: 'Recreational activities and sports use this pattern (NOT "go to swim").',
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

  const ctaLabel = isFinal ? 'Start Final Challenge' : isReview ? 'Start Review' : isRound2 ? 'Start Round 2' : 'Start Challenge';
  const handleStartChallenge = () => {
    onStartChallenge();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 sm:pb-0">

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

        {/* Memory trick first - most memorable, scannable */}
        {group.memoryTrick && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="p-4 rounded-xl bg-accent/15 border-2 border-accent/40 shadow-sm"
          >
            <p className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-1">
              <Sparkles size={16} className="flex-shrink-0" />
              Quick rule
            </p>
            <p className="text-sm font-semibold text-text leading-tight">{group.memoryTrick}</p>
          </motion.div>
        )}

        {/* The Pattern - chunked bullets for readability */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="p-4 sm:p-5 bg-white dark:bg-[#162b3d] border border-border rounded-xl shadow-sm"
        >
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BookOpen size={14} />
            The pattern
          </p>
          <ul className="space-y-2">
            {patternToBullets(group.pattern).map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text leading-relaxed">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Vocabulary reminder */}
        {(() => {
          const reminder = getVocabReminder(group);
          if (!reminder) return null;
          const examples = reminder.examples.split(/,\s*/).slice(0, 8);
          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="p-4 rounded-xl bg-sky-50 dark:bg-sky-900/25 border border-sky-200 dark:border-sky-800"
            >
              <p className="text-sm font-bold text-sky-800 dark:text-sky-200 mb-2 flex items-center gap-1.5">
                <Lightbulb size={14} />
                {reminder.title}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {examples.map((ex, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-sky-200/60 dark:bg-sky-800/40 text-sky-800 dark:text-sky-200 text-xs font-medium"
                  >
                    {ex.trim()}
                  </span>
                ))}
              </div>
              {reminder.note && (
                <p className="text-xs text-sky-600 dark:text-sky-400 italic">{reminder.note}</p>
              )}
            </motion.div>
          );
        })()}

        {/* Memory tricks removed - relying on pattern exposure instead */}
      </motion.div>

      {/* Examples - card-style for better scanability */}
      {displayExamples.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h2 className="font-display text-lg text-text flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-secondary/25 flex items-center justify-center text-secondary text-sm font-bold">★</span>
            See it in action
          </h2>

          <div className="space-y-3">
            {displayExamples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#162b3d] border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-text text-sm sm:text-base leading-relaxed">
                    {ex.sentence.includes('___') ? (
                      <>
                        {ex.sentence.split('___')[0]}
                        <span className="font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded">
                          {ex.blank}
                        </span>
                        {ex.sentence.split('___')[1]}
                      </>
                    ) : (
                      ex.sentence
                    )}
                  </p>
                </div>
                <ChevronRight size={16} className="text-primary/50 flex-shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mixed Verbs Challenge - Show verb reference table */}
      {group.id === 'group-2c' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {/* Difficulty Warning */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-800/50">
            <p className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-2">⚡ Difficulty spike</p>
            <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-300 list-disc list-inside">
              <li>Combines Groups 5 & 6 — gerund vs infinitive mixed together</li>
              <li>You learned them separately; mixing is harder!</li>
              <li>Take your time and study the tables below</li>
            </ul>
          </div>

          <h2 className="font-display text-lg text-text flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            Know Your Verbs
          </h2>
          <p className="text-sm text-text-muted">These verbs look similar but follow different rules. Study them before the challenge!</p>

          <div className="grid grid-cols-2 gap-3">
            {/* Gerund verbs column */}
            <div className="rounded-xl border-2 border-secondary/30 overflow-hidden bg-secondary/5">
              <div className="bg-secondary/20 px-3 py-2 border-b border-secondary/20">
                <p className="font-bold text-secondary text-sm text-center">GERUND (-ing)</p>
                <p className="text-xs text-secondary/70 text-center">enjoy the moment</p>
              </div>
              <div className="p-3 space-y-2">
                {group.patterns
                  .filter(p => p.correctForm === 'gerund')
                  .map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center font-bold">✓</span>
                      <span className="text-text font-medium">{p.trigger}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Infinitive verbs column */}
            <div className="rounded-xl border-2 border-primary/30 overflow-hidden bg-primary/5">
              <div className="bg-primary/20 px-3 py-2 border-b border-primary/20">
                <p className="font-bold text-primary text-sm text-center">INFINITIVE (to + verb)</p>
                <p className="text-xs text-primary/70 text-center">look to the future</p>
              </div>
              <div className="p-3 space-y-2">
                {group.patterns
                  .filter(p => p.correctForm === 'infinitive')
                  .map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">✓</span>
                      <span className="text-text font-medium">{p.trigger}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-accent/10 border border-accent/30 rounded-xl">
            <p className="font-bold text-text text-sm mb-3">💡 Quick rule</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center">-ing</span>
                <div>
                  <p className="font-semibold text-secondary text-sm">Gerund</p>
                  <p className="text-xs text-text-muted">About the <em>experience</em> — enjoy, finish, avoid what you&apos;re doing</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">to</span>
                <div>
                  <p className="font-semibold text-primary text-sm">Infinitive</p>
                  <p className="text-xs text-text-muted">About the <em>goal</em> — want, hope, decide what TO do</p>
                </div>
              </div>
            </div>
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

      {/* Two-Round System Explanation (Round 1) */}
      {!isRound2 && !isReview && !isFinal && !group.isCheckpoint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50"
        >
          <p className="font-bold text-text mb-3 text-sm">📘 How it works</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">1</span>
              <div>
                <p className="font-semibold text-text text-sm">Round 1 · Learn</p>
                <p className="text-xs text-text-muted">Score <strong>80%+</strong> to pass → unlocks Round 2</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary/20 text-secondary text-sm font-bold flex items-center justify-center">2</span>
              <div>
                <p className="font-semibold text-text text-sm">Round 2 · Master</p>
                <p className="text-xs text-text-muted">Score <strong>90%+</strong> → earn ✦ mastery badge</p>
              </div>
            </div>
            <p className="text-xs text-text-muted italic pt-1">You can skip Round 2 or go for mastery!</p>
          </div>
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
          <p className="font-bold text-text text-sm mb-2">Round 2 · Mastery Check</p>
          <ul className="space-y-1 text-sm text-text-muted list-disc list-inside">
            <li>Exercises target your trickiest patterns from Round 1</li>
            <li>Score <strong className="text-text">90%+</strong> → earn the ✦ mastery badge</li>
          </ul>
        </motion.div>
      )}

      {/* CTA - desktop only (mobile uses fixed bar) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="hidden sm:flex flex-row gap-3 pt-2"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex-none px-6 py-3 rounded-xl border border-border text-text-muted hover:text-text hover:border-border-dark transition-colors font-semibold"
        >
          ← Back
        </button>
        <motion.button
          type="button"
          onClick={handleStartChallenge}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-10 flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors pointer-events-auto"
        >
          <Play size={18} />
          {ctaLabel}
        </motion.button>
      </motion.div>

      {/* Fixed bottom bar - mobile only: Back (left) | Start Challenge (right) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 px-4 py-3 bg-bg/95 backdrop-blur-md border-t border-border pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-text-muted hover:text-text hover:border-border-dark transition-colors font-semibold min-h-[48px]"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <motion.button
          type="button"
          onClick={handleStartChallenge}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-10 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors min-h-[48px] flex-1 pointer-events-auto"
        >
          <Play size={20} />
          {ctaLabel}
        </motion.button>
      </div>
    </div>
  );
}
