import type { MouseEvent } from "react";

/**
 * Kill switch for the Safari escape hatch below. The hatch relies on an
 * undocumented Apple URL scheme, so set this to "false" to fall back to plain
 * `target="_blank"` behavior without shipping a code change.
 */
export const isSafariEscapeEnabled =
    process.env.NEXT_PUBLIC_ENABLE_SAFARI_EXTERNAL_ESCAPE !== "false";

/**
 * How long to wait for iOS to hand off to Safari before assuming the scheme was
 * rejected. Long enough that a real hand-off always wins the race, short enough
 * that a dead scheme does not feel like a broken link.
 */
const SAFARI_ESCAPE_FALLBACK_MS = 1200;

/** `https:` → `x-safari-https:`, the scheme Safari registers for itself. */
const SAFARI_ESCAPE_SCHEMES: Record<string, string> = {
    "https:": "x-safari-https:",
    "http:": "x-safari-http:",
};

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
 * iPadOS 13+ reports a desktop Safari user agent, so multi-touch support is the
 * only reliable way to tell an iPad apart from a Mac.
 */
export function isIOSUserAgent(userAgent: string, maxTouchPoints = 0): boolean {
    if (/iPad|iPhone|iPod/.test(userAgent)) return true;
    return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}

/**
 * Rewrites an http(s) URL to the `x-safari-` scheme, which asks iOS to open it
 * in the Safari app rather than the in-app browser sheet. Returns null for
 * anything that is not http(s) — the scheme only exists for those.
 */
export function toSafariEscapeUrl(href: string): string | null {
    let parsed: URL;
    try {
        parsed = new URL(href);
    } catch {
        return null;
    }

    const scheme = SAFARI_ESCAPE_SCHEMES[parsed.protocol];
    if (!scheme) return null;

    return scheme + parsed.toString().slice(parsed.protocol.length);
}

/**
 * Whether this click should try to break out to Safari. Only iOS standalone
 * mode traps cross-origin links in an in-app sheet; every other browser already
 * opens `target="_blank"` somewhere sensible.
 */
export function shouldEscapeToSafari(href: string): boolean {
    if (typeof window === "undefined") return false;
    if (!isSafariEscapeEnabled) return false;
    if (!isStandaloneDisplayMode()) return false;
    if (!isIOSUserAgent(window.navigator.userAgent, window.navigator.maxTouchPoints)) return false;
    return toSafariEscapeUrl(href) !== null;
}

/** Best-effort signal that iOS moved us to the background, i.e. Safari took over. */
function hasLeftTheApp(): boolean {
    return document.visibilityState === "hidden" || !document.hasFocus();
}

/**
 * If the `x-safari-` scheme is ever removed, navigating to it is a silent no-op
 * and the link would appear dead. Watch for the hand-off and fall back to a
 * normal navigation when it does not happen.
 *
 * The fallback is a same-tab navigation rather than `window.open`, because by
 * the time the timer fires we are outside the click gesture and a popup would
 * be blocked. On current iOS a cross-origin top-level navigation from a
 * standalone web app opens the in-app sheet anyway, which is exactly the
 * behavior this hatch is trying to improve on — so the floor is today's UX.
 */
function scheduleSafariEscapeFallback(href: string): void {
    let settled = false;

    const cleanup = () => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("pagehide", onLeave);
    };

    const onLeave = () => {
        settled = true;
        cleanup();
    };

    const onVisibilityChange = () => {
        if (document.visibilityState === "hidden") onLeave();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onLeave);

    window.setTimeout(() => {
        if (settled || hasLeftTheApp()) {
            cleanup();
            return;
        }
        cleanup();
        window.location.assign(href);
    }, SAFARI_ESCAPE_FALLBACK_MS);
}

/** Opens the URL in a new browsing context, detaching the opener. */
function openInNewContext(href: string): void {
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

/**
 * Open a URL outside the current browsing context. In an iOS PWA this tries to
 * reach the real Safari app, so Google Classroom and Forms land in the session
 * the student already has (and can hand off to a native app via universal
 * links) instead of a sandboxed in-app sheet with its own cookie jar.
 */
export function openExternalLink(href: string): void {
    if (typeof window === "undefined") return;

    if (shouldEscapeToSafari(href)) {
        const escapeUrl = toSafariEscapeUrl(href);
        if (escapeUrl) {
            scheduleSafariEscapeFallback(href);
            window.location.href = escapeUrl;
            return;
        }
    }

    openInNewContext(href);
}

/**
 * Only intercepts the clicks that need it. Everywhere except an iOS PWA the
 * anchor's own `target="_blank"` is more reliable than `window.open`, which can
 * be caught by a popup blocker, so those clicks are left alone.
 */
export function handleExternalLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string): void {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!shouldEscapeToSafari(href)) return;

    event.preventDefault();
    openExternalLink(href);
}
