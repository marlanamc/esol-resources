'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookMarked, GraduationCap } from 'lucide-react';
import type { TenseCategory } from '@/types/activity';
import { TimelineCanvas } from './TimelineCanvas';
import { highlightSentenceFeatures } from './highlightUtils';
import {
  getLearnTensesFamilySequence,
  LEARN_TENSES_LESSONS,
  type LearnTensesFamilyId,
} from '@/data/timeline-learn-tenses';

interface LearnTensesWalkthroughProps {
  selectedCategories: TenseCategory[];
  onBack: () => void;
  onStartPractice: () => void;
  onOpenFormulas: () => void;
}

const FAMILY_STYLE: Record<LearnTensesFamilyId, { chip: string; accent: string; dot: string; slot: Record<string, string> }> = {
  simple: {
    chip: 'bg-[#eef4ec] text-[#3d8e42] border-[#3d8e42]/15',
    accent: 'from-[#eef4ec] via-white to-[#f8fafc]',
    dot: 'bg-[#3d8e42]',
    slot: {
      past: 'text-amber-700 dark:text-amber-300',
      present: 'text-emerald-700 dark:text-emerald-300',
      future: 'text-blue-700 dark:text-blue-300',
    },
  },
  continuous: {
    chip: 'bg-[#edf5f4] text-[#268a82] border-[#268a82]/15',
    accent: 'from-[#edf5f4] via-white to-[#f4fbfa]',
    dot: 'bg-[#268a82]',
    slot: {
      past: 'text-amber-700 dark:text-amber-300',
      present: 'text-emerald-700 dark:text-emerald-300',
      future: 'text-blue-700 dark:text-blue-300',
    },
  },
  perfect: {
    chip: 'bg-[#fff7ed] text-[#c44a28] border-[#c44a28]/15',
    accent: 'from-[#fff7ed] via-white to-[#fff5f1]',
    dot: 'bg-[#c44a28]',
    slot: {
      past: 'text-amber-700 dark:text-amber-300',
      present: 'text-emerald-700 dark:text-emerald-300',
      future: 'text-blue-700 dark:text-blue-300',
    },
  },
  'perfect-continuous': {
    chip: 'bg-[#f5f0e8] text-[#b56e1a] border-[#b56e1a]/15',
    accent: 'from-[#f5f0e8] via-white to-[#fff9f2]',
    dot: 'bg-[#b56e1a]',
    slot: {
      past: 'text-amber-700 dark:text-amber-300',
      present: 'text-emerald-700 dark:text-emerald-300',
      future: 'text-blue-700 dark:text-blue-300',
    },
  },
};

const FAMILY_TAB_STYLE: Record<LearnTensesFamilyId, { active: string; inactive: string }> = {
  simple: {
    active: 'bg-[#3d8e42] text-white shadow-[0_10px_24px_-14px_rgba(61,142,66,0.65)]',
    inactive: 'bg-white/70 text-[#3d8e42] hover:bg-[#eef4ec] dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10',
  },
  continuous: {
    active: 'bg-[#268a82] text-white shadow-[0_10px_24px_-14px_rgba(38,138,130,0.65)]',
    inactive: 'bg-white/70 text-[#268a82] hover:bg-[#edf5f4] dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10',
  },
  perfect: {
    active: 'bg-[#c44a28] text-white shadow-[0_10px_24px_-14px_rgba(196,74,40,0.65)]',
    inactive: 'bg-white/70 text-[#c44a28] hover:bg-[#fff7ed] dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10',
  },
  'perfect-continuous': {
    active: 'bg-[#b56e1a] text-white shadow-[0_10px_24px_-14px_rgba(181,110,26,0.65)]',
    inactive: 'bg-white/70 text-[#b56e1a] hover:bg-[#f5f0e8] dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10',
  },
};

