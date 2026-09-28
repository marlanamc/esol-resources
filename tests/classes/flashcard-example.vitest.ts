import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parse } from "node-html-parser";
import { FlashcardExample } from "@/components/games/FlashcardExample";

const render = (example: string, term: string) => parse(renderToStaticMarkup(createElement(FlashcardExample, { example, term })));

describe("flashcard example emphasis", () => {
    it("bolds vocabulary with original capitalization and punctuation", () => {
        const html = render("Identify it. Can you identify the noun?", "identify");
        expect(html.querySelectorAll("strong").map((node) => node.textContent)).toEqual(["Identify", "identify"]);
    });
    it("does not match a word inside another word", () => {
        expect(render("He identified an identifier.", "identify").querySelectorAll("strong")).toHaveLength(0);
    });
    it("handles phrases, flexible spacing, and regex punctuation literally", () => {
        expect(render("Please look  up the word.", "look up").querySelector("strong")?.textContent).toBe("look  up");
        expect(render("Use C++ today.", "C++").querySelector("strong")?.textContent).toBe("C++");
    });
    it("preserves unmatched and empty-term examples and escapes markup", () => {
        expect(render("A sentence.", "").textContent).toBe("A sentence.");
        expect(render("<script>alert(1)</script>", "alert").querySelector("script")).toBeNull();
    });
});
