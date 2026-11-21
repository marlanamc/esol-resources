'use client';

import { useCallback, useEffect, useRef } from 'react';
import { resolveAudioUrl } from '@/lib/audio/url';

/**
 * Same playback as the -ed Sounds game: a recorded mp3 from /audio/verbs when
 * there is one, otherwise the browser voice (American English, a bit slow).
 */
export function useSpeak() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.lang = 'en-US';
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith('en-US') || v.name.includes('US') || v.name.includes('American'));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }, []);

  const playWord = useCallback(
    async (word: string) => {
      audioRef.current?.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      const audio = new Audio(resolveAudioUrl(`/audio/verbs/${word.toLowerCase()}.mp3`));
      audioRef.current = audio;
      try {
        await new Promise<void>((resolve, reject) => {
          audio.oncanplaythrough = () => resolve();
          audio.onerror = () => reject(new Error('no recording'));
          audio.load();
        });
        await audio.play();
      } catch {
        speakText(word);
      }
    },
    [speakText]
  );

  return { playWord, speakText };
}
