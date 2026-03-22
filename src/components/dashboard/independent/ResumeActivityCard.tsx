"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import type { InProgressActivity } from "@/lib/independent-progress";

interface ResumeActivityCardProps {
    activity: InProgressActivity;
}

export function ResumeActivityCard({ activity }: ResumeActivityCardProps) {
    const href = `/activity/${encodeURIComponent(activity.activityId)}`;

    return (
        <div className="mb-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Continue Learning
            </h3>
            <Link
                href={href}
                className="dashboard-panel rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-lg group"
                style={{
                    background: "linear-gradient(135deg, color-mix(in srgb, var(--tone-vocab-surface) 20%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-vocab-surface) 12%, var(--dashboard-surface-end)) 100%)",
                    borderColor: "var(--tone-vocab-border)",
                }}
            >
                {/* Play Icon */}
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{
                        background: "linear-gradient(135deg, var(--tone-vocab-chip-bg) 0%, var(--tone-vocab-surface) 100%)",
                    }}
                >
                    <PlayCircle
                        className="text-[var(--tone-vocab-accent)]"
                        size={24}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">
                        {activity.activityTitle}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{
                            background: "var(--surface-subtle)",
                        }}>
                            <div
                                className="h-full rounded-full transition-all"
                                style={{
                                    width: `${activity.progress}%`,
                                    background: "linear-gradient(90deg, var(--tone-vocab-accent) 0%, var(--tone-vocab-chip-bg) 100%)",
                                }}
                            />
                        </div>
                        <span className="text-xs font-medium text-text-muted">
                            {activity.progress}%
                        </span>
                    </div>
                </div>

                {/* Arrow */}
                <div className="text-text-muted group-hover:text-text transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </Link>
        </div>
    );
}
