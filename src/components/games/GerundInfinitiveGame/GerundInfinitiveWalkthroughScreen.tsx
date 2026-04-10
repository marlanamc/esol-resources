'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BookOpen, Play, Sparkles, AlertCircle, Lightbulb,
  CheckCircle2, XCircle, Shuffle, ArrowDown,
} from 'lucide-react';
import type { GerundInfinitiveGroup, GIRoundMode, PatternCategory } from '@/types/gerund-infinitive';

function patternToBullets(pattern: string): string[] {
  return pattern
    .split(/(?<=[.!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 7)) % (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getVocabReminder(group: GerundInfinitiveGroup): { title: string; examples: string; note?: string } | null {
  if (group.id === 'group-1' || group.id === 'group-1b' || group.id === 'group-1d') {
    return {
      title: 'What is a preposition?',
      examples: 'in, at, for, of, about, to, from, with, without, before, after',
      note: 'Prepositions are small words that show relationships (location, time, direction).',
    };
  }
  if (group.id === 'group-1c') {
    return {
      title: 'When is "to" a preposition?',
      examples: 'look forward to, be used to, get used to, committed to',
      note: 'In these phrases, "to" is a preposition (not part of an infinitive), so use gerund!',
    };
  }
  if (group.id === 'group-8a') {
    return {
      title: 'Why is this gerund?',
      examples: 'How about, What about, thought of',
      note: 'These phrases end with a preposition, so the next verb must be -ing.',
    };
  }
  if (group.id === 'group-8b') {
    return {
      title: 'Look at the word before the blank',
      examples: 'for + -ing, to + base verb',
      note: 'The meaning stays the same. The grammar changes because "for" is a preposition and "to" starts an infinitive.',
    };
  }
  return null;
}

// ── Derive corrected form from the error example ─────────────────────────────
// Extracts the base verb from commonError (last word) and converts to gerund/infinitive,
// so the correction badge matches the verb in the error for consistency.
function correctedFormFromError(commonError: string, correctForm: 'gerund' | 'infinitive' | 'both'): string | null {
  const lastWord = commonError.trim().split(/\s+/).pop()?.replace(/[?.!,]$/, '') ?? '';
  if (!lastWord || lastWord.endsWith('ing')) return null; // already a gerund in the error — don't double-convert

  if (correctForm === 'gerund') {
    if (lastWord.endsWith('ie')) return lastWord.slice(0, -2) + 'ying';   // die→dying
    if (/e$/.test(lastWord) && !/[eo]e$/.test(lastWord)) return lastWord.slice(0, -1) + 'ing'; // take→taking
    return lastWord + 'ing';
  }
  if (correctForm === 'infinitive') {
    return `to ${lastWord}`;
  }
  return null;
}

// ── Formula chain ─────────────────────────────────────────────────────────────

type FormulaKind = 'subject' | 'trigger' | 'form-gerund' | 'form-inf' | 'form-both' | 'sep' | 'note';
interface FormulaToken { text: string; kind: FormulaKind }

function buildFormula(group: GerundInfinitiveGroup): FormulaToken[] {
  const category: PatternCategory = group.patterns[0]?.category ?? 'verb-gerund';
  const hasBoth = group.patterns.every(p => p.correctForm === 'both');
  const dominantForm = group.patterns.find(p => p.correctForm !== 'both')?.correctForm ?? 'gerund';

  const plus: FormulaToken = { text: '+', kind: 'sep' };
  const subject: FormulaToken = { text: 'SUBJECT', kind: 'subject' };
  const formGerund: FormulaToken = { text: 'VERB + -ING', kind: 'form-gerund' };
  const formInf: FormulaToken = { text: 'TO + VERB', kind: 'form-inf' };
  const formBoth: FormulaToken = { text: 'VERB + -ING  or  TO + VERB', kind: 'form-both' };
  const form = hasBoth ? formBoth : dominantForm === 'gerund' ? formGerund : formInf;

  switch (category) {
    case 'preposition':
    case 'to-preposition':
    case 'preposition-choice':
      return [subject, plus, { text: 'PREPOSITION', kind: 'trigger' }, plus, formGerund];
    case 'verb-gerund':
      return [subject, plus, { text: 'VERB', kind: 'trigger' }, plus, formGerund];
    case 'verb-infinitive':
      return [subject, plus, { text: 'VERB', kind: 'trigger' }, plus, formInf];
    case 'both-ok':
      return [subject, plus, { text: 'VERB', kind: 'trigger' }, plus, formBoth];
    case 'meaning-change':
      return [subject, plus, { text: 'VERB', kind: 'trigger' }, plus, formBoth, { text: '(meaning changes!)', kind: 'note' }];
    case 'adjective':
      return [subject, plus, { text: 'BE + ADJECTIVE', kind: 'trigger' }, plus, formInf];
    case 'noun':
      return [{ text: 'NOUN', kind: 'trigger' }, plus, formInf];
    case 'go-activity':
      return [subject, plus, { text: 'GO', kind: 'trigger' }, plus, formGerund];
    case 'subject':
      return [formGerund, { text: '=', kind: 'sep' }, { text: 'SUBJECT of sentence', kind: 'trigger' }];
    case 'purpose':
      return [subject, plus, { text: 'VERB', kind: 'trigger' }, plus, formInf, { text: '(= why?)', kind: 'note' }];
    case 'suggestion':
      return [{ text: 'SUGGESTION PHRASE', kind: 'trigger' }, plus, formGerund];
    case 'purpose-contrast':
      return [subject, plus, { text: 'USE [X] FOR', kind: 'trigger' }, plus, formGerund, { text: 'or', kind: 'sep' }, { text: 'USE [X] TO', kind: 'trigger' }, plus, formInf];
    default:
      return [{ text: 'TRIGGER', kind: 'trigger' }, plus, form];
  }
}

function FormulaChain({ group }: { group: GerundInfinitiveGroup }) {
  const tokens = useMemo(() => buildFormula(group), [group]);

  const tokenClass: Record<FormulaKind, string> = {
    subject:    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
    trigger:    'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700',
    'form-gerund': 'bg-secondary/15 text-secondary border border-secondary/40',
    'form-inf': 'bg-primary/10 text-primary border border-primary/30',
    'form-both':'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-700',
    sep:   '',
    note:  '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-bg to-border/10 border-2 border-border shadow-sm"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Pattern formula</p>
      <div className="flex flex-wrap items-center gap-2">
        {tokens.map((token, i) => {
          if (token.kind === 'sep') {
            return (
              <span key={i} className="text-text-muted font-bold text-base px-1">{token.text}</span>
            );
          }
          if (token.kind === 'note') {
            return (
              <span key={i} className="text-xs text-text-muted italic">{token.text}</span>
            );
          }
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 260, damping: 18 }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm tracking-wide ${tokenClass[token.kind]}`}
            >
              {token.text}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Annotated pattern example ─────────────────────────────────────────────────

function PatternExampleDiagram({ group }: { group: GerundInfinitiveGroup }) {
  const representativePattern = group.patterns.find((pattern) => pattern.examples.length > 0);
  const representativeExample = representativePattern?.examples[0];
  const labelForm = representativePattern?.correctForm ?? 'gerund';

  if (!group.patternExample && !representativeExample) return null;

  const renderedExample = representativeExample
    ? representativeExample.sentence.includes('___')
      ? (
        <>
          {representativeExample.sentence.split('___')[0]}
          <span className={`px-2 py-0.5 rounded-lg border ${
            labelForm === 'gerund'
              ? 'bg-secondary/15 text-secondary border-secondary/40'
              : labelForm === 'infinitive'
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-accent/10 text-amber-700 dark:text-amber-300 border-accent/30'
          }`}>
            {representativeExample.blank}
          </span>
          {representativeExample.sentence.split('___')[1]}
        </>
      )
      : representativeExample.sentence
    : group.patternExample;

  const formLabel = labelForm === 'gerund'
    ? 'gerund'
    : labelForm === 'infinitive'
      ? 'infinitive'
      : 'both';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-5 rounded-2xl bg-white dark:bg-[#162b3d] border-2 border-border shadow-sm"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Example</p>
      <div className="space-y-4">
        <p className="text-xl font-semibold text-text leading-relaxed">
          {renderedExample}
        </p>

        {representativePattern && (
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-700">
              trigger: {representativePattern.trigger}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              labelForm === 'gerund'
                ? 'bg-secondary/10 text-secondary border-secondary/30'
                : labelForm === 'infinitive'
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-accent/10 text-amber-700 dark:text-amber-300 border-accent/30'
            }`}>
              {formLabel}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Checkpoint question helpers ───────────────────────────────────────────────

const GERUND_LABEL = 'Gerund (verb + -ing)';
const INFINITIVE_LABEL = 'Infinitive (to + verb)';

interface GICheckpointQuestion {
  questionText: string;
  sentenceDisplay: string;
  blank: string;
  options: string[];
  correctIndex: number;
  feedbackCorrect: string;
  feedbackWrong: string;
}

// Ambiguous triggers that shouldn't appear in walkthrough questions
const AMBIGUOUS_TRIGGERS_SET = new Set(['love', 'like', 'hate', 'start', 'begin', 'continue', 'prefer']);

function buildCheckpointQuestion(
  group: GerundInfinitiveGroup,
  patternIndex: number,
  seed: number,
): GICheckpointQuestion | null {
  const definitivePatterns = group.patterns.filter(p => {
    if (p.correctForm === 'both') return false;
    // Exclude ambiguous verbs that can take either form
    const triggerLower = p.trigger.toLowerCase();
    if (AMBIGUOUS_TRIGGERS_SET.has(triggerLower)) return false;
    if ([...AMBIGUOUS_TRIGGERS_SET].some(v => triggerLower.includes(v))) return false;
    return true;
  });
  if (definitivePatterns.length === 0) return null;

  const pattern = definitivePatterns[patternIndex % definitivePatterns.length];
  // Use a different example for each step to avoid repetition
  const exampleOffset = Math.floor(patternIndex / definitivePatterns.length);
  const exampleIndex = exampleOffset % Math.max(1, pattern.examples.length);
  const example = pattern.examples[exampleIndex];
  if (!example) return null;

  const correctLabel = pattern.correctForm === 'gerund' ? GERUND_LABEL : INFINITIVE_LABEL;
  const wrongLabel = pattern.correctForm === 'gerund' ? INFINITIVE_LABEL : GERUND_LABEL;
  const options = seededShuffle([correctLabel, wrongLabel], seed);
  const correctIndex = options.indexOf(correctLabel);
  const formName = pattern.correctForm === 'gerund' ? 'gerund' : 'infinitive';

  return {
    questionText: 'What form goes in the blank?',
    sentenceDisplay: example.sentence,
    blank: example.blank,
    options,
    correctIndex,
    feedbackCorrect: `Correct! After "${pattern.trigger}", use the ${formName}.`,
    feedbackWrong: `Not quite. After "${pattern.trigger}", use the ${formName} (${correctLabel}).`,
  };
}

// ── Main component ─────────────────────────────────────────────────────────────

interface GerundInfinitiveWalkthroughScreenProps {
  group: GerundInfinitiveGroup;
  roundMode: GIRoundMode;
  onStartChallenge: () => void;
  onBack: () => void;
}

interface WalkthroughStep {
  id: string;
  label: string;
  patternIndex: number;
  hasQuestion: boolean;
}

export function GerundInfinitiveWalkthroughScreen({
  group,
  onStartChallenge,
  onBack,
}: GerundInfinitiveWalkthroughScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});

  const displayExamples = useMemo(() => group.patterns
    .filter(p => p.examples.length > 0)
    .slice(0, 5)
    .map(p => ({
      ...p.examples[0],
      trigger: p.trigger,
      correctForm: p.correctForm,
    })), [group]);

  const mistakePatterns = useMemo(() => group.patterns.filter(p => p.commonError), [group]);

  const hasDefinitivePatterns = group.patterns.some(p => p.correctForm !== 'both');
  const hasMistakes = mistakePatterns.length > 0;
  const vocabReminder = useMemo(() => getVocabReminder(group), [group]);

  const steps: WalkthroughStep[] = useMemo(() => {
    let idx = 0;
    const list: WalkthroughStep[] = [
      { id: 'intro', label: "What we're learning", patternIndex: idx++, hasQuestion: hasDefinitivePatterns },
    ];
    if (vocabReminder) {
      list.push({ id: 'vocab', label: 'The vocabulary', patternIndex: idx++, hasQuestion: hasDefinitivePatterns });
    }
    list.push({ id: 'rules', label: 'The rules', patternIndex: idx++, hasQuestion: hasDefinitivePatterns });
    if (displayExamples.length > 0) {
      list.push({ id: 'examples', label: 'In action', patternIndex: idx++, hasQuestion: hasDefinitivePatterns });
    }
    if (hasMistakes) {
      list.push({ id: 'mistakes', label: 'Watch out', patternIndex: idx++, hasQuestion: hasDefinitivePatterns });
    }
    list.push({ id: 'ready', label: "You're ready!", patternIndex: 0, hasQuestion: false });
    return list;
  }, [hasDefinitivePatterns, vocabReminder, displayExamples.length, hasMistakes]);

  const questions = useMemo(() =>
    steps.map((s, i) =>
      s.hasQuestion ? buildCheckpointQuestion(group, s.patternIndex, i * 31 + group.id.charCodeAt(0)) : null
    ),
    [steps, group]
  );

  const step = steps[currentStep];
  const question = questions[currentStep];
  const selectedAnswer = answers[currentStep] ?? null;
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && question !== null && selectedAnswer === question.correctIndex;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const canAdvance = !step.hasQuestion || isAnswered;

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    if (isLast) { onStartChallenge(); } else { setDirection(1); setCurrentStep(s => s + 1); }
  }, [canAdvance, isLast, onStartChallenge]);

  const goPrev = useCallback(() => {
    if (isFirst) { onBack(); } else { setDirection(-1); setCurrentStep(s => s - 1); }
  }, [isFirst, onBack]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return;
    setAnswers(prev => ({ ...prev, [currentStep]: optionIndex }));
  }, [isAnswered, currentStep]);

  const eyebrow = isLast ? 'Last step' : `Step ${currentStep + 1} of ${steps.length}`;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 36 : -36 }),
    center: { opacity: 1, x: 0 },
    exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -36 : 36 }),
  };

  return (
    <div className="max-w-2xl mx-auto pb-28 sm:pb-8">
      {/* Progress dots */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`rounded-full transition-all duration-300 ${
              i < currentStep ? 'w-2 h-2 bg-primary/60' :
              i === currentStep ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-border'
            }`}
          />
        ))}
      </motion.div>

      {/* Group badge + eyebrow */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-3">
        <span className="text-xl">{group.icon ?? '📚'}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{group.title}</span>
        <span className="ml-auto text-xs font-medium text-text-muted">{eyebrow}</span>
      </motion.div>

      {/* Step heading */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.h2
          key={`heading-${step.id}`}
          custom={direction}
          variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="font-display text-2xl sm:text-3xl text-text mb-5 leading-tight"
        >
          {step.label}
        </motion.h2>
      </AnimatePresence>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step.id}
          custom={direction}
          variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-5"
        >

          {/* ── Step: intro ──────────────────────────────── */}
          {step.id === 'intro' && (
            <>
              {/* Memory trick / topic */}
              {group.memoryTrick ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-accent/20 to-amber-100/30 dark:from-accent/15 dark:to-amber-900/20 border-2 border-accent/40"
                >
                  <div className="absolute top-2 right-3 text-5xl opacity-10 select-none">{group.icon}</div>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="flex-shrink-0" />
                    Quick rule
                  </p>
                  <p className="text-lg font-bold text-text leading-relaxed">{group.memoryTrick}</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/20"
                >
                  <div className="absolute top-2 right-3 text-5xl opacity-10 select-none">{group.icon}</div>
                  <p className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="flex-shrink-0" />
                    Today&apos;s topic
                  </p>
                  <p className="text-lg font-bold text-text leading-relaxed">{group.title}</p>
                </motion.div>
              )}

              {/* Formula chain */}
              <FormulaChain group={group} />

              {/* Annotated example */}
              <PatternExampleDiagram group={group} />

              <p className="text-sm text-text-muted leading-relaxed">
                Use the pattern and example to answer the quick check.
              </p>
            </>
          )}

          {/* ── Step: vocab ──────────────────────────────── */}
          {step.id === 'vocab' && vocabReminder && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden border border-sky-200 dark:border-sky-800 shadow-sm"
              >
                <div className="bg-sky-500 px-5 py-3 flex items-center gap-2">
                  <Lightbulb size={16} className="text-white flex-shrink-0" />
                  <p className="text-sm font-bold text-white">{vocabReminder.title}</p>
                </div>
                <div className="p-5 bg-sky-50 dark:bg-sky-900/25 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {vocabReminder.examples.split(/,\s*/).slice(0, 10).map((ex, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04, type: 'spring', stiffness: 280, damping: 16 }}
                        className="px-3 py-1 rounded-full bg-white dark:bg-sky-800/60 text-sky-800 dark:text-sky-200 text-sm font-semibold border border-sky-200 dark:border-sky-700 shadow-sm"
                      >
                        {ex.trim()}
                      </motion.span>
                    ))}
                  </div>
                  {vocabReminder.note && (
                    <p className="text-sm text-sky-700 dark:text-sky-300 leading-relaxed border-t border-sky-200 dark:border-sky-700 pt-3">
                      {vocabReminder.note}
                    </p>
                  )}
                </div>
              </motion.div>

              <p className="text-sm text-text-muted leading-relaxed">
                These are the phrases that matter in this level.
              </p>
            </div>
          )}

          {/* ── Step: rules ──────────────────────────────── */}
          {step.id === 'rules' && (
            <div className="space-y-4">
              {/* Formula at top */}
              <FormulaChain group={group} />

              {/* Rule bullets */}
              <div className={`p-6 rounded-3xl border-2 border-dashed shadow-sm relative overflow-hidden dark:bg-[#1a2435] dark:border-white/20 ${group.colorClass}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 select-none">
                  <span className="text-7xl">{group.icon}</span>
                </div>
                <div className="relative z-10 space-y-4">
                  {patternToBullets(group.pattern).map((bullet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex gap-4 p-4 rounded-2xl bg-white/80 dark:bg-white/10 shadow-sm border border-black/5 dark:border-white/10"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
                        {i + 1}
                      </div>
                      <p className="text-base text-text font-medium leading-relaxed pt-0.5">{bullet}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Annotated example */}
              <PatternExampleDiagram group={group} />
            </div>
          )}

          {/* ── Step: examples ───────────────────────────── */}
          {step.id === 'examples' && (
            <div className="space-y-3">
              {/* Form legend */}
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-1">Key:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold border-2 bg-secondary/10 text-secondary border-secondary/40">
                  -ing = Gerund
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold border-2 bg-primary/10 text-primary border-primary/30">
                  to + = Infinitive
                </span>
              </div>

              <div className="space-y-2">
                {displayExamples.map((ex, i) => {
                  const isGerund = ex.correctForm === 'gerund';
                  const isInfinitive = ex.correctForm === 'infinitive';
                  const borderColor = isGerund ? 'border-l-secondary' : isInfinitive ? 'border-l-primary' : 'border-l-accent';
                  const badgeClass = isGerund
                    ? 'bg-secondary/10 text-secondary border-secondary/30'
                    : isInfinitive
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-accent/10 text-amber-700 dark:text-amber-300 border-accent/30';

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
                      className={`flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#162b3d] border border-border border-l-4 ${borderColor} shadow-sm`}
                    >
                      <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                        {/* Trigger badge */}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black border bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700 whitespace-nowrap">
                          {ex.trigger}
                        </span>
                        {/* Form badge */}
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeClass}`}>
                          {isGerund ? '-ing' : isInfinitive ? 'to +' : 'both'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-text text-sm leading-relaxed">
                          {ex.sentence.includes('___') ? (
                            <>
                              {ex.sentence.split('___')[0]}
                              <span className={`font-bold px-1.5 py-0.5 rounded ${
                                isGerund ? 'text-secondary bg-secondary/15' : 'text-primary bg-primary/15'
                              }`}>
                                {ex.blank}
                              </span>
                              {ex.sentence.split('___')[1]}
                            </>
                          ) : ex.sentence}
                        </p>
                        {ex.context && (
                          <p className="text-xs text-text-muted mt-1 italic">{ex.context}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step: mistakes ───────────────────────────── */}
          {step.id === 'mistakes' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <AlertCircle size={16} className="text-error flex-shrink-0" />
                <p className="text-sm font-bold text-error">Watch these errors</p>
              </div>

              <div className="space-y-4">
                {mistakePatterns.slice(0, 4).map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-border shadow-sm"
                  >
                    {/* Wrong */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-error/5 border-b border-error/15">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center text-xs font-bold mt-0.5">✗</span>
                      <p className="text-sm text-error/90 font-medium">{p.commonError}</p>
                    </div>
                    {/* Arrow */}
                    <div className="flex justify-center py-1 bg-bg-light dark:bg-white/5">
                      <ArrowDown size={14} className="text-text-muted" />
                    </div>
                    {/* Correct */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-secondary/5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                      <p className="text-sm text-secondary font-semibold">
                        {p.trigger}
                        {' '}
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ml-1 ${
                          p.correctForm === 'gerund'
                            ? 'bg-secondary/10 text-secondary border-secondary/30'
                            : 'bg-primary/10 text-primary border-primary/30'
                        }`}>
                          {(p.commonError ? correctedFormFromError(p.commonError, p.correctForm) : null) ?? p.examples[0]?.blank ?? (p.correctForm === 'gerund' ? 'verb + -ing' : 'to + verb')}
                        </span>
                        {p.errorExplanation && (
                          <span className="block text-xs font-normal text-text-muted mt-1">{p.errorExplanation}</span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-text-muted leading-relaxed px-1">
                Spotting the mistake before you make it is half the battle.
              </p>
            </div>
          )}

          {/* ── Step: ready ──────────────────────────────── */}
          {step.id === 'ready' && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden border border-border shadow-sm"
              >
                <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-4">
                  <p className="text-white font-bold text-base">What happens next</p>
                  <p className="text-white/70 text-xs mt-0.5">Keep the rule in mind while you answer</p>
                </div>
                <div className="divide-y divide-border bg-white dark:bg-[#162b3d]">
                  <div className="flex items-start gap-4 px-5 py-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                      <Shuffle size={18} />
                    </span>
                    <div>
                      <p className="font-bold text-text text-sm">Warm-up</p>
                      <p className="text-xs text-text-muted mt-0.5">Sort the verbs before the main round.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 px-5 py-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/15 text-primary font-bold flex items-center justify-center text-base">1</span>
                    <div>
                      <p className="font-bold text-text text-sm">Round 1</p>
                      <p className="text-xs text-text-muted mt-0.5">Score <strong>80%+</strong> to unlock Round 2.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 px-5 py-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-secondary/15 text-secondary font-bold flex items-center justify-center text-base">2</span>
                    <div>
                      <p className="font-bold text-text text-sm">Round 2</p>
                      <p className="text-xs text-text-muted mt-0.5">Score <strong>90%+</strong> to earn mastery.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <p className="text-sm text-text-muted leading-relaxed px-1">
                You have the rule, the model, and the warning. Start the round when you are ready.
              </p>
            </div>
          )}

          {/* ── Checkpoint question ──────────────────────── */}
          {question && (
            <GICheckpointQuestionCard
              question={question}
              selectedAnswer={selectedAnswer}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              onAnswer={handleAnswer}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Desktop nav */}
      <div className="hidden sm:flex gap-3 pt-8">
        <button
          type="button"
          onClick={goPrev}
          className="flex-none flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors font-semibold"
        >
          <ArrowLeft size={18} />
          {isFirst ? 'Back' : 'Previous'}
        </button>
        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canAdvance}
          whileHover={canAdvance ? { scale: 1.02 } : {}}
          whileTap={canAdvance ? { scale: 0.98 } : {}}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
            canAdvance ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          {isLast ? <><Play size={18} />Start Challenge</> : <>Next<ArrowRight size={18} /></>}
        </motion.button>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-bg/95 backdrop-blur-md border-t border-border pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={goPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors font-semibold min-h-[48px]"
        >
          <ArrowLeft size={20} />
          {isFirst ? 'Back' : 'Prev'}
        </button>
        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canAdvance}
          whileHover={canAdvance ? { scale: 1.02 } : {}}
          whileTap={canAdvance ? { scale: 0.98 } : {}}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors min-h-[48px] flex-1 ${
            canAdvance ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          {isLast ? <><Play size={20} />Start Challenge</> : <>Next<ArrowRight size={20} /></>}
        </motion.button>
      </div>
    </div>
  );
}

