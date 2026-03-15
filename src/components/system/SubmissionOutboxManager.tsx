"use client";

import { useEffect, useState } from "react";
import {
  getSubmissionOutboxSnapshot,
  isSubmissionOutboxEnabled,
  replayQueuedSubmissions,
  submissionOutboxEventName,
} from "@/lib/submissionOutbox";
import type { SubmissionOutboxSnapshot } from "@/types/pwa";

export default function SubmissionOutboxManager() {
  const [snapshot, setSnapshot] = useState<SubmissionOutboxSnapshot>(() => getSubmissionOutboxSnapshot());
  const [showSyncedMessage, setShowSyncedMessage] = useState(false);

  useEffect(() => {
    if (!isSubmissionOutboxEnabled) return;

    const handleOutboxUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<SubmissionOutboxSnapshot>;
      if (customEvent.detail) {
        const nextSnapshot = customEvent.detail;
        setSnapshot(nextSnapshot);
        if (!nextSnapshot.syncing && nextSnapshot.pending === 0 && nextSnapshot.failed === 0) {
          setShowSyncedMessage(true);
          window.setTimeout(() => setShowSyncedMessage(false), 2500);
        }
      }
    };

    const handleReplay = () => {
      void replayQueuedSubmissions();
    };

    const VISIBILITY_DELAY_MS = 300;
    let visibilityTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (visibilityTimeoutId) clearTimeout(visibilityTimeoutId);
      visibilityTimeoutId = setTimeout(() => {
        visibilityTimeoutId = null;
        handleReplay();
      }, VISIBILITY_DELAY_MS);
    };

    window.addEventListener(submissionOutboxEventName, handleOutboxUpdate);
    window.addEventListener("online", handleReplay);
    window.addEventListener("focus", handleReplay);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    void replayQueuedSubmissions();

    return () => {
      if (visibilityTimeoutId) clearTimeout(visibilityTimeoutId);
      window.removeEventListener(submissionOutboxEventName, handleOutboxUpdate);
      window.removeEventListener("online", handleReplay);
      window.removeEventListener("focus", handleReplay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!isSubmissionOutboxEnabled) return null;

  const hasQueueItems = snapshot.pending > 0 || snapshot.failed > 0;
  if (!hasQueueItems && !showSyncedMessage) return null;

  return (
    <div className="fixed left-4 right-4 bottom-24 md:bottom-4 z-[9998] md:max-w-sm md:left-auto">
      <div className="rounded-xl border bg-white/95 backdrop-blur p-3 shadow-lg">
        {snapshot.syncing ? (
          <p className="text-sm font-medium text-text">Sending saved work…</p>
        ) : hasQueueItems ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-text">
              {snapshot.pending > 0
                ? `${snapshot.pending} submission${snapshot.pending === 1 ? "" : "s"} waiting to send`
                : `${snapshot.failed} submission${snapshot.failed === 1 ? "" : "s"} need retry`}
            </p>
            <button
              type="button"
              onClick={() => void replayQueuedSubmissions()}
              className="min-h-[44px] rounded-lg bg-primary text-white px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            >
              Try again now
            </button>
          </div>
        ) : (
          <p className="text-sm font-medium text-success">Saved work sent.</p>
        )}
      </div>
    </div>
  );
}
