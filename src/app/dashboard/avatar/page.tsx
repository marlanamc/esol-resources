"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/ui";
import AvatarSelector from "@/components/ui/AvatarSelector";
import SelectedAvatarDisplay from "@/components/ui/SelectedAvatarDisplay";
import { HomeIcon, BookOpenIcon, TrophyIcon, UserIcon } from "@/components/icons/Icons";
import { DEFAULT_AVATAR, DEFAULT_COLOR } from "@/lib/avatar-constants";

export default function AvatarPage() {
    const router = useRouter();
    const [currentAvatar, setCurrentAvatar] = useState(DEFAULT_AVATAR);
    const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Refs for debouncing
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingSaveRef = useRef<{ avatar: string; avatarColor: string } | null>(null);

    // Load saved selections on mount from database
    useEffect(() => {
        async function loadAvatar() {
            try {
                const res = await fetch("/api/user/avatar");
                if (res.ok) {
                    const data = await res.json();
                    setCurrentAvatar(data.avatar || DEFAULT_AVATAR);
                    setCurrentColor(data.avatarColor || DEFAULT_COLOR);
                }
            } catch (error) {
                console.error("Failed to load avatar:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadAvatar();
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Debounced save function
    const debouncedSave = useCallback((avatar: string, avatarColor: string) => {
        // Store the pending save data
        pendingSaveRef.current = { avatar, avatarColor };

        // Clear any existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set saving indicator
        setIsSaving(true);

        // Debounce the actual API call by 500ms
        saveTimeoutRef.current = setTimeout(async () => {
            const saveData = pendingSaveRef.current;
            if (!saveData) return;

            try {
                await fetch("/api/user/avatar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(saveData),
                });
            } catch (error) {
                console.error("Failed to save avatar:", error);
            } finally {
                setIsSaving(false);
                pendingSaveRef.current = null;
            }
        }, 500);
    }, []);

    const handleAvatarChange = (avatarId: string) => {
        setCurrentAvatar(avatarId);
        debouncedSave(avatarId, currentColor);
    };

    const handleColorChange = (colorId: string) => {
        setCurrentColor(colorId);
        debouncedSave(currentAvatar, colorId);
    };

    return (
        <div className="min-h-screen bg-bg-light">
            {/* Header */}
            <div className="bg-white border-b border-border/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
                        >
                            ← Back
                        </button>
                        <h1 className="text-xl font-semibold text-text">Customize Your Avatar</h1>
                        <div className="w-16"></div> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-text-muted">Loading your avatar...</p>
                    </div>
                ) : (
                    <>
                        {/* Current Avatar Display */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-text mb-4">Your Current Avatar</h2>
                            <div className="inline-block relative">
                                <SelectedAvatarDisplay
                                    avatarId={currentAvatar}
                                    colorId={currentColor}
                                    size="lg"
                                />
                                {isSaving && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                                )}
                            </div>
                            <p className="text-text-muted mt-4">
                                This avatar represents you throughout the classroom
                            </p>
                        </div>

                        {/* Avatar Selector */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AvatarSelector
                                currentAvatar={currentAvatar}
                                currentColor={currentColor}
                                onAvatarChange={handleAvatarChange}
                                onColorChange={handleColorChange}
                            />
                        </div>

                        {/* Save Button */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => router.push("/dashboard/profile")}
                                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md"
                            >
                                Save Avatar
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/30 md:hidden">
                <BottomNav
                    items={[
                        { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                        { href: "/dashboard/activities", label: "Activities", icon: <BookOpenIcon /> },
                        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
                        { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                    ]}
                />
            </div>
        </div>
    );
}
