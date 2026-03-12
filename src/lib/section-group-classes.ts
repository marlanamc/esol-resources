type ClassReader = {
    class: {
        findMany: (args: {
            where: Record<string, unknown>;
            select: { id: true; sectionGroupId?: true };
        }) => Promise<Array<{ id: string; sectionGroupId?: string | null }>>;
    };
};

export async function expandClassIdsToSectionGroupIds(
    prismaClient: ClassReader,
    classIds: string[]
): Promise<string[]> {
    const uniqueClassIds = Array.from(new Set(classIds));
    if (uniqueClassIds.length === 0) return [];

    const classes = await prismaClient.class.findMany({
        where: { id: { in: uniqueClassIds } },
        select: { id: true, sectionGroupId: true },
    });

    const sectionGroupIds = Array.from(
        new Set(
            classes
                .map((item) => item.sectionGroupId)
                .filter((groupId): groupId is string => Boolean(groupId))
        )
    );

    if (sectionGroupIds.length === 0) {
        return uniqueClassIds;
    }

    const siblingClasses = await prismaClient.class.findMany({
        where: { sectionGroupId: { in: sectionGroupIds } },
        select: { id: true },
    });

    return Array.from(new Set([...uniqueClassIds, ...siblingClasses.map((item) => item.id)]));
}
