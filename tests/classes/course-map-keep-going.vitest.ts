import { describe, expect, it } from "vitest";
import type { CourseMapActivity } from "@/lib/course-map";
import { buildCourseMapProgressState, getMapActivityKeepGoing, isMapActivityCompleted } from "@/lib/course-map-progress";
import { emptyProgress, type PathProgress } from "@/lib/pattern-path/engine";
import { processRound } from "@/lib/tense-path/progress";
import { TENSE_PATH_CHECKPOINTS, TENSE_PATH_FINAL_ID, TENSE_PATH_LEVELS } from "@/lib/tense-path/levels";

const tensePath: CourseMapActivity = { id: "tense-path-week-11", title: "Tense Path: Timeline Tenses", activityType: "game", status: "available", activityId: "tense-path" };
const soundPath: CourseMapActivity = { id: "sound-path-week-11", title: "Sound Path: -ed Endings", activityType: "game", status: "available", activityId: "sound-path" };
const quiz: CourseMapActivity = { id: "verb-quiz-9", title: "Week 12 Quiz", activityType: "quiz", status: "available", activityId: "verb-quiz-9" };

const pass = (p: PathProgress, id: string, mode: "round1" | "round2" | "checkpoint" | "final") => {
    const n = mode === "final" ? 20 : mode === "checkpoint" ? 12 : 10;
    return processRound(p, id, mode, Array.from({ length: n }, (_, i) => ({ questionId: `${id}-${i}`, correct: true }))).progress;
};
const state = (activityId: string, status: string, progress: PathProgress) =>
    buildCourseMapProgressState([{ activityId, status, categoryData: JSON.stringify(progress) }]);

describe("done, keep going", () => {
    it("labels a path game that counts as done but has levels left", () => {
        const p = pass(emptyProgress(), "always-true", "round1");
        const progress = state("tense-path", "completed", p);
        expect(isMapActivityCompleted(tensePath, progress)).toBe(true); // still counts toward the week
        expect(getMapActivityKeepGoing(tensePath, progress)).toBe(`1 of ${TENSE_PATH_LEVELS.length} levels`);
    });

    it("says nothing before the map goal is met", () => {
        const progress = state("tense-path", "in_progress", emptyProgress());
        expect(getMapActivityKeepGoing(tensePath, progress)).toBeNull();
    });

    it("drops the label once the final is passed", () => {
        let p = emptyProgress();
        for (const l of TENSE_PATH_LEVELS) p = pass(p, l.id, "round1");
        for (const c of TENSE_PATH_CHECKPOINTS) p = pass(p, c.id, "checkpoint");
        p = pass(p, TENSE_PATH_FINAL_ID, "final");
        expect(getMapActivityKeepGoing(tensePath, state("tense-path", "completed", p))).toBeNull();
    });

    it("works for Sound Path and ignores ordinary activities", () => {
        const sp = processRound(emptyProgress(), "extra-clap", "round1", Array.from({ length: 10 }, (_, i) => ({ questionId: `s${i}`, correct: true }))).progress;
        expect(getMapActivityKeepGoing(soundPath, state("sound-path", "completed", sp))).toBe("1 of 6 levels");
        expect(getMapActivityKeepGoing(quiz, buildCourseMapProgressState([{ activityId: "verb-quiz-9", status: "completed", categoryData: null }]))).toBeNull();
    });
});
