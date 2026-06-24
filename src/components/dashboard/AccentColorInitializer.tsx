"use client";

import { useLayoutEffect } from "react";
import type { AccentKey } from "@/lib/accent-colors";

export function AccentColorInitializer({ accentKey }: { accentKey: AccentKey }) {
    useLayoutEffect(() => {
        if (accentKey === "terracotta") {
            document.documentElement.removeAttribute("data-accent");
        } else {
            document.documentElement.setAttribute("data-accent", accentKey);
        }
    }, [accentKey]);

    return null;
}
