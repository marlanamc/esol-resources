import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";

export const E2E_CLASS_CODE = "E2ETEST";

export type TeachClassOption = {
    id: string;
    name: string;
    code: string;
    teacherId: string;
};

function sortTeachClasses(classes: TeachClassOption[], userId: string): TeachClassOption[] {
    return [...classes].sort((a, b) => {
        const aOwn = a.teacherId === userId ? 0 : 1;
        const bOwn = b.teacherId === userId ? 0 : 1;
        if (aOwn !== bOwn) return aOwn - bOwn;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
}

export async function listTeachClasses(userId: string, admin: boolean): Promise<TeachClassOption[]> {
    const classes = await withPrismaReadRetry(() =>
        prisma.class.findMany({
            where: {
                code: { not: E2E_CLASS_CODE },
                ...(admin ? {} : { teacherId: userId }),
            },
            select: { id: true, name: true, code: true, teacherId: true },
        })
    );

    return sortTeachClasses(classes, userId);
}

export async function resolveTeachClassId(
    userId: string,
    admin: boolean,
    classId?: string | null
): Promise<{ classId: string | null; classes: TeachClassOption[] }> {
    const classes = await listTeachClasses(userId, admin);

    if (classId) {
        const selected = classes.find((cls) => cls.id === classId);
        if (selected) return { classId: selected.id, classes };
    }

    return { classId: classes[0]?.id ?? null, classes };
}
