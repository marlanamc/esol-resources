"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Map, Target, X } from "lucide-react";

const WELCOME_DISMISS_KEY = "independent-welcome-dismissed-v1";

export function IndependentWelcomeCard() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (window.localStorage.getItem(WELCOME_DISMISS_KEY) !== "1") {
                setVisible(true);
            }
        } catch {
            // localStorage unavailable (private mode) — skip the card rather than show it forever
        }
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        try {
            window.localStorage.setItem(WELCOME_DISMISS_KEY, "1");
        } catch {
            // Best effort — card stays hidden for this session
        }
    };

    if (!visible) return null;

    return (
        <section
            className="dashboard-panel rounded-2xl p-[18px]"
            aria-label="Welcome to Class Companion"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="font-display text-base font-bold text-text">
                    Welcome! Here&rsquo;s how it works 👋
                </h2>
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="rounded-lg p-1.5 transition-colors hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    aria-label="Dismiss welcome message"
                >
                    <X className="text-text-muted" size={16} />
                </button>
            </div>

            <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                    <Map size={18} className="mt-0.5 shrink-0 text-secondary" aria-hidden />
                    <span className="text-sm text-text">
                        Follow your{" "}
                        <Link href="/dashboard/map" className="font-semibold text-primary underline underline-offset-2">
                            course map
                        </Link>{" "}
                        — it always shows your next step.
                    </span>
                </li>
                <li className="flex items-start gap-2.5">
                    <Flame size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                    <span className="text-sm text-text">
                        Practice a little every day to build your streak.
                    </span>
                </li>
                <li className="flex items-start gap-2.5">
                    <Target size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    <span className="text-sm text-text">
                        Set a weekly goal that fits your life — even two activities counts.
                    </span>
                </li>
            </ul>

            <button
                type="button"
                onClick={handleDismiss}
                className="mt-4 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-[color:var(--text-on-accent)] transition-colors hover:bg-primary-dark"
            >
                Got it
            </button>
        </section>
    );
}
