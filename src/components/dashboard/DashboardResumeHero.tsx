import { getDashboardResumeData } from "@/lib/course-map-week";
import { DashboardResumeCard } from "@/components/dashboard/DashboardResumeCard";
import type { ReactNode } from "react";

export async function DashboardResumeHero({
    user,
    fallback = null,
}: {
    user: { id: string; role?: string | null };
    fallback?: ReactNode;
}) {
    const data = await getDashboardResumeData(user);
    if (!data) return fallback;

    return (
        <section aria-label="Resume learning">
            <DashboardResumeCard data={data} />
        </section>
    );
}
