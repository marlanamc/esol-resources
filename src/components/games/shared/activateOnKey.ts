import type { KeyboardEvent } from "react";

/** True for Enter/Space pressed on the element itself, so role="button" elements can activate like buttons. */
export function isActivationKey(event: KeyboardEvent<HTMLElement>): boolean {
    return event.target === event.currentTarget && (event.key === "Enter" || event.key === " ");
}
