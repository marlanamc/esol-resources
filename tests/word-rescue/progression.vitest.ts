import { describe, expect, it } from 'vitest';
import { applyRescueAction, emptyRescueProgress } from '@/lib/word-rescue/progression';
import { RESCUE_COLLECTIONS, RESCUE_WORD_BY_ID } from '@/lib/word-rescue/content';
import { resolveActivityGameUi, getActivityPoints } from '@/lib/gamification/activity-points';
import type { RescueProgress } from '@/lib/word-rescue/types';

const id = '11111111-1111-4111-8111-111111111111';
function start() { return applyRescueAction(emptyRescueProgress(), { type: 'start', id, collectionId: 'everyday' }).state; }
function ready(state: RescueProgress) {
  const target = { sessionId: state.session!.id, wordId: state.session!.wordIds[state.session!.index] };
  for (const clip of ['word', 'sentence']) state = applyRescueAction(state, { type: 'heard', ...target, clip }).state;
  return applyRescueAction(state, { type: 'said', ...target }).state;
}
describe('Word Rescue effort', () => {
  it.each(['easier', 'again'])('awards either confidence equally after meaningful practice: %s', confidence => {
    const state = ready(start());
    const result = applyRescueAction(state, { type: 'finish', sessionId: id, wordId: 'everyday-through', confidence });
    expect(result.rewardKey).toBe(`${id}:everyday-through`);
    expect(result.state.words['everyday-through']).toEqual({ attempts: 1, confidence });
    expect(state.words).toEqual({});
  });
  it('rejects incomplete practice and words outside the current session', () => {
    expect(() => applyRescueAction(start(), { type: 'finish', sessionId: id, wordId: 'everyday-through', confidence: 'easier' })).toThrow();
    expect(() => applyRescueAction(start(), { type: 'heard', sessionId: id, wordId: 'everyday-achieve', clip: 'word' })).toThrow();
    expect(() => applyRescueAction(start(), { type: 'said', sessionId: id, wordId: 'everyday-through' })).toThrow();
  });
  it('preserves duplicate finish evidence and does not change confidence on retry', () => {
    const action = { type: 'finish', sessionId: id, wordId: 'everyday-through', confidence: 'again' };
    const first = applyRescueAction(ready(start()), action);
    const retry = applyRescueAction(first.state, { ...action, confidence: 'easier' });
    expect(retry).toEqual(first);
  });
  it('resumes an active session instead of replacing it from a second tab', () => {
    const state = ready(start());
    expect(applyRescueAction(state, { type: 'start', id: '22222222-2222-4222-8222-222222222222', collectionId: 'everyday' }).state).toEqual(state);
  });
  it('switches map weeks and resumes the same unfinished attempt with evidence intact', () => {
    const original = ready(start());
    const other = applyRescueAction(original, {type:'start',id:'22222222-2222-4222-8222-222222222222',collectionId:'oct-w2'}).state;
    expect(other.session?.collectionId).toBe('oct-w2');
    expect(other.savedSessions?.everyday).toEqual(original.session);
    const resumed = applyRescueAction(other,{type:'start',id:'33333333-3333-4333-8333-333333333333',collectionId:'everyday'});
    expect(resumed.state.session).toEqual(original.session);
    expect(resumed.rewardKey).toBeNull();
    expect(resumed.state.savedSessions?.['oct-w2']).toEqual(other.session);
  });
  it('creates a new genuine revisit after the completed session', () => {
    let state = start();
    for (let i = 0; i < 3; i++) {
      state = ready(state);
      state = applyRescueAction(state, { type: 'finish', sessionId: id, wordId: state.session!.wordIds[i], confidence: 'again' }).state;
    }
    state = applyRescueAction(state, { type: 'start', id: '22222222-2222-4222-8222-222222222222', collectionId: 'again' }).state;
    state = ready(state);
    const result = applyRescueAction(state, { type: 'finish', sessionId: state.session!.id, wordId: 'everyday-through', confidence: 'easier' });
    expect(result.state.words['everyday-through'].attempts).toBe(2);
    expect(result.rewardKey).not.toBe(`${id}:everyday-through`);
  });
  it('connects every collection to actual words and weekly source identifiers', () => {
    for (const collection of RESCUE_COLLECTIONS) {
      if (collection.id !== 'everyday') expect(collection.sourceActivityId).toBe(`vocab-${collection.id}`);
      for (const wordId of collection.wordIds) expect(RESCUE_WORD_BY_ID[wordId]?.sentence).toBeTruthy();
    }
  });
  it('routes independently and never earns generic completion rewards', () => {
    expect(resolveActivityGameUi({ content: '{"type":"word-rescue"}' })).toBe('word-rescue');
    expect(getActivityPoints('game', { ui: 'word-rescue' })).toBe(0);
  });
});


describe('weekly and standalone round lengths', () => {
  const weeklyStart = { type: 'start', id, collectionId: 'oct-learning', mode: 'weekly' };
  it('uses all six weekly words but three in standalone practice', () => {
    expect(applyRescueAction(emptyRescueProgress(), weeklyStart).state.session?.wordIds).toHaveLength(6);
    expect(applyRescueAction(emptyRescueProgress(), {...weeklyStart, mode: 'standalone'}).state.session?.wordIds).toHaveLength(3);
    expect(() => applyRescueAction(emptyRescueProgress(), {...weeklyStart, collectionId: 'everyday'})).toThrow();
  });
  it('keeps unfinished weekly and standalone rounds separate with their evidence', () => {
    const weekly = ready(applyRescueAction(emptyRescueProgress(), weeklyStart).state);
    const standalone = applyRescueAction(weekly, {...weeklyStart, id: '22222222-2222-4222-8222-222222222222', mode:'standalone'}).state;
    expect(standalone.session?.wordIds).toHaveLength(3);
    const resumed = applyRescueAction(standalone, {...weeklyStart, id:'33333333-3333-4333-8333-333333333333'}).state;
    expect(resumed.session).toEqual(weekly.session);
    expect(resumed.savedSessions?.['oct-learning']).toEqual(standalone.session);
  });
  it('expands a legacy unfinished round and preserves its credited word and next-word evidence', () => {
    let legacy = ready(applyRescueAction(emptyRescueProgress(), {...weeklyStart, mode:'standalone'}).state);
    const wordId = legacy.session!.wordIds[0];
    legacy = applyRescueAction(legacy, {type:'finish',sessionId:id,wordId,confidence:'again'}).state;
    legacy = ready(legacy);
    delete legacy.session!.mode;
    const upgraded = applyRescueAction(legacy,{...weeklyStart,id:'22222222-2222-4222-8222-222222222222'}).state;
    expect(upgraded.session?.wordIds).toHaveLength(6);
    expect(upgraded.session?.id).toBe(id);
    expect(upgraded.session?.index).toBe(1);
    expect(upgraded.session?.said).toBe(true);
    expect(upgraded.words).toEqual(legacy.words);
    expect(applyRescueAction(upgraded,{type:'finish',sessionId:id,wordId,confidence:'again'}).rewardKey).toBe(`${id}:${wordId}`);
  });
});
