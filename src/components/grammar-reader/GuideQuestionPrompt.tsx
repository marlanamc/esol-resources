"use client";

import { MessageCircle } from "lucide-react";
import { ClassQuestionBox } from "@/components/dashboard/course-map-road/ClassQuestionBox";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";

/** End of a weekly grammar guide: ask about anything unclear, answered in class and shown on Home. */
export function GuideQuestionPrompt({ weekNumber }: { weekNumber: number }) {
    return (
        <section
            aria-labelledby="guide-question-title"
            className={`mx-4 my-5 rounded-[20px] p-4 font-legible sm:mx-6 ${roadStyles.road}`}
            style={{ border: "1px solid var(--border-subtle)", background: "var(--surface-base)" }}
        >
            <div className="mb-2 flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--road-neutral-chip)" }}>
                    <MessageCircle size={18} aria-hidden />
                </span>
                <span className="min-w-0">
                    <h2 id="guide-question-title" className="m-0 text-[1rem] font-bold text-text">
                        Something not clear?
                    </h2>
                    <p className="m-0 text-[0.8125rem] text-text-muted">Ask. We will talk about it in class.</p>
                </span>
            </div>
            <ClassQuestionBox weekNumber={weekNumber} accent="var(--success-color)" bare />
            <p className="m-0 mt-1 text-[0.8125rem] text-text-muted">Your questions and answers are on Home.</p>
        </section>
    );
}
