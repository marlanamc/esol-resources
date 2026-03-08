"use client";

import { useEffect, useRef } from "react";

let activeLockCount = 0;
let originalHtmlOverflow = "";
let originalBodyOverflow = "";

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

export function useDocumentScrollLock(locked: boolean) {
    const hasLockRef = useRef(false);

    useEffect(() => {
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
