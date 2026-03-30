import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LearnTensesWalkthrough } from "@/components/games/TimelineTensesGame/LearnTensesWalkthrough";
import { getLearnTensesFamilySequence } from "@/data/timeline-learn-tenses";

describe("timeline learn the tenses walkthrough", () => {
  it("focuses on a single selected tense family", () => {
    expect(getLearnTensesFamilySequence(["continuous"])).toEqual(["continuous"]);
  });

  it("shows the full walkthrough when multiple families or all are selected", () => {
    expect(getLearnTensesFamilySequence([])).toEqual([
      "simple",
      "continuous",
      "perfect",
      "perfect-continuous",
    ]);
    expect(getLearnTensesFamilySequence(["simple", "continuous"])).toEqual([
      "simple",
      "continuous",
      "perfect",
      "perfect-continuous",
    ]);
    expect(getLearnTensesFamilySequence(["mixed"])).toEqual([
      "simple",
      "continuous",
      "perfect",
      "perfect-continuous",
    ]);
  });

  it("renders a focused single-family walkthrough", () => {
    const html = renderToStaticMarkup(
      React.createElement(LearnTensesWalkthrough, {
        selectedCategories: ["continuous"],
        onBack: () => {},
        onStartPractice: () => {},
        onOpenFormulas: () => {},
      })
    );

    expect(html).toContain("Learn the Tenses");
    expect(html).toContain("Continuous Tenses");
    expect(html).toContain("Present Continuous");
    expect(html).not.toContain("Perfect Tenses");
  });

  it("renders the full-map walkthrough with practice CTA", () => {
    const html = renderToStaticMarkup(
      React.createElement(LearnTensesWalkthrough, {
        selectedCategories: [],
        onBack: () => {},
        onStartPractice: () => {},
        onOpenFormulas: () => {},
      })
    );

    expect(html).toContain("Simple");
    expect(html).toContain("Continuous");
    expect(html).toContain("Perfect");
    expect(html).toContain("Perfect Continuous");
    expect(html).toContain("Jump to the tense family above, or keep going in order.");
    expect(html).toContain("Next Family");
    expect(html).toContain("Start Practice with This Family");
    expect(html).toContain("Back to Selection");
    expect(html).toContain("Tense Formulas");
  });
});
