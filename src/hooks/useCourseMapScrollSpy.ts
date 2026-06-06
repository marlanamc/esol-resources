"use client";

import { useEffect, useState } from "react";
import type { CourseMapUnit } from "@/lib/course-map";
import { COURSE_MAP_SCROLL_OFFSET_PX } from "@/lib/course-map-navigation";

export function useCourseMapScrollSpy(units: CourseMapUnit[]) {
    const [activeUnitNumber, setActiveUnitNumber] = useState<number | null>(units[0]?.unitNumber ?? null);
    const [activeWeekNumber, setActiveWeekNumber] = useState<number | null>(null);

    useEffect(() => {
        const unitElements = units
            .map((unit) => document.getElementById(`unit-${unit.unitNumber}`))
            .filter((el): el is HTMLElement => el != null);

        const weekElements = units
            .flatMap((unit) => unit.levels.map((level) => document.getElementById(`week-${level.levelNumber}`)))
            .filter((el): el is HTMLElement => el != null);

        if (unitElements.length === 0 && weekElements.length === 0) return;

        const rootMargin = `-${COURSE_MAP_SCROLL_OFFSET_PX}px 0px -55% 0px`;
        const threshold = [0, 0.15, 0.35, 0.55];

        const unitObserver =
            unitElements.length > 0
                ? new IntersectionObserver(
                      (entries) => {
                          const visible = entries
                              .filter((entry) => entry.isIntersecting)
                              .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                          const top = visible[0]?.target.id.match(/^unit-(\d+)$/);
                          if (top) {
                              setActiveUnitNumber(Number.parseInt(top[1], 10));
                          }
                      },
                      { rootMargin, threshold }
                  )
                : null;

        const weekObserver =
            weekElements.length > 0
                ? new IntersectionObserver(
                      (entries) => {
                          const visible = entries
                              .filter((entry) => entry.isIntersecting)
                              .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                          const top = visible[0]?.target.id.match(/^week-(\d+)$/);
                          if (top) {
                              setActiveWeekNumber(Number.parseInt(top[1], 10));
                          }
                      },
                      { rootMargin: `-${COURSE_MAP_SCROLL_OFFSET_PX}px 0px -60% 0px`, threshold }
                  )
                : null;

        for (const el of unitElements) unitObserver?.observe(el);
        for (const el of weekElements) weekObserver?.observe(el);

        return () => {
            unitObserver?.disconnect();
            weekObserver?.disconnect();
        };
    }, [units]);

    return { activeUnitNumber, activeWeekNumber };
}
