"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { clearServiceWorkerCache } from "@/lib/clearCache";
import { usePathname, useRouter } from "next/navigation";
import { SelectedAvatarDisplay } from "@/components/ui/SelectedAvatarDisplay";
import { UserIcon } from "@/components/icons/Icons";
import { Calendar, LogOut, Sparkles, UserCog, X } from "lucide-react";
import {
    AVATAR_UPDATED_EVENT,
    fetchAndCacheAvatar,
    getFreshMemoryAvatar,
    readCachedAvatar,
    resolveServerAvatar,
    type CachedAvatar,
} from "@/lib/avatar-cache";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AccentColorPicker } from "@/components/dashboard/AccentColorPicker";
import { resolveAccentKey, type AccentKey } from "@/lib/accent-colors";

interface UserProfileDropdownProps {
    userName: string;
    variant?: "default" | "dashboardv2";
    /** Server-provided avatar so first paint skips the default flash */
    initialAvatar?: string | null;
    initialAvatarColor?: string | null;
}

export default function UserProfileDropdown({
    userName,
    variant = "default",
    initialAvatar = null,
    initialAvatarColor = null,
}: UserProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const serverAvatar = resolveServerAvatar({
        avatar: initialAvatar ?? undefined,
        avatarColor: initialAvatarColor ?? undefined,
    });
    const hasServerAvatar = initialAvatar != null || initialAvatarColor != null;
    const [avatarId, setAvatarId] = useState<string>(serverAvatar.avatar);
    const [colorId, setColorId] = useState<string>(serverAvatar.avatarColor);
    const [accentKey, setAccentKey] = useState<AccentKey | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Seed from client cache / server props, then refresh from API.
    // Re-run on pathname so edits on /dashboard/avatar sync back into the header.
    useEffect(() => {
        let cancelled = false;

        const apply = (avatar: string, avatarColor: string) => {
            if (cancelled) return;
            setAvatarId(avatar);
            setColorId(avatarColor);
        };

        // Memory (same-tab saves) > server props > localStorage > API.
        // Do not write server props into the client cache — that can block a
        // fresh API read after the layout props go stale.
        const memory = getFreshMemoryAvatar();
        if (memory) {
            apply(memory.avatar, memory.avatarColor);
        } else if (hasServerAvatar) {
            apply(serverAvatar.avatar, serverAvatar.avatarColor);
        } else {
            const stored = readCachedAvatar();
            if (stored) apply(stored.avatar, stored.avatarColor);
        }

        (async () => {
            const avatar = await fetchAndCacheAvatar();
            if (!avatar || cancelled) return;
            apply(avatar.avatar, avatar.avatarColor);
        })();

        return () => {
            cancelled = true;
        };
    }, [hasServerAvatar, serverAvatar.avatar, serverAvatar.avatarColor, pathname]);

    // Keep header in sync while the avatar page writes the cache.
    useEffect(() => {
        function handleAvatarUpdated(event: Event) {
            const detail = (event as CustomEvent<CachedAvatar>).detail;
            if (!detail) return;
            setAvatarId(detail.avatar);
            setColorId(detail.avatarColor);
        }

        window.addEventListener(AVATAR_UPDATED_EVENT, handleAvatarUpdated);
        return () => {
            window.removeEventListener(AVATAR_UPDATED_EVENT, handleAvatarUpdated);
        };
    }, []);
    // Keep the picker checkmark aligned with the live theme whenever the menu
    // opens. data-accent is maintained by AccentColorInitializer and the picker.
    useEffect(() => {
        if (!isOpen) return;
        setAccentKey(
            resolveAccentKey(document.documentElement.getAttribute("data-accent")),
        );
    }, [isOpen]);

    const handleLogout = async () => {
        await Promise.race([
            clearServiceWorkerCache(),
            new Promise((resolve) => setTimeout(resolve, 1200)),
        ]);
        await signOut({ callbackUrl: "/login" });
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        router.push("/dashboard/profile");
    };

    const handleAccountClick = () => {
        setIsOpen(false);
        router.push("/dashboard/account");
    };

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        router.push("/dashboard/avatar");
    };

    const handleCalendarOpen = () => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("dashboardv2:open-calendar"));
        }
        setIsOpen(false);
    };

    const isDashboardV2Desktop = variant === "dashboardv2";

    const accentSection = (
        <div className="px-4 py-2">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                Accent Color
            </p>
            {accentKey ? (
                <AccentColorPicker
                    initialAccent={accentKey}
                    onAccentChange={setAccentKey}
                />
            ) : (
                <div className="flex gap-3" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span
                            key={i}
                            className="h-11 w-11 animate-pulse rounded-full"
                            style={{ backgroundColor: "var(--surface-subtle)" }}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 shadow-md transition-[border-color,background-color] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:h-10 sm:w-10"
                style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border-strong)',
                }}
                aria-label="User menu"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <SelectedAvatarDisplay
                    avatarId={avatarId}
                    colorId={colorId}
                    size="sm"
                    className="pointer-events-none scale-110 sm:scale-100"
                />
            </button>

            {isOpen && (
                <>
                {isDashboardV2Desktop && (
                    <div
                        className="fixed inset-x-0 bottom-0 top-[85px] z-[279] hidden md:block bg-black/12 backdrop-blur-[2px]"
                        aria-hidden="true"
                        onClick={() => setIsOpen(false)}
                    />
                )}
                {isDashboardV2Desktop ? (
                    <>
                    <div className="hidden md:flex fixed right-0 top-[85px] z-[281] h-[calc(100dvh-85px)] w-[320px] flex-col border-l shadow-[-10px_0_34px_rgba(13,22,32,0.22)]" style={{ borderColor: 'var(--border-subtle)', background: 'linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-overlay) 100%)' }}>
                        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
                            <div className="flex items-center gap-3">
                                <SelectedAvatarDisplay
                                    avatarId={avatarId}
                                    colorId={colorId}
                                    size="md"
                                />
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">
                                        Your Space
                                    </p>
                                    <p className="text-sm font-semibold text-text truncate">{userName}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border text-text-muted shadow-sm transition-colors hover:text-text"
                                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-base)' }}
                                aria-label="Close user panel"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-3 px-4 py-5">
                            <button
                                onClick={handleAvatarClick}
                                className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium text-text shadow-sm transition-colors"
                                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-base)' }}
                            >
                                <SelectedAvatarDisplay
                                    avatarId={avatarId}
                                    colorId={colorId}
                                    size="sm"
                                    className="pointer-events-none"
                                />
                                <span>Change Avatar</span>
                            </button>

                            <button
                                onClick={handleProfileClick}
                                className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium text-text shadow-sm transition-colors"
                                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-base)' }}
                            >
                                <UserIcon className="h-4 w-4" />
                                <span>View Profile</span>
                            </button>

                            <button
                                onClick={handleAccountClick}
                                className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium text-text shadow-sm transition-colors"
                                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-base)' }}
                            >
                                <UserCog className="h-4 w-4" />
                                <span>View Account</span>
                            </button>

                            <div className="rounded-2xl border px-4 py-3 shadow-sm" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-base)' }}>
                                <ThemeToggle />
                            </div>

                            <div className="rounded-2xl border px-2 py-2 shadow-sm" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-base)' }}>
                                {accentSection}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium text-text shadow-sm transition-colors"
                                style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-base)' }}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>

                            <button
                                onClick={handleCalendarOpen}
                                className="hidden w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold text-text shadow-[0_8px_20px_rgba(13,22,32,0.16)] transition-colors xl:flex"
                                style={{ borderColor: 'var(--tone-vocabulary-border)', background: 'linear-gradient(90deg, var(--tone-vocabulary-surface) 0%, var(--surface-base) 100%)' }}
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--text-on-accent)] shadow-[0_6px_14px_rgba(13,22,32,0.16)]" style={{ background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)' }}>
                                    <Calendar className="h-4 w-4" />
                                </span>
                                <span className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                                        Quick Access
                                    </span>
                                    <span>Open Calendar</span>
                                </span>
                            </button>
                        </div>

                        <div className="hidden border-t border-[#eadfd2] dark:border-white/10 px-5 py-4 xl:block">
                            <div className="flex items-start gap-3 rounded-2xl px-4 py-3 text-sm text-text-muted" style={{ backgroundColor: 'var(--surface-subtle)' }}>
                                <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                                <p>Calendar now lives inside the avatar panel on desktop for `/dashboardv2`.</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:hidden absolute right-0 mt-2 w-72 rounded-xl shadow-xl border py-2 z-[280] animate-fade-in-up" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
                        <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                            <p className="text-sm font-medium text-text truncate">{userName}</p>
                        </div>
                        <button
                            onClick={handleAvatarClick}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-text transition-colors flex items-center gap-2 hover:bg-[var(--surface-subtle)]"
                        >
                            <SelectedAvatarDisplay
                                avatarId={avatarId}
                                colorId={colorId}
                                size="sm"
                                className="pointer-events-none"
                            />
                            Change Avatar
                        </button>
                        <button
                            onClick={handleProfileClick}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-text transition-colors flex items-center gap-2 hover:bg-[var(--surface-subtle)]"
                        >
                            <UserIcon className="w-4 h-4" />
                            View Profile
                        </button>
                        <button
                            onClick={handleAccountClick}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-text transition-colors flex items-center gap-2 hover:bg-[var(--surface-subtle)]"
                        >
                            <UserCog className="w-4 h-4" />
                            View Account
                        </button>
                        <div className="px-3 py-2">
                            <ThemeToggle compact />
                        </div>
                        <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                            {accentSection}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-text transition-colors flex items-center gap-2 hover:bg-[var(--surface-subtle)]"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                    </>
                ) : (
                <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl border py-2 z-[280] animate-fade-in-up" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
                    <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-sm font-medium text-text truncate">{userName}</p>
                    </div>
                    <button
                        onClick={handleAvatarClick}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text transition-colors flex items-center gap-2 hover:bg-[var(--surface-subtle)]"
                    >
                        <SelectedAvatarDisplay
                            avatarId={avatarId}
                            colorId={colorId}
                            size="sm"
                            className="pointer-events-none"
                        />
                        Change Avatar
                    </button>
                    <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text transition-colors flex items-center gap-2 hover:bg-[var(--surface-subtle)]"
                    >
                        <UserIcon className="w-4 h-4" />
                        View Profile
                    </button>
                    <button
                        onClick={handleAccountClick}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text transition-colors flex items-center gap-2 hover:bg-[var(--surface-subtle)]"
                    >
                        <UserCog className="w-4 h-4" />
                        View Account
                    </button>
                    <div className="px-3 py-2">
                        <ThemeToggle compact />
                    </div>
                    <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        {accentSection}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text transition-colors flex items-center gap-2 hover:bg-[var(--surface-subtle)]"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
                )}
                </>
            )}
        </div>
    );
}
