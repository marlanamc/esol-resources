'use client';

import { useCallback } from 'react';

/**
 * A lightweight hook to generate clean success/error sounds using the Web Audio API.
 * No external audio files required.
 */
export function useTimelineAudio() {
  const playPing = useCallback(() => {
    try {
      // Audio disabled per user request
      
      // Haptics for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  }, []);

  const playThump = useCallback(() => {
    try {
      // Audio disabled per user request
      
      // Haptics for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate([100]);
      }
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  }, []);

  const playLevelUp = useCallback(() => {
    try {
      // Audio disabled per user request

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  }, []);

  return { playPing, playThump, playLevelUp };
}
