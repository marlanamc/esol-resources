"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarPlus, X } from "lucide-react";

interface EarlyWeekBannerProps {
    weekNumber: number;
}

const dismissKey = (weekNumber: number) => `early-week-banner-dismissed:${weekNumber}`;

/**
 * "Week N is open!" strip shown during the early-access window, between the
 * Sunday reveal and the Tuesday classroom switch. Dismissing hides it for
 * that week only, so the next week's banner still appears.
 */
export function EarlyWeekBanner({ weekNumber }: EarlyWeekBannerProps) {
    // Hidden until localStorage is checked, so a dismissed banner never flashes.
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            setVisible(window.localStorage.getItem(dismissKey(weekNumber)) !== "1");
        } catch {
            setVisible(true);
        }
    }, [weekNumber]);

    if (!visible) return null;

    const dismiss = () => {
        setVisible(false);
        try {
            window.localStorage.setItem(dismissKey(weekNumber), "1");
        } catch {
            // Storage unavailable: hide for this visit only.
        }
    };

    return (
        <div
            role="status"
            className="flex items-center gap-2.5 rounded-2xl border py-1 pl-3.5 pr-1"
            style={{
                background: "color-mix(in srgb, var(--primary) 10%, var(--dashboard-surface-start))",
                borderColor: "color-mix(in srgb, var(--primary) 25%, transparent)",
            }}
        >
            <CalendarPlus size={20} aria-hidden className="shrink-0 text-primary" />
            <p className="m-0 min-w-0 flex-1 text-[15px] leading-snug text-text">
                <strong>Week {weekNumber} is open!</strong>{" "}
                <Link
                    href={`/dashboard/map?week=${weekNumber}#week-${weekNumber}`}
                    className="rounded font-bold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    Start early →
                </Link>
            </p>
            <button
                type="button"
                onClick={dismiss}
                aria-label={`Hide Week ${weekNumber} notice`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
                <X size={16} aria-hidden />
            </button>
        </div>
    );
}
