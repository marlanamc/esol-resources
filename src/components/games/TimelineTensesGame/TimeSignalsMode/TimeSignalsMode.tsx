'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';
import {
  getAllTimeSignalEntries,
  getAllTimeSignalProductionExercises,
  TIME_SIGNAL_GROUPS,
} from '@/data/timeline-time-expressions';
import { TimeSignalsExplore } from './TimeSignalsExplore';
import { TimeSignalsQuiz } from './TimeSignalsQuiz';
import { TimeSignalsProduction } from './TimeSignalsProduction';
import type { TimeSignalGroup } from '@/data/timeline-time-expressions';

type SubView = 'group-select' | 'explore' | 'quiz' | 'production' | 'mixed-quiz';

interface TimeSignalsModeProps {
  onBack: () => void;
}

export function TimeSignalsMode({ onBack }: TimeSignalsModeProps) {
  const [subView, setSubView] = useState<SubView>('group-select');
  const [selectedGroup, setSelectedGroup] = useState<TimeSignalGroup | null>(null);
  const mixedGroup = useMemo<TimeSignalGroup>(() => ({
    id: 'mixed-practice',
    label: 'Mixed Practice',
    shortLabel: 'Mixed',
    description: 'All groups combined for review across the whole Time Signals set.',
    color: 'slate',
    tone: 'text-[#2563eb] dark:text-[#7cb2ff]',
    iconBg: 'bg-[#eff6ff] dark:bg-[#2563eb]/18',
    activeBg: 'bg-[#2563eb]',
    border: 'border-[#2563eb]/20 dark:border-[#7cb2ff]/30',
    expressions: getAllTimeSignalEntries().map((item) => {
      const { groupId, ...entry } = item;
      void groupId;
      return {
        ...entry,
        word: `${entry.word}`,
      };
    }),
    productionExercises: getAllTimeSignalProductionExercises(),
  }), []);

  function selectGroup(group: TimeSignalGroup, view: 'explore' | 'quiz' | 'production' | 'mixed-quiz') {
    setSelectedGroup(group);
    setSubView(view);
  }

  function handleGoToExercises() {
    onBack();
  }

  function goBack() {
    if (subView === 'group-select') {
      onBack();
    } else {
      setSubView('group-select');
      setSelectedGroup(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col gap-6 max-w-2xl mx-auto w-full px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#162b3d] border border-border dark:border-white/10 flex items-center justify-center text-text-muted hover:text-text transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-display text-2xl font-black text-text leading-none">
            {subView === 'group-select'
              ? 'Time Signals'
              : subView === 'explore'
              ? `Explore: ${selectedGroup?.label}`
              : subView === 'quiz'
              ? `Timeline Quiz: ${selectedGroup?.label}`
              : subView === 'mixed-quiz'
              ? 'Mixed Timeline Quiz'
              : selectedGroup?.id === 'mixed-practice'
              ? 'Mixed Verb Practice'
              : `Verb Practice: ${selectedGroup?.label}`}
          </h2>
          {subView === 'group-select' && (
            <p className="text-sm text-text-muted/60 font-medium mt-1">
              Understand what each time word communicates on the timeline.
            </p>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Group Selection */}
        {subView === 'group-select' && (
          <motion.div
            key="group-select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Explainer tip */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-accent/10 border border-accent/20">
              <HelpCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-text-muted leading-snug">
                Time words are powerful clues. Knowing what they signal on a timeline helps you choose the right tense every time.
              </p>
            </div>

            {/* Group cards */}
            {TIME_SIGNAL_GROUPS.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className={`font-bold text-base ${group.tone}`}>{group.label}</h3>
                    <p className="text-xs text-text-muted/60 font-medium mt-0.5">{group.description}</p>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${group.iconBg} ${group.tone} flex-shrink-0`}>
                    {group.expressions.length} words
                  </span>
                </div>

                {/* Word chips preview */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {group.expressions.map((e) => (
                    <span
                      key={e.word}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${group.border} ${group.iconBg} ${group.tone}`}
                    >
                      {e.word}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => selectGroup(group, 'explore')}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${group.border} ${group.iconBg} ${group.tone} hover:opacity-80`}
                  >
                    <BookOpen size={15} />
                    Explore
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => selectGroup(group, 'quiz')}
                      className={`py-2.5 rounded-xl text-sm font-bold text-white transition-all ${group.activeBg} hover:opacity-90`}
                    >
                      Timeline Quiz
                    </button>
                    <button
                      onClick={() => selectGroup(group, 'production')}
                      className={`py-2.5 rounded-xl text-sm font-bold text-white transition-all ${group.activeBg} hover:opacity-90`}
                    >
                      Verb Practice
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: TIME_SIGNAL_GROUPS.length * 0.05 }}
              className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-base text-text">Mixed Practice</h3>
                  <p className="text-xs text-text-muted/60 font-medium mt-0.5">
                    All groups combined · 8 questions
                  </p>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-secondary/10 text-secondary flex-shrink-0">
                  Review All
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => selectGroup(mixedGroup, 'mixed-quiz')}
                  className="py-2.5 rounded-xl text-sm font-bold text-white transition-all bg-primary hover:bg-primary-dark"
                >
                  Timeline Quiz
                </button>
                <button
                  onClick={() => selectGroup(mixedGroup, 'production')}
                  className="py-2.5 rounded-xl text-sm font-bold text-white transition-all bg-primary hover:bg-primary-dark"
                >
                  Verb Practice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Explore sub-view */}
        {subView === 'explore' && selectedGroup && (
          <motion.div
            key="explore"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <TimeSignalsExplore group={selectedGroup} />
            <div className="mt-6">
              <button
                onClick={() => setSubView('quiz')}
                className={`w-full py-4 rounded-2xl font-black text-lg text-white transition-all ${selectedGroup.activeBg} hover:opacity-90`}
              >
                Ready? Take the Timeline Quiz →
              </button>
            </div>
          </motion.div>
        )}

        {/* Quiz sub-view */}
        {subView === 'quiz' && selectedGroup && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <TimeSignalsQuiz
              group={selectedGroup}
              onComplete={() => {}}
              onGoToExercises={handleGoToExercises}
            />
          </motion.div>
        )}

        {subView === 'mixed-quiz' && selectedGroup && (
          <motion.div
            key="mixed-quiz"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <TimeSignalsQuiz
              group={selectedGroup}
              onComplete={() => {}}
              onGoToExercises={handleGoToExercises}
            />
          </motion.div>
        )}

        {subView === 'production' && selectedGroup && (
          <motion.div
            key="production"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <TimeSignalsProduction
              exercises={selectedGroup.productionExercises ?? []}
              groupTone={selectedGroup.tone}
              groupBorder={selectedGroup.border}
              groupIconBg={selectedGroup.iconBg}
              onComplete={() => {}}
              onGoToExercises={handleGoToExercises}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
