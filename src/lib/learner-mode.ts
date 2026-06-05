import type { Prisma, PrismaClient } from "@prisma/client";

export const LEARNER_MODE_VALUES = ["classroom", "independent"] as const;

export type LearnerMode = (typeof LEARNER_MODE_VALUES)[number];

export const ACTIVE_ENROLLMENT_STATUS = "active" as const;
export const EXITED_ENROLLMENT_STATUS = "exited" as const;
export const GRADUATED_ENROLLMENT_STATUS = "graduated" as const;

export type LearnerState =
    | {
        mode: "classroom";
        activeClassIds: string[];
        primaryClassId: string;
    }
    | {
        mode: "independent";
        activeClassIds: [];
        primaryClassId: null;
    };

type ActiveEnrollmentInput = {
    classId: string;
    joinedAt?: Date | string | null;
};

type PrismaReader = Pick<PrismaClient, "classEnrollment">;

export function resolveLearnerStateFromActiveEnrollments(
    enrollments: ActiveEnrollmentInput[]
): LearnerState {
    if (enrollments.length === 0) {
        return {
            mode: "independent",
            activeClassIds: [],
            primaryClassId: null,
        };
    }

    const sortedEnrollments = [...enrollments].sort((a, b) => {
        const aTime = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
        const bTime = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
        return bTime - aTime;
    });
    const activeClassIds = Array.from(new Set(sortedEnrollments.map((entry) => entry.classId)));

    return {
        mode: "classroom",
        activeClassIds,
        primaryClassId: activeClassIds[0],
    };
}

export async function getLearnerState(prisma: PrismaReader, userId: string): Promise<LearnerState> {
    const activeEnrollments = await prisma.classEnrollment.findMany({
        where: {
            studentId: userId,
            status: ACTIVE_ENROLLMENT_STATUS,
        },
        select: {
            classId: true,
            joinedAt: true,
        },
        orderBy: { joinedAt: "desc" },
    });

    return resolveLearnerStateFromActiveEnrollments(activeEnrollments);
}

export function buildIndependentLearnerWhere(): Prisma.UserWhereInput {
    return {
        classes: {
            none: {
                status: ACTIVE_ENROLLMENT_STATUS,
            },
        },
    };
}

export function buildClassroomLearnerWhere(): Prisma.UserWhereInput {
    return {
        classes: {
            some: {
                status: ACTIVE_ENROLLMENT_STATUS,
            },
        },
    };
}
