import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { isAdmin, canUseTeacherTools } from "@/lib/auth/roles";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/database/prisma";

export const metadata = {
    title: "Admin | My ESOL Class",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (!isAdmin(session.user)) {
        redirect(canUseTeacherTools(session.user) ? "/teach" : "/dashboard");
    }

    const userName = session.user.name ?? session.user.username ?? "";
    const userAvatar = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { avatar: true, avatarColor: true },
    });

    return (
        <div className="min-h-screen" style={{ background: "#efeeeb" }}>
            <AdminHeader
                userName={userName}
                initialAvatar={userAvatar?.avatar ?? null}
                initialAvatarColor={userAvatar?.avatarColor ?? null}
            />
            <main id="main-content" className="mx-auto max-w-[1540px] px-4 py-8 pb-20 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
