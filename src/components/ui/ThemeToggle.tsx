"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "system" | "light" | "dark";

interface ThemeOption {
    value: Theme;
    label: string;
    icon: React.ReactNode;
}

const themeOptions: ThemeOption[] = [
    { value: "system", label: "Auto", icon: <Monitor className="w-3.5 h-3.5" /> },
    { value: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
];

interface ThemeToggleProps {
    /** Compact mode shows only icons */
    compact?: boolean;
    className?: string;
}

export function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();

    if (compact) {
        // Compact inline version with label
        return (
            <div className={`flex items-center justify-between gap-3 ${className}`}>
                <span className="text-sm font-medium text-text">Change Theme</span>
                <div
                    className="flex items-center gap-0.5 p-0.5 rounded-lg border"
                    style={{ backgroundColor: 'var(--surface-subtle)', borderColor: 'var(--border-subtle)' }}
                >
                    {themeOptions.map((option) => {
                        const isActive = theme === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => setTheme(option.value)}
                                className={`
                                    flex items-center justify-center p-1.5 rounded-md
                                    transition-all duration-200
                                    ${isActive
                                        ? "text-text shadow-sm"
                                        : "text-text-muted hover:text-text"
                                    }
                                `}
                                style={isActive ? { backgroundColor: 'var(--surface-base)' } : undefined}
                                aria-pressed={isActive}
                                aria-label={`Set theme to ${option.label}`}
                                title={option.label}
                            >
                                {option.icon}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Full version with labels and description
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted">
                    Theme
                </span>
                <span className="text-xs text-text-muted">
                    {theme === "system" ? "Switch to Light" : theme === "light" ? "Switch to Dark" : "Switch to Auto"}
                </span>
            </div>
            <div
                className="flex items-center gap-1 p-1 rounded-xl border"
                style={{ backgroundColor: 'var(--surface-subtle)', borderColor: 'var(--border-subtle)' }}
            >
                {themeOptions.map((option) => {
                    const isActive = theme === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`
                                flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                                transition-all duration-200
                                ${isActive
                                    ? "text-text shadow-sm border"
                                    : "text-text-muted hover:text-text"
                                }
                            `}
                            style={isActive
                                ? { backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }
                                : undefined}
                            aria-pressed={isActive}
                            aria-label={`Set theme to ${option.label}`}
                        >
                            {option.icon}
                            <span>{option.label}</span>
                        </button>
                    );
                })}
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
                {theme === "system"
                    ? "Auto follows your system"
                    : theme === "light"
                        ? "Always use light theme"
                        : "Always use dark theme"
                }
            </p>
        </div>
    );
}
