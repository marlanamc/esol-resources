/**
 * User Preferences API
 * GET: Fetch user preferences
 * POST: Update user preferences
 */

import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/user/preferences
 * Fetch user's preferences (currently: hideVerbExplanations)
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

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
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { hideVerbExplanations } = body;

    if (typeof hideVerbExplanations !== 'boolean') {
      return NextResponse.json(
        { error: 'hideVerbExplanations must be a boolean' },
        { status: 400 }
      );
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
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
