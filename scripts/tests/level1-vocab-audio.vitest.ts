import { describe, expect, it } from "vitest";
import {
  LEVEL1_VOCAB_PLAYBACK_RATES,
  LEVEL1_VOCAB_SLOW_PLAYBACK_RATE,
  parseLevel1VocabAudioSpeed,
} from "@/lib/level1-vocab-audio";

describe("level1 vocab audio", () => {
  it("parses stored speed values", () => {
    expect(parseLevel1VocabAudioSpeed("slow")).toBe("slow");
    expect(parseLevel1VocabAudioSpeed("normal")).toBe("normal");
    expect(parseLevel1VocabAudioSpeed(null)).toBe("normal");
    expect(parseLevel1VocabAudioSpeed("fast")).toBe("normal");
  });

  it("maps slow speed to a reduced playback rate", () => {
    expect(LEVEL1_VOCAB_SLOW_PLAYBACK_RATE).toBeLessThan(1);
    expect(LEVEL1_VOCAB_PLAYBACK_RATES.slow).toBe(LEVEL1_VOCAB_SLOW_PLAYBACK_RATE);
    expect(LEVEL1_VOCAB_PLAYBACK_RATES.normal).toBe(1);
  });
});
