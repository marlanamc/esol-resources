import { afterEach, expect, it, vi } from 'vitest';
import { isWarmupCompleted, completeWarmup } from '@/lib/speaking-warmup-client';
afterEach(() => vi.unstubAllGlobals());
it('loads the canonical endpoint and top-level completion status with escaped scope', async () => {
 const fetcher = vi.fn().mockResolvedValue(Response.json({ status: 'completed', progress: 100 }));
 vi.stubGlobal('fetch', fetcher);
 expect(await isWarmupCompleted('a&b', 'c d')).toBe(true);
 expect(fetcher.mock.calls[0][0]).toBe('/api/activity/progress?activityId=a%26b&assignmentId=c+d');
});
it('returns confirmed points for the toast and refreshes progress', async () => {
 const dispatchEvent = vi.fn(); vi.stubGlobal('window', { dispatchEvent });
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: true, pointsAwarded: 3 })));
 expect(await completeWarmup('a')).toBe(3);
 expect(dispatchEvent.mock.calls[0][0].type).toBe('activity-progress-updated');
});
it('does not invent points on duplicate completion or confirm failed saves', async () => {
 const dispatchEvent = vi.fn(); vi.stubGlobal('window', { dispatchEvent });
 vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(Response.json({ success: true, alreadyCompleted: true, pointsAwarded: 0 })).mockResolvedValueOnce(Response.json({ error: 'Retry' }, { status: 500 })));
 expect(await completeWarmup('a')).toBe(0);
 await expect(completeWarmup('a')).rejects.toThrow('Retry');
 expect(dispatchEvent).toHaveBeenCalledTimes(1);
});
