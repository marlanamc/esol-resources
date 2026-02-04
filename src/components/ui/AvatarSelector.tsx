"use client";

import { useState, useEffect } from "react";
import {
    AVATARS,
    COLORS,
    getAvatarsByCategory,
    getAvatarCategoryCount,
    getColorClass,
    DEFAULT_AVATAR,
    DEFAULT_COLOR,
    type AvatarCategory,
} from "@/lib/avatar-constants";

interface AvatarSelectorProps {
    currentAvatar?: string;
    currentColor?: string;
    onAvatarChange?: (avatar: string) => void;
    onColorChange?: (color: string) => void;
    className?: string;
}

type SelectionMode = "avatar" | "color";

export default function AvatarSelector({
    currentAvatar = DEFAULT_AVATAR,
    currentColor = DEFAULT_COLOR,
    onAvatarChange,
    onColorChange,
    className = ""
}: AvatarSelectorProps) {
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
    const [selectedColor, setSelectedColor] = useState(currentColor);
    const [selectionMode, setSelectionMode] = useState<SelectionMode>("avatar");
    const [selectedCategory, setSelectedCategory] = useState<AvatarCategory>("animals");

    const handleAvatarSelect = (avatarId: string) => {
        setSelectedAvatar(avatarId);
        onAvatarChange?.(avatarId);
    };

    const handleColorSelect = (colorId: string) => {
        setSelectedColor(colorId);
        onColorChange?.(colorId);
    };

    const getCurrentColorClass = () => {
        return getColorClass(selectedColor);
    };

    const getFilteredAvatars = () => {
        return getAvatarsByCategory(selectedCategory);
    };

    const getCategoryCount = (category: AvatarCategory) => {
        return getAvatarCategoryCount(category);
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
                <div className="inline-flex rounded-full bg-gray-200 p-1 relative">
                    {/* Sliding Background */}
                    <div 
                        className={`
                            absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] 
                            bg-white rounded-full shadow-md transition-all duration-300 ease-in-out
                            ${selectionMode === "color" ? "translate-x-full" : "translate-x-0"}
                        `}
                    />
                    
                    {/* Toggle Buttons */}
                    <button
                        onClick={() => setSelectionMode("avatar")}
                        className={`
                            relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                            ${selectionMode === "avatar"
                                ? "text-primary font-semibold" 
                                : "text-gray-600 hover:text-gray-900"
                            }
                        `}
                    >
                        Emoji
                    </button>
                    <button
                        onClick={() => setSelectionMode("color")}
                        className={`
                            relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                            ${selectionMode === "color"
                                ? "text-primary font-semibold" 
                                : "text-gray-600 hover:text-gray-900"
                            }
                        `}
                    >
                        Color
                    </button>
                </div>
            </div>

            {/* Conditional Selection */}
            {selectionMode === "avatar" ? (
                <div>
                    {/* Category Tabs */}
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {[
                                { id: "animals", name: "Animals", emoji: "🐾" },
                                { id: "nature", name: "Nature", emoji: "🌿" },
                                { id: "fantasy", name: "Fantasy", emoji: "🧙" },
                                { id: "sea", name: "Sea", emoji: "🌊" },
                                { id: "insects", name: "Bugs", emoji: "🐞" },
                                { id: "food", name: "Food & Fun", emoji: "🍕" },
                                { id: "sports", name: "Sports", emoji: "⚽" },
                                { id: "symbols", name: "Symbols", emoji: "💫" },
                            ].map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id as AvatarCategory)}
                                    className={`
                                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                                        flex items-center gap-1
                                        ${selectedCategory === category.id
                                            ? "bg-primary text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }
                                    `}
                                >
                                    <span>{category.emoji}</span>
                                    <span>{category.name}</span>
                                    <span className="text-xs opacity-75">
                                        ({getCategoryCount(category.id as AvatarCategory)})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Avatar Grid */}
                    <div className="grid grid-cols-5 gap-3">
                        {getFilteredAvatars().map((avatar) => (
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
                    <div className="flex justify-center">
                        <div className="grid grid-cols-5 gap-3 max-w-md">
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
                </div>
            )}
        </div>
    );
}

// Simple avatar display component (emoji only, no background)
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
