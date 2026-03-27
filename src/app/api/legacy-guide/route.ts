import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { parse } from "node-html-parser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiErrors, apiError, handleApiError } from "@/lib/api-response";
import type { LegacyGuideResponse } from "@/types/activity";

// This route intentionally reads from project-level legacy assets outside src/.
// Tell Turbopack not to treat process.cwd() as a broad tracing root.
const LEGACY_BASE = path.join(/*turbopackIgnore: true*/ process.cwd(), "_legacy", "activities");
const LEGACY_CSS_BASE = path.join(/*turbopackIgnore: true*/ process.cwd(), "css-from-legacy", "main.css");

async function fileExists(filePath: string) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Ensures the resolved path is contained under LEGACY_BASE to prevent path traversal.
 * Uses path.resolve + path.relative to enforce containment.
 */
function isPathUnderBase(filePath: string, base: string): boolean {
    const resolved = path.resolve(filePath);
    const relative = path.relative(base, resolved);
    return !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function findFileByName(fileName: string) {
    const stack = [LEGACY_BASE];
    while (stack.length) {
        const current = stack.pop()!;
        const entries = await fs.readdir(current, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(fullPath);
            } else if (entry.isFile() && entry.name === fileName) {
                return fullPath;
            }
        }
    }
    return null;
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get("file");

    if (!fileParam) {
        return apiError("Missing file parameter", 400);
    }

    if (!(await fileExists(LEGACY_BASE))) {
        return ApiErrors.notFound("Legacy guide source");
    }

    // Sanitize: remove leading slashes and path separators that could escape base
    const sanitized = fileParam.replace(/^[/\\]+/, "").replace(/\.\./g, "");
    const requestedPath = path.resolve(LEGACY_BASE, sanitized);

    let resolvedPath: string | null = null;

    // Only use requested path if it stays inside LEGACY_BASE and exists
    if (isPathUnderBase(requestedPath, LEGACY_BASE) && (await fileExists(requestedPath))) {
        resolvedPath = requestedPath;
    } else {
        // Fallback: search by filename (basename only, no path) anywhere inside legacy activities
        const basename = path.basename(sanitized);
        if (basename && !basename.includes("..")) {
            const found = await findFileByName(basename);
            if (found && isPathUnderBase(found, LEGACY_BASE)) {
                resolvedPath = found;
            }
        }
    }

    if (!resolvedPath) {
        return ApiErrors.notFound("Legacy guide");
    }

    try {
        const htmlContent = await fs.readFile(resolvedPath, "utf-8");
        const root = parse(htmlContent);

        const guideEl = root.querySelector(".grammar-guide");
        const guideHtml = guideEl?.toString() ?? root.innerHTML;
        const inlineStyles = root.querySelectorAll("style")
            .map((style) => style.textContent?.trim() ?? "")
            .filter(Boolean);
        const inlineScripts = root.querySelectorAll("script")
            .filter((script) => !script.getAttribute("src"))
            .map((script) => script.textContent?.trim() ?? "")
            .filter(Boolean);

        // Load the base CSS variables from the legacy main.css
        let mainCss = "";
        try {
            mainCss = await fs.readFile(LEGACY_CSS_BASE, "utf-8");
        } catch {
            // If main.css doesn't exist, continue without it
        }

        // Prepend the main CSS to the inline styles
        const allStyles = mainCss ? [mainCss, ...inlineStyles] : inlineStyles;

        const payload: LegacyGuideResponse = {
            html: guideHtml,
            styles: allStyles,
            scripts: inlineScripts,
            source: path.relative(LEGACY_BASE, resolvedPath),
        };

        return NextResponse.json(payload);
    } catch (err) {
        return handleApiError(err, {
            defaultMessage: "Failed to read legacy guide",
            path: req.url,
        });
    }
}
