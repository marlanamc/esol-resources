"use client";

import { useEffect, useState } from "react";

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      window.setTimeout(() => setShowRestored(false), 2500);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
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
