import { beforeEach, afterEach, expect, it, vi } from 'vitest';
vi.mock('@/lib/submissionOutbox', () => ({ submitWithOutbox: vi.fn() }));
import { saveDraft, loadDraft, clearDraft, type DraftData } from '@/lib/speakingSubmissions';
import { setActiveLearnerId } from '@/lib/learner-session';
const draft: Omit<DraftData, 'lastSaved'> = { activityId: 'a', selectedPromptIds: ['p'], solo: { sentences: ['private', '', ''], followUpQuestions: ['', ''], completedStepIds: [] }, speaking: { bestSentence: '', completedStepIds: [] } };
let storage: Map<string, string>;
beforeEach(() => {
 storage = new Map(); vi.stubGlobal('window', {});
 vi.stubGlobal('localStorage', { setItem: (k: string,v: string) => storage.set(k,v), getItem: (k: string) => storage.get(k) ?? null, removeItem: (k: string) => storage.delete(k) });
 setActiveLearnerId('A');
});
afterEach(() => { vi.unstubAllGlobals(); setActiveLearnerId(null); });
it('isolates account drafts and preserves them across sign-out', () => {
 saveDraft(draft); setActiveLearnerId(null); expect(loadDraft('a')).toBeNull();
 setActiveLearnerId('B'); expect(loadDraft('a')).toBeNull(); saveDraft({ ...draft, selectedPromptIds: ['B'] });
 clearDraft('a'); setActiveLearnerId('A'); expect(loadDraft('a')?.selectedPromptIds).toEqual(['p']);
});
it('does not expose legacy drafts or collide on delimiter-containing identifiers', () => {
 storage.set('speaking-warmup-draft-a-no-assignment', JSON.stringify(draft));
 expect(loadDraft('a')).toBeNull();
 saveDraft({ ...draft, activityId: 'a-b', assignmentId: 'c' });
 expect(loadDraft('a', 'b-c')).toBeNull();
});
it('captured ownership clears only the submitting account after a switch', () => {
 saveDraft(draft); setActiveLearnerId('B'); saveDraft(draft);
 clearDraft('a', null, 'A'); expect(loadDraft('a')).not.toBeNull();
 setActiveLearnerId('A'); expect(loadDraft('a')).toBeNull();
});
