import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await request.json();

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: (session.user as any).id },
        data: {
            password: passwordHash,
            mustChangePassword: false,
        },
    });

    return NextResponse.json({ ok: true });
}



