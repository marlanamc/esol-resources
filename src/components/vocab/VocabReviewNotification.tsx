'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Clock, X } from 'lucide-react';
import { getLearnerCategoryTone } from '@/lib/learner/theme';

const VOCAB_NOTIFICATION_KEY = 'vocab-review-notification-state';
const NOTIFICATION_COOLDOWN = 2 * 60 * 60 * 1000; // 2 hours

type NotificationState = {
  lastShown: number;
  dismissedCount: number;
};

function readNotificationState(): NotificationState {
  if (typeof window === 'undefined') return { lastShown: 0, dismissedCount: 0 };
  try {
    const raw = localStorage.getItem(VOCAB_NOTIFICATION_KEY);
    if (!raw) return { lastShown: 0, dismissedCount: 0 };
    const parsed = JSON.parse(raw) as Partial<NotificationState>;
    return {
      lastShown: typeof parsed.lastShown === 'number' ? parsed.lastShown : 0,
      dismissedCount: typeof parsed.dismissedCount === 'number' ? parsed.dismissedCount : 0,
    };
  } catch {
    return { lastShown: 0, dismissedCount: 0 };
  }
}

function writeNotificationState(state: NotificationState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VOCAB_NOTIFICATION_KEY, JSON.stringify(state));
}

interface VocabReviewNotificationProps {
  dueCount: number;
  newCount: number;
}

export function VocabReviewNotification({ dueCount, newCount }: VocabReviewNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationState, setNotificationState] = useState<NotificationState>(() => readNotificationState());

  const tone = getLearnerCategoryTone('vocabulary');
  const totalReady = dueCount + newCount;
  const hasCards = totalReady > 0;

  useEffect(() => {
    if (!hasCards) {
      setIsVisible(false);
      return;
    }

    const now = Date.now();
    const timeSinceLastShown = now - notificationState.lastShown;
    
    // Show notification if:
    // 1. Never shown before, or
    // 2. Enough time has passed since last showing, or
    // 3. User has dismissed fewer than 3 times
    const shouldShow = 
      notificationState.lastShown === 0 ||
      timeSinceLastShown > NOTIFICATION_COOLDOWN ||
      notificationState.dismissedCount < 3;

    if (shouldShow) {
      // Delay showing to avoid immediate popup on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [hasCards, dueCount, newCount, notificationState]);

  const handleDismiss = () => {
    const newState: NotificationState = {
      lastShown: Date.now(),
      dismissedCount: notificationState.dismissedCount + 1,
    };
    setNotificationState(newState);
    writeNotificationState(newState);
    setIsVisible(false);
  };

  const handleReview = () => {
    const newState: NotificationState = {
      lastShown: Date.now(),
      dismissedCount: 0, // Reset count when user takes action
    };
    setNotificationState(newState);
    writeNotificationState(newState);
    setIsVisible(false);
    window.location.href = '/dashboard/vocab-review';
  };

  if (!isVisible || !hasCards) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[9998]">
      <div 
        className="bg-white rounded-2xl shadow-2xl border-2 p-4 animate-in slide-in-from-bottom duration-300"
        style={{ 
          borderColor: tone.border,
          background: `linear-gradient(135deg, ${tone.surface} 0%, white 100%)`
        }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: tone.accent }}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p 
              className="font-bold text-base"
              style={{ color: tone.accent }}
            >
              Time to practice! 📚
            </p>
            <p className="text-sm text-text/80 mt-0.5">
              {dueCount > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {dueCount} card{dueCount === 1 ? '' : 's'} ready for review
                </span>
              )}
              {dueCount > 0 && newCount > 0 && <span className="mx-1">·</span>}
              {newCount > 0 && (
                <span>{newCount} new word{newCount === 1 ? '' : 's'} to learn</span>
              )}
            </p>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-text/60 hover:text-text hover:bg-bg-light transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleReview}
            className="flex-1 font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-white"
            style={{
              background: `linear-gradient(135deg, ${tone.accent} 0%, ${tone.accentStrong} 100%)`,
              '--tw-ring-color': `${tone.accent}50`,
            } as React.CSSProperties}
          >
            Start Review
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 rounded-xl font-medium text-text/70 hover:text-text hover:bg-bg-light transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
