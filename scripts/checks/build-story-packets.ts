#!/usr/bin/env node

/**
 * Story packets for grammar guides.
 *
 * For every guide that tells a story (uses the dialogue() helper), writes a
 * markdown packet with the scenes, dialogue, story prose, exercises, and quiz
 * in reading order, plus the course-map theme and a few automatic signals.
 * The packets are what a reviewer reads against docs/audits/story-review/RUBRIC.md.
 *
 * Usage: npm run audit:stories [-- --slug verb-forms-overview]
 */

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { parse, type HTMLElement, type Node } from "node-html-parser";
import type { InteractiveGuideContent } from "@/types/activity";
import { COURSE_MAP_UNITS } from "@/lib/course-map-data";
import { stripHtml } from "@/lib/grammar-guide-audit/collect-strings";

const ROOT = process.cwd();
const GUIDES_DIR = path.join(ROOT, "src/content/grammar");
const OUT_DIR = path.join(ROOT, "docs/audits/story-review");
const PACKETS_DIR = path.join(OUT_DIR, "packets");

/** Speakers that are roles, not characters. A section with only these has no real cast. */
const GENERIC_SPEAKERS = new Set([
    "classmate", "student", "teacher", "you", "neighbor", "coworker", "manager",
    "supervisor", "staff", "clerk", "receptionist", "nurse", "doctor", "friend",
    "partner", "customer", "cashier", "driver", "worker",
]);

