'use client';

import { Fragment, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Check, ChevronDown, FlaskConical, RotateCcw, Sparkles } from 'lucide-react';
import type {
  TimelineElement,
  TimelineElementType,
  TimelineZone,
} from '@/types/activity';
import { TimelineCanvas } from './TimelineCanvas';
import { StampToolkit } from './StampToolkit';
import {
  elementsUseSplitPast,
  inferTimelineLabFeedback,
} from './timelineTensesUtils';

interface TimelineLabProps {
  onBack: () => void;
}

interface PlacedStamp {
  id: string;
  type: TimelineElementType;
  zone: TimelineZone;
  position: number;
}

type LabPillTone = 'past' | 'present' | 'future' | 'mixed';

const autoLayoutStamps = (stamps: PlacedStamp[]): PlacedStamp[] => {
  return stamps.map((stamp) => {
    const isDuration = stamp.type === 'solid-line' || stamp.type === 'dashed-line';
    if (isDuration) {
      return { ...stamp, position: 50 };
    }

    const punctualsInZone = stamps.filter(
      (s) => s.zone === stamp.zone && s.type !== 'solid-line' && s.type !== 'dashed-line'
    );
    const pIndex = punctualsInZone.findIndex((s) => s.id === stamp.id);
    const pCount = punctualsInZone.length;
    const hasDurationInZone = stamps.some(
      (s) => s.zone === stamp.zone && (s.type === 'solid-line' || s.type === 'dashed-line')
    );

    let position = 50;
    if (pCount === 1) {
      position = hasDurationInZone ? 68 : 50;
    } else if (pCount === 2) {
      position = pIndex === 0 ? 32 : 68;
    } else if (pCount === 3) {
      position = pIndex === 0 ? 20 : pIndex === 1 ? 50 : 80;
    } else if (pCount > 3) {
      position = 10 + (80 / (pCount - 1)) * pIndex;
    }

    return { ...stamp, position };
  });
};

const CHEAT_SHEET = [
  { category: 'Simple', label: 'Past Simple', pattern: 'Moment in past', exampleLead: 'He ', exampleVerb: 'studied', exampleTail: ' last night.', color: 'text-amber-700 dark:text-amber-300' },
  { category: 'Simple', label: 'Present Simple', pattern: 'Repeated dots at NOW', exampleLead: 'He ', exampleVerb: 'studies', exampleTail: ' every day.', color: 'text-emerald-700 dark:text-emerald-300' },
  { category: 'Simple', label: 'Future Simple', pattern: 'Moment in future', exampleLead: 'He ', exampleVerb: 'will study', exampleTail: ' tomorrow.', color: 'text-blue-700 dark:text-blue-300' },
  { category: 'Continuous', label: 'Past Continuous', pattern: 'Duration in past', exampleLead: 'He ', exampleVerb: 'was studying', exampleTail: ' at 8pm.', color: 'text-amber-700 dark:text-amber-300' },
  { category: 'Continuous', label: 'Present Continuous', pattern: 'Duration at NOW', exampleLead: 'He ', exampleVerb: 'is studying', exampleTail: ' right now.', color: 'text-emerald-700 dark:text-emerald-300' },
  { category: 'Continuous', label: 'Future Continuous', pattern: 'Duration in future', exampleLead: 'He ', exampleVerb: 'will be studying', exampleTail: ' all night.', color: 'text-blue-700 dark:text-blue-300' },
  { category: 'Perfect', label: 'Present Perfect', pattern: 'Arc from past → NOW', exampleLead: 'He ', exampleVerb: 'has studied', exampleTail: ' English.', color: 'text-emerald-700 dark:text-emerald-300' },
  { category: 'Perfect', label: 'Past Perfect', pattern: 'Arc in earlier past + moment in later past', exampleLead: 'He ', exampleVerb: 'had studied', exampleTail: ' before the test.', color: 'text-amber-700 dark:text-amber-300' },
  { category: 'Perfect', label: 'Future Perfect', pattern: 'Arc reaching into future', exampleLead: 'He ', exampleVerb: 'will have studied', exampleTail: ' by Friday.', color: 'text-blue-700 dark:text-blue-300' },
  { category: 'Perfect Continuous', label: 'Present Perfect Continuous', pattern: 'Ongoing link from past → NOW', exampleLead: 'He ', exampleVerb: 'has been studying', exampleTail: ' for hours.', color: 'text-emerald-700 dark:text-emerald-300' },
  { category: 'Perfect Continuous', label: 'Past Perfect Continuous', pattern: 'Ongoing link in earlier past + moment in later past', exampleLead: 'He ', exampleVerb: 'had been studying', exampleTail: ' when she called.', color: 'text-amber-700 dark:text-amber-300' },
  { category: 'Perfect Continuous', label: 'Future Perfect Continuous', pattern: 'Ongoing link reaching into future', exampleLead: 'He ', exampleVerb: 'will have been studying', exampleTail: ' for a year.', color: 'text-blue-700 dark:text-blue-300' },
];

