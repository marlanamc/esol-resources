/**
 * User Preferences API
 * GET: Fetch user preferences
 * POST: Update user preferences
 */

import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApiErrors, apiError, handleApiError } from '@/lib/api-response';

/**
 * GET /api/user/preferences
 * Fetch user's preferences (currently: hideVerbExplanations)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return ApiErrors.unauthorized();
    }

    const userId = session.user.id;

    // Fetch or create default preferences
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId }
    });

    // If no preferences exist, create defaults
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId,
          hideVerbExplanations: false
        }
      });
    }

    return NextResponse.json({
      hideVerbExplanations: preferences.hideVerbExplanations
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to fetch preferences',
    });
  }
}

/**
 * POST /api/user/preferences
 * Update user preferences
 * Body: { hideVerbExplanations: boolean }
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return ApiErrors.unauthorized();
    }

    const userId = session.user.id;
    const body = await request.json();
    const { hideVerbExplanations } = body;

    if (typeof hideVerbExplanations !== 'boolean') {
      return apiError('hideVerbExplanations must be a boolean', 400);
    }

    // Upsert preferences (create if doesn't exist, update if it does)
    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: { hideVerbExplanations },
      create: {
        userId,
        hideVerbExplanations
      }
    });

    return NextResponse.json({
      ok: true,
      hideVerbExplanations: preferences.hideVerbExplanations
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to update preferences',
    });
  }
}
