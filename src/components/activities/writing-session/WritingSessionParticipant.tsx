"use client";

import React, { useEffect, useRef, useState } from "react";
import type { StudentState } from "./types";
import type { TimedWritingContent } from "@/types/activity";
import { WaitingPhase } from "./phases/WaitingPhase";
import { WritingPhase } from "./phases/WritingPhase";
import { GroupVotePhase } from "./phases/GroupVotePhase";
import { ClassVotePhase } from "./phases/ClassVotePhase";
import { ResultsPhase } from "./phases/ResultsPhase";

interface Props {
    sessionId: string;
    content: TimedWritingContent;
}

export function WritingSessionParticipant({ sessionId, content }: Props) {
    const [state, setState] = useState<StudentState | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState(false);
    const failCountRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let active = true;

        const poll = async () => {
            try {
                const res = await fetch(`/api/writing-session/${sessionId}/state`);
                if (!res.ok) {
                    const data = await res.json().catch(() => ({})) as { error?: string };
                    setError(data.error ?? "Failed to load session");
                    return;
                }
                const data = await res.json() as StudentState;
                if (!active) return;
                failCountRef.current = 0;
                setIsOffline(false);
                setState(data);
                // Stop polling once the session is fully finished
                if (data.status === "finished" && intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            } catch {
                // Network error — keep showing last known state
                if (!active) return;
                failCountRef.current += 1;
                if (failCountRef.current >= 2) setIsOffline(true);
            }
        };

        poll();
        intervalRef.current = setInterval(() => {
            if (document.visibilityState !== "hidden") poll();
        }, 3000);

        return () => {
            active = false;
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [sessionId]);

    if (error) {
        return <div className="max-w-xl mx-auto p-6 text-center text-red-500">{error}</div>;
    }

    const offlineBanner = isOffline ? (
        <div className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm font-medium text-amber-700">
            ⚠ Reconnecting… Your writing is safe — do not close this tab.
        </div>
    ) : null;

    if (!state) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]" />
            </div>
        );
    }

    // Suggestions for the current round from activity content
    const currentPromptData = content.prompts[state.currentRound];
    const suggestions = currentPromptData?.suggestions;

    let phase: React.ReactNode = null;
    if (state.status === "waiting") {
        phase = (
            <WaitingPhase
                groupName={state.myGroupName}
                groupEmoji={state.myGroupEmoji}
                groupColor={state.myGroupColor}
                roundNumber={state.currentRound}
            />
        );
    } else if (state.status === "writing") {
        phase = (
            <WritingPhase
                sessionId={sessionId}
                promptText={state.promptText ?? ""}
                promptImageUrl={state.promptImageUrl}
                timerEndsAt={state.timerEndsAt}
                showWordCount={content.showWordCount !== false}
                suggestions={suggestions}
                initialText={state.mySubmission?.text ?? ""}
                hasSubmitted={!!state.mySubmission}
                groupEmoji={state.myGroupEmoji ?? "✏️"}
                groupColor={state.myGroupColor ?? "#d97757"}
            />
        );
    } else if (state.status === "group-vote") {
        phase = (
            <GroupVotePhase
                sessionId={sessionId}
                teamSubmissions={state.teamSubmissions ?? []}
                initialVote={state.myVote}
                groupEmoji={state.myGroupEmoji ?? "✏️"}
                groupColor={state.myGroupColor ?? "#d97757"}
                groupName={state.myGroupName ?? ""}
            />
        );
    } else if (state.status === "class-vote") {
        phase = (
            <ClassVotePhase
                sessionId={sessionId}
                groupWinners={state.groupWinners ?? []}
                initialVote={state.myVote}
                myGroupName={state.myGroupName ?? ""}
            />
        );
    } else if (state.status === "results" || state.status === "finished") {
        phase = (
            <ResultsPhase
                classWinner={state.classWinner ?? null}
                myGroupName={state.myGroupName ?? ""}
                isFinished={state.status === "finished"}
                isGroupWinner={state.isGroupWinner}
            />
        );
    }

    return (
        <>
            {offlineBanner}
            {phase}
        </>
    );
}
