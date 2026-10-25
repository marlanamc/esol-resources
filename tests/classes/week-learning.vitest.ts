import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "node-html-parser";
import { WEEK_LEARNING } from "@/lib/week-learning";

const reviews: { week: number; pages: { section: string }[] }[] = JSON.parse(
    fs.readFileSync("docs/grammar-progression/reference-pages.json", "utf8")
);
const sheets = parse(fs.readFileSync("FY27/reference-sheets/esol-3b-grammar-reference.html", "utf8"));

function printedPage(section: string): number {
    const number = sheets.querySelector(`article#${section}`)?.querySelectorAll(".footer span").at(-1)?.textContent.trim();
    return Number(number);
}

describe("week learning", () => {
    it("covers all 36 weeks with goals", () => {
        for (let week = 1; week <= 36; week++) {
            expect(WEEK_LEARNING[week]?.canDo.length, `week ${week}`).toBeGreaterThan(0);
        }
    });

    it("lists the recommended reference pages with their printed page numbers", () => {
        for (const review of reviews) {
            const pages = WEEK_LEARNING[review.week].pages;
            expect(pages.map((p) => p.section), `week ${review.week}`).toEqual(review.pages.map((p) => p.section));
            for (const page of pages) expect(page.page, `week ${review.week} ${page.section}`).toBe(printedPage(page.section));
        }
    });
});
