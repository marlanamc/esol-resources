"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/ui";
import AvatarSelector from "@/components/ui/AvatarSelector";
import SelectedAvatarDisplay from "@/components/ui/SelectedAvatarDisplay";
import { HomeIcon, BookOpenIcon, TrophyIcon, UserIcon } from "@/components/icons/Icons";

export default function AvatarPage() {
    const router = useRouter();
    const [currentAvatar, setCurrentAvatar] = useState("cat");
    const [currentColor, setCurrentColor] = useState("blue");

    // Load saved selections on mount
    useEffect(() => {
        const savedAvatar = localStorage.getItem("selectedAvatar");
        const savedColor = localStorage.getItem("selectedColor");
        
        if (savedAvatar) setCurrentAvatar(savedAvatar);
        if (savedColor) setCurrentColor(savedColor);
    }, []);

    const handleAvatarChange = (avatarId: string) => {
        setCurrentAvatar(avatarId);
        localStorage.setItem("selectedAvatar", avatarId);
        // TODO: Save avatar to user profile
        console.log("Avatar changed to:", avatarId);
    };

    const handleColorChange = (colorId: string) => {
        setCurrentColor(colorId);
        localStorage.setItem("selectedColor", colorId);
        // TODO: Save color to user profile
        console.log("Color changed to:", colorId);
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
                {/* Current Avatar Display */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-text mb-4">Your Current Avatar</h2>
                    <div className="inline-block">
                        <SelectedAvatarDisplay size="lg" />
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
                        Done! Back to Profile
                    </button>
                </div>
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
