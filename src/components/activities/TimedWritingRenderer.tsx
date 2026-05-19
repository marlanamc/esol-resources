/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TimedWritingContent } from "@/types/activity";
import { submitWithOutbox } from "@/lib/submissionOutbox";
import { PointsToast } from "@/components/ui/PointsToast";
import dynamic from "next/dynamic";

const WritingSessionParticipant = dynamic(
    () => import("./writing-session/WritingSessionParticipant").then((m) => ({ default: m.WritingSessionParticipant })),
    { loading: () => <Spinner /> }
);
const WritingSessionHost = dynamic(
    () => import("./writing-session/WritingSessionHost").then((m) => ({ default: m.WritingSessionHost })),
    { loading: () => <Spinner /> }
);

function Spinner() {
    return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
        </div>
    );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface TimedWritingRendererProps {
    content: TimedWritingContent;
    activityId: string;
    assignmentId?: string | null;
    userRole?: string;
    existingSubmission?: { id: string; content: unknown; score: number | null } | null;
}

type SessionMode = "loading" | "solo" | "session-participant" | "session-host" | "start-session";
interface ActiveSessionInfo { id: string; status: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}
function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Start Session Panel ───────────────────────────────────────────────────────

function StartSessionPanel({
    activityId,
    onStart,
    starting,
    error,
    onSolo,
}: {
    activityId: string;
    onStart: (classId: string) => void;
    starting: boolean;
    error: string | null;
    onSolo: () => void;
}) {
    const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
    const [selectedClass, setSelectedClass] = useState("");

    useEffect(() => {
        fetch("/api/classes")
            .then((r) => r.json())
            .then((data: unknown) => {
                if (Array.isArray(data)) setClasses(data as { id: string; name: string }[]);
                else if (data && typeof data === "object" && Array.isArray((data as { classes?: unknown }).classes)) {
                    setClasses((data as { classes: { id: string; name: string }[] }).classes);
                }
            })
            .catch(() => {/* ignore */});
    }, [activityId]);

    return (
        <div className="max-w-lg mx-auto space-y-5 text-center">
            <div className="text-5xl">✏️</div>
            <h2 className="text-2xl font-bold text-[var(--text)]">Start a Live Writing Session</h2>
            <p className="text-gray-500 text-sm">Students will be assigned to anonymous animal groups and compete across rounds.</p>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 text-left">
                <label className="block text-sm font-medium text-gray-700">
                    Select Class
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                        <option value="">Choose a class…</option>
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </label>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="button"
                    onClick={() => selectedClass && onStart(selectedClass)}
                    disabled={!selectedClass || starting}
                    className="w-full py-3 px-6 bg-[var(--primary)] text-white rounded-xl font-semibold text-base hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {starting ? "Starting…" : "Start Live Session"}
                </button>
            </div>

            <button type="button" onClick={onSolo} className="text-sm text-gray-400 hover:text-gray-600 underline">
                Use solo mode instead
            </button>
        </div>
    );
}

// ── Solo Writing ──────────────────────────────────────────────────────────────

const SOLO_COLOR = "#d97757"; // var(--primary)
const SOLO_RADIUS = 40;
const SOLO_CIRC = 2 * Math.PI * SOLO_RADIUS;

