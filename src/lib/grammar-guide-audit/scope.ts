import { COURSE_MAP_UNITS } from "@/lib/course-map-data";
import type { GuideScopeEntry } from "./types";

const GRAMMAR_READER_PREFIX = "/grammar-reader/";

export function resolveWeek1to18Guides(
    minWeek = 1,
    maxWeek = 18,
): GuideScopeEntry[] {
    const guides: GuideScopeEntry[] = [];

    for (const unit of COURSE_MAP_UNITS) {
        for (const week of unit.weeks) {
            if (week.number < minWeek || week.number > maxWeek) continue;

            for (const item of week.items) {
                if (item.activityType !== "guide") continue;
                if (item.slot !== "required") continue;
                if (!item.href?.startsWith(GRAMMAR_READER_PREFIX)) continue;

                const slug = item.href.slice(GRAMMAR_READER_PREFIX.length);
                guides.push({
                    slug,
                    title: item.title,
                    weekNumber: week.number,
                    itemId: item.id,
                    href: item.href,
                });
            }
        }
    }

    return guides.sort((a, b) => a.weekNumber - b.weekNumber || a.slug.localeCompare(b.slug));
}
