"use client";

import { useState } from "react";

interface AvatarSelectorProps {
    currentAvatar?: string;
    onAvatarChange?: (avatar: string) => void;
    className?: string;
}

const AVATARS = [
    { id: "cat", emoji: "🐱", name: "Cat" },
    { id: "dog", emoji: "🐶", name: "Dog" },
    { id: "rabbit", emoji: "🐰", name: "Rabbit" },
    { id: "bear", emoji: "🐻", name: "Bear" },
    { id: "panda", emoji: "🐼", name: "Panda" },
    { id: "fox", emoji: "🦊", name: "Fox" },
    { id: "lion", emoji: "🦁", name: "Lion" },
    { id: "tiger", emoji: "🐯", name: "Tiger" },
    { id: "elephant", emoji: "🐘", name: "Elephant" },
    { id: "monkey", emoji: "🐵", name: "Monkey" },
    { id: "owl", emoji: "🦉", name: "Owl" },
    { id: "parrot", emoji: "🦜", name: "Parrot" },
    { id: "butterfly", emoji: "🦋", name: "Butterfly" },
    { id: "unicorn", emoji: "🦄", name: "Unicorn" },
    { id: "dragon", emoji: "🐲", name: "Dragon" },
    { id: "octopus", emoji: "🐙", name: "Octopus" },
    { id: "turtle", emoji: "🐢", name: "Turtle" },
    { id: "crab", emoji: "🦀", name: "Crab" },
    { id: "snail", emoji: "🐌", name: "Snail" },
    { id: "bee", emoji: "🐝", name: "Bee" },
];

export default function AvatarSelector({ 
    currentAvatar = "cat", 
    onAvatarChange, 
    className = "" 
}: AvatarSelectorProps) {
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

    const handleAvatarSelect = (avatarId: string) => {
        setSelectedAvatar(avatarId);
        onAvatarChange?.(avatarId);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Avatar</h3>
                <p className="text-sm text-gray-600">Pick an avatar to represent you in the classroom!</p>
            </div>
            
            {/* Current Avatar Preview */}
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
                <div className="text-center">
                    <div className="text-6xl mb-2">
                        {AVATARS.find(a => a.id === selectedAvatar)?.emoji}
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                        {AVATARS.find(a => a.id === selectedAvatar)?.name}
                    </p>
                </div>
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {AVATARS.map((avatar) => (
                    <button
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar.id)}
                        className={`
                            relative p-3 rounded-lg border-2 transition-all
                            hover:scale-110 hover:shadow-md
                            ${selectedAvatar === avatar.id 
                                ? "border-primary bg-primary/10" 
                                : "border-gray-200 hover:border-gray-300"
                            }
                        `}
                        title={avatar.name}
                    >
                        <span className="text-2xl">{avatar.emoji}</span>
                        {selectedAvatar === avatar.id && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Simple avatar display component
export function AvatarDisplay({ 
    avatarId, 
    size = "md", 
    className = "" 
}: { 
    avatarId: string; 
    size?: "sm" | "md" | "lg"; 
    className?: string;
}) {
    const avatar = AVATARS.find(a => a.id === avatarId);
    const sizeClasses = {
        sm: "text-2xl",
        md: "text-4xl", 
        lg: "text-6xl"
    };

    return (
        <div className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
            {avatar?.emoji || "👤"}
        </div>
    );
}
