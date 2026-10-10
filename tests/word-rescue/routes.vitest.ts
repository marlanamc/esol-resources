import { beforeEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const mocks = vi.hoisted(() => ({ session: vi.fn(), activity: vi.fn(), progress: vi.fn(), assignment: vi.fn(), save: vi.fn(), collections: vi.fn() }));
vi.mock('@/lib/word-rescue/access', () => ({ getRescueCollectionsForUser: mocks.collections }));
vi.mock('next-auth', () => ({ getServerSession: mocks.session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { activity: { findUnique: mocks.activity }, activityProgress: { findFirst: mocks.progress }, assignment: { findFirst: mocks.assignment } } }));
vi.mock('@/lib/word-rescue/save', () => ({ saveRescueAction: mocks.save }));
import { GET, POST } from '@/app/api/word-rescue/route';
const request = (body: unknown) => new NextRequest('http://localhost/api/word-rescue', { method: 'POST', body: JSON.stringify(body) });
beforeEach(() => {
  vi.clearAllMocks(); mocks.collections.mockResolvedValue([{id:'everyday',wordIds:['through']},{id:'sep-w1',wordIds:['sep-w1-word']}]); mocks.session.mockResolvedValue({ user: { id: 'student', role: 'student' } });
  mocks.activity.mockResolvedValue({ isReleased: true }); mocks.progress.mockResolvedValue(null);
  mocks.assignment.mockResolvedValue(null); mocks.save.mockResolvedValue({ pointsAwarded: 0 });
});
it('requires login and blocks unreleased student access', async () => {
  mocks.session.mockResolvedValue(null); expect((await GET()).status).toBe(403);
  mocks.session.mockResolvedValue({ user: { id: 'student', role: 'student' } });
  mocks.activity.mockResolvedValue({ isReleased: false }); expect((await GET()).status).toBe(403);
  expect(mocks.progress).not.toHaveBeenCalled();
});
it('rejects malformed actions without calling the writer', async () => {
  for (const body of [null, {}, { action: { type: 'finish', points: 100 } }]) expect((await POST(request(body))).status).toBe(400);
  expect(mocks.save).not.toHaveBeenCalled();
});
it('checks assignment membership before writing', async () => {
  const response = await POST(request({ assignmentId: 'someone-elses-assignment', action: { type: 'language', language: 'es' } }));
  expect(response.status).toBe(403); expect(mocks.save).not.toHaveBeenCalled();
});
it('uses the signed-in user, not a client-supplied identity', async () => {
  await POST(request({ userId: 'other-student', action: { type: 'language', language: 'pt-BR' } }));
  expect(mocks.save).toHaveBeenCalledWith('student', { type: 'language', language: 'pt-BR' }, null, new Set(['through', 'sep-w1-word']));
});

it('returns only available collections to the picker', async () => {
  const response = await GET();
  expect((await response.json()).collections.map((set: {id:string}) => set.id)).toEqual(['everyday','sep-w1']);
});
it('blocks direct starts and word events for unreleased weeks', async () => {
  const id = '00000000-0000-4000-8000-000000000001';
  for (const action of [
    {type:'start',id,collectionId:'oct-w2'},
    {type:'heard',sessionId:id,wordId:'oct-w2-depart',clip:'word'},
    {type:'finish',sessionId:id,wordId:'oct-w2-depart',confidence:'easier'},
  ]) expect((await POST(request({action}))).status).toBe(403);
  expect(mocks.save).not.toHaveBeenCalled();
});
