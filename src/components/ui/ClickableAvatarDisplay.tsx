"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SelectedAvatarDisplay } from "./SelectedAvatarDisplay";
import {
    fetchAndCacheAvatar,
    getFreshMemoryAvatar,
    readCachedAvatar,
} from "@/lib/avatar-cache";

interface ClickableAvatarDisplayProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

/**
 * A clickable avatar that fetches the current user's avatar from the API
 * and navigates to the avatar customization page when clicked.
 */
export function ClickableAvatarDisplay({
    size = "md",
    className = "",
}: ClickableAvatarDisplayProps) {
    const router = useRouter();
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [colorId, setColorId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const cached = getFreshMemoryAvatar() ?? readCachedAvatar();
        if (cached) {
            setAvatarId(cached.avatar);
            setColorId(cached.avatarColor);
        }

        (async () => {
            const avatar = await fetchAndCacheAvatar();
            if (!avatar || cancelled) return;
            setAvatarId(avatar.avatar);
            setColorId(avatar.avatarColor);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleClick = () => {
        router.push("/dashboard/avatar");
    };

    if (!avatarId || !colorId) {
        return (
            <div
                className={`cursor-pointer hover:scale-105 transition-transform ${className}`}
                title="Change your avatar"
            >
                <div
                    className={`
                    ${size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : size === "xl" ? "w-24 h-24" : "w-12 h-12"}
                    rounded-full bg-bg-gray animate-pulse
                `}
                />
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className={`cursor-pointer hover:scale-105 transition-transform ${className}`}
            title="Change your avatar"
        >
            <SelectedAvatarDisplay
                avatarId={avatarId}
                colorId={colorId}
                size={size}
                className="pointer-events-none"
            />
        </div>
    );
}
