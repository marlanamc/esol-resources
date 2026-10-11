import { beforeEach, afterEach, it, expect, vi } from 'vitest';
vi.mock('next-auth/react', () => ({useSession: () => ({data:null})}));
let summary: typeof import('@/hooks/useStudentSummary');
beforeEach(async () => {vi.resetModules(); vi.stubGlobal('fetch',vi.fn());summary=await import('@/hooks/useStudentSummary');});
afterEach(()=>vi.unstubAllGlobals());
const confirmed={userId:'alice',totalPoints:343,actualWeeklyPoints:76,effectiveCurrentStreak:2,sevenDayActivity:[true,false,false,false,false,false,false]};
it('preserves confirmed points during server errors and deduplicates reads', async () => {
 vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(confirmed))).mockResolvedValue(new Response('{}',{status:503}));
 const [a,b]=await Promise.all([summary.loadStudentSummary('alice'),summary.loadStudentSummary('alice')]);
 expect(a?.totalPoints).toBe(343);expect(b?.totalPoints).toBe(343);expect(fetch).toHaveBeenCalledTimes(1);
 expect((await summary.loadStudentSummary('alice',true))?.totalPoints).toBe(343);
 await summary.loadStudentSummary('alice',true);expect(fetch).toHaveBeenCalledTimes(2);
});
it('does not show another account’s balance after a session change', async () => {
 vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(confirmed)));
 await summary.loadStudentSummary('alice');
 expect(summary.getFreshStudentSummaryCache('bob')).toBeNull();
 expect(await summary.loadStudentSummary('bob')).toBeNull();
});
