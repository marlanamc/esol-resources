"use client";

import { Users, BookOpen, Calendar, BarChart2, LayoutGrid, GraduationCap, Map } from "lucide-react";
import { ModeHeader } from "@/components/layout/ModeHeader";

const NAV_ITEMS = [
    { href: "/teach", label: "Home", Icon: LayoutGrid, exact: true },
    { href: "/teach/classes", label: "Classes", Icon: Users, exact: false },
    { href: "/teach/activities", label: "Activities", Icon: BookOpen, exact: false },
    { href: "/teach/calendar", label: "Calendar", Icon: Calendar, exact: false },
    { href: "/teach/gradebook", label: "Gradebook", Icon: GraduationCap, exact: false },
    { href: "/teach/map", label: "Course Map", Icon: Map, exact: false },
    { href: "/teach/reports", label: "Reports", Icon: BarChart2, exact: false },
] as const;

interface TeachHeaderProps {
    userName?: string;
    isAdmin?: boolean;
}

export function TeachHeader({ userName = "", isAdmin = false }: TeachHeaderProps) {
    return (
        <ModeHeader
            mode="teaching"
            homeHref="/teach"
            subtitle="Teaching · Class workspace"
            userName={userName}
            tabs={NAV_ITEMS}
            ariaLabel="Teacher navigation"
            showViewModeToggle={isAdmin}
            showAdminMode={isAdmin}
        />
    );
}
