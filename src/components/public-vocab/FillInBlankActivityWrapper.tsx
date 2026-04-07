"use client";

import { useMemo, useState } from "react";
import { useVocabProgress } from "@/hooks/useVocabProgress";
import type { VocabTheme } from "@/data/public-level1-vocab";

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

/**
 * Public vocabulary fill-in-the-blank game
 * Students fill in blanks with vocabulary words from the theme
 */
export function FillInBlankActivityWrapper({
  theme,
  unitSlug,
}: FillInBlankActivityWrapperProps) {
  const { completeFillBlank } = useVocabProgress(unitSlug, theme.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Build questions from theme cards (deterministic option order — no Math.random — so SSR matches hydration)
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
            card.term,
            theme.cards,
            card.fillBlankSentence!,
            `${unitSlug}:${theme.id}:${index}:${card.term}`
          ),
        })),
    [theme.cards, theme.id, unitSlug]
  );

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + (selectedAnswer ? 1 : 0)) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return; // Already answered

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    if (isLastQuestion && correct) {
      setIsComplete(true);
      // Save completion
      completeFillBlank(
        Math.round((score + 1) / questions.length * 100)
      );
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsComplete(true);
      completeFillBlank(Math.round(score / questions.length * 100));
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowFeedback(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl">✍️</div>
          <h2 className="mt-4 text-2xl font-bold text-text">No Fill-in-the-Blank Sentences Yet</h2>
          <p className="mt-2 text-text-muted max-w-md">
            Custom fill-in-the-blank sentences are being added. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round(score / questions.length * 100);
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">
            {percentage === 100 ? "🎉" : percentage >= 70 ? "⭐" : "✅"}
          </div>
          <h2 className="text-3xl font-bold text-text mb-2">Complete!</h2>
          <p className="text-2xl font-bold text-[var(--tone-vocabulary-accent-strong)] mb-4">
            {score} / {questions.length} correct
          </p>
          <p className="text-lg text-text-muted mb-6">
            {percentage === 100
              ? "Perfect score! You've mastered these vocabulary words!"
              : percentage >= 70
              ? "Great job! Keep practicing to improve."
              : "Good effort! Review and try again."}
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsCorrect(null);
              setShowFeedback(false);
              setIsComplete(false);
              setScore(0);
            }}
            className="inline-block px-6 py-2 rounded-lg bg-[var(--tone-vocabulary-accent)] text-white font-semibold hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-surface-base)] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-text-muted">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-sm font-semibold text-[var(--tone-vocabulary-accent-strong)]">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="w-full h-2 bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--tone-vocabulary-accent)] to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-[var(--color-border-subtle)] p-6 sm:p-8 shadow-sm mb-6">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--tone-vocabulary-accent-strong)] mb-3">
            Fill in the Blank
          </p>
          <p className="text-lg sm:text-xl text-text leading-relaxed">
            {currentQuestion.sentence.split("_____").map((part, index, arr) => (
              <span key={index}>
                {part}
                {index < arr.length - 1 && (
                  <span className="inline-block px-3 py-1 mx-1 bg-[var(--tone-vocabulary-accent)]/10 border-b-2 border-[var(--tone-vocabulary-accent)] min-w-[120px] text-center font-semibold text-[var(--tone-vocabulary-accent)]">
                    _____
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 ${
              isCorrect
                ? "bg-emerald-50 border-emerald-300"
                : "bg-rose-50 border-rose-300"
            }`}
          >
            <p className={`font-semibold ${isCorrect ? "text-emerald-900" : "text-rose-900"}`}>
              {isCorrect ? "✓ Correct!" : "✗ Try again"}
            </p>
            {!isCorrect && (
              <p className={`text-sm mt-1 ${isCorrect ? "text-emerald-800" : "text-rose-800"}`}>
                The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
              </p>
            )}
          </div>
        )}

        {/* Options */}
        <div className="grid gap-3 mb-6 sm:grid-cols-2">
          {currentQuestion.options.map((option, index) => {
            const label = String.fromCharCode(97 + index); // a, b, c, d
            // Lowercase all options since they come from vocabulary list
            const displayOption = option.toLowerCase();

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === null
                    ? "border-[var(--color-border-subtle)] hover:border-[var(--tone-vocabulary-accent)] hover:bg-[var(--tone-vocabulary-accent)]/5 cursor-pointer"
                    : option === currentQuestion.correctAnswer
                    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                    : option === selectedAnswer && !isCorrect
                    ? "border-rose-300 bg-rose-50 text-rose-950"
                    : "border-[var(--color-border-subtle)] opacity-50 bg-gray-50"
                }`}
              >
                <p className="font-semibold">
                  <span className="inline-block w-6 text-[var(--tone-vocabulary-accent)]">{label}.</span>
                  {displayOption}
                </p>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        {selectedAnswer && (
          <button
            onClick={handleNext}
            className="w-full px-6 py-3 rounded-lg bg-[var(--tone-vocabulary-accent)] text-white font-semibold hover:opacity-90 transition"
          >
            {isLastQuestion ? "See Results" : "Next Question"}
          </button>
        )}

        {/* Score Display */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted">
            Score: <span className="font-bold text-[var(--tone-vocabulary-accent-strong)]">{score}</span> / {questions.length}
          </p>
        </div>
      </div>
    </div>
  );
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
 * Multiple choice options: correct answer + up to 3 incorrect options from other cards.
 * Order is deterministic from `seedKey` so server and client match (no hydration mismatch).
 */
function generateOptions(
  correctAnswer: string,
  allCards: { term: string }[],
  sentence: string,
  seedKey: string
): string[] {
  const options = [correctAnswer];
  const sentenceWords = sentence.toLowerCase().split(/\s+/);

  const pool = allCards
    .filter(
      (c) =>
        c.term !== correctAnswer &&
        !sentenceWords.includes(c.term.toLowerCase())
    )
    .map((c) => c.term);

  const incorrect = shuffleDeterministic(pool, `${seedKey}:pool`).slice(0, 3);
  options.push(...incorrect);

  return shuffleDeterministic(options, `${seedKey}:options`);
}

export default FillInBlankActivityWrapper;
