"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_REPLY_LENGTH, type TeacherClassQuestion } from "@/lib/learner/class-questions";
import { useAdjustTabCount } from "@/components/teach/TeachHomeTabs";

/** Questions learners sent from the course map, one week at a time. */
export function ClassQuestionsPanel({ classId, initialWeek }: { classId: string; initialWeek: number }) {
    const [week, setWeek] = useState(initialWeek);
    const [questions, setQuestions] = useState<TeacherClassQuestion[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyDraft, setReplyDraft] = useState("");
    const adjustTabCount = useAdjustTabCount();

    useEffect(() => {
        let cancelled = false;
        setQuestions(null);
        setError(null);
        setReplyingId(null);
        fetch(`/api/teacher/class-questions?classId=${encodeURIComponent(classId)}&week=${week}`)
            .then(async (res) => {
                const data = await res.json().catch(() => null);
                if (cancelled) return;
                if (!res.ok || !Array.isArray(data?.questions)) setError("Could not load questions.");
                else setQuestions(data.questions);
            })
            .catch(() => !cancelled && setError("Could not load questions."));
        return () => {
            cancelled = true;
        };
    }, [classId, week]);

    /** Saves answered (and, for one question, an optional reply). Learners are told about every new answer. */
    const mark = useCallback(
        async (ids: string[], answered: boolean, reply?: string): Promise<boolean> => {
            setError(null);
            const res = await fetch("/api/teacher/class-questions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId, ids, answered, ...(reply !== undefined ? { reply } : {}) }),
            }).catch(() => null);
            if (!res?.ok) {
                const data = await res?.json().catch(() => null);
                setError(typeof data?.error === "string" ? data.error : "Could not save. Try again.");
                return false;
            }
            const flipped = questions?.filter((q) => ids.includes(q.id) && q.answered !== answered).length ?? 0;
            adjustTabCount(answered ? -flipped : flipped);
            setQuestions(
                (list) =>
                    list?.map((q) => {
                        if (!ids.includes(q.id)) return q;
                        if (!answered) return { ...q, answered, reply: null, seen: false };
                        return { ...q, answered, seen: false, ...(reply !== undefined ? { reply: reply.trim() || null } : {}) };
                    }) ?? list
            );
            return true;
        },
        [classId, questions, adjustTabCount]
    );

    function startReply(q: TeacherClassQuestion) {
        setReplyingId(q.id);
        setReplyDraft(q.reply ?? "");
    }

    async function saveReply(id: string) {
        if (await mark([id], true, replyDraft)) setReplyingId(null);
    }

    const open = questions?.filter((q) => !q.answered) ?? [];

    return (
        <section className="workspace-panel space-y-4" aria-labelledby="class-questions-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 id="class-questions-heading" className="font-display text-xl font-bold">
                        Questions for class
                    </h2>
                    <p className="text-sm text-text-muted">
                        {questions == null ? "Loading…" : open.length > 0 ? `${open.length} new` : "No new questions"}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="workspace-button"
                        onClick={() => setWeek((w) => Math.max(1, w - 1))}
                        disabled={week <= 1}
                        aria-label="Previous week"
                    >
                        <ChevronLeft size={16} aria-hidden />
                    </button>
                    <span className="min-w-[5.5rem] text-center text-sm font-semibold">Week {week}</span>
                    <button type="button" className="workspace-button" onClick={() => setWeek((w) => w + 1)} aria-label="Next week">
                        <ChevronRight size={16} aria-hidden />
                    </button>
                </div>
            </div>

            {error ? (
                <p role="alert" className="text-sm font-semibold text-error">
                    {error}
                </p>
            ) : null}

            {questions && questions.length > 0 ? (
                <>
                    <ul className="divide-y divide-border border-y border-border">
                        {questions.map((q) => (
                            <li key={q.id} className="py-3 text-sm">
                                <div className="flex items-start gap-4">
                                    <div className={`min-w-0 flex-1 ${q.answered && replyingId !== q.id ? "opacity-60" : ""}`}>
                                        <p className="break-words">{q.text}</p>
                                        <p className="mt-1 text-text-muted">{q.studentName ?? "Name hidden"}</p>
                                        {q.reply && replyingId !== q.id ? (
                                            <p className="mt-2 break-words border-l-2 border-border pl-2">
                                                <span className="font-semibold">You: </span>
                                                {q.reply}
                                            </p>
                                        ) : null}
                                        {q.answered && q.seen ? (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                                                <Check size={12} aria-hidden /> Seen
                                            </p>
                                        ) : null}
                                    </div>
                                    {replyingId === q.id ? null : (
                                        <div className="flex shrink-0 gap-2">
                                            <button type="button" className="workspace-button" onClick={() => startReply(q)}>
                                                {q.reply ? "Edit reply" : "Reply"}
                                            </button>
                                            <button type="button" className="workspace-button" onClick={() => mark([q.id], !q.answered)}>
                                                {q.answered ? "Undo" : "Mark answered"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {replyingId === q.id ? (
                                    <form
                                        className="mt-2 space-y-2"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            void saveReply(q.id);
                                        }}
                                    >
                                        <label className="sr-only" htmlFor={`reply-${q.id}`}>
                                            Reply to this question
                                        </label>
                                        <textarea
                                            id={`reply-${q.id}`}
                                            value={replyDraft}
                                            maxLength={MAX_REPLY_LENGTH}
                                            rows={2}
                                            autoFocus
                                            onChange={(event) => setReplyDraft(event.target.value)}
                                            placeholder="One or two short sentences. The student sees this when they open the app."
                                            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="workspace-button">
                                                Send and mark answered
                                            </button>
                                            <button type="button" className="workspace-button" onClick={() => setReplyingId(null)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                    {open.length > 1 ? (
                        <button type="button" className="workspace-button" onClick={() => mark(open.map((q) => q.id), true)}>
                            Mark all answered
                        </button>
                    ) : null}
                </>
            ) : questions ? (
                <p className="text-sm text-text-muted">Students haven&apos;t sent questions for this week yet.</p>
            ) : null}
        </section>
    );
}
