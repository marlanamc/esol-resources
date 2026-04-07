import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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
    if ((session.user as { role?: string }).role !== "teacher") {
        return NextResponse.json({ error: "Teachers only" }, { status: 403 });
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

    const bytes = await file.arrayBuffer();
    if (bytes.byteLength > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "Image must be under 5 MB" }, { status: 400 });
    }

    const filename = `${crypto.randomUUID()}.${ext}`;
    const uploadsDir = join(process.cwd(), "public", "uploads", "activities");

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/activities/${filename}` });
}
