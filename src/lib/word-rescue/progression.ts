import { z } from 'zod';
import { RESCUE_COLLECTIONS, RESCUE_WORD_BY_ID } from './content';
import type { RescueAction, RescueProgress } from './types';

const target = { sessionId: z.string().uuid(), wordId: z.string().min(1).max(150) };
export const rescueActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('start'), id: z.string().uuid(), collectionId: z.string().max(80) }).strict(),
  z.object({ type: z.literal('language'), language: z.enum(['es', 'pt-BR']) }).strict(),
  z.object({ type: z.literal('heard'), ...target, clip: z.enum(['word', 'phrase', 'sentence']) }).strict(),
  z.object({ type: z.literal('said'), ...target }).strict(),
  z.object({ type: z.literal('finish'), ...target, confidence: z.enum(['easier', 'again']) }).strict(),
]);

export const emptyRescueProgress = (): RescueProgress => ({ version: 1, language: 'es', words: {}, session: null });
export function readRescueProgress(categoryData: string | null | undefined): RescueProgress {
  try {
    const value = JSON.parse(categoryData ?? '{}').wordRescue;
    return value?.version === 1 && value.words && typeof value.words === 'object' ? value : emptyRescueProgress();
  } catch { return emptyRescueProgress(); }
}

/** Same pure transition is used by the server and the explicitly unscored preview. */
export function applyRescueAction(previous: RescueProgress, raw: unknown, allowedWordIds?: ReadonlySet<string>): { state: RescueProgress; rewardKey: string | null } {
  const action: RescueAction = rescueActionSchema.parse(raw);
  const state: RescueProgress = structuredClone(previous);
  if (action.type === 'language') {
    state.language = action.language;
    return { state, rewardKey: null };
  }
  if (action.type === 'start') {
    // A course-map wrapper can switch weeks without discarding unfinished effort.
    const active = state.session && state.session.index < state.session.wordIds.length ? state.session : null;
    const resume = active?.collectionId === action.collectionId ? active : state.savedSessions?.[action.collectionId];
    if (resume && allowedWordIds && resume.wordIds.some(id => !allowedWordIds.has(id))) {
      throw new Error('Your saved session belongs to a week that is not currently released.');
    }
    if (state.session?.id === action.id) return { state, rewardKey: null };
    if (active && active.collectionId !== action.collectionId) {
      state.savedSessions = { ...state.savedSessions, [active.collectionId]: active };
    }
    if (resume) {
      state.session = resume;
      if (state.savedSessions) delete state.savedSessions[action.collectionId];
      return { state, rewardKey: null };
    }
    const ids = action.collectionId === 'again'
      ? Object.keys(state.words).filter(id => state.words[id].confidence === 'again' && RESCUE_WORD_BY_ID[id] && (!allowedWordIds || allowedWordIds.has(id)))
      : RESCUE_COLLECTIONS.find(collection => collection.id === action.collectionId)?.wordIds;
    if (allowedWordIds && ids?.some(id => !allowedWordIds.has(id))) throw new Error('This week is not released.');
    if (!ids?.length) throw new Error('Choose a collection with words to practice.');
    const wordIds = [...ids].sort((a, b) => (state.words[a]?.attempts ?? 0) - (state.words[b]?.attempts ?? 0)).slice(0, 3);
    state.session = { id: action.id, collectionId: action.collectionId, wordIds, index: 0, heard: [], said: false, finished: {} };
    return { state, rewardKey: null };
  }
  if (allowedWordIds && !allowedWordIds.has(action.wordId)) throw new Error('This week is not released.');
  const session = state.session;
  if (!session || session.id !== action.sessionId) throw new Error('This session changed. Reload to resume your saved practice.');
  if (session.finished[action.wordId]) {
    // Confidence changes/retries on a completed word never become a new attempt.
    return { state, rewardKey: action.type === 'finish' ? `${session.id}:${action.wordId}` : null };
  }
  if (session.wordIds[session.index] !== action.wordId) throw new Error('Finish the current word first.');
  if (action.type === 'heard') {
    if (!session.heard.includes(action.clip)) session.heard.push(action.clip);
  } else if (action.type === 'said') {
    if (!session.heard.includes('word') || !session.heard.includes('sentence')) throw new Error('Listen to the word and sentence first.');
    session.said = true;
  } else {
    if (!session.said || !session.heard.includes('word') || !session.heard.includes('sentence')) throw new Error('Listen and try saying the sentence before saving.');
    session.finished[action.wordId] = action.confidence;
    state.words[action.wordId] = { confidence: action.confidence, attempts: (state.words[action.wordId]?.attempts ?? 0) + 1 };
    session.index += 1;
    session.heard = [];
    session.said = false;
    return { state, rewardKey: `${session.id}:${action.wordId}` };
  }
  return { state, rewardKey: null };
}
