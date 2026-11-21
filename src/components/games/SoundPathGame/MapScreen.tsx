'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Flag, Lock, Play, Star, Trophy, Volume2 } from 'lucide-react';
import { checkpointId, getLevelStage, getStep, type PathProgress } from '@/lib/pattern-path/engine';
import {
  SOUND_PATH_FINAL_BONUS_POINTS,
  SOUND_PATH_FINAL_ID,
  SOUND_PATH_WORLDS,
  getSoundLevel,
  getSoundWorld,
  getSoundWorldLevels,
  type SoundPathLevel,
  type SoundPathWorld,
  type SoundPathWorldId,
} from '@/lib/sound-path/levels';
import {
  getSummary,
  getUpNext,
  isCheckpointUnlocked,
  isFinalUnlocked,
  isWorldUnlocked,
  SOUND_MASTER_BADGE,
  type SoundUpNext,
} from '@/lib/sound-path/progress';
import { QUESTION_TYPE_LABEL } from '@/lib/sound-path/questions';
import { HEADER_GRADIENT, SURFACE, TONE, VIOLET_BUTTON, WORLD_BADGE } from './theme';

interface MapScreenProps {
  progress: PathProgress;
  unlockAll: boolean;
  extraPracticeHref?: string;
  onBack: () => void;
  onPlayLevel: (levelId: string) => void;
  onPlayCheckpoint: (world: SoundPathWorldId) => void;
  onPlayFinal: () => void;
}

