import { describe, expect, it } from "vitest";
import { PRONUNCIATION_SENTENCE_LISTENING_SETS } from "@/data/pronunciation-sentence-listening";
import { getPronunciationActivityDescriptor } from "@/lib/pronunciation-activity";

describe("pronunciation sentence lab content", () => {
  it("uses compact sound choices instead of transcript distractors", () => {
    const sentences = Object.values(PRONUNCIATION_SENTENCE_LISTENING_SETS).flatMap((set) => set.sentences);

    for (const sentence of sentences) {
      expect(sentence.prompt).toBeTruthy();
      expect(sentence.choices.length).toBeGreaterThanOrEqual(2);
      expect(sentence.correctChoiceIndex).toBeGreaterThanOrEqual(0);
      expect(sentence.correctChoiceIndex).toBeLessThan(sentence.choices.length);
      expect(sentence.revealFocus).toBeTruthy();
      expect("options" in sentence).toBe(false);
    }
  });

  it("keeps mixed review anchored to one contrast choice per item", () => {
    const mixedReview = PRONUNCIATION_SENTENCE_LISTENING_SETS["mixed-review"];

    for (const sentence of mixedReview.sentences) {
      expect(sentence.choices.length).toBe(2);
      expect(sentence.prompt?.toLowerCase()).toContain("which");
      expect(sentence.revealFocus?.toLowerCase()).toContain("key sound");
    }
  });

  it("describes sentence listening as sound identification instead of transcript matching", () => {
    const descriptor = getPronunciationActivityDescriptor({
      id: "pronunciation-sentences-lab",
      title: "Sentence Listening Lab",
      ui: "pronunciation-listening",
      content: JSON.stringify({
        type: "pronunciation-listening",
        targetSound: "Sentence listening lab",
        setKeys: ["short-i-long-e", "b-v"],
        sentences: [],
      }),
    });

    expect(descriptor.useThisFor).toContain("key sound");
    expect(descriptor.useThisFor.toLowerCase()).not.toContain("transcript");
  });
});
