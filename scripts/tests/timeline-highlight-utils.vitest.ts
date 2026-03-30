import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { highlightSentenceFeatures } from "@/components/games/TimelineTensesGame/highlightUtils";

describe("timeline highlight utils", () => {
  it("keeps adverb clues out of the underlined verb phrase", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        highlightSentenceFeatures(
          "She is always complaining about work.",
          "is always complaining"
        )
      )
    );

    expect(html).toContain(">is<");
    expect(html).toContain(">always<");
    expect(html).toContain(">complaining<");
    expect(html).toContain("bg-accent/40");
    expect(html).not.toContain(
      "underline decoration-primary decoration-2 underline-offset-4 text-primary\">always<"
    );
  });
});
