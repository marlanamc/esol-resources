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
import { normalizeLearnerMode } from '@/lib/learner-mode';

/**
 * GET /api/user/preferences
 * Fetch user's preferences
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
          hideVerbExplanations: false,
          learnerMode: 'classroom',
        }
      });
    }

    return NextResponse.json({
      hideVerbExplanations: preferences.hideVerbExplanations,
      learnerMode: preferences.learnerMode,
      weeklyActivityGoal: preferences.weeklyActivityGoal,
      weeklyGoalStartDay: preferences.weeklyGoalStartDay,
      skillFocus: preferences.skillFocus,
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
 * Body: {
 *   hideVerbExplanations?: boolean,
 *   learnerMode?: "classroom" | "independent",
 *   weeklyActivityGoal?: number (1-10),
 *   weeklyGoalStartDay?: number (0-6, 0=Sunday),
 *   skillFocus?: string[]
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return ApiErrors.unauthorized();
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      hideVerbExplanations,
      learnerMode,
      weeklyActivityGoal,
      weeklyGoalStartDay,
      skillFocus,
    } = body as {
      hideVerbExplanations?: boolean;
      learnerMode?: string;
      weeklyActivityGoal?: number;
      weeklyGoalStartDay?: number;
      skillFocus?: string[];
    };

    if (hideVerbExplanations !== undefined && typeof hideVerbExplanations !== 'boolean') {
      return apiError('hideVerbExplanations must be a boolean', 400);
    }

    const normalizedLearnerMode = learnerMode === undefined ? undefined : normalizeLearnerMode(learnerMode);
    if (learnerMode !== undefined && !normalizedLearnerMode) {
      return apiError('learnerMode must be classroom or independent', 400);
    }

    if (weeklyActivityGoal !== undefined) {
      if (typeof weeklyActivityGoal !== 'number' || weeklyActivityGoal < 1 || weeklyActivityGoal > 10) {
        return apiError('weeklyActivityGoal must be a number between 1 and 10', 400);
      }
    }

    if (weeklyGoalStartDay !== undefined) {
      if (typeof weeklyGoalStartDay !== 'number' || weeklyGoalStartDay < 0 || weeklyGoalStartDay > 6) {
        return apiError('weeklyGoalStartDay must be a number between 0 and 6', 400);
      }
    }

    if (skillFocus !== undefined) {
      if (!Array.isArray(skillFocus) || !skillFocus.every(s => typeof s === 'string')) {
        return apiError('skillFocus must be an array of strings', 400);
      }
    }

    const updateData: {
      hideVerbExplanations?: boolean;
      learnerMode?: 'classroom' | 'independent';
      weeklyActivityGoal?: number;
      weeklyGoalStartDay?: number;
      skillFocus?: string[];
    } = {};

    if (hideVerbExplanations !== undefined) {
      updateData.hideVerbExplanations = hideVerbExplanations;
    }
    if (normalizedLearnerMode) {
      updateData.learnerMode = normalizedLearnerMode;
    }
    if (weeklyActivityGoal !== undefined) {
      updateData.weeklyActivityGoal = weeklyActivityGoal;
    }
    if (weeklyGoalStartDay !== undefined) {
      updateData.weeklyGoalStartDay = weeklyGoalStartDay;
    }
    if (skillFocus !== undefined) {
      updateData.skillFocus = skillFocus;
    }

    // Upsert preferences (create if doesn't exist, update if it does)
    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        hideVerbExplanations: hideVerbExplanations ?? false,
        learnerMode: normalizedLearnerMode ?? 'classroom',
        weeklyActivityGoal: weeklyActivityGoal ?? 3,
        weeklyGoalStartDay: weeklyGoalStartDay ?? 1,
        skillFocus: skillFocus ?? [],
      }
    });

    return NextResponse.json({
      ok: true,
      hideVerbExplanations: preferences.hideVerbExplanations,
      learnerMode: preferences.learnerMode,
      weeklyActivityGoal: preferences.weeklyActivityGoal,
      weeklyGoalStartDay: preferences.weeklyGoalStartDay,
      skillFocus: preferences.skillFocus,
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to update preferences',
    });
  }
}
