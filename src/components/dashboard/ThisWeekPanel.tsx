import type { ReactNode } from "react";
import { getDashboardResumeData } from "@/lib/course-map-week";
import { ThisWeekPanelClient } from "@/components/dashboard/ThisWeekPanelClient";

interface ThisWeekPanelProps {
    user: { id: string; role?: string | null };
    fallback?: ReactNode;
}

export async function ThisWeekPanel({ user, fallback = null }: ThisWeekPanelProps) {
    const data = await getDashboardResumeData(user);
    if (!data) return fallback;

    return (
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
        />
    );
}
