'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react';
import type { GerundInfinitiveGroup } from '@/types/gerund-infinitive';

interface VerbSortingMiniGameProps {
  group: GerundInfinitiveGroup;
  onComplete: () => void;
  onSkip: () => void;
}

interface VerbItem {
  verb: string;
  correctBucket: 'gerund' | 'infinitive';
  placed?: 'gerund' | 'infinitive';
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function VerbSortingMiniGame({ group, onComplete, onSkip }: VerbSortingMiniGameProps) {
  // Build verb items from group patterns
  const initialVerbs: VerbItem[] = shuffleArray(
    group.patterns.map(p => ({
      verb: p.trigger,
      correctBucket: p.correctForm as 'gerund' | 'infinitive',
    }))
  ).slice(0, 8); // Limit to 8 verbs for quick game

  const [verbs, setVerbs] = useState<VerbItem[]>(initialVerbs);
  const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const unplacedVerbs = verbs.filter(v => !v.placed);
  const gerundVerbs = verbs.filter(v => v.placed === 'gerund');
  const infinitiveVerbs = verbs.filter(v => v.placed === 'infinitive');

  const handleVerbClick = (verb: string) => {
    if (showResults) return;
    setSelectedVerb(selectedVerb === verb ? null : verb);
  };

  const handleBucketClick = (bucket: 'gerund' | 'infinitive') => {
    if (!selectedVerb || showResults) return;

    setVerbs(prev => prev.map(v =>
      v.verb === selectedVerb ? { ...v, placed: bucket } : v
    ));
    setSelectedVerb(null);
  };

  const handleCheck = useCallback(() => {
    setAttempts(prev => prev + 1);
    setShowResults(true);
  }, []);

  const handleReset = () => {
    setVerbs(shuffleArray(initialVerbs));
    setSelectedVerb(null);
    setShowResults(false);
  };

  const correctCount = verbs.filter(v => v.placed === v.correctBucket).length;
  const allPlaced = unplacedVerbs.length === 0;
  const allCorrect = correctCount === verbs.length;

  const handleContinue = () => {
    if (allCorrect) {
      onComplete();
    } else {
      // Reset only incorrect ones
      setVerbs(prev => prev.map(v =>
        v.placed !== v.correctBucket ? { ...v, placed: undefined } : v
      ));
      setShowResults(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-display text-2xl text-text mb-2">Quick Sort Challenge</h2>
        <p className="text-text-muted text-sm">
          Tap a verb, then tap the correct bucket. Sort all {verbs.length} verbs to continue.
        </p>
      </motion.div>

      {/* Buckets */}
      <div className="grid grid-cols-2 gap-4">
        {/* Gerund bucket */}
        <motion.button
          onClick={() => handleBucketClick('gerund')}
          disabled={!selectedVerb || showResults}
          whileHover={selectedVerb && !showResults ? { scale: 1.02 } : {}}
          whileTap={selectedVerb && !showResults ? { scale: 0.98 } : {}}
          className={`rounded-2xl border-2 border-dashed p-4 min-h-[180px] transition-all ${
            selectedVerb && !showResults
              ? 'border-secondary bg-secondary/10 cursor-pointer'
              : 'border-secondary/30 bg-secondary/5'
          }`}
        >
          <div className="text-center mb-3">
            <p className="font-bold text-secondary text-sm">GERUND</p>
            <p className="text-xs text-secondary/70">verb + ing</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence mode="popLayout">
              {gerundVerbs.map(v => (
                <motion.span
                  key={v.verb}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    showResults
                      ? v.correctBucket === 'gerund'
                        ? 'bg-secondary/20 text-secondary border border-secondary/30'
                        : 'bg-error/20 text-error border border-error/30'
                      : 'bg-secondary/20 text-secondary'
                  }`}
                >
                  {v.verb}
                  {showResults && (
                    v.correctBucket === 'gerund'
                      ? <Check size={12} className="inline ml-1" />
                      : <X size={12} className="inline ml-1" />
                  )}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </motion.button>

        {/* Infinitive bucket */}
        <motion.button
          onClick={() => handleBucketClick('infinitive')}
          disabled={!selectedVerb || showResults}
          whileHover={selectedVerb && !showResults ? { scale: 1.02 } : {}}
          whileTap={selectedVerb && !showResults ? { scale: 0.98 } : {}}
          className={`rounded-2xl border-2 border-dashed p-4 min-h-[180px] transition-all ${
            selectedVerb && !showResults
              ? 'border-primary bg-primary/10 cursor-pointer'
              : 'border-primary/30 bg-primary/5'
          }`}
        >
          <div className="text-center mb-3">
            <p className="font-bold text-primary text-sm">INFINITIVE</p>
            <p className="text-xs text-primary/70">to + verb</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence mode="popLayout">
              {infinitiveVerbs.map(v => (
                <motion.span
                  key={v.verb}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    showResults
                      ? v.correctBucket === 'infinitive'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-error/20 text-error border border-error/30'
                      : 'bg-primary/20 text-primary'
                  }`}
                >
                  {v.verb}
                  {showResults && (
                    v.correctBucket === 'infinitive'
                      ? <Check size={12} className="inline ml-1" />
                      : <X size={12} className="inline ml-1" />
                  )}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>

      {/* Unplaced verbs */}
      {unplacedVerbs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-2xl bg-bg-light dark:bg-white/5 border border-border"
        >
          <p className="text-xs text-text-muted text-center mb-3">Tap a verb to select it</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {unplacedVerbs.map(v => (
              <motion.button
                key={v.verb}
                onClick={() => handleVerbClick(v.verb)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedVerb === v.verb
                    ? 'bg-accent text-text ring-2 ring-accent ring-offset-2'
                    : 'bg-white dark:bg-[#162b3d] text-text border border-border hover:border-primary/50'
                }`}
              >
                {v.verb}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results feedback */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center ${
            allCorrect
              ? 'bg-secondary/10 border border-secondary/30'
              : 'bg-accent/10 border border-accent/30'
          }`}
        >
          {allCorrect ? (
            <>
              <p className="font-bold text-secondary text-lg">Perfect! 🎉</p>
              <p className="text-text-muted text-sm">You sorted all verbs correctly!</p>
            </>
          ) : (
            <>
              <p className="font-bold text-text text-lg">{correctCount}/{verbs.length} Correct</p>
              <p className="text-text-muted text-sm">
                {attempts === 1 ? "Some verbs are in the wrong bucket. Try again!" : "Keep trying - you'll get it!"}
              </p>
            </>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showResults && !allPlaced && (
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-3 rounded-xl border border-border text-text-muted hover:text-text hover:border-border-dark transition-colors font-medium"
          >
            Skip for now
          </button>
        )}

        {!showResults && allPlaced && (
          <>
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors"
            >
              <RotateCcw size={18} />
            </button>
            <motion.button
              onClick={handleCheck}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold"
            >
              Check Answers
              <Check size={18} />
            </motion.button>
          </>
        )}

        {showResults && (
          <motion.button
            onClick={handleContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold ${
              allCorrect
                ? 'bg-secondary text-white'
                : 'bg-primary text-white'
            }`}
          >
            {allCorrect ? (
              <>
                Start Challenge
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                Try Again
                <RotateCcw size={18} />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