export function MapScreen({ progress, unlockAll, extraPracticeHref, onBack, onPlayLevel, onPlayCheckpoint, onPlayFinal }: MapScreenProps) {
  const summary = getSummary(progress);
  const upNext = getUpNext(progress);

  const playUpNext = () => {
    if (upNext.kind === 'level') onPlayLevel(upNext.levelId);
    else if (upNext.kind === 'checkpoint') onPlayCheckpoint(upNext.world);
    else if (upNext.kind === 'final') onPlayFinal();
  };

  return (
    <div className="pb-16">
      {/* Header, like the -ed Sounds game */}
      <header className={`${HEADER_GRADIENT} rounded-b-[40px] px-4 pb-24 pt-5 text-white sm:px-8`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20! text-white! hover:bg-white/30!"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <Check size={16} aria-hidden="true" />
                {summary.passed} / {summary.totalLevels} passed
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <Star size={16} className="fill-white" aria-hidden="true" />
                {summary.mastered} mastered
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Volume2 size={56} aria-hidden="true" />
            <div className="text-sm font-bold uppercase tracking-[0.2em]">Sound Path</div>
            <h1 className="font-display text-5xl font-bold leading-none text-white! sm:text-6xl">-ed Sounds</h1>
            <p className="text-lg font-medium text-white">Hear it. Clap it. Say it.</p>
          </div>
        </div>
      </header>

      <div className="mx-auto -mt-14 w-full max-w-6xl px-4 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <TeamsCard />
          <UpNextCard upNext={upNext} onPlay={playUpNext} />
        </div>

        {SOUND_PATH_WORLDS.map((world) => (
          <WorldSection
            key={world.id}
            world={world}
            progress={progress}
            open={unlockAll || isWorldUnlocked(progress, world.id)}
            checkpointOpen={unlockAll || isCheckpointUnlocked(progress, world.id)}
            upNext={upNext}
            onPlayLevel={onPlayLevel}
            onPlayCheckpoint={() => onPlayCheckpoint(world.id)}
          />
        ))}

        <FinalCard
          open={unlockAll || isFinalUnlocked(progress)}
          done={getStep(progress, SOUND_PATH_FINAL_ID).passed || progress.badges[SOUND_MASTER_BADGE] === true}
          onPlay={onPlayFinal}
        />

        {extraPracticeHref ? (
          <p className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-1 text-base text-text-muted">
            <span>Extra practice:</span>
            <Link href={extraPracticeHref} className="font-bold text-violet-700 underline-offset-4 hover:underline dark:text-violet-300">
              -ed Sounds (Clap Count, Sorting, Minimal Pairs)
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function TeamsCard() {
  const teams = [
    { tone: 't' as const, symbol: '/t/', example: 'walked · 1 clap' },
    { tone: 'd' as const, symbol: '/d/', example: 'played · 1 clap' },
    { tone: 'id' as const, symbol: '/id/', example: 'wanted · 2 claps' },
  ];
  return (
    <div className={`flex flex-col gap-4 rounded-3xl p-5 shadow-[0_14px_30px_-20px_rgba(26,32,44,0.45)] ${SURFACE}`}>
      <div className="text-xs font-bold uppercase tracking-widest text-text-muted">The three teams</div>
      <div className="grid grid-cols-3 gap-3">
        {teams.map((t) => (
          <div key={t.symbol} className={`rounded-2xl px-2 py-4 text-center ${TONE[t.tone].card}`}>
            <div className={`text-3xl font-black ${TONE[t.tone].text}`}>{t.symbol}</div>
            <div className={`text-xs font-bold ${TONE[t.tone].text}`}>{t.example}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-text-muted">
        <span>
          <b className="text-text">Round 1</b> Learn · 8 of 10
        </span>
        <span>
          <b className="text-text">Round 2</b> Master · 9 of 10
        </span>
      </div>
    </div>
  );
}

function UpNextCard({ upNext, onPlay }: { upNext: SoundUpNext; onPlay: () => void }) {
  if (upNext.kind === 'done') {
    return (
      <div className="flex flex-col justify-center gap-2 rounded-3xl bg-violet-100 p-6 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100">
        <Trophy size={36} aria-hidden="true" />
        <div className="font-display text-3xl">Every level mastered!</div>
        <p>Play any level again to keep your ears sharp.</p>
      </div>
    );
  }
  const level = upNext.kind === 'level' ? getSoundLevel(upNext.levelId) : undefined;
  const world = level ? getSoundWorld(level.world) : upNext.kind === 'checkpoint' ? getSoundWorld(upNext.world) : undefined;
  const title = level?.title ?? (upNext.kind === 'checkpoint' && world ? `Checkpoint ${world.number}` : 'Final Challenge');
  const kicker = level ? `Up next · World ${world?.number} · Level ${level.number}` : upNext.kind === 'checkpoint' ? `Up next · World ${world?.number}` : 'Up next · All worlds';
  const tag = upNext.kind === 'level' ? (upNext.mode === 'round1' ? 'Round 1 · Learn' : 'Round 2 · Master') : upNext.kind === 'checkpoint' ? 'Checkpoint' : 'Sound Master';
  const chips = level ? [...new Set(level.mix.map((m) => QUESTION_TYPE_LABEL[m.type]))] : ['Clap Count', 'Which Team?', 'Odd One Out', 'In a Sentence'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white shadow-[0_14px_30px_-20px_rgba(26,32,44,0.55)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-widest">{kicker}</span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">{tag}</span>
      </div>
      <div className="text-4xl font-black">{title}</div>
      <div className="text-lg">{level ? level.example : upNext.kind === 'checkpoint' ? 'All the levels in this world, mixed. No rule cards.' : '20 words from every world. No rule cards.'}</div>
      <div className="flex flex-wrap gap-1.5 text-xs font-bold">
        {chips.map((c) => (
          <span key={c} className="rounded-full bg-white/20 px-3 py-1">
            {c}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onPlay}
        className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-white! text-xl font-black text-violet-700! transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <Play size={22} className="fill-current" aria-hidden="true" />
        Play
      </button>
    </motion.div>
  );
}

function WorldSection({
  world,
  progress,
  open,
  checkpointOpen,
  upNext,
  onPlayLevel,
  onPlayCheckpoint,
}: {
  world: SoundPathWorld;
  progress: PathProgress;
  open: boolean;
  checkpointOpen: boolean;
  upNext: SoundUpNext;
  onPlayLevel: (levelId: string) => void;
  onPlayCheckpoint: () => void;
}) {
  const levels = getSoundWorldLevels(world.id);
  const cpPassed = getStep(progress, checkpointId(world.id)).passed;
  const passedCount = levels.filter((l) => getStep(progress, l.id).passed).length + (cpPassed ? 1 : 0);

  return (
    <section className="mt-12" aria-labelledby={`world-${world.id}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${WORLD_BADGE[world.id]}`}>World {world.number}</span>
          <h2 id={`world-${world.id}`} className="mt-2 text-3xl font-black text-text">
            {world.title}
          </h2>
          <p className="text-base text-text-muted">{open ? world.description : `Pass Checkpoint ${world.number - 1} to open this world.`}</p>
        </div>
        <span className="text-lg font-black text-violet-700 dark:text-violet-300">
          {passedCount}/{levels.length + 1}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((level) => (
          <LevelTile
            key={level.id}
            level={level}
            progress={progress}
            open={open}
            isUpNext={upNext.kind === 'level' && upNext.levelId === level.id}
            onPlay={() => onPlayLevel(level.id)}
          />
        ))}
        <button
          type="button"
          onClick={onPlayCheckpoint}
          disabled={!checkpointOpen}
          aria-label={`Checkpoint ${world.number}. ${cpPassed ? 'Passed' : checkpointOpen ? 'Open' : 'Locked'}.`}
          className={`flex flex-col gap-3 overflow-hidden rounded-3xl border-2! border-dashed! border-violet-300! px-4 pt-4 text-left transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed dark:border-violet-700! ${
            checkpointOpen ? 'bg-white! dark:bg-[#162b3d]!' : 'bg-[#faf8ff]! dark:bg-white/5!'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${checkpointOpen || cpPassed ? 'bg-violet-600 text-white' : 'bg-bg-gray text-text-muted dark:bg-white/10'}`}>
              <Flag size={18} aria-hidden="true" />
            </span>
            <span className="text-xl font-black text-text">Checkpoint {world.number}</span>
          </div>
          <div className="text-sm text-text-muted">{world.number === 1 ? 'World 1, mixed.' : `World ${world.number} mixed, plus some earlier sounds.`} No rule cards.</div>
          <div
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl p-4 text-sm font-bold ${
              cpPassed ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200' : checkpointOpen ? 'bg-violet-50 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200' : 'border-2 border-dashed border-border text-text-muted dark:border-white/15'
            }`}
          >
            {cpPassed ? (world.number < SOUND_PATH_WORLDS.length ? `World ${world.number + 1} unlocked` : 'Final unlocked') : checkpointOpen ? 'Ready! 12 words' : (<><Lock size={16} aria-hidden="true" /> Pass all {levels.length} levels</>)}
          </div>
          <div className="flex items-center justify-between pb-3 text-xs text-text-muted">
            <span>1 round · 80% to pass</span>
            <span className="rounded-full bg-bg-gray px-2.5 py-1 font-bold dark:bg-white/10">{cpPassed ? 'Passed' : checkpointOpen ? 'Open' : 'Locked'}</span>
          </div>
        </button>
      </div>
    </section>
  );
}

function LevelVisual({ level }: { level: SoundPathLevel }) {
  const chip = (tone: 't' | 'd' | 'id', text: string) => (
    <span key={text} className={`rounded-xl px-2.5 py-1 text-lg font-black ${TONE[tone].chip}`}>
      {text}
    </span>
  );
  switch (level.id) {
    case 'extra-clap':
      return (
        <span className="flex items-center gap-2 text-xl font-black text-text">
          want·ed
          <span className="h-4 w-4 rounded-full bg-violet-600" />
          <span className="h-4 w-4 rounded-full bg-violet-600" />
        </span>
      );
    case 'now-or-past':
      return (
        <span className="flex items-center gap-2 text-xl font-black text-text">
          <Volume2 size={20} className="text-violet-700 dark:text-violet-300" aria-hidden="true" /> play <span className="text-sm text-text-muted">or</span> played?
        </span>
      );
    case 'whisper-or-not':
      return <span className="flex items-center gap-2">{chip('t', '/t/')}<span className="text-sm font-bold text-text-muted">or</span>{chip('d', '/d/')}</span>;
    case 'three-teams':
      return <span className="flex items-center gap-2">{chip('t', '/t/')}{chip('d', '/d/')}{chip('id', '/id/')}</span>;
    case 'in-sentences':
      return (
        <span className="text-base font-bold text-text">
          I <u className="decoration-violet-500 decoration-2 underline-offset-4">needed</u> help yesterday.
        </span>
      );
    default:
      return <span className="text-base font-bold text-text">laughed · fixed · used</span>;
  }
}

function LevelTile({ level, progress, open, isUpNext, onPlay }: { level: SoundPathLevel; progress: PathProgress; open: boolean; isUpNext: boolean; onPlay: () => void }) {
  const stage = getLevelStage(progress, level.id);
  const status =
    stage === 'mastered'
      ? { text: 'Mastered', cls: 'bg-accent-light text-[#5c4510]' }
      : stage === 'passed'
        ? { text: 'Play Round 2', cls: 'bg-violet-600 text-white' }
        : !open
          ? { text: 'Locked', cls: 'bg-bg-gray text-text-muted dark:bg-white/10' }
          : isUpNext
            ? { text: 'Play', cls: 'bg-violet-600 text-white' }
            : { text: 'New', cls: 'bg-bg-gray text-text-muted dark:bg-white/10' };

  return (
    <button
      type="button"
      onClick={onPlay}
      disabled={!open}
      aria-label={`Level ${level.number}: ${level.title}. ${status.text}.`}
      className={`flex flex-col gap-3 overflow-hidden rounded-3xl border-2! px-4 pt-4 text-left transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed ${
        open ? 'bg-white! dark:bg-[#162b3d]!' : 'bg-[#faf8ff]! dark:bg-white/5!'
      } ${isUpNext ? 'border-violet-600! ring-4 ring-violet-200 dark:ring-violet-900' : 'border-violet-100! dark:border-white/10!'}`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-black ${WORLD_BADGE[level.world]}`}>
          {open ? level.number : <Lock size={16} aria-hidden="true" />}
        </span>
        <span className="flex-1 text-xl font-black leading-tight text-text">{level.title}</span>
        {stage === 'mastered' ? <Star size={22} className="fill-accent text-accent-dark" aria-hidden="true" /> : null}
      </div>
      <div className={`flex min-h-16 items-center justify-center rounded-2xl bg-[#faf8ff] p-3 dark:bg-white/5 ${open ? '' : 'opacity-55'}`}>
        <LevelVisual level={level} />
      </div>
      <div className="text-sm text-text-muted">{level.example}</div>
      <div className="flex items-center justify-between pb-3 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          2 rounds
          <span className={`ml-1 h-2.5 w-2.5 rounded-full ${stage !== 'not-started' ? 'bg-violet-600' : 'bg-bg-gray dark:bg-white/20'}`} />
          <span className={`h-2.5 w-2.5 rounded-full ${stage === 'mastered' ? 'bg-violet-600' : 'bg-bg-gray dark:bg-white/20'}`} />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.cls}`}>{status.text}</span>
      </div>
    </button>
  );
}

function FinalCard({ open, done, onPlay }: { open: boolean; done: boolean; onPlay: () => void }) {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-6 rounded-[28px] bg-gradient-to-br from-violet-900 to-fuchsia-900 p-6 text-white sm:p-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-light text-[#5c4510]">
        <Trophy size={44} aria-hidden="true" />
      </div>
      <div className="min-w-[240px] flex-1">
        <div className="text-xs font-bold uppercase tracking-widest">Final Challenge</div>
        <div className="font-display text-3xl font-bold">Sound Master</div>
        <p className="text-base">20 words · every team · no rule cards. Win the Sound Master badge + {SOUND_PATH_FINAL_BONUS_POINTS} bonus points.</p>
      </div>
      {open ? (
        <button type="button" onClick={onPlay} className={`${VIOLET_BUTTON} bg-white! text-violet-800! hover:bg-violet-50! h-14 px-8 text-lg`}>
          {done ? 'Play again' : 'Start the final'}
        </button>
      ) : (
        <span className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 font-bold">
          <Lock size={18} aria-hidden="true" /> Pass all 3 checkpoints
        </span>
      )}
    </div>
  );
}
