import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { put } from "@vercel/blob";
import { canUseTeacherTools } from "@/lib/auth/roles";

const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!canUseTeacherTools(session.user)) {
        return NextResponse.json({ error: "Teachers only" }, { status: 403 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json({ error: "Image storage is not configured" }, { status: 503 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = file.type;
    const ext = ALLOWED_TYPES[mimeType];
    if (!ext) {
        return NextResponse.json({ error: "File must be a JPEG, PNG, WebP, or GIF image" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "Image must be under 5 MB" }, { status: 400 });
    }

    try {
        const blob = await put(`activities/${crypto.randomUUID()}.${ext}`, file, {
            access: "public",
            contentType: mimeType,
            addRandomSuffix: false,
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return NextResponse.json({ url: blob.url });
    } catch {
        return NextResponse.json({ error: "Image could not be saved. Please retry." }, { status: 502 });
    }
}
