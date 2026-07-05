import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { InteractiveGuideContent } from "@/types/activity";
import { grammarGuides } from "@/lib/grammar-guide-registry";
import type { GuideScopeEntry, LoadedGuide } from "./types";

const ROOT = process.cwd();

const DYNAMIC_PAGE_PATH = path.join(ROOT, "src/app/grammar-reader/[slug]/page.tsx");

export function contentPathForSlug(slug: string): string {
    return path.join(ROOT, "src/content/grammar", `${slug}.ts`);
}

export function pagePathForSlug(slug: string): string {
    return path.join(ROOT, "src/app/grammar-reader", slug, "page.tsx");
}

function findContentExportName(source: string): string | null {
    const match = source.match(/export const (\w+Content)\s*:\s*InteractiveGuideContent/);
    return match?.[1] ?? null;
}

function findImageImportPath(source: string): string | null {
    const match = source.match(/from\s+["']@\/data\/([^"']+-images\.generated)["']/);
    return match ? path.join(ROOT, "src/data", `${match[1]}.ts`) : null;
}

export function parsePageMeta(pageSource: string | null): {
    completionKey: string | null;
    activityTitle: string | null;
} {
    if (!pageSource) {
        return { completionKey: null, activityTitle: null };
    }

    const completionMatch = pageSource.match(/completionKey="([^"]+)"/);
    const titleMatch = pageSource.match(/getActivityIdSafely\(\s*"([^"]+)"/);

    return {
        completionKey: completionMatch?.[1] ?? null,
        activityTitle: titleMatch?.[1] ?? null,
    };
}

export async function loadGuide(scope: GuideScopeEntry): Promise<LoadedGuide> {
    const contentPath = contentPathForSlug(scope.slug);
    const pagePath = pagePathForSlug(scope.slug);

    let contentSource = "";
    let exportName = "";

    try {
        contentSource = await readFile(contentPath, "utf8");
        exportName = findContentExportName(contentSource) ?? "";
    } catch {
        return {
            slug: scope.slug,
            scope,
            content: { type: "interactive-guide", sections: [] },
            contentPath,
            contentSource: "",
            pagePath: null,
            pageSource: null,
            pageMeta: null,
            imageModulePath: findImageImportPath(contentSource),
            exportName,
        };
    }

    let pageSource: string | null = null;
    try {
        pageSource = await readFile(pagePath, "utf8");
    } catch {
        pageSource = null;
    }

    // Route resolution: a dedicated page file wins; otherwise the guide is
    // served by the dynamic [slug] route when it's in the guide registry.
    let resolvedPagePath: string | null = null;
    let pageMeta: LoadedGuide["pageMeta"] = null;
    if (pageSource) {
        resolvedPagePath = pagePath;
        pageMeta = parsePageMeta(pageSource);
    } else {
        const registryEntry = grammarGuides[scope.slug];
        if (registryEntry) {
            resolvedPagePath = DYNAMIC_PAGE_PATH;
            pageMeta = {
                completionKey: scope.slug,
                activityTitle: registryEntry.activityTitle,
            };
        }
    }

    let content: InteractiveGuideContent = { type: "interactive-guide", sections: [] };

    if (exportName) {
        const guideModule = await import(pathToFileURL(contentPath).href);
        content = guideModule[exportName] as InteractiveGuideContent;
    }

    return {
        slug: scope.slug,
        scope,
        content,
        contentPath,
        contentSource,
        pagePath: resolvedPagePath,
        pageSource,
        pageMeta,
        imageModulePath: findImageImportPath(contentSource),
        exportName,
    };
}
