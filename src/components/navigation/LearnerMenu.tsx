"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Gamepad2, Menu, Mic, PenLine, PenTool, Volume2, X } from "lucide-react";
import { BookOpenIcon, HomeIcon, MapIcon, StarIcon, TrophyIcon } from "@/components/icons/Icons";

interface LearnerMenuProps {
    mode?: "brand" | "quiet";
    userName?: string;
    className?: string;
}

export function LearnerMenu({
    mode = "quiet",
    userName = "",
    className = "",
}: LearnerMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState<Record<string, boolean>>({});
    const mobileName = userName.trim().split(/\s+/)[0] || "Student";

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
            const main = document.querySelector("main");
            if (main) main.setAttribute("inert", "");
            return () => {
                document.body.classList.remove("overflow-hidden");
                if (main) main.removeAttribute("inert");
            };
        }

        document.body.classList.remove("overflow-hidden");
        const main = document.querySelector("main");
        if (main) main.removeAttribute("inert");
    }, [isOpen]);

    useEffect(() => {
        fetch("/api/activities")
            .then((res) => res.json())
            .then((activities) => {
                if (!Array.isArray(activities)) return;

                setAvailableSubjects({
                    vocabulary: activities.some((activity) => activity.id?.startsWith("vocab-")),
                    grammar: activities.some((activity) => activity.category === "grammar"),
                    games: activities.some((activity) => {
                        if (activity.type !== "game") return false;
                        if (activity.id?.startsWith("vocab-")) return false;
                        return (
                            ["numbers-game", "countable-uncountable-nouns"].includes(activity.id) ||
                            ["verb-forms", "verbforms"].includes(activity.ui) ||
                            activity.category === "games"
                        );
                    }),
                    quizzes: activities.some((activity) => {
                        if (activity.category !== "quizzes") return false;
                        try {
                            return JSON.parse(activity.content || "{}").released === true;
                        } catch {
                            return false;
                        }
                    }),
                    speaking: activities.some((activity) => {
                        if (activity.category !== "speaking") return false;
                        try {
                            return JSON.parse(activity.content || "{}").released === true;
                        } catch {
                            return false;
                        }
                    }),
                    writing: activities.some(
                        (activity) => activity.category === "writing" || activity.category === "writing-reading"
                    ),
                    pronunciation: activities.some(
                        (activity) =>
                            activity.category === "pronunciation" ||
                            activity.ui === "ed-pronunciation" ||
                            activity.ui === "minimal-pairs"
                    ),
                });
            })
            .catch((error) => console.error("Error fetching activities for sidebar:", error));
    }, []);

    const closeMenu = () => setIsOpen(false);

    const trigger = mode === "brand" ? (
        <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg ${className}`}
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
        >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:shadow-lg transition-[box-shadow,transform] duration-300 group-hover:scale-105">
                <BookOpenIcon className="w-5 h-5 text-white" />
            </div>
            <div className="sm:hidden min-w-0">
                <span
                    className="block text-base font-semibold text-primary leading-tight truncate max-w-[130px]"
                    style={{ fontFamily: "Lora, serif" }}
                >
                    {mobileName}
                </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] sm:text-[12px] font-medium text-secondary tracking-[0.06em] uppercase pl-[2px]">
                    ESOL
                </span>
                <span
                    className="text-base sm:text-lg font-bold text-primary leading-tight tracking-[-0.01em]"
                    style={{ fontFamily: "Lora, serif" }}
                >
                    Class Companion
                </span>
            </div>
        </button>
    ) : (
        <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-white/90 text-[var(--color-text)] shadow-sm transition-colors hover:bg-[var(--color-bg-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${className || "h-10 w-10"}`}
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
        >
            <span className="sr-only">Open navigation menu</span>
            <Menu className="h-4 w-4" aria-hidden />
        </button>
    );

    return (
        <>
            {trigger}

            {isOpen ? (
                <div
                    className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            ) : null}

            <div
                className={`fixed top-0 left-0 bottom-0 z-[310] w-[280px] sm:w-[320px] bg-[#fef9f3] shadow-2xl border-r border-[#e7dfd3] flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation Menu"
            >
                <div className="p-5 border-b border-[#e7dfd3] flex items-center justify-between mt-[env(safe-area-inset-top,0px)]">
                    <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:shadow-lg transition-[box-shadow,transform] duration-300 group-hover:scale-105">
                            <BookOpenIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] font-medium text-secondary tracking-[0.06em] uppercase pl-[2px]">
                                ESOL
                            </span>
                            <span
                                className="text-lg font-bold text-primary leading-tight tracking-[-0.01em]"
                                style={{ fontFamily: "Lora, serif" }}
                            >
                                Class Companion
                            </span>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={closeMenu}
                        className="p-2 -mr-2 text-text-muted hover:text-text rounded-full hover:bg-black/5 active:scale-95 transition-[color,background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" aria-hidden />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide" style={{ overscrollBehavior: "contain" }}>
                    <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
                        <MenuLink href="/dashboard" label="Dashboard Home" icon={<HomeIcon className="w-5 h-5 text-secondary" />} onNavigate={closeMenu} />
                        <MenuLink href="/dashboard/activities" label="All Activities" icon={<BookOpenIcon className="w-5 h-5 text-[#b86a56]" />} onNavigate={closeMenu} />
                        <MenuLink href="/grammar-map" label="Grammar Map" icon={<MapIcon className="w-5 h-5 text-[#6f9c76]" />} onNavigate={closeMenu} />
                        <MenuLink href="/dashboard/leaderboard" label="Leaderboard" icon={<TrophyIcon className="w-5 h-5 text-[#cda46f]" />} onNavigate={closeMenu} />
                        <MenuLink href="/dashboard/profile" label="My Profile" icon={<StarIcon className="w-5 h-5 text-[#88A392]" />} onNavigate={closeMenu} />

                        <div className="h-px bg-border/20 my-3 mx-2" />

                        {Object.values(availableSubjects).some(Boolean) ? (
                            <p className="px-4 text-[13px] font-bold text-text-muted uppercase tracking-wider mb-2" style={{ letterSpacing: "0.1em" }}>
                                Subjects
                            </p>
                        ) : null}

                        {availableSubjects.grammar ? (
                            <MenuLink href="/dashboard/activities?category=grammar" label="Grammar" icon={<PenLine className="w-5 h-5 text-[#2e7d32]" strokeWidth={1.5} />} onNavigate={closeMenu} light />
                        ) : null}
                        {availableSubjects.vocabulary ? (
                            <MenuLink href="/dashboard/activities?category=vocabulary" label="Vocabulary" icon={<BookOpen className="w-5 h-5 text-[#1565c0]" strokeWidth={1.5} />} onNavigate={closeMenu} light />
                        ) : null}
                        {availableSubjects.games ? (
                            <MenuLink href="/dashboard/activities?category=games" label="Games" icon={<Gamepad2 className="w-5 h-5 text-[#7d3fa6]" strokeWidth={1.5} />} onNavigate={closeMenu} light />
                        ) : null}
                        {availableSubjects.quizzes ? (
                            <MenuLink href="/dashboard/activities?category=quizzes" label="Quizzes" icon={<ClipboardList className="w-5 h-5 text-[#c44a28]" strokeWidth={1.5} />} onNavigate={closeMenu} light />
                        ) : null}
                        {availableSubjects.speaking ? (
                            <MenuLink href="/dashboard/activities?category=speaking" label="Speaking" icon={<Mic className="w-5 h-5 text-[#b56e1a]" strokeWidth={1.5} />} onNavigate={closeMenu} light />
                        ) : null}
                        {availableSubjects.writing ? (
                            <MenuLink href="/dashboard/activities?category=writing" label="Writing" icon={<PenTool className="w-5 h-5 text-[#3d8e42]" strokeWidth={1.5} />} onNavigate={closeMenu} light />
                        ) : null}
                        {availableSubjects.pronunciation ? (
                            <MenuLink href="/dashboard/activities?category=pronunciation" label="Pronunciation" icon={<Volume2 className="w-5 h-5 text-[#8a5cf6]" strokeWidth={1.5} />} onNavigate={closeMenu} light />
                        ) : null}
                    </nav>
                </div>
            </div>
        </>
    );
}

interface MenuLinkProps {
    href: string;
    label: string;
    icon: ReactNode;
    onNavigate: () => void;
    light?: boolean;
}

function MenuLink({ href, label, icon, onNavigate, light = false }: MenuLinkProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                light ? "px-4 py-2.5 font-medium text-text hover:bg-black/5 active:bg-black/10" : "px-4 py-3 font-semibold text-text hover:bg-black/5 active:bg-black/10"
            }`}
            onClick={onNavigate}
        >
            {icon}
            <span className={light ? "text-base" : ""}>{label}</span>
        </Link>
    );
}
