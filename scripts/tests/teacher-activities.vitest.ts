import { describe, expect, it } from "vitest";
import {
    filterTeacherBrowsableActivities,
    LEGACY_MONTHLY_VOCAB_UNIT_IDS,
} from "@/lib/teacher-activities";

describe("filterTeacherBrowsableActivities", () => {
    it("removes legacy monthly vocab unit cards", () => {
        const activities = [
            { id: "vocab-september", title: "Unit 1" },
            { id: "vocab-sep-w1", title: "September Week 1" },
            { id: "comparison-battle", title: "Comparison Battle" },
        ];

        expect(filterTeacherBrowsableActivities(activities).map((a) => a.id)).toEqual([
            "vocab-sep-w1",
            "comparison-battle",
        ]);
    });

    it("documents the retired monthly ids", () => {
        expect(LEGACY_MONTHLY_VOCAB_UNIT_IDS.has("vocab-january")).toBe(true);
        expect(LEGACY_MONTHLY_VOCAB_UNIT_IDS.has("vocab-sep-w1")).toBe(false);
    });
});
