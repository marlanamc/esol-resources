"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Maximize2,
    Minimize2,
    MoreHorizontal,
    Pause,
    Play,
    Printer,
    RotateCcw,
    Sparkles,
    Timer as TimerIcon,
    Trophy,
} from "lucide-react";
import type {
    TriviaGameContent,
    TriviaQuestion,
    TriviaRound,
} from "@/types/activity";
import { fetchActivityProgress, saveActivityProgress } from "@/lib/activityProgress";
import { PointsToast } from "@/components/ui/PointsToast";

/**
 * Group Trivia — a teacher-led, round-based presenter.
 *
 * Flow: each round shows its questions, teacher hits Start to begin a
 * countdown (default 5 min), groups write on paper, then Reveal flips
 * the cards to show answers. Next Round advances; the last round ends
 * on a recap screen. A printable group answer sheet is available via
 * the Print button.
 *
 * Participation points: on mount we ping `saveActivityProgress(... 100, "completed")`
 * — the same idempotent path used by Café Catch-Up — so logged-in students
 * who open the activity get the small participation grant once.
 */

interface Props {
    activityId: string;
    content: TriviaGameContent;
    assignmentId?: string | null;
}

const LETTERS = ["A", "B", "C", "D", "E"];

function pad2(n: number) {
    return n < 10 ? `0${n}` : String(n);
}

