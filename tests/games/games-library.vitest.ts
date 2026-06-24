import { describe, expect, it } from "vitest";
import {
  buildGameLibrarySections,
  isCourseMapOnlyGame,
  isGamesLibraryActivity,
} from "@/lib/games-library";

describe("games-library", () => {
  it("treats timeline tense presets as course-map-only", () => {
    expect(
      isCourseMapOnlyGame({
        id: "timeline-tenses-continuous",
        title: "Timeline Tenses: Continuous Tenses",
        type: "game",
        category: "games",
        ui: "timeline-tenses",
        content: JSON.stringify({
          type: "timeline-tenses",
          tenseCategories: ["continuous"],
        }),
      })
    ).toBe(true);
  });

  it("keeps the full timeline tenses game in the library", () => {
    expect(
      isGamesLibraryActivity({
        id: "cmn3mecy700000eqbx9qyimhy",
        title: "Timeline Tenses",
        type: "game",
        category: "games",
        ui: "timeline-tenses",
        content: JSON.stringify({ type: "timeline-tenses" }),
      })
    ).toBe(true);
  });

  it("excludes guided wrappers from the games library", () => {
    expect(
      isGamesLibraryActivity({
        id: "parts-of-speech-discovery-guided",
        title: "Parts of Speech Discovery Game",
        type: "game",
        category: "games",
        ui: "parts-of-speech",
        content: JSON.stringify({ type: "parts-of-speech", courseMapPreset: true }),
      })
    ).toBe(false);
  });

  it("groups library games into themed sections", () => {
    const sections = buildGameLibrarySections(
      [
        {
          id: "verb-forms-challenge",
          title: "Verb Forms Challenge",
          type: "game",
          category: "games",
          ui: "verb-forms",
        },
        {
          id: "parts-of-speech-game",
          title: "Parts of Speech Discovery Game",
          type: "game",
          category: "games",
          ui: "parts-of-speech",
        },
        {
          id: "numbers-game",
          title: "Numbers to English Words",
          type: "game",
          category: "games",
          ui: null,
        },
        {
          id: "timeline-tenses-continuous",
          title: "Timeline Tenses: Continuous Tenses",
          type: "game",
          category: "games",
          ui: "timeline-tenses",
          content: JSON.stringify({
            type: "timeline-tenses",
            tenseCategories: ["continuous"],
          }),
        },
      ],
      (title) => title || ""
    );

    const names = sections.map((section) => section.name);
    expect(names).toContain("Verb Tenses & Forms");
    expect(names).toContain("Parts of Speech");
    expect(names).toContain("Numbers");
    expect(names).not.toContain("More Games");

    const allIds = sections.flatMap((section) => section.activities.map((activity) => activity.id));
    expect(allIds).toEqual(
      expect.arrayContaining(["verb-forms-challenge", "parts-of-speech-game", "numbers-game"])
    );
    expect(allIds).not.toContain("timeline-tenses-continuous");
  });
});
