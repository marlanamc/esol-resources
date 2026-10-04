import type { ReactNode } from "react";
import { getDashboardResumeData } from "@/lib/course-map-week";
import { ThisWeekPanelClient } from "@/components/dashboard/ThisWeekPanelClient";
import { EarlyWeekBanner } from "@/components/dashboard/EarlyWeekBanner";

interface ThisWeekPanelProps {
    user: { id: string; role?: string | null };
    fallback?: ReactNode;
    collapsedLimit?: number;
}

export async function ThisWeekPanel({ user, fallback = null, collapsedLimit }: ThisWeekPanelProps) {
    const data = await getDashboardResumeData(user);
    if (!data) return fallback;

    const panel = (
        <ThisWeekPanelClient
            weekNumber={data.weekNumber}
            weekTitle={data.weekTitle}
            weekGoal={data.weekGoal}
            unitNumber={data.unitNumber}
            unitTitle={data.unitTitle}
            unitMonth={data.unitMonth}
            progress={data.progress}
            items={data.weekItems}
            continueHref={data.continueHref}
            continueLabel={data.continueLabel}
            mapHref={data.mapHref}
            showUnitMonths={data.showUnitMonths}
            collapsedLimit={collapsedLimit}
        />
    );

    if (data.earlyAccessWeekNumber == null) return panel;

    return (
        <div className="space-y-3">
            <EarlyWeekBanner weekNumber={data.earlyAccessWeekNumber} />
            {panel}
        </div>
    );
}
