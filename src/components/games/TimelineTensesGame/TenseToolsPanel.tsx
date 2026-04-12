'use client';

import { useId, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FlaskConical, GraduationCap, Microscope, Timer } from 'lucide-react';

type StationTone = 'amber' | 'rose' | 'cyan';

const STATION_STYLES: Record<
  StationTone,
  { ring: string; glow: string; iconBg: string }
> = {
  amber: {
    ring: 'border-amber-300/60 dark:border-amber-400/35',
    glow: 'shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_18px_40px_-24px_rgba(245,158,11,0.35)]',
    iconBg: 'bg-amber-400/20 text-amber-900 dark:text-amber-200',
  },
  rose: {
    ring: 'border-rose-300/55 dark:border-rose-400/35',
    glow: 'shadow-[0_0_0_1px_rgba(244,114,182,0.1),0_18px_40px_-24px_rgba(244,114,182,0.28)]',
    iconBg: 'bg-rose-400/20 text-rose-900 dark:text-rose-200',
  },
  cyan: {
    ring: 'border-cyan-300/55 dark:border-cyan-400/35',
    glow: 'shadow-[0_0_0_1px_rgba(34,211,238,0.1),0_18px_40px_-24px_rgba(6,182,212,0.28)]',
    iconBg: 'bg-cyan-400/20 text-cyan-900 dark:text-cyan-200',
  },
};

export interface TenseToolsPanelProps {
  expanded: boolean;
  onToggleExpanded: () => void;
  onOpenLab: () => void;
  onOpenWalkthrough: () => void;
  onOpenTimeSignals: () => void;
}

export function TenseToolsPanel({
  expanded,
  onToggleExpanded,
  onOpenLab,
  onOpenWalkthrough,
  onOpenTimeSignals,
}: TenseToolsPanelProps) {
  const headingId = useId();
  const regionId = useId();

  const headerRound = expanded ? 'rounded-t-2xl' : 'rounded-2xl';

  return (
    <div
      className="relative mx-auto w-full max-w-lg"
      style={{
        backgroundImage: `
          linear-gradient(rgba(15, 118, 110, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15, 118, 110, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      <div
        className={`overflow-hidden border border-amber-200/70 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.42)] transition-all dark:border-white/10 ${
          expanded ? '' : 'hover:-translate-y-0.5 hover:shadow-[0_20px_42px_-18px_rgba(14,116,144,0.35)]'
        } rounded-2xl`}
      >
        <button
          type="button"
          id={headingId}
          aria-expanded={expanded}
          aria-controls={regionId}
          onClick={onToggleExpanded}
          className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden border-0 bg-gradient-to-r from-[#ffe5b8] via-[#ffd3dc] to-[#cdeeff] px-4 py-3.5 text-left transition-transform dark:from-amber-400/20 dark:via-rose-400/20 dark:to-cyan-400/20 ${headerRound}`}
        >
          <span
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_30%)] opacity-90 transition-opacity group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]"
            aria-hidden
          />
          <span
            className={`absolute inset-[1px] bg-gradient-to-r from-[#fff1cf]/90 via-[#ffe0ea]/80 to-[#e0f5ff]/90 dark:from-amber-300/12 dark:via-rose-300/10 dark:to-cyan-300/12 ${expanded ? 'rounded-t-[0.95rem]' : 'rounded-[0.95rem]'}`}
            aria-hidden
          />
          <span className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-300/50 bg-white/50 text-slate-900 shadow-sm backdrop-blur-[2px] dark:border-white/20 dark:bg-white/10 dark:text-white"
              aria-hidden
            >
              <Microscope className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="min-w-0 text-left">
              <span className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Tense Tools
              </span>
              <span className="mt-0.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-800/75 dark:text-white/75">
                Start here · review anytime
              </span>
            </span>
          </span>
          <span
            className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-300/60 bg-white/70 text-slate-800 shadow-sm backdrop-blur-sm transition-transform dark:border-white/25 dark:bg-slate-900/40 dark:text-white ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            <ChevronDown className="h-5 w-5" />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={regionId}
              role="region"
              aria-labelledby={headingId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden border-t border-amber-200/50 bg-white/90 dark:border-white/10 dark:bg-[#0f1f2e]/95"
            >
              <div className="space-y-3 px-3 pb-4 pt-3">
                <TenseToolStation
                  tone="amber"
                  title="Timeline Lab"
                  description="Place stamps on the line and see the shape of each tense in time."
                  icon={<FlaskConical className="h-5 w-5" strokeWidth={2.25} />}
                  onSelect={onOpenLab}
                />
                <TenseToolStation
                  tone="rose"
                  title="Tense walkthrough"
                  description="Short explanations and examples — one tense at a time."
                  icon={<GraduationCap className="h-5 w-5" strokeWidth={2.25} />}
                  onSelect={onOpenWalkthrough}
                />
                <TenseToolStation
                  tone="cyan"
                  title="Time signals"
                  description="Practice words and phrases that point to past, present, or future."
                  icon={<Timer className="h-5 w-5" strokeWidth={2.25} />}
                  onSelect={onOpenTimeSignals}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TenseToolStation({
  tone,
  title,
  description,
  icon,
  onSelect,
}: {
  tone: StationTone;
  title: string;
  description: string;
  icon: ReactNode;
  onSelect: () => void;
}) {
  const s = STATION_STYLES[tone];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full rounded-2xl border bg-white/90 p-3.5 text-left transition-all hover:-translate-y-0.5 hover:brightness-[1.02] dark:bg-[#152433]/90 ${s.ring} ${s.glow}`}
    >
      <div className="flex gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl pt-0.5 ${s.iconBg}`}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-display text-base font-black text-text">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-primary/80 group-hover:text-primary">
            Open station →
          </p>
        </div>
      </div>
    </button>
  );
}

export interface TenseToolsMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenLab: () => void;
  onOpenWalkthrough: () => void;
  onOpenTimeSignals: () => void;
}

/** Compact dropdown for the exercise toolbar */
export function TenseToolsExerciseMenu({
  open,
  onClose,
  onOpenLab,
  onOpenWalkthrough,
  onOpenTimeSignals,
}: TenseToolsMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full z-[60] mt-2 w-[min(100vw-2rem,20rem)] rounded-2xl border border-border/80 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#122433]/95"
        >
          <p className="border-b border-border/50 px-2 pb-2 text-center text-[11px] font-medium leading-snug text-text-muted dark:border-white/10">
            You can open this anytime — your round is saved.
          </p>
          <div className="mt-1 space-y-0.5">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-text hover:bg-primary/10"
              onClick={() => {
                onOpenLab();
                onClose();
              }}
            >
              <FlaskConical className="h-4 w-4 shrink-0 text-primary" />
              Timeline Lab
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-text hover:bg-primary/10"
              onClick={() => {
                onOpenWalkthrough();
                onClose();
              }}
            >
              <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
              Tense walkthrough
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-text hover:bg-primary/10"
              onClick={() => {
                onOpenTimeSignals();
                onClose();
              }}
            >
              <Timer className="h-4 w-4 shrink-0 text-primary" />
              Time signals
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
