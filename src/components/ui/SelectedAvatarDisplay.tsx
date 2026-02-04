"use client";

import { useState, useEffect } from "react";

interface SelectedAvatarDisplayProps {
    avatarId?: string;
    colorId?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const AVATARS = [
    // Animals
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
    
    // Nature & Plants
    { id: "butterfly", emoji: "🦋", name: "Butterfly" },
    { id: "flower", emoji: "🌸", name: "Flower" },
    { id: "tree", emoji: "🌳", name: "Tree" },
    { id: "leaf", emoji: "🍃", name: "Leaf" },
    { id: "sun", emoji: "☀️", name: "Sun" },
    { id: "moon", emoji: "🌙", name: "Moon" },
    { id: "star", emoji: "⭐", name: "Star" },
    { id: "rainbow", emoji: "🌈", name: "Rainbow" },
    
    // Fantasy & Magical
    { id: "unicorn", emoji: "🦄", name: "Unicorn" },
    { id: "dragon", emoji: "🐲", name: "Dragon" },
    { id: "wizard", emoji: "🧙", name: "Wizard" },
    { id: "fairy", emoji: "🧚", name: "Fairy" },
    { id: "ghost", emoji: "👻", name: "Ghost" },
    { id: "alien", emoji: "👽", name: "Alien" },
    { id: "robot", emoji: "🤖", name: "Robot" },
    
    // Sea Creatures
    { id: "octopus", emoji: "🐙", name: "Octopus" },
    { id: "turtle", emoji: "🐢", name: "Turtle" },
    { id: "crab", emoji: "🦀", name: "Crab" },
    { id: "fish", emoji: "🐠", name: "Fish" },
    { id: "shark", emoji: "🦈", name: "Shark" },
    { id: "whale", emoji: "🐋", name: "Whale" },
    { id: "dolphin", emoji: "🐬", name: "Dolphin" },
    
    // Insects & Bugs
    { id: "snail", emoji: "🐌", name: "Snail" },
    { id: "bee", emoji: "🐝", name: "Bee" },
    { id: "ladybug", emoji: "🐞", name: "Ladybug" },
    { id: "beetle", emoji: "🪲", name: "Beetle" },
    
    // Food & Objects
    { id: "pizza", emoji: "🍕", name: "Pizza" },
    { id: "hamburger", emoji: "🍔", name: "Hamburger" },
    { id: "icecream", emoji: "🍦", name: "Ice Cream" },
    { id: "cookie", emoji: "🍪", name: "Cookie" },
    { id: "cake", emoji: "🎂", name: "Cake" },
    { id: "coffee", emoji: "☕", name: "Coffee" },
    { id: "book", emoji: "📚", name: "Book" },
    { id: "pencil", emoji: "✏️", name: "Pencil" },
    { id: "paintbrush", emoji: "🎨", name: "Paint Brush" },
    { id: "music", emoji: "🎵", name: "Music" },
    { id: "guitar", emoji: "🎸", name: "Guitar" },
    { id: "microphone", emoji: "📱", name: "Phone" },
    { id: "camera", emoji: "📷", name: "Camera" },
    { id: "gamepad", emoji: "🎮", name: "Gamepad" },
    { id: "rocket", emoji: "🚀", name: "Rocket" },
    { id: "airplane", emoji: "✈️", name: "Airplane" },
    { id: "car", emoji: "🚗", name: "Car" },
    
    // Sports & Activities
    { id: "soccer", emoji: "⚽", name: "Soccer" },
    { id: "basketball", emoji: "🏀", name: "Basketball" },
    { id: "tennis", emoji: "🎾", name: "Tennis" },
    { id: "baseball", emoji: "⚾", name: "Baseball" },
    { id: "football", emoji: "🏈", name: "Football" },
    { id: "bicycle", emoji: "🚴", name: "Bicycle" },
    { id: "skateboard", emoji: "🛹", name: "Skateboard" },
    { id: "surfboard", emoji: "🏄", name: "Surfboard" },
    
    // Symbols & Emotions
    { id: "heart", emoji: "❤️", name: "Heart" },
    { id: "thumbsup", emoji: "👍", name: "Thumbs Up" },
    { id: "fire", emoji: "🔥", name: "Fire" },
    { id: "lightning", emoji: "⚡", name: "Lightning" },
    { id: "sparkles", emoji: "✨", name: "Sparkles" },
    { id: "diamond", emoji: "💎", name: "Diamond" },
    { id: "crown", emoji: "👑", name: "Crown" },
    { id: "trophy", emoji: "🏆", name: "Trophy" },
    { id: "medal", emoji: "🏅", name: "Medal" },
    { id: "flag", emoji: "🚩", name: "Flag" },
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

export default function SelectedAvatarDisplay({ 
    avatarId = "cat", 
    colorId = "blue", 
    size = "md",
    className = "" 
}: SelectedAvatarDisplayProps) {
    const [currentAvatar, setCurrentAvatar] = useState(avatarId);
    const [currentColor, setCurrentColor] = useState(colorId);

    // Listen for avatar changes from localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const savedAvatar = localStorage.getItem("selectedAvatar");
            const savedColor = localStorage.getItem("selectedColor");
            
            if (savedAvatar) setCurrentAvatar(savedAvatar);
            if (savedColor) setCurrentColor(savedColor);
        };

        // Initial load
        handleStorageChange();

        // Listen for storage changes
        window.addEventListener("storage", handleStorageChange);
        
        // Also check localStorage periodically for same-tab updates
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []);

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

    const getCurrentColorClass = () => {
        return COLORS.find(c => c.id === currentColor)?.class || "bg-blue-500";
    };

    const getCurrentAvatarEmoji = () => {
        return AVATARS.find(a => a.id === currentAvatar)?.emoji || "🐱";
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`
                ${getSizeClasses()} 
                ${getCurrentColorClass()} 
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
                    {getCurrentAvatarEmoji()}
                </span>
            </div>
        </div>
    );
}
