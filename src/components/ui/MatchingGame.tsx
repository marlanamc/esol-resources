"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";

interface CountableWord {
    id: number;
    word: string;
    category: "countable" | "uncountable";
    explanation: string;
}

interface GameState {
    currentWordIndex: number;
    correctCount: number;
    incorrectAttempts: number;
    completedWords: Set<number>;
    showExplanation: boolean;
    explanationText: string;
    isAutoAdvancing: boolean;
    bounceWord: boolean;
}

interface Round {
    roundNumber: number;
    words: CountableWord[];
}

interface Props {
    contentStr: string;
    activityId?: string;
}

enum InteractionMode {
    Idle = "idle",
    WordSelected = "word-selected",
    Dragging = "dragging",
    Checking = "checking",
}

export default function MatchingGame({ contentStr, activityId }: Props) {
    const rounds = useMemo(() => parseRounds(contentStr), [contentStr]);
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

    const progress =
        shuffledWords.length > 0
            ? Math.round((gameState.completedWords.size / shuffledWords.length) * 100)
            : 0;

    const currentWord = shuffledWords[gameState.currentWordIndex];

    // Inject animations and styles
    useEffect(() => {
        const styleId = "countable-game-styles";
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

            @keyframes drop-zone-pulse {
                0%, 100% { border-width: 2px; box-shadow: 0 0 0 0 rgba(217, 119, 87, 0.3); }
                50% { border-width: 3px; box-shadow: 0 0 0 6px rgba(217, 119, 87, 0.1); }
            }

            .animate-bounce-back {
                animation: bounce-back 0.5s ease-out;
            }

            .animate-success-pulse {
                animation: success-pulse 0.6s ease-in-out;
            }

            .drop-zone-ready {
                animation: drop-zone-pulse 1.5s ease-in-out infinite;
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

    // Save progress after each correct answer
    useEffect(() => {
        if (!activityId || totalWordsAcrossRounds === 0) return;
        const status = overallProgressPercent >= 100 ? "completed" : "in_progress";
        void saveActivityProgress(activityId, overallProgressPercent, status);
    }, [activityId, overallProgressPercent, totalWordsAcrossRounds]);

    useEffect(() => {
        if (!activityId || !currentRound || !isRoundComplete) return;
        const roundNumber = currentRound.roundNumber;
        if (completedRoundCategoriesRef.current.has(roundNumber)) return;
        completedRoundCategoriesRef.current.add(roundNumber);
        void saveActivityProgress(
            activityId,
            100,
            "completed",
            undefined,
            `round-${roundNumber}`
        );
    }, [activityId, currentRound, isRoundComplete]);

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
        category: "countable" | "uncountable"
    ) => {
        e.preventDefault();
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

    const handleDropZoneTap = (category: "countable" | "uncountable") => {
        if (!currentWord) return;
        setInteractionMode(InteractionMode.Checking);
        checkAnswer(category);
    };

    const checkAnswer = (selectedCategory: "countable" | "uncountable") => {
        if (!currentWord) return;

        const isCorrect = selectedCategory === currentWord.category;

        if (isCorrect) {
            // Correct answer
            setGameState((prev) => ({
                ...prev,
                correctCount: prev.correctCount + 1,
                completedWords: new Set([
                    ...prev.completedWords,
                    currentWord.id,
                ]),
                isAutoAdvancing: true,
            }));

            // Auto-advance after 1 second
            setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    isAutoAdvancing: false,
                }));
                advanceToNextWord();
            }, 1000);
        } else {
            // Incorrect answer - bounce back and show explanation
            setGameState((prev) => ({
                ...prev,
                incorrectAttempts: prev.incorrectAttempts + 1,
                bounceWord: true,
                showExplanation: true,
                explanationText: currentWord.explanation,
            }));

            // Stop bounce animation after it completes
            setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    bounceWord: false,
                }));
            }, 500);
        }

        setInteractionMode(InteractionMode.Idle);
    };

    const advanceToNextWord = () => {
        setGameState((prev) => {
            const nextIndex = prev.currentWordIndex + 1;
            if (nextIndex >= shuffledWords.length) {
                // Round complete
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
            // All rounds complete
            setIsGameComplete(true);
        } else {
            // Move to next round
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
        setIsRoundComplete(false);
        setIsGameComplete(false);
    };

    if (rounds.length === 0 || !currentRound) {
        return (
            <div className="max-w-6xl mx-auto p-8 text-center">
                <p className="text-gray-500">
                    No countable/uncountable words available.
                </p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:max-w-4xl md:mx-auto md:px-3 md:py-4">
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b-2 md:border md:rounded-xl shadow-sm border-gray-200 p-3 md:p-4">
                <div className="flex items-start gap-3">
                    {/* Back button */}
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors md:hidden touch-manipulation"
                        aria-label="Go back"
                    >
                        <XIcon className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <div>
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">
                                    Countable vs Uncountable Nouns
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    Round {currentRound.roundNumber} of {rounds.length}
                                </p>
                            </div>
                            <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                <span className="text-green-600 font-bold">
                                    {gameState.correctCount}
                                </span>{" "}
                                / {shuffledWords.length} correct
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">
                            {interactionMode === InteractionMode.WordSelected
                                ? "Tap a group to put the word there"
                                : "Pick a word and move it to the right group"}
                        </p>
                        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div
                className="flex-1 overflow-y-auto overscroll-contain px-3 py-6 md:px-0 md:py-6 flex flex-col items-center justify-start gap-8"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {/* Current Word Card */}
                {!isRoundComplete && currentWord && (
                    <div className="w-full max-w-md">
                        <div
                            draggable
                            onDragStart={handleWordDragStart}
                            onDragEnd={handleWordDragEnd}
                            onClick={handleWordTap}
                            className={`
                                p-6 md:p-8 bg-white rounded-2xl shadow-lg border-4 cursor-grab active:cursor-grabbing
                                text-center transition-all duration-200 min-h-[120px] flex items-center justify-center
                                touch-manipulation select-none
                                ${gameState.bounceWord ? "animate-bounce-back" : ""}
                                ${
                                    interactionMode ===
                                    InteractionMode.WordSelected
                                        ? "border-yellow-400 bg-yellow-50 scale-105"
                                        : interactionMode ===
                                          InteractionMode.Dragging
                                        ? "border-blue-400 opacity-75"
                                        : "border-gray-300 hover:border-blue-300"
                                }
                            `}
                        >
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 break-words">
                                {currentWord.word}
                            </h3>
                        </div>
                        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
                            {interactionMode === InteractionMode.WordSelected
                                ? "Now tap a group below"
                                : "Tap a group to sort the word"}
                        </p>
                    </div>
                )}

                {/* Drop Zones */}
                <div className="w-full max-w-2xl">
                    {!isRoundComplete ? (
                        <div
                            className={`
                                grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full
                            `}
                        >
                            {/* Countable Zone */}
                            <div
                                onDragOver={handleDropZoneDragOver}
                                onDrop={(e) => handleDropZoneDrop(e, "countable")}
                                onClick={() =>
                                    handleDropZoneTap("countable")
                                }
                                className={`
                                    relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                    transition-all duration-200 cursor-pointer touch-manipulation
                                    min-h-[120px] flex flex-col items-center justify-center
                                    ${
                                        interactionMode ===
                                        InteractionMode.WordSelected
                                            ? "drop-zone-ready border-blue-500 bg-blue-50"
                                            : interactionMode ===
                                              InteractionMode.Dragging
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                    }
                                `}
                            >
                                <div className="text-4xl md:text-5xl mb-2">
                                    📦
                                </div>
                                <div className="font-bold text-gray-900 text-base md:text-lg">
                                    Countable
                                </div>
                                <p className="text-xs text-gray-600 mt-2 text-center">
                                    You can count these
                                </p>
                            </div>

                            {/* Uncountable Zone */}
                            <div
                                onDragOver={handleDropZoneDragOver}
                                onDrop={(e) =>
                                    handleDropZoneDrop(e, "uncountable")
                                }
                                onClick={() =>
                                    handleDropZoneTap("uncountable")
                                }
                                className={`
                                    relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                    transition-all duration-200 cursor-pointer touch-manipulation
                                    min-h-[120px] flex flex-col items-center justify-center
                                    ${
                                        interactionMode ===
                                        InteractionMode.WordSelected
                                            ? "drop-zone-ready border-blue-500 bg-blue-50"
                                            : interactionMode ===
                                              InteractionMode.Dragging
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                    }
                                `}
                            >
                                <div className="text-4xl md:text-5xl mb-2">
                                    ∞
                                </div>
                                <div className="font-bold text-gray-900 text-base md:text-lg">
                                    Uncountable
                                </div>
                                <p className="text-xs text-gray-600 mt-2 text-center">
                                    You can't count this
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
                                        You're a countable vs uncountable expert! 🏆
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                        Great job!
                                    </h2>
                                    <p className="text-lg md:text-xl text-white/90 mb-2">
                                        You sorted all {shuffledWords.length} words correctly!
                                    </p>
                                    <p className="text-sm text-white/80 mb-4">
                                        Ready for Round {currentRound.roundNumber + 1}?
                                    </p>
                                    <button
                                        onClick={handleNextRound}
                                        className="inline-block px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
                                    >
                                        Next Round →
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Explanation Modal */}
                {gameState.showExplanation && (
                    <div className="w-full max-w-md">
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 md:p-6 shadow-lg">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">❌</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-red-900 text-base md:text-lg">
                                        Not quite!
                                    </h3>
                                </div>
                            </div>
                            <p className="text-sm md:text-base text-red-900 mb-3">
                                <strong>
                                    "{currentWord?.word}" is a{" "}
                                    {currentWord?.category === "countable"
                                        ? "countable word"
                                        : "group word"}
                                </strong>
                            </p>
                            <p className="text-sm text-red-800 mb-4 leading-relaxed">
                                {gameState.explanationText}
                            </p>
                            <button
                                onClick={handleDismissExplanation}
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors touch-manipulation active:scale-95"
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
                        className="w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-all shadow-lg touch-manipulation text-base md:text-sm"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}

// Helper function: Parse rounds from content
function parseRounds(content: string): Round[] {
    const rounds: Round[] = [];
    const roundBlocks = content.split(/\[ROUND \d+\]/).filter((b) => b.trim());

    let roundNumber = 1;
    let globalId = 1;

    for (const block of roundBlocks) {
        const words: CountableWord[] = [];
        const lines = block.trim().split("\n").filter((l) => l.trim());

        for (const line of lines) {
            if (line.includes("::")) {
                const [word, definition] = line.split("::").map((s) => s.trim());
                if (!word || !definition) continue;

                // Determine category from definition start
                const isCountable =
                    definition.toLowerCase().startsWith("countable");
                const category = isCountable ? "countable" : "uncountable";

                // Extract explanation (everything after "Countable - " or "Uncountable - ")
                const explanationMatch = definition.match(
                    /(?:Countable|Uncountable)\s*-\s*(.+)/i
                );
                const explanation = explanationMatch
                    ? explanationMatch[1]
                    : definition;

                words.push({
                    id: globalId++,
                    word,
                    category,
                    explanation,
                });
            }
        }

        if (words.length > 0) {
            rounds.push({
                roundNumber,
                words,
            });
            roundNumber++;
        }
    }

    return rounds;
}

// Helper function: Derive a stable shuffle seed per round
function deriveShuffleSeed(roundNumber: number, activityId?: string): number {
    let seed = roundNumber;
    if (activityId) {
        for (let i = 0; i < activityId.length; i++) {
            seed = (seed * 31 + activityId.charCodeAt(i)) >>> 0;
        }
    }
    return seed;
}

// Helper function: Deterministically shuffle an array using a seed
function deterministicShuffle<T>(arr: T[], seed: number): T[] {
    const shuffled = [...arr];
    let value = seed >>> 0;
    const random = () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 0x100000000;
    };

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }

    return shuffled;
}

// Icons
function XIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}
