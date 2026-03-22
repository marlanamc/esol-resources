import type { Prisma } from "@prisma/client";

export const LEARNER_MODE_VALUES = ["classroom", "independent"] as const;

export type LearnerMode = (typeof LEARNER_MODE_VALUES)[number];

export function normalizeLearnerMode(value: string | null | undefined): LearnerMode | null {
    if (!value) return null;
    return LEARNER_MODE_VALUES.includes(value as LearnerMode) ? (value as LearnerMode) : null;
}

export function resolveLearnerMode(params: {
    storedMode?: string | null;
    enrollmentCount: number;
}): LearnerMode {
    const normalizedStoredMode = normalizeLearnerMode(params.storedMode);
    if (normalizedStoredMode) {
        return normalizedStoredMode;
    }

    return "classroom";
}

export function buildIndependentLearnerWhere(): Prisma.UserWhereInput {
    return {
        OR: [
            {
                preferences: {
                    is: {
                        learnerMode: "independent",
                    },
                },
            },
            {
                classes: {
                    none: {},
                },
            },
        ],
    };
}
