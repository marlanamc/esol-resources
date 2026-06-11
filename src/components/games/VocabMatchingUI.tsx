"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { PointsToast } from "@/components/ui/PointsToast";
import {
  type VocabPair,
  deriveShuffleSeed,
  deterministicShuffle,
} from "./matching-game-parse";

const VOCAB_MATCH_CARD_STYLES = {
    idle: {
        backgroundColor: "var(--color-surface-elevated)",
        borderColor: "var(--color-border-subtle)",
        color: "var(--color-text)",
    },
    selected: {
        backgroundColor: "var(--tone-vocabulary-surface-muted)",
        borderColor: "var(--color-primary)",
        color: "var(--color-text)",
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.12)",
    },
    matched: {
        backgroundColor: "rgba(34, 197, 94, 0.16)",
        borderColor: "rgba(34, 197, 94, 0.52)",
        color: "var(--color-text)",
        boxShadow: "0 8px 18px rgba(34, 197, 94, 0.10)",
    },
    wrong: {
        backgroundColor: "rgba(244, 63, 94, 0.14)",
        borderColor: "rgba(244, 63, 94, 0.5)",
        color: "var(--color-text)",
        boxShadow: "0 8px 18px rgba(244, 63, 94, 0.10)",
    },
} satisfies Record<string, CSSProperties>;

