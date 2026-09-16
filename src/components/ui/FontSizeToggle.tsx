"use client";

import { useFontSize } from "@/components/layout/FontSizeProvider";

type FontSize = "normal" | "large";

interface FontSizeOption {
    value: FontSize;
    label: string;
    glyphClassName: string;
}

const fontSizeOptions: FontSizeOption[] = [
    { value: "normal", label: "Normal", glyphClassName: "text-xs" },
    { value: "large", label: "Large", glyphClassName: "text-base" },
];

interface FontSizeToggleProps {
    /** Compact mode shows only the "A" glyphs */
    compact?: boolean;
    className?: string;
}

export function FontSizeToggle({ compact = false, className = "" }: FontSizeToggleProps) {
    const { fontSize, setFontSize } = useFontSize();

    if (compact) {
        return (
            <div className={`flex items-center justify-between gap-3 ${className}`}>
                <span className="text-sm font-medium text-text">Text Size</span>
                <div
                    className="flex items-center gap-0.5 p-0.5 rounded-lg border"
                    style={{ backgroundColor: 'var(--surface-subtle)', borderColor: 'var(--border-subtle)' }}
                >
                    {fontSizeOptions.map((option) => {
                        const isActive = fontSize === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => setFontSize(option.value)}
                                className={`
                                    flex items-center justify-center px-2.5 py-1.5 rounded-md font-bold
                                    transition-all duration-200
                                    ${isActive
                                        ? "text-text shadow-sm"
                                        : "text-text-muted hover:text-text"
                                    }
                                `}
                                style={isActive ? { backgroundColor: 'var(--surface-base)' } : undefined}
                                aria-pressed={isActive}
                                aria-label={`Set text size to ${option.label}`}
                                title={option.label}
                            >
                                <span className={option.glyphClassName}>A</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted">
                    Text Size
                </span>
                <span className="text-xs text-text-muted">
                    {fontSize === "normal" ? "Switch to Large" : "Switch to Normal"}
                </span>
            </div>
            <div
                className="flex items-center gap-1 p-1 rounded-xl border"
                style={{ backgroundColor: 'var(--surface-subtle)', borderColor: 'var(--border-subtle)' }}
            >
                {fontSizeOptions.map((option) => {
                    const isActive = fontSize === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => setFontSize(option.value)}
                            className={`
                                flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                                transition-all duration-200
                                ${isActive
                                    ? "text-text shadow-sm border"
                                    : "text-text-muted hover:text-text"
                                }
                            `}
                            style={isActive
                                ? { backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }
                                : undefined}
                            aria-pressed={isActive}
                            aria-label={`Set text size to ${option.label}`}
                        >
                            <span className={`font-bold ${option.glyphClassName}`}>A</span>
                            <span>{option.label}</span>
                        </button>
                    );
                })}
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
                {fontSize === "normal" ? "Always use normal text size" : "Always use large text size"}
            </p>
        </div>
    );
}
