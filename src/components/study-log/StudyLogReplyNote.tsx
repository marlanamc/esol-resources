"use client";

import { useState } from "react";
import { Check, MessageCircle, ThumbsUp } from "lucide-react";
import { diffRecastWords, type StudyLogEntry, type StudyLogReply } from "@/lib/learner/study-log";
import { refreshPracticeViews } from "@/app/dashboard/practice/actions";

/**
 * The teacher's reply under a learner's sentence: their sentence rewritten correctly with the
 * fixed words in bold, or a thumbs-up. Unread replies have a button that marks them read.
 */
export function StudyLogReplyNote({ entry, reply }: { entry: StudyLogEntry; reply: StudyLogReply }) {
    const [seen, setSeen] = useState(reply.seen);
    const [busy, setBusy] = useState(false);

    async function markSeen() {
        if (busy) return;
        setBusy(true);
        try {
            const res = await fetch("/api/study-log/reply-seen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logId: entry.id }),
            });
            if (res.ok) {
                setSeen(true);
                // Clears the "Your teacher replied" line on home; a failed refresh only waits for a reload.
                refreshPracticeViews().catch(() => {});
            }
        } finally {
            setBusy(false);
        }
    }

    const recast = reply.kind === "recast" && reply.text;
    return (
        <div
            className={`rounded-xl border-l-4 px-3 py-2 ${
                seen
                    ? "border-border bg-bg"
                    : "border-emerald-700 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40"
            }`}
        >
            <p className="m-0 flex items-start gap-2 text-[0.9375rem] leading-snug text-text">
                {recast ? (
                    <MessageCircle size={17} aria-hidden className="mt-0.5 shrink-0 text-emerald-800 dark:text-emerald-300" />
                ) : (
                    <ThumbsUp size={17} aria-hidden className="mt-0.5 shrink-0 text-emerald-800 dark:text-emerald-300" />
                )}
                <span className="min-w-0 break-words">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">Teacher: </span>
                    {recast
                        ? diffRecastWords(entry.text, reply.text!).map((part, i) => (
                              <span key={i}>
                                  {part.space ? " " : ""}
                                  {part.changed ? (
                                      <b className="rounded bg-amber-100 px-0.5 text-amber-950 dark:bg-amber-900/60 dark:text-amber-50">{part.word}</b>
                                  ) : (
                                      part.word
                                  )}
                              </span>
                          ))
                        : "Great sentence!"}
                </span>
            </p>
            {seen ? (
                <p className="m-0 mt-1 flex items-center gap-1 text-xs text-text-muted">
                    <Check size={13} aria-hidden /> Read
                </p>
            ) : (
                <button
                    type="button"
                    onClick={markSeen}
                    disabled={busy}
                    className="mt-2 flex min-h-11 items-center gap-1.5 rounded-lg bg-emerald-700! px-3 text-sm font-bold text-[#fffdfa] disabled:opacity-60 dark:bg-emerald-600!"
                >
                    <Check size={16} strokeWidth={2.6} aria-hidden />
                    {recast ? "Got it!" : "Thanks!"}
                </button>
            )}
        </div>
    );
}