export function LearnTensesWalkthrough({
  selectedCategories,
  onBack,
  onStartPractice,
  onOpenFormulas,
}: LearnTensesWalkthroughProps) {
  const families = useMemo(
    () => getLearnTensesFamilySequence(selectedCategories),
    [selectedCategories]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const familyId = families[currentIndex];
  const lesson = LEARN_TENSES_LESSONS[familyId];
  const style = FAMILY_STYLE[familyId];
  const isLast = currentIndex === families.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="flex-1 flex flex-col px-3 sm:px-0"
    >
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 px-4 h-11 text-sm font-semibold text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={onOpenFormulas}
          className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 px-4 h-11 text-sm font-semibold text-text-muted hover:text-primary transition-colors"
        >
          <BookMarked size={18} />
          <span className="hidden sm:inline">Tense Formulas</span>
        </button>
      </div>

      <div className="mb-8 rounded-[2rem] border border-white/30 bg-white/40 dark:bg-[#162b3d]/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap size={24} />
          </div>
          <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${style.chip}`}>
            {lesson.badge}
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-text">
          Learn the Tenses
        </h1>

        {families.length > 1 && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {families.map((family, index) => (
                <button
                  key={family}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
                    index === currentIndex
                      ? `${FAMILY_TAB_STYLE[family].active} border-transparent scale-[1.02]`
                      : `${FAMILY_TAB_STYLE[family].inactive} border-border/30 dark:border-white/10`
                  }`}
                >
                  {LEARN_TENSES_LESSONS[family].badge}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs sm:text-sm font-semibold text-text-muted/65">
              Jump to the tense family above, or keep going in order.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-[1.6rem] border border-border/25 bg-white/55 dark:bg-white/5 px-4 py-4 sm:px-5 sm:py-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${style.chip}`}>
              {lesson.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-text">
              {lesson.title}
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-white/70 px-3 py-3 dark:bg-white/5">
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45">
                  What It Shows
                </div>
                <p className="mt-1 text-sm sm:text-base font-semibold leading-relaxed text-text">
                  {lesson.intro}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white/70 px-3 py-3 dark:bg-white/5">
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45">
                  Use It For
                </div>
                <p className="mt-1 text-sm font-medium leading-relaxed text-text-muted/72">
                  {lesson.helper}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5">
        {lesson.cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`rounded-[2rem] border border-white/30 bg-gradient-to-br ${style.accent} dark:from-white/5 dark:via-[#162b3d]/70 dark:to-[#162b3d]/40 p-4 sm:p-6 shadow-lg`}
          >
            <div className="mb-3 sm:mb-4 flex items-center justify-between gap-3">
              <div>
                <div className={`text-xs font-black uppercase tracking-[0.24em] ${style.slot[card.timeSlot]}`}>
                  {card.timeSlot}
                </div>
                <h2 className="mt-1 text-2xl font-display font-black text-text tracking-tight">
                  {card.tenseName}
                </h2>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
              <div>
                <p className="text-sm font-semibold leading-relaxed text-text-muted/75">
                  {card.shortMeaning}
                </p>

                <div className="mt-3 rounded-2xl border border-border/30 bg-white/55 dark:bg-white/5 px-4 py-3 sm:mt-4 sm:py-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45">
                    Formula
                  </div>
                  <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
                    {[
                      ['Aff.', card.formulas.affirmative],
                      ['Neg.', card.formulas.negative],
                      ['Q.', card.formulas.question],
                    ].map(([label, formula]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[2.8rem_minmax(0,1fr)] items-start gap-2.5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-3"
                      >
                        <div className="pt-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted/45">
                          {label}
                        </div>
                        <div className="text-[15px] sm:text-base font-bold leading-snug text-text">
                          {formula}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-border/30 bg-white/55 dark:bg-white/5 px-4 py-3 sm:mt-4 sm:py-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45">
                    Examples
                  </div>
                  <div className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-3">
                    {(
                      [
                        ['Aff.', card.examples.affirmative],
                        ['Neg.', card.examples.negative],
                        ['Q.', card.examples.question],
                      ] as const
                    ).map(([label, example]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[2.8rem_minmax(0,1fr)] items-start gap-2.5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-3"
                      >
                        <div className="pt-1 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted/45">
                          {label}
                        </div>
                        <p className="text-[1.02rem] sm:text-lg font-display font-black leading-snug tracking-tight text-text">
                          &ldquo;{highlightSentenceFeatures(example.sentence, example.verbPhrase)}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-4 sm:p-5 shadow-inner dark:border-white/15 dark:bg-[#132738]">
                <div className="text-center text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-white/45">
                  Timeline Shape
                </div>
                <div className="mt-4">
                  <TimelineCanvas
                    elements={card.timelineElements}
                    interactive={false}
                    showLabels
                    pastTimelineLayout={card.timelineElements.some((element) => element.zone.startsWith('past-')) ? 'split' : 'single'}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 mb-12 rounded-[2rem] border border-white/30 bg-white/40 dark:bg-[#162b3d]/40 p-4 sm:p-5 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-text-muted/70">
            Step {currentIndex + 1} of {families.length}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                if (currentIndex === 0) {
                  onBack();
                  return;
                }
                setCurrentIndex((index) => Math.max(0, index - 1));
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/40 bg-white/60 dark:bg-white/5 px-5 py-3 text-sm font-black text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft size={18} />
              {currentIndex === 0 ? 'Back to Selection' : 'Previous'}
            </button>

            <button
              onClick={onStartPractice}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-3 text-sm font-black text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/15"
            >
              Start Practice with This Family
              <ArrowRight size={18} />
            </button>

            {isLast ? null : (
              <button
                onClick={() => setCurrentIndex((index) => Math.min(families.length - 1, index + 1))}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
              >
                Next Family
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
