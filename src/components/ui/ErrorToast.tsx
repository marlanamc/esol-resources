'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
  duration?: number;
}

export function ErrorToast({ message, onDismiss, onRetry, duration = 10000 }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  // Pause auto-dismiss while the learner is pointing at or tabbed into the toast (WCAG 2.2.1).
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 50);
    const hideTimer = duration > 0 && !isPaused ? setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, duration) : undefined;
    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [duration, onDismiss, isPaused]);

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="mx-4 flex min-w-[18rem] max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border-2 border-error/40 bg-[var(--color-surface-base)] px-4 py-3 shadow-lg"
      >
        <AlertCircle size={20} aria-hidden="true" className="flex-shrink-0 text-error" />
        <p className="flex-1 text-sm font-medium text-text">{message}</p>
        {onRetry && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onRetry, 300);
            }}
            type="button"
            className="flex-shrink-0 min-h-[44px] rounded-lg px-3 text-sm font-bold text-text border border-error/40 hover:bg-error/10 transition-colors"
          >
            Retry
          </button>
        )}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          type="button"
          aria-label="Dismiss"
          className="flex-shrink-0 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-text hover:bg-error/10 transition-colors"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body
  );
}
