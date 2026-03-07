import React from 'react';
import { Badge } from '@/components/ui';
import type { BadgeVariant } from '@/components/ui/Badge';
import { ActivityLink } from '@/components/navigation/ActivityLink';
import { getLearnerCategoryTone } from '@/lib/learner-theme';

interface ActivityBrowseGridProps {
    activities: {
        id: string;
        title: string;
        description: string | null;
        type: string;
        category?: string | null;
        level?: string | null;
    }[];
    progressMap?: Record<string, number>;
}

export const ActivityBrowseGrid: React.FC<ActivityBrowseGridProps> = ({ activities, progressMap }) => {
    const isBadgeVariant = (value: string): value is BadgeVariant => {
        return (
            value === "default" ||
            value === "primary" ||
            value === "secondary" ||
            value === "success" ||
            value === "warning" ||
            value === "error" ||
            value === "quiz" ||
            value === "worksheet" ||
            value === "slides" ||
            value === "guide" ||
            value === "game" ||
            value === "resource" ||
            value === "speaking"
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-400">
            {activities.map((activity, idx) => (
                (() => {
                    const tone = getLearnerCategoryTone(activity.category);

                    return (
                <div
                    key={activity.id}
                    className="surface-elevated surface-card-shadow backdrop-blur-sm border p-0 transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 flex flex-col rounded-xl group relative overflow-hidden h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    style={{
                        animationDelay: `${idx * 40}ms`,
                        borderColor: tone.border,
                    }}
                >
                    {/* Header Image / Badge Area */}
                    <div
                        className="h-32 p-6 relative border-b"
                        style={{
                            background: `linear-gradient(135deg, ${tone.surfaceMuted} 0%, var(--surface-elevated) 100%)`,
                            borderColor: tone.border,
                        }}
                    >
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <Badge variant={isBadgeVariant(activity.type) ? activity.type : "default"} size="sm" className="shadow-sm uppercase tracking-wider text-[10px] font-bold">
                                {activity.type}
                            </Badge>
                        </div>
                        {/* Decorative element */}
                        <div
                            className="absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-colors"
                            style={{ backgroundColor: tone.surface }}
                        />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                        {/* Category & Level Script */}
                        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-text-muted uppercase tracking-widest">
                            <span style={{ color: tone.accentStrong }}>
                                {activity.category === 'numbers' || activity.category === 'number' ? 'NUMBERS' : activity.category?.toUpperCase() || 'GENERAL'}
                            </span>
                            {typeof progressMap?.[activity.id] === "number" && (
                                <span
                                    className="text-[11px] px-2 py-1 rounded-full border"
                                    style={{
                                        backgroundColor: tone.chipBg,
                                        color: tone.chipText,
                                        borderColor: tone.border,
                                    }}
                                >
                                    {progressMap[activity.id]}% done
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold mb-2 text-text group-hover:text-primary transition-colors font-display leading-tight" title={activity.title}>
                            {activity.title}
                        </h3>
                        <p className="text-sm mb-6 line-clamp-3 text-text-muted leading-relaxed flex-grow font-body">
                            {activity.description}
                        </p>

                        {/* Action */}
                        <ActivityLink
                            activityId={activity.id}
                            className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold transition-[background-color,color,border-color,box-shadow] rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            style={{
                                backgroundColor: tone.surfaceMuted,
                                color: tone.accentStrong,
                                borderColor: tone.border,
                            }}
                        >
                            Start Activity
                        </ActivityLink>
                    </div>
                </div>
                    );
                })()
            ))}
        </div>
    );
};
