"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "class-companion-theme";
const THEME_COOKIE_KEY = "class-companion-theme";

function getPreferredTheme(): "light" | "dark" {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }

    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE_KEY}=([^;]+)`));
    const cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    if (cookieTheme === "light" || cookieTheme === "dark") {
        return cookieTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
}

export default function AuthLightMode({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        applyTheme("light");

        return () => {
            applyTheme(getPreferredTheme());
        };
    }, []);

    return children;
}
