import path from "path";
import { promises as fs } from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { canUseTeacherTools } from "@/lib/auth/roles";
import { ApiErrors } from "@/lib/api/response";

// The Grammar Companion sheet that the grammar progression pages link to.
// It lives outside src/ and is traced in next.config.ts.
const REFERENCE_SHEET = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "FY27",
    "reference-sheets",
    "esol-3b-grammar-reference.html"
);

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return ApiErrors.unauthorized();
    if (!canUseTeacherTools(session.user)) return ApiErrors.forbidden();

    return new Response(await fs.readFile(REFERENCE_SHEET, "utf-8"), {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "private, no-cache",
            "X-Content-Type-Options": "nosniff",
        },
    });
}
