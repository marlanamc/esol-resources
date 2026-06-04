"use client";

import Link from "next/link";
import { Map, MoveLeft } from "lucide-react";
import { useResolvedLearnerReturnHref } from "@/hooks/useResolvedLearnerReturnHref";

interface CourseMapReturnButtonProps {
    className?: string;
    label?: string;
    helper?: string;
}

export function CourseMapReturnButton({
    className = "",
    label = "Back to Course Map",
    helper = "Your next step will be marked Next up.",
}: CourseMapReturnButtonProps) {
    const href = useResolvedLearnerReturnHref({ fallbackHref: "/dashboard/map" });

    return (
        <Link
            href={href}
            className={`inline-flex flex-col items-center justify-center gap-1 rounded-2xl bg-primary px-6 py-3 text-center font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${className}`}
        >
            <span className="inline-flex items-center justify-center gap-2">
                <MoveLeft size={18} />
                {label}
                <Map size={18} />
            </span>
            {helper && <span className="text-xs font-medium text-white/80">{helper}</span>}
        </Link>
    );
}
