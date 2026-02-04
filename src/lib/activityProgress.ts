export type ActivityProgressStatus = "in_progress" | "completed" | "submitted";

export interface ActivityProgressResult {
    ok: boolean;
    progress: number;
    status: string;
    pointsAwarded?: number;
}

export async function saveActivityProgress(
    activityId: string,
    progress: number,
    status?: ActivityProgressStatus,
    accuracy?: number,
    category?: string,
    assignmentId?: string | null
): Promise<ActivityProgressResult | null> {
    if (!activityId) return null;
    const value = Math.max(0, Math.min(100, Math.round(progress)));
    const finalStatus: ActivityProgressStatus = status ?? (value >= 100 ? "completed" : "in_progress");

    try {
        const response = await fetch("/api/activity/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                activityId,
                progress: value,
                status: finalStatus,
                accuracy: accuracy !== undefined ? Math.max(0, Math.min(100, Math.round(accuracy))) : undefined,
                category: category,
                assignmentId: assignmentId ?? undefined
            }),
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch {
        // best-effort; silent fail
        return null;
    }
}
