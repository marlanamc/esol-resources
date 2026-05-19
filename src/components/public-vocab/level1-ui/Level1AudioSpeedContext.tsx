"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LEVEL1_VOCAB_AUDIO_SPEED_STORAGE_KEY,
  parseLevel1VocabAudioSpeed,
  playLevel1VocabAudio,
  type Level1VocabAudioSpeed,
} from "@/lib/level1-vocab-audio";

type Level1AudioSpeedContextValue = {
  speed: Level1VocabAudioSpeed;
  setSpeed: (speed: Level1VocabAudioSpeed) => void;
  playVocabAudio: (term: string) => HTMLAudioElement;
};

const Level1AudioSpeedContext = createContext<Level1AudioSpeedContextValue | null>(null);

export function Level1AudioSpeedProvider({ children }: { children: ReactNode }) {
  const [speed, setSpeedState] = useState<Level1VocabAudioSpeed>("normal");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LEVEL1_VOCAB_AUDIO_SPEED_STORAGE_KEY);
      setSpeedState(parseLevel1VocabAudioSpeed(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const setSpeed = useCallback((next: Level1VocabAudioSpeed) => {
    setSpeedState(next);
    try {
      localStorage.setItem(LEVEL1_VOCAB_AUDIO_SPEED_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const playVocabAudio = useCallback(
    (term: string) => playLevel1VocabAudio(term, speed),
    [speed]
  );

  const value = useMemo(
    () => ({
      speed,
      setSpeed,
      playVocabAudio,
    }),
    [speed, setSpeed, playVocabAudio]
  );

  return <Level1AudioSpeedContext.Provider value={value}>{children}</Level1AudioSpeedContext.Provider>;
}

export function useLevel1AudioSpeed(): Level1AudioSpeedContextValue {
  const ctx = useContext(Level1AudioSpeedContext);
  if (!ctx) {
    throw new Error("useLevel1AudioSpeed must be used within Level1AudioSpeedProvider");
  }
  return ctx;
}

export function useLevel1AudioSpeedOptional(): Level1AudioSpeedContextValue | null {
  return useContext(Level1AudioSpeedContext);
}
