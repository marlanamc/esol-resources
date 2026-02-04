"use client";

import { useRouter } from "next/navigation";
import SelectedAvatarDisplay from "./SelectedAvatarDisplay";

interface ClickableAvatarDisplayProps {
    avatarId?: string;
    colorId?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function ClickableAvatarDisplay({ 
    avatarId, 
    colorId, 
    size = "md",
    className = "" 
}: ClickableAvatarDisplayProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push("/dashboard/avatar");
    };

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
