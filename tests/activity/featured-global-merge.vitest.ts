import { describe, expect, it } from "vitest";
import {
    buildGlobalFeaturedActivitiesWhere,
    mergeFeaturedEntries,
} from "@/lib/featured-assignments";

describe("buildGlobalFeaturedActivitiesWhere", () => {
    it("selects only activities featured for everyone, excluding deleted ones", () => {
        expect(buildGlobalFeaturedActivitiesWhere()).toEqual({
            isFeaturedForIndependent: true,
            deletedAt: null,
        });
    });
});

describe("mergeFeaturedEntries", () => {
    type Card = { activityId: string; source: string; assignmentId: string | null };
    const classCard: Card = { activityId: "a1", source: "class", assignmentId: "asg-1" };
    const globalCard: Card = { activityId: "a1", source: "global", assignmentId: null };
    const otherGlobal: Card = { activityId: "a2", source: "global", assignmentId: null };

    it("shows class-featured and globally-featured together", () => {
        const merged = mergeFeaturedEntries([classCard], [otherGlobal]);
        expect(merged.map((e) => e.activityId).sort()).toEqual(["a1", "a2"]);
    });

    it("prefers the class-featured entry when the same activity is featured both ways", () => {
        // The class entry carries the assignmentId that activity links and
        // submission lookups depend on; the global card cannot supply one.
        const merged = mergeFeaturedEntries([classCard], [globalCard]);
        expect(merged).toHaveLength(1);
        expect(merged[0]).toMatchObject({ source: "class", assignmentId: "asg-1" });
    });

    it("keeps globally-featured items for a class with nothing featured", () => {
        const merged = mergeFeaturedEntries([], [globalCard, otherGlobal]);
        expect(merged.map((e) => e.activityId)).toEqual(["a1", "a2"]);
    });

    it("returns class entries unchanged when nothing is globally featured", () => {
        expect(mergeFeaturedEntries([classCard], [])).toEqual([classCard]);
    });

    it("de-duplicates repeated activityIds within each source", () => {
        const dupClass: Card = { activityId: "a1", source: "class-2", assignmentId: "asg-2" };
        const merged = mergeFeaturedEntries([classCard, dupClass], [globalCard]);
        expect(merged).toHaveLength(1);
        expect(merged[0]).toMatchObject({ assignmentId: "asg-1" });
    });

    it("is empty when neither source has anything", () => {
        expect(mergeFeaturedEntries<Card>([], [])).toEqual([]);
    });
});
