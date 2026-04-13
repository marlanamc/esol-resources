'use client';

import { useRef, useState, useCallback } from 'react';

export type TTSState = 'idle' | 'loading' | 'playing' | 'error';

// Module-level cache: survives component unmounts within the same page session.
// Maps sentence text → object URL for the fetched audio blob.
const audioCache = new Map<string, string>();

export function useTTS() {
  const [state, setState] = useState<TTSState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cancel = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState('idle');
  }, []);

  const speak = useCallback(async (text: string) => {
    // Stop any currently playing audio
    cancel();

    const cacheKey = text.trim();
    if (!cacheKey) return;

    setState('loading');

    try {
      let objectUrl = audioCache.get(cacheKey);

      if (!objectUrl) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cacheKey }),
        });

        if (!res.ok) {
          console.warn('[TTS] API error:', res.status);
          setState('error');
          return;
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        audioCache.set(cacheKey, objectUrl);
      }

      const audio = new Audio(objectUrl);
      audioRef.current = audio;

      audio.onplay = () => setState('playing');
      audio.onended = () => {
        setState('idle');
        audioRef.current = null;
      };
      audio.onerror = () => {
        setState('error');
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.warn('[TTS] error:', err);
      setState('error');
    }
  }, [cancel]);

  return { speak, cancel, state };
}
