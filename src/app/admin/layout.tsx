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
        <div className="min-h-screen" style={{ background: "#efeeeb" }}>
            <AdminHeader userName={userName} />
            <main id="main-content" className="mx-auto max-w-[1540px] px-4 py-8 pb-20 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
