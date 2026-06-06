import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { AuditFinding } from "./types";

const ROOT = process.cwd();
const EM_DASH = "\u2014";

interface ImageEntry {
    slug: string;
    file: string;
    sceneId: string;
    alt: string;
    unsplashId: string;
    creditName: string;
    creditUrl: string;
    hasIntentionalComment: boolean;
}

function normalizeUnsplashId(id: string): string {
    return id.replace(/^photo-/, "").trim();
}

function error(
    slug: string,
    ruleId: string,
    pathLabel: string,
    message: string,
    snippet?: string,
): AuditFinding {
    return { severity: "error", ruleId, slug, path: pathLabel, message, snippet };
}

function warning(
    slug: string,
    ruleId: string,
    pathLabel: string,
    message: string,
    snippet?: string,
): AuditFinding {
    return { severity: "warning", ruleId, slug, path: pathLabel, message, snippet };
}

function findImageExportName(source: string): string | null {
    const match = source.match(/export const (\w+Images)\s*:/);
    return match?.[1] ?? null;
}

function slugFromImageFile(file: string): string {
    return file.replace(/-images\.generated\.ts$/, "");
}

async function loadImageEntriesFromFile(file: string): Promise<ImageEntry[]> {
    const filePath = path.join(ROOT, "src/data", file);
    const source = await readFile(filePath, "utf8");
    const exportName = findImageExportName(source);
    if (!exportName) return [];

    const module = await import(pathToFileURL(filePath).href);
    const images = module[exportName] as Record<
        string,
        {
            alt?: string;
            unsplashId?: string;
            credit?: { name?: string; url?: string };
        }
    >;

    const slug = slugFromImageFile(file);
    const entries: ImageEntry[] = [];

    for (const [sceneId, data] of Object.entries(images ?? {})) {
        const sceneIndex = source.indexOf(`${sceneId}:`);
        const before = source.slice(Math.max(0, sceneIndex - 200), sceneIndex);
        entries.push({
            slug,
            file,
            sceneId,
            alt: data.alt ?? "",
            unsplashId: data.unsplashId ?? "",
            creditName: data.credit?.name ?? "",
            creditUrl: data.credit?.url ?? "",
            hasIntentionalComment:
                /intentional/i.test(before) ||
                /deliberate/i.test(before) ||
                /cross-reference/i.test(before),
        });
    }

    return entries;
}

async function loadAllImageEntries(): Promise<ImageEntry[]> {
    const dataDir = path.join(ROOT, "src/data");
    const files = (await readdir(dataDir)).filter((f) => f.endsWith("-images.generated.ts"));
    const entries: ImageEntry[] = [];

    for (const file of files) {
        entries.push(...(await loadImageEntriesFromFile(file)));
    }

    return entries;
}

export async function runGlobalImageRules(): Promise<AuditFinding[]> {
    const findings: AuditFinding[] = [];
    const allEntries = await loadAllImageEntries();
    const byId = new Map<string, ImageEntry[]>();

    for (const entry of allEntries) {
        const key = normalizeUnsplashId(entry.unsplashId);
        if (!key) continue;
        const list = byId.get(key) ?? [];
        list.push(entry);
        byId.set(key, list);
    }

    for (const [unsplashId, uses] of byId.entries()) {
        const intentionalOnly = uses.every((u) => u.hasIntentionalComment);
        if (uses.length > 1 && !intentionalOnly) {
            const locations = uses.map((u) => `${u.slug}#${u.sceneId}`).join(", ");
            findings.push(
                error(
                    "_global",
                    "duplicate-unsplash-id",
                    unsplashId,
                    `unsplashId reused across guides: ${locations}`,
                    unsplashId,
                ),
            );
        }
    }

    return findings;
}

export async function runGuideImageRules(
    slug: string,
    imageModulePath: string | null,
    usesSceneCards: boolean,
): Promise<{ findings: AuditFinding[]; imageEntries: Array<{ sceneId: string; alt: string; unsplashId: string }> }> {
    const findings: AuditFinding[] = [];
    const imageEntries: Array<{ sceneId: string; alt: string; unsplashId: string }> = [];

    if (!usesSceneCards) {
        return { findings, imageEntries };
    }

    if (!imageModulePath) {
        findings.push(
            error(slug, "image-module-missing", slug, "Guide uses sceneCard but image module is missing"),
        );
        return { findings, imageEntries };
    }

    const fileName = path.basename(imageModulePath);
    let entries: ImageEntry[] = [];

    try {
        entries = await loadImageEntriesFromFile(fileName);
    } catch {
        findings.push(
            error(slug, "image-file-missing", imageModulePath, "Image generated file is missing"),
        );
        return { findings, imageEntries };
    }

    const guideEntries = entries;

    for (const entry of guideEntries) {
        imageEntries.push({
            sceneId: entry.sceneId,
            alt: entry.alt,
            unsplashId: entry.unsplashId,
        });

        const basePath = `${fileName}#${entry.sceneId}`;
        if (!entry.alt.trim()) {
            findings.push(error(slug, "image-alt-missing", basePath, "Image alt text is empty"));
        }
        if (!entry.unsplashId.trim()) {
            findings.push(error(slug, "image-unsplash-id-missing", basePath, "unsplashId is empty"));
        }
        if (!entry.creditName.trim() || !entry.creditUrl.trim()) {
            findings.push(error(slug, "image-credit-missing", basePath, "Image credit is incomplete"));
        }
        if (entry.alt.includes(EM_DASH)) {
            findings.push(error(slug, "image-alt-em-dash", basePath, "Image alt contains em dash"));
        }
    }

    if (guideEntries.length === 0) {
        findings.push(
            warning(slug, "image-no-entries", imageModulePath, "Image module has no parsed scene entries"),
        );
    }

    return { findings, imageEntries };
}
