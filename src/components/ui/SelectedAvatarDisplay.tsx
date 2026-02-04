"use client";

import { getAvatarEmoji, getColorClass } from "@/lib/avatar-constants";

interface SelectedAvatarDisplayProps {
    avatarId?: string | null;
    colorId?: string | null;
    size?: "sm" | "md" | "lg";
    className?: string;
}

/**
 * A simple presentational component for displaying an avatar.
 * Props take precedence - pass avatarId and colorId directly.
 */
export default function SelectedAvatarDisplay({
    avatarId,
    colorId,
    size = "md",
    className = ""
}: SelectedAvatarDisplayProps) {
    const getSizeClasses = () => {
        switch (size) {
            case "sm":
                return "w-8 h-8 text-lg";
            case "lg":
                return "w-16 h-16 text-3xl";
            default:
                return "w-12 h-12 text-2xl";
        }
    };

    const emoji = getAvatarEmoji(avatarId);
    const colorClass = getColorClass(colorId);

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`
                ${getSizeClasses()}
                ${colorClass}
                rounded-full
                flex
                items-center
                justify-center
                shadow-md
                transition-all
                duration-300
                hover:shadow-lg
                hover:scale-105
            `}>
                <span className="select-none">
                    {emoji}
                </span>
            </div>
        </div>
    );
}
