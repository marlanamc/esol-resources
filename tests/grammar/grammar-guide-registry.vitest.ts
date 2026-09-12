import { describe, it, expect } from "vitest";
import { grammarGuides, grammarGuideSlugs, getGrammarGuide } from "@/lib/grammar-guide-registry";

describe("grammar guide registry", () => {
  it("has the expected number of guides", () => {
    // 74 since the Week 1 "Welcome / How to Use the App" guide was added.
    expect(grammarGuideSlugs.length).toBe(74);
  });

  it("returns null for unknown slugs", () => {
    expect(getGrammarGuide("not-a-real-guide")).toBeNull();
    expect(getGrammarGuide("")).toBeNull();
  });

  it("every entry has metadata and an activity title", () => {
    for (const slug of grammarGuideSlugs) {
      const guide = grammarGuides[slug];
      expect(guide.activityTitle, slug).toBeTruthy();
      expect(guide.metaTitle, slug).toBeTruthy();
      expect(guide.metaDescription, slug).toBeTruthy();
    }
  });

  it("every content loader resolves to interactive guide content", async () => {
    for (const slug of grammarGuideSlugs) {
      const content = await grammarGuides[slug].loadContent();
      expect(content, `${slug} content export missing`).toBeTruthy();
      expect(Array.isArray(content.sections), `${slug} has no sections`).toBe(true);
      expect(content.sections.length, `${slug} sections empty`).toBeGreaterThan(0);
    }
  }, 30_000);
});
