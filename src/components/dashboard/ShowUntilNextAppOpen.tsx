"use client";

import { useEffect, useState, type ReactNode } from "react";

const seenKey = (id: string) => `weekly-quiz-done-seen:${id}`;

// First answer per id for this page load. The dashboard renders the bar in both
// the phone and desktop layouts; without this the first copy would mark it seen
// and hide the second. A fresh app open reloads this module and starts empty.
const showThisLoad = new Map<string, boolean>();

/**
 * Shows its children for the rest of the app session in which they first
 * appear, then hides them from the next app open on.
 */
export function ShowUntilNextAppOpen({ id, children }: { id: string; children: ReactNode }) {
    // Hidden until localStorage is checked, so a seen bar never flashes.
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let show = showThisLoad.get(id);
        if (show === undefined) {
            try {
                show = window.localStorage.getItem(seenKey(id)) !== "1";
                window.localStorage.setItem(seenKey(id), "1");
            } catch {
                show = true;
            }
            showThisLoad.set(id, show);
        }
        setVisible(show);
    }, [id]);

    return visible ? <>{children}</> : null;
}
