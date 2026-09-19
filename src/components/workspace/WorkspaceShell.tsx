"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    BookOpen,
    CalendarDays,
    ChartNoAxesCombined,
    House,
    Map,
    MoreHorizontal,
    Users,
    Library,
    HeartPulse,
    ArrowUpRight,
    X,
} from "lucide-react";
import { TEACH_CLASS_COOKIE } from "@/lib/teach/active-class-shared";
import { TeachClassSwitcher } from "@/components/teach/TeachClassSwitcher";
import UserProfileDropdown from "@/components/layout/UserProfileDropdown";
import { ViewModeSwitcher } from "@/components/teach/ViewModeSwitcher";

const primary = [
    { href: "/teach", label: "Home", Icon: House },
    { href: "/teach/map", label: "Course Map", Icon: Map },
    { href: "/teach/activities", label: "Activities", Icon: BookOpen },
    { href: "/teach/calendar", label: "Calendar", Icon: CalendarDays },
    { href: "/teach/reports", label: "Progress", Icon: ChartNoAxesCombined },
    { href: "/teach/classes", label: "Classes", Icon: Users },
];
const administration = [
    { href: "/admin/users", label: "Accounts", Icon: Users },
    { href: "/admin/content", label: "Content", Icon: Library },
    { href: "/admin/health", label: "System Health", Icon: HeartPulse },
];

