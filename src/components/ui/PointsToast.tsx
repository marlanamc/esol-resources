"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PointsToastProps {
    points: number;
    onComplete?: () => void;
    message?: string;
}

export function PointsToast({ points, onComplete, message }: PointsToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        // Trigger entrance animation
        const showTimer = setTimeout(() => setIsVisible(true), 50);

        // Start exit animation after 2 seconds
        const hideTimer = setTimeout(() => {
            setIsLeaving(true);
        }, 2000);

        // Clean up after exit animation
        const cleanupTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2500);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            clearTimeout(cleanupTimer);
        };
    }, [onComplete]);

    if (!isMounted) {
        return null;
    }

    return createPortal(
        <div
            className={`pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 ease-out ${
                isVisible && !isLeaving
                    ? "opacity-100 translate-y-0 scale-100"
                    : isLeaving
                        ? "opacity-0 -translate-y-4 scale-95"
                        : "opacity-0 translate-y-4 scale-95"
            }`}
            role="status"
            aria-live="polite"
        >
            <div
                className="mx-4 flex min-w-[11rem] max-w-[calc(100vw-2rem)] items-center justify-center gap-2 rounded-full border px-5 py-3 font-bold shadow-[0_14px_36px_rgba(13,22,32,0.22)] backdrop-blur-sm sm:px-6"
                style={{
                    background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--accent-color-light) 68%, var(--accent-color)) 0%, var(--accent-color) 55%, color-mix(in srgb, var(--accent-color-dark) 80%, #8a5a12) 100%)",
                    color: "var(--text-on-accent)",
                    borderColor: "color-mix(in srgb, var(--text-on-accent) 24%, transparent)",
                }}
            >
                <span className="text-2xl leading-none drop-shadow-[0_1px_1px_rgba(8,16,24,0.28)]">+{points}</span>
                <div className="flex flex-col leading-none">
                    <span className="text-sm opacity-95">points!</span>
                    {message ? <span className="text-[10px] opacity-85 mt-1">{message}</span> : null}
                </div>
            </div>
        </div>,
        document.body
    );
}
