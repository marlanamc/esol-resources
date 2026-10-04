"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const RETRY_KEY = "offline-auto-retry";
const MAX_AUTO_RETRIES = 2;
const RETRY_DELAY_MS = 1500;
// Attempts older than this belong to an earlier visit, so the count starts over.
const RETRY_WINDOW_MS = 30_000;

function readAttempts(): number {
  try {
    const raw = sessionStorage.getItem(RETRY_KEY);
    if (!raw) return 0;
    const { count, at } = JSON.parse(raw) as { count: number; at: number };
    return Date.now() - at > RETRY_WINDOW_MS ? 0 : count;
  } catch {
    return 0;
  }
}

function writeAttempts(count: number) {
  try {
    sessionStorage.setItem(RETRY_KEY, JSON.stringify({ count, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

export default function OfflinePage() {
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    // The service worker serves this page at the URL the learner asked for (usually
    // /dashboard), so a reload retries that page once the network wakes up.
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scheduleReload = () => {
      const attempts = readAttempts();
      if (attempts >= MAX_AUTO_RETRIES) {
        setReconnecting(false);
        return;
      }
      setReconnecting(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        writeAttempts(attempts + 1);
        window.location.reload();
      }, RETRY_DELAY_MS);
    };

    if (navigator.onLine) scheduleReload();

    const handleOnline = () => {
      writeAttempts(0);
      scheduleReload();
    };
    window.addEventListener("online", handleOnline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <main className="min-h-dvh bg-bg flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-border/50 bg-white p-6 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-text mb-2">
          {reconnecting ? "Reconnecting…" : "You are offline"}
        </h1>
        <p className="text-sm text-text-muted mb-5">
          {reconnecting
            ? "Class Companion is trying to load again."
            : "Class Companion could not load this page without internet. Reconnect and try again."}
        </p>
        <Link
          href="/dashboard"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
