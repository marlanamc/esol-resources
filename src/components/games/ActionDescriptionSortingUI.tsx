"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { ContextualBackButton } from "@/components/navigation/ContextualBackButton";
import { PointsToast } from "@/components/ui/PointsToast";
import {
  type ActionDescriptionCard,
  type GameState,
  parseActionDescriptionRounds,
  deriveShuffleSeed,
  deterministicShuffle,
} from "./matching-game-parse";
import { InteractionMode } from "./matching-game-shared";

type SortCategory = "action" | "description";

/** How long the finished sentence stays up before the game moves on by itself. */
const REVEAL_AUTO_ADVANCE_MS = 2600;

const CATEGORY_LABELS: Record<SortCategory, string> = {
  action: "Action — use a verb",
  description: "Description — use am / is / are",
};

/**
 * Renders a sentence where `*...*` marks the verb or BE form, so the learner can
 * see at a glance which word the sort was really about.
 */
function renderSentence(sentence: string) {
  return sentence.split("*").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="underline decoration-2 underline-offset-2">
        {part}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

export function ActionDescriptionSortingUI({
  contentStr,
  activityId,
  assignmentId,
  vocabType,
}: {
  contentStr: string;
  activityId?: string;
  assignmentId?: string | null;
  vocabType?: string;
}) {
  const rounds = useMemo(() => parseActionDescriptionRounds(contentStr), [contentStr]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const currentRound = rounds[currentRoundIndex];
  const shuffleSeed = useMemo(
    () => deriveShuffleSeed(currentRound?.roundNumber ?? 0, activityId),
    [currentRound?.roundNumber, activityId]
  );
  const shuffledWords = useMemo(
    () => deterministicShuffle(currentRound?.words || [], shuffleSeed),
    [currentRound, shuffleSeed]
  );
  const totalWordsAcrossRounds = useMemo(
    () => rounds.reduce((sum, round) => sum + round.words.length, 0),
    [rounds]
  );
  const completedWordsBeforeCurrentRound = useMemo(() => {
    return rounds
      .slice(0, currentRoundIndex)
      .reduce((sum, round) => sum + round.words.length, 0);
  }, [currentRoundIndex, rounds]);

  const [gameState, setGameState] = useState<GameState>({
    currentWordIndex: 0,
    correctCount: 0,
    incorrectAttempts: 0,
    completedWords: new Set(),
    showExplanation: false,
    explanationText: "",
    isAutoAdvancing: false,
    bounceWord: false,
  });

  const overallCompletedWords = completedWordsBeforeCurrentRound + gameState.completedWords.size;
  const overallProgressPercent =
    totalWordsAcrossRounds > 0
      ? Math.round((overallCompletedWords / totalWordsAcrossRounds) * 100)
      : 0;
  const completedRoundCategoriesRef = useRef(new Set<number>());

  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    InteractionMode.Idle
  );
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [dropZoneFeedback, setDropZoneFeedback] = useState<{
    category: SortCategory;
    isCorrect: boolean;
  } | null>(null);
  /** The finished sentence shown after a correct sort. */
  const [reveal, setReveal] = useState<ActionDescriptionCard | null>(null);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
  const dropZoneFeedbackTimeoutRef = useRef<number | null>(null);
  const explanationAutoDismissTimeoutRef = useRef<number | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);

  const progress =
    shuffledWords.length > 0
      ? Math.round((gameState.completedWords.size / shuffledWords.length) * 100)
      : 0;

  const currentWord = shuffledWords[gameState.currentWordIndex];

  // Inject animations and styles
  useEffect(() => {
    const styleId = "action-description-game-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
            @keyframes bounce-back {
                0% { transform: translateY(0) scale(1); }
                25% { transform: translateY(-20px) scale(1.1); }
                50% { transform: translateY(0) scale(1); }
                75% { transform: translateY(-10px) scale(1.05); }
                100% { transform: translateY(0) scale(1); }
            }

            @keyframes success-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            @keyframes sentence-reveal-in {
                0% { opacity: 0; transform: translateY(8px) scale(0.98); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }

            @keyframes drop-zone-pulse {
                0%, 100% { border-width: 2px; box-shadow: 0 0 0 0 rgba(217, 119, 87, 0.3); }
                50% { border-width: 3px; box-shadow: 0 0 0 6px rgba(217, 119, 87, 0.1); }
            }

            @keyframes drop-zone-correct-flash {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
                20% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.18); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
            }

            @keyframes drop-zone-wrong-flash {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); }
                20% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.18); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); }
            }

            .animate-bounce-back {
                animation: bounce-back 0.5s ease-out;
            }

            .animate-success-pulse {
                animation: success-pulse 0.6s ease-in-out;
            }

            .animate-sentence-reveal {
                animation: sentence-reveal-in 0.3s ease-out;
            }

            .drop-zone-ready {
                animation: drop-zone-pulse 1.5s ease-in-out infinite;
            }

            .drop-zone-correct {
                border-color: #22c55e !important;
                background-color: rgba(34, 197, 94, 0.10) !important;
                animation: drop-zone-correct-flash 450ms ease-out;
            }

            .drop-zone-wrong {
                border-color: #ef4444 !important;
                background-color: rgba(239, 68, 68, 0.10) !important;
                animation: drop-zone-wrong-flash 450ms ease-out;
            }

            .touch-manipulation {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
        `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Cleanup pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (dropZoneFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(dropZoneFeedbackTimeoutRef.current);
      }
      if (explanationAutoDismissTimeoutRef.current !== null) {
        window.clearTimeout(explanationAutoDismissTimeoutRef.current);
      }
      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  // Auto-dismiss explanation panel so it can never trap a phone user
  useEffect(() => {
    if (!gameState.showExplanation) return;

    if (explanationAutoDismissTimeoutRef.current !== null) {
      window.clearTimeout(explanationAutoDismissTimeoutRef.current);
    }

    explanationAutoDismissTimeoutRef.current = window.setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        showExplanation: false,
        explanationText: "",
      }));
      explanationAutoDismissTimeoutRef.current = null;
    }, 6000);

    return () => {
      if (explanationAutoDismissTimeoutRef.current !== null) {
        window.clearTimeout(explanationAutoDismissTimeoutRef.current);
        explanationAutoDismissTimeoutRef.current = null;
      }
    };
  }, [gameState.showExplanation]);

  // Save progress after each correct answer
  useEffect(() => {
    if (!activityId || totalWordsAcrossRounds === 0) return;
    const status = overallProgressPercent >= 100 ? "completed" : "in_progress";
    void saveActivityProgress(activityId, overallProgressPercent, status, undefined, undefined, assignmentId ?? null, undefined, vocabType);
  }, [activityId, overallProgressPercent, totalWordsAcrossRounds, assignmentId, vocabType]);

  useEffect(() => {
    if (!activityId || !currentRound || !isRoundComplete) return;
    const roundNumber = currentRound.roundNumber;
    if (completedRoundCategoriesRef.current.has(roundNumber)) return;
    completedRoundCategoriesRef.current.add(roundNumber);
    const roundStatus = overallProgressPercent >= 100 ? "completed" : "in_progress";

    const saveRoundProgress = async () => {
      // Pass 100 for the round's own progress (since the round is complete),
      // but use overallProgressPercent for the activity status
      const result = await saveActivityProgress(
        activityId,
        100,
        roundStatus,
        undefined,
        `round-${roundNumber}`,
        assignmentId ?? null,
        undefined,
        vocabType
      );
      if (result?.pointsAwarded && result.pointsAwarded > 0) {
        setPointsToast({ points: result.pointsAwarded, key: Date.now() });
      }
    };

    void saveRoundProgress();
  }, [activityId, currentRound, isRoundComplete, assignmentId, overallProgressPercent, vocabType]);

  // Resume from saved round progress
  useEffect(() => {
    if (!activityId || rounds.length === 0) return;

    let cancelled = false;

    async function resumeFromProgress() {
      try {
        const id = activityId;
        if (!id) return;
        const qs = new URLSearchParams({ activityId: id });
        if (assignmentId) qs.set("assignmentId", assignmentId);
        const res = await fetch(`/api/activity/progress?${qs.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as { categoryData?: string | null };
        if (!data.categoryData) return;

        const parsed = JSON.parse(data.categoryData) as unknown;
        if (!parsed || typeof parsed !== "object") return;

        const completedRounds = new Set<number>();
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          const match = /^round-(\d+)$/.exec(key);
          if (!match) continue;
          if (!value || typeof value !== "object") continue;
          const completed = (value as { completed?: unknown }).completed;
          if (completed === true) {
            completedRounds.add(Number(match[1]));
          }
        }

        if (cancelled) return;

        completedRoundCategoriesRef.current = new Set(completedRounds);

        let nextRound = 1;
        while (nextRound <= rounds.length && completedRounds.has(nextRound)) {
          nextRound += 1;
        }

        if (nextRound > rounds.length) {
          setCurrentRoundIndex(Math.max(0, rounds.length - 1));
          setIsRoundComplete(true);
          setIsGameComplete(true);
          return;
        }

        setCurrentRoundIndex(nextRound - 1);
        setGameState({
          currentWordIndex: 0,
          correctCount: 0,
          incorrectAttempts: 0,
          completedWords: new Set(),
          showExplanation: false,
          explanationText: "",
          isAutoAdvancing: false,
          bounceWord: false,
        });
        setInteractionMode(InteractionMode.Idle);
        setReveal(null);
        setIsRoundComplete(false);
        setIsGameComplete(false);
      } catch {
        // best-effort
      }
    }

    void resumeFromProgress();

    return () => {
      cancelled = true;
    };
  }, [activityId, assignmentId, rounds.length]);

  const handleWordDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setInteractionMode(InteractionMode.Dragging);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleWordDragEnd = () => {
    if (interactionMode === InteractionMode.Dragging) {
      setInteractionMode(InteractionMode.Idle);
    }
  };

  const handleDropZoneDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropZoneDrop = (
    e: React.DragEvent<HTMLDivElement>,
    category: SortCategory
  ) => {
    e.preventDefault();
    if (reveal) return;
    if (gameState.showExplanation) handleDismissExplanation();
    setInteractionMode(InteractionMode.Checking);
    checkAnswer(category);
  };

  const handleWordTap = () => {
    if (interactionMode === InteractionMode.Idle) {
      setInteractionMode(InteractionMode.WordSelected);
    } else if (interactionMode === InteractionMode.WordSelected) {
      setInteractionMode(InteractionMode.Idle);
    }
  };

  const handleDropZoneTap = (category: SortCategory) => {
    if (!currentWord) return;
    if (reveal) return;
    if (gameState.showExplanation) handleDismissExplanation();
    setInteractionMode(InteractionMode.Checking);
    checkAnswer(category);
  };

  const checkAnswer = (selectedCategory: SortCategory) => {
    if (!currentWord) return;

    const isCorrect = selectedCategory === currentWord.category;

    setDropZoneFeedback({ category: selectedCategory, isCorrect });
    if (dropZoneFeedbackTimeoutRef.current !== null) {
      window.clearTimeout(dropZoneFeedbackTimeoutRef.current);
    }
    dropZoneFeedbackTimeoutRef.current = window.setTimeout(() => {
      setDropZoneFeedback(null);
      dropZoneFeedbackTimeoutRef.current = null;
    }, 500);

    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        correctCount: prev.correctCount + 1,
        completedWords: new Set([...prev.completedWords, currentWord.id]),
        showExplanation: false,
        explanationText: "",
        isAutoAdvancing: true,
      }));

      // Show the finished sentence, then move on — either when the learner taps
      // "Next" or after REVEAL_AUTO_ADVANCE_MS, whichever comes first.
      setReveal(currentWord);
      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current);
      }
      revealTimeoutRef.current = window.setTimeout(() => {
        revealTimeoutRef.current = null;
        dismissRevealAndAdvance();
      }, REVEAL_AUTO_ADVANCE_MS);
    } else {
      setGameState((prev) => ({
        ...prev,
        incorrectAttempts: prev.incorrectAttempts + 1,
        bounceWord: true,
        showExplanation: true,
        explanationText: currentWord.explanation,
      }));

      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          bounceWord: false,
        }));
      }, 500);
    }

    setInteractionMode(InteractionMode.Idle);
  };

  /**
   * Clears the reveal card and moves to the next word. Cancels any pending
   * auto-advance first, so tapping "Next" can never skip a card.
   */
  const dismissRevealAndAdvance = () => {
    if (revealTimeoutRef.current !== null) {
      window.clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
    setReveal(null);
    setGameState((prev) => ({ ...prev, isAutoAdvancing: false }));
    advanceToNextWord();
  };

  const advanceToNextWord = () => {
    setGameState((prev) => {
      const nextIndex = prev.currentWordIndex + 1;
      if (nextIndex >= shuffledWords.length) {
        setIsRoundComplete(true);
        return prev;
      }
      return {
        ...prev,
        currentWordIndex: nextIndex,
      };
    });
  };

  const handleNextRound = () => {
    if (currentRoundIndex + 1 >= rounds.length) {
      setIsGameComplete(true);
    } else {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setGameState({
        currentWordIndex: 0,
        correctCount: 0,
        incorrectAttempts: 0,
        completedWords: new Set(),
        showExplanation: false,
        explanationText: "",
        isAutoAdvancing: false,
        bounceWord: false,
      });
      setReveal(null);
      setIsRoundComplete(false);
    }
  };

  const handleDismissExplanation = () => {
    setGameState((prev) => ({
      ...prev,
      showExplanation: false,
      explanationText: "",
    }));
  };

  const handleReset = () => {
    if (revealTimeoutRef.current !== null) {
      window.clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
    setCurrentRoundIndex(0);
    setGameState({
      currentWordIndex: 0,
      correctCount: 0,
      incorrectAttempts: 0,
      completedWords: new Set(),
      showExplanation: false,
      explanationText: "",
      isAutoAdvancing: false,
      bounceWord: false,
    });
    setInteractionMode(InteractionMode.Idle);
    setReveal(null);
    setIsRoundComplete(false);
    setIsGameComplete(false);
  };

  if (rounds.length === 0 || !currentRound) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        <p className="text-text-muted">No sorting cards available.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:w-full md:max-w-5xl md:mx-auto md:bg-[var(--color-bg)] md:px-3 md:py-4">
      {/* Points Toast */}
      {pointsToast && (
        <PointsToast
          key={pointsToast.key}
          points={pointsToast.points}
          onComplete={() => setPointsToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex-shrink-0 bg-[var(--color-surface-elevated)] border-b md:border md:rounded-xl shadow-sm border-[var(--color-border-subtle)] p-3 md:p-4">
        <div className="flex items-start gap-3">
          <ContextualBackButton
            className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center touch-manipulation"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                Action or Description?
              </h2>
              <div className="text-sm font-medium text-text-muted whitespace-nowrap">
                <span className="text-green-600 font-bold">
                  {gameState.correctCount}
                </span>{" "}
                / {shuffledWords.length} correct
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">
              Round {currentRound.roundNumber} of {rounds.length}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text)] mb-3">
              {interactionMode === InteractionMode.WordSelected
                ? "Tap a category to sort"
                : "Does it need a verb, or BE?"}
            </p>
            <div className="h-2.5 w-full bg-[var(--color-bg-light)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-6 md:overflow-visible md:overscroll-auto md:px-0 md:py-6 flex flex-col items-center justify-start gap-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Round note banner */}
        {!isRoundComplete && currentRound.note && (
          <div className="w-full max-w-2xl">
            <div className="flex items-start gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 p-3 dark:border-amber-500/60 dark:bg-amber-500/10">
              <span className="text-lg leading-none">⚠️</span>
              <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">
                {currentRound.note}
              </p>
            </div>
          </div>
        )}

        {/* Current Word Card */}
        {!isRoundComplete && currentWord && !reveal && (
          <div className="w-full max-w-md">
            <div
              draggable
              onDragStart={handleWordDragStart}
              onDragEnd={handleWordDragEnd}
              onClick={handleWordTap}
              className={`
                                p-6 md:p-8 bg-[var(--color-surface-elevated)] rounded-2xl shadow-lg border-4 cursor-grab active:cursor-grabbing
                                text-center transition-[transform,box-shadow] duration-200 min-h-[120px] flex items-center justify-center
                                touch-manipulation select-none
                                ${gameState.bounceWord ? "animate-bounce-back" : ""}
                                ${
                                  interactionMode === InteractionMode.WordSelected
                                    ? "border-yellow-400 bg-yellow-50 scale-105"
                                    : interactionMode === InteractionMode.Dragging
                                    ? "border-blue-400 opacity-75"
                                    : "border-[var(--color-border-subtle)] hover:border-blue-300"
                                }
                            `}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] break-words">
                {currentWord.word}
              </h3>
            </div>
            <p className="text-center text-xs sm:text-sm text-[var(--color-text-muted)] mt-3">
              {interactionMode === InteractionMode.WordSelected
                ? "Now tap a category below"
                : "Tap a category to sort"}
            </p>
          </div>
        )}

        {/* Sentence reveal after a correct sort */}
        {reveal && (
          <div className="w-full max-w-md animate-sentence-reveal">
            <div className="rounded-2xl border-4 border-green-400 bg-green-50 p-5 md:p-6 shadow-lg dark:border-green-500/70 dark:bg-green-500/10">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span className="text-sm font-bold uppercase tracking-wide text-green-800 dark:text-green-300">
                  {CATEGORY_LABELS[reveal.category]}
                </span>
              </div>
              <p className="mb-3 text-xl md:text-2xl font-bold leading-snug text-green-900 dark:text-green-100">
                {renderSentence(reveal.sentence)}
              </p>
              <p className="mb-4 text-sm leading-relaxed text-green-800 dark:text-green-200">
                {reveal.explanation}
              </p>
              <button
                onClick={dismissRevealAndAdvance}
                className="w-full min-h-[44px] rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Drop Zones */}
        <div className="w-full max-w-2xl">
          {!isRoundComplete ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
              {/* Action Zone */}
              <div
                onDragOver={handleDropZoneDragOver}
                onDrop={(e) => handleDropZoneDrop(e, "action")}
                onClick={() => handleDropZoneTap("action")}
                className={`
                                    relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                    transition-[border-color,background-color] duration-200 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                                    min-h-[140px] flex flex-col items-center justify-center
                                    ${
                                      dropZoneFeedback?.category === "action"
                                        ? dropZoneFeedback.isCorrect
                                          ? "drop-zone-correct"
                                          : "drop-zone-wrong"
                                        : ""
                                    }
                                    ${
                                      interactionMode === InteractionMode.WordSelected
                                        ? "drop-zone-ready border-blue-500 bg-blue-50"
                                        : interactionMode === InteractionMode.Dragging
                                        ? "border-green-500 bg-green-50"
                                        : "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-border-strong)]"
                                    }
                                `}
              >
                <div className="text-4xl md:text-5xl mb-2">🏃</div>
                <div className="font-bold text-[var(--color-text)] text-base md:text-lg">
                  Action
                </div>
                <p className="text-xs font-semibold text-blue-600 mt-1">
                  → Use a verb
                </p>
              </div>

              {/* Description Zone */}
              <div
                onDragOver={handleDropZoneDragOver}
                onDrop={(e) => handleDropZoneDrop(e, "description")}
                onClick={() => handleDropZoneTap("description")}
                className={`
                                    relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                    transition-[border-color,background-color] duration-200 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                                    min-h-[140px] flex flex-col items-center justify-center
                                    ${
                                      dropZoneFeedback?.category === "description"
                                        ? dropZoneFeedback.isCorrect
                                          ? "drop-zone-correct"
                                          : "drop-zone-wrong"
                                        : ""
                                    }
                                    ${
                                      interactionMode === InteractionMode.WordSelected
                                        ? "drop-zone-ready border-blue-500 bg-blue-50"
                                        : interactionMode === InteractionMode.Dragging
                                        ? "border-green-500 bg-green-50"
                                        : "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-border-strong)]"
                                    }
                                `}
              >
                <div className="text-4xl md:text-5xl mb-2">🪞</div>
                <div className="font-bold text-[var(--color-text)] text-base md:text-lg">
                  Description
                </div>
                <p className="text-xs font-semibold text-purple-600 mt-1">
                  → Use am · is · are
                </p>
              </div>
            </div>
          ) : (
            /* Round Completion Message */
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl">
              <div className="text-6xl md:text-7xl mb-4">🎉</div>
              {isGameComplete ? (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    You did it!
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 mb-2">
                    You completed all {rounds.length} rounds!
                  </p>
                  <p className="text-sm text-white/80">
                    You know when to use BE and when to use a verb. 🏆
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    Great job!
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 mb-2">
                    You sorted all {shuffledWords.length} words!
                  </p>
                  <p className="text-sm text-white/80 mb-4">
                    Ready for Round {currentRound.roundNumber + 1}?
                  </p>
                  <button
                    onClick={handleNextRound}
                    className="inline-block px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100 active:scale-95 transition-[background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                  >
                    Next Round →
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Wrong-answer panel — shows the rule AND the finished sentence */}
        {gameState.showExplanation && currentWord && (
          <div className="w-full max-w-md">
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 md:p-6 shadow-lg dark:border-red-500/60 dark:bg-red-500/10">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 text-base md:text-lg dark:text-red-200">
                    Not quite!
                  </h3>
                </div>
              </div>
              <p className="text-sm md:text-base text-red-900 mb-2 dark:text-red-200">
                <strong>
                  &quot;{currentWord.word}&quot; is{" "}
                  {CATEGORY_LABELS[currentWord.category]}
                </strong>
              </p>
              <p className="text-base md:text-lg font-bold text-red-900 mb-3 dark:text-red-100">
                {renderSentence(currentWord.sentence)}
              </p>
              <p className="text-sm text-red-800 mb-4 leading-relaxed dark:text-red-200">
                {gameState.explanationText}
              </p>
              <button
                onClick={handleDismissExplanation}
                className="w-full min-h-[44px] px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {isGameComplete && (
        <div className="flex-shrink-0 flex justify-center px-3 pb-4 md:pb-0">
          <button
            onClick={handleReset}
            className="w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-[background-color,box-shadow] shadow-lg touch-manipulation text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
