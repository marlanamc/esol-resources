/**
 * Invite Links API
 * POST: Generate a new invite link (auth required)
 * GET: List user's invite links (auth required)
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';
import { ApiErrors, apiSuccess, handleApiError } from '@/lib/api/response';
import { generateInviteCode } from '@/lib/invite-code';
import { getAppBaseUrl } from '@/lib/shared/env';

/**
 * GET /api/invites
 * List user's invite links
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return ApiErrors.unauthorized();
    }

    const userId = session.user.id;

    const invites = await prisma.inviteLink.findMany({
      where: {
        createdById: userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        createdAt: true,
        expiresAt: true,
        isActive: true,
      },
    });

    // Build full URLs for each invite
    const baseUrl = getAppBaseUrl();
    const invitesWithUrls = invites.map((invite) => ({
      ...invite,
      url: `${baseUrl}/join?code=${invite.code}`,
    }));

    return apiSuccess(invitesWithUrls);
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to fetch invites',
    });
  }
}

/**
 * POST /api/invites
 * Generate a new invite link
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return ApiErrors.unauthorized();
    }

    const userId = session.user.id;

    // Check if user already has an active invite link
    // If so, return the existing one instead of creating a new one
    const existingInvite = await prisma.inviteLink.findFirst({
      where: {
        createdById: userId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      select: {
        id: true,
        code: true,
        createdAt: true,
        expiresAt: true,
        isActive: true,
      },
    });

    if (existingInvite) {
      const baseUrl = getAppBaseUrl();
      return apiSuccess({
        ...existingInvite,
        url: `${baseUrl}/join?code=${existingInvite.code}`,
        isNew: false,
      });
    }

    // Generate a new invite code
    const code = generateInviteCode();

    const invite = await prisma.inviteLink.create({
      data: {
        code,
        createdById: userId,
        // No expiration for unlimited invites
        expiresAt: null,
      },
      select: {
        id: true,
        code: true,
        createdAt: true,
        expiresAt: true,
        isActive: true,
      },
    });

    const baseUrl = getAppBaseUrl();

    return apiSuccess({
      ...invite,
      url: `${baseUrl}/join?code=${invite.code}`,
      isNew: true,
    }, 201);
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to create invite',
    });
  }
}
