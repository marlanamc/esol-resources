import { Suspense, type ReactNode } from "react";
import { prisma } from "@/lib/database/prisma";
import { resolveTeachClassId } from "@/lib/teach/active-class";
import { WorkspaceShell } from "./WorkspaceShell";

export async function WorkspaceLayout({
    children,
    user,
    admin,
}: {
    children: ReactNode;
    user: { id: string; name?: string | null; username?: string | null };
    admin: boolean;
}) {
    const [context, avatar] = await Promise.all([
        resolveTeachClassId(user.id, admin),
        prisma.user.findUnique({
            where: { id: user.id },
            select: { avatar: true, avatarColor: true },
        }),
    ]);
    return (
        <Suspense
            fallback={
                <div className="p-6" role="status">
                    Loading workspace…
                </div>
            }
        >
            <WorkspaceShell
                admin={admin}
                userName={user.name ?? user.username ?? ""}
                classes={context.classes.map(({ id, name }) => ({ id, name }))}
                activeClassId={context.classId}
                avatar={avatar?.avatar ?? null}
                avatarColor={avatar?.avatarColor ?? null}
            >
                {children}
            </WorkspaceShell>
        </Suspense>
    );
}
