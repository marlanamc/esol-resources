'use client';

import { useCallback, useEffect, useRef } from 'react';

type FeedbackKind = 'pick' | 'drop' | 'correct' | 'wrong';

interface FeedbackOptions {
  enabled?: boolean;
  /**
   * Build the AudioContext during idle time after mount instead of on first
   * use. `new AudioContext()` is a synchronous main-thread call that can cost
   * tens of milliseconds the first time, and paying it inside a drag handler
   * stalls the opening frames of the first gesture. Built outside a user
   * gesture it starts suspended, so the play path resumes it -- which is legal
   * on iOS because `resume()` is then called from inside a gesture handler.
   */
  warmOnMount?: boolean;
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Tiny haptic + audio helper. Vibration is only used on supporting devices and
 * respects `prefers-reduced-motion`. Audio is produced via a single shared
 * AudioContext (lazy) so we don't ship any audio assets.
 */
export function useDragFeedback(options: FeedbackOptions = {}): (kind: FeedbackKind) => void {
  const ctxRef = useRef<AudioContext | null>(null);
  const reducedRef = useRef<boolean>(false);
  const enabled = options.enabled !== false;
  const { warmOnMount = false } = options;

  const ensureCtx = useCallback((): AudioContext | null => {
    if (ctxRef.current) return ctxRef.current;
    if (typeof window === 'undefined') return null;
    const AudioCtor =
      (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    try {
      ctxRef.current = new AudioCtor();
    } catch {
      return null;
    }
    return ctxRef.current;
  }, []);

  useEffect(() => {
    reducedRef.current = prefersReducedMotion();
  }, []);

  // Pay for the context while nothing is happening, not on the first swipe.
  useEffect(() => {
    if (!warmOnMount || !enabled || typeof window === 'undefined') return;
    const w = window as IdleWindow;
    // requestIdleCallback is missing on older Safari; a short timeout is close
    // enough for a one-off warm-up.
    if (w.requestIdleCallback) {
      const handle = w.requestIdleCallback(() => ensureCtx(), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(() => ensureCtx(), 300);
    return () => window.clearTimeout(handle);
  }, [warmOnMount, enabled, ensureCtx]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return useCallback(
    (kind: FeedbackKind) => {
      if (!enabled) return;
      if (typeof window === 'undefined') return;

      // Haptics
      if (!reducedRef.current && 'vibrate' in navigator) {
        try {
          const pattern = kind === 'correct' ? [15, 30, 15] : kind === 'wrong' ? [40] : [10];
          navigator.vibrate(pattern);
        } catch {
          // no-op
        }
      }

      // Audio (very quiet, avoids being jarring)
      const ctx = ensureCtx();
      if (!ctx) return;
      try {
        // A context warmed outside a gesture starts suspended. This call is
        // inside one, which is what the autoplay policy wants.
        if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const now = ctx.currentTime;
        const freq =
          kind === 'correct' ? 880 : kind === 'wrong' ? 220 : kind === 'drop' ? 520 : 660;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.04, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch {
        // Audio is best-effort; failures are silent.
      }
    },
    [enabled, ensureCtx],
  );
}
