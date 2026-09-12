import type { MouseEvent } from "react";

/** True when the app is running as an installed PWA (home-screen / standalone). */
export function isStandaloneDisplayMode(): boolean {
    if (typeof window === "undefined") return false;
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    );
}

/**
 * Open a URL outside the current browsing context — important in PWAs so Google
 * Classroom, Forms, etc. open in the system browser (or native app) instead of
 * staying trapped in the standalone webview.
 */
export function openExternalLink(href: string): void {
    if (typeof window === "undefined") return;

    const opened = window.open(href, "_blank", "noopener,noreferrer");
    if (opened) {
        opened.opener = null;
        return;
    }

    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.referrerPolicy = "no-referrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}

export function handleExternalLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string): void {
    event.preventDefault();
    openExternalLink(href);
}
