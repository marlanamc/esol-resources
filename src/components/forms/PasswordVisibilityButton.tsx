"use client";

interface PasswordVisibilityButtonProps {
    visible: boolean;
    onToggle: () => void;
    controls: string;
    plural?: boolean;
}

/** Place inside a relative field wrapper; reserve input space with `pr-20`. */
export function PasswordVisibilityButton({
    visible,
    onToggle,
    controls,
    plural = false,
}: PasswordVisibilityButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex min-h-11 min-w-14 items-center justify-center rounded-lg px-2 text-sm font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-controls={controls}
            aria-label={`${visible ? "Hide" : "Show"} ${plural ? "passwords" : "password"}`}
        >
            {visible ? "Hide" : "Show"}
        </button>
    );
}
