import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';
import { apiError, handleApiError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return apiError('Unauthorized', 401);
        const body = await request.json();
        if (typeof body?.announcementId !== 'string' || !body.announcementId || body.announcementId.length > 200) {
            return apiError('Announcement ID is required', 400);
        }
        const announcement = await prisma.class.findFirst({
            where: {
                announcementId: body.announcementId,
                announcement: { not: null },
                enrollments: { some: { studentId: session.user.id, status: 'active' } },
            },
            select: { id: true, announcementId: true },
        });
        if (!announcement) return apiError('Announcement not found', 404);

        // Derive identity from the session; retries cannot create duplicate dismissals.
        await prisma.announcementDismissal.upsert({
            where: { studentId_classId: { studentId: session.user.id, classId: announcement.id } },
            create: { studentId: session.user.id, classId: announcement.id, announcementId: announcement.announcementId },
            update: { announcementId: announcement.announcementId, dismissedAt: new Date() },
        });
        return NextResponse.json({ ok: true });
    } catch (error) {
        return handleApiError(error, { defaultMessage: 'Could not save dismissal', path: request.url });
    }
}