export function VocabMatchingUI({
    pairs,
    activityId,
    assignmentId,
    vocabType,
}: {
    pairs: VocabPair[];
    activityId?: string;
    assignmentId?: string | null;
    vocabType?: string;
}) {
    const shuffleSeed = useMemo(
        () => (activityId ? deriveShuffleSeed(1, activityId) : 1),
        [activityId]
    );
    const shuffledTerms = useMemo(
        () => deterministicShuffle([...pairs], shuffleSeed),
        [pairs, shuffleSeed]
    );
    const shuffledDefs = useMemo(
        () => deterministicShuffle([...pairs], shuffleSeed + 1),
        [pairs, shuffleSeed]
    );
    const pairMap = useMemo(
        () => new Map(pairs.map((pair) => [pair.id, pair])),
        [pairs]
    );
    const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
    const [matchedTermIds, setMatchedTermIds] = useState<Set<number>>(new Set());
    const [wrongFlash, setWrongFlash] = useState<number | null>(null);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
    const selectedPair = selectedTermId != null ? pairMap.get(selectedTermId) ?? null : null;

    const getTermCardStyle = (pairId: number): React.CSSProperties => {
        if (matchedTermIds.has(pairId)) return VOCAB_MATCH_CARD_STYLES.matched;
        if (selectedTermId === pairId) return VOCAB_MATCH_CARD_STYLES.selected;
        return VOCAB_MATCH_CARD_STYLES.idle;
    };

    const getDefinitionCardStyle = (pairId: number): React.CSSProperties => {
        if (matchedTermIds.has(pairId)) return VOCAB_MATCH_CARD_STYLES.matched;
        if (wrongFlash === pairId) return VOCAB_MATCH_CARD_STYLES.wrong;
        return VOCAB_MATCH_CARD_STYLES.idle;
    };

    const progressPercent =
        pairs.length > 0 ? Math.round((matchedTermIds.size / pairs.length) * 100) : 0;
    const isComplete = pairs.length > 0 && matchedTermIds.size === pairs.length;

    useEffect(() => {
        if (!activityId || pairs.length === 0) return;
        const status = isComplete ? "completed" : "in_progress";

        const saveProgress = async () => {
            const result = await saveActivityProgress(
                activityId,
                progressPercent,
                status,
                undefined,
                undefined,
                assignmentId ?? null,
                undefined,
                vocabType
            );
            if (result?.pointsAwarded && result.pointsAwarded > 0) {
                setPointsToast({ points: result.pointsAwarded, key: Date.now() });
            }
        };

        void saveProgress();
    }, [activityId, progressPercent, isComplete, pairs.length, assignmentId, vocabType]);

    const handleTermClick = (pairId: number) => {
        if (matchedTermIds.has(pairId)) return;
        if (selectedTermId === pairId) {
            setSelectedTermId(null);
            return;
        }
        if (selectedTermId != null) {
            const firstPair = pairMap.get(selectedTermId);
            const secondPair = pairMap.get(pairId);
            if (firstPair && secondPair && firstPair.id === secondPair.id) {
                setMatchedTermIds((prev) => new Set([...prev, pairId]));
                setSelectedTermId(null);
            } else {
                setWrongFlash(pairId);
                setTimeout(() => setWrongFlash(null), 400);
                setSelectedTermId(null);
            }
            return;
        }
        setSelectedTermId(pairId);
    };

    const handleDefClick = (pairId: number) => {
        if (matchedTermIds.has(pairId)) return;
        if (selectedTermId == null) return;
        const firstPair = pairMap.get(selectedTermId);
        const secondPair = pairMap.get(pairId);
        if (firstPair && secondPair && firstPair.id === secondPair.id) {
            setMatchedTermIds((prev) => new Set([...prev, pairId]));
            setSelectedTermId(null);
        } else {
            setWrongFlash(pairId);
            setTimeout(() => setWrongFlash(null), 400);
            setSelectedTermId(null);
        }
    };

    const createTermClickHandler = (pairId: number) => {
        return {
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                handleTermClick(pairId);
            },
        };
    };
    const createDefClickHandler = (pairId: number) => {
        return {
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                handleDefClick(pairId);
            },
        };
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-xl shadow-sm p-4 mb-4">
                <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">Vocabulary Matching</h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-2">Match each word to its definition.</p>
                <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                        {matchedTermIds.size}/{pairs.length}
                    </span>
                </div>
            </div>

            {isComplete ? (
                <div className="rounded-2xl border border-[var(--color-border-strong)] bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-light)] p-8 text-center text-[var(--color-text-on-accent)] shadow-xl">
                    <div className="text-5xl mb-3">🎉</div>
                    <h2 className="text-2xl font-bold mb-2">All matched!</h2>
                    <p className="opacity-80">You matched all {pairs.length} words correctly.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Mobile: Selected term display */}
                    {selectedPair && (
                        <div className="md:hidden rounded-xl border-2 border-[var(--tone-vocabulary-border)] bg-[var(--tone-vocabulary-surface)] p-5 shadow-sm">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--tone-vocabulary-accent-strong)]">
                                Selected word
                            </p>
                            <p className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
                                {selectedPair.term}
                            </p>
                            <p className="mt-3 text-sm text-[var(--color-text-muted)]">Now tap the correct definition below.</p>
                        </div>
                    )}

                    {/* Desktop: Two-column layout */}
                    <div className="hidden md:grid md:grid-cols-2 md:gap-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-[var(--color-text-muted)]">Words</p>
                            {shuffledTerms.map((p) => {
                                const handlers = createTermClickHandler(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        {...handlers}
                                        className={`
                                            w-full min-h-[48px] rounded-lg border-2 px-4 py-3 text-left transition-[border-color,background-color,color,box-shadow,transform] touch-manipulation cursor-pointer
                                            ${matchedTermIds.has(p.id) || selectedTermId === p.id
                                                ? ""
                                                : "hover:border-[var(--color-border-strong)]"}
                                        `}
                                        style={getTermCardStyle(p.id)}
                                    >
                                        <span className="font-medium">{p.term}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-[var(--color-text-muted)]">Definitions</p>
                            {shuffledDefs.map((p) => {
                                const handlers = createDefClickHandler(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        {...handlers}
                                        className={`
                                            w-full min-h-[48px] rounded-lg border-2 px-4 py-3 text-left text-sm transition-[border-color,background-color,color,box-shadow,transform] touch-manipulation cursor-pointer
                                            ${wrongFlash === p.id ? "animate-pulse" : ""}
                                            ${matchedTermIds.has(p.id) || wrongFlash === p.id
                                                ? ""
                                                : "hover:border-[var(--color-border-strong)]"}
                                        `}
                                        style={getDefinitionCardStyle(p.id)}
                                    >
                                        <span>{p.definition}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile: Single-column layout */}
                    <div className="md:hidden space-y-4">
                        {/* Words to select */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-[var(--color-text-muted)]">
                                {selectedTermId != null ? "Selected word shown above" : "Tap a word to start:"}
                            </p>
                            {selectedTermId == null && shuffledTerms.map((p) => {
                                const handlers = createTermClickHandler(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        {...handlers}
                                        className={`
                                            w-full min-h-[60px] rounded-lg border-2 px-4 py-4 text-left text-base transition-[border-color,background-color,color,box-shadow,transform] touch-manipulation cursor-pointer
                                            ${matchedTermIds.has(p.id) || selectedTermId === p.id
                                                ? ""
                                                : "hover:border-[var(--color-border-strong)]"}
                                        `}
                                        style={getTermCardStyle(p.id)}
                                    >
                                        <span className="text-lg font-medium">{p.term}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Definitions to match (only show when word is selected) */}
                        {selectedTermId != null && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-[var(--color-text-muted)]">Tap the correct definition:</p>
                                {shuffledDefs.map((p) => {
                                    const handlers = createDefClickHandler(p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            {...handlers}
                                            className={`
                                                w-full min-h-[60px] rounded-lg border-2 px-4 py-4 text-left text-base transition-[border-color,background-color,color,box-shadow,transform] touch-manipulation cursor-pointer
                                                ${wrongFlash === p.id ? "animate-pulse" : ""}
                                                ${matchedTermIds.has(p.id) || wrongFlash === p.id
                                                    ? ""
                                                    : "hover:border-[var(--color-border-strong)]"}
                                            `}
                                            style={getDefinitionCardStyle(p.id)}
                                        >
                                            <span className="text-base">{p.definition}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Time Indicators Sorting UI ---
