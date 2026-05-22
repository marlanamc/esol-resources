"use client";

import { useEffect, useRef } from "react";

/** Tracks nested lock calls so we only restore scroll when the last lock is released. */
let activeLockCount = 0;
let originalHtmlOverflow = "";
let originalBodyOverflow = "";

function clearInlineScrollLockStyles() {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.overflow = originalBodyOverflow;
}

function ensureScrollLockRecoveryListener() {
    if (typeof window === "undefined") return;
    if ((ensureScrollLockRecoveryListener as { initialized?: boolean }).initialized) return;
    (ensureScrollLockRecoveryListener as { initialized?: boolean }).initialized = true;

    window.addEventListener("pagehide", () => {
        if (activeLockCount === 0) return;
        clearInlineScrollLockStyles();
        activeLockCount = 0;
    });
}

function lockDocumentScroll() {
    if (typeof document === "undefined") return;

    if (activeLockCount === 0) {
        originalHtmlOverflow = document.documentElement.style.overflow;
        originalBodyOverflow = document.body.style.overflow;
    }

    activeLockCount += 1;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
}

function unlockDocumentScroll() {
    if (typeof document === "undefined" || activeLockCount === 0) return;

    activeLockCount -= 1;
    if (activeLockCount > 0) return;

    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.overflow = originalBodyOverflow;
}

/**
 * Locks or unlocks document scroll (body + html overflow). Supports multiple callers;
 * scroll is only restored when the last caller sets locked to false.
 * @param locked - When true, scroll is hidden; when false, scroll is restored if this caller had locked it
 */
export function useDocumentScrollLock(locked: boolean) {
    const hasLockRef = useRef(false);

    useEffect(() => {
        ensureScrollLockRecoveryListener();

        if (!locked) {
            if (hasLockRef.current) {
                unlockDocumentScroll();
                hasLockRef.current = false;
            }
            return;
        }

        if (!hasLockRef.current) {
            lockDocumentScroll();
            hasLockRef.current = true;
        }

        return () => {
            if (!hasLockRef.current) return;

            unlockDocumentScroll();
            hasLockRef.current = false;
        };
    }, [locked]);
}
