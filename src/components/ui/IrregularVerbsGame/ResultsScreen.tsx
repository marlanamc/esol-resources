'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Zap, Unlock, RotateCcw, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import type { VerbGroup, VerbGameRoundResults } from '@/types/irregular-verbs';

interface ResultsScreenProps {
  group: VerbGroup;
  results: VerbGameRoundResults;
  nextGroup: VerbGroup | null;
  onRetry: () => void;
  onContinue: () => void;
}

export function ResultsScreen({
  group,
  results,
  nextGroup,
  onRetry,
  onContinue
}: ResultsScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const unlocked = !!results.unlocked && !!nextGroup;
  const isPassing = results.accuracy >= 80;
  const isPerfect = results.accuracy === 100;

  useEffect(() => {
    if (isPassing) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isPassing]);

  // Determine achievement tier
  const getTier = () => {
    if (results.accuracy === 100) return { label: 'Perfect', color: 'from-amber-400 to-yellow-500', icon: '🌟' };
    if (results.accuracy >= 90) return { label: 'Excellent', color: 'from-secondary to-emerald-500', icon: '🎯' };
    if (results.accuracy >= 80) return { label: 'Passed', color: 'from-primary to-rose-500', icon: '✓' };
    return { label: 'Keep Practicing', color: 'from-slate-400 to-slate-500', icon: '📚' };
  };

  const tier = getTier();

  return (
    <div className="space-y-8 pb-8">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && <ConfettiEffect />}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="text-center pt-4"
      >
        {/* Achievement Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative inline-block mb-6"
        >
          <div
            className={`w-28 h-28 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-xl`}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="text-5xl"
            >
              {tier.icon}
            </motion.span>
          </div>

          {/* Glow ring */}
          {isPassing && (
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${tier.color} opacity-30`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Perfect sparkles */}
          {isPerfect && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <Sparkles
                    key={deg}
                    size={16}
                    className="absolute text-amber-400"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${deg}deg) translateY(-60px) translateX(-8px)`
                    }}
                  />
                ))}
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl sm:text-4xl text-text mb-2"
        >
          {tier.label}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-text-muted"
        >
          {group.title}
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <StatCard
          icon={<Target size={20} />}
          value={`${results.accuracy}%`}
          label="Accuracy"
          color={isPassing ? 'success' : 'neutral'}
          delay={0.55}
        />
        <StatCard
          icon={<BookOpen size={20} />}
          value={`${results.correctAnswers}/${results.exercisesCompleted}`}
          label="Correct"
          color="info"
          delay={0.6}
        />
        <StatCard
          icon={<Zap size={20} />}
          value={results.streak.toString()}
          label="Best Streak"
          color="warning"
          delay={0.65}
        />
        <StatCard
          icon={<Trophy size={20} />}
          value={`+${results.pointsAwarded}`}
          label="Points"
          color="accent"
          delay={0.7}
        />
      </motion.div>

      {/* Accuracy Progress Ring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--color-bg-gray)"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={isPassing ? 'var(--color-secondary)' : 'var(--color-text-muted)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - results.accuracy / 100) }}
              transition={{ duration: 1.5, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="text-4xl font-display font-bold text-text"
            >
              {results.accuracy}%
            </motion.span>
            <span className="text-sm text-text-muted">accuracy</span>
          </div>
        </div>
      </motion.div>

      {/* Unlock Celebration */}
      {unlocked && nextGroup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
          className="relative overflow-hidden rounded-2xl border-2 border-accent p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(233, 196, 106, 0.15) 0%, rgba(176, 87, 64, 0.08) 100%)'
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
          />

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/30 mb-4"
            >
              <Unlock size={28} className="text-primary-dark" />
            </motion.div>

            <h2 className="font-display text-2xl text-text mb-2">
              Chapter Unlocked!
            </h2>
            <p className="text-text-muted mb-1">
              You've unlocked
            </p>
            <p className="font-display text-lg text-primary font-semibold">
              {nextGroup.title}
            </p>
          </div>
        </motion.div>
      )}

      {/* Feedback Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`p-5 rounded-2xl text-center ${
          isPerfect
            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200'
            : isPassing
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200'
              : 'bg-bg-light border-2 border-border'
        }`}
      >
        <p className={`font-medium ${
          isPerfect
            ? 'text-amber-800'
            : isPassing
              ? 'text-emerald-800'
              : 'text-text'
        }`}>
          {isPerfect && "Flawless performance! You've completely mastered this pattern."}
          {!isPerfect && isPassing && "Great work! You've demonstrated solid understanding of this pattern."}
          {!isPassing && "Keep practicing! Focus on the pattern hints to improve your accuracy."}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 border-border bg-white text-text font-semibold hover:border-primary hover:text-primary transition-all"
        >
          <RotateCcw size={18} />
          <span>Practice Again</span>
        </motion.button>

        <motion.button
          whileHover={isPassing ? { scale: 1.02 } : undefined}
          whileTap={isPassing ? { scale: 0.98 } : undefined}
          onClick={onContinue}
          disabled={!isPassing}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all ${
            isPassing
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:shadow-xl'
              : 'bg-bg-gray text-text-muted cursor-not-allowed'
          }`}
        >
          <span>{isPassing ? 'Continue Journey' : `Need 80% (${results.accuracy}%)`}</span>
          {isPassing && <ChevronRight size={18} />}
        </motion.button>
      </motion.div>

      {/* Tips */}
      {!isPassing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="p-4 bg-white rounded-xl border border-border"
        >
          <p className="font-semibold text-text mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            Tips for improvement
          </p>
          <ul className="text-sm text-text-muted space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Review the pattern example before each exercise
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Say the verb forms out loud: {group.patternExample}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Take your time - accuracy matters more than speed
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  value,
  label,
  color,
  delay
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: 'success' | 'info' | 'warning' | 'accent' | 'neutral';
  delay: number;
}) {
  const colorClasses = {
    success: 'bg-secondary/10 border-secondary/20 text-secondary-dark',
    info: 'bg-info/10 border-info/20 text-info',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    accent: 'bg-accent/20 border-accent/30 text-primary-dark',
    neutral: 'bg-bg-gray border-border text-text-muted'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
      className={`p-4 rounded-xl border text-center ${colorClasses[color]}`}
    >
      <div className="flex justify-center mb-2 opacity-70">
        {icon}
      </div>
      <div className="text-2xl font-display font-bold mb-0.5">
        {value}
      </div>
      <div className="text-xs opacity-70">
        {label}
      </div>
    </motion.div>
  );
}

// Confetti Effect Component
function ConfettiEffect() {
  const confettiColors = ['#b05740', '#6a8d73', '#e9c46a', '#4a8ca0', '#d64045'];
  const confettiCount = 50;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const color = confettiColors[i % confettiColors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const size = 6 + Math.random() * 8;

        return (
          <motion.div
            key={i}
            initial={{
              y: -20,
              x: 0,
              rotate: 0,
              opacity: 1
            }}
            animate={{
              y: '100vh',
              x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100],
              rotate: Math.random() * 720 - 360,
              opacity: [1, 1, 0]
            }}
            transition={{
              duration,
              delay,
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: 0,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px'
            }}
          />
        );
      })}
    </div>
  );
}
