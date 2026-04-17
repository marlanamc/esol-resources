'use client';

import { useCallback, useEffect, useRef } from 'react';

type FeedbackKind = 'pick' | 'drop' | 'correct' | 'wrong';

interface FeedbackOptions {
  enabled?: boolean;
}

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

  useEffect(() => {
    reducedRef.current = prefersReducedMotion();
  }, []);

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
      const AudioCtor = (window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      }).AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return;
      try {
        if (!ctxRef.current) ctxRef.current = new AudioCtor();
        const ctx = ctxRef.current;
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
    [enabled],
  );
}
