"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

type FontSize = "normal" | "large";

interface FontSizeContextValue {
    fontSize: FontSize;
    setFontSize: (fontSize: FontSize) => void;
    toggleFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextValue | undefined>(undefined);

const FONT_SIZE_STORAGE_KEY = "class-companion-font-size";
const FONT_SIZE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Read the resolved font size from DOM (what the inline script already set)
function getInitialFontSize(): FontSize {
    if (typeof document === "undefined") return "normal";
    return document.documentElement.getAttribute("data-font-size") === "large" ? "large" : "normal";
}

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSizeState] = useState<FontSize>(getInitialFontSize);

    const applyFontSize = useCallback((newSize: FontSize) => {
        const root = document.documentElement;

        if (newSize === "large") {
            root.setAttribute("data-font-size", "large");
        } else {
            root.removeAttribute("data-font-size");
        }
    }, []);

    const setFontSize = useCallback((newSize: FontSize) => {
        setFontSizeState(newSize);

        try {
            localStorage.setItem(FONT_SIZE_STORAGE_KEY, newSize);
        } catch {
            // localStorage may be unavailable in private browsing
        }
        document.cookie = `${FONT_SIZE_STORAGE_KEY}=${encodeURIComponent(newSize)}; path=/; max-age=${FONT_SIZE_COOKIE_MAX_AGE}; samesite=lax`;

        applyFontSize(newSize);
    }, [applyFontSize]);

    const toggleFontSize = useCallback(() => {
        setFontSize(fontSize === "normal" ? "large" : "normal");
    }, [fontSize, setFontSize]);

    const value = useMemo(() => ({
        fontSize,
        setFontSize,
        toggleFontSize,
    }), [fontSize, setFontSize, toggleFontSize]);

    return (
        <FontSizeContext.Provider value={value}>
            {children}
        </FontSizeContext.Provider>
    );
}

export function useFontSize() {
    const context = useContext(FontSizeContext);
    if (context === undefined) {
        throw new Error("useFontSize must be used within a FontSizeProvider");
    }
    return context;
}
