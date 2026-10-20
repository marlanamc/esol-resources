import path from "path";
import { promises as fs } from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { canUseTeacherTools } from "@/lib/auth/roles";
import { ApiErrors } from "@/lib/api/response";

// Serves the static teacher reference built by `npm run docs:grammar`.
// It reads project-level files outside src/, traced in next.config.ts.
const DOCS_BASE = path.join(/*turbopackIgnore: true*/ process.cwd(), "docs", "grammar-progression");
const REFERENCE_SHEET = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "FY27",
    "reference-sheets",
    "esol-3b-grammar-reference.html"
);
// The generated pages link to the Grammar Companion by its repo path.
const REFERENCE_SHEET_LINK = "../../FY27/reference-sheets/esol-3b-grammar-reference.html";
const REFERENCE_SHEET_FILE = "reference-sheet.html";

const CONTENT_TYPES: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
};

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return ApiErrors.unauthorized();
    if (!canUseTeacherTools(session.user)) return ApiErrors.forbidden();

    const { file } = await params;
    const contentType = CONTENT_TYPES[path.extname(file)];
    // Flat file names only; the reference has no subdirectories.
    if (!contentType || !/^[\w-]+\.\w+$/.test(file)) return ApiErrors.notFound("Page");

    const filePath = file === REFERENCE_SHEET_FILE ? REFERENCE_SHEET : path.join(DOCS_BASE, file);
    let body: string;
    try {
        body = await fs.readFile(filePath, "utf-8");
    } catch {
        return ApiErrors.notFound("Page");
    }

    if (contentType.startsWith("text/html")) {
        body = body.replaceAll(REFERENCE_SHEET_LINK, REFERENCE_SHEET_FILE);
    }

    return new Response(body, {
        headers: {
            "Content-Type": contentType,
            "Cache-Control": "private, no-cache",
            "X-Frame-Options": "SAMEORIGIN",
            "Content-Security-Policy": "frame-ancestors 'self'",
            "X-Content-Type-Options": "nosniff",
        },
    });
}
