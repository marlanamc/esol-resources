import { parse } from "node-html-parser";
import type { InteractiveGuideContent } from "@/types/activity";
import type { DialogueTurn } from "./types";
import { stripHtml } from "./collect-strings";

/**
 * Extract dialogue turns from explanation HTML.
 * Matches the structure produced by dialogue() helpers in content files.
 */
export function extractDialoguesFromContent(
    content: InteractiveGuideContent,
): DialogueTurn[] {
    const turns: DialogueTurn[] = [];

    for (const section of content.sections ?? []) {
        if (!section.explanation) continue;

        const root = parse(section.explanation);
        const toneDivs = root.querySelectorAll('[class*="gc-text-"]');

        for (const toneDiv of toneDivs) {
            const parent = toneDiv.parentNode;
            if (!parent) continue;

            const parentStyle = parent.getAttribute("style") ?? "";
            if (!parentStyle.includes("flex")) continue;

            const speaker = stripHtml(toneDiv.innerHTML);
            if (!speaker || speaker.length > 40) continue;

            const textDiv = parent.querySelector("div:not([class*='gc-text-'])");
            if (!textDiv) continue;

            const text = stripHtml(textDiv.innerHTML);
            if (!text) continue;

            turns.push({
                speaker,
                text,
                sectionId: section.id,
                sectionTitle: section.title,
            });
        }
    }

    return turns;
}

export function extractDialoguesFromSource(source: string): DialogueTurn[] {
    const turns: DialogueTurn[] = [];
    const sectionsAnchor = source.match(/sections:\s*\[/);
    if (!sectionsAnchor || sectionsAnchor.index === undefined) {
        return extractDialogueTurnsFromBlock(source);
    }

    const sectionsSource = source.slice(sectionsAnchor.index + sectionsAnchor[0].length);
    const headerRegex =
        /\{\s*\n\s*id:\s*["'][^"']+["'],(?:\s*\n\s*stepNumber:\s*\d+,)?\s*\n\s*title:\s*["']((?:\\.|[^"\\])*)["'],\s*\n\s*icon:/g;

    const sectionStarts: Array<{ title: string; contentStart: number }> = [];
    let headerMatch: RegExpExecArray | null;
    while ((headerMatch = headerRegex.exec(sectionsSource)) !== null) {
        sectionStarts.push({
            title: headerMatch[1]!.replace(/\\"/g, '"'),
            contentStart: headerMatch.index,
        });
    }

    for (let index = 0; index < sectionStarts.length; index += 1) {
        const start = sectionStarts[index]!.contentStart;
        const end =
            index + 1 < sectionStarts.length
                ? sectionStarts[index + 1]!.contentStart
                : sectionsSource.length;
        const block = sectionsSource.slice(start, end);
        turns.push(
            ...extractDialogueTurnsFromBlock(block, sectionStarts[index]!.title),
        );
    }

    return turns;
}

function extractDialogueTurnsFromBlock(
    block: string,
    sectionTitle?: string,
): DialogueTurn[] {
    const turns: DialogueTurn[] = [];
    const turnRegex =
        /\{\s*speaker:\s*["']([^"']+)["'],\s*avatar:\s*["']([^"']*)["'],\s*text:\s*["'`]((?:\\.|[^"'\\])*)["'`]/g;

    let match: RegExpExecArray | null;
    while ((match = turnRegex.exec(block)) !== null) {
        const speaker = match[1];
        const avatar = match[2];
        const text = match[3]
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'");

        turns.push({
            speaker,
            avatar,
            text: stripHtml(text),
            sectionTitle,
        });
    }

    return turns;
}

export function extractScenarioParagraphs(
    content: InteractiveGuideContent,
): Array<{ sectionTitle: string; text: string }> {
    const scenarios: Array<{ sectionTitle: string; text: string }> = [];

    for (const section of content.sections ?? []) {
        if (!section.explanation) continue;
        const root = parse(section.explanation);
        const firstParagraph = root.querySelector("p");
        if (firstParagraph) {
            const text = stripHtml(firstParagraph.innerHTML);
            if (text) {
                scenarios.push({ sectionTitle: section.title, text });
            }
        }
    }

    return scenarios;
}

export function usesSceneCards(contentSource: string): boolean {
    return contentSource.includes("sceneCard(");
}
