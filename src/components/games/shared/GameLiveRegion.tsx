"use client";

import { useEffect, useState } from "react";

interface GameLiveRegionProps {
    /** Message to announce. Changes are announced politely; empty/null clears the region. */
    message: string | null | undefined;
}

/**
 * Visually hidden polite live region. Mounted empty, then receives the message
 * after mount so screen readers reliably announce it.
 */
export function GameLiveRegion({ message }: GameLiveRegionProps) {
    const [text, setText] = useState("");

    useEffect(() => {
        const id = window.setTimeout(() => setText(message ?? ""), 50);
        return () => window.clearTimeout(id);
    }, [message]);

    return (
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {text}
        </div>
    );
}
