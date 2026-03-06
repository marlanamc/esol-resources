"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenIcon, TrophyIcon, MapIcon, StarIcon, HomeIcon } from "@/components/icons/Icons";
import { PenLine, Gamepad2, BookOpen, ClipboardList, Mic, PenTool, Volume2 } from 'lucide-react';
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { StudentQuickStats } from "@/components/dashboard/StudentQuickStats";

interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName = "" }: DashboardHeaderProps) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState<Record<string, boolean>>({});
    const mobileName = userName.trim().split(/\s+/)[0] || "Student";
    const router = useRouter();
    const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleLogoClick = (e: React.MouseEvent) => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
        }

        if (e.detail >= 2) {
            setIsPanelOpen(false);
            router.push('/dashboard');
        } else {
            clickTimeoutRef.current = setTimeout(() => {
                setIsPanelOpen(true);
            }, 250);
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isPanelOpen) {
                setIsPanelOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPanelOpen]);

    // Prevent body scroll when panel is open (classList approach for iOS compatibility)
    useEffect(() => {
        if (isPanelOpen) {
            document.body.classList.add("overflow-hidden");
            // Set inert on sibling content for focus trap
            const main = document.querySelector('main');
            if (main) main.setAttribute('inert', '');
        } else {
            document.body.classList.remove("overflow-hidden");
            const main = document.querySelector('main');
            if (main) main.removeAttribute('inert');
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
            const main = document.querySelector('main');
            if (main) main.removeAttribute('inert');
        };
    }, [isPanelOpen]);

    // Fetch and compute available subjects
    useEffect(() => {
        fetch('/api/activities')
            .then(res => res.json())
            .then(activities => {
                if (!Array.isArray(activities)) return;
                const map: Record<string, boolean> = {};
                map['vocabulary'] = activities.some((a) => a.id?.startsWith('vocab-'));
                map['grammar'] = activities.some((a) => a.category === 'grammar');
                map['games'] = activities.some((a) => {
                    if (a.type !== 'game') return false;
                    if (a.id?.startsWith('vocab-')) return false;
                    return ['numbers-game', 'countable-uncountable-nouns'].includes(a.id) || ['verb-forms', 'verbforms'].includes(a.ui) || a.category === 'games';
                });
                map['quizzes'] = activities.some((a) => {
                    if (a.category !== 'quizzes') return false;
                    try { return JSON.parse(a.content || '{}').released === true; } catch { return false; }
                });
                map['speaking'] = activities.some((a) => {
                    if (a.category !== 'speaking') return false;
                    try { return JSON.parse(a.content || '{}').released === true; } catch { return false; }
                });
                map['writing'] = activities.some((a) => a.category === 'writing' || a.category === 'writing-reading');
                map['pronunciation'] = activities.some((a) => a.category === 'pronunciation' || a.ui === 'ed-pronunciation' || a.ui === 'minimal-pairs');
                
                setAvailableSubjects(map);
            })
            .catch(err => console.error("Error fetching activities for sidebar:", err));
    }, []);

    return (
        <header 
            className="sticky top-0 border-b z-[260] bg-[#fef9f3] border-[rgba(0,0,0,0.08)] shadow-[0_1px_4px_rgba(38,30,20,0.06)] sm:shadow-sm"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
            <div className="max-w-[1800px] mx-auto py-4 sm:py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex-1">
                    <button
                        onClick={handleLogoClick}
                        className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg"
                        aria-label="Open navigation panel"
                        aria-expanded={isPanelOpen}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:shadow-lg transition-[box-shadow,transform] duration-300 group-hover:scale-105">
                            <BookOpenIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="sm:hidden min-w-0">
                            <span className="block text-base font-semibold text-primary leading-tight truncate max-w-[130px]" style={{ fontFamily: "Lora, serif" }}>
                                {mobileName}
                            </span>
                        </div>
                        <div className="hidden sm:flex flex-col text-left">
                            <span className="text-[11px] sm:text-[12px] font-medium text-secondary tracking-[0.06em] uppercase pl-[2px]">ESOL</span>
                            <span className="text-base sm:text-lg font-bold text-primary leading-tight tracking-[-0.01em]" style={{ fontFamily: "Lora, serif" }}>Class Companion</span>
                        </div>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="sm:hidden flex items-center gap-1.5">
                        <StudentQuickStats mobile maxVisible={2} chipKeys={["streak", "weekly"]} compact />
                    </div>
                    <Link
                        href="/dashboard/leaderboard"
                        className="hidden md:inline-flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border shadow-md transition-colors text-white hover:bg-[#7a9384] hover:border-[#6d8577] focus:outline-none focus:ring-2 focus:ring-[#88A392] focus:ring-offset-1 min-w-[132px] justify-center"
                        style={{
                            backgroundColor: "#88A392",
                            borderColor: "#7a9384",
                        }}
                    >
                        <TrophyIcon className="w-4 h-4" />
                        Leaderboard
                    </Link>
                    <UserProfileDropdown userName={userName} />
                </div>
            </div>

            {/* Left Side Navigation Panel Overlay */}
            {isPanelOpen && (
                <div
                    className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
                    onClick={() => setIsPanelOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Left Side Navigation Panel Drawer */}
            <div
                className={`fixed top-0 left-0 bottom-0 z-[310] w-[280px] sm:w-[320px] bg-[#fef9f3] shadow-2xl border-r border-[#e7dfd3] flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isPanelOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation Menu"
            >
                <div className="p-5 border-b border-[#e7dfd3] flex items-center justify-between mt-[env(safe-area-inset-top,0px)]">
                    <Link href="/dashboard" onClick={() => setIsPanelOpen(false)} className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:shadow-lg transition-[box-shadow,transform] duration-300 group-hover:scale-105">
                            <BookOpenIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] font-medium text-secondary tracking-[0.06em] uppercase pl-[2px]">ESOL</span>
                            <span className="text-lg font-bold text-primary leading-tight tracking-[-0.01em]" style={{ fontFamily: "Lora, serif" }}>Class Companion</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsPanelOpen(false)}
                        className="p-2 -mr-2 text-text-muted hover:text-text rounded-full hover:bg-black/5 active:scale-95 transition-[color,background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Close menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide" style={{ overscrollBehavior: 'contain' }}>
                    <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onClick={() => setIsPanelOpen(false)}
                        >
                            <HomeIcon className="w-5 h-5 text-secondary" />
                            <span>Dashboard Home</span>
                        </Link>
                        
                        <Link
                            href="/dashboard/activities"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onClick={() => setIsPanelOpen(false)}
                        >
                            <BookOpenIcon className="w-5 h-5 text-[#b86a56]" />
                            <span>All Activities</span>
                        </Link>

                        <Link
                            href="/grammar-map"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onClick={() => setIsPanelOpen(false)}
                        >
                            <MapIcon className="w-5 h-5 text-[#6f9c76]" />
                            <span>Grammar Map</span>
                        </Link>

                        <Link
                            href="/dashboard/leaderboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onClick={() => setIsPanelOpen(false)}
                        >
                            <TrophyIcon className="w-5 h-5 text-[#cda46f]" />
                            <span>Leaderboard</span>
                        </Link>

                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onClick={() => setIsPanelOpen(false)}
                        >
                            <StarIcon className="w-5 h-5 text-[#88A392]" />
                            <span>My Profile</span>
                        </Link>

                        <div className="h-px bg-border/20 my-3 mx-2"></div>
                        {Object.values(availableSubjects).some(Boolean) && (
                            <p className="px-4 text-[13px] font-bold text-text-muted uppercase tracking-wider mb-2" style={{ letterSpacing: "0.1em" }}>Subjects</p>
                        )}

                        {availableSubjects['grammar'] && (
                            <Link
                                href="/dashboard/activities?category=grammar"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => setIsPanelOpen(false)}
                            >
                                <PenLine className="w-5 h-5 text-[#2e7d32]" strokeWidth={1.5} />
                                <span className="text-base">Grammar</span>
                            </Link>
                        )}

                        {availableSubjects['vocabulary'] && (
                            <Link
                                href="/dashboard/activities?category=vocabulary"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => setIsPanelOpen(false)}
                            >
                                <BookOpen className="w-5 h-5 text-[#1565c0]" strokeWidth={1.5} />
                                <span className="text-base">Vocabulary</span>
                            </Link>
                        )}

                        {availableSubjects['games'] && (
                            <Link
                                href="/dashboard/activities?category=games"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => setIsPanelOpen(false)}
                            >
                                <Gamepad2 className="w-5 h-5 text-[#4527a0]" strokeWidth={1.5} />
                                <span className="text-base">Games</span>
                            </Link>
                        )}

                        {availableSubjects['quizzes'] && (
                            <Link
                                href="/dashboard/activities?category=quizzes"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => setIsPanelOpen(false)}
                            >
                                <ClipboardList className="w-5 h-5 text-[#c62828]" strokeWidth={1.5} />
                                <span className="text-base">Quizzes</span>
                            </Link>
                        )}

                        {availableSubjects['speaking'] && (
                            <Link
                                href="/dashboard/activities?category=speaking"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => setIsPanelOpen(false)}
                            >
                                <Mic className="w-5 h-5 text-[#e65100]" strokeWidth={1.5} />
                                <span className="text-base">Speaking</span>
                            </Link>
                        )}

                        {availableSubjects['pronunciation'] && (
                            <Link
                                href="/dashboard/activities?category=pronunciation"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => setIsPanelOpen(false)}
                            >
                                <Volume2 className="w-5 h-5 text-[#be185d]" strokeWidth={1.5} />
                                <span className="text-base">Pronunciation</span>
                            </Link>
                        )}

                        {availableSubjects['writing'] && (
                            <Link
                                href="/dashboard/activities?category=writing"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => setIsPanelOpen(false)}
                            >
                                <PenTool className="w-5 h-5 text-[#5d4037]" strokeWidth={1.5} />
                                <span className="text-base">Writing</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
