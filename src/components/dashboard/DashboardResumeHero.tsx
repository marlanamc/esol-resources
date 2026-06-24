import { getDashboardResumeData } from "@/lib/course-map-week";
import { DashboardResumeCard } from "@/components/dashboard/DashboardResumeCard";
import { DashboardNextStepFallbackCard } from "@/components/dashboard/DashboardNextStepFallbackCard";
import type { ReactNode } from "react";

export async function DashboardResumeHero({
    user,
    fallback = null,
    heroStyle = false,
}: {
    user: { id: string; role?: string | null };
    fallback?: ReactNode;
    heroStyle?: boolean;
}) {
    const data = await getDashboardResumeData(user);
    if (!data) return fallback;

    if (heroStyle) {
        return (
            <DashboardNextStepFallbackCard
                href={data.continueHref}
                title={data.currentItem.title}
                type={data.currentItem.type}
                minutes={data.currentItem.estMinutes}
            />
        );
    }

    return (
        <section aria-label="Resume learning">
            <DashboardResumeCard data={data} />
        </section>
    );
}
