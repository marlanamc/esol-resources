"use client";

import { useState } from "react";
import type { TeamSubmission } from "../types";

interface GroupVotePhaseProps {
    sessionId: string;
    teamSubmissions: TeamSubmission[];
    initialVote?: string | null;
    groupEmoji: string;
    groupColor: string;
    groupName: string;
}

export function GroupVotePhase({
    sessionId,
    teamSubmissions,
    initialVote,
    groupEmoji,
    groupColor,
    groupName,
}: GroupVotePhaseProps) {
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
                body: JSON.stringify({ submissionId, voteType: "group" }),
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

    const validSubmissions = teamSubmissions.filter((s) => s.wordCount > 0);

    return (
        <div className="max-w-2xl mx-auto space-y-5 px-1 py-2">
            {/* Header */}
            <div className="text-center space-y-2 pt-1">
                <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{
                        backgroundColor: groupColor + "18",
                        color: groupColor,
                        border: `1.5px solid ${groupColor}45`,
                    }}
                >
                    {groupEmoji} {groupName}
                </div>
                <h2 className="text-2xl font-display font-bold text-[var(--text)]">
                    Vote for your favorite
                </h2>
                <p className="text-sm text-gray-400">Tap a writing to vote. You can change your mind.</p>
            </div>

            {validSubmissions.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-12">
                    No teammates submitted writing this round.
                </p>
            ) : (
                <div className="space-y-3">
                    {validSubmissions.map((sub, i) => {
                        const isSelected = selectedId === sub.id;
                        return (
                            <button
                                key={sub.id}
                                type="button"
                                onClick={() => vote(sub.id)}
                                disabled={saving}
                                className="w-full text-left rounded-2xl border-2 bg-[var(--background)] overflow-hidden transition-all duration-200"
                                style={{
                                    borderColor: isSelected ? groupColor : "#e8ddd0",
                                    boxShadow: isSelected
                                        ? `0 4px 20px ${groupColor}28, 0 1px 4px rgba(0,0,0,0.06)`
                                        : "0 1px 4px rgba(0,0,0,0.04)",
                                    transform: isSelected ? "scale(1.01)" : "scale(1)",
                                }}
                            >
                                {/* Card header */}
                                <div
                                    className="px-4 py-2.5 flex items-center justify-between"
                                    style={{
                                        backgroundColor: isSelected ? groupColor + "12" : "#faf8f5",
                                        borderBottom: `1px solid ${isSelected ? groupColor + "25" : "#f0ebe4"}`,
                                    }}
                                >
                                    <span
                                        className="text-xs font-bold uppercase tracking-widest"
                                        style={{ color: isSelected ? groupColor : "#9ca3af" }}
                                    >
                                        Writing {i + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{sub.wordCount} words</span>
                                        {isSelected && (
                                            <span
                                                className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                                                style={{ backgroundColor: groupColor }}
                                            >
                                                ✓ Your vote
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Writing content */}
                                <div className="px-4 py-4">
                                    <p className="text-[var(--text)] leading-relaxed text-sm whitespace-pre-wrap">
                                        {sub.text}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {voteError && (
                <p className="text-center text-sm text-red-500">{voteError}</p>
            )}
            {selectedId && !voteError && (
                <p className="text-center text-xs text-gray-400 pb-2">
                    Waiting for your teacher to move to the class vote…
                </p>
            )}
        </div>
    );
}
