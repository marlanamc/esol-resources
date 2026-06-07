import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/roles";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isAdmin(session.user)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    if (!id) {
        return NextResponse.json({ error: "Missing activity id" }, { status: 400 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const value = (body as { isFeaturedForIndependent?: unknown })?.isFeaturedForIndependent;
    if (typeof value !== "boolean") {
        return NextResponse.json(
            { error: "isFeaturedForIndependent must be a boolean" },
            { status: 400 }
        );
    }

    try {
        const updated = await prisma.activity.update({
            where: { id },
            data: { isFeaturedForIndependent: value },
            select: { id: true, isFeaturedForIndependent: true },
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
}
