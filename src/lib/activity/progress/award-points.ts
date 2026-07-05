import { getActivityPoints, POINTS } from "@/lib/gamification/gamification";
import { calculateGroupPoints as calculateGIGroupPoints } from "@/lib/verbs/gerund-infinitive-progress";
import { calculateGroupPoints as calculateVerbGroupPoints } from "@/lib/verbs/irregular-progress";
import { applyAwardChain } from "@/lib/gamification/award-chain";
import { logger } from "@/lib/shared/logger";
import { isVocabProgressType } from "@/lib/activity/progress/shared";

type ActivitySnapshot = {
    type: string;
    title: string;
    content: string;
    ui: string | null;
    category: string | null;
};

export interface AwardProgressPointsInput {
    userId: string;
    activityId: string;
    activity: ActivitySnapshot | null;
    activityGameUi: string;
    shouldAwardGroupRoundPoints: boolean;
    groupId?: unknown;
    roundMode?: unknown;
    roundAccuracy?: unknown;
    roundExercisesCompleted?: unknown;
    isVocabularyTypeUpdate: boolean;
    vocabType?: string;
    category?: string;
    sanitizedAccuracy?: number;
}

export async function awardProgressActivityPoints(
    input: AwardProgressPointsInput
): Promise<number> {
    const {
        userId,
        activityId,
        activity,
        activityGameUi,
        shouldAwardGroupRoundPoints,
        groupId,
        roundMode,
        roundAccuracy,
        roundExercisesCompleted,
        isVocabularyTypeUpdate,
        vocabType,
        category,
        sanitizedAccuracy,
    } = input;

    let points = 5;
    let activityTypeLabel = "";

    if (!activity) {
        try {
            await applyAwardChain({
                userId,
                points: 5,
                reason: `Completed activity ${activityId}`,
                source: "activity",
            });
            return 5;
        } catch (err) {
            logger.error("[Progress] Award chain failed (fallback)", { userId, activityId, err });
            return 0;
        }
    }

    if (activity.type === "vocabulary" && isVocabularyTypeUpdate && isVocabProgressType(vocabType)) {
        const vocabPoints: Record<string, number> = {
            "word-list": 5,
            flashcards: 4,
            matching: 7,
            "fill-blank": 5,
        };
        points = vocabPoints[vocabType] || 5;

        const vocabTypeLabels: Record<string, string> = {
            "word-list": "Word List",
            flashcards: "Flashcards",
            matching: "Matching",
            "fill-blank": "Fill in the Blank",
        };
        activityTypeLabel = vocabTypeLabels[vocabType] || vocabType;
    } else {
        points = getActivityPoints(activity.type, activity);

        const gameTypeLabels: Record<string, string> = {
            numbers: "Numbers Game",
            matching: "Matching Game",
            "fill-in-blank": "Fill in the Blank",
            flashcards: "Flashcards",
            "verb-forms": "Verb Forms",
            "word-list": "Word List",
            "ed-pronunciation": "-ed Pronunciation",
            "minimal-pairs": "Minimal Pairs",
            "pronunciation-listening": "Pronunciation Listening",
        };
        if (activity.type === "game" && gameTypeLabels[activityGameUi]) {
            activityTypeLabel = gameTypeLabels[activityGameUi];
        } else if (activity.type === "guide") {
            activityTypeLabel = "Grammar Guide";
        }
    }

    if (shouldAwardGroupRoundPoints) {
        const sanitizedRoundAccuracy = Math.max(
            0,
            Math.min(100, Math.round(Number(roundAccuracy)))
        );
        const sanitizedRoundExercises = Math.max(
            0,
            Math.min(50, Math.round(Number(roundExercisesCompleted)))
        );
        const isRound1 = roundMode === "round1";
        const passed = sanitizedRoundAccuracy >= (isRound1 ? 80 : 85);
        const giRoundMode = isRound1 ? "round1" : "round2";

        if (activityGameUi === "parts-of-speech") {
            const groupIdStr = typeof groupId === "string" ? groupId : "";
            const difficulty = groupIdStr.includes("-3-")
                ? 3
                : groupIdStr.includes("-2-")
                  ? 2
                  : 1;
            points = passed ? (difficulty === 3 ? 8 : difficulty === 2 ? 5 : 3) : 0;
            activityTypeLabel = "Parts of Speech";
        } else {
            points =
                activityGameUi === "gerund-infinitive"
                    ? calculateGIGroupPoints(
                          sanitizedRoundAccuracy,
                          sanitizedRoundExercises,
                          passed,
                          giRoundMode
                      )
                    : calculateVerbGroupPoints(
                          sanitizedRoundAccuracy,
                          sanitizedRoundExercises,
                          passed,
                          roundMode as "round1" | "round2" | "review"
                      );
            activityTypeLabel =
                activityGameUi === "gerund-infinitive"
                    ? "Gerunds & Infinitives"
                    : "Irregular Verbs";
        }
    } else if (activityGameUi === "numbers") {
        const categoryStr = (category || "").toLowerCase();
        let basePoints: number;
        let perfectBonus: number;
        let highBonus: number;

        if (
            categoryStr.includes("basic numbers") ||
            categoryStr.includes("round numbers")
        ) {
            basePoints = POINTS.NUMBERS_GAME_EASY;
            perfectBonus = POINTS.NUMBERS_GAME_PERFECT_EASY;
            highBonus = POINTS.NUMBERS_GAME_HIGH_EASY;
        } else if (
            (categoryStr.includes("hundreds") && categoryStr.includes("100-999")) ||
            categoryStr.includes("ordinal numbers")
        ) {
            basePoints = POINTS.NUMBERS_GAME_MEDIUM;
            perfectBonus = POINTS.NUMBERS_GAME_PERFECT_MEDIUM;
            highBonus = POINTS.NUMBERS_GAME_HIGH_MEDIUM;
        } else if (
            categoryStr.includes("one thousand to ten thousand") ||
            categoryStr.includes("ten thousands")
        ) {
            basePoints = POINTS.NUMBERS_GAME_MEDIUM_HARD;
            perfectBonus = POINTS.NUMBERS_GAME_PERFECT_MEDIUM_HARD;
            highBonus = POINTS.NUMBERS_GAME_HIGH_MEDIUM_HARD;
        } else {
            basePoints = POINTS.NUMBERS_GAME_HARD;
            perfectBonus = POINTS.NUMBERS_GAME_PERFECT_HARD;
            highBonus = POINTS.NUMBERS_GAME_HIGH_HARD;
        }

        let bonusPoints = 0;
        if (sanitizedAccuracy !== undefined) {
            if (sanitizedAccuracy === 100) {
                bonusPoints = perfectBonus;
            } else if (sanitizedAccuracy >= 90) {
                bonusPoints = highBonus;
            }
        } else {
            bonusPoints = perfectBonus;
        }

        points = basePoints + bonusPoints;
    } else if (activityGameUi === "verb-forms") {
        const difficulty = (category || "medium").toLowerCase();
        let pointsPerVerb: number = POINTS.VERB_FORMS_MEDIUM;
        if (difficulty === "easy") pointsPerVerb = POINTS.VERB_FORMS_EASY;
        if (difficulty === "hard") pointsPerVerb = POINTS.VERB_FORMS_HARD;

        const correctCount = Math.round(((sanitizedAccuracy || 0) * 10) / 100);
        let sessionPoints = correctCount * pointsPerVerb;
        if (sanitizedAccuracy === 100) {
            sessionPoints += POINTS.VERB_FORMS_BONUS;
        }
        points = sessionPoints;
    } else if (activityGameUi === "verb-speed-round") {
        if (sanitizedAccuracy === 100) {
            points = POINTS.VERB_SPEED_ROUND_PERFECT;
        } else if (sanitizedAccuracy !== undefined && sanitizedAccuracy >= 90) {
            points = POINTS.VERB_SPEED_ROUND_HIGH;
        } else {
            points = POINTS.VERB_SPEED_ROUND;
        }
        activityTypeLabel = "Verb Speed Round";
    } else if (activityGameUi === "timeline-tenses") {
        const isTimeSignalsRound =
            sanitizedAccuracy !== undefined &&
            typeof category === "string" &&
            category.toLowerCase() === "time-signals";

        if (isTimeSignalsRound) {
            points = POINTS.TIMELINE_TENSES_TIME_SIGNALS;
            activityTypeLabel = "Timeline Time Signals Quiz";
        } else if (sanitizedAccuracy === 100) {
            points = POINTS.TIMELINE_TENSES_PERFECT;
            activityTypeLabel = "Timeline Tenses";
        } else if (sanitizedAccuracy !== undefined && sanitizedAccuracy >= 80) {
            points = POINTS.TIMELINE_TENSES_HIGH;
            activityTypeLabel = "Timeline Tenses";
        } else {
            points = POINTS.TIMELINE_TENSES;
            activityTypeLabel = "Timeline Tenses";
        }
    }

    const reason = activityTypeLabel
        ? `${activity.title}|${activityTypeLabel}`
        : `Completed: ${activity.title}`;

    try {
        await applyAwardChain({
            userId,
            points,
            reason,
            source: "activity",
        });
        return points;
    } catch (err) {
        logger.error("[Progress] Award chain failed after progress save", {
            userId,
            activityId,
            points,
            err,
        });
        return 0;
    }
}
