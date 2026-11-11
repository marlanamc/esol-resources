type Score = { userId: string; activityId: string; score: number | null };

export function gradebookAverages(submissions: Score[], studentIds: string[], activityIds: string[]) {
    const students = new Set(studentIds);
    const activities = new Set(activityIds);
    const best = new Map<string, Score>();
    for (const row of submissions) {
        if (!students.has(row.userId) || !activities.has(row.activityId) || row.score === null) continue;
        const key = `${row.userId}:${row.activityId}`;
        if (row.score > (best.get(key)?.score ?? -1)) best.set(key, row);
    }
    const scores = new Map<string, number[]>();
    for (const row of best.values()) scores.set(row.userId, [...(scores.get(row.userId) ?? []), row.score!]);
    const studentAverages = Object.fromEntries([...scores].map(([id, values]) => [id, values.reduce((a, b) => a + b, 0) / values.length]));
    const values = Object.values(studentAverages);
    return { studentAverages, classAverage: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null };
}
