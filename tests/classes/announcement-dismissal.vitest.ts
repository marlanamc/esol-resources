import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
    session: vi.fn(),
    findFirst: vi.fn(),
    upsert: vi.fn(),
}));
vi.mock('next-auth', () => ({ getServerSession: mocks.session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/database/prisma', () => ({ prisma: {
    class: { findFirst: mocks.findFirst },
    announcementDismissal: { upsert: mocks.upsert },
} }));
vi.mock('@/lib/api/response', () => ({
    apiError: (error: string, status: number) => Response.json({ error }, { status }),
    handleApiError: () => Response.json({ error: 'Could not save dismissal' }, { status: 500 }),
}));
import { POST } from '@/app/api/announcements/dismiss/route';

const request = (body: unknown) => new NextRequest('http://localhost/api/announcements/dismiss', {
    method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' },
});

beforeEach(() => {
    vi.resetAllMocks();
    mocks.session.mockResolvedValue({ user: { id: 'student-1' } });
    mocks.findFirst.mockResolvedValue({ id: 'class-1', announcementId: 'publication-1' });
    mocks.upsert.mockResolvedValue({});
});

describe('announcement dismissals', () => {
    it('requires authentication before accessing the database', async () => {
        mocks.session.mockResolvedValue(null);
        expect((await POST(request({ announcementId: 'publication-1' }))).status).toBe(401);
        expect(mocks.findFirst).not.toHaveBeenCalled();
    });
    it.each([{}, { announcementId: 1 }, { announcementId: '' }, { announcementId: 'x'.repeat(201) }])('rejects malformed IDs: %j', async (body) => {
        expect((await POST(request(body))).status).toBe(400);
        expect(mocks.upsert).not.toHaveBeenCalled();
    });
    it('uses the authenticated student and restricts access to current enrolled-class publications', async () => {
        expect((await POST(request({ announcementId: 'publication-1', studentId: 'someone-else' }))).status).toBe(200);
        expect(mocks.findFirst).toHaveBeenCalledWith({
            where: {
                announcementId: 'publication-1', announcement: { not: null },
                enrollments: { some: { studentId: 'student-1', status: 'active' } },
            },
            select: { id: true, announcementId: true },
        });
        expect(mocks.upsert).toHaveBeenCalledWith({
            where: { studentId_classId: { studentId: 'student-1', classId: 'class-1' } },
            create: { studentId: 'student-1', classId: 'class-1', announcementId: 'publication-1' },
            update: { announcementId: 'publication-1', dismissedAt: expect.any(Date) },
        });
    });
    it('does not save dismissals for inaccessible or replaced announcements', async () => {
        mocks.findFirst.mockResolvedValue(null);
        expect((await POST(request({ announcementId: 'old-publication' }))).status).toBe(404);
        expect(mocks.upsert).not.toHaveBeenCalled();
    });
    it('uses the same unique account/class key on retries', async () => {
        await POST(request({ announcementId: 'publication-1' }));
        await POST(request({ announcementId: 'publication-1' }));
        const keys = mocks.upsert.mock.calls.map(([args]) => args.where);
        expect(keys[0]).toEqual(keys[1]);
    });
    it('reports persistence failure so the client can restore the announcement', async () => {
        mocks.upsert.mockRejectedValue(new Error('Database unavailable'));
        expect((await POST(request({ announcementId: 'publication-1' }))).status).toBe(500);
    });
});
