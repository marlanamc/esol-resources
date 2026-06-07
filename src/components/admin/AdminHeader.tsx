"use client";

import { BookOpen, HeartPulse, LayoutDashboard, Stethoscope, Users } from "lucide-react";
import { ModeHeader } from "@/components/layout/ModeHeader";

const NAV_ITEMS = [
    { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", Icon: Users, exact: false },
    { href: "/admin/content", label: "Content", Icon: BookOpen, exact: false },
    { href: "/admin/diagnostics", label: "Diagnostics", Icon: Stethoscope, exact: false },
    { href: "/admin/health", label: "Health", Icon: HeartPulse, exact: false },
] as const;

interface AdminHeaderProps {
    userName?: string;
}

export function AdminHeader({ userName = "" }: AdminHeaderProps) {
    return (
        <ModeHeader
            mode="admin"
            homeHref="/admin"
            subtitle="Admin · System overview"
            userName={userName}
            tabs={NAV_ITEMS}
            ariaLabel="Admin navigation"
            showViewModeToggle
            showAdminMode
        />
    );
}
