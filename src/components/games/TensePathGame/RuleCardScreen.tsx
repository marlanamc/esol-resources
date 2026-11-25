'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getWorld, type RuleCardPanel, type TensePathLevel } from '@/lib/tense-path/levels';
import { PASS_ACCURACY } from '@/lib/tense-path/progress';
import { ROUND_SIZE } from '@/lib/tense-path/questions';
import { StampTimeline } from './StampTimeline';
import { PRIMARY_BUTTON, SURFACE, WORLD_THEME } from './theme';

interface RuleCardScreenProps {
  level: TensePathLevel;
  mode: 'round1' | 'round2';
  onStart: () => void;
  onBack: () => void;
}

/** Bold the verb phrase inside the example sentence. */
export function ExampleSentence({ text, verb }: { text: string; verb: string }) {
  const idx = text.toLowerCase().indexOf(verb.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <b className="text-primary-text">{text.slice(idx, idx + verb.length)}</b>
      {text.slice(idx + verb.length)}
    </>
  );
}

export function RulePanel({ panel, compact = false }: { panel: RuleCardPanel; compact?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 rounded-3xl p-4 sm:p-5 ${SURFACE}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-lg font-bold text-text">{panel.label}</div>
        <div className="rounded-lg bg-bg-gray px-3 py-1 text-base font-bold text-primary-text dark:bg-white/10">
          {panel.form}
        </div>
      </div>
      <div className="rounded-2xl bg-[#fffdf8] p-1.5 dark:bg-white/5">
        <StampTimeline elements={panel.elements} />
      </div>
      <div className={compact ? 'text-lg' : 'text-xl'}>
        <ExampleSentence text={panel.example} verb={panel.verb} />
      </div>
      <div className="text-sm text-text-muted">{panel.note}</div>
      {!compact && panel.signals.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {panel.signals.map((s) => (
            <span key={s} className="rounded-full border border-border bg-white px-3 py-1 text-sm font-bold text-text dark:border-white/15 dark:bg-white/5">
              {s}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function RuleCardScreen({ level, mode, onStart, onBack }: RuleCardScreenProps) {
  const world = getWorld(level.world);
  const size = ROUND_SIZE[mode];
  const needed = Math.ceil((size * PASS_ACCURACY[mode]) / 100);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-5 px-4 pb-8 pt-4 sm:px-8 sm:pt-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to the map"
          className={`flex h-11 w-11 items-center justify-center rounded-full ${SURFACE} bg-white! dark:bg-[#162b3d]! border! text-text-muted hover:text-text`}
        >
          <ArrowLeft size={20} />
        </button>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${WORLD_THEME[level.world].badge}`}>
          World {world.number} · Level {level.number}
        </span>
        {mode === 'round2' ? (
          <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-bold text-[#5c4510]">Round 2 · Master</span>
        ) : null}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <h1 className="font-display text-4xl leading-tight text-text sm:text-5xl">{level.ruleCard.title}</h1>
        <p className="text-lg text-text-muted">{level.ruleCard.lead}</p>
      </motion.div>

      <div className={`grid gap-4 ${level.ruleCard.panels.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {level.ruleCard.panels.map((panel) => (
          <RulePanel key={panel.label} panel={panel} />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
        <span className="text-center text-sm text-text-muted sm:mr-auto sm:text-left">
          {size} questions · get {needed} right to {mode === 'round1' ? 'pass' : 'master'}
        </span>
        <button type="button" onClick={onStart} className={`${PRIMARY_BUTTON} h-14 px-10 text-lg`}>
          Start {mode === 'round1' ? 'Round 1' : 'Round 2'}
        </button>
      </div>
    </div>
  );
}
