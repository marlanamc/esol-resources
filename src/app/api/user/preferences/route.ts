/**
 * User Preferences API
 * GET: Fetch user preferences
 * POST: Update user preferences
 */

import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';
import { ApiErrors, apiError, handleApiError } from '@/lib/api/response';
import { isValidAccentKey } from '@/lib/accent-colors';

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
        }
      });
    }

    return NextResponse.json({
      hideVerbExplanations: preferences.hideVerbExplanations,
      weeklyActivityGoal: preferences.weeklyActivityGoal,
      weeklyGoalStartDay: preferences.weeklyGoalStartDay,
      skillFocus: preferences.skillFocus,
      gameSettings: preferences.gameSettings ?? {},
      accentColor: preferences.accentColor ?? 'terracotta',
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to fetch preferences',
    });
  }
}

// Each game's settings entry must be a plain object. We don't validate the
// inner shape here — that's the calling component's contract — but we refuse
// arrays, primitives, and nested non-objects so the JSON column stays sane.
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function validateGameSettings(value: unknown): { ok: true; value: Record<string, Record<string, unknown>> } | { ok: false; error: string } {
  if (!isPlainObject(value)) return { ok: false, error: 'gameSettings must be an object keyed by game id' };
  for (const [gameId, entry] of Object.entries(value)) {
    if (typeof gameId !== 'string' || gameId.length === 0 || gameId.length > 64) {
      return { ok: false, error: `gameSettings key "${gameId}" is invalid` };
    }
    if (!isPlainObject(entry)) {
      return { ok: false, error: `gameSettings["${gameId}"] must be an object` };
    }
  }
  return { ok: true, value: value as Record<string, Record<string, unknown>> };
}

/**
 * POST /api/user/preferences
 * Update user preferences
 * Body: {
 *   hideVerbExplanations?: boolean,
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
      weeklyActivityGoal,
      weeklyGoalStartDay,
      skillFocus,
      gameSettings,
      accentColor,
    } = body as {
      hideVerbExplanations?: boolean;
      weeklyActivityGoal?: number;
      weeklyGoalStartDay?: number;
      skillFocus?: string[];
      gameSettings?: unknown;
      accentColor?: string;
    };

    if (hideVerbExplanations !== undefined && typeof hideVerbExplanations !== 'boolean') {
      return apiError('hideVerbExplanations must be a boolean', 400);
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

    if (accentColor !== undefined && !isValidAccentKey(accentColor)) {
      return apiError('accentColor must be one of: terracotta, teal, ocean, plum, ember', 400);
    }

    let validatedGameSettings: Record<string, Record<string, unknown>> | undefined;
    if (gameSettings !== undefined) {
      const result = validateGameSettings(gameSettings);
      if (!result.ok) return apiError(result.error, 400);
      validatedGameSettings = result.value;
    }

    const updateData: {
      hideVerbExplanations?: boolean;
      weeklyActivityGoal?: number;
      weeklyGoalStartDay?: number;
      skillFocus?: string[];
      gameSettings?: Prisma.InputJsonValue;
      accentColor?: string;
    } = {};

    if (hideVerbExplanations !== undefined) {
      updateData.hideVerbExplanations = hideVerbExplanations;
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
    if (accentColor !== undefined && isValidAccentKey(accentColor)) {
      updateData.accentColor = accentColor;
    }

    if (validatedGameSettings !== undefined) {
      // Merge per-game so a save for game A doesn't wipe game B's settings.
      const existing = await prisma.userPreferences.findUnique({
        where: { userId },
        select: { gameSettings: true },
      });
      const prior = isPlainObject(existing?.gameSettings) ? (existing!.gameSettings as Record<string, Record<string, unknown>>) : {};
      updateData.gameSettings = { ...prior, ...validatedGameSettings } as Prisma.InputJsonValue;
    }

    // Upsert preferences (create if doesn't exist, update if it does)
    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        hideVerbExplanations: hideVerbExplanations ?? false,
        weeklyActivityGoal: weeklyActivityGoal ?? 3,
        weeklyGoalStartDay: weeklyGoalStartDay ?? 1,
        skillFocus: skillFocus ?? [],
        gameSettings: (validatedGameSettings ?? {}) as Prisma.InputJsonValue,
      }
    });

    return NextResponse.json({
      ok: true,
      hideVerbExplanations: preferences.hideVerbExplanations,
      weeklyActivityGoal: preferences.weeklyActivityGoal,
      weeklyGoalStartDay: preferences.weeklyGoalStartDay,
      skillFocus: preferences.skillFocus,
      gameSettings: preferences.gameSettings ?? {},
      accentColor: preferences.accentColor ?? 'terracotta',
    });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to update preferences',
    });
  }
}
