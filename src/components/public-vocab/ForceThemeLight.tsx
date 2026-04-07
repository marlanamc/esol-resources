"use client";

import { useEffect } from "react";

/**
 * Forces light mode on public-facing pages that don't have a theme toggle.
 * Removes the `dark` class and sets `data-theme="light"` on mount,
 * then restores the previous theme on unmount (e.g. if the user navigates
 * to an authenticated page that supports dark mode).
 */
export function ForceThemeLight() {
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    const previousTheme = html.getAttribute("data-theme");

    // Force light
    html.classList.remove("dark");
    html.setAttribute("data-theme", "light");

    return () => {
      // Restore on unmount
      if (wasDark) {
        html.classList.add("dark");
      }
      if (previousTheme) {
        html.setAttribute("data-theme", previousTheme);
      }
    };
  }, []);

  return null;
}
