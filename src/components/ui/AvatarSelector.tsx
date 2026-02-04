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
type AvatarCategory = "animals" | "nature" | "fantasy" | "sea" | "insects" | "food" | "sports" | "symbols";

const AVATARS = [
    // Animals
    { id: "cat", emoji: "🐱", name: "Cat", category: "animals" },
    { id: "dog", emoji: "🐶", name: "Dog", category: "animals" },
    { id: "rabbit", emoji: "🐰", name: "Rabbit", category: "animals" },
    { id: "bear", emoji: "🐻", name: "Bear", category: "animals" },
    { id: "panda", emoji: "🐼", name: "Panda", category: "animals" },
    { id: "fox", emoji: "🦊", name: "Fox", category: "animals" },
    { id: "lion", emoji: "🦁", name: "Lion", category: "animals" },
    { id: "tiger", emoji: "🐯", name: "Tiger", category: "animals" },
    { id: "elephant", emoji: "🐘", name: "Elephant", category: "animals" },
    { id: "monkey", emoji: "🐵", name: "Monkey", category: "animals" },
    { id: "owl", emoji: "🦉", name: "Owl", category: "animals" },
    { id: "parrot", emoji: "🦜", name: "Parrot", category: "animals" },
    
    // Nature & Plants
    { id: "butterfly", emoji: "🦋", name: "Butterfly", category: "nature" },
    { id: "flower", emoji: "🌸", name: "Flower", category: "nature" },
    { id: "tree", emoji: "🌳", name: "Tree", category: "nature" },
    { id: "leaf", emoji: "🍃", name: "Leaf", category: "nature" },
    { id: "sun", emoji: "☀️", name: "Sun", category: "nature" },
    { id: "moon", emoji: "🌙", name: "Moon", category: "nature" },
    { id: "star", emoji: "⭐", name: "Star", category: "nature" },
    { id: "rainbow", emoji: "🌈", name: "Rainbow", category: "nature" },
    
    // Fantasy & Magical
    { id: "unicorn", emoji: "🦄", name: "Unicorn", category: "fantasy" },
    { id: "dragon", emoji: "🐲", name: "Dragon", category: "fantasy" },
    { id: "wizard", emoji: "🧙", name: "Wizard", category: "fantasy" },
    { id: "fairy", emoji: "🧚", name: "Fairy", category: "fantasy" },
    { id: "ghost", emoji: "👻", name: "Ghost", category: "fantasy" },
    { id: "alien", emoji: "👽", name: "Alien", category: "fantasy" },
    { id: "robot", emoji: "🤖", name: "Robot", category: "fantasy" },
    
    // Sea Creatures
    { id: "octopus", emoji: "🐙", name: "Octopus", category: "sea" },
    { id: "turtle", emoji: "🐢", name: "Turtle", category: "sea" },
    { id: "crab", emoji: "🦀", name: "Crab", category: "sea" },
    { id: "fish", emoji: "🐠", name: "Fish", category: "sea" },
    { id: "shark", emoji: "🦈", name: "Shark", category: "sea" },
    { id: "whale", emoji: "🐋", name: "Whale", category: "sea" },
    { id: "dolphin", emoji: "🐬", name: "Dolphin", category: "sea" },
    { id: "lobster", emoji: "🦞", name: "Lobster", category: "sea" },
    
    // Insects & Bugs
    { id: "snail", emoji: "🐌", name: "Snail", category: "insects" },
    { id: "bee", emoji: "🐝", name: "Bee", category: "insects" },
    { id: "ladybug", emoji: "🐞", name: "Ladybug", category: "insects" },
    { id: "beetle", emoji: "🪲", name: "Beetle", category: "insects" },
    
    // Food & Objects
    { id: "pizza", emoji: "🍕", name: "Pizza", category: "food" },
    { id: "hamburger", emoji: "🍔", name: "Hamburger", category: "food" },
    { id: "icecream", emoji: "🍦", name: "Ice Cream", category: "food" },
    { id: "cookie", emoji: "🍪", name: "Cookie", category: "food" },
    { id: "cake", emoji: "🎂", name: "Cake", category: "food" },
    { id: "coffee", emoji: "☕", name: "Coffee", category: "food" },
    { id: "book", emoji: "📚", name: "Book", category: "food" },
    { id: "pencil", emoji: "✏️", name: "Pencil", category: "food" },
    { id: "paintbrush", emoji: "🎨", name: "Paint Brush", category: "food" },
    { id: "music", emoji: "🎵", name: "Music", category: "food" },
    { id: "guitar", emoji: "🎸", name: "Guitar", category: "food" },
    { id: "microphone", emoji: "📱", name: "Phone", category: "food" },
    { id: "camera", emoji: "📷", name: "Camera", category: "food" },
    { id: "gamepad", emoji: "🎮", name: "Gamepad", category: "food" },
    { id: "rocket", emoji: "🚀", name: "Rocket", category: "food" },
    { id: "airplane", emoji: "✈️", name: "Airplane", category: "food" },
    { id: "car", emoji: "🚗", name: "Car", category: "food" },
    
    // Sports & Activities
    { id: "soccer", emoji: "⚽", name: "Soccer", category: "sports" },
    { id: "basketball", emoji: "🏀", name: "Basketball", category: "sports" },
    { id: "tennis", emoji: "🎾", name: "Tennis", category: "sports" },
    { id: "baseball", emoji: "⚾", name: "Baseball", category: "sports" },
    { id: "football", emoji: "🏈", name: "Football", category: "sports" },
    { id: "bicycle", emoji: "🚴", name: "Bicycle", category: "sports" },
    { id: "skateboard", emoji: "🛹", name: "Skateboard", category: "sports" },
    { id: "surfboard", emoji: "🏄", name: "Surfboard", category: "sports" },
    
    // Symbols & Emotions
    { id: "heart", emoji: "❤️", name: "Heart", category: "symbols" },
    { id: "thumbsup", emoji: "👍", name: "Thumbs Up", category: "symbols" },
    { id: "fire", emoji: "🔥", name: "Fire", category: "symbols" },
    { id: "lightning", emoji: "⚡", name: "Lightning", category: "symbols" },
    { id: "sparkles", emoji: "✨", name: "Sparkles", category: "symbols" },
    { id: "diamond", emoji: "💎", name: "Diamond", category: "symbols" },
    { id: "crown", emoji: "👑", name: "Crown", category: "symbols" },
    { id: "trophy", emoji: "🏆", name: "Trophy", category: "symbols" },
    { id: "medal", emoji: "🏅", name: "Medal", category: "symbols" },
    { id: "flag", emoji: "🚩", name: "Flag", category: "symbols" },
];

