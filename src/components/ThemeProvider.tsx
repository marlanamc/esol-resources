"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "class-companion-theme";
const THEME_COOKIE_KEY = "class-companion-theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    // Initialize theme from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE_KEY}=([^;]+)`));
        const cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1]) as Theme : null;
        const initialTheme = stored || cookieTheme || "system";
        setThemeState(initialTheme);
        setResolvedTheme(initialTheme === "system" ? getSystemTheme() : initialTheme);
        setMounted(true);
    }, []);

    // Resolve theme and apply to document
    useEffect(() => {
        if (!mounted) return;

        const resolved = theme === "system" ? getSystemTheme() : theme;
        setResolvedTheme(resolved);

        // Apply to document
        const root = document.documentElement;
        if (resolved === "dark") {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
        }
    }, [theme, mounted]);

    // Listen for system theme changes when using "system" preference
    useEffect(() => {
        if (!mounted || theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            setResolvedTheme(getSystemTheme());
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme, mounted]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        document.cookie = `${THEME_COOKIE_KEY}=${encodeURIComponent(newTheme)}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    }, [resolvedTheme, setTheme]);

    // Always provide context (useTheme requires it). Before mount, use safe defaults.
    const value = mounted
        ? { theme, resolvedTheme, setTheme, toggleTheme }
        : { theme: "system" as Theme, resolvedTheme: "light" as const, setTheme, toggleTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
