'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Play, Sparkles, Lightbulb, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import type { POSGroup, POSPhase, POSRoundMode } from '@/types/parts-of-speech';
import { POS_COLORS, POS_LABELS, POS_ROUND_LABELS } from '@/types/parts-of-speech';
import { DiagramSentence } from './DiagramSentence';

function patternToBullets(pattern: string): string[] {
  return pattern
    .split(/(?<=[.!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function pickRotatingExampleCount(length: number, offset: number): number {
  if (length <= 0) return 0;
  return offset % length;
}

/** Human-readable phase name; must match tier label when phase === foundation (avoids "Foundation · Foundation"). */
const PHASE_DISPLAY: Record<POSPhase, string> = {
  foundation: 'Foundation',
  'sentence-roles': 'Sentence Roles',
  modifiers: 'Modifiers',
  connectors: 'Connectors',
  'application-bridge': 'Application Bridge',
};

interface PatternIntroScreenProps {
  group: POSGroup;
  roundMode: POSRoundMode;
  onStartChallenge: () => void;
  onBack: () => void;
}

export function PatternIntroScreen({
  group,
  roundMode,
  onStartChallenge,
  onBack,
}: PatternIntroScreenProps) {
  const roundNum = parseInt(roundMode.replace('round', '')) || 0;
  const isRound1 = roundMode === 'round1';
  const roundLabel = POS_ROUND_LABELS[roundMode];
  const ctaLabel = group.isCheckpoint
    ? 'Start Checkpoint'
    : roundLabel
    ? `Start ${roundLabel.name}`
    : 'Start Challenge';

  // Gather examples from patterns (one per pattern, max 5)
  const displayExamples = group.patterns
    .slice(0, 5)
    .map((p, index) => ({
      ...p.examples[pickRotatingExampleCount(p.examples.length, roundNum + index)],
      word: p.word,
      partOfSpeech: p.partOfSpeech,
    }));

  // Collect unique POS in this group for the color legend
  const groupPOS = [...new Set(group.patterns.map(p => p.partOfSpeech))];

  const tierLabel =
    group.difficulty === 1 ? 'Foundation' : group.difficulty === 2 ? 'Core' : 'Bridge';
  const phaseLabel = PHASE_DISPLAY[group.phase];
  const phaseTierBadge = tierLabel === phaseLabel ? tierLabel : `${tierLabel} · ${phaseLabel}`;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 sm:pb-0">

      {/* Badge row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{group.icon ?? '📚'}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {phaseTierBadge}
          </span>
        </div>
        {!isRound1 && roundLabel && (
          <span className="px-3 py-1 rounded-full bg-accent/20 text-primary-dark text-xs font-semibold">
            {roundLabel.name}
          </span>
        )}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="font-display text-3xl sm:text-4xl text-text leading-tight"
      >
        {group.title}
      </motion.h1>

      {/* Photo recall strip — shown for groups with visual gallery (nouns, verbs) */}
      {group.photoGallery && group.photoGallery.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="flex gap-3 overflow-x-auto pb-1"
        >
          {group.photoGallery.map(entry => (
            <div key={entry.word} className="flex-shrink-0 relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden border border-border shadow-sm">
              <Image
                src={entry.imageUrl}
                alt={entry.altText}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, 144px"
                unoptimized
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Solid bar. Inline color: theme `text-white` maps to dark navy in .dark; some builds also lose arbitrary text-[#…] to specificity. */}
              <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-neutral-950 px-2 py-2">
                <span
                  className="block min-w-0 truncate text-left text-xs font-bold leading-tight !text-[#f8fafc] sm:text-sm"
                  style={{ color: '#f8fafc' }}
                >
                  {entry.word}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Memory trick */}
      {group.memoryTrick && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          className="p-4 rounded-xl bg-accent/15 border-2 border-accent/40"
        >
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-1">
            <Sparkles size={16} className="flex-shrink-0" />
            Quick rule
          </p>
          <p className="text-sm font-semibold text-text leading-relaxed">{group.memoryTrick}</p>
        </motion.div>
      )}

      {/* Pattern */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className={`p-6 bg-gradient-to-br ${group.colorClass.replace(/bg-\w+-50/, 'from-transparent to-black/5 dark:to-white/5').replace('border-', 'border-2 border-')} border-dashed rounded-3xl shadow-sm relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-6xl">{group.icon}</span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-text uppercase tracking-wider mb-5 flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              The pattern
            </p>
            <div className="space-y-4">
              {patternToBullets(group.pattern).map((bullet, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/80 dark:bg-black/20 shadow-sm border border-black/5 dark:border-white/5 backdrop-blur-sm">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-[#ffffff] flex items-center justify-center font-bold shadow-sm">
                    {i + 1}
                  </div>
                  <p className="text-base text-text-strong font-medium leading-relaxed pt-0.5">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern example */}
        {group.patternExample && (
          <div className="p-5 sm:p-6 bg-white dark:bg-[#162b3d] border-2 border-border shadow-sm rounded-3xl">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
              Example Diagram
            </p>
            <DiagramSentence text={group.patternExample} colorClass={group.colorClass} />
          </div>
        )}
      </motion.div>

      {/* POS color legend */}
      {groupPOS.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex flex-wrap gap-2"
        >
          {groupPOS.map(pos => (
            <span
              key={pos}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${POS_COLORS[pos]}`}
            >
              {POS_LABELS[pos]}
            </span>
          ))}
        </motion.div>
      )}

      {/* Examples */}
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

          <div className="space-y-2">
            {displayExamples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#162b3d] border border-border shadow-sm"
              >
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-xs font-bold border mt-0.5 ${POS_COLORS[ex.partOfSpeech]}`}>
                  {POS_LABELS[ex.partOfSpeech]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-text text-sm leading-relaxed">
                    {ex.sentence?.includes('___') ? (
                      <>
                        {ex.sentence.split('___')[0]}
                        <span className="font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded">
                          {ex.blank ?? ex.highlightWord}
                        </span>
                        {ex.sentence.split('___')[1]}
                      </>
                    ) : (
                      <>
                        {ex.sentence?.split(ex.highlightWord).map((part, j, arr) => (
                          j < arr.length - 1 ? (
                            <span key={j}>
                              {part}
                              <span className="font-bold text-primary bg-primary/15 px-1 rounded">{ex.highlightWord}</span>
                            </span>
                          ) : part
                        ))}
                      </>
                    )}
                  </p>
                  {ex.context && (
                    <p className="text-xs text-text-muted mt-1 italic">{ex.context}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Common errors reminder */}
      {group.patterns.some(p => p.commonError) && !!isRound1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-error/5 border border-error/20"
        >
          <p className="text-sm font-bold text-error flex items-center gap-2 mb-2">
            <AlertCircle size={14} />
            Common mistakes
          </p>
          <ul className="space-y-1">
            {group.patterns.filter(p => p.commonError).slice(0, 2).map((p, i) => (
              <li key={i} className="text-xs text-error/80">{p.commonError}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Word families reminder */}
      {group.patterns.some(p => p.wordFamily?.length) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="p-4 rounded-xl bg-sky-50 dark:bg-sky-900/25 border border-sky-200 dark:border-sky-800"
        >
          <p className="text-sm font-bold text-sky-800 dark:text-sky-200 flex items-center gap-2 mb-2">
            <Lightbulb size={14} />
            Word families — same word, different job
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.patterns.flatMap(p =>
              (p.wordFamily ?? []).map(wf => (
                <span
                  key={`${p.id}-${wf.word}`}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium border ${POS_COLORS[wf.partOfSpeech]}`}
                >
                  {wf.word} ({POS_LABELS[wf.partOfSpeech].toLowerCase()})
                </span>
              ))
            ).slice(0, 8)}
          </div>
        </motion.div>
      )}

      {/* Round 1 only: show the full progression ladder */}
      {!!isRound1 && !group.isCheckpoint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50"
        >
          <p className="font-bold text-text text-sm mb-3">📘 How it works — {group.maxRounds} rounds to mastery</p>
          <div className="space-y-2">
            {[
              { n: 1, label: 'Notice',  desc: 'Name the parts of speech',         threshold: '70%' },
              { n: 2, label: 'Sort',    desc: 'Group and categorise words',        threshold: '75%' },
              { n: 3, label: 'Connect', desc: 'Spot them in real sentences',       threshold: '80%' },
              { n: 4, label: 'Build',   desc: 'Use them to build sentences',       threshold: '85%' },
              { n: 5, label: 'Master',  desc: 'Full fluency — earn the ✦ badge',  threshold: '90%' },
            ].filter(r => r.n <= group.maxRounds).map((r) => (
              <div key={r.n} className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center ${
                  r.n === group.maxRounds ? 'bg-accent/20 text-primary-dark' : 'bg-primary/15 text-primary'
                }`}>{r.n}</span>
                <div>
                  <p className="font-semibold text-text text-sm">Round {r.n} · {r.label}</p>
                  <p className="text-xs text-text-muted">{r.desc} · {r.threshold} to pass</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Round 2+ notice: where they are in the journey */}
      {!isRound1 && roundLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <p className="font-bold text-text text-sm mb-1">{roundLabel.name}</p>
          <p className="text-xs text-text-muted">
            {roundNum === group.maxRounds
              ? `Score 90%+ to earn the ✦ mastery badge. Exercises target your trickiest patterns.`
              : `Score ${[70,75,80,85,90][roundNum - 1] ?? 80}%+ to unlock Round ${roundNum + 1}. Keep building!`}
          </p>
        </motion.div>
      )}

      {/* Desktop CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden sm:flex gap-3 pt-2"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex-none px-6 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors font-semibold"
        >
          ← Back
        </button>
        <motion.button
          type="button"
          onClick={onStartChallenge}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-[#ffffff] font-semibold hover:bg-primary-dark transition-colors"
        >
          <Play size={18} />
          {ctaLabel}
        </motion.button>
      </motion.div>

      {/* Mobile fixed bottom bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 px-4 py-3 bg-bg/95 backdrop-blur-md border-t border-border pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors font-semibold min-h-[48px]"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <motion.button
          type="button"
          onClick={onStartChallenge}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-[#ffffff] font-semibold hover:bg-primary-dark transition-colors min-h-[48px] flex-1"
        >
          <Play size={20} />
          {ctaLabel}
        </motion.button>
      </div>
    </div>
  );
}
