'use client';

import { useCallback } from 'react';

/**
 * A lightweight hook to generate clean success/error sounds using the Web Audio API.
 * No external audio files required.
 */
export function useTimelineAudio() {
  const playPing = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1); // E6
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      
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
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
      
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
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.5);
      });

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  }, []);

  return { playPing, playThump, playLevelUp };
}
