"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

type Theme = "light" | "dark";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "class-companion-theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Read the resolved theme from DOM (what the inline script already set)
function getInitialResolvedTheme(): ResolvedTheme {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// Read stored theme preference
function getStoredTheme(): Theme {
    if (typeof window === "undefined") return "light";
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
        if (stored !== null) return "light"; // Retire old "system" preferences.
    } catch {
        // localStorage may be unavailable in private browsing
    }
    const cookieTheme = document.cookie.match(/(?:^|; )class-companion-theme=([^;]+)/)?.[1];
    if (cookieTheme === "dark") return "dark";
    return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize theme preference from storage
    // Initialize resolvedTheme from DOM (what inline script set) to avoid mismatch
    const [theme, setThemeState] = useState<Theme>(getStoredTheme);
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getInitialResolvedTheme);

    // Apply theme to DOM - only called when user changes theme, not on mount
    const applyTheme = useCallback((newResolved: ResolvedTheme) => {
        const root = document.documentElement;

        if (newResolved === "dark") {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
        }

        setResolvedTheme(newResolved);
    }, []);

    // Set theme and persist to storage
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);

        // Persist to storage
        try {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch {
            // localStorage may be unavailable
        }
        document.cookie = `${THEME_STORAGE_KEY}=${encodeURIComponent(newTheme)}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;

        // Apply to DOM
        applyTheme(newTheme);
    }, [applyTheme]);

    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    }, [resolvedTheme, setTheme]);

    const value = useMemo(() => ({
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme
    }), [theme, resolvedTheme, setTheme, toggleTheme]);

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
