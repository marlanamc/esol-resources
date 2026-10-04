import type { ReactNode } from "react";
import { getDashboardResumeData } from "@/lib/course-map-week";
import { ThisWeekPanelClient } from "@/components/dashboard/ThisWeekPanelClient";
import { EarlyWeekBanner } from "@/components/dashboard/EarlyWeekBanner";
import { ThisWeekRoadCard } from "@/components/dashboard/ThisWeekRoadCard";

interface ThisWeekPanelProps {
    user: { id: string; role?: string | null };
    fallback?: ReactNode;
    collapsedLimit?: number;
    /** `road` is the course map's "You are here" card (mobile home). */
    variant?: "panel" | "road";
}

export async function ThisWeekPanel({ user, fallback = null, collapsedLimit, variant = "panel" }: ThisWeekPanelProps) {
    const data = await getDashboardResumeData(user);
    if (!data) return fallback;

    const panel = variant === "road" ? (
        <ThisWeekRoadCard
            weekNumber={data.weekNumber}
            weekTitle={data.weekTitle}
            unitNumber={data.unitNumber}
            unitMonth={data.unitMonth}
            progress={data.progress}
            items={data.weekItems}
            currentTitle={data.currentItem.title}
            continueHref={data.continueHref}
            continueLabel={data.continueLabel}
            mapHref={data.mapHref}
            showUnitMonths={data.showUnitMonths}
        />
    ) : (
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
