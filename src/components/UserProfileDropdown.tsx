"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { clearServiceWorkerCache } from "@/lib/clearCache";
import { useRouter } from "next/navigation";
import SelectedAvatarDisplay from "@/components/ui/SelectedAvatarDisplay";
import { UserIcon } from "@/components/icons/Icons";
import { Calendar, LogOut, Sparkles, X } from "lucide-react";
import { DEFAULT_AVATAR, DEFAULT_COLOR } from "@/lib/avatar-constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface UserProfileDropdownProps {
    userName: string;
    variant?: "default" | "dashboardv2";
}

type AvatarResponse = {
    avatar?: string | null;
    avatarColor?: string | null;
};

type NormalizedAvatar = {
    avatar: string;
    avatarColor: string;
};

type AvatarCache = {
    data: NormalizedAvatar;
    cachedAt: number;
};

const AVATAR_CACHE_TTL_MS = 60_000;
let avatarCache: AvatarCache | null = null;
let avatarInFlight: Promise<NormalizedAvatar | null> | null = null;

function getFreshAvatarCache(): NormalizedAvatar | null {
    if (!avatarCache) return null;
    if (Date.now() - avatarCache.cachedAt > AVATAR_CACHE_TTL_MS) return null;
    return avatarCache.data;
}

async function loadAvatar(): Promise<NormalizedAvatar | null> {
    const cached = getFreshAvatarCache();
    if (cached) return cached;
    if (avatarInFlight) return avatarInFlight;

    avatarInFlight = (async () => {
        try {
            const res = await fetch("/api/user/avatar");
            if (!res.ok) return null;
            const data = (await res.json()) as AvatarResponse;
            const normalized = {
                avatar: data.avatar || DEFAULT_AVATAR,
                avatarColor: data.avatarColor || DEFAULT_COLOR,
            };
            avatarCache = { data: normalized, cachedAt: Date.now() };
            return normalized;
        } catch {
            return null;
        } finally {
            avatarInFlight = null;
        }
    })();

    return avatarInFlight;
}

export default function UserProfileDropdown({ userName, variant = "default" }: UserProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const cachedAvatar = getFreshAvatarCache();
    const [avatarId, setAvatarId] = useState<string>(cachedAvatar?.avatar || DEFAULT_AVATAR);
    const [colorId, setColorId] = useState<string>(cachedAvatar?.avatarColor || DEFAULT_COLOR);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    // Fetch avatar data
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const avatar = await loadAvatar();
            if (!avatar || cancelled) return;
            setAvatarId(avatar.avatar);
            setColorId(avatar.avatarColor);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full border-2 transition-[border-color,background-color] flex items-center justify-center focus:outline-none shadow-md focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
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
                    size="md" 
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

                            <div className="rounded-2xl border px-4 py-3 shadow-sm" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-base)' }}>
                                <ThemeToggle />
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
                    <div className="md:hidden absolute right-0 mt-2 w-52 rounded-xl shadow-xl border py-2 z-[280] animate-fade-in-up" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
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
                        <div className="px-3 py-2">
                            <ThemeToggle compact />
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
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border py-2 z-[280] animate-fade-in-up" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
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
                    <div className="px-3 py-2">
                        <ThemeToggle compact />
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
