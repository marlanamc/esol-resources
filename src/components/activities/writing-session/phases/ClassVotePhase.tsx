"use client";

import { useState } from "react";
import type { GroupWinner } from "../types";

interface ClassVotePhaseProps {
    sessionId: string;
    groupWinners: GroupWinner[];
    initialVote?: string | null;
    myGroupName: string;
}

export function ClassVotePhase({ sessionId, groupWinners, initialVote, myGroupName }: ClassVotePhaseProps) {
    const [selectedId, setSelectedId] = useState<string | null>(initialVote ?? null);
    const [saving, setSaving] = useState(false);
    const [voteError, setVoteError] = useState<string | null>(null);

    const vote = async (submissionId: string) => {
        if (saving) return;
        const prev = selectedId;
        setSelectedId(submissionId);
        setSaving(true);
        setVoteError(null);
        try {
            const res = await fetch(`/api/writing-session/${sessionId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submissionId, voteType: "class" }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({})) as { error?: string };
                throw new Error(data.error ?? "Vote failed");
            }
        } catch (e) {
            setSelectedId(prev); // revert optimistic update
            setVoteError(e instanceof Error ? e.message : "Couldn't save vote — try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-5 px-1 py-2">
            {/* Header */}
            <div className="text-center space-y-1 pt-1">
                <div className="text-4xl mb-1">🏆</div>
                <h2 className="text-2xl font-display font-bold text-[var(--text)]">Class Vote</h2>
                <p className="text-sm text-gray-500">The best writing from each group. Vote for your favorite!</p>
                <p className="text-xs text-gray-400">(You can&apos;t vote for your own group)</p>
            </div>

            <div className="space-y-4">
                {groupWinners.map((winner) => {
                    const isMyGroup = winner.groupName === myGroupName;
                    const isSelected = selectedId === winner.id;

                    return (
                        <div
                            key={winner.id}
                            className="rounded-2xl overflow-hidden border-2 transition-all duration-200"
                            style={{
                                borderColor: isSelected ? winner.groupColor : isMyGroup ? "#e5e7eb" : "#e8ddd0",
                                opacity: isMyGroup ? 0.6 : 1,
                                boxShadow: isSelected
                                    ? `0 4px 20px ${winner.groupColor}30`
                                    : "0 1px 4px rgba(0,0,0,0.05)",
                            }}
                        >
                            {/* Group header */}
                            <div
                                className="px-4 py-2.5 flex items-center justify-between"
                                style={{
                                    backgroundColor: winner.groupColor + "18",
                                    borderBottom: `1px solid ${winner.groupColor}28`,
                                }}
                            >
                                <span
                                    className="font-semibold text-sm flex items-center gap-1.5"
                                    style={{ color: winner.groupColor }}
                                >
                                    {winner.groupEmoji} {winner.groupName}
                                    {isMyGroup && (
                                        <span className="text-xs text-gray-400 font-normal ml-1">(your group)</span>
                                    )}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{winner.wordCount} words</span>
                                    {isSelected && (
                                        <span
                                            className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                                            style={{ backgroundColor: winner.groupColor }}
                                        >
                                            ✓ Voted
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Writing text */}
                            <div className="px-4 py-4 bg-white">
                                <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                                    {winner.text}
                                </p>
                            </div>

                            {/* Vote button */}
                            {!isMyGroup && (
                                <div className="px-4 pb-4 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => vote(winner.id)}
                                        disabled={saving}
                                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                                        style={{ backgroundColor: winner.groupColor }}
                                    >
                                        {isSelected ? "✓ Voted for this one" : "Vote for this one →"}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedId && (
                <p className="text-center text-xs text-gray-400 pb-2">
                    Waiting for your teacher to reveal the winner…
                </p>
            )}
        </div>
    );
}
