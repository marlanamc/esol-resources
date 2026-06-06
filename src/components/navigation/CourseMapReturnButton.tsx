"use client";

import Link from "next/link";
import { ChevronRight, Map, MoveLeft } from "lucide-react";
import { useCourseMapNextLaunch } from "@/hooks/useCourseMapNextLaunch";

interface CourseMapReturnButtonProps {
    className?: string;
    mapLabel?: string;
    mapHelper?: string;
    nextLabel?: string;
    layout?: "stacked" | "inline";
    enabled?: boolean;
}

export function CourseMapReturnButton({
    className = "",
    mapLabel = "Back to Course Map",
    mapHelper = "See your full weekly path.",
    nextLabel,
    layout = "stacked",
    enabled = true,
}: CourseMapReturnButtonProps) {
    const { nextLaunch, mapReturnHref, isMapReturn, isLoading } = useCourseMapNextLaunch(enabled);
    const showNextLesson = isMapReturn && nextLaunch != null;
    const continueLabel = nextLabel ?? `Continue: ${nextLaunch?.title ?? "Next lesson"}`;

    if (!showNextLesson) {
        return (
            <Link
                href={mapReturnHref}
                className={`inline-flex flex-col items-center justify-center gap-1 rounded-2xl bg-primary px-6 py-3 text-center font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${className}`}
            >
                <span className="inline-flex items-center justify-center gap-2">
                    <MoveLeft size={18} />
                    {mapLabel}
                    <Map size={18} />
                </span>
                {mapHelper ? <span className="text-xs font-medium text-white/80">{mapHelper}</span> : null}
            </Link>
        );
    }

    const containerClass =
        layout === "inline"
            ? `flex flex-col items-stretch justify-center gap-3 sm:flex-row ${className}`
            : `flex flex-col items-stretch gap-3 ${className}`;

    return (
        <div className={containerClass}>
            <Link
                href={nextLaunch.href}
                className="inline-flex flex-col items-center justify-center gap-1 rounded-2xl bg-primary px-6 py-3 text-center font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            >
                <span className="inline-flex items-center justify-center gap-2">
                    {continueLabel}
                    <ChevronRight size={18} />
                </span>
                <span className="text-xs font-medium text-white/80">
                    {isLoading ? "Finding your next step..." : "Jump straight to your next required lesson."}
                </span>
            </Link>
            <Link
                href={mapReturnHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-6 py-3 text-center text-sm font-semibold text-text shadow-sm transition-colors hover:bg-bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-[#162b3d] dark:text-white"
            >
                <MoveLeft size={16} />
                {mapLabel}
            </Link>
        </div>
    );
}
