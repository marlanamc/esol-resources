/** Legacy monthly unit-card rows superseded by weekly vocab IDs (vocab-sep-w1, etc.). */
export const LEGACY_MONTHLY_VOCAB_UNIT_IDS = new Set([
    "vocab-september",
    "vocab-october",
    "vocab-november",
    "vocab-december",
    "vocab-january",
]);

type ActivityIdRow = { id: string };

/** Drop retired monthly vocab cards so teachers see the current weekly catalog. */
export function filterTeacherBrowsableActivities<T extends ActivityIdRow>(activities: T[]): T[] {
    return activities.filter((activity) => !LEGACY_MONTHLY_VOCAB_UNIT_IDS.has(activity.id));
}

export function buildTeacherActivitiesWhere() {
    return { deletedAt: null } as const;
}
