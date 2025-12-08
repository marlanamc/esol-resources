"use client";

import { useEffect, useState } from "react";

type Props = {
    activityId: string;
    initialProgress?: number | null;
    userRole?: string | null;
};

export function ActivityProgressBadge({ activityId, initialProgress = 0, userRole }: Props) {
    const [progress, setProgress] = useState<number>(initialProgress ?? 0);
    const isTeacher = userRole === "teacher";

    useEffect(() => {
        if (isTeacher) return;
        // Mark as completed when the page is viewed
        const mark = async () => {
            try {
                const res = await fetch("/api/activity/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ activityId, progress: 100, status: "completed" }),
                });
                if (!res.ok) return;
                const data = await res.json();
                if (typeof data.progress === "number") {
                    setProgress(data.progress);
                }
            } catch {
                // best effort
            }
        };
        mark();
    }, [activityId, isTeacher]);

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