const COLORS = [
    { id: "red", name: "Red", class: "bg-red-400" },
    { id: "orange", name: "Orange", class: "bg-orange-400" },
    { id: "amber", name: "Amber", class: "bg-amber-400" },
    { id: "yellow", name: "Yellow", class: "bg-yellow-300" },
    { id: "lime", name: "Lime", class: "bg-lime-400" },
    { id: "green", name: "Green", class: "bg-green-400" },
    { id: "emerald", name: "Emerald", class: "bg-emerald-400" },
    { id: "teal", name: "Teal", class: "bg-teal-400" },
    { id: "cyan", name: "Cyan", class: "bg-cyan-400" },
    { id: "sky", name: "Sky", class: "bg-sky-400" },
    { id: "blue", name: "Blue", class: "bg-blue-400" },
    { id: "indigo", name: "Indigo", class: "bg-indigo-400" },
    { id: "violet", name: "Violet", class: "bg-violet-400" },
    { id: "purple", name: "Purple", class: "bg-purple-400" },
    { id: "fuchsia", name: "Fuchsia", class: "bg-fuchsia-400" },
    { id: "pink", name: "Pink", class: "bg-pink-400" },
    { id: "rose", name: "Rose", class: "bg-rose-400" },
    { id: "slate", name: "Slate", class: "bg-slate-400" },
    { id: "zinc", name: "Zinc", class: "bg-zinc-400" },
    { id: "gray", name: "Gray", class: "bg-gray-400" },
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
    const [selectedCategory, setSelectedCategory] = useState<AvatarCategory>("animals");
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

    const getFilteredAvatars = () => {
        return AVATARS.filter(avatar => avatar.category === selectedCategory);
    };

    const getCategoryCount = (category: AvatarCategory) => {
        return AVATARS.filter(avatar => avatar.category === category).length;
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
