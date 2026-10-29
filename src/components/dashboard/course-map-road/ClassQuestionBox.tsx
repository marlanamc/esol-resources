"use client";

import { createContext, useContext, useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { Check, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { MAX_QUESTION_LENGTH, type StudentClassQuestion } from "@/lib/learner/class-questions";
import { refreshQuestionAnswerViews } from "@/app/dashboard/map/actions";

/** True when the viewer is a classroom learner whose questions reach a teacher. */
const ClassQuestionsContext = createContext(false);

export function ClassQuestionsProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
    return <ClassQuestionsContext.Provider value={enabled}>{children}</ClassQuestionsContext.Provider>;
}

export function useClassQuestionsEnabled(): boolean {
    return useContext(ClassQuestionsContext);
}

const BORDER = "1px solid color-mix(in srgb, var(--road-rail) 45%, transparent)";

async function readError(res: Response): Promise<string> {
    const data = await res.json().catch(() => null);
    return typeof data?.error === "string" ? data.error : "Something went wrong. Try again.";
}

/** "My question for class": learners send questions before class and see when they're answered. */
export function ClassQuestionBox({
    weekNumber,
    accent,
    bare = false,
}: {
    weekNumber: number;
    accent: string;
    /** No border or background, for a caller that already draws the card. */
    bare?: boolean;
}) {
    const inputId = useId();
    const [questions, setQuestions] = useState<StudentClassQuestion[]>([]);
    const [text, setText] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch(`/api/class-questions?week=${weekNumber}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled && Array.isArray(data?.questions)) setQuestions(data.questions);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [weekNumber]);

    function resetForm() {
        setText("");
        setAnonymous(false);
        setEditingId(null);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        if (!text.trim() || busy) return;
        setBusy(true);
        setError(null);
        try {
            const res = editingId
                ? await fetch(`/api/class-questions/${editingId}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ text, anonymous }),
                  })
                : await fetch("/api/class-questions", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ weekNumber, text, anonymous }),
                  });
            if (!res.ok) {
                setError(await readError(res));
                return;
            }
            const { question } = (await res.json()) as { question: StudentClassQuestion };
            setQuestions((list) => (editingId ? list.map((q) => (q.id === question.id ? question : q)) : [...list, question]));
            resetForm();
        } catch {
            setError("Something went wrong. Try again.");
        } finally {
            setBusy(false);
        }
    }

    async function remove(id: string) {
        setError(null);
        const res = await fetch(`/api/class-questions/${id}`, { method: "DELETE" }).catch(() => null);
        if (!res?.ok) {
            setError(res ? await readError(res) : "Something went wrong. Try again.");
            return;
        }
        setQuestions((list) => list.filter((q) => q.id !== id));
        if (editingId === id) resetForm();
    }

    async function markSeen(id: string) {
        const res = await fetch("/api/class-questions/answer-seen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId: id }),
        }).catch(() => null);
        if (!res?.ok) return;
        setQuestions((list) => list.map((q) => (q.id === id ? { ...q, seen: true } : q)));
        // Clears the "Your teacher answered" line on home; a failed refresh only waits for a reload.
        refreshQuestionAnswerViews().catch(() => {});
    }

    function startEdit(question: StudentClassQuestion) {
        setEditingId(question.id);
        setText(question.text);
        setAnonymous(question.anonymous);
        setError(null);
    }

    return (
        <div className={bare ? undefined : "rounded-[14px] p-3"} style={bare ? undefined : { border: BORDER, background: "var(--surface-base)" }}>
            <form onSubmit={submit}>
                <label htmlFor={inputId} className="block text-[0.9375rem] font-semibold text-text">
                    {editingId ? "Edit my question" : "My question for class"}
                </label>
                <div className="mt-1.5 flex gap-2">
                    <input
                        id={inputId}
                        type="text"
                        value={text}
                        maxLength={MAX_QUESTION_LENGTH}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="English or your language"
                        className="min-h-[44px] min-w-0 flex-1 rounded-[10px] px-3 text-[0.9375rem] text-text"
                        style={{ border: BORDER, background: "var(--bg-color)" }}
                    />
                    <button
                        type="submit"
                        disabled={busy || !text.trim()}
                        className="min-h-[44px] shrink-0 rounded-[10px] px-4 text-[0.9375rem] font-bold disabled:opacity-50"
                        style={{ background: accent, color: "var(--road-on-accent)" }}
                    >
                        {editingId ? "Save" : "Send"}
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <label className="flex min-h-[32px] items-center gap-2 text-[0.8125rem] text-text-muted">
                        <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="h-4 w-4" />
                        Don&apos;t show my name
                    </label>
                    {editingId ? (
                        <button type="button" onClick={resetForm} className="min-h-[32px] text-[0.8125rem] font-semibold text-text-muted underline">
                            Cancel
                        </button>
                    ) : null}
                </div>
                <p role="status" aria-live="polite" className="m-0 text-[0.8125rem] font-semibold" style={{ color: "var(--error-color)" }}>
                    {error}
                </p>
            </form>

            {questions.length > 0 ? (
                <ul className="m-0 mt-2 list-none p-0">
                    {questions.map((question) => (
                        <li key={question.id} className="flex items-start gap-2 py-2" style={{ borderTop: BORDER }}>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[0.875rem] leading-snug text-text">{question.text}</span>
                                <span
                                    className="mt-0.5 inline-flex items-center gap-1 text-[0.75rem] font-bold"
                                    style={{ color: question.answered ? "var(--road-done-text)" : "var(--text-muted)" }}
                                >
                                    {question.answered ? <Check size={12} strokeWidth={3} aria-hidden /> : null}
                                    {question.answered ? (question.reply ? "Answered" : "Answered in class") : "Sent"}
                                    {question.anonymous ? " · name hidden" : ""}
                                </span>
                                {question.answered ? <ClassQuestionAnswer question={question} onSeen={() => markSeen(question.id)} /> : null}
                            </span>
                            {question.answered ? null : (
                                <span className="flex shrink-0 gap-1">
                                    <button
                                        type="button"
                                        onClick={() => startEdit(question)}
                                        aria-label="Edit question"
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted"
                                    >
                                        <Pencil size={15} aria-hidden />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remove(question.id)}
                                        aria-label="Delete question"
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted"
                                    >
                                        <Trash2 size={15} aria-hidden />
                                    </button>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

/** The teacher's answer under a question: their written reply, if any. New answers have a "Thanks!" button that marks them seen. */
function ClassQuestionAnswer({ question, onSeen }: { question: StudentClassQuestion; onSeen: () => Promise<void> }) {
    const [busy, setBusy] = useState(false);
    if (question.seen && !question.reply) return null;

    async function thank() {
        if (busy) return;
        setBusy(true);
        try {
            await onSeen();
        } finally {
            setBusy(false);
        }
    }

    return (
        <span
            className={`mt-1.5 block rounded-xl border-l-4 px-3 py-2 ${
                question.seen ? "border-border bg-bg" : "border-emerald-700 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40"
            }`}
        >
            <span className="flex items-start gap-2 text-[0.875rem] leading-snug text-text">
                <MessageCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-emerald-800 dark:text-emerald-300" />
                <span className="min-w-0 break-words">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">Teacher: </span>
                    {question.reply ?? "I answered your question in class."}
                </span>
            </span>
            {question.seen ? null : (
                <button
                    type="button"
                    onClick={thank}
                    disabled={busy}
                    className="mt-2 flex min-h-11 items-center gap-1.5 rounded-lg bg-emerald-700! px-3 text-sm font-bold text-[#fffdfa] disabled:opacity-60 dark:bg-emerald-600!"
                >
                    <Check size={16} strokeWidth={2.6} aria-hidden />
                    Thanks!
                </button>
            )}
        </span>
    );
}
