"use client";

import { useEffect, useState } from "react";
import { useResolvedLearnerReturnHref } from "@/hooks/useResolvedLearnerReturnHref";
import { getMapReturnWeek } from "@/lib/course-map-navigation";

export interface CourseMapNextLaunch {
    href: string;
    title: string;
    weekNumber: number;
}

interface UseCourseMapNextLaunchResult {
    nextLaunch: CourseMapNextLaunch | null;
    mapReturnHref: string;
    isMapReturn: boolean;
    isLoading: boolean;
}

export function useCourseMapNextLaunch(enabled = true): UseCourseMapNextLaunchResult {
    const mapReturnHref = useResolvedLearnerReturnHref({ fallbackHref: "/dashboard/map" });
    const isMapReturn = mapReturnHref.startsWith("/dashboard/map");
    const [nextLaunch, setNextLaunch] = useState<CourseMapNextLaunch | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!enabled || !isMapReturn) {
            setNextLaunch(null);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setNextLaunch(null);
        setIsLoading(true);

        const week = getMapReturnWeek(mapReturnHref);
        fetch(week == null ? "/api/course-map/next-launch" : `/api/course-map/next-launch?week=${week}`)
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => {
                if (cancelled) return;
                const launch = data?.launch ?? null;
                setNextLaunch(week == null || launch?.weekNumber === week ? launch : null);
            })
            .catch(() => {
                if (cancelled) return;
                setNextLaunch(null);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [enabled, isMapReturn, mapReturnHref]);

    return {
        nextLaunch,
        // Back means the place this activity was opened, not the earliest unfinished week.
        mapReturnHref,
        isMapReturn,
        isLoading,
    };
}
