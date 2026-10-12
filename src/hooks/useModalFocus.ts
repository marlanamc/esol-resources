"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type=\"hidden\"])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex=\"-1\"])",
].join(", ");

interface UseModalFocusOptions {
    /** Called when the user presses Escape. Omit to leave Escape handling to the caller. */
    onEscape?: () => void;
    /** Element to focus on open. Defaults to the first focusable element in the container. */
    initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Accessible modal focus behaviour for hand-built dialogs and drawers:
 * moves focus into the container on open, keeps Tab / Shift+Tab inside it,
 * closes on Escape, and returns focus to the element that opened it.
 * (WCAG 2.1.2, 2.4.3; matches the pattern in LearnerSearchProvider.)
 */
export function useModalFocus(
    isOpen: boolean,
    containerRef: RefObject<HTMLElement | null>,
    { onEscape, initialFocusRef }: UseModalFocusOptions = {}
) {
    const onEscapeRef = useRef(onEscape);
    useEffect(() => {
        onEscapeRef.current = onEscape;
    }, [onEscape]);

    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;

        const focusTimer = window.setTimeout(() => {
            const container = containerRef.current;
            if (!container) return;
            const target =
                initialFocusRef?.current ??
                container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
                container;
            if (target === container && !container.hasAttribute("tabindex")) {
                container.setAttribute("tabindex", "-1");
            }
            target.focus();
        }, 0);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && onEscapeRef.current) {
                event.preventDefault();
                onEscapeRef.current();
                return;
            }

            const container = containerRef.current;
            if (event.key !== "Tab" || !container) return;

            const focusable = Array.from(
                container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            ).filter((el) => el.offsetParent !== null || el === document.activeElement);
            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (!container.contains(active)) {
                event.preventDefault();
                first.focus();
            } else if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener("keydown", handleKeyDown);
            if (previouslyFocused && document.contains(previouslyFocused)) {
                previouslyFocused.focus();
            }
        };
    }, [isOpen, containerRef, initialFocusRef]);
}
