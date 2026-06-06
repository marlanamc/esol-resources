"use client";

import { useCallback, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";

export function useListboxKeyboard(containerRef: RefObject<HTMLElement | null>) {
    const handleKeyDown = useCallback(
        (event: ReactKeyboardEvent) => {
            const container = containerRef.current;
            if (!container) return;

            const options = Array.from(
                container.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])')
            );
            if (options.length === 0) return;

            const activeIndex = options.findIndex((option) => option === document.activeElement);
            let nextIndex = activeIndex;

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    nextIndex = activeIndex < 0 ? 0 : Math.min(activeIndex + 1, options.length - 1);
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    nextIndex = activeIndex < 0 ? options.length - 1 : Math.max(activeIndex - 1, 0);
                    break;
                case "Home":
                    event.preventDefault();
                    nextIndex = 0;
                    break;
                case "End":
                    event.preventDefault();
                    nextIndex = options.length - 1;
                    break;
                default:
                    return;
            }

            options[nextIndex]?.focus();
        },
        [containerRef]
    );

    return handleKeyDown;
}
