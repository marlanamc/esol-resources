"use client";

import { useEffect, useState } from "react";

type Props = {
    activityId: string;
    initialProgress?: number | null;
    userRole?: string | null;
};

export function ActivityProgressBadge({ activityId, initialProgress = 0, userRole }: Props) {
    const [progress, setProgress] = useState<number>(initialProgress ?? 0);

    useEffect(() => {
        setProgress(initialProgress ?? 0);
    }, [initialProgress]);

    const color =
        progress >= 100 ? "bg-green-100 text-green-800 border-green-200" : "bg-amber-100 text-amber-800 border-amber-200";

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${color}`}
            aria-label={`Progress ${progress}%`}
        >
            <span>{progress}%</span>
            <span className="uppercase tracking-wide">Done</span>
        </div>
    );
}


