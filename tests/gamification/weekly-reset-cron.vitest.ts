import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import config from '../../vercel.json';
const reset = vi.hoisted(() => vi.fn());
vi.mock('@/lib/gamification/gamification', () => ({ resetWeeklyPoints: reset }));
import { GET } from '@/app/api/cron/reset-weekly-points/route';
beforeEach(() => { vi.useFakeTimers(); vi.stubEnv('CRON_SECRET', 'test'); reset.mockReset(); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
it.each(['2026-10-26T05:00:00Z', '2026-11-09T05:00:00Z', '2026-10-26T05:59:00Z'])('refreshes on Monday in both DST offsets and with scheduler delay: %s', async date => {
 vi.setSystemTime(new Date(date));
 const response = await GET(new NextRequest('https://example.test/api/cron/reset-weekly-points', { headers: { authorization: 'Bearer test' } }));
 expect(response.status).toBe(200); expect(reset).toHaveBeenCalledWith(new Date(date));
});
it('uses only one scheduled invocation per Monday', () => {
 expect(config.crons.find(cron => cron.path === '/api/cron/reset-weekly-points')?.schedule).toBe('0 5 * * 1');
});
it('rejects unauthenticated requests', async () => {
 expect((await GET(new NextRequest('https://example.test/api/cron/reset-weekly-points'))).status).toBe(401);
 expect(reset).not.toHaveBeenCalled();
});
