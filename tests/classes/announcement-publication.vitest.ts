import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({ update: vi.fn(), transaction: vi.fn(), findUnique: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: vi.fn().mockResolvedValue({ user: { id: 'teacher-1', role: 'teacher' } }) }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/auth/api-auth', () => ({ requireTeacher: () => ({ ok: true, admin: false, user: { id: 'teacher-1' } }) }));
vi.mock('@/lib/auth/policies', () => ({ canManageClass: () => true }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { class: { findUnique: mocks.findUnique }, $transaction: mocks.transaction } }));
vi.mock('@/lib/api/response', () => ({
    ApiErrors: { notFound: () => Response.json({}, { status: 404 }), forbidden: () => Response.json({}, { status: 403 }) },
    apiError: (error: string, status: number) => Response.json({ error }, { status }),
    handleApiError: () => Response.json({}, { status: 500 }),
}));
import { PATCH } from '@/app/api/classes/[id]/route';
const publish = (body: unknown) => PATCH(new NextRequest('http://localhost/api/classes/class-1', {
    method: 'PATCH', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' },
}), { params: Promise.resolve({ id: 'class-1' }) });

beforeEach(() => {
    vi.clearAllMocks();
    mocks.findUnique.mockResolvedValue({ id: 'class-1', teacherId: 'teacher-1' });
    mocks.update.mockResolvedValue({ id: 'class-1' });
    mocks.transaction.mockImplementation((callback) => callback({ class: { update: mocks.update } }));
});

describe('announcement publication identity', () => {
    it('assigns a fresh identity on every publication, including reused text', async () => {
        expect((await publish({ announcement: 'Welcome!' })).status).toBe(200);
        expect((await publish({ announcement: 'Welcome!' })).status).toBe(200);
        const [first, second] = mocks.update.mock.calls.map(([args]) => args.data);
        expect(first.announcement).toBe('Welcome!');
        expect(first.announcementId).toEqual(expect.any(String));
        expect(second.announcementId).not.toBe(first.announcementId);
    });
    it('does not reset dismissals for unrelated class edits', async () => {
        expect((await publish({ name: 'Evening class' })).status).toBe(200);
        expect(mocks.update.mock.calls[0][0].data).toEqual({ name: 'Evening class' });
    });
    it('keeps the existing clear-announcement behavior', async () => {
        expect((await publish({ announcement: null })).status).toBe(200);
        expect(mocks.update.mock.calls[0][0].data).toEqual({ announcement: null, announcementId: expect.any(String) });
    });
});
