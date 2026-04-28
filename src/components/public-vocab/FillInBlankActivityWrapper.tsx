"use client";

import { useMemo, useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import type { VocabTheme } from "@/data/public-level1-vocab";
import {
  AudioButton,
  GlassCard,
  PrimaryActionButton,
  ProgressBar,
} from "./level1-ui";

interface FillInBlankActivityWrapperProps {
  theme: VocabTheme;
  unitSlug: string;
}

interface Question {
  id: number;
  term: string;
  sentence: string;
  correctAnswer: string;
  options: string[];
}

const QUIZ_ACCENT = "#3b82c4";

/**
 * "Quiz" — pick the correct word. One question at a time, big stacked
 * answer buttons, big feedback card with audio of the correct word.
 */
export function FillInBlankActivityWrapper({
  theme,
  unitSlug,
}: FillInBlankActivityWrapperProps) {
  const { completeFillBlank } = useVocabProgress(unitSlug, theme.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const questions: Question[] = useMemo(
    () =>
      theme.cards
        .filter((card) => card.fillBlankSentence)
        .map((card, index) => ({
          id: index,
          term: card.term,
          sentence: card.fillBlankSentence!,
          correctAnswer: card.term,
          options: generateOptions(
            card,
            theme.cards,
            card.fillBlankSentence!,
            `${unitSlug}:${theme.id}:${index}:${card.term}`
          ),
        })),
    [theme.cards, theme.id, unitSlug]
  );

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCorrect = selectedAnswer
    ? selectedAnswer === currentQuestion?.correctAnswer
    : null;

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || !currentQuestion) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalScore =
        selectedAnswer === currentQuestion?.correctAnswer ? score : score;
      setIsComplete(true);
      completeFillBlank(Math.round((finalScore / questions.length) * 100));
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsComplete(false);
  };

  if (questions.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-5xl" aria-hidden>
          ✍️
        </div>
        <h2 className="font-display mt-3 text-2xl font-bold text-slate-900">
          No quiz yet
        </h2>
        <p className="mt-2 text-base text-slate-600">
          Quiz sentences are being added for this topic. Check back soon!
        </p>
      </GlassCard>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const emoji = percentage === 100 ? "🎉" : percentage >= 70 ? "⭐" : "✅";
    return (
      <div className="space-y-4">
        <GlassCard raised className="p-6 text-center sm:p-8">
          <div className="text-6xl" aria-hidden>
            {emoji}
          </div>
          <h2 className="font-display mt-3 text-3xl font-bold text-slate-900">
            All done!
          </h2>
          <p
            className="mt-2 text-2xl font-bold tabular-nums"
            style={{ color: QUIZ_ACCENT }}
          >
            {score} of {questions.length} correct
          </p>
          <p className="mx-auto mt-3 max-w-sm text-base text-slate-600">
            {percentage === 100
              ? "Perfect score! You know these words!"
              : percentage >= 70
                ? "Great job! Keep practicing."
                : "Good effort! Review and try again."}
          </p>
          <div className="mt-6 flex justify-center">
            <PrimaryActionButton onClick={handleRestart}>
              <RotateCcw size={18} aria-hidden /> Try Again
            </PrimaryActionButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const answered = selectedAnswer !== null;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="tabular-nums" style={{ color: QUIZ_ACCENT }}>
          Score {score} / {questions.length}
        </span>
      </div>
      <ProgressBar
        value={(currentIndex + (answered ? 1 : 0)) / questions.length}
        accent={QUIZ_ACCENT}
      />

      {/* Question card */}
      <GlassCard
        raised
        className="p-5 sm:p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,196,0.08), rgba(255,255,255,0.85))",
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.16em]"
          style={{ color: "#1f5a8c" }}
        >
          Pick the correct word
        </p>
        <p className="mt-3 text-xl leading-relaxed text-slate-900 sm:text-2xl">
          {currentQuestion.sentence.split("_____").map((part, index, arr) => (
            <span key={index}>
              {part}
              {index < arr.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mx-1 inline-block min-w-[100px] rounded-md border-b-2 align-[-0.2em] sm:min-w-[120px]"
                  style={{
                    borderColor: QUIZ_ACCENT,
                    backgroundColor: "rgba(59,130,196,0.10)",
                    height: "1.5em",
                  }}
                >
                  &nbsp;
                </span>
              )}
            </span>
          ))}
        </p>
      </GlassCard>

      {/* Options — stacked on mobile, 2-col from sm */}
      <div className="grid gap-3 sm:grid-cols-2">
        {currentQuestion.options.map((option) => {
          const correct = option === currentQuestion.correctAnswer;
          const active = selectedAnswer === option;
          const display = formatOptionLabel(option);

          let stateClass =
            "bg-white/80 backdrop-blur border border-white/80 text-slate-900 hover:bg-white hover:-translate-y-0.5";
          if (answered) {
            if (correct) {
              stateClass =
                "bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-300";
            } else if (active) {
              stateClass = "bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-300";
            } else {
              stateClass = "bg-white/60 border-white/60 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleAnswerSelect(option)}
              disabled={answered}
              aria-pressed={active}
              className={`relative flex min-h-[56px] items-center justify-between rounded-2xl px-5 text-left text-lg font-semibold shadow-[0_4px_12px_-6px_rgba(20,60,70,0.18)] transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 disabled:cursor-not-allowed ${stateClass}`}
            >
              <span>{display}</span>
              {answered && correct ? (
                <Check size={20} strokeWidth={3} className="text-emerald-600" />
              ) : answered && active && !correct ? (
                <X size={20} strokeWidth={3} className="text-rose-600" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Feedback card */}
      {answered ? (
        <GlassCard
          raised
          className="p-5 text-center"
          style={{
            background: isCorrect
              ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(255,255,255,0.85))"
              : "linear-gradient(135deg, rgba(244,63,94,0.10), rgba(255,255,255,0.85))",
          }}
        >
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md"
            style={{ background: isCorrect ? "#10b981" : "#f43f5e" }}
            aria-hidden
          >
            {isCorrect ? (
              <Check size={32} strokeWidth={3} />
            ) : (
              <X size={32} strokeWidth={3} />
            )}
          </div>
          <p className="font-display mt-3 text-2xl font-bold text-slate-900">
            {isCorrect ? "Correct!" : "Try again"}
          </p>
          <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-slate-800">
            {currentQuestion.sentence
              .split("_____")
              .map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 ? (
                    <strong
                      className="font-bold underline decoration-2 underline-offset-4"
                      style={{ color: isCorrect ? "#0a6b62" : "#9f1239" }}
                    >
                      {formatOptionLabel(currentQuestion.correctAnswer)}
                    </strong>
                  ) : null}
                </span>
              ))}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-base font-bold text-slate-900">
            <span>{currentQuestion.correctAnswer}</span>
            <AudioButton term={currentQuestion.correctAnswer} size="sm" />
          </div>
          <div className="mt-5">
            <PrimaryActionButton onClick={handleNext} showArrow={!isLastQuestion}>
              {isLastQuestion ? "See Results" : "Next Question"}
            </PrimaryActionButton>
          </div>
        </GlassCard>
      ) : null}
    </div>
  );
}

const PROPER_NOUN_OPTIONS = new Set([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);

function formatOptionLabel(option: string): string {
  return PROPER_NOUN_OPTIONS.has(option) ? option : option.toLowerCase();
}

function hashStringToSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleDeterministic<T>(arr: T[], seedStr: string): T[] {
  const rand = mulberry32(hashStringToSeed(seedStr));
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build 4 options: the correct answer plus 3 distractors.
 *
 * Distractor selection prefers cards from a *different* category than the
 * answer, so semantically swappable words (Man/Woman, Morning/Afternoon)
 * don't end up as alternate "correct" choices in the same frame sentence.
 * Falls back to same-category cards only if cross-category candidates run
 * out — better a slightly confusable option than fewer than 4 buttons.
 */
function generateOptions(
  answer: { term: string; category: string },
  allCards: { term: string; category: string }[],
  sentence: string,
  seedKey: string
): string[] {
  const sentenceWords = sentence.toLowerCase().split(/\s+/);

  const candidates = allCards.filter(
    (c) => c.term !== answer.term && !sentenceWords.includes(c.term.toLowerCase())
  );

  const crossCategory = candidates.filter((c) => c.category !== answer.category);
  const sameCategory = candidates.filter((c) => c.category === answer.category);

  const ordered = [
    ...shuffleDeterministic(crossCategory, `${seedKey}:cross`),
    ...shuffleDeterministic(sameCategory, `${seedKey}:same`),
  ].map((c) => c.term);

  const options = [answer.term, ...ordered.slice(0, 3)];
  return shuffleDeterministic(options, `${seedKey}:options`);
}

export default FillInBlankActivityWrapper;