const CATEGORY_STYLES: Record<
  string,
  {
    badge: string;
    line: string;
    label: string;
  }
> = {
  Simple: {
    badge:
      'border-amber-300/50 bg-amber-100/80 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
    line: 'from-amber-400/60 via-amber-300/25 to-transparent dark:from-amber-300/45 dark:via-amber-200/15 dark:to-transparent',
    label: 'single moments and habits',
  },
  Continuous: {
    badge:
      'border-teal-300/50 bg-teal-100/80 text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-200',
    line: 'from-teal-400/60 via-teal-300/25 to-transparent dark:from-teal-300/45 dark:via-teal-200/15 dark:to-transparent',
    label: 'actions in progress',
  },
  Perfect: {
    badge:
      'border-violet-300/50 bg-violet-100/80 text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200',
    line: 'from-violet-400/60 via-violet-300/25 to-transparent dark:from-violet-300/45 dark:via-violet-200/15 dark:to-transparent',
    label: 'linked across time',
  },
  'Perfect Continuous': {
    badge:
      'border-rose-300/50 bg-rose-100/80 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
    line: 'from-rose-400/60 via-rose-300/25 to-transparent dark:from-rose-300/45 dark:via-rose-200/15 dark:to-transparent',
    label: 'ongoing links through time',
  },
};

