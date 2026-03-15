import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  isValidAvatarId,
  isValidColorId,
  DEFAULT_AVATAR,
  DEFAULT_COLOR,
} from '@/lib/avatar-constants';
import { ApiErrors, apiError, handleApiError } from '@/lib/api-response';

/**
 * GET /api/user/avatar
 * Get the current user's avatar settings
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return ApiErrors.unauthorized();
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatar: true,
        avatarColor: true,
      },
    });

    if (!user) {
      return ApiErrors.notFound('User');
    }

    return NextResponse.json({
      avatar: user.avatar || DEFAULT_AVATAR,
      avatarColor: user.avatarColor || DEFAULT_COLOR,
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to fetch avatar',
    });
  }
}

/**
 * POST /api/user/avatar
 * Update the current user's avatar settings
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return ApiErrors.unauthorized();
    }

    const userId = session.user.id;
    const body = await req.json();
    const { avatar, avatarColor } = body;

    // Validate avatar
    if (avatar !== undefined) {
      if (typeof avatar !== 'string') {
        return apiError('Invalid avatar type', 400);
      }
      if (!isValidAvatarId(avatar)) {
        return apiError('Invalid avatar id', 400);
      }
    }

    // Validate color
    if (avatarColor !== undefined) {
      if (typeof avatarColor !== 'string') {
        return apiError('Invalid avatarColor type', 400);
      }
      if (!isValidColorId(avatarColor)) {
        return apiError('Invalid avatarColor id', 400);
      }
    }

    const updateData: { avatar?: string; avatarColor?: string } = {};
    if (avatar !== undefined) updateData.avatar = avatar;
    if (avatarColor !== undefined) updateData.avatarColor = avatarColor;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        avatar: true,
        avatarColor: true,
      },
    });

    return NextResponse.json({
      avatar: user.avatar || DEFAULT_AVATAR,
      avatarColor: user.avatarColor || DEFAULT_COLOR,
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to update avatar',
      path: req.url,
    });
  }
}
