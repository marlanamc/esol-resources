'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Flag, Lock, Play, Star, Target, Trophy } from 'lucide-react';
import {
  TENSE_PATH_FINAL_BONUS_POINTS,
  TENSE_PATH_FINAL_ID,
  TENSE_PATH_WORLDS,
  getLevel,
  getWorld,
  getWorldLevels,
  type TensePathLevel,
  type TensePathWorld,
  type TensePathWorldId,
} from '@/lib/tense-path/levels';
import {
  checkpointId,
  getLevelStage,
  getStep,
  getSummary,
  getUpNext,
  isCheckpointUnlocked,
  isFinalUnlocked,
  isWorldUnlocked,
  type TensePathProgress,
} from '@/lib/tense-path/progress';
import { QUESTION_TYPE_LABEL } from '@/lib/tense-path/questions';
import { StampTimeline } from './StampTimeline';
import { PRIMARY_BUTTON, SURFACE, WORLD_THEME } from './theme';

interface MapScreenProps {
  progress: TensePathProgress;
  /** Teachers see every level open, for class. */
  unlockAll: boolean;
  extraPracticeHref?: string;
  onBack: () => void;
  onPlayLevel: (levelId: string) => void;
  onPlayCheckpoint: (world: TensePathWorldId) => void;
  onPlayFinal: () => void;
}

const MIX_CHIPS = [
  QUESTION_TYPE_LABEL['timeline-to-verb'],
  QUESTION_TYPE_LABEL['sentence-to-timeline'],
  QUESTION_TYPE_LABEL['tense-comparison'],
  QUESTION_TYPE_LABEL['context-tense-picker'],
  QUESTION_TYPE_LABEL['sentence-transformer'],
  QUESTION_TYPE_LABEL['error-correction'],
];

