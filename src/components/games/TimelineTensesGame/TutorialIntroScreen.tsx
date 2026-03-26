'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, X } from 'lucide-react';
import { TimelineCanvas } from './TimelineCanvas';

import type { TenseCategory } from '@/types/activity';

interface TutorialIntroScreenProps {
  onStart: () => void;
  onSkip: () => void;
  tenseCategory: TenseCategory | 'all';
}

export function TutorialIntroScreen({ onStart, onSkip, tenseCategory }: TutorialIntroScreenProps) {
  const categoryTitles: Record<TenseCategory | 'all', string> = {
    simple: 'Simple Tenses',
    continuous: 'Continuous Tenses',
    perfect: 'Perfect Tenses',
    'perfect-continuous': 'Perfect Continuous Tenses',
    mixed: 'Mixed Tenses',
    all: 'the Timeline',
  };

  const categoryDesc: Record<TenseCategory | 'all', string> = {
    simple: 'Simple tenses show habits, facts, and single finished events.',
    continuous: 'Continuous tenses show actions that are in progress at a specific time.',
    perfect: 'Perfect tenses connect the past to now, or one past event to another.',
    'perfect-continuous': 'Perfect Continuous tenses show the duration of an ongoing action.',
    mixed: 'Mixed practice covers all categories. Let\'s review the basics.',
    all: 'Every verb tense has a shape on the timeline. Let\'s practice the basics.',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto"
    >
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <Clock size={32} className="text-primary" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-text mb-3">
            Let&apos;s Learn {categoryTitles[tenseCategory]}!
          </h1>
          <p className="text-text-muted text-lg">
            {categoryDesc[tenseCategory]}
          </p>
        </div>

        {/* Mini timeline preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-6 shadow-sm"
        >
          <p className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4 text-center">
            The Timeline Zones
          </p>
          <TimelineCanvas elements={[]} showLabels={true} />
          {/* Zone indicators aligned with timeline positions */}
          <div className="relative mt-4 text-sm" style={{ height: '40px' }}>
            <div className="absolute text-center" style={{ left: '26%', transform: 'translateX(-50%)' }}>
              <div className="w-3 h-3 rounded-full bg-amber-500 mx-auto mb-1" />
              <span className="text-text-muted">Past</span>
            </div>
            <div className="absolute text-center" style={{ left: '50%', transform: 'translateX(-50%)' }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-text-muted font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter text-xs">Now</span>
            </div>
            <div className="absolute text-center" style={{ left: '74%', transform: 'translateX(-50%)' }}>
              <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1" />
              <span className="text-text-muted">Future</span>
            </div>
          </div>
        </motion.div>

        {/* Pro Tip - Stamps Needed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl"
        >
          <div className="flex items-start gap-3">
             <div className="mt-1 px-2 py-0.5 bg-amber-500 text-xs font-bold text-white rounded uppercase tracking-wider">Tip</div>
             <div>
               <p className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">Look for the &quot;stamps needed&quot; chip</p>
               <p className="text-xs text-amber-800/80 dark:text-amber-200/70">
                 Some tenses need more than one stamp. If you see <span className="inline-block px-1.5 py-0.5 bg-amber-100 dark:bg-amber-800 rounded-full text-xs font-medium border border-amber-200 dark:border-amber-700">2 stamps needed</span>, make sure you use both!
               </p>
             </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={onStart}
            className="w-full px-6 py-4 bg-primary text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Start Tutorial
            <ArrowRight size={20} />
          </button>
          <button
            onClick={onSkip}
            className="w-full px-6 py-3 text-text-muted hover:text-text transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} />
            Skip, I know how it works
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
