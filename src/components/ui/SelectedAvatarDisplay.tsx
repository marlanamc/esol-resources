"use client";

import { useState, useEffect } from "react";

interface SelectedAvatarDisplayProps {
    avatarId?: string;
    colorId?: string;
    size?: "sm" | "md" | "lg";
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