export function MapScreen({
  progress,
  unlockAll,
  extraPracticeHref,
  onBack,
  onPlayLevel,
  onPlayCheckpoint,
  onPlayFinal,
}: MapScreenProps) {
  const summary = getSummary(progress);
  const upNext = getUpNext(progress);
  const worldOpen = (id: TensePathWorldId) => unlockAll || isWorldUnlocked(progress, id);

  const playUpNext = () => {
    if (upNext.kind === 'level') onPlayLevel(upNext.levelId);
    else if (upNext.kind === 'checkpoint') onPlayCheckpoint(upNext.world);
    else if (upNext.kind === 'final') onPlayFinal();
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-8 sm:pt-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className={`flex h-12 w-12 items-center justify-center rounded-full ${SURFACE} bg-white! dark:bg-[#162b3d]! border! text-text-muted hover:text-text`}
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex flex-wrap gap-2 text-sm font-bold">
          <span className={`flex items-center gap-2 rounded-full px-4 py-2 ${SURFACE}`}>
            <Check size={16} className="text-secondary-dark" aria-hidden="true" />
            {summary.passed} / {summary.totalLevels} passed
          </span>
          <span className={`flex items-center gap-2 rounded-full px-4 py-2 ${SURFACE}`}>
            <Star size={16} className="fill-accent text-accent-dark" aria-hidden="true" />
            {summary.mastered} mastered
          </span>
        </div>
      </div>

      {/* Hero + up next */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
        <div className="flex flex-col justify-center gap-4">
          <span className="self-start rounded-full bg-bg-gray px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-dark dark:bg-white/10 dark:text-primary-light">
            Tense Path
          </span>
          <h1 className="font-display text-5xl leading-none text-text sm:text-6xl">Timeline Tenses</h1>
          <p className="max-w-md text-lg text-text-muted">
            {TENSE_PATH_WORLDS.length} worlds. {summary.totalLevels} levels. Read it, stamp it, fix it.
          </p>
          <div className="mt-2 flex flex-wrap gap-6">
            <RoundBadge icon={<Target size={24} />} tone="bg-primary/15 text-primary-dark dark:text-primary-light" title="Round 1 · Learn" note="8 of 10 to pass" />
            <RoundBadge icon={<Trophy size={24} />} tone="bg-accent/30 text-[#5c4510] dark:text-accent-light" title="Round 2 · Master" note="9 of 10 to master" />
          </div>
        </div>

        <UpNextCard upNext={upNext} onPlay={playUpNext} />
      </div>

      <WorldTrail progress={progress} unlockAll={unlockAll} />

      {TENSE_PATH_WORLDS.map((world) => (
        <WorldSection
          key={world.id}
          world={world}
          progress={progress}
          open={worldOpen(world.id)}
          checkpointOpen={unlockAll || isCheckpointUnlocked(progress, world.id)}
          onPlayLevel={onPlayLevel}
          onPlayCheckpoint={() => onPlayCheckpoint(world.id)}
        />
      ))}

      <FinalCard
        open={unlockAll || isFinalUnlocked(progress)}
        passed={getStep(progress, TENSE_PATH_FINAL_ID).passed}
        badge={progress.badges.tenseMaster === true}
        onPlay={onPlayFinal}
      />

      {extraPracticeHref ? (
        <p className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-1 text-base text-text-muted">
          <span>Extra practice:</span>
          <Link href={extraPracticeHref} className="font-bold text-primary-dark underline-offset-4 hover:underline dark:text-primary-light">
            Timeline Tenses (free practice)
          </Link>
        </p>
      ) : null}
    </div>
  );
}

function UpNextCard({ upNext: next, onPlay }: { upNext: ReturnType<typeof getUpNext>; onPlay: () => void }) {
  if (next.kind === 'done') {
    return (
      <div className="flex flex-col justify-center gap-3 rounded-[28px] bg-accent/30 p-7 text-[#3d2f08] dark:text-accent-light">
        <Trophy size={40} aria-hidden="true" />
        <div className="font-display text-3xl">Every level mastered!</div>
        <p>Play any level again to keep the tenses fresh.</p>
      </div>
    );
  }
  const level = next.kind === 'level' ? getLevel(next.levelId) : undefined;
  const world = level ? getWorld(level.world) : next.kind === 'checkpoint' ? getWorld(next.world) : undefined;
  const title = level?.title ?? (next.kind === 'checkpoint' && world ? `Checkpoint ${world.number}` : 'Final Challenge');
  const kicker = level
    ? `Up next · World ${world?.number} · Level ${level.number}`
    : next.kind === 'checkpoint'
      ? `Up next · World ${world?.number}`
      : 'Up next · All worlds';
  const roundTag =
    next.kind === 'level' ? (next.mode === 'round1' ? 'Round 1 · Learn' : 'Round 2 · Master') : next.kind === 'checkpoint' ? 'Checkpoint' : 'Tense Master';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 rounded-[28px] bg-primary p-6 text-white shadow-[0_18px_36px_-22px_rgba(26,32,44,0.55)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-widest">{kicker}</span>
        <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-bold text-[#5c4510]">{roundTag}</span>
      </div>
      <div className="font-display text-4xl leading-tight">{title}</div>
      {level ? (
        <>
          <div className="rounded-2xl bg-white p-2">
            <StampTimeline elements={level.preview} />
          </div>
          <div className="text-lg">{level.example}</div>
        </>
      ) : (
        <p className="text-lg text-white/95">
          {next.kind === 'checkpoint' ? 'All the levels in this world, mixed together. No rule cards.' : '20 questions from every world. No rule cards.'}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5 text-xs font-bold">
        {MIX_CHIPS.slice(0, 5).map((chip) => (
          <span key={chip} className="rounded-full bg-white/20 px-3 py-1">
            {chip}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onPlay}
        className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-white! text-xl font-bold text-primary-dark! transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <Play size={22} className="fill-current" aria-hidden="true" />
        Play
      </button>
    </motion.div>
  );
}


function RoundBadge({ icon, tone, title, note }: { icon: ReactNode; tone: string; title: string; note: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`} aria-hidden="true">
        {icon}
      </div>
      <div>
        <div className="font-display text-xl text-text">{title}</div>
        <div className="text-sm text-text-muted">{note}</div>
      </div>
    </div>
  );
}

function WorldTrail({ progress, unlockAll }: { progress: TensePathProgress; unlockAll: boolean }) {
  const doneCount = TENSE_PATH_WORLDS.filter((w) => getStep(progress, checkpointId(w.id)).passed).length;
  const currentIdx = TENSE_PATH_WORLDS.findIndex((w) => !getStep(progress, checkpointId(w.id)).passed);
  const fill = Math.min(doneCount, TENSE_PATH_WORLDS.length - 1) / (TENSE_PATH_WORLDS.length - 1);

  return (
    <div className={`mt-10 rounded-3xl px-4 py-5 sm:px-8 ${SURFACE}`}>
      <ol className="relative grid grid-cols-5" aria-label="Worlds">
        <div className="absolute left-[10%] right-[10%] top-6 h-1.5 rounded-full bg-bg-gray dark:bg-white/10" aria-hidden="true" />
        <div
          className="absolute left-[10%] top-6 h-1.5 rounded-full bg-secondary-dark"
          style={{ width: `${fill * 80}%` }}
          aria-hidden="true"
        />
        {TENSE_PATH_WORLDS.map((w, i) => {
          const done = getStep(progress, checkpointId(w.id)).passed;
          const current = i === currentIdx;
          const open = unlockAll || isWorldUnlocked(progress, w.id);
          return (
            <li key={w.id} className="relative flex flex-col items-center gap-2 text-center">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                  done
                    ? 'bg-secondary-dark text-white'
                    : current && open
                      ? 'border-4 border-primary bg-white text-primary-dark dark:bg-[#162b3d] dark:text-primary-light'
                      : 'bg-bg-gray text-text-muted dark:bg-white/10'
                }`}
              >
                {done ? <Check size={22} strokeWidth={3} aria-label="Done" /> : w.number}
              </span>
              <span className={`text-xs font-bold sm:text-sm ${current ? 'text-primary-dark dark:text-primary-light' : 'text-text-muted'}`}>
                {w.title.replace(/^The /, '')}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function WorldSection({
  world,
  progress,
  open,
  checkpointOpen,
  onPlayLevel,
  onPlayCheckpoint,
}: {
  world: TensePathWorld;
  progress: TensePathProgress;
  open: boolean;
  checkpointOpen: boolean;
  onPlayLevel: (levelId: string) => void;
  onPlayCheckpoint: () => void;
}) {
  const theme = WORLD_THEME[world.id];
  const levels = getWorldLevels(world.id);
  const cp = getStep(progress, checkpointId(world.id));
  const passedCount = levels.filter((l) => getStep(progress, l.id).passed).length + (cp.passed ? 1 : 0);
  const prevWorld = TENSE_PATH_WORLDS[world.number - 2];

  return (
    <section className="mt-12" aria-labelledby={`world-${world.id}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${theme.badge}`}>
            World {world.number}
          </span>
          <h2 id={`world-${world.id}`} className="mt-2 font-display text-3xl text-text">
            {world.title}
          </h2>
          <p className="text-base text-text-muted">
            {open ? world.description : `Pass Checkpoint ${prevWorld?.number} to open this world.`}
          </p>
        </div>
        <span className={`text-lg font-bold ${theme.ring}`}>
          {passedCount}/{levels.length + 1}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map((level) => (
          <LevelTile key={level.id} level={level} progress={progress} open={open} onPlay={() => onPlayLevel(level.id)} />
        ))}
        <CheckpointTile world={world} passed={cp.passed} open={checkpointOpen} onPlay={onPlayCheckpoint} levelCount={levels.length} />
      </div>
    </section>
  );
}

function LevelTile({ level, progress, open, onPlay }: { level: TensePathLevel; progress: TensePathProgress; open: boolean; onPlay: () => void }) {
  const theme = WORLD_THEME[level.world];
  const stage = getLevelStage(progress, level.id);
  const isUpNext = (() => {
    const next = getUpNext(progress);
    return next.kind === 'level' && next.levelId === level.id;
  })();

  const status =
    stage === 'mastered'
      ? { text: 'Mastered', cls: 'bg-accent-light text-[#5c4510]' }
      : stage === 'passed'
        ? { text: 'Play Round 2', cls: 'bg-primary text-white' }
        : open
          ? { text: isUpNext ? 'Play' : 'New', cls: isUpNext ? 'bg-primary text-white' : 'bg-bg-gray text-text-muted dark:bg-white/10' }
          : { text: 'Locked', cls: 'bg-bg-gray text-text-muted dark:bg-white/10' };
  const stripe = stage === 'mastered' ? 'bg-accent' : stage === 'passed' ? 'bg-[linear-gradient(90deg,var(--color-secondary-dark)_50%,var(--color-bg-gray)_50%)]' : 'bg-bg-gray dark:bg-white/10';

  return (
    <button
      type="button"
      onClick={onPlay}
      disabled={!open}
      aria-label={`Level ${level.number}: ${level.title}. ${status.text}.`}
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-3xl border-2! px-4 pt-4 text-left transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed ${
        open ? 'bg-[#fffdf8]! dark:bg-[#162b3d]!' : 'bg-bg-light! dark:bg-white/5!'
      } ${isUpNext ? 'border-primary! ring-4 ring-primary/15' : 'border-[#f0dfb4]! dark:border-white/10!'}`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-bold ${theme.number}`}>
          {open ? level.number : <Lock size={16} aria-hidden="true" />}
        </span>
        <span className="flex-1 font-display text-xl leading-tight text-text">{level.title}</span>
        {stage === 'mastered' ? <Star size={22} className="fill-accent text-accent-dark" aria-hidden="true" /> : null}
      </div>
      <div className="text-sm text-text-muted">{level.example}</div>
      <div className={`rounded-2xl border border-border/70 bg-white p-1.5 dark:border-white/10 ${open ? '' : 'opacity-55'}`}>
        <StampTimeline elements={level.preview} showLabels={false} />
      </div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="flex items-center gap-1">
          2 rounds
          <span className={`ml-1 h-2.5 w-2.5 rounded-full ${stage !== 'not-started' ? 'bg-secondary-dark' : 'bg-bg-gray dark:bg-white/20'}`} />
          <span className={`h-2.5 w-2.5 rounded-full ${stage === 'mastered' ? 'bg-secondary-dark' : 'bg-bg-gray dark:bg-white/20'}`} />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.cls}`}>{status.text}</span>
      </div>
      <div className={`-mx-4 h-2 ${stripe}`} aria-hidden="true" />
    </button>
  );
}

function CheckpointTile({
  world,
  passed,
  open,
  onPlay,
  levelCount,
}: {
  world: TensePathWorld;
  passed: boolean;
  open: boolean;
  onPlay: () => void;
  levelCount: number;
}) {
  const theme = WORLD_THEME[world.id];
  return (
    <button
      type="button"
      onClick={onPlay}
      disabled={!open}
      aria-label={`Checkpoint ${world.number}. ${passed ? 'Passed' : open ? 'Open' : 'Locked'}.`}
      className={`flex flex-col gap-3 overflow-hidden rounded-3xl border-2! border-dashed! px-4 pt-4 text-left transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed ${theme.dashed} ${
        open ? 'bg-[#fffdf8]! dark:bg-[#162b3d]!' : 'bg-bg-light! dark:bg-white/5!'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${open || passed ? theme.solid : 'bg-bg-gray text-text-muted dark:bg-white/10'}`}>
          <Flag size={18} aria-hidden="true" />
        </span>
        <span className="font-display text-xl text-text">Checkpoint {world.number}</span>
      </div>
      <div className="text-sm text-text-muted">
        {world.number === 1 ? 'World 1, mixed.' : `World ${world.number} mixed, plus a few old tenses.`} No rule cards.
      </div>
      <div
        className={`flex flex-1 items-center justify-center gap-2 rounded-2xl p-4 text-sm font-bold ${
          passed ? theme.badge : open ? 'bg-primary/10 text-primary-dark dark:text-primary-light' : 'border-2 border-dashed border-border text-text-muted dark:border-white/15'
        }`}
      >
        {passed ? (
          world.number < TENSE_PATH_WORLDS.length ? `World ${world.number + 1} unlocked` : 'Final unlocked'
        ) : open ? (
          'Ready! 12 questions'
        ) : (
          <>
            <Lock size={16} aria-hidden="true" /> Pass all {levelCount} levels
          </>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>1 round · 80% to pass</span>
        <span className={`rounded-full px-2.5 py-1 font-bold ${passed ? 'bg-secondary/20 text-secondary-dark' : 'bg-bg-gray dark:bg-white/10'}`}>
          {passed ? 'Passed' : open ? 'Open' : 'Locked'}
        </span>
      </div>
      <div className={`-mx-4 h-2 ${passed ? 'bg-secondary-dark' : 'bg-bg-gray dark:bg-white/10'}`} aria-hidden="true" />
    </button>
  );
}

function FinalCard({ open, passed, badge, onPlay }: { open: boolean; passed: boolean; badge: boolean; onPlay: () => void }) {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-6 rounded-[28px] border-2 border-accent-dark bg-accent-light p-6 text-[#3d2f08] sm:p-8 dark:bg-accent/20 dark:text-accent-light">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[#8a6a12] dark:bg-[#162b3d] dark:text-accent">
        <Trophy size={44} aria-hidden="true" />
      </div>
      <div className="min-w-[240px] flex-1">
        <div className="text-xs font-bold uppercase tracking-widest">Final Challenge</div>
        <div className="font-display text-3xl font-bold">Tense Master</div>
        <p className="text-base">
          20 questions · all 5 worlds · no rule cards. Win the Tense Master badge + {TENSE_PATH_FINAL_BONUS_POINTS} bonus points.
        </p>
      </div>
      {open ? (
        <button type="button" onClick={onPlay} className={`${PRIMARY_BUTTON} h-14 px-8 text-lg`}>
          {badge || passed ? 'Play again' : 'Start the final'}
        </button>
      ) : (
        <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold dark:bg-[#162b3d]">
          <Lock size={18} aria-hidden="true" /> Pass all 5 checkpoints
        </span>
      )}
    </div>
  );
}
