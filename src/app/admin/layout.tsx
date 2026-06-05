import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdmin, canUseTeacherTools } from "@/lib/roles";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
    title: "Admin | Class Companion",
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

    return (
        <div className="min-h-screen" style={{ background: "#f0f2f7" }}>
            <AdminHeader userName={userName} />
            <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 pb-20">
                {children}
            </main>
        </div>
    );
}