export function WorkspaceShell({
    children,
    admin,
    userName,
    classes,
    activeClassId,
    avatar,
    avatarColor,
}: {
    children: ReactNode;
    admin: boolean;
    userName: string;
    classes: { id: string; name: string }[];
    activeClassId: string | null;
    avatar: string | null;
    avatarColor: string | null;
}) {
    const pathname = usePathname();
    const search = useSearchParams();
    const dialog = useRef<HTMLDialogElement>(null);
    const routeClassId = pathname.match(/^\/teach\/classes\/([^/]+)/)?.[1];
    const selectedId =
        [routeClassId, search.get("classId"), activeClassId].find((id) =>
            classes.some((cls) => cls.id === id),
        ) ?? "";
    useEffect(() => {
        if (selectedId)
            document.cookie = `${TEACH_CLASS_COOKIE}=${encodeURIComponent(selectedId)}; path=/; max-age=31536000; samesite=lax`;
    }, [selectedId]);
    const selectedClass = classes.find((cls) => cls.id === selectedId);
    const progress =
        pathname.startsWith("/teach/reports") ||
        pathname.startsWith("/teach/gradebook") ||
        pathname.startsWith("/teach/students") ||
        pathname === "/admin/diagnostics";
    const active = (href: string) =>
        href === "/teach"
            ? pathname === href
            : href === "/teach/reports"
              ? progress
              : pathname.startsWith(href);
    const scopedHref = (href: string) =>
        selectedId ? `${href}?classId=${encodeURIComponent(selectedId)}` : href;
    const navLink = (item: (typeof primary)[number]) => (
        <Link
            key={item.href}
            href={scopedHref(item.href)}
            onClick={() => dialog.current?.close()}
            aria-current={active(item.href) ? "page" : undefined}
            className={`workspace-nav-link ${active(item.href) ? "is-active" : ""}`}
        >
            <item.Icon size={19} aria-hidden="true" />
            {item.label}
        </Link>
    );
    return (
        <div className="workspace">
            <a
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[500] workspace-button"
                href="#main-content"
            >
                Skip to main content
            </a>
            <aside className="workspace-sidebar">
                <Link href={scopedHref("/teach")} className="workspace-brand">
                    <span className="workspace-brand-mark">
                        <BookOpen size={22} />
                    </span>
                    <span>
                        Class Companion<small>Teaching workspace</small>
                    </span>
                </Link>
                <nav aria-label="Workspace navigation" className="space-y-1">
                    {primary.map(navLink)}
                </nav>
                {admin && (
                    <nav aria-label="Administration" className="mt-8 space-y-1">
                        <p className="workspace-eyebrow px-3 mb-2">
                            Administration
                        </p>
                        {administration.map(navLink)}
                        <Link
                            href="/admin"
                            className="workspace-nav-link"
                            aria-current={
                                pathname === "/admin" ? "page" : undefined
                            }
                        >
                            Overview <ArrowUpRight size={16} />
                        </Link>
                    </nav>
                )}
                <div className="mt-auto pt-8">
                    <ViewModeSwitcher />
                </div>
            </aside>
            <div className="workspace-body">
                <header className="workspace-header">
                    <div className="min-w-0 flex items-center gap-3">
                        <span className="workspace-eyebrow hidden sm:block">
                            Class
                        </span>
                        {classes.length > 1 ? (
                            <TeachClassSwitcher
                                classes={classes}
                                selectedClassId={selectedId}
                            />
                        ) : (
                            <span className="font-semibold truncate">
                                {selectedClass?.name ?? "Teaching workspace"}
                            </span>
                        )}
                    </div>
                    <UserProfileDropdown
                        userName={userName}
                        initialAvatar={avatar}
                        initialAvatarColor={avatarColor}
                    />
                </header>
                <main id="main-content" className="workspace-main">
                    {progress && (
                        <nav
                            aria-label="Progress sections"
                            className="workspace-tabs mb-6"
                        >
                            {[
                                {
                                    href: "/teach/reports",
                                    label: "Participation",
                                },
                                {
                                    href: "/teach/gradebook",
                                    label: "Gradebook",
                                },
                                ...(admin
                                    ? [
                                          {
                                              href: "/admin/diagnostics",
                                              label: "Skill Gaps",
                                          },
                                      ]
                                    : []),
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={scopedHref(item.href)}
                                    aria-current={
                                        pathname === item.href
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                    {children}
                </main>
            </div>
            <nav
                aria-label="Mobile workspace navigation"
                className="workspace-bottom-nav"
            >
                {[primary[0], primary[1], primary[2], primary[4]].map(
                    (item) => (
                        <Link
                            key={item.href}
                            href={scopedHref(item.href)}
                            aria-current={
                                active(item.href) ? "page" : undefined
                            }
                        >
                            <item.Icon size={20} aria-hidden="true" />
                            <span>
                                {item.label === "Course Map"
                                    ? "Map"
                                    : item.label}
                            </span>
                        </Link>
                    ),
                )}
                <button
                    aria-label="More navigation"
                    aria-haspopup="dialog"
                    onClick={() => dialog.current?.showModal()}
                >
                    <MoreHorizontal size={20} />
                    <span>More</span>
                </button>
            </nav>
            <dialog
                ref={dialog}
                className="workspace-menu"
                aria-labelledby="workspace-menu-title"
                onClick={(e) => {
                    if (e.target === e.currentTarget) dialog.current?.close();
                }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2
                        id="workspace-menu-title"
                        className="font-display text-xl font-bold"
                    >
                        Your workspace
                    </h2>
                    <button
                        className="workspace-icon-button"
                        aria-label="Close navigation"
                        onClick={() => dialog.current?.close()}
                    >
                        <X size={22} />
                    </button>
                </div>
                <nav
                    aria-label="More workspace navigation"
                    className="space-y-1"
                >
                    {[primary[3], primary[5]].map(navLink)}
                    {admin && (
                        <>
                            <p className="workspace-eyebrow px-3 pt-5 pb-2">
                                Administration
                            </p>
                            {administration.map(navLink)}
                            <Link
                                className="workspace-nav-link"
                                href="/admin"
                                onClick={() => dialog.current?.close()}
                            >
                                Overview
                            </Link>
                        </>
                    )}
                </nav>
                <div className="mt-4 border-t pt-4">
                    <ViewModeSwitcher />
                </div>
            </dialog>
        </div>
    );
}
