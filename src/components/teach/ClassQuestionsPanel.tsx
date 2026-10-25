"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TeacherClassQuestion } from "@/lib/learner/class-questions";

/** Questions learners sent from the course map, one week at a time. */
export function ClassQuestionsPanel({ classId, initialWeek }: { classId: string; initialWeek: number }) {
    const [week, setWeek] = useState(initialWeek);
    const [questions, setQuestions] = useState<TeacherClassQuestion[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setQuestions(null);
        setError(null);
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

    const mark = useCallback(
        async (ids: string[], answered: boolean) => {
            setError(null);
            const res = await fetch("/api/teacher/class-questions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId, ids, answered }),
            }).catch(() => null);
            if (!res?.ok) {
                setError("Could not save. Try again.");
                return;
            }
            setQuestions((list) => list?.map((q) => (ids.includes(q.id) ? { ...q, answered } : q)) ?? list);
        },
        [classId]
    );

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
                            <li key={q.id} className={`flex items-start gap-4 py-3 text-sm ${q.answered ? "opacity-60" : ""}`}>
                                <div className="min-w-0 flex-1">
                                    <p className="break-words">{q.text}</p>
                                    <p className="mt-1 text-text-muted">{q.studentName ?? "Name hidden"}</p>
                                </div>
                                <button type="button" className="workspace-button shrink-0" onClick={() => mark([q.id], !q.answered)}>
                                    {q.answered ? "Undo" : "Mark answered"}
                                </button>
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
