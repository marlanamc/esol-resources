"use client";

import Link from "next/link";
import { ClipboardIcon } from "@/components/icons/Icons";

interface TeacherPendingReviewsStatProps {
    pendingReviews: number;
    mobile?: boolean;
}

export function TeacherPendingReviewsStat({ pendingReviews, mobile = false }: TeacherPendingReviewsStatProps) {
    if (pendingReviews <= 0) return null;

    return mobile ? (
        <Link
            href="/dashboard/stats"
            className="dashboard-pill stats-badge-polish flex items-center gap-2 border-[#e2d9cc] pl-2 pr-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b79e80]"
            style={{
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--tone-speaking-surface) 12%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-speaking-surface) 8%, var(--dashboard-surface-end)) 100%)',
                borderColor: 'color-mix(in srgb, var(--tone-speaking-border) 84%, var(--dashboard-border))',
            }}
        >
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--tone-speaking-chip-bg) 45%, var(--dashboard-surface-start))' }}>
                <ClipboardIcon className="text-[var(--tone-speaking-accent)]" />
            </div>
            <div>
                <div className="text-[9px] font-bold uppercase tracking-wide text-text-muted leading-none">Reviews</div>
                <div className="text-base font-semibold text-text leading-tight">
                    {pendingReviews} <span className="text-[10px] font-medium text-text-muted">new</span>
                </div>
            </div>
        </Link>
    ) : (
        <Link
            href="/dashboard/stats"
            className="dashboard-pill stats-badge-polish flex items-center gap-2.5 border-amber-200/50 pl-2.5 pr-4 py-2"
            style={{
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--tone-speaking-surface) 14%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-speaking-surface) 9%, var(--dashboard-surface-end)) 100%)',
                borderColor: 'color-mix(in srgb, var(--tone-speaking-border) 84%, var(--dashboard-border))',
            }}
        >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--tone-speaking-chip-bg) 54%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, var(--tone-speaking-surface) 28%, var(--dashboard-surface-end)) 100%)' }}>
                <ClipboardIcon className="text-warning" size={16} />
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">Reviews</div>
                <div className="text-lg font-bold text-text leading-tight">
                    {pendingReviews} <span className="text-xs font-semibold text-text-muted">new</span>
                </div>
            </div>
        </Link>
    );
}
