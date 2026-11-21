'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { PASS_ACCURACY } from '@/lib/pattern-path/engine';
import { getSoundWorld, type SoundPathLevel, type SoundRulePanel } from '@/lib/sound-path/levels';
import { ROUND_SIZE } from '@/lib/sound-path/questions';
import { SURFACE, TONE, VIOLET_BUTTON, WORLD_BADGE } from './theme';

export function SoundRulePanelCard({
  panel,
  onPlayWord,
  compact = false,
}: {
  panel: SoundRulePanel;
  onPlayWord: (word: string) => void;
  compact?: boolean;
}) {
  const tone = TONE[panel.tone];
  return (
    <div className={`flex flex-col gap-3 rounded-3xl p-4 sm:p-5 ${tone.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`text-lg font-black ${tone.text}`}>{panel.label}</div>
        <div className={`shrink-0 text-2xl font-black ${tone.text}`}>{panel.symbol}</div>
      </div>
      <div className="flex flex-col gap-1">
        {panel.lines.map((line, i) => (
          <div key={line} className={i === 0 ? `font-bold text-text ${compact ? 'text-lg' : 'text-xl'}` : 'text-base text-text-muted'}>
            {line}
          </div>
        ))}
      </div>
      {panel.words.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {panel.words.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => onPlayWord(word)}
              aria-label={`Listen to ${word}`}
              className="flex h-11 items-center gap-2 rounded-xl border! border-border! bg-white! px-3 text-base font-bold text-text! hover:border-violet-400! dark:border-white/15! dark:bg-white/5!"
            >
              <Volume2 size={16} className={tone.text} aria-hidden="true" />
              {word}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface RuleCardScreenProps {
  level: SoundPathLevel;
  mode: 'round1' | 'round2';
  onStart: () => void;
  onBack: () => void;
  onPlayWord: (word: string) => void;
}

export function RuleCardScreen({ level, mode, onStart, onBack, onPlayWord }: RuleCardScreenProps) {
  const world = getSoundWorld(level.world);
  const size = ROUND_SIZE[mode];
  const needed = Math.ceil((size * PASS_ACCURACY[mode]) / 100);
  const cols = level.ruleCard.panels.length === 3 ? 'md:grid-cols-3' : level.ruleCard.panels.length === 2 ? 'md:grid-cols-2' : '';

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-5 px-4 pb-8 pt-4 sm:px-8 sm:pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to the map"
          className={`flex h-11 w-11 items-center justify-center rounded-full ${SURFACE} bg-white! dark:bg-[#162b3d]! border! text-text-muted hover:text-text`}
        >
          <ArrowLeft size={20} />
        </button>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${WORLD_BADGE[level.world]}`}>
          World {world.number} · Level {level.number}
        </span>
        {mode === 'round2' ? <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-bold text-[#5c4510]">Round 2 · Master</span> : null}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <h1 className="text-4xl font-black leading-tight text-text sm:text-5xl">{level.ruleCard.title}</h1>
        <p className="text-lg text-text-muted">{level.ruleCard.lead}</p>
      </motion.div>

      <div className={`grid gap-4 ${cols}`}>
        {level.ruleCard.panels.map((panel) => (
          <SoundRulePanelCard key={panel.label} panel={panel} onPlayWord={onPlayWord} />
        ))}
      </div>
      <p className="text-center text-sm text-text-muted">Tap a word to hear it.</p>

      <div className="mt-auto flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
        <span className="text-center text-sm text-text-muted sm:mr-auto sm:text-left">
          {size} words · get {needed} right to {mode === 'round1' ? 'pass' : 'master'}
        </span>
        <button type="button" onClick={onStart} className={`${VIOLET_BUTTON} h-14 px-10 text-lg`}>
          Start {mode === 'round1' ? 'Round 1' : 'Round 2'}
        </button>
      </div>
    </div>
  );
}
