"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSubmissionOutboxSnapshot, isSubmissionOutboxEnabled, replayQueuedSubmissions, submissionOutboxEventName, submissionSavedEventName } from "@/lib/submissionOutbox";
import type { SubmissionOutboxSnapshot } from "@/types/pwa";

export default function SubmissionOutboxManager() {
  const { data: session } = useSession();
  const [snapshot, setSnapshot] = useState<SubmissionOutboxSnapshot>({ pending: 0, failed: 0, syncing: false });
  const [confirmation, setConfirmation] = useState<string | null>(null);
  useEffect(() => {
    if (!isSubmissionOutboxEnabled) return;
    let noticeTimer: ReturnType<typeof setTimeout>;
    const update = () => setSnapshot(getSubmissionOutboxSnapshot());
    const saved = (event: Event) => {
      const points = (event as CustomEvent<{ points: number }>).detail.points;
      setConfirmation(points > 0 ? `Saved · +${points} points` : "Work saved");
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => setConfirmation(null), 6000);
    };
    const replay = () => { void replayQueuedSubmissions(); };
    window.addEventListener(submissionOutboxEventName, update);
    window.addEventListener(submissionSavedEventName, saved);
    window.addEventListener("online", replay);
    document.addEventListener("visibilitychange", replay);
    // Item-specific backoff controls actual requests; hidden/offline tabs do no work.
    const timer = setInterval(replay, 10000);
    const startup = setTimeout(() => { update(); replay(); }, 500);
    return () => {
      clearTimeout(startup); clearTimeout(noticeTimer); clearInterval(timer);
      window.removeEventListener(submissionOutboxEventName, update);
      window.removeEventListener(submissionSavedEventName, saved);
      window.removeEventListener("online", replay);
      document.removeEventListener("visibilitychange", replay);
    };
  }, [session?.user?.id]);
  if (!isSubmissionOutboxEnabled || !session?.user?.id) return null;
  if (!snapshot.pending && !snapshot.failed && !snapshot.unassigned && !snapshot.syncing && !confirmation) return null;
  return <div className="fixed left-4 right-4 bottom-24 md:bottom-4 z-[9998] md:max-w-sm md:left-auto">
    <div role="status" aria-live="polite" className="rounded-xl border bg-bg p-3 shadow-lg text-text">
      <p className="text-sm font-medium">{snapshot.syncing ? "Saving your work…" : snapshot.pending
        ? "Waiting to reconnect. Your work is saved on this device."
        : snapshot.failed ? "Your work still needs to be sent. Try again, or ask your teacher." : snapshot.unassigned ? "Earlier work is saved on this device. Ask your teacher to help check which account it belongs to." : confirmation}</p>
      {(snapshot.pending > 0 || snapshot.failed > 0) && !snapshot.syncing && <button type="button"
        onClick={() => void replayQueuedSubmissions(true)} className="mt-2 min-h-[44px] rounded-lg bg-primary text-white px-3 py-2 text-sm font-semibold">
        Try saving again
      </button>}
    </div>
  </div>;
}
