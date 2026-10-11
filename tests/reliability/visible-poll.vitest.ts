import { beforeEach, afterEach, it, vi, expect } from 'vitest';
import { startVisiblePoll } from '@/lib/visible-poll';
beforeEach(() => {
 vi.useFakeTimers();vi.spyOn(Math,'random').mockReturnValue(0);
 vi.stubGlobal('document',Object.assign(new EventTarget(),{visibilityState:'visible'}));
 vi.stubGlobal('window',new EventTarget());vi.stubGlobal('navigator',{onLine:true});
});
afterEach(()=>{vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals();});
it('never overlaps requests and pauses while hidden', async () => {
 let finish!:()=>void;
 const poll=vi.fn(()=>new Promise<void>(resolve=>{finish=resolve;}));const stop=startVisiblePoll(poll);
 await vi.advanceTimersByTimeAsync(12000);expect(poll).toHaveBeenCalledTimes(1);
 finish();await vi.advanceTimersByTimeAsync(0);
 Object.assign(document,{visibilityState:'hidden'});document.dispatchEvent(new Event('visibilitychange'));
 await vi.advanceTimersByTimeAsync(12000);expect(poll).toHaveBeenCalledTimes(1);
 Object.assign(document,{visibilityState:'visible'});document.dispatchEvent(new Event('visibilitychange'));
 await vi.advanceTimersByTimeAsync(3000);expect(poll).toHaveBeenCalledTimes(2);stop();finish();
});
it('backs off failures and stops finished sessions', async () => {
 const poll=vi.fn().mockRejectedValueOnce(new Error('503')).mockResolvedValue(false); const stop=startVisiblePoll(poll);
 await vi.advanceTimersByTimeAsync(3000);expect(poll).toHaveBeenCalledTimes(1);
 await vi.advanceTimersByTimeAsync(3000);expect(poll).toHaveBeenCalledTimes(2);
 await vi.advanceTimersByTimeAsync(60000);expect(poll).toHaveBeenCalledTimes(2);stop();
});
