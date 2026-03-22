/**
 * Invite Code Validation API
 * GET: Validate an invite code (no auth required)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiErrors, apiSuccess, handleApiError } from '@/lib/api-response';
import { normalizeInviteCode, isValidInviteCodeFormat } from '@/lib/invite-code';

interface RouteParams {
  params: Promise<{ code: string }>;
}

/**
 * GET /api/invites/[code]
 * Validate an invite code and return info about it
 * This endpoint is public (no auth required) so new users can check codes
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { code: rawCode } = await params;

    if (!rawCode) {
      return ApiErrors.notFound('Invite code');
    }

    const code = normalizeInviteCode(rawCode);

    // Validate format first
    if (!isValidInviteCodeFormat(code)) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid invite code format',
      });
    }

    // Look up the invite
    const invite = await prisma.inviteLink.findUnique({
      where: { code },
      select: {
        id: true,
        isActive: true,
        expiresAt: true,
        createdBy: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    if (!invite) {
      return NextResponse.json({
        valid: false,
        error: 'Invite code not found',
      });
    }

    // Check if invite is still active
    if (!invite.isActive) {
      return NextResponse.json({
        valid: false,
        error: 'This invite link is no longer active',
      });
    }

    // Check if invite has expired
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return NextResponse.json({
        valid: false,
        error: 'This invite link has expired',
      });
    }

    // Invite is valid
    return apiSuccess({
      valid: true,
      invitedBy: invite.createdBy.name || invite.createdBy.username,
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to validate invite code',
    });
  }
}
