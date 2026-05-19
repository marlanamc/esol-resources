import { getVocabAudioUrl } from "@/lib/vocab-audio-url";

export const LEVEL1_VOCAB_AUDIO_SPEED_STORAGE_KEY = "level1-vocab-audio-speed";

export type Level1VocabAudioSpeed = "normal" | "slow";

/** Short word clips need a lower rate than sentence TTS to feel clearly slower. */
export const LEVEL1_VOCAB_SLOW_PLAYBACK_RATE = 0.68;

export const LEVEL1_VOCAB_PLAYBACK_RATES: Record<Level1VocabAudioSpeed, number> = {
  normal: 1,
  slow: LEVEL1_VOCAB_SLOW_PLAYBACK_RATE,
};

export function parseLevel1VocabAudioSpeed(value: string | null): Level1VocabAudioSpeed {
  return value === "slow" ? "slow" : "normal";
}

export function getLevel1VocabPlaybackRate(speed: Level1VocabAudioSpeed): number {
  return LEVEL1_VOCAB_PLAYBACK_RATES[speed];
}

/** Apply rate before and after load — some mobile browsers ignore rate set only at creation. */
export function applyLevel1VocabPlaybackRate(audio: HTMLAudioElement, speed: Level1VocabAudioSpeed): void {
  const rate = getLevel1VocabPlaybackRate(speed);
  audio.defaultPlaybackRate = rate;
  audio.playbackRate = rate;
  if ("preservesPitch" in audio) {
    audio.preservesPitch = true;
  }
}

export function playLevel1VocabAudio(term: string, speed: Level1VocabAudioSpeed = "normal"): HTMLAudioElement {
  const audio = new Audio(getVocabAudioUrl(term));
  applyLevel1VocabPlaybackRate(audio, speed);
  audio.addEventListener("loadedmetadata", () => applyLevel1VocabPlaybackRate(audio, speed), { once: true });
  audio.currentTime = 0;
  return audio;
}
