'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Listen for custom event from ServiceWorkerRegistration
      const handleUpdateAvailable = (event: Event) => {
        const customEvent = event as CustomEvent;
        setWaitingWorker(customEvent.detail.waitingWorker);
        setShowUpdate(true);
      };

      window.addEventListener('swUpdateAvailable', handleUpdateAvailable);

      return () => {
        window.removeEventListener('swUpdateAvailable', handleUpdateAvailable);
      };
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting and activate immediately
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });

      // Listen for the controller change and reload
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  const handleDismiss = () => {
    // Temporarily hide the banner, but it will reappear on next page load
    // This is intentional - we want students to eventually update
    setShowUpdate(false);

    // Re-show after 5 minutes if they haven't updated
    setTimeout(() => {
      setShowUpdate(true);
    }, 5 * 60 * 1000);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-t-4 border-blue-400 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Message */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">🎓</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base">
                New activities available!
              </p>
              <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">
                Update now to see the latest content
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleUpdate}
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-4 sm:px-6 py-2 sm:py-2.5 min-h-[44px] rounded-lg transition-colors text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95 transform"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors flex items-center justify-center"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
