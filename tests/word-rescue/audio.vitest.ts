import { beforeEach, afterEach, expect, it, vi } from 'vitest';
const hooks = vi.hoisted(() => ({ values: [] as unknown[], cleanups: [] as (()=>void)[] }));
vi.mock('react', () => ({
 useRef: (value: unknown) => ({current:value}),
 useCallback: (fn: unknown) => fn,
 useState: (value: unknown) => {const index=hooks.values.length;hooks.values.push(value);return [value,(next:unknown)=>{hooks.values[index]=next;}];},
 useEffect: (fn:()=>()=>void) => hooks.cleanups.push(fn()),
}));
import { useRescueAudio } from '@/components/games/WordRescue/useRescueAudio';
class Player {
 static instances: Player[]=[];
 playbackRate=1;preservesPitch=false;onended:(()=>void)|null=null;onerror:(()=>void)|null=null;
 pause=vi.fn();play=vi.fn(async()=>{});
 constructor(public url:string){Player.instances.push(this);}
}
beforeEach(()=>{
 hooks.values=[];hooks.cleanups=[];Player.instances=[];
 vi.stubGlobal('window',{speechSynthesis:{cancel:vi.fn()}});
 vi.stubGlobal('Audio',Player);
 vi.stubGlobal('navigator',{mediaDevices:{getUserMedia:vi.fn()}});
});
afterEach(()=>{hooks.cleanups.forEach(fn=>fn());vi.unstubAllGlobals();vi.restoreAllMocks();});
it('preserves pitch at 0.7 and stops previous audio without counting it as a completed listen',async()=>{
 const hook=useRescueAudio();const ended=vi.fn();
 await hook.play('word.mp3',0.7,ended);
 const first=Player.instances[0];expect(first.playbackRate).toBe(0.7);expect(first.preservesPitch).toBe(true);
 await hook.play('sentence.mp3',1,ended);
 expect(first.pause).toHaveBeenCalled();expect(first.onended).toBeNull();expect(ended).not.toHaveBeenCalled();
 Player.instances[1].onended!();expect(ended).toHaveBeenCalledTimes(1);
});
it('handles denied microphone access without blocking spoken practice',async()=>{
 vi.stubGlobal('MediaRecorder',class {});
 vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(new Error('denied'));
 const hook=useRescueAudio();await hook.record();
 expect(hooks.values[1]).toBe(false);expect(hooks.values[2]).toBe(false);
 expect(hooks.values[4]).toContain('your practice still counts');
});
it('keeps recordings local, releases microphone tracks, and revokes playback URLs on reset',async()=>{
 const track={stop:vi.fn()};
 vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue({getTracks:()=>[track]} as unknown as MediaStream);
 class Recorder {
  state='inactive';mimeType='audio/webm';ondataavailable:((e:{data:Blob})=>void)|null=null;onstop:(()=>void)|null=null;onerror:(()=>void)|null=null;
  start(){this.state='recording';}
  stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['local audio'])});this.onstop?.();}
 }
 vi.stubGlobal('MediaRecorder',Recorder);
 const create=vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:local-recording');
 const revoke=vi.spyOn(URL,'revokeObjectURL').mockImplementation(()=>{});
 const network=vi.fn();vi.stubGlobal('fetch',network);
 const hook=useRescueAudio();await hook.record();hook.stopRecording();
 expect(track.stop).toHaveBeenCalled();expect(create).toHaveBeenCalled();expect(hooks.values[3]).toBe(true);
 hook.listenToMe();expect(Player.instances[0].url).toBe('blob:local-recording');
 hook.reset();expect(revoke).toHaveBeenCalledWith('blob:local-recording');expect(network).not.toHaveBeenCalled();
});
