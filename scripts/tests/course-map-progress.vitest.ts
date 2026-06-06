import { describe, expect, it } from "vitest";
import type { CourseMapUnit } from "@/lib/course-map";
import {
    enrichCourseMapUnitsWithGrammarIdMap,
    isMapActivityActionable,
    isMapActivityCompleted,
} from "@/lib/course-map-progress";
import {
    resolveNextMapActivity,
    resolveNextMapActivityLaunch,
} from "@/lib/course-map-navigation";

const mockUnits: CourseMapUnit[] = [
    {
        unitNumber: 1,
        unitTitle: "Getting to Know You",
        month: "September",
        levels: [
            {
                levelNumber: 1,
                levelTitle: "Start the Class",
                requiredActivities: [
                    {
                        id: "welcome-how-to-use-app",
                        title: "Welcome / How to Use the App",
                        activityType: "guide",
                        status: "planned",
                    },
                    {
                        id: "vocab-sep-w1",
                        title: "Vocab: Digital Habits",
                        activityType: "game",
                        status: "available",
                        activityId: "vocab-sep-w1",
                    },
                    {
                        id: "welcome-back-tenses-review",
                        title: "Welcome Back: Simple & Continuous Review + V3 Preview",
                        activityType: "guide",
                        status: "available",
                        href: "/grammar-reader/welcome-back-tenses-review",
                    },
                    {
                        id: "verb-forms-overview",
                        title: "Verb Forms: V1 → V3",
                        activityType: "guide",
                        status: "available",
                        href: "/grammar-reader/verb-forms-overview",
                    },
                ],
            },
        ],
    },
];

describe("course map progress", () => {
    it("skips planned placeholders when finding next activity", () => {
        const enriched = enrichCourseMapUnitsWithGrammarIdMap(mockUnits, {
            "welcome-back-tenses-review": "welcome-back-tenses-review-guide",
            "verb-forms-overview": "verb-forms-overview-guide",
        });

        const progress = {
            "vocab-sep-w1": "completed",
        };

        const next = resolveNextMapActivity(enriched, progress);
        expect(next?.title).toContain("Simple & Continuous Review");
    });

    it("advances past a completed grammar guide once its slug resolves to progress", () => {
        const enriched = enrichCourseMapUnitsWithGrammarIdMap(mockUnits, {
            "welcome-back-tenses-review": "welcome-back-tenses-review-guide",
            "verb-forms-overview": "verb-forms-overview-guide",
        });

        const progress = {
            "vocab-sep-w1": "completed",
            "welcome-back-tenses-review-guide": "completed",
        };

        const next = resolveNextMapActivity(enriched, progress);
        expect(next?.title).toContain("Verb Forms");
    });

    it("builds a launch href with map returnTo for the next grammar guide", () => {
        const enriched = enrichCourseMapUnitsWithGrammarIdMap(mockUnits, {
            "welcome-back-tenses-review": "welcome-back-tenses-review-guide",
            "verb-forms-overview": "verb-forms-overview-guide",
        });

        const progress = {
            "vocab-sep-w1": "completed",
        };

        const launch = resolveNextMapActivityLaunch(enriched, progress);
        expect(launch?.href).toContain("/grammar-reader/welcome-back-tenses-review");
        expect(launch?.href).toContain("returnTo=%2Fdashboard%2Fmap");
        expect(launch?.weekNumber).toBe(1);
    });

    it("does not count planned slots in actionable progress checks", () => {
        const enriched = enrichCourseMapUnitsWithGrammarIdMap(mockUnits, {});
        const placeholder = enriched[0].levels[0].requiredActivities[0];
        expect(isMapActivityActionable(placeholder)).toBe(false);
        expect(
            isMapActivityCompleted(placeholder, { "welcome-how-to-use-app": "completed" })
        ).toBe(false);
    });
});
