"use client";

import { useState } from "react";

interface AvatarSelectorProps {
    currentAvatar?: string;
    currentColor?: string;
    onAvatarChange?: (avatar: string) => void;
    onColorChange?: (color: string) => void;
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

const COLORS = [
    { id: "blue", name: "Blue", class: "bg-blue-500" },
    { id: "green", name: "Green", class: "bg-green-500" },
    { id: "purple", name: "Purple", class: "bg-purple-500" },
    { id: "pink", name: "Pink", class: "bg-pink-500" },
    { id: "yellow", name: "Yellow", class: "bg-yellow-500" },
    { id: "red", name: "Red", class: "bg-red-500" },
    { id: "orange", name: "Orange", class: "bg-orange-500" },
    { id: "teal", name: "Teal", class: "bg-teal-500" },
];

export default function AvatarSelector({ 
    currentAvatar = "cat", 
    currentColor = "blue",
    onAvatarChange, 
    onColorChange,
    className = "" 
}: AvatarSelectorProps) {
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
    const [selectedColor, setSelectedColor] = useState(currentColor);

    const handleAvatarSelect = (avatarId: string) => {
        setSelectedAvatar(avatarId);
        onAvatarChange?.(avatarId);
    };

    const handleColorSelect = (colorId: string) => {
        setSelectedColor(colorId);
        onColorChange?.(colorId);
    };

    const getCurrentColorClass = () => {
        return COLORS.find(c => c.id === selectedColor)?.class || "bg-blue-500";
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
                    <div className={`w-20 h-20 ${getCurrentColorClass()} rounded-full flex items-center justify-center shadow-lg mb-2`}>
                        <span className="text-4xl">
                            {AVATARS.find(a => a.id === selectedAvatar)?.emoji}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                        {AVATARS.find(a => a.id === selectedAvatar)?.name}
                    </p>
                </div>
            </div>

            {/* Color Selection */}
            <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Choose Your Color</h4>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {COLORS.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => handleColorSelect(color.id)}
                            className={`
                                relative p-3 rounded-full border-2 transition-all
                                hover:scale-110 hover:shadow-md
                                ${selectedColor === color.id 
                                    ? "border-gray-800 shadow-lg" 
                                    : "border-gray-200 hover:border-gray-300"
                                }
                            `}
                            title={color.name}
                        >
                            <div className={`w-6 h-6 ${color.class} rounded-full`}></div>
                            {selectedColor === color.id && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
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
