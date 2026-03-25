'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, X } from 'lucide-react';
import { TimelineCanvas } from './TimelineCanvas';

interface TutorialIntroScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

export function TutorialIntroScreen({ onStart, onSkip }: TutorialIntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex-1 flex flex-col items-center justify-center px-4"
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
            Let&apos;s Learn the Timeline!
          </h1>
          <p className="text-text-muted text-lg">
            Every verb tense has a shape on the timeline. Let&apos;s practice with 3 examples first.
          </p>
        </div>

        {/* Mini timeline preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-8 shadow-sm"
        >
          <p className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4 text-center">
            The Timeline Has 3 Zones
          </p>
          <TimelineCanvas elements={[]} showLabels={true} />
          {/* Zone indicators aligned with timeline positions */}
          <div className="relative mt-4 text-sm" style={{ height: '40px' }}>
            {/* Past - single dot, centered at ~26% (105/400) */}
            <div className="absolute text-center" style={{ left: '26%', transform: 'translateX(-50%)' }}>
              <div className="w-3 h-3 rounded-full bg-amber-500 mx-auto mb-1" />
              <span className="text-text-muted">Past</span>
            </div>
            {/* Now - multiple dots for repeated actions, centered at 50% (200/400) */}
            <div className="absolute text-center" style={{ left: '50%', transform: 'translateX(-50%)' }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-60" />
              </div>
              <span className="text-text-muted">Now</span>
            </div>
            {/* Future - single dot, centered at ~74% (295/400) */}
            <div className="absolute text-center" style={{ left: '74%', transform: 'translateX(-50%)' }}>
              <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1" />
              <span className="text-text-muted">Future</span>
            </div>
          </div>
        </motion.div>

        {/* What you'll learn */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            You&apos;ll learn to place:
          </p>
          <ul className="space-y-2 text-text">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Dots for single events</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Lines for ongoing actions</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Arcs for connections to NOW</span>
            </li>
          </ul>
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