/** Phrases that tend to read as forced, preachy, or trying too hard for adult learners. */
const CRINGE_PATTERNS: Array<[RegExp, string]> = [
    [/level(ing)? up/i, "gamer metaphor"],
    [/superpower/i, "superpower metaphor"],
    [/rock ?star|ninja|guru/i, "rockstar/ninja language"],
    [/you(’|')?ve got this|you got this/i, "pep-talk phrase"],
    [/\bslay\b|\bvibes?\b|\bbestie\b|no cap/i, "slang that will date or confuse"],
    [/journey/i, "\"journey\" language"],
    [/believe in yourself|never give up|follow your dreams/i, "motivational poster line"],
    [/isn(’|')t (that|it) (great|wonderful|amazing)/i, "forced enthusiasm"],
    [/practice makes perfect/i, "cliché"],
    [/as you know,/i, "\"as you know\" exposition"],
];

type Line =
    | { kind: "scene"; text: string; alt: string }
    | { kind: "turn"; speaker: string; text: string }
    | { kind: "prose"; text: string };

interface ThemeEntry {
    unit: string;
    week: number;
    weekTitle: string;
    goal?: string;
    itemTitle: string;
}

function classOf(el: HTMLElement): string {
    return el.getAttribute("class") ?? "";
}

function isElement(node: Node): node is HTMLElement {
    return node.nodeType === 1;
}

/** Both dialogue() helpers put an emoji avatar beside the bubble; info cards have none. */
function hasAvatarSibling(el: HTMLElement): boolean {
    const parent = el.parentNode as HTMLElement | null;
    if (!parent) return false;
    return parent.childNodes.some(
        (n) => n !== el && isElement(n) && /^[^\p{L}\p{N}]{1,12}$/u.test(n.text.trim()),
    );
}

/** Speaker labels are names or roles ("Rosa's sister", "James (Pharmacist)"), not card headings. */
function looksLikeSpeaker(label: string): boolean {
    if (!label || label.length > 40 || /[—?…✅/]/.test(label)) return false;
    if (label.length > 3 && label === label.toUpperCase()) return false;
    return label.replace(/\([^)]*\)/g, "").trim().split(/\s+/).length <= 3;
}

/** Walks explanation HTML in reading order, turning helper output back into story lines. */
function extractStoryLines(html: string): Line[] {
    const lines: Line[] = [];

    const visit = (el: HTMLElement) => {
        const cls = classOf(el);

        // sceneCard(): an image plus a caption span labelled "Scene".
        const img = el.querySelector(":scope > img");
        if (img) {
            const captionSpan = el.querySelectorAll("span").find((s) => s.text.trim().startsWith("Scene"));
            if (captionSpan) {
                lines.push({
                    kind: "scene",
                    text: stripHtml(captionSpan.innerHTML).replace(/^Scene\s*/, ""),
                    alt: img.getAttribute("alt") ?? "",
                });
                return;
            }
        }

        // dialogue(): a tinted bubble holding a speaker label and the line.
        if (/gc-bg-\w+-alpha/.test(cls)) {
            // Info cards share the tinted style; a speech bubble has a short label as its first child.
            const children = el.childNodes.filter(isElement);
            const label = children[0] && /gc-text-/.test(classOf(children[0])) ? children[0] : null;
            if (label && children.length >= 2 && hasAvatarSibling(el) && looksLikeSpeaker(stripHtml(label.innerHTML))) {
                lines.push({
                    kind: "turn",
                    speaker: stripHtml(label.innerHTML),
                    text: stripHtml(children[children.length - 1]!.innerHTML),
                });
                return;
            }
        }

        // Guide-local dialogue() variants: an uppercase speaker label followed by the line.
        const kids = el.childNodes.filter(isElement);
        if (
            el.tagName.toLowerCase() === "div" &&
            kids.length === 2 &&
            /text-transform:\s*uppercase/.test(kids[0]!.getAttribute("style") ?? "") &&
            !/gc-bg-\w+-alpha/.test(cls) &&
            hasAvatarSibling(el)
        ) {
            const speaker = stripHtml(kids[0]!.innerHTML);
            const text = stripHtml(kids[1]!.innerHTML);
            if (looksLikeSpeaker(speaker) && text) {
                lines.push({ kind: "turn", speaker, text });
                return;
            }
        }

        if (["p", "li", "h3", "h4", "blockquote"].includes(el.tagName.toLowerCase())) {
            const text = stripHtml(el.innerHTML);
            if (text) lines.push({ kind: "prose", text });
            return;
        }

        for (const child of el.childNodes) {
            if (isElement(child)) visit(child);
        }
    };

    for (const child of parse(html).childNodes) {
        if (isElement(child)) visit(child);
    }
    return lines;
}

function buildThemeIndex(): Map<string, ThemeEntry[]> {
    const index = new Map<string, ThemeEntry[]>();
    for (const unit of COURSE_MAP_UNITS) {
        for (const week of unit.weeks) {
            for (const item of week.items) {
                const match = item.href?.match(/^\/grammar-reader\/([^/?#]+)/);
                if (!match) continue;
                const list = index.get(match[1]!) ?? [];
                list.push({
                    unit: `Unit ${unit.number}: ${unit.title}`,
                    week: week.number,
                    weekTitle: week.title,
                    goal: week.goal,
                    itemTitle: item.title,
                });
                index.set(match[1]!, list);
            }
        }
    }
    return index;
}

async function loadContent(file: string, source: string): Promise<InteractiveGuideContent | null> {
    const exportName = source.match(/export const (\w+)\s*:\s*InteractiveGuideContent/)?.[1];
    if (!exportName) return null;
    const mod = await import(pathToFileURL(file).href);
    return (mod[exportName] as InteractiveGuideContent) ?? null;
}

function optionLabel(option: unknown): string {
    if (typeof option === "string") return option;
    if (option && typeof option === "object" && "label" in option) return String(option.label);
    return "";
}

interface PacketResult {
    slug: string;
    title: string;
    themes: ThemeEntry[];
    signals: string[];
    markdown: string;
}

function buildPacket(slug: string, content: InteractiveGuideContent, themes: ThemeEntry[]): PacketResult {
    const out: string[] = [];
    const signals: string[] = [];
    const castBySection: Array<{ title: string; named: Set<string> }> = [];
    const allTurns: Array<{ speaker: string; text: string }> = [];
    const title = themes[0]?.itemTitle ?? slug;

    out.push(`# Story packet: ${title}`, "", `- **Slug:** \`${slug}\``, `- **Source:** \`src/content/grammar/${slug}.ts\``);
    if (themes.length === 0) {
        out.push("- **Theme:** not on the course map");
    } else {
        for (const t of themes) {
            out.push(`- **Theme:** ${t.unit} · Week ${t.week}: ${t.weekTitle}${t.goal ? ` · Goal: ${t.goal}` : ""}`);
        }
    }
    out.push("");

    const storyOut: string[] = [];
    for (const [index, section] of (content.sections ?? []).entries()) {
        storyOut.push(`## ${index + 1}. ${section.title}`, "");
        const named = new Set<string>();

        for (const html of [section.explanation, section.postExplanation].filter(Boolean) as string[]) {
            for (const line of extractStoryLines(html)) {
                if (line.kind === "scene") {
                    storyOut.push(`> 🖼 **Scene:** ${line.text}  `, `> _Photo shows: ${line.alt}_`, "");
                } else if (line.kind === "turn") {
                    storyOut.push(`- **${line.speaker}:** ${line.text}`);
                    allTurns.push(line);
                    if (!GENERIC_SPEAKERS.has(line.speaker.toLowerCase())) named.add(line.speaker);
                } else {
                    storyOut.push(``, line.text, ``);
                }
            }
        }

        for (const exercise of section.exercises ?? []) {
            storyOut.push("", `**Exercise: ${exercise.title}**`);
            for (const item of exercise.items) {
                const options =
                    "options" in item && Array.isArray(item.options)
                        ? ` _(options: ${item.options.map(optionLabel).join(" / ")})_`
                        : "";
                storyOut.push(`- ${stripHtml(item.label)}${options}`);
            }
        }
        storyOut.push("");
        castBySection.push({ title: section.title, named });
    }

    if ((content.miniQuiz ?? []).length > 0) {
        storyOut.push("## Mini quiz", "");
        for (const q of content.miniQuiz ?? []) {
            const options = "options" in q && Array.isArray(q.options) ? ` _(options: ${q.options.map(optionLabel).join(" / ")})_` : "";
            storyOut.push(`- ${stripHtml(q.question)}${options}`);
        }
        storyOut.push("");
    }

    // --- Automatic signals (cheap hints; the rubric read is what decides) ---
    const storySections = castBySection.filter((s) => s.named.size > 0);
    const isolated = storySections.filter(
        (s) => !storySections.some((other) => other !== s && [...s.named].some((n) => other.named.has(n))),
    );
    if (storySections.length >= 2 && isolated.length === storySections.length) {
        signals.push("No named character appears in more than one section: this may be separate vignettes rather than one story.");
    } else if (isolated.length > 0) {
        signals.push(`Section(s) with a cast that appears nowhere else: ${isolated.map((s) => `"${s.title}"`).join(", ")}.`);
    }

    const castless = castBySection.filter((s, i) => s.named.size === 0 && (content.sections?.[i]?.explanation ?? "").includes("gc-bg-"));
    if (castless.length > 0) {
        signals.push(`Section(s) where every speaker is a generic role (Classmate, Teacher, You...): ${castless.map((s) => `"${s.title}"`).join(", ")}.`);
    }

    const allText = allTurns.map((t) => t.text).join(" ") + " " + storyOut.join(" ");
    for (const [pattern, why] of CRINGE_PATTERNS) {
        const hit = allText.match(pattern);
        if (hit) signals.push(`Possible cringe (${why}): “${hit[0]}”.`);
    }

    const exclaimTurns = allTurns.filter((t) => t.text.includes("!")).length;
    if (allTurns.length >= 6 && exclaimTurns / allTurns.length > 0.6) {
        signals.push(`${exclaimTurns} of ${allTurns.length} dialogue lines use "!". This can read as forced cheerfulness.`);
    }

    // Mid-sentence capitalized words in the quiz that never show up in the story:
    // usually a character the reader has never met.
    const storyText = allTurns.map((t) => `${t.speaker} ${t.text}`).join(" ") + " " + storyOut.join(" ");
    const quizText = (content.miniQuiz ?? []).map((q) => stripHtml(q.question)).join(" ");
    const quizNames = [...new Set([...quizText.matchAll(/[a-z,]\s+([A-Z][a-z]{2,})\b/g)].map((m) => m[1]!))].filter(
        (w) => !new RegExp(`\\b${w}\\b`).test(storyText) && !/^(English|Spanish|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/.test(w),
    );
    if (allTurns.length > 0 && quizNames.length > 0) {
        signals.push(`Mini quiz names someone who never appears in the story: ${quizNames.slice(0, 8).join(", ")}.`);
    }

    if (themes.length === 0) {
        signals.push("Not on the course map, so theme fit has to be judged from the guide title alone.");
    }

    out.push("## Automatic signals", "");
    out.push(...(signals.length > 0 ? signals.map((s) => `- ${s}`) : ["_None._"]), "");
    out.push("## Cast by section", "");
    for (const s of castBySection) {
        out.push(`- ${s.title}: ${s.named.size > 0 ? [...s.named].join(", ") : "_no named speakers_"}`);
    }
    out.push("", "---", "", ...storyOut);

    return { slug, title, themes, signals, markdown: out.join("\n").replace(/\n{3,}/g, "\n\n") };
}

async function main() {
    const argv = process.argv.slice(2);
    const slugFlag = argv.indexOf("--slug");
    const onlySlug = slugFlag >= 0 ? argv[slugFlag + 1] : undefined;

    const themeIndex = buildThemeIndex();
    const files = (await readdir(GUIDES_DIR)).filter((f) => f.endsWith(".ts")).sort();
    const results: PacketResult[] = [];

    for (const file of files) {
        const slug = file.replace(/\.ts$/, "");
        if (onlySlug && slug !== onlySlug) continue;
        const fullPath = path.join(GUIDES_DIR, file);
        const source = await readFile(fullPath, "utf8");
        if (!source.includes("dialogue(")) continue;

        const content = await loadContent(fullPath, source);
        if (!content) {
            console.warn(`[skip] ${slug}: no InteractiveGuideContent export found`);
            continue;
        }
        results.push(buildPacket(slug, content, themeIndex.get(slug) ?? []));
    }

    if (!onlySlug) await rm(PACKETS_DIR, { recursive: true, force: true });
    await mkdir(PACKETS_DIR, { recursive: true });
    for (const r of results) {
        await writeFile(path.join(PACKETS_DIR, `${r.slug}.md`), r.markdown + "\n", "utf8");
    }

    if (!onlySlug) {
        const sorted = [...results].sort(
            (a, b) => (a.themes[0]?.week ?? 999) - (b.themes[0]?.week ?? 999) || a.slug.localeCompare(b.slug),
        );
        const index = [
            "# Story packets",
            "",
            `Generated by \`npm run audit:stories\` on ${new Date().toISOString().slice(0, 10)}. Read each packet against [RUBRIC.md](RUBRIC.md). The latest scored review is [REPORT.md](REPORT.md).`,
            "",
            "| Week | Guide | Theme | Signals |",
            "|---|---|---|---|",
            ...sorted.map((r) => {
                const t = r.themes[0];
                return `| ${t ? t.week : "–"} | [${r.title}](packets/${r.slug}.md) | ${t ? `${t.weekTitle}` : "off map"} | ${r.signals.length} |`;
            }),
            "",
        ].join("\n");
        await writeFile(path.join(OUT_DIR, "INDEX.md"), index, "utf8");
    }

    const flagged = results.filter((r) => r.signals.length > 0).length;
    console.log(`Story packets: ${results.length} guides, ${flagged} with automatic signals`);
    console.log(`Output: ${path.relative(ROOT, PACKETS_DIR)}/`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
