'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import type { ServiceWorkerMessage, SwUpdateAvailableDetail } from '@/types/pwa';

const UPDATE_DISMISS_KEY = 'pwa-update-dismiss-state-v1';
const MAX_DISMISS_COUNT = 5;

type DismissState = {
  count: number;
  lastDismissedAt: number;
};

function readDismissState(): DismissState {
  if (typeof window === 'undefined') return { count: 0, lastDismissedAt: 0 };
  try {
    const raw = localStorage.getItem(UPDATE_DISMISS_KEY);
    if (!raw) return { count: 0, lastDismissedAt: 0 };
    const parsed = JSON.parse(raw) as Partial<DismissState>;
    return {
      count: typeof parsed.count === 'number' ? parsed.count : 0,
      lastDismissedAt: typeof parsed.lastDismissedAt === 'number' ? parsed.lastDismissedAt : 0,
    };
  } catch {
    return { count: 0, lastDismissedAt: 0 };
  }
}

function writeDismissState(state: DismissState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(UPDATE_DISMISS_KEY, JSON.stringify(state));
}

export default function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dismissCount, setDismissCount] = useState(() => readDismissState().count);
  const [remindTimerId, setRemindTimerId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleUpdateAvailable = (event: Event) => {
        const customEvent = event as CustomEvent<SwUpdateAvailableDetail>;
        const state = readDismissState();
        const elapsed = Date.now() - state.lastDismissedAt;
        const cooldownMs = state.count <= 1 ? 10 * 60 * 1000 : 30 * 60 * 1000;

        setWaitingWorker(customEvent.detail.waitingWorker);
        setDismissCount(state.count);
        setShowUpdate(elapsed > cooldownMs || state.count === 0);
      };

      window.addEventListener('swUpdateAvailable', handleUpdateAvailable);

      return () => {
        window.removeEventListener('swUpdateAvailable', handleUpdateAvailable);
      };
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      setIsUpdating(true);
      const message: ServiceWorkerMessage = { type: 'SKIP_WAITING' };
      waitingWorker.postMessage(message);
    }
  };

  const handleDismiss = () => {
    const newCount = Math.min(dismissCount + 1, MAX_DISMISS_COUNT);
    setDismissCount(newCount);
    setShowUpdate(false);
    writeDismissState({ count: newCount, lastDismissedAt: Date.now() });

    const delay = newCount <= 1 ? 10 * 60 * 1000 : 30 * 60 * 1000;
    if (remindTimerId) {
      window.clearTimeout(remindTimerId);
    }
    const timerId = window.setTimeout(() => {
      setShowUpdate(true);
    }, delay);
    setRemindTimerId(timerId);
  };

  useEffect(() => {
    return () => {
      if (remindTimerId) {
        window.clearTimeout(remindTimerId);
      }
    };
  }, [remindTimerId]);

  if (!showUpdate) return null;

  // Standard bottom banner
  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-primary/20 p-4 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text text-base">
              New activities available!
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              Tap to get the latest content
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-[background-color,transform] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating…
              </>
            ) : (
              'Update Now'
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 rounded-xl text-text-muted hover:bg-bg-light transition-colors font-medium"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
