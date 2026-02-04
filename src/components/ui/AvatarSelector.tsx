"use client";

import { useState, useEffect } from "react";

interface AvatarSelectorProps {
    currentAvatar?: string;
    currentColor?: string;
    onAvatarChange?: (avatar: string) => void;
    onColorChange?: (color: string) => void;
    className?: string;
}

type SelectionMode = "avatar" | "color";

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
    { id: "red", name: "Red", class: "bg-red-500" },
    { id: "orange", name: "Orange", class: "bg-orange-500" },
    { id: "amber", name: "Amber", class: "bg-amber-500" },
    { id: "yellow", name: "Yellow", class: "bg-yellow-500" },
    { id: "lime", name: "Lime", class: "bg-lime-500" },
    { id: "green", name: "Green", class: "bg-green-500" },
    { id: "emerald", name: "Emerald", class: "bg-emerald-500" },
    { id: "teal", name: "Teal", class: "bg-teal-500" },
    { id: "cyan", name: "Cyan", class: "bg-cyan-500" },
    { id: "sky", name: "Sky", class: "bg-sky-500" },
    { id: "blue", name: "Blue", class: "bg-blue-500" },
    { id: "indigo", name: "Indigo", class: "bg-indigo-500" },
    { id: "violet", name: "Violet", class: "bg-violet-500" },
    { id: "purple", name: "Purple", class: "bg-purple-500" },
    { id: "fuchsia", name: "Fuchsia", class: "bg-fuchsia-500" },
    { id: "pink", name: "Pink", class: "bg-pink-500" },
    { id: "rose", name: "Rose", class: "bg-rose-500" },
    { id: "slate", name: "Slate", class: "bg-slate-500" },
    { id: "zinc", name: "Zinc", class: "bg-zinc-500" },
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
    const [selectionMode, setSelectionMode] = useState<SelectionMode>("avatar");
    const [isHighlighted, setIsHighlighted] = useState(true);

    // Remove highlight after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsHighlighted(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

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

            {/* Mode Toggle */}
            <div className="flex items-center justify-center">
                <div className={`
                    inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1
                    transition-all duration-500
                    ${isHighlighted 
                        ? 'ring-4 ring-blue-200 ring-opacity-50 animate-pulse shadow-lg' 
                        : ''
                    }
                `}>
                    <button
                        onClick={() => setSelectionMode("avatar")}
                        className={`
                            px-4 py-2 rounded-md text-sm font-medium transition-all
                            ${selectionMode === "avatar"
                                ? "bg-white text-gray-900 shadow-sm ring-2 ring-offset-2 ring-offset-transparent"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }
                        `}
                        style={{
                            ...(selectionMode === "avatar" && {
                                background: `linear-gradient(135deg, white 0%, white 60%, ${getCurrentColorClass()} 100%)`,
                                backgroundClip: "padding-box",
                            })
                        }}
                    >
                        Emoji
                    </button>
                    <button
                        onClick={() => setSelectionMode("color")}
                        className={`
                            px-4 py-2 rounded-md text-sm font-medium transition-all
                            ${selectionMode === "color"
                                ? "bg-white text-gray-900 shadow-sm ring-2 ring-offset-2 ring-offset-transparent"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }
                        `}
                        style={{
                            ...(selectionMode === "color" && {
                                background: getCurrentColorClass(),
                            })
                        }}
                    >
                        Color
                    </button>
                </div>
            </div>

            {/* Conditional Selection */}
            {selectionMode === "avatar" ? (
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Choose Your Avatar</h4>
                    <div className="grid grid-cols-5 gap-3">
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
            ) : (
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Choose Your Color</h4>
                    <div className="grid grid-cols-5 gap-3">
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
            )}
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
