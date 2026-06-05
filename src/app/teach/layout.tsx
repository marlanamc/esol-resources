import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { canUseTeacherTools, isAdmin } from "@/lib/roles";
import { TeachHeader } from "@/components/teach/TeachHeader";

export const metadata = {
    title: "Teaching | Class Companion",
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

    return (
        <div className="min-h-screen bg-bg">
            <TeachHeader userName={userName} isAdmin={admin} />
            <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 pb-20">
                {children}
            </main>
        </div>
    );
}
