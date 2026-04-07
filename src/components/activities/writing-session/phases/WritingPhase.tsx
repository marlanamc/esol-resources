"use client";

import { useEffect, useRef, useState } from "react";

interface WritingPhaseProps {
    sessionId: string;
    promptText: string;
    promptImageUrl?: string | null;
    timerEndsAt: string | null;
    showWordCount: boolean;
    suggestions?: { starters: string[]; vocab: string[] };
    initialText?: string;
    hasSubmitted?: boolean;
    groupEmoji: string;
    groupColor: string;
}

function countWords(text: string) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;

export function WritingPhase({
    sessionId,
    promptText,
    promptImageUrl,
    timerEndsAt,
    showWordCount,
    suggestions,
    initialText = "",
    hasSubmitted = false,
    groupEmoji,
    groupColor,
}: WritingPhaseProps) {
    const initialSecondsRef = useRef(
        timerEndsAt
            ? Math.max(1, Math.round((new Date(timerEndsAt).getTime() - Date.now()) / 1000))
            : 300
    );

    const [text, setText] = useState(initialText);
    const [secondsLeft, setSecondsLeft] = useState(() => {
        if (!timerEndsAt) return 0;
        return Math.max(0, Math.round((new Date(timerEndsAt).getTime() - Date.now()) / 1000));
    });
    const [submitted, setSubmitted] = useState(hasSubmitted);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [activePanel, setActivePanel] = useState<"starters" | "vocab" | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const submitRef = useRef(hasSubmitted);

    const isWarning = secondsLeft <= 30 && secondsLeft > 0;
    const wordCount = countWords(text);
    const hasStarters = (suggestions?.starters?.length ?? 0) > 0;
    const hasVocab = (suggestions?.vocab?.length ?? 0) > 0;
    const progress = Math.max(0, Math.min(1, secondsLeft / initialSecondsRef.current));
    const dashoffset = CIRC * (1 - progress);
    const timerColor = secondsLeft <= 30 ? "#ef4444" : secondsLeft <= 60 ? "#f97316" : groupColor;

    useEffect(() => {
        if (submitted) return;
        const tick = () => {
            if (!timerEndsAt) return;
            setSecondsLeft(Math.max(0, Math.round((new Date(timerEndsAt).getTime() - Date.now()) / 1000)));
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [timerEndsAt, submitted]);

    useEffect(() => {
        // Only auto-submit when the timer has genuinely expired (guards against interval drift
        // that might set secondsLeft to 0 a tick early on throttled devices).
        if (
            secondsLeft === 0 &&
            !submitRef.current &&
            !submitted &&
            timerEndsAt &&
            Date.now() >= new Date(timerEndsAt).getTime()
        ) {
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondsLeft]);

    const handleSubmit = async () => {
        if (submitRef.current) return;
        submitRef.current = true;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch(`/api/writing-session/${sessionId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            if (!res.ok) throw new Error("Submission failed");
            setSubmitted(true);
        } catch {
            submitRef.current = false; // allow retry
            setSubmitError("Couldn't save — tap Submit to try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const insertStarter = (starter: string) => {
        setText((prev) => (prev ? `${prev} ${starter}` : starter));
        setActivePanel(null);
        setTimeout(() => textareaRef.current?.focus(), 50);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-7 text-center px-4">
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
                    style={{ backgroundColor: groupColor + "28", border: `3px solid ${groupColor}` }}
                >
                    {groupEmoji}
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-display font-bold text-[var(--text)]">Submitted!</h2>
                    {wordCount > 0 && (
                        <p className="font-handwritten text-2xl" style={{ color: groupColor }}>
                            {wordCount} {wordCount === 1 ? "word" : "words"} written ✓
                        </p>
                    )}
                </div>
                <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                    Waiting for your teacher to open group voting…
                </p>
            </div>
        );
    }

    return (
        <>
            <style>{`
                @keyframes wf-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.55; }
                }
                .wf-timer-warn { animation: wf-pulse 0.8s ease-in-out infinite; }
                :root {
                    --wr-paper:  #fffcf8;
                    --wr-line:   #e8ddd0;
                    --wr-border: #e8ddd0;
                    --wr-track:  #f0e8e0;
                    --wr-card:   #ffffff;
                    --wr-item:   #ffffff;
                    --wr-prompt-text: #374151;
                }
                .dark {
                    --wr-paper:  #16202e;
                    --wr-line:   #243040;
                    --wr-border: #2d3f52;
                    --wr-track:  #243040;
                    --wr-card:   #1e2d3e;
                    --wr-item:   #243040;
                    --wr-prompt-text: #cbd5e1;
                }
            `}</style>

            <div className="max-w-2xl mx-auto space-y-4 px-1">
                {/* Top row: group badge + circular timer */}
                <div className="flex items-center justify-between gap-3">
                    <div
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold"
                        style={{
                            backgroundColor: groupColor + "18",
                            color: groupColor,
                            border: `1.5px solid ${groupColor}45`,
                        }}
                    >
                        <span className="text-base">{groupEmoji}</span>
                        <span>Your group</span>
                    </div>

                    {/* Circular countdown ring */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle
                                cx="50" cy="50" r={RADIUS}
                                fill="none" stroke="var(--wr-track)" strokeWidth="7"
                            />
                            <circle
                                cx="50" cy="50" r={RADIUS}
                                fill="none"
                                stroke={timerColor}
                                strokeWidth="7"
                                strokeLinecap="round"
                                strokeDasharray={CIRC}
                                strokeDashoffset={dashoffset}
                                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
                            />
                        </svg>
                        <div className={`absolute inset-0 flex items-center justify-center ${isWarning ? "wf-timer-warn" : ""}`}>
                            <span
                                className="font-handwritten text-xl font-bold leading-none"
                                style={{ color: timerColor }}
                            >
                                {formatTime(secondsLeft)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Prompt card */}
                <div
                    className="rounded-xl p-4"
                    style={{
                        backgroundColor: "var(--wr-card)",
                        borderLeft: `4px solid ${groupColor}`,
                        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                    }}
                >
                    {promptImageUrl && (
                        <div className="rounded-lg overflow-hidden mb-3 aspect-video">
                            <img src={promptImageUrl} alt="Writing prompt" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <p className="text-[var(--text)] leading-relaxed">{promptText}</p>
                </div>

                {/* Suggestion toggles */}
                {(hasStarters || hasVocab) && (
                    <div className="flex gap-2">
                        {hasStarters && (
                            <button
                                type="button"
                                onClick={() => setActivePanel((v) => (v === "starters" ? null : "starters"))}
                                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border-2 transition-all duration-150"
                                style={{
                                    borderColor: groupColor,
                                    color: activePanel === "starters" ? "#fff" : groupColor,
                                    backgroundColor: activePanel === "starters" ? groupColor : "transparent",
                                }}
                            >
                                💬 Sentence Starters
                            </button>
                        )}
                        {hasVocab && (
                            <button
                                type="button"
                                onClick={() => setActivePanel((v) => (v === "vocab" ? null : "vocab"))}
                                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border-2 transition-all duration-150"
                                style={{
                                    borderColor: groupColor,
                                    color: activePanel === "vocab" ? "#fff" : groupColor,
                                    backgroundColor: activePanel === "vocab" ? groupColor : "transparent",
                                }}
                            >
                                📚 Vocabulary
                            </button>
                        )}
                    </div>
                )}

                {/* Starters panel */}
                {activePanel === "starters" && suggestions?.starters && (
                    <div
                        className="rounded-xl p-4 space-y-1.5"
                        style={{
                            backgroundColor: groupColor + "0e",
                            border: `1.5px solid ${groupColor}30`,
                        }}
                    >
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Tap to insert:
                        </p>
                        {suggestions.starters.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => insertStarter(s)}
                                className="block w-full text-left text-sm px-3 py-1.5 rounded-lg hover:opacity-80 transition-all text-[var(--text)]"
                                style={{ backgroundColor: "var(--wr-item)", border: `1px solid ${groupColor}30` }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Vocab panel */}
                {activePanel === "vocab" && suggestions?.vocab && (
                    <div
                        className="rounded-xl p-4"
                        style={{
                            backgroundColor: groupColor + "0e",
                            border: `1.5px solid ${groupColor}30`,
                        }}
                    >
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Useful words:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.vocab.map((v) => (
                                <span
                                    key={v}
                                    className="px-3 py-1 rounded-full text-sm font-medium"
                                    style={{ backgroundColor: "var(--wr-item)", color: groupColor, border: `1.5px solid ${groupColor}55` }}
                                >
                                    {v}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Journal-paper textarea */}
                <div
                    className="rounded-2xl transition-all duration-700"
                    style={{
                        border: `2px solid ${isWarning ? "#fca5a5" : "var(--wr-border)"}`,
                        boxShadow: isWarning
                            ? "0 0 0 4px #fee2e222, 0 2px 12px rgba(239,68,68,0.08)"
                            : "0 2px 12px rgba(0,0,0,0.05)",
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Start writing here…"
                        className="w-full px-5 text-[var(--text)] text-base resize-none focus:outline-none rounded-2xl"
                        style={{
                            minHeight: "420px",
                            backgroundImage:
                                "linear-gradient(to bottom, var(--wr-line) 1px, transparent 1px)",
                            backgroundSize: "100% 36px",
                            backgroundPosition: "0 32px",
                            backgroundAttachment: "local",
                            lineHeight: "36px",
                            paddingTop: "40px",
                            paddingBottom: "16px",
                            backgroundColor: "var(--wr-paper)",
                        }}
                        autoFocus
                    />
                </div>

                {/* Word count + submit button */}
                <div className="flex items-center justify-between pr-1">
                    {showWordCount ? (
                        <span className="font-handwritten text-lg" style={{ color: groupColor + "bb" }}>
                            {wordCount} {wordCount === 1 ? "word" : "words"}
                        </span>
                    ) : <span />}
                    {wordCount > 0 && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ backgroundColor: groupColor }}
                        >
                            {submitting ? "Saving…" : "Submit early →"}
                        </button>
                    )}
                </div>
                {submitError && (
                    <p className="text-center text-sm text-red-500">{submitError}</p>
                )}
            </div>
        </>
    );
}
