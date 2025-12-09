export type ActivityProgressStatus = "in_progress" | "completed";

export async function saveActivityProgress(activityId: string, progress: number, status?: ActivityProgressStatus) {
    if (!activityId) return;
    const value = Math.max(0, Math.min(100, Math.round(progress)));
    const finalStatus: ActivityProgressStatus = status ?? (value >= 100 ? "completed" : "in_progress");

    try {
        await fetch("/api/activity/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activityId, progress: value, status: finalStatus }),
        });
    } catch {
        // best-effort; silent fail
    }
}


