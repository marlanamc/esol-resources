import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { TeachHeader } from "@/components/teach/TeachHeader";
import { resolveTeachClassId } from "@/lib/teach/active-class";
import { TeachClassSwitcher } from "@/components/teach/TeachClassSwitcher";
import { prisma } from "@/lib/database/prisma";

export const metadata = {
    title: "Teaching | My ESOL Class",
};

export default async function TeachLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (!canUseTeacherTools(session.user)) {
        redirect("/dashboard");
    }

    const admin = isAdmin(session.user);
    const userName = session.user.name ?? session.user.username ?? "";

    // The active class is shared by every /teach page, so the switcher lives in the shell.
    const [{ classId: activeClassId, classes }, userAvatar] = await Promise.all([
        resolveTeachClassId(session.user.id, admin),
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: { avatar: true, avatarColor: true },
        }),
    ]);

    return (
        <div className="min-h-screen bg-bg">
            <TeachHeader
                userName={userName}
                isAdmin={admin}
                initialAvatar={userAvatar?.avatar ?? null}
                initialAvatarColor={userAvatar?.avatarColor ?? null}
            />
            {classes.length > 1 ? (
                <div
                    className="border-b bg-[var(--surface-subtle)]"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-2 sm:px-6">
                        <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                            Class
                        </span>
                        <TeachClassSwitcher
                            classes={classes.map((cls) => ({ id: cls.id, name: cls.name }))}
                            selectedClassId={activeClassId ?? ""}
                        />
                        <span className="text-xs text-text-muted">
                            Applies to every Teaching page
                        </span>
                    </div>
                </div>
            ) : null}
            <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 pb-20">
                {children}
            </main>
        </div>
    );
}