function formatClock(secs: number) {
    const s = Math.max(0, Math.floor(secs));
    return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

/** Render *word* as bold+underlined emphasis (matches "the underlined word" phrasing). */
function renderEmphasized(text: string): React.ReactNode[] {
    const parts = text.split(/(\*[^*\n]+\*)/g);
    return parts.map((part, i) => {
        if (/^\*[^*\n]+\*$/.test(part)) {
            return (
                <strong key={i} className="font-bold underline decoration-2 underline-offset-4">
                    {part.slice(1, -1)}
                </strong>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

export default function TriviaGame({ activityId, content }: Props) {
    const rounds = content.rounds ?? [];
    const totalRounds = rounds.length;
    const roundSeconds = content.roundSeconds ?? 300;
    const participationPoints = content.participationPoints ?? 5;

    const [roundIdx, setRoundIdx] = useState(0);
    const [revealedCount, setRevealedCount] = useState(0);
    const [phase, setPhase] = useState<"idle" | "running" | "paused" | "done">("idle");
    const [secondsLeft, setSecondsLeft] = useState(roundSeconds);
    const [printMode, setPrintMode] = useState(false);
    const [showRecap, setShowRecap] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [isCompleted, setIsCompleted] = useState(false);
    const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const grantedRef = useRef(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Close overflow menu on outside click / Escape
    useEffect(() => {
        if (!menuOpen) return;
        const onClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    const currentRound: TriviaRound | undefined = rounds[roundIdx];
    const isLastRound = roundIdx >= totalRounds - 1;
    const totalQuestions = currentRound?.questions.length ?? 0;
    const allRevealed = totalQuestions > 0 && revealedCount >= totalQuestions;

    // Participation point grant on first open (idempotent server-side)
    useEffect(() => {
        if (grantedRef.current) return;
        grantedRef.current = true;
        let cancelled = false;
        void (async () => {
            const existing = await fetchActivityProgress(activityId);
            if (cancelled) return;
            if (
                existing &&
                (existing.status === "completed" ||
                    existing.status === "submitted" ||
                    existing.progress >= 100)
            ) {
                setIsCompleted(true);
                return;
            }
            const result = await saveActivityProgress(activityId, 100, "completed");
            if (cancelled || !result?.ok) return;
            setIsCompleted(true);
            const awarded = result.pointsAwarded ?? participationPoints;
            setPointsAwarded(awarded);
            if (awarded > 0) setShowToast(true);
        })();
        return () => {
            cancelled = true;
        };
    }, [activityId, participationPoints]);

    // Timer
    useEffect(() => {
        if (phase !== "running") {
            if (tickRef.current) {
                clearInterval(tickRef.current);
                tickRef.current = null;
            }
            return;
        }
        tickRef.current = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    setPhase("done");
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => {
            if (tickRef.current) {
                clearInterval(tickRef.current);
                tickRef.current = null;
            }
        };
    }, [phase]);

    // Fullscreen state
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen?.();
            } else {
                await document.exitFullscreen?.();
            }
        } catch {
            // ignore
        }
    }, []);

    const resetRound = useCallback(() => {
        setSecondsLeft(roundSeconds);
        setPhase("idle");
        setRevealedCount(0);
    }, [roundSeconds]);

    const startRound = useCallback(() => {
        if (phase === "running") return;
        if (secondsLeft <= 0) setSecondsLeft(roundSeconds);
        setPhase("running");
        setRevealedCount(0);
    }, [phase, secondsLeft, roundSeconds]);

    const pauseRound = useCallback(() => {
        if (phase === "running") setPhase("paused");
    }, [phase]);

    const resumeRound = useCallback(() => {
        if (phase === "paused") setPhase("running");
    }, [phase]);

    const revealNext = useCallback(() => {
        setRevealedCount((c) => {
            if (totalQuestions === 0) return 0;
            return Math.min(totalQuestions, c + 1);
        });
        setPhase("done");
    }, [totalQuestions]);

    const hideAllReveals = useCallback(() => {
        setRevealedCount(0);
    }, []);

    const goRound = useCallback(
        (idx: number) => {
            if (idx < 0 || idx >= totalRounds) return;
            setRoundIdx(idx);
            setSecondsLeft(roundSeconds);
            setPhase("idle");
            setRevealedCount(0);
            setShowRecap(false);
        },
        [totalRounds, roundSeconds]
    );

    const nextRound = useCallback(() => {
        if (isLastRound) {
            setShowRecap(true);
            return;
        }
        goRound(roundIdx + 1);
    }, [isLastRound, goRound, roundIdx]);

    const prevRound = useCallback(() => {
        if (showRecap) {
            setShowRecap(false);
            return;
        }
        goRound(roundIdx - 1);
    }, [showRecap, goRound, roundIdx]);

    // Keyboard shortcuts (teacher controls)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const tgt = e.target as HTMLElement | null;
            if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA")) return;
            if (printMode) return;
            if (e.code === "Space") {
                e.preventDefault();
                if (phase === "idle") startRound();
                else if (phase === "running") pauseRound();
                else if (phase === "paused") resumeRound();
                else if (phase === "done") revealNext();
            } else if (e.key === "r" || e.key === "R") {
                e.preventDefault();
                revealNext();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                nextRound();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                prevRound();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [phase, printMode, startRound, pauseRound, resumeRound, revealNext, nextRound, prevRound]);

    const timerColor = useMemo(() => {
        if (secondsLeft <= 30) return "text-red-600 dark:text-red-400";
        if (secondsLeft <= 60) return "text-amber-600 dark:text-amber-400";
        return "text-gray-900 dark:text-gray-50";
    }, [secondsLeft]);

    if (printMode) {
        return (
            <PrintSheet
                content={content}
                onExit={() => setPrintMode(false)}
            />
        );
    }

    if (showRecap) {
        return (
            <div
                ref={containerRef}
                className="min-h-full bg-[#fbf5ec] dark:bg-[#1a1410] flex flex-col items-center justify-center px-6 py-12"
            >
                <div className="max-w-2xl w-full text-center bg-white dark:bg-[#2a1f1a] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-md">
                    <Trophy className="mx-auto mb-3 text-accent" size={42} />
                    <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                        Tally your scores!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        That was every round. Compare answers across groups, add up points, and crown a winner.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            type="button"
                            onClick={() => goRound(0)}
                            className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 shadow-sm transition-colors"
                        >
                            <RotateCcw size={16} /> Play again
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowRecap(false)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a] hover:bg-amber-50 dark:hover:bg-[#3a2820] text-gray-800 dark:text-gray-100 font-semibold px-4 py-2.5 transition-colors"
                        >
                            <ChevronLeft size={16} /> Back to last round
                        </button>
                    </div>
                </div>
                {showToast && pointsAwarded !== null && pointsAwarded > 0 && (
                    <PointsToast
                        points={pointsAwarded}
                        message="Thanks for playing"
                        onComplete={() => setShowToast(false)}
                    />
                )}
            </div>
        );
    }

    if (!currentRound) {
        return (
            <div className="p-6 text-red-600 bg-red-50 rounded-lg">
                No rounds configured for this trivia game.
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-full bg-[#fbf5ec] dark:bg-[#1a1410] flex flex-col">
            {/* Sticky control bar */}
            <div className="sticky top-0 z-20 border-b border-gray-200 dark:border-white/10 bg-[#fbf5ec]/95 dark:bg-[#1a1410]/95 backdrop-blur">
                <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
                    {/* Title */}
                    <div className="flex items-center gap-2.5 min-w-0 mr-2">
                        <span
                            aria-hidden="true"
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/12 dark:bg-primary/25 text-primary"
                        >
                            <Sparkles size={18} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[0.6rem] uppercase tracking-[0.14em] font-bold text-primary-dark dark:text-primary-light leading-none">
                                Group Trivia
                            </p>
                            <h1 className="font-display text-base sm:text-lg font-bold text-gray-900 dark:text-gray-50 leading-tight truncate max-w-[14rem] sm:max-w-[20rem]">
                                {content.title}
                            </h1>
                        </div>
                    </div>

                    {/* Timer + primary controls */}
                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                        <div
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                                secondsLeft <= 30
                                    ? "border-red-300 bg-red-50 dark:border-red-700/50 dark:bg-red-900/20"
                                    : "border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a]"
                            }`}
                        >
                            <TimerIcon
                                size={15}
                                className={`${secondsLeft <= 30 ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"} ${phase === "running" && secondsLeft <= 10 ? "animate-pulse" : ""}`}
                            />
                            <span className={`font-mono text-xl font-bold tabular-nums leading-none ${timerColor}`}>
                                {formatClock(secondsLeft)}
                            </span>
                        </div>

                        {phase === "idle" && (
                            <button
                                type="button"
                                onClick={startRound}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 text-sm shadow-[0_4px_14px_rgba(176,87,64,0.28)] active:translate-y-px transition-all"
                            >
                                <Play size={14} /> Start
                            </button>
                        )}
                        {phase === "running" && (
                            <button
                                type="button"
                                onClick={pauseRound}
                                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a] hover:bg-amber-50 dark:hover:bg-[#3a2820] text-gray-800 dark:text-gray-100 font-semibold px-3.5 py-2 text-sm transition-all"
                            >
                                <Pause size={14} /> Pause
                            </button>
                        )}
                        {phase === "paused" && (
                            <button
                                type="button"
                                onClick={resumeRound}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold px-3.5 py-2 text-sm transition-all"
                            >
                                <Play size={14} /> Resume
                            </button>
                        )}
                        {phase === "done" && (
                            <button
                                type="button"
                                onClick={() => {
                                    resetRound();
                                    startRound();
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a] hover:bg-amber-50 dark:hover:bg-[#3a2820] text-gray-800 dark:text-gray-100 font-semibold px-3.5 py-2 text-sm transition-all"
                            >
                                <Play size={14} /> Restart
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={allRevealed ? hideAllReveals : revealNext}
                            className={
                                allRevealed
                                    ? "inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a] hover:bg-amber-50 dark:hover:bg-[#3a2820] text-gray-800 dark:text-gray-100 font-semibold px-3.5 py-2 text-sm transition-all"
                                    : "inline-flex items-center gap-1.5 rounded-full bg-secondary hover:bg-secondary-dark text-white font-bold px-4 py-2 text-sm shadow-sm active:translate-y-px transition-all"
                            }
                        >
                            {allRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                            {allRevealed
                                ? "Hide all"
                                : revealedCount === 0
                                  ? "Reveal"
                                  : `Reveal next (${revealedCount}/${totalQuestions})`}
                        </button>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={prevRound}
                                disabled={roundIdx === 0}
                                aria-label="Previous round"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a] hover:bg-amber-50 dark:hover:bg-[#3a2820] text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            <button
                                type="button"
                                onClick={nextRound}
                                className="inline-flex items-center gap-1 rounded-full bg-accent hover:bg-amber-400 text-gray-900 font-bold px-3.5 py-1.5 text-sm shadow-sm transition-all"
                            >
                                {isLastRound ? "Finish" : "Next"}
                                <ChevronRight size={14} />
                            </button>
                        </div>

                        {/* Overflow menu */}
                        <div ref={menuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((o) => !o)}
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                                aria-label="More options"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a] text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-[#3a2820] hover:border-accent transition-colors"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                            {menuOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 mt-2 w-60 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a1f1a] shadow-lg p-1.5 z-30"
                                >
                                    <MenuItem
                                        icon={<RotateCcw size={14} />}
                                        label="Reset timer"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            resetRound();
                                        }}
                                    />
                                    <MenuItem
                                        icon={<Printer size={14} />}
                                        label="Print group answer sheet"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setPrintMode(true);
                                        }}
                                    />
                                    <MenuItem
                                        icon={isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                        label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                        onClick={() => {
                                            setMenuOpen(false);
                                            void toggleFullscreen();
                                        }}
                                    />
                                    <div className="border-t border-gray-100 dark:border-white/10 my-1.5" />
                                    <div className="px-2.5 py-1.5">
                                        <p className="text-[0.6rem] uppercase tracking-[0.12em] font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                                            Shortcuts
                                        </p>
                                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-200">
                                            <li className="flex items-center gap-2"><Kbd>Space</Kbd> start / pause</li>
                                            <li className="flex items-center gap-2"><Kbd>R</Kbd> reveal answers</li>
                                            <li className="flex items-center gap-2"><Kbd>←</Kbd> <Kbd>→</Kbd> rounds</li>
                                        </ul>
                                    </div>
                                    {isCompleted && (
                                        <>
                                            <div className="border-t border-gray-100 dark:border-white/10 my-1.5" />
                                            <p className="px-2.5 py-1 text-[0.7rem] flex items-center gap-1.5 text-secondary-dark dark:text-secondary-light font-semibold">
                                                <Trophy size={12} /> Participation logged
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Round dots */}
                <div className="px-4 sm:px-6 lg:px-8 pb-2.5">
                    <div role="toolbar" aria-label="Rounds" className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[0.6rem] uppercase tracking-[0.1em] font-bold text-gray-500 dark:text-gray-400 mr-1">
                            Rounds
                        </span>
                        {rounds.map((r, i) => {
                            const active = i === roundIdx;
                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => goRound(i)}
                                    aria-current={active ? "true" : undefined}
                                    aria-label={`Go to ${r.title}`}
                                    className={
                                        active
                                            ? "min-w-[2rem] px-2.5 py-0.5 text-[0.75rem] font-bold rounded-full bg-primary text-white border border-primary shadow-[0_2px_8px_rgba(176,87,64,0.22)]"
                                            : "min-w-[2rem] px-2.5 py-0.5 text-[0.75rem] font-semibold rounded-full bg-white dark:bg-[#2a1f1a] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/15 hover:bg-amber-50 dark:hover:bg-[#3a2820] hover:border-accent"
                                    }
                                >
                                    R{i + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 pt-5">
                <div className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-[#2a1f1a] border border-gray-200 dark:border-white/10 shadow-[0_1px_2px_rgba(74,47,26,0.04),0_8px_24px_rgba(74,47,26,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] p-5 sm:p-7">
                    <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 leading-tight">
                            {currentRound.title}
                        </h2>
                        <span className="text-[0.7rem] uppercase tracking-[0.12em] font-bold text-gray-500 dark:text-gray-400">
                            {currentRound.questions.length} question{currentRound.questions.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                    {currentRound.blurb && (
                        <p className="text-base text-gray-600 dark:text-gray-300 mb-4 italic">
                            {currentRound.blurb}
                        </p>
                    )}

                    {currentRound.wordBank && currentRound.wordBank.length > 0 && (
                        <div className="relative mb-5 rounded-xl border-2 border-primary/30 dark:border-primary/40 bg-amber-50/60 dark:bg-amber-900/10 px-4 sm:px-5 py-3 sm:py-4">
                            <span className="absolute -top-2.5 left-4 px-2 text-[0.6rem] uppercase tracking-[0.18em] font-extrabold text-primary-dark dark:text-primary-light bg-white dark:bg-[#2a1f1a]">
                                Word box
                            </span>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {currentRound.wordBank.map((w) => (
                                    <span
                                        key={w}
                                        className="inline-block rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-[#2a1f1a] px-3 py-1.5 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50 shadow-sm"
                                    >
                                        {w}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <ol className="space-y-4">
                        {currentRound.questions.map((q, i) => (
                            <QuestionCard
                                key={q.id}
                                index={i + 1}
                                question={q}
                                revealed={i < revealedCount}
                            />
                        ))}
                    </ol>
                </div>
            </div>

            {showToast && pointsAwarded !== null && pointsAwarded > 0 && (
                <PointsToast
                    points={pointsAwarded}
                    message="Thanks for playing"
                    onComplete={() => setShowToast(false)}
                />
            )}
        </div>
    );
}

// ============================================================================
// Question card
// ============================================================================

function QuestionCard({
    index,
    question,
    revealed,
}: {
    index: number;
    question: TriviaQuestion;
    revealed: boolean;
}) {
    const kindLabel: Record<TriviaQuestion["kind"], string> = {
        "write-in": "Write your answer",
        "multiple-choice": "Circle one",
        "error-correction": "Find and fix the error",
        unscramble: "Unscramble the sentence",
    };
    const label = question.label ?? kindLabel[question.kind];

    return (
        <li className="rounded-xl border border-gray-200 dark:border-white/10 bg-[#fffdf7] dark:bg-[#3a2820] p-4 sm:p-5">
            <div className="flex items-start gap-3">
                <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white font-bold text-sm">
                    {index}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-[0.65rem] uppercase tracking-[0.12em] font-bold text-primary-dark dark:text-primary-light mb-1.5">
                        {label}
                    </p>
                    <p className="font-display text-lg sm:text-xl leading-snug text-gray-900 dark:text-gray-50 font-medium whitespace-pre-line">
                        {renderEmphasized(question.prompt)}
                    </p>

                    {question.kind === "multiple-choice" && question.choices && (
                        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {question.choices.map((opt, i) => (
                                <li
                                    key={`${question.id}-c${i}`}
                                    className="flex items-baseline gap-2 text-base text-gray-800 dark:text-gray-100"
                                >
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 dark:border-white/20 text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {LETTERS[i] ?? i + 1}
                                    </span>
                                    <span>{opt}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {question.kind === "unscramble" && question.tiles && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {question.tiles.map((t, i) => (
                                <span
                                    key={`${question.id}-t${i}`}
                                    className="inline-block rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-[#2a1f1a] px-2.5 py-1 text-sm font-medium text-gray-800 dark:text-gray-100"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {(question.kind === "write-in" ||
                        question.kind === "error-correction" ||
                        question.kind === "unscramble") && (
                        <div className="mt-3 border-b border-dashed border-gray-400 dark:border-white/30 h-6" />
                    )}

                    {revealed && (
                        <div className="mt-3 rounded-lg border border-secondary/40 bg-secondary/10 dark:bg-secondary/15 px-3 py-2">
                            <p className="text-[0.65rem] uppercase tracking-[0.12em] font-extrabold text-secondary-dark dark:text-secondary-light mb-0.5">
                                Answer
                            </p>
                            <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {renderEmphasized(question.answer)}
                            </p>
                            {question.acceptable && question.acceptable.length > 0 && (
                                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                                    Also accept: {question.acceptable.join(" · ")}
                                </p>
                            )}
                            {question.note && (
                                <p className="mt-1 text-sm italic text-gray-700 dark:text-gray-200">
                                    {question.note}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}

// ============================================================================
// Print sheet (no answers shown)
// ============================================================================

function PrintSheet({
    content,
    onExit,
}: {
    content: TriviaGameContent;
    onExit: () => void;
}) {
    useEffect(() => {
        const t = setTimeout(() => window.print(), 250);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="bg-white text-black min-h-screen">
            <div className="print:hidden sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-white">
                <p className="text-sm text-gray-700">
                    Group answer sheet — one per group. Use the browser's print dialog.
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 text-sm transition-colors"
                    >
                        <Printer size={14} /> Print
                    </button>
                    <button
                        type="button"
                        onClick={onExit}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-4 py-2 text-sm transition-colors"
                    >
                        Back to game
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-6 print:px-0 print:py-0">
                <header className="border-2 border-black rounded p-3 mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-xl leading-tight">
                            {content.title}
                        </h1>
                        <p className="text-xs italic text-gray-700">
                            Group trivia · {content.rounds.length} rounds · {(content.roundSeconds ?? 300) / 60} min per round
                        </p>
                    </div>
                    <div className="text-xs">
                        <div className="flex items-baseline gap-1"><span className="font-bold">Group:</span><span className="inline-block w-32 border-b border-black h-4" /></div>
                        <div className="flex items-baseline gap-1 mt-1"><span className="font-bold">Members:</span><span className="inline-block w-32 border-b border-black h-4" /></div>
                    </div>
                </header>

                {content.rounds.map((round, ri) => (
                    <section key={round.id} className="mb-5 break-inside-avoid">
                        <div className="border-b-2 border-black pb-1 mb-2 flex items-baseline justify-between">
                            <h2 className="font-bold text-sm uppercase tracking-wider">
                                Round {ri + 1} — {round.title.replace(/^Round\s*\d+\s*[—-]\s*/i, "")}
                            </h2>
                            <span className="text-xs italic text-gray-700">{(content.roundSeconds ?? 300) / 60} min</span>
                        </div>
                        {round.blurb && (
                            <p className="text-xs italic text-gray-700 mb-2">{round.blurb}</p>
                        )}
                        {round.wordBank && round.wordBank.length > 0 && (
                            <div className="border border-black rounded px-2 py-1.5 mb-2 flex flex-wrap gap-1.5 justify-center">
                                {round.wordBank.map((w) => (
                                    <span
                                        key={w}
                                        className="inline-block border border-black rounded px-2 py-0.5 text-xs font-semibold"
                                    >
                                        {w}
                                    </span>
                                ))}
                            </div>
                        )}
                        <ol className="space-y-2">
                            {round.questions.map((q, qi) => (
                                <li key={q.id} className="text-sm leading-snug">
                                    <p className="whitespace-pre-line">
                                        <span className="font-bold mr-1">{qi + 1}.</span>
                                        {renderEmphasized(q.prompt)}
                                    </p>
                                    {q.kind === "multiple-choice" && q.choices && (
                                        <ul className="ml-5 mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm">
                                            {q.choices.map((opt, i) => (
                                                <li key={`p-${q.id}-c${i}`} className="flex items-center gap-1.5">
                                                    <span className="inline-block w-3 h-3 rounded-full border border-black" />
                                                    {opt}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {q.kind === "unscramble" && q.tiles && (
                                        <p className="ml-5 mt-1 text-xs">
                                            {q.tiles.map((t, i) => (
                                                <span
                                                    key={`p-${q.id}-t${i}`}
                                                    className="inline-block border border-black rounded px-1.5 py-0.5 mr-1 mb-1"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </p>
                                    )}
                                    <div className="ml-5 mt-1 border-b border-black h-5" />
                                </li>
                            ))}
                        </ol>
                    </section>
                ))}

                <footer className="text-center text-[10pt] text-gray-600 border-t border-gray-300 pt-2 mt-4">
                    Group score: <span className="inline-block w-16 border-b border-black h-4" />
                </footer>
            </div>

            <style jsx global>{`
                @media print {
                    @page { size: letter; margin: 0.4in; }
                    body { background: #fff !important; }
                }
            `}</style>
        </div>
    );
}

function MenuItem({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={onClick}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100 hover:bg-amber-50 dark:hover:bg-[#3a2820] text-left transition-colors"
        >
            <span className="text-gray-500 dark:text-gray-400">{icon}</span>
            {label}
        </button>
    );
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-block bg-[#f6ecd9] dark:bg-[#3a2820] border border-gray-200 dark:border-white/15 border-b-2 rounded px-1.5 py-px text-[0.72rem] font-medium text-gray-700 dark:text-gray-200">
            {children}
        </kbd>
    );
}
