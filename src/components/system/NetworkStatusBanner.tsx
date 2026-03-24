"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

/** Ignore brief `offline` events — browsers often fire them without real loss of connectivity. */
const OFFLINE_SHOW_AFTER_MS = 2800;
/** Wait before treating `online` as stable (reduces offline/online ping-pong). */
const ONLINE_STABLE_AFTER_MS = 600;

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);
  const offlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userSawOfflineRef = useRef(false);

  useEffect(() => {
    const clearTimer = (ref: MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
      if (ref.current !== null) {
        clearTimeout(ref.current);
        ref.current = null;
      }
    };

    const showOffline = () => {
      clearTimer(onlineTimerRef);
      userSawOfflineRef.current = true;
      setIsOnline(false);
      setShowRestored(false);
    };

    const showOnlineStable = () => {
      clearTimer(offlineTimerRef);
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
      clearTimer(offlineTimerRef);
      offlineTimerRef.current = setTimeout(() => {
        offlineTimerRef.current = null;
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          showOffline();
        }
      }, OFFLINE_SHOW_AFTER_MS);
    };

    const handleOffline = () => {
      scheduleOfflineCheck();
    };

    const handleOnline = () => {
      clearTimer(offlineTimerRef);
      showOnlineStable();
    };

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      scheduleOfflineCheck();
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      clearTimer(offlineTimerRef);
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
