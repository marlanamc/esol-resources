import { beforeEach, expect, it, vi } from 'vitest';
const visibleMap = vi.hoisted(() => vi.fn());
vi.mock('@/lib/course-map', () => ({ getVisibleMap: visibleMap }));
import { getRescueCollectionsForUser } from '@/lib/word-rescue/access';
import { RESCUE_COLLECTIONS } from '@/lib/word-rescue/content';
import { applyRescueAction, emptyRescueProgress } from '@/lib/word-rescue/progression';
beforeEach(() => vi.clearAllMocks());
it('limits students to map-visible vocabulary weeks and everyday practice', async () => {
  visibleMap.mockResolvedValue({ units: [{levels:[{requiredActivities:[{activityId:'vocab-sep-w1'}]}]}] });
  expect((await getRescueCollectionsForUser({id:'student',role:'student'})).map(set => set.id)).toEqual(['everyday','sep-w1']);
});
it('keeps everyday practice when no weeks are released', async () => {
  visibleMap.mockResolvedValue({units:[]});
  expect((await getRescueCollectionsForUser({id:'student',role:'student'})).map(set => set.id)).toEqual(['everyday']);
});
it('lets teachers inspect the complete catalogue', async () => {
  expect(await getRescueCollectionsForUser({id:'teacher',role:'teacher'})).toEqual(RESCUE_COLLECTIONS);
  expect(visibleMap).not.toHaveBeenCalled();
});
it('does not reintroduce unreleased words through Practice again', () => {
  const state = emptyRescueProgress();
  const permitted = RESCUE_COLLECTIONS[0].wordIds[0];
  const locked = RESCUE_COLLECTIONS[1].wordIds[0];
  state.words = {[permitted]:{confidence:'again',attempts:1},[locked]:{confidence:'again',attempts:1}};
  const next = applyRescueAction(state,{type:'start',id:'00000000-0000-4000-8000-000000000001',collectionId:'again'},new Set([permitted]));
  expect(next.state.session?.wordIds).toEqual([permitted]);
  expect(next.state.words[locked]).toEqual(state.words[locked]);
});
it('preserves a withdrawn unfinished session but allows new practice after a completed session', () => {
  const state = emptyRescueProgress();
  const locked = RESCUE_COLLECTIONS[1].wordIds[0];
  const allowed = new Set(RESCUE_COLLECTIONS[0].wordIds);
  state.session = { id:'00000000-0000-4000-8000-000000000001',collectionId:'sep-w1',wordIds:[locked],index:0,heard:['word'],said:false,finished:{} };
  const action = {type:'start',id:'00000000-0000-4000-8000-000000000002',collectionId:'everyday'};
  expect(() => applyRescueAction(state,{...action,collectionId:'sep-w1'},allowed)).toThrow('not currently released');
  expect(state.session.heard).toEqual(['word']);
  const switched = applyRescueAction(state,action,allowed).state;
  expect(switched.savedSessions?.['sep-w1']).toEqual(state.session);
  state.session.index = 1;
  expect(applyRescueAction(state,action,allowed).state.session?.collectionId).toBe('everyday');
});
it('keeps later Word Rescue sets unavailable even when an older class has all map weeks revealed', async () => {
  visibleMap.mockResolvedValue({units:[{levels:[{requiredActivities:RESCUE_COLLECTIONS.map(set=>({activityId:set.sourceActivityId}))}]}]});
  expect((await getRescueCollectionsForUser({id:'student',role:'student'})).map(set=>set.id)).toEqual(['everyday','sep-w1','sep-w2','sep-w4','oct-learning']);
});
