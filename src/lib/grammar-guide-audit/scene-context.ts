/**
 * Extract the *intent* of each scene photo from a guide's raw source.
 *
 * Scene photos are placed with `sceneCard("<sceneId>", "<caption>", "<accent>")`.
 * The caption is the human-written scene description (e.g. "Break room, 10 AM.
 * Gloria meets James, a forklift operator.") — it tells us what the photo is
 * *supposed* to show. We pair that with the photo's own alt text later to judge
 * whether the picture actually fits the scene.
 */

export interface SceneContextEntry {
    sceneId: string;
    /** Human caption from the sceneCard call, or null when it could not be parsed (template literal, etc.). */
    caption: string | null;
    accent: string | null;
    /** Title of the nearest enclosing section, for display context. */
    sectionTitle: string | null;
    /** Character offset of the sceneCard call in the source (used to find the following dialogue). */
    index: number;
}

const TITLE_REGEX = /\btitle:\s*["']((?:\\.|[^"\\])*)["']/g;

// Full call with a quoted caption: sceneCard("id", "caption", "accent")
const FULL_CALL_REGEX =
    /sceneCard\(\s*["'](\w+)["']\s*,\s*(["'])((?:\\.|(?!\2).)*)\2\s*(?:,\s*["'](\w+)["'])?\s*\)/g;

// Any sceneCard call start, so we can recover scenes whose caption did not parse.
const ANY_CALL_REGEX = /sceneCard\(\s*["'](\w+)["']/g;

function collectTitleOffsets(source: string): Array<{ title: string; index: number }> {
    const offsets: Array<{ title: string; index: number }> = [];
    let match: RegExpExecArray | null;
    TITLE_REGEX.lastIndex = 0;
    while ((match = TITLE_REGEX.exec(source)) !== null) {
        offsets.push({ title: match[1]!.replace(/\\"/g, '"'), index: match.index });
    }
    return offsets;
}

function nearestSectionTitle(
    titleOffsets: Array<{ title: string; index: number }>,
    callIndex: number,
): string | null {
    let title: string | null = null;
    for (const entry of titleOffsets) {
        if (entry.index <= callIndex) {
            title = entry.title;
        } else {
            break;
        }
    }
    return title;
}

function decodeCaption(raw: string): string {
    return raw
        .replace(/\\n/g, " ")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Returns one entry per sceneCard call, in source order. Calls whose caption
 * could not be parsed (e.g. template-literal captions) still appear with
 * `caption: null` so the review tooling can surface them rather than drop them.
 */
export function extractSceneContexts(source: string): SceneContextEntry[] {
    if (!source.includes("sceneCard(")) return [];

    const titleOffsets = collectTitleOffsets(source);
    const parsed = new Map<number, SceneContextEntry>();

    let full: RegExpExecArray | null;
    FULL_CALL_REGEX.lastIndex = 0;
    while ((full = FULL_CALL_REGEX.exec(source)) !== null) {
        parsed.set(full.index, {
            sceneId: full[1]!,
            caption: decodeCaption(full[3] ?? ""),
            accent: full[4] ?? null,
            sectionTitle: nearestSectionTitle(titleOffsets, full.index),
            index: full.index,
        });
    }

    const entries: SceneContextEntry[] = [];
    let any: RegExpExecArray | null;
    ANY_CALL_REGEX.lastIndex = 0;
    while ((any = ANY_CALL_REGEX.exec(source)) !== null) {
        const existing = parsed.get(any.index);
        if (existing) {
            entries.push(existing);
        } else {
            entries.push({
                sceneId: any[1]!,
                caption: null,
                accent: null,
                sectionTitle: nearestSectionTitle(titleOffsets, any.index),
                index: any.index,
            });
        }
    }

    return entries.sort((a, b) => a.index - b.index);
}
