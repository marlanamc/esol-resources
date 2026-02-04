"use client";

import { useState } from "react";
import AvatarSelector from "./AvatarSelector";

export default function AvatarSection() {
    const [currentAvatar, setCurrentAvatar] = useState("cat");

    const handleAvatarChange = (avatarId: string) => {
        setCurrentAvatar(avatarId);
        // TODO: Save avatar to user profile
        console.log("Avatar changed to:", avatarId);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <AvatarSelector 
                currentAvatar={currentAvatar} 
                onAvatarChange={handleAvatarChange}
            />
        </div>
    );
}
