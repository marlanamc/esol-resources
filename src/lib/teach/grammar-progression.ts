import path from "path";
import { promises as fs } from "fs";
import { parse, type HTMLElement } from "node-html-parser";

// Reads the static teacher reference built by `npm run docs:grammar` and
// reshapes it for the teaching workspace. Traced in next.config.ts.
const DOCS_BASE = path.join(/*turbopackIgnore: true*/ process.cwd(), "docs", "grammar-progression");
const REFERENCE_SHEET_LINK = "../../FY27/reference-sheets/esol-3b-grammar-reference.html";
export const REFERENCE_SHEET_HREF = "/api/teach/grammar-reference-sheet";
export const PROGRESSION_HREF = "/teach/progression";

export const PROGRESSION_PAGES = [
    { slug: "weeks", label: "Week by week" },
    { slug: "lessons", label: "Lesson previews" },
    { slug: "sequence", label: "Sequence" },
    { slug: "strands", label: "Strands" },
    { slug: "vocabulary", label: "Vocabulary" },
    { slug: "index", label: "Overview" },
    { slug: "notes", label: "Notes" },
    { slug: "maintenance", label: "Maintenance" },
] as const;

export type ProgressionSlug = (typeof PROGRESSION_PAGES)[number]["slug"];

export function isProgressionSlug(value: unknown): value is ProgressionSlug {
    return PROGRESSION_PAGES.some((page) => page.slug === value);
}

export function progressionHref(slug: ProgressionSlug, options: { week?: number; hash?: string } = {}): string {
    const params = new URLSearchParams({ page: slug });
    if (options.week) params.set("week", String(options.week));
    return `${PROGRESSION_HREF}?${params}${options.hash ?? ""}`;
}

/** Point links at workspace pages, and lesson week links at the one-week view. */
function rewriteLinks(main: HTMLElement, current: ProgressionSlug) {
    for (const link of main.querySelectorAll("a[href]")) {
        const href = link.getAttribute("href")!;
        if (href.startsWith(REFERENCE_SHEET_LINK)) {
            link.setAttribute("href", REFERENCE_SHEET_HREF + href.slice(REFERENCE_SHEET_LINK.length));
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");
            continue;
        }
        const local = href.match(/^(?:(\w+)\.html)?(#.*)?$/);
        if (!local || (!local[1] && !local[2])) continue;
        const slug = local[1] ?? current;
        if (!isProgressionSlug(slug)) continue;
        const hash = local[2] ?? "";
        const lessonWeek = slug === "lessons" ? hash.match(/^#w(\d+)$/)?.[1] : undefined;
        if (lessonWeek) {
            link.setAttribute("href", progressionHref("lessons", { week: Number(lessonWeek) }));
        } else if (slug !== current) {
            link.setAttribute("href", progressionHref(slug, { hash }));
        }
    }
}

/** Label each cell with its column heading so narrow screens can stack table rows. */
function labelTableCells(main: HTMLElement) {
    for (const table of main.querySelectorAll("table")) {
        const headings = table.querySelectorAll("thead th").map((th) => th.textContent.trim());
        if (!headings.length) continue;
        table.classList.add("gp-stack");
        for (const row of table.querySelectorAll("tbody tr")) {
            row.querySelectorAll("td").forEach((cell, i) => {
                if (headings[i]) cell.setAttribute("data-label", headings[i]);
            });
        }
    }
}

export interface ProgressionPage {
    title: string;
    html: string;
    /** Lesson previews only: the weeks available to pick from. */
    weeks?: number[];
}

/**
 * Returns the page's main content without its standalone header and nav.
 * Lesson previews are trimmed to one week; the full page is too long for a phone.
 */
export async function loadProgressionPage(slug: ProgressionSlug, week?: number): Promise<ProgressionPage> {
    const source = await fs.readFile(path.join(/*turbopackIgnore: true*/ DOCS_BASE, `${slug}.html`), "utf-8");
    // Print buttons need the standalone page's script; the workspace prints with the browser.
    const root = parse(source.replace(/ · <button data-print-week="[^"]*" type="button">[^<]*<\/button>/g, ""));
    const main = root.querySelector("main");
    if (!main) throw new Error(`Grammar progression page has no <main>: ${slug}`);

    const header = main.querySelector("header.page");
    const title = header?.querySelector("h1")?.textContent.trim() ?? slug;
    header?.remove();

    let weeks: number[] | undefined;
    if (slug === "lessons") {
        const cards = main.querySelectorAll("article.week-card[id^=w]");
        weeks = cards.map((card) => Number(card.id.slice(1)));
        const keep = cards.find((card) => card.id === `w${week}`) ?? cards[0];
        main.set_content(keep ? keep.toString() : "");
    }

    rewriteLinks(main, slug);
    labelTableCells(main);
    return { title, html: main.innerHTML, weeks };
}
