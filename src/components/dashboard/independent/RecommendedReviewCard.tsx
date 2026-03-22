"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import type { WeakAreaRecommendation } from "@/lib/independent-progress";

interface RecommendedReviewCardProps {
    recommendations: WeakAreaRecommendation[];
}

export function RecommendedReviewCard({ recommendations }: RecommendedReviewCardProps) {
    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="mt-6">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Suggested Review
            </h3>
            <div className="space-y-2">
                {recommendations.map((rec) => (
                    <Link
                        key={rec.activityId}
                        href={`/activity/${encodeURIComponent(rec.activityId)}`}
                        className="dashboard-panel rounded-xl px-4 py-3 flex items-center gap-3 transition-all hover:shadow-md group"
                        style={{
                            background: "linear-gradient(135deg, color-mix(in srgb, var(--tone-quizzes-surface) 14%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-end) 100%)",
                            borderColor: "color-mix(in srgb, var(--tone-quizzes-border) 60%, var(--dashboard-border))",
                        }}
                    >
                        {/* Refresh Icon */}
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{
                                background: "color-mix(in srgb, var(--tone-quizzes-chip-bg) 50%, var(--dashboard-surface-start))",
                            }}
                        >
                            <RefreshCw
                                className="text-[var(--tone-quizzes-accent)]"
                                size={16}
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text truncate">
                                {rec.activityTitle}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">
                                Previous score: <span className="font-medium text-[var(--tone-quizzes-accent)]">{rec.score}%</span>
                                {" "}&middot;{" "}Try again to improve!
                            </p>
                        </div>

                        {/* Arrow */}
                        <div className="text-text-light group-hover:text-text-muted transition-colors">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
