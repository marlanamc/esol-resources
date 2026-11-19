"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, MessageCircle, X } from "lucide-react";
import { ClassQuestionBox } from "@/components/dashboard/course-map-road/ClassQuestionBox";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";

/** A bottom sheet (a centered panel on wide screens) holding a week's questions for class. */
function QuestionsSheet({ open, onClose, weekNumber }: { open: boolean; onClose: () => void; weekNumber: number }) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={(event) => {
                // A click on the backdrop (the dialog box itself, outside the panel) closes it.
                if (event.target === event.currentTarget) onClose();
            }}
            aria-labelledby="class-questions-title"
            className={`mx-0 mt-auto mb-0 max-h-[88dvh] w-full max-w-none bg-transparent p-0 text-text backdrop:bg-black/40 sm:m-auto sm:max-w-lg ${roadStyles.road}`}
        >
            <div className="flex max-h-[88dvh] flex-col rounded-t-3xl bg-bg font-legible sm:rounded-3xl">
                <div aria-hidden className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full sm:hidden" style={{ background: "var(--road-rail)" }} />
                <div className="flex items-center gap-3 px-5 pt-2.5 pb-1 sm:pt-4">
                    <div className="min-w-0 flex-1">
                        <h2 id="class-questions-title" className="m-0 text-[1.125rem] font-bold">
                            Questions for class
                        </h2>
                        <p className="m-0 text-[0.8125rem] text-text-muted">Week {weekNumber} · English or your language</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "var(--road-neutral-chip)" }}
                    >
                        <X size={18} aria-hidden />
                    </button>
                </div>
                <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                    {/* Mounted only while open, so it loads the week's questions fresh each time. */}
                    {open ? <ClassQuestionBox weekNumber={weekNumber} accent="var(--success-color)" bare /> : null}
                </div>
            </div>
        </dialog>
    );
}

function useSheet(): [boolean, () => void, () => void] {
    const [open, setOpen] = useState(false);
    return [open, () => setOpen(true), () => setOpen(false)];
}

/** The row next to Class links: ask anytime, and a red dot when the teacher has answered. */
export function ClassQuestionsRow({ weekNumber, unseenAnswers }: { weekNumber: number; unseenAnswers: number }) {
    const [open, show, hide] = useSheet();
    return (
        <>
            <button
                type="button"
                onClick={show}
                aria-haspopup="dialog"
                className="flex min-h-14 w-full items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
                <MessageCircle size={18} aria-hidden className="shrink-0 text-text-muted" />
                <span className="min-w-0 flex-1">
                    <strong className="block text-[0.875rem] font-bold text-text">Questions for class</strong>
                    {unseenAnswers > 0 ? (
                        <span className="flex items-center gap-1.5 text-[0.8125rem] font-bold" style={{ color: "var(--road-done-text)" }}>
                            <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "var(--error-color)" }} />
                            {unseenAnswers === 1 ? "Your teacher answered!" : `Your teacher answered ${unseenAnswers} questions!`}
                        </span>
                    ) : (
                        <span className="block text-[0.8125rem] text-text-muted">Ask before class</span>
                    )}
                </span>
                <ChevronRight size={16} aria-hidden className="shrink-0 text-text-muted" />
            </button>
            <QuestionsSheet open={open} onClose={hide} weekNumber={weekNumber} />
        </>
    );
}

/** The slim line at the top of Home when an answer is waiting; opens that week's questions. */
export function ClassAnswerBanner({ count, weekNumber }: { count: number; weekNumber: number }) {
    const [open, show, hide] = useSheet();
    return (
        <div className={roadStyles.road}>
            <button
                type="button"
                onClick={show}
                aria-haspopup="dialog"
                className="flex min-h-12 w-full items-center gap-2.5 rounded-[14px] px-3.5 text-left font-legible"
                style={{ background: "var(--road-done-bg)", border: "1px solid color-mix(in srgb, var(--success-color) 30%, transparent)", color: "var(--road-done-text)" }}
            >
                <MessageCircle size={18} aria-hidden className="shrink-0" />
                <span className="min-w-0 flex-1 text-[0.9375rem] font-bold">
                    {count === 1 ? "Your teacher answered your question" : `Your teacher answered ${count} questions`}
                </span>
                <span className="text-[0.875rem] font-bold">Read</span>
                <ChevronRight size={16} aria-hidden className="shrink-0" />
            </button>
            <QuestionsSheet open={open} onClose={hide} weekNumber={weekNumber} />
        </div>
    );
}