function SoloWritingRenderer({
    content,
    activityId,
    assignmentId,
    existingSubmission,
}: {
    content: TimedWritingContent;
    activityId: string;
    assignmentId?: string | null;
    existingSubmission?: { id: string; content: unknown; score: number | null } | null;
}) {
    const router = useRouter();
    const [phase, setPhase] = useState<"ready" | "writing" | "done">(existingSubmission ? "done" : "ready");
    const [text, setText] = useState<string>(() => {
        if (existingSubmission && typeof existingSubmission.content === "object" && existingSubmission.content !== null) {
            const c = existingSubmission.content as Record<string, unknown>;
            return typeof c.text === "string" ? c.text : "";
        }
        return "";
    });
    const [secondsLeft, setSecondsLeft] = useState(content.timerSeconds);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasAutoSubmitted = useRef(false);

    const [showSuggestions, setShowSuggestions] = useState(false);

    const wordCount = countWords(text);
    const isWarning = secondsLeft <= 30 && secondsLeft > 0;
    const showWordCount = content.showWordCount !== false;
    const firstPrompt = content.prompts[0];
    const suggestions = firstPrompt?.suggestions;
    const hasStarters = (suggestions?.starters?.length ?? 0) > 0;
    const hasVocab = (suggestions?.vocab?.length ?? 0) > 0;
    const hasSuggestions = hasStarters || hasVocab;
    const timerColor = secondsLeft <= 30 ? "#ef4444" : secondsLeft <= 60 ? "#f97316" : SOLO_COLOR;
    const soloProgress = Math.max(0, Math.min(1, secondsLeft / content.timerSeconds));
    const soloDashoffset = SOLO_CIRC * (1 - soloProgress);

    const doSubmit = async (writtenText: string) => {
        if (isSubmitting || hasAutoSubmitted.current) return;
        hasAutoSubmitted.current = true;
        setIsSubmitting(true);
        setPhase("done");
        try {
            const submissionData = { text: writtenText, wordCount: countWords(writtenText), submittedAt: new Date().toISOString() };
            const submitResult = await submitWithOutbox({
                endpoint: "/api/activity/submit",
                method: "POST",
                payload: { activityId, assignmentId: assignmentId ?? null, content: submissionData, score: 100 },
            });
            if (submitResult.queued) return;
            const responseText = await submitResult.response.text();
            let responseData: { points?: number } = {};
            if (responseText.trim()) { try { responseData = JSON.parse(responseText); } catch { /* ignore */ } }
            if (submitResult.response.ok && responseData.points && responseData.points > 0) {
                setPointsToast({ points: responseData.points, key: Date.now() });
            }
            router.refresh();
        } catch (err) {
            console.error("Error submitting writing:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (phase !== "writing") return;
        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) { clearInterval(intervalRef.current!); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [phase]);

    useEffect(() => {
        if (phase === "writing" && secondsLeft === 0) doSubmit(text);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondsLeft, phase]);

    const insertStarter = (starter: string) => {
        setText((prev) => (prev ? `${prev} ${starter}` : starter));
        setShowSuggestions(false);
        setTimeout(() => textareaRef.current?.focus(), 50);
    };

    if (phase === "ready") {
        return (
            <>
                <style>{`
                    @keyframes sw-fadein {
                        from { opacity: 0; transform: translateY(10px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    .sw-fadein { animation: sw-fadein 0.4s ease-out both; }
                    :root { --wr-card: #ffffff; --wr-badge-bg: #f0e8e0; --wr-border: #f0e8e0; }
                    .dark  { --wr-card: #1e2d3e; --wr-badge-bg: #243040; --wr-border: #2d3f52; }
                `}</style>
                <div className="max-w-2xl mx-auto space-y-5 sw-fadein">
                    {firstPrompt?.imageUrl && (
                        <div className="rounded-2xl overflow-hidden shadow-md aspect-video">
                            <img src={firstPrompt.imageUrl} alt="Writing prompt" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div
                        className="rounded-2xl p-6 space-y-5"
                        style={{ backgroundColor: "var(--wr-card)", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1.5px solid var(--wr-border)" }}
                    >
                        <p className="text-lg leading-relaxed text-[var(--text)] font-display">
                            {firstPrompt?.text}
                        </p>
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                            style={{ backgroundColor: "var(--wr-badge-bg)", color: SOLO_COLOR }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                            </svg>
                            <span className="font-medium">{Math.round(content.timerSeconds / 60)} minutes</span>
                        </div>
                        <button
                            onClick={() => { setPhase("writing"); setTimeout(() => textareaRef.current?.focus(), 100); }}
                            className="w-full py-3.5 px-6 text-white rounded-xl font-semibold text-base hover:opacity-90 active:scale-95 transition-all"
                            style={{ backgroundColor: SOLO_COLOR }}
                        >
                            Start Writing ✏️
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (phase === "writing") {
        return (
            <>
                <style>{`
                    @keyframes sw-warn-pulse {
                        0%, 100% { opacity: 1; }
                        50%       { opacity: 0.55; }
                    }
                    @keyframes sw-panel-in {
                        from { opacity: 0; transform: translateX(-8px); }
                        to   { opacity: 1; transform: translateX(0); }
                    }
                    .sw-timer-warn { animation: sw-warn-pulse 0.8s ease-in-out infinite; }
                    .sw-panel-in   { animation: sw-panel-in 0.2s ease-out both; }
                    :root {
                        --wr-paper:  #fffcf8;
                        --wr-line:   #e8ddd0;
                        --wr-border: #e8ddd0;
                        --wr-track:  #f0e8e0;
                        --wr-card:   #ffffff;
                        --wr-panel:  #faf7f3;
                        --wr-item:   #ffffff;
                        --wr-prompt-text: #374151;
                    }
                    .dark {
                        --wr-paper:  #16202e;
                        --wr-line:   #243040;
                        --wr-border: #2d3f52;
                        --wr-track:  #243040;
                        --wr-card:   #1e2d3e;
                        --wr-panel:  #1a2535;
                        --wr-item:   #243040;
                        --wr-prompt-text: #cbd5e1;
                    }
                `}</style>
                <div className="max-w-4xl mx-auto space-y-3">
                    {/* Timer + prompt row */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            {firstPrompt?.imageUrl && (
                                <div className="rounded-xl overflow-hidden shadow-sm mb-2 w-full aspect-video">
                                    <img src={firstPrompt.imageUrl} alt="Writing prompt" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div
                                className="rounded-xl p-3"
                                style={{ backgroundColor: "var(--wr-card)", borderLeft: `4px solid ${SOLO_COLOR}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
                            >
                                <p className="text-sm leading-snug" style={{ color: "var(--wr-prompt-text)" }}>{firstPrompt?.text}</p>
                            </div>
                        </div>

                        {/* Circular timer */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r={SOLO_RADIUS} fill="none" stroke="var(--wr-track)" strokeWidth="7" />
                                <circle
                                    cx="50" cy="50" r={SOLO_RADIUS}
                                    fill="none"
                                    stroke={timerColor}
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                    strokeDasharray={SOLO_CIRC}
                                    strokeDashoffset={soloDashoffset}
                                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
                                />
                            </svg>
                            <div className={`absolute inset-0 flex items-center justify-center ${isWarning ? "sw-timer-warn" : ""}`}>
                                <span className="font-handwritten text-xl font-bold leading-none" style={{ color: timerColor }}>
                                    {formatTime(secondsLeft)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Writing area: suggestion panel + journal textarea */}
                    <div className="flex gap-3 items-stretch">
                        {/* Left suggestion panel */}
                        {hasSuggestions && (
                            <div
                                className="flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
                                style={{
                                    width: showSuggestions ? "200px" : "40px",
                                    backgroundColor: "var(--wr-panel)",
                                    border: `1.5px solid ${showSuggestions ? SOLO_COLOR + "50" : "var(--wr-border)"}`,
                                    boxShadow: showSuggestions ? `0 2px 12px ${SOLO_COLOR}15` : "none",
                                }}
                            >
                                {!showSuggestions ? (
                                    /* Collapsed tab */
                                    <button
                                        type="button"
                                        onClick={() => setShowSuggestions(true)}
                                        className="h-full w-full flex flex-col items-center justify-center gap-2 py-4 hover:bg-white/60 transition-colors"
                                        title="Show suggestions"
                                    >
                                        <span className="text-base">💡</span>
                                        <span
                                            className="text-xs font-semibold text-gray-400 uppercase tracking-wider select-none"
                                            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                                        >
                                            Help
                                        </span>
                                    </button>
                                ) : (
                                    /* Expanded panel */
                                    <div className="flex flex-col h-full sw-panel-in overflow-y-auto">
                                        <div
                                            className="flex items-center justify-between px-3 py-2.5 flex-shrink-0"
                                            style={{ borderBottom: `1px solid ${SOLO_COLOR}20` }}
                                        >
                                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: SOLO_COLOR }}>
                                                💡 Help
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowSuggestions(false)}
                                                className="text-gray-400 hover:text-gray-600 text-lg leading-none transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-3 space-y-4">
                                            {hasStarters && suggestions?.starters && (
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                                                        Starters
                                                    </p>
                                                    <div className="space-y-1.5">
                                                        {suggestions.starters.map((s) => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => insertStarter(s)}
                                                                className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-all"
                                                                style={{
                                                                    backgroundColor: "var(--wr-item)",
                                                                    color: "var(--text)",
                                                                    border: `1px solid ${SOLO_COLOR}30`,
                                                                }}
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {hasVocab && suggestions?.vocab && (
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                                                        Vocabulary
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {suggestions.vocab.map((v) => (
                                                            <span
                                                                key={v}
                                                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                                                style={{
                                                                    backgroundColor: "var(--wr-item)",
                                                                    color: SOLO_COLOR,
                                                                    border: `1.5px solid ${SOLO_COLOR}45`,
                                                                }}
                                                            >
                                                                {v}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Journal textarea — full height */}
                        <div
                            className="flex-1 rounded-2xl transition-all duration-700"
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
                                disabled={isSubmitting}
                                placeholder="Start writing here…"
                                className="w-full px-5 text-[var(--text)] text-base resize-none focus:outline-none disabled:opacity-60 rounded-2xl"
                                style={{
                                    minHeight: "580px",
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
                            />
                        </div>
                    </div>

                    {showWordCount && (
                        <div className="flex justify-end pr-1">
                            <span className="font-handwritten text-lg" style={{ color: SOLO_COLOR + "bb" }}>
                                {wordCount} {wordCount === 1 ? "word" : "words"}
                            </span>
                        </div>
                    )}
                </div>
            </>
        );
    }

    // done
    return (
        <>
            <style>{`
                :root { --wr-card: #ffffff; --wr-panel: #faf7f3; --wr-border: #f0e8e0; }
                .dark  { --wr-card: #1e2d3e; --wr-panel: #1a2535; --wr-border: #2d3f52; }
            `}</style>
            <div className="max-w-2xl mx-auto space-y-4">
                {pointsToast && <PointsToast key={pointsToast.key} points={pointsToast.points} onComplete={() => setPointsToast(null)} />}
                <div
                    className="rounded-2xl p-8 text-center space-y-3"
                    style={{ backgroundColor: "var(--wr-card)", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1.5px solid var(--wr-border)" }}
                >
                    <div className="text-5xl mb-1">✏️</div>
                    <h2 className="text-2xl font-display font-bold text-[var(--text)]">Writing submitted!</h2>
                    <p className="font-handwritten text-xl" style={{ color: SOLO_COLOR }}>
                        {countWords(text) > 0
                            ? `${countWords(text)} ${countWords(text) === 1 ? "word" : "words"} written ✓`
                            : "Your writing has been saved."}
                    </p>
                </div>
                {text.trim().length > 0 && (
                    <div
                        className="rounded-2xl p-5"
                        style={{ backgroundColor: "var(--wr-panel)", border: "1.5px solid var(--wr-border)" }}
                    >
                        <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest font-semibold">Your writing</p>
                        <p className="text-[var(--text)] leading-relaxed whitespace-pre-wrap text-sm">{text}</p>
                    </div>
                )}
            </div>
        </>
    );
}

// ── Main Renderer (session orchestrator) ─────────────────────────────────────

export default function TimedWritingRenderer({ content, activityId, assignmentId, userRole, existingSubmission }: TimedWritingRendererProps) {
    const [sessionMode, setSessionMode] = useState<SessionMode>("loading");
    const [activeSession, setActiveSession] = useState<ActiveSessionInfo | null>(null);
    const [startingSession, setStartingSession] = useState(false);
    const [startError, setStartError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/writing-session/active?activityId=${activityId}`)
            .then((r) => r.ok ? r.json() : Promise.resolve({ session: null }))
            .then((data: { session: ActiveSessionInfo | null }) => {
                if (data.session) {
                    setActiveSession(data.session);
                    setSessionMode(userRole === "teacher" ? "session-host" : "session-participant");
                } else {
                    setSessionMode(userRole === "teacher" ? "start-session" : "solo");
                }
            })
            .catch(() => setSessionMode("solo"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityId]);

    const handleStartSession = async (classId: string) => {
        setStartingSession(true);
        setStartError(null);
        try {
            const res = await fetch("/api/writing-session/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activityId, classId }),
            });
            const data = await res.json() as { sessionId?: string; error?: string };
            if (!res.ok || !data.sessionId) { setStartError(data.error ?? "Failed to start session"); return; }
            setActiveSession({ id: data.sessionId, status: "waiting" });
            setSessionMode("session-host");
        } catch {
            setStartError("Network error");
        } finally {
            setStartingSession(false);
        }
    };

    if (sessionMode === "loading") return <Spinner />;

    if (sessionMode === "session-participant" && activeSession) {
        return <WritingSessionParticipant sessionId={activeSession.id} content={content} />;
    }
    if (sessionMode === "session-host" && activeSession) {
        const handleResetSession = async () => {
            await fetch(`/api/writing-session/${activeSession.id}/end`, { method: "POST" }).catch(() => {/* ignore */});
            setActiveSession(null);
            setSessionMode("start-session");
        };
        return (
            <WritingSessionHost
                sessionId={activeSession.id}
                content={content}
                onSessionEnd={() => setSessionMode("start-session")}
                onResetSession={handleResetSession}
            />
        );
    }
    if (sessionMode === "start-session") {
        return <StartSessionPanel activityId={activityId} onStart={handleStartSession} starting={startingSession} error={startError} onSolo={() => setSessionMode("solo")} />;
    }

    // Solo mode
    return <SoloWritingRenderer content={content} activityId={activityId} assignmentId={assignmentId} existingSubmission={existingSubmission} />;
}
