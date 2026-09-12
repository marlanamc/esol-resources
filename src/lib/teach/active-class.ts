import { cookies } from "next/headers";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { TEACH_CLASS_COOKIE } from "@/lib/teach/active-class-shared";

export { TEACH_CLASS_COOKIE };

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

/**
 * Resolves the active teaching class, preferring an explicit `?classId=` over
 * the remembered cookie, then falling back to the teacher's first class.
 */
export async function resolveTeachClassId(
    userId: string,
    admin: boolean,
    classId?: string | null
): Promise<{ classId: string | null; classes: TeachClassOption[] }> {
    const [classes, cookieStore] = await Promise.all([
        listTeachClasses(userId, admin),
        cookies(),
    ]);

    const candidates = [classId, cookieStore.get(TEACH_CLASS_COOKIE)?.value];
    for (const candidate of candidates) {
        if (!candidate) continue;
        const selected = classes.find((cls) => cls.id === candidate);
        if (selected) return { classId: selected.id, classes };
    }

    return { classId: classes[0]?.id ?? null, classes };
}
