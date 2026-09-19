import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
export const metadata = { title: "Teaching workspace | My ESOL Class" };
export default async function Layout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");
    return (
        <WorkspaceLayout user={session.user} admin={isAdmin(session.user)}>
            {children}
        </WorkspaceLayout>
    );
}
