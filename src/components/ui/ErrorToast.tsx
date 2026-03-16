'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export function ErrorToast({ message, onDismiss, duration = 6000 }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 50);
    const hideTimer = duration > 0 ? setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, duration) : undefined;
    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [duration, onDismiss]);

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="mx-4 flex min-w-[18rem] max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border-2 border-error/30 bg-error/10 px-4 py-3 shadow-lg backdrop-blur-sm">
        <AlertCircle size={20} className="flex-shrink-0 text-error" />
        <p className="flex-1 text-sm font-medium text-error">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          aria-label="Dismiss"
          className="flex-shrink-0 rounded p-1 text-error hover:bg-error/20 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>,
    document.body
  );
}
