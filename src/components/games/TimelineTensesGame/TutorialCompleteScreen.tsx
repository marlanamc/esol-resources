'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface TutorialCompleteScreenProps {
  onContinue: () => void;
}

export function TutorialCompleteScreen({ onContinue }: TutorialCompleteScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex-1 flex flex-col items-center justify-center px-4"
    >
      <div className="max-w-lg w-full text-center">
        {/* Celebration icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="relative w-20 h-20 mx-auto mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-secondary" />
          </div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles size={24} className="text-accent" />
          </motion.div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display text-3xl font-bold text-text mb-3">
            You&apos;re Ready!
          </h1>
          <p className="text-text-muted text-lg mb-8">
            You learned the basics of timeline tenses. Now let&apos;s practice with real sentences!
          </p>
        </motion.div>

        {/* What you learned */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-8 shadow-sm"
        >
          <p className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
            What You Learned
          </p>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-text">
                <strong>Dots</strong> mark single events or facts
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-text">
                <strong>Lines</strong> show ongoing duration
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-text">
                <strong>Arcs</strong> connect actions to the present
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onContinue}
            className="w-full px-6 py-4 bg-primary text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Start Real Practice
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
