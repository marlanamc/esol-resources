import { fetchActivityProgress } from './activityProgress';

export async function isWarmupCompleted(activityId: string, assignmentId?: string | null) {
    return (await fetchActivityProgress(activityId, assignmentId))?.status === 'completed';
}

/** A receipt is returned only after the server confirms completion and credit. */
export async function completeWarmup(activityId: string, assignmentId?: string | null): Promise<number> {
    const response = await fetch('/api/speaking/complete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, assignmentId }),
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) {
        throw new Error(result.error || 'Failed to complete warmup');
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('activity-progress-updated'));
    return typeof result.pointsAwarded === 'number' && result.pointsAwarded > 0 ? result.pointsAwarded : 0;
}
