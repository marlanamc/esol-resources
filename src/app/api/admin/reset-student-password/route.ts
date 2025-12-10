import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "teacher") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, newPassword } = await request.json();

    if (!userId || typeof userId !== "string") {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "student") {
        return NextResponse.json({ error: "Only student passwords can be changed here" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: {
            password: passwordHash,
            mustChangePassword: false,
        },
    });

    return NextResponse.json({ ok: true });
}




