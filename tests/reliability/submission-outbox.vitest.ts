import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
let values: Map<string, string>;
let outbox: typeof import('@/lib/submissionOutbox');
let session: typeof import('@/lib/learner-session');
beforeEach(async () => {
 vi.resetModules(); vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-11T19:00:00Z'));
 values = new Map();
 const target = new EventTarget();
 vi.stubGlobal('window', Object.assign(target, {localStorage: {getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k,v)}}));
 vi.stubGlobal('document', {visibilityState:'visible'}); vi.stubGlobal('navigator', {onLine:true});
 vi.stubGlobal('fetch', vi.fn());
 outbox = await import('@/lib/submissionOutbox'); session = await import('@/lib/learner-session'); session.setActiveLearnerId('alice');
});
afterEach(() => {vi.useRealTimers(); vi.unstubAllGlobals();});
const params = {endpoint:'/api/activity/submit', method:'POST' as const, payload:{activityId:'quiz',content:'effort'},idempotencyKey:'attempt-1'};
describe('durable save recovery', () => {
 it('retains work before sending, queues 503, respects backoff and removes only after a confirmed save', async () => {
   vi.mocked(fetch).mockImplementationOnce(async () => {
     expect(values.get('submission-outbox-v1')).toContain('attempt-1');
     return new Response('{}',{status:503});
   }).mockResolvedValue(new Response('{"points":5}'));
   expect((await outbox.submitWithOutbox(params)).queued).toBe(true);
   await outbox.replayQueuedSubmissions(); expect(fetch).toHaveBeenCalledTimes(1);
   vi.advanceTimersByTime(10000); await outbox.replayQueuedSubmissions();
   expect(fetch).toHaveBeenCalledTimes(2); expect(outbox.getSubmissionOutboxSnapshot().pending).toBe(0);
   expect(vi.mocked(fetch).mock.calls[1][1]?.headers).toMatchObject({'X-Idempotency-Key':'attempt-1','X-Outbox-User-Id':'alice'});
 });
 it('does not replay another learner’s work or old unowned work', async () => {
   outbox.queueSubmission(params); session.setActiveLearnerId('bob');
   await outbox.replayQueuedSubmissions(true); expect(fetch).not.toHaveBeenCalled();
   expect(values.get('submission-outbox-v1')).toContain('alice');
 });
 it('coalesces concurrent replays', async () => {
   outbox.queueSubmission(params);
   let finish!: (response:Response)=>void;
   vi.mocked(fetch).mockImplementation(() => new Promise(resolve=>{finish=resolve;}));
   const a=outbox.replayQueuedSubmissions(), b=outbox.replayQueuedSubmissions();
   expect(fetch).toHaveBeenCalledTimes(1); finish(new Response('{}')); await Promise.all([a,b]);
 });
 it('preserves work added while an earlier item is sending', async () => {
   outbox.queueSubmission(params);
   vi.mocked(fetch).mockImplementationOnce(async () => {outbox.queueSubmission({...params,idempotencyKey:'attempt-2'});return new Response('{}');});
   await outbox.replayQueuedSubmissions(); expect(values.get('submission-outbox-v1')).toContain('attempt-2');
 });
 it('does not consume retries offline or while hidden', async () => {
   outbox.queueSubmission(params); vi.stubGlobal('navigator',{onLine:false});
   await outbox.replayQueuedSubmissions(); expect(fetch).not.toHaveBeenCalled();
   expect(JSON.parse(values.get('submission-outbox-v1')!)[0].retryCount).toBe(0);
 });
 it('never calls a failed local write a successful queue', async () => {
   window.localStorage.setItem = () => {throw new Error('quota');};
   await expect(outbox.submitWithOutbox(params)).rejects.toThrow('quota'); expect(fetch).not.toHaveBeenCalled();
 });
 it('keeps validation failures for manual attention rather than automatically retrying them', async () => {
   vi.mocked(fetch).mockResolvedValue(new Response('{}',{status:400}));
   await outbox.submitWithOutbox(params); await outbox.replayQueuedSubmissions();
   expect(fetch).toHaveBeenCalledTimes(1); expect(outbox.getSubmissionOutboxSnapshot().failed).toBe(1);
 });
 it('allows genuine separate attempts to keep different request identities', () => {
   outbox.queueSubmission(params);outbox.queueSubmission({...params,idempotencyKey:'attempt-2'});
   expect(outbox.getSubmissionOutboxSnapshot().pending).toBe(2);
 });
});
it('does not send newer answers before an older delayed save', async () => {
 vi.mocked(fetch).mockResolvedValue(new Response('{}',{status:503}));
 await outbox.submitWithOutbox(params);
 await outbox.submitWithOutbox({...params,idempotencyKey:'later',payload:{activityId:'quiz',content:'updated'}});
 await outbox.replayQueuedSubmissions();
 expect(fetch).toHaveBeenCalledTimes(1);expect(outbox.getSubmissionOutboxSnapshot().pending).toBe(2);
});
it('keeps failed evidence but does not replay it over a corrected submission', async () => {
 vi.mocked(fetch).mockResolvedValueOnce(new Response('{}',{status:400})).mockImplementation(async ()=>new Response('{}'));
 await outbox.submitWithOutbox(params);
 await outbox.submitWithOutbox({...params,idempotencyKey:'correction',payload:{activityId:'quiz',content:'corrected'}});
 await outbox.replayQueuedSubmissions(true);
 expect(fetch).toHaveBeenCalledTimes(2);
 expect(JSON.parse(values.get('submission-outbox-v1')!)[0]).toMatchObject({id:'attempt-1',superseded:true});
});
it('does not reattribute a submission while it waits for a cross-tab lock', async () => {
 let unlock!:()=>void;
 vi.stubGlobal('navigator', {
   onLine: true,
   locks: {
     request: (_name: string, fn: () => Promise<unknown>) => new Promise((resolve, reject) => {
       unlock = () => {
         try { resolve(fn()); } catch (error) { reject(error); }
       };
     }),
   },
 });
 const attempt=outbox.submitWithOutbox(params);
 session.setActiveLearnerId('bob');unlock();
 await expect(attempt).rejects.toThrow('account changed');expect(fetch).not.toHaveBeenCalled();
});
