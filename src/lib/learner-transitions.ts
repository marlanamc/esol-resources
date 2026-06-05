import type { Prisma, PrismaClient } from "@prisma/client";
import {
    ACTIVE_ENROLLMENT_STATUS,
    EXITED_ENROLLMENT_STATUS,
    GRADUATED_ENROLLMENT_STATUS,
} from "@/lib/learner-mode";

type PrismaWriter = Pick<PrismaClient | Prisma.TransactionClient, "classEnrollment">;

type TransitionArgs = {
    prisma: PrismaWriter;
    studentId: string;
    classId: string;
    note?: string | null;
};

export async function graduateStudentFromClass({
    prisma,
    studentId,
    classId,
    note,
}: TransitionArgs) {
    return prisma.classEnrollment.update({
        where: {
            classId_studentId: {
                classId,
                studentId,
            },
        },
        data: {
            status: GRADUATED_ENROLLMENT_STATUS,
            statusChangedAt: new Date(),
            statusNote: note ?? null,
        },
    });
}

export async function exitStudentFromClass({
    prisma,
    studentId,
    classId,
    note,
}: TransitionArgs) {
    return prisma.classEnrollment.update({
        where: {
            classId_studentId: {
                classId,
                studentId,
            },
        },
        data: {
            status: EXITED_ENROLLMENT_STATUS,
            statusChangedAt: new Date(),
            statusNote: note ?? null,
        },
    });
}

export async function enrollStudentInClass({
    prisma,
    studentId,
    classId,
    note,
}: TransitionArgs) {
    const existingEnrollment = await prisma.classEnrollment.findUnique({
        where: {
            classId_studentId: {
                classId,
                studentId,
            },
        },
        select: {
            id: true,
            status: true,
        },
    });

    if (existingEnrollment) {
        return prisma.classEnrollment.update({
            where: {
                id: existingEnrollment.id,
            },
            data: {
                status: ACTIVE_ENROLLMENT_STATUS,
                statusChangedAt: existingEnrollment.status === ACTIVE_ENROLLMENT_STATUS ? undefined : new Date(),
                statusNote: note ?? null,
                isReturning: existingEnrollment.status !== ACTIVE_ENROLLMENT_STATUS,
            },
        });
    }

    return prisma.classEnrollment.create({
        data: {
            classId,
            studentId,
            status: ACTIVE_ENROLLMENT_STATUS,
            statusChangedAt: new Date(),
            statusNote: note ?? null,
        },
    });
}
