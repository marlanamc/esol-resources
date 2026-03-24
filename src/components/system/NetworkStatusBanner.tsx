"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

/** Ignore brief `offline` events — browsers often fire them without real loss of connectivity. */
const OFFLINE_SHOW_AFTER_MS = 2800;
/** Desktop (fine pointer) tends to report offline more aggressively; wait longer before probing. */
const OFFLINE_SHOW_AFTER_MS_DESKTOP = 4500;
/** Wait before treating `online` as stable (reduces offline/online ping-pong). */
const ONLINE_STABLE_AFTER_MS = 600;
/** Same-origin check: if this succeeds, we do not show offline (navigator was wrong). */
const REACHABILITY_URL = "/manifest.json";

function getOfflineDelayMs(): number {
  if (typeof window === "undefined") return OFFLINE_SHOW_AFTER_MS;
  return window.matchMedia("(pointer: coarse)").matches
    ? OFFLINE_SHOW_AFTER_MS
    : OFFLINE_SHOW_AFTER_MS_DESKTOP;
}

async function checkSiteReachable(signal: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${window.location.origin}${REACHABILITY_URL}`, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      signal,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);
  const offlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userSawOfflineRef = useRef(false);
  const fetchProbeAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const clearTimer = (ref: MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
      if (ref.current !== null) {
        clearTimeout(ref.current);
        ref.current = null;
      }
    };

    const cancelOfflineProbe = () => {
      clearTimer(offlineTimerRef);
      fetchProbeAbortRef.current?.abort();
      fetchProbeAbortRef.current = null;
    };

    const showOffline = () => {
      clearTimer(onlineTimerRef);
      userSawOfflineRef.current = true;
      setIsOnline(false);
      setShowRestored(false);
    };

    const showOnlineStable = () => {
      cancelOfflineProbe();
      onlineTimerRef.current = setTimeout(() => {
        onlineTimerRef.current = null;
        if (typeof navigator === "undefined" || !navigator.onLine) return;
        setIsOnline(true);
        if (userSawOfflineRef.current) {
          userSawOfflineRef.current = false;
          setShowRestored(true);
          clearTimer(restoredTimerRef);
          restoredTimerRef.current = setTimeout(() => {
            restoredTimerRef.current = null;
            setShowRestored(false);
          }, 2500);
        }
      }, ONLINE_STABLE_AFTER_MS);
    };

    const scheduleOfflineCheck = () => {
      cancelOfflineProbe();
      const delayMs = getOfflineDelayMs();

      offlineTimerRef.current = setTimeout(() => {
        offlineTimerRef.current = null;
        if (typeof navigator !== "undefined" && navigator.onLine) return;

        const fetchAc = new AbortController();
        fetchProbeAbortRef.current = fetchAc;
        const timeoutId = window.setTimeout(() => fetchAc.abort(), 2800);

        void checkSiteReachable(fetchAc.signal)
          .then((reachable) => {
            window.clearTimeout(timeoutId);
            if (fetchProbeAbortRef.current !== fetchAc) return;
            if (typeof navigator !== "undefined" && navigator.onLine) return;
            if (reachable) return;
            showOffline();
          })
          .catch(() => {
            window.clearTimeout(timeoutId);
          })
          .finally(() => {
            if (fetchProbeAbortRef.current === fetchAc) {
              fetchProbeAbortRef.current = null;
            }
          });
      }, delayMs);
    };

    const handleOffline = () => {
      scheduleOfflineCheck();
    };

    const handleOnline = () => {
      cancelOfflineProbe();
      showOnlineStable();
    };

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      scheduleOfflineCheck();
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      cancelOfflineProbe();
      clearTimer(onlineTimerRef);
      clearTimer(restoredTimerRef);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] px-3 pt-2">
      <div
        className={`mx-auto max-w-2xl rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-md ${
          isOnline ? "bg-secondary" : "bg-warning"
        }`}
        role="status"
        aria-live="polite"
      >
        {isOnline ? "Back online. Sending any saved work now." : "You are offline. Work will be saved and sent when reconnected."}
      </div>
    </div>
  );
}
