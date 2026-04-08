"use client";

import { useEffect, useState } from "react";
import type { TeacherState } from "./types";
import type { TimedWritingContent } from "@/types/activity";

interface Props {
    sessionId: string;
    content: TimedWritingContent;
    onSessionEnd: () => void;
    onResetSession: () => void;
}

export function WritingSessionHost({ sessionId, content, onSessionEnd, onResetSession }: Props) {
    const [state, setState] = useState<TeacherState | null>(null);
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timerLeft, setTimerLeft] = useState<number | null>(null);

    // Smooth local countdown so the teacher's timer doesn't jump every 3 s
    useEffect(() => {
        if (!state?.timerEndsAt) {
            setTimerLeft(null);
            return;
        }
        const endsAt = new Date(state.timerEndsAt).getTime();
        const tick = () => setTimerLeft(Math.max(0, Math.round((endsAt - Date.now()) / 1000)));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [state?.timerEndsAt]);

    useEffect(() => {
        let active = true;
        const poll = async () => {
            try {
                const res = await fetch(`/api/writing-session/${sessionId}/state`);
                if (!res.ok) return;
                const data = await res.json() as TeacherState;
                if (active) setState(data);
                if (data.status === "finished") onSessionEnd();
            } catch { /* ignore */ }
        };
        poll();
        const interval = setInterval(() => {
            if (document.visibilityState !== "hidden") poll();
        }, 3000);
        return () => { active = false; clearInterval(interval); };
    }, [sessionId, onSessionEnd]);

    const advance = async (extra?: Record<string, unknown>) => {
        if (isAdvancing) return;
        setIsAdvancing(true);
        setError(null);
        try {
            const currentPrompt = content.prompts[state?.currentRound ?? 0];
            const body = state?.status === "waiting"
                ? {
                    timerSeconds: content.timerSeconds,
                    promptText: currentPrompt?.text ?? "",
                    promptImageUrl: currentPrompt?.imageUrl ?? null,
                    ...extra,
                }
                : extra ?? {};

            const res = await fetch(`/api/writing-session/${sessionId}/advance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json() as { status?: string; error?: string; timerEndsAt?: string };
            if (!res.ok) setError(data.error ?? "Failed to advance");
            else setState((prev) => prev ? {
                ...prev,
                status: (data.status ?? prev.status) as TeacherState["status"],
                ...(data.timerEndsAt ? { timerEndsAt: data.timerEndsAt } : {}),
            } : prev);
        } catch {
            setError("Network error");
        } finally {
            setIsAdvancing(false);
        }
    };

    if (!state) {
        return (
            <div className="flex items-center justify-center min-h-[30vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
            </div>
        );
    }

    const advanceLabel: Record<string, string> = {
        waiting: "▶ Start Round",
        writing: "Open Group Voting →",
        "group-vote": "Show Class Finalists →",
        "class-vote": "Reveal Winner →",
        results: state.currentRound + 1 >= content.prompts.length ? "End Session" : "Next Round →",
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Status bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Phase</p>
                    <p className="font-bold text-[var(--text)] capitalize">{state.status.replace("-", " ")}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Round</p>
                    <p className="font-bold text-[var(--text)]">{state.currentRound + 1} / {content.prompts.length}</p>
                </div>
                {state.status === "writing" && (
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Submitted</p>
                        <p className="font-bold text-[var(--text)]">{state.submittedCount} / {state.totalCount}</p>
                    </div>
                )}
                {timerLeft !== null && (
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Timer</p>
                        <p className={`font-bold tabular-nums font-mono ${timerLeft <= 30 ? "text-red-500" : "text-[var(--primary)]"}`}>
                            {Math.floor(timerLeft / 60)}:{(timerLeft % 60).toString().padStart(2, "0")}
                        </p>
                    </div>
                )}
            </div>

            {/* Current prompt */}
            {(state.status === "waiting" || state.status === "writing") && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                        Round {state.currentRound + 1} Prompt
                    </p>
                    <p className="text-sm text-gray-700">{content.prompts[state.currentRound]?.text}</p>
                </div>
            )}

            {/* Waiting phase: show lobby check-ins for round 1, or groups for round 2+. */}
            {state.status === "waiting" && state.checkIns !== undefined ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Students checked in
                        </p>
                        <span className="text-sm font-bold text-[var(--primary)]">
                            {state.checkIns.length}
                        </span>
                    </div>
                    {state.checkIns.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                            Waiting for students to open the activity…
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {state.checkIns.map((s) => (
                                <span
                                    key={s.id}
                                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary)] text-white"
                                >
                                    {s.name}
                                </span>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                        Groups will be randomly shuffled when you press Start Round.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {state.groups.map((g) => (
                        <div key={g.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{g.emoji}</span>
                                <span className="font-semibold text-sm" style={{ color: g.colorHex }}>{g.animalName}</span>
                                <span className="ml-auto text-xs text-gray-400 font-medium">
                                    {g.members.length} {g.members.length === 1 ? "student" : "students"}
                                </span>
                            </div>
                            <ul className="space-y-0.5">
                                {g.members.map((m) => (
                                    <li key={m.id} className="text-xs text-gray-500 truncate">{m.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Advance button */}
            {state.status !== "finished" && (
                <button
                    type="button"
                    onClick={() => advance()}
                    disabled={isAdvancing}
                    className="w-full py-3 px-6 bg-[var(--primary)] text-white rounded-xl font-semibold text-base hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isAdvancing ? "Loading…" : (advanceLabel[state.status] ?? "Advance")}
                </button>
            )}

            {/* Teacher controls: extend timer / skip round */}
            {(state.status === "writing" || state.status === "group-vote") && (
                <div className="flex gap-2">
                    {state.status === "writing" && (
                        <button
                            type="button"
                            onClick={() => advance({ action: "extend", extendSeconds: 120 })}
                            disabled={isAdvancing}
                            className="flex-1 py-2 px-4 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            + 2 min
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm("Skip this round? No points will be awarded.")) {
                                void advance({ action: "skip" });
                            }
                        }}
                        disabled={isAdvancing}
                        className="flex-1 py-2 px-4 rounded-xl text-sm font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                        Skip Round
                    </button>
                </div>
            )}

            {state.status === "waiting" && state.currentRound === 0 && (
                <button
                    type="button"
                    onClick={onResetSession}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
                >
                    Start a new session instead
                </button>
            )}

            {state.status === "finished" && (
                <p className="text-center text-gray-500 text-sm font-medium">Session complete! ✏️</p>
            )}
        </div>
    );
}
