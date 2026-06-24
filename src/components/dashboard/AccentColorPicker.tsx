"use client";

import { useState, useTransition } from "react";
import { ACCENT_PRESETS, ACCENT_KEYS, type AccentKey } from "@/lib/accent-colors";

interface AccentColorPickerProps {
    initialAccent: AccentKey;
}

export function AccentColorPicker({ initialAccent }: AccentColorPickerProps) {
    const [selected, setSelected] = useState<AccentKey>(initialAccent);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSelect = (key: AccentKey) => {
        if (key === selected) return;
        setSelected(key);
        setError(null);

        // Apply immediately via data attribute on <html>
        if (key === "terracotta") {
            document.documentElement.removeAttribute("data-accent");
        } else {
            document.documentElement.setAttribute("data-accent", key);
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/user/preferences", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accentColor: key }),
                });
                if (!res.ok) setError("Couldn't save. Try again.");
            } catch {
                setError("Couldn't save. Try again.");
            }
        });
    };

    return (
        <div>
            <div className="flex flex-wrap gap-3">
                {ACCENT_KEYS.map((key) => {
                    const preset = ACCENT_PRESETS[key];
                    const isActive = selected === key;
                    return (
                        <button
                            key={key}
                            onClick={() => handleSelect(key)}
                            disabled={isPending}
                            aria-label={`${preset.label} accent color${isActive ? " (selected)" : ""}`}
                            aria-pressed={isActive}
                            className="group relative flex flex-col items-center gap-2 focus-visible:outline-none"
                        >
                            <span
                                className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-150 group-hover:scale-110 group-active:scale-95"
                                style={{
                                    background: preset.swatch,
                                    boxShadow: isActive
                                        ? `0 0 0 3px white, 0 0 0 5px ${preset.swatch}`
                                        : "0 1px 3px rgba(0,0,0,0.15)",
                                }}
                            >
                                {isActive && (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                                        <path
                                            d="M4 9.2 7.4 12.6 14 5.8"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </span>
                            <span className="text-[11px] font-medium text-text-muted">{preset.label}</span>
                        </button>
                    );
                })}
            </div>
            {error && (
                <p className="mt-2 text-xs text-error">{error}</p>
            )}
        </div>
    );
}
