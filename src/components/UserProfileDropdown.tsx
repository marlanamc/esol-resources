"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserIcon } from "@/components/icons/Icons";

interface UserProfileDropdownProps {
    userName: string;
}

export default function UserProfileDropdown({ userName }: UserProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        router.push("/dashboard/profile");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-white border-2 border-text/80 hover:border-text hover:bg-gray-50 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-text/30 focus:ring-offset-2 shadow-md"
                aria-label="User menu"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <UserIcon className="w-6 h-6 text-text" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border/30 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-border/30">
                        <p className="text-sm font-medium text-text truncate">{userName}</p>
                    </div>
                    <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text hover:bg-bg-light transition-colors flex items-center gap-2"
                    >
                        <UserIcon className="w-4 h-4" />
                        View Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text hover:bg-bg-light transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