// ── Checkpoint question card ──────────────────────────────────────────────────

interface GICheckpointQuestionCardProps {
  question: GICheckpointQuestion;
  selectedAnswer: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
  onAnswer: (index: number) => void;
}

function GICheckpointQuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onAnswer,
}: GICheckpointQuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 p-5 sm:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900/50 space-y-5 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-indigo-100 dark:border-indigo-900/30 pb-3 mb-1">
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 flex items-center justify-center font-bold text-xs">?</span>
          <h3 className="font-display font-semibold text-text text-lg">Your turn</h3>
        </div>
        <p className="text-xs text-text-muted sm:ml-auto">Quick check to continue</p>
      </div>

      <div className="space-y-3">
        {question.sentenceDisplay && (
          <p className="text-lg text-text leading-relaxed font-medium">
            {question.sentenceDisplay.includes('___') ? (
              <>
                {question.sentenceDisplay.split('___')[0]}
                {isAnswered ? (
                  <span className="font-bold px-1.5 py-0.5 rounded mx-0.5 bg-secondary/20 text-secondary">
                    {question.blank}
                  </span>
                ) : (
                  <span className="font-bold px-1.5 py-0.5 rounded mx-0.5 bg-accent/30 text-amber-800 dark:text-amber-200">
                    ___
                  </span>
                )}
                {question.sentenceDisplay.split('___')[1]}
              </>
            ) : question.sentenceDisplay}
          </p>
        )}
        <p className="text-sm font-semibold text-text-muted">{question.questionText}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isThisCorrect = i === question.correctIndex;
          let buttonClass = 'border-2 border-border bg-white dark:bg-[#162b3d] text-text hover:border-primary/50 hover:bg-primary/5 shadow-sm font-medium';
          if (isAnswered) {
            if (isThisCorrect) buttonClass = 'border-2 border-secondary bg-secondary/10 text-secondary font-bold shadow-none';
            else if (isSelected) buttonClass = 'border-2 border-error bg-error/10 text-error font-bold shadow-none';
            else buttonClass = 'border-2 border-border bg-surface text-text-muted opacity-50 shadow-none';
          } else if (isSelected) {
            buttonClass = 'border-2 border-primary bg-primary/10 text-primary font-bold shadow-none';
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => onAnswer(i)}
              disabled={isAnswered}
              className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 ${buttonClass}`}
            >
              {isAnswered && isThisCorrect && <CheckCircle2 size={16} className="flex-shrink-0" />}
              {isAnswered && isSelected && !isThisCorrect && <XCircle size={16} className="flex-shrink-0" />}
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
              isCorrect ? 'bg-secondary/10 border border-secondary/30 text-secondary' : 'bg-error/8 border border-error/20 text-error/90'
            }`}
          >
            {isCorrect ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" /> : <XCircle size={16} className="flex-shrink-0 mt-0.5" />}
            <span>{isCorrect ? question.feedbackCorrect : question.feedbackWrong}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isAnswered && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-text-muted text-center">
            Answer to continue
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
