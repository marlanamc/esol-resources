import { getVocabAudioUrl } from "@/lib/vocab-audio-url";

export const LEVEL1_VOCAB_AUDIO_SPEED_STORAGE_KEY = "level1-vocab-audio-speed";

export type Level1VocabAudioSpeed = "normal" | "slow";

/** Matches ESOL live TTS (`/api/tts`) — slightly slower, still natural. */
export const LEVEL1_VOCAB_SLOW_PLAYBACK_RATE = 0.85;

export const LEVEL1_VOCAB_PLAYBACK_RATES: Record<Level1VocabAudioSpeed, number> = {
  normal: 1,
  slow: LEVEL1_VOCAB_SLOW_PLAYBACK_RATE,
};

export function parseLevel1VocabAudioSpeed(value: string | null): Level1VocabAudioSpeed {
  return value === "slow" ? "slow" : "normal";
}

export function playLevel1VocabAudio(term: string, speed: Level1VocabAudioSpeed = "normal"): HTMLAudioElement {
  const audio = new Audio(getVocabAudioUrl(term));
  audio.playbackRate = LEVEL1_VOCAB_PLAYBACK_RATES[speed];
  audio.currentTime = 0;
  return audio;
}