export function TimelineLab({ onBack }: TimelineLabProps) {
  const [selectedStamp, setSelectedStamp] = useState<TimelineElementType | null>(null);
  const [placedStamps, setPlacedStamps] = useState<PlacedStamp[]>([]);
  const [highlightZone, setHighlightZone] = useState<TimelineZone | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const useSplitPast =
    elementsUseSplitPast(placedStamps) ||
    selectedStamp === 'arc' ||
    selectedStamp === 'solid-to-now';

  const displayElements: TimelineElement[] = useMemo(
    () =>
      placedStamps.map((stamp) => ({
        id: stamp.id,
        type: stamp.type,
        zone: stamp.zone,
        position: stamp.position,
      })),
    [placedStamps]
  );

  const feedback = useMemo(() => inferTimelineLabFeedback(displayElements), [displayElements]);

  const feedbackTone = useMemo<LabPillTone>(() => {
    const zones = new Set(displayElements.map((element) => element.zone));
    const hasPast = [...zones].some((zone) => zone === 'past' || zone === 'past-earlier' || zone === 'past-later');
    const hasPresent = zones.has('present');
    const hasFuture = zones.has('future');

    if (hasFuture && !hasPast && !hasPresent) {
      return 'future';
    }
    if (hasPresent && !hasPast && !hasFuture) {
      return 'present';
    }
    if (hasPast && !hasPresent && !hasFuture) {
      return 'past';
    }
    return 'mixed';
  }, [displayElements]);

  const feedbackPillClasses: Record<LabPillTone, string> = {
    past: 'bg-amber-500/12 text-amber-800 border-amber-500/20 dark:bg-amber-500/12 dark:text-amber-300 dark:border-amber-500/20',
    present: 'bg-emerald-500/12 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/20',
    future: 'bg-blue-500/12 text-blue-700 border-blue-500/20 dark:bg-blue-500/12 dark:text-blue-300 dark:border-blue-500/20',
    mixed: 'bg-slate-500/12 text-slate-700 border-slate-400/20 dark:bg-slate-500/12 dark:text-slate-200 dark:border-slate-400/20',
  };

  const handleTimelineClick = useCallback(
    (zone: TimelineZone) => {
      if (!selectedStamp) {
        return;
      }

      setPlacedStamps((prev) =>
        autoLayoutStamps([
          ...prev,
          {
            id: `lab-stamp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            type: selectedStamp,
            zone,
            position: 50,
          },
        ])
      );
      setSelectedStamp(null);
      setHighlightZone(null);
    },
    [selectedStamp]
  );

  const handleRemoveStamp = useCallback((id: string) => {
    setPlacedStamps((prev) => autoLayoutStamps(prev.filter((stamp) => stamp.id !== id)));
  }, []);

  const handleClear = useCallback(() => {
    setPlacedStamps([]);
    setSelectedStamp(null);
    setHighlightZone(null);
  }, []);

  const helperText =
    selectedStamp !== null
      ? 'Tap a timeline zone to place your stamp.'
      : 'Build a tense pattern freely, then watch the tag update.';

  const statusText =
    feedback.status === 'none'
      ? placedStamps.length === 0
        ? 'Select a stamp, then tap the timeline to explore tense patterns.'
        : 'No tense match.'
      : null;

  const labHint = useMemo(() => {
    if (feedback.status !== 'match') return null;
    if (feedback.primaryLabel === 'Present Perfect' && placedStamps.length === 1) {
      return 'Add a Moment stamp in the past to make this Past Perfect.';
    }
    if (feedback.primaryLabel === 'Present Perfect Continuous' && placedStamps.length === 1) {
      return 'Add a Moment stamp in an earlier zone to make this Past Perfect Continuous.';
    }
    return null;
  }, [feedback.status, feedback.primaryLabel, placedStamps.length]);

  return (
    <div className="px-2 sm:px-0 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-5 sm:p-6 mb-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Back to modes"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/50 bg-white/75 text-text-muted shadow-sm transition-all hover:border-primary/30 hover:text-text dark:bg-[#162b3d]/75"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <FlaskConical size={16} />
              <span className="text-xs font-black tracking-[0.2em] uppercase">Build Your Timeline Lab</span>
            </div>
          </div>

          <button
            onClick={() => setShowCheatSheet((v) => !v)}
            aria-expanded={showCheatSheet}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border/40 bg-white/60 dark:bg-[#162b3d]/60 text-text-muted hover:text-primary hover:border-primary/30 transition-all text-xs font-bold"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Patterns</span>
            <motion.span animate={{ rotate: showCheatSheet ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCheatSheet && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-xl rounded-[2rem] border border-white/30 px-5 py-5 shadow-lg">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted/40 mb-4">All Buildable Patterns</p>
              <div className="-mx-2 overflow-x-auto overscroll-x-contain px-2 pb-1">
                <table className="min-w-[42rem] text-xs border-collapse">
                  <tbody>
                    {CHEAT_SHEET.map(({ category, label, pattern, exampleLead, exampleVerb, exampleTail, color }, index) => {
                      const previousCategory = index > 0 ? CHEAT_SHEET[index - 1]?.category : null;
                      const nextLabel = index < CHEAT_SHEET.length - 1 ? CHEAT_SHEET[index + 1]?.label : null;
                      const startsCategory = index === 0 || previousCategory !== category;
                      const endsBeforeFuture = nextLabel?.startsWith('Future ') ?? false;
                      const categoryStyle = CATEGORY_STYLES[category];

                      return (
                        <Fragment key={label}>
                          {startsCategory ? (
                            <tr className="group">
                              <td colSpan={3} className="pt-4 pb-3 first:pt-0">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm ${categoryStyle.badge}`}
                                  >
                                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                                      {category}
                                    </span>
                                    <span className="text-[10px] font-semibold normal-case tracking-normal opacity-70">
                                      {categoryStyle.label}
                                    </span>
                                  </div>
                                  <div
                                    className={`h-[3px] flex-1 rounded-full bg-gradient-to-r ${categoryStyle.line}`}
                                  />
                                </div>
                              </td>
                            </tr>
                          ) : null}
                          <tr
                            className={`border-border/20 ${
                              startsCategory
                                ? 'border-t-2 border-t-text/35 dark:border-t-white/25'
                                : endsBeforeFuture
                                  ? ''
                                  : 'border-b'
                            } last:border-b-0`}
                          >
                            <td className={`py-2 pr-4 font-black uppercase tracking-wide whitespace-nowrap w-px ${color}`}>
                              {label}
                            </td>
                            <td className="py-2 pr-4 text-text-muted/60 font-medium min-w-[9rem]">
                              {pattern}
                            </td>
                            <td className="py-2 text-text/70 font-medium italic whitespace-nowrap min-w-[12rem]">
                              <span>{exampleLead}</span>
                              <span className={`font-black not-italic ${color}`}>{exampleVerb}</span>
                              <span>{exampleTail}</span>
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.75rem] border border-white/30 px-4 py-6 sm:px-8 sm:py-10 mb-8 shadow-xl overflow-visible relative"
      >
        <div className="text-xs font-black text-text-muted/50 uppercase tracking-[0.2em] mb-6 text-center flex items-center justify-center gap-3">
          <Sparkles size={14} className={selectedStamp ? 'text-primary' : 'text-text-muted/30'} />
          <span className={selectedStamp ? 'text-primary-dark' : undefined}>{helperText}</span>
        </div>

        <div className="relative group min-h-[240px] sm:min-h-[300px] flex items-center">
          <button
            onClick={handleClear}
            disabled={placedStamps.length === 0}
            className="absolute right-0 top-0 z-20 inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/80 dark:bg-[#162b3d]/80 px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition-all hover:border-primary/30 hover:text-text disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw size={15} />
            <span>Clear</span>
          </button>
          <TimelineCanvas
            elements={displayElements}
            interactive={!!selectedStamp}
            highlightZone={highlightZone}
            pastTimelineLayout={useSplitPast ? 'split' : 'single'}
            className="max-w-4xl"
          />

          {selectedStamp && (
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-primary/20 bg-primary/2 animate-pulse" />
          )}

          {selectedStamp && (
            <div className="absolute inset-0 flex pointer-events-auto">
              {useSplitPast ? (
                <>
                  <button
                    style={{ flex: '0 0 23%' }}
                    aria-label="Place stamp in earlier past"
                    className="rounded-l-[2rem] focus:outline-none transition-colors hover:bg-white/5"
                    onClick={() => handleTimelineClick('past-earlier')}
                    onMouseEnter={() => setHighlightZone('past-earlier')}
                    onMouseLeave={() => setHighlightZone(null)}
                  />
                  <button
                    style={{ flex: '0 0 19%' }}
                    aria-label="Place stamp in later past"
                    className="focus:outline-none transition-colors hover:bg-white/5"
                    onClick={() => handleTimelineClick('past-later')}
                    onMouseEnter={() => setHighlightZone('past-later')}
                    onMouseLeave={() => setHighlightZone(null)}
                  />
                  <div style={{ flex: '0 0 4.5%' }} className="pointer-events-none" />
                </>
              ) : (
                <button
                  style={{ flex: '0 0 46.5%' }}
                  aria-label="Place stamp in past"
                  className="rounded-l-[2rem] focus:outline-none transition-colors hover:bg-white/5"
                  onClick={() => handleTimelineClick('past')}
                  onMouseEnter={() => setHighlightZone('past')}
                  onMouseLeave={() => setHighlightZone(null)}
                />
              )}

              <button
                style={{ flex: '0 0 7%' }}
                aria-label="Place stamp in present"
                className="focus:outline-none transition-colors hover:bg-white/5"
                onClick={() => handleTimelineClick('present')}
                onMouseEnter={() => setHighlightZone('present')}
                onMouseLeave={() => setHighlightZone(null)}
              />
              <button
                style={{ flex: '0 0 46.5%' }}
                aria-label="Place stamp in future"
                className="rounded-r-[2rem] focus:outline-none transition-colors hover:bg-white/5"
                onClick={() => handleTimelineClick('future')}
                onMouseEnter={() => setHighlightZone('future')}
                onMouseLeave={() => setHighlightZone(null)}
              />
            </div>
          )}
        </div>

        {/* Mobile zone selector strip — visible only when a stamp is selected */}
        {selectedStamp && (
          <div className="mt-4 flex sm:hidden gap-2" role="group" aria-label="Choose a timeline zone">
            {useSplitPast ? (
              <>
                <button
                  onClick={() => handleTimelineClick('past-earlier')}
                  className="flex-1 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
                >
                  Earlier Past
                </button>
                <button
                  onClick={() => handleTimelineClick('past-later')}
                  className="flex-1 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
                >
                  Later Past
                </button>
              </>
            ) : (
              <button
                onClick={() => handleTimelineClick('past')}
                className="flex-1 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
              >
                Past
              </button>
            )}
            <button
              onClick={() => handleTimelineClick('present')}
              className="flex-1 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
            >
              Now
            </button>
            <button
              onClick={() => handleTimelineClick('future')}
              className="flex-1 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
            >
              Future
            </button>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-4 flex min-h-[2rem] flex-col items-center justify-center gap-2"
        aria-live="polite"
      >
        {feedback.status === 'match' && feedback.primaryLabel ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-black text-sm uppercase tracking-[0.15em] ${feedbackPillClasses[feedbackTone]}`}>
              <Check size={15} />
              {feedback.primaryLabel}
            </span>
          </div>
        ) : null}
        {statusText ? (
          <p className="text-text-muted/80 font-medium text-center">
            {statusText}
          </p>
        ) : null}
        {labHint ? (
          <p className="text-xs font-medium text-text-muted/60 text-center">
            {labHint}
          </p>
        ) : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <StampToolkit
          selectedStamp={selectedStamp}
          onSelectStamp={setSelectedStamp}
          placedStamps={placedStamps}
          onRemoveStamp={handleRemoveStamp}
        />
      </motion.div>
    </div>
  );
}
