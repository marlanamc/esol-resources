import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { parse } from "node-html-parser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { ApiErrors, apiError, handleApiError } from "@/lib/api/response";
import type { LegacyGuideResponse } from "@/types/activity";

// This route intentionally reads from project-level legacy assets outside src/.
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
 * Ensures the requested path is contained under LEGACY_BASE to prevent traversal.
 */
function isPathUnderBase(filePath: string, base: string): boolean {
    const normalized = path.normalize(filePath);
    const relative = path.relative(/*turbopackIgnore: true*/ base, normalized);
    return !relative.startsWith("..") && !path.isAbsolute(relative);
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
    const requestedPath = path.join(/*turbopackIgnore: true*/ LEGACY_BASE, sanitized);

    let resolvedPath: string | null = null;

    // Only use requested path if it stays inside LEGACY_BASE and exists
    if (isPathUnderBase(requestedPath, LEGACY_BASE) && (await fileExists(requestedPath))) {
        resolvedPath = requestedPath;
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
