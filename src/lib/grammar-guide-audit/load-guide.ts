import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { InteractiveGuideContent } from "@/types/activity";
import type { GuideScopeEntry, LoadedGuide } from "./types";

const ROOT = process.cwd();

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

    let content: InteractiveGuideContent = { type: "interactive-guide", sections: [] };

    if (exportName) {
        const module = await import(pathToFileURL(contentPath).href);
        content = module[exportName] as InteractiveGuideContent;
    }

    return {
        slug: scope.slug,
        scope,
        content,
        contentPath,
        contentSource,
        pagePath,
        pageSource,
        imageModulePath: findImageImportPath(contentSource),
        exportName,
    };
}
