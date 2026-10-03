import { COURSE_MAP_UNITS } from '@/lib/course-map-data';
import { WEEKLY_REVIEW_LESSONS } from '@/lib/parts-of-speech-review/content';
import { describe, expect, it } from "vitest";
import type { CourseMapUnit } from "@/lib/course-map";
import {
    enrichCourseMapUnitsWithGrammarIdMap,
    buildCourseMapProgressState,
    getMapActivityProgressId,
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
                        id: "planned-placeholder-guide",
                        title: "Coming Soon Guide",
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
                        title: "Welcome Back: Simple & Continuous Review",
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
            "vocab-sep-w1": { status: "completed", categoryData: null },
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
            "vocab-sep-w1": { status: "completed", categoryData: null },
            "welcome-back-tenses-review-guide": { status: "completed", categoryData: null },
        };

        const next = resolveNextMapActivity(enriched, progress);
        expect(next?.title).toContain("Verb Forms");
    });

    it("builds a launch href with ui=flashcards for the next vocab flashcards map item", () => {
        const vocabFlashcardsUnits: CourseMapUnit[] = [
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
                                id: "vocab-sep-w1-flashcards",
                                title: "Vocab: Digital Habits — Flash Cards",
                                activityType: "game",
                                status: "available",
                                activityId: "vocab-sep-w1",
                                vocabUi: "flashcards",
                            },
                        ],
                    },
                ],
            },
        ];

        const launch = resolveNextMapActivityLaunch(vocabFlashcardsUnits, {}, {
            "vocab-sep-w1": { assignmentId: "cmpyyjgj7000p0e757m5m31hy" },
        });

        expect(launch?.href).toContain("/activity/vocab-sep-w1");
        expect(launch?.href).toContain("ui=flashcards");
        expect(launch?.href).toContain("assignment=cmpyyjgj7000p0e757m5m31hy");
        expect(launch?.href).toContain("returnTo=%2Fdashboard%2Fmap");
        expect(launch?.weekNumber).toBe(1);
    });

    it("builds a launch href with map returnTo for the next grammar guide", () => {
        const enriched = enrichCourseMapUnitsWithGrammarIdMap(mockUnits, {
            "welcome-back-tenses-review": "welcome-back-tenses-review-guide",
            "verb-forms-overview": "verb-forms-overview-guide",
        });

        const progress = {
            "vocab-sep-w1": { status: "completed", categoryData: null },
        };

        const launch = resolveNextMapActivityLaunch(enriched, progress);
        expect(launch?.href).toContain("/grammar-reader/welcome-back-tenses-review");
        expect(launch?.href).toContain("returnTo=%2Fdashboard%2Fmap");
        expect(launch?.weekNumber).toBe(1);
    });

    it("counts vocab map items complete per ui mode, not only overall status", () => {
        const flashcards = {
            id: "vocab-oct-w1-flashcards",
            title: "Vocab: Schedule Verbs — Flash Cards",
            activityType: "game" as const,
            status: "available" as const,
            activityId: "vocab-oct-w1",
            vocabUi: "flashcards",
        };
        const matching = {
            ...flashcards,
            id: "vocab-oct-w1-matching",
            title: "Vocab: Schedule Verbs — Matching",
            vocabUi: "matching",
        };

        const progress = {
            "vocab-oct-w1": {
                status: "in_progress",
                categoryData: {
                    flashcards: { completed: true, progress: 100 },
                    matching: { completed: false, progress: 0 },
                },
            },
        };

        expect(isMapActivityCompleted(flashcards, progress)).toBe(true);
        expect(isMapActivityCompleted(matching, progress)).toBe(false);
    });

    it("does not count planned slots in actionable progress checks", () => {
        const enriched = enrichCourseMapUnitsWithGrammarIdMap(mockUnits, {});
        const placeholder = enriched[0].levels[0].requiredActivities[0];
        expect(isMapActivityActionable(placeholder)).toBe(false);
        expect(
            isMapActivityCompleted(placeholder, { "planned-placeholder-guide": "completed" })
        ).toBe(false);
    });
});


it('keeps weekly Parts of Speech completion separate on the course map', () => {
    const week3 = { id: 'week3-pos', title: 'Week 3', activityType: 'game' as const, status: 'available' as const, activityId: 'parts-of-speech-game', href: '/activity/parts-of-speech-game?lesson=nouns-verbs' };
    const week4 = { ...week3, id: 'week4-pos', href: '/activity/parts-of-speech-game?lesson=adjectives-articles' };
    const progress = { 'parts-of-speech-game': { status: 'completed', categoryData: { _partsOfSpeechReview: { version: 1, lessons: { 'nouns-verbs': { completed: true } } } } } };
    expect(isMapActivityCompleted(week3, progress)).toBe(true);
    expect(isMapActivityCompleted(week4, progress)).toBe(false);
    expect(isMapActivityCompleted(week4, { 'parts-of-speech-game': 'completed' })).toBe(false);
    const both = { 'parts-of-speech-game': { status: 'completed', categoryData: { _partsOfSpeechReview: { version: 1, lessons: { 'nouns-verbs': { completed: true }, 'adjectives-articles': { completed: true } } } } } };
    expect(isMapActivityCompleted(week4, both)).toBe(true);
    expect(getMapActivityProgressId({ ...week4, activityId: undefined })).toBe('parts-of-speech-game');
    expect(isMapActivityCompleted({ ...week4, activityId: undefined }, both)).toBe(true);
});

it('keeps weekly results from multiple progress rows without replacing newer lesson completion', () => {
    const rows = [
      { activityId: 'parts-of-speech-game', status: 'completed', updatedAt: new Date('2026-10-02'), categoryData: JSON.stringify({ _partsOfSpeechReview: { version: 1, lessons: { 'adjectives-articles': { completed: true }, 'nouns-verbs': { completed: true } } } }) },
      { activityId: 'parts-of-speech-game', status: 'completed', updatedAt: new Date('2026-09-29'), categoryData: JSON.stringify({ _partsOfSpeechReview: { version: 1, lessons: { 'nouns-verbs': { completed: true } } } }) },
    ];
    expect(buildCourseMapProgressState(rows)['parts-of-speech-game'].categoryData).toEqual(JSON.parse(rows[0].categoryData));
    expect(buildCourseMapProgressState([...rows].reverse())).toEqual(buildCourseMapProgressState(rows));
});

it('routes scheduled weeks to their own review and checks each completion independently', () => {
    const weeks = COURSE_MAP_UNITS.flatMap(unit => unit.weeks);
    for (const { week, id } of WEEKLY_REVIEW_LESSONS) {
        const item = weeks.find(w => w.number === week)?.items.find(item => item.href === `/activity/parts-of-speech-game?lesson=${id}`);
        expect(item).toBeDefined();
        const activity = { ...item!, activityType: 'game' as const, status: 'available' as const };
        const progress = { 'parts-of-speech-game': { status: 'completed', categoryData: { _partsOfSpeechReview: { version: 1, lessons: { [id]: { completed: true } } } } } };
        expect(isMapActivityCompleted(activity, progress)).toBe(true);
        expect(isMapActivityCompleted(activity, { 'parts-of-speech-game': { status: 'completed', categoryData: null } })).toBe(false);
    }
});
