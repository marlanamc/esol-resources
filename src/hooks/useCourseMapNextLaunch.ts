"use client";

import { useEffect, useState } from "react";
import { useResolvedLearnerReturnHref } from "@/hooks/useResolvedLearnerReturnHref";

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
    const [resolvedMapReturnHref, setResolvedMapReturnHref] = useState(mapReturnHref);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!enabled || !isMapReturn) {
            setNextLaunch(null);
            setResolvedMapReturnHref(mapReturnHref);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        fetch("/api/course-map/next-launch")
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => {
                if (cancelled) return;
                setNextLaunch(data?.launch ?? null);
                setResolvedMapReturnHref(data?.mapReturnHref ?? mapReturnHref);
            })
            .catch(() => {
                if (cancelled) return;
                setNextLaunch(null);
                setResolvedMapReturnHref(mapReturnHref);
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
        mapReturnHref: resolvedMapReturnHref,
        isMapReturn,
        isLoading,
    };
}
