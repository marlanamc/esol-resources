import { getCourseMapNextLaunchForUser } from "@/lib/course-map-next-launch";
import { CourseMapNextUpHeroCard } from "@/components/dashboard/CourseMapNextUpHeroCard";

export async function DashboardNextUpHero({
    user,
}: {
    user: { id: string; role?: string | null };
}) {
    const result = await getCourseMapNextLaunchForUser(user);
    const hero = result?.hero ?? null;

    if (!hero) return null;

    return (
        <section aria-label="Next lesson">
            <CourseMapNextUpHeroCard
                href={hero.href}
                title={hero.displayTitle}
                currentLabel={hero.currentLabel}
                unitNumber={hero.unitNumber}
                estimatedMinutes={hero.estimatedMinutes}
                icon={hero.icon}
                footerLink={{ href: "/dashboard/map", label: "View full map →" }}
            />
        </section>
    );
}
