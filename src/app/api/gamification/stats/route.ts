import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireAuth } from '@/lib/api-auth';
import { withRequestLogging } from '@/lib/api/request-logging';
import { getUserGamificationStats } from '@/lib/gamification';
import { ApiErrors, handleApiError } from '@/lib/api-response';

/**
 * GET /api/gamification/stats
 * Get user's gamification stats
 */
export async function GET(request: NextRequest) {
  return withRequestLogging(request, async () => {
    try {
      const session = await getServerSession(authOptions);
      const authErr = requireAuth(session);
      if (authErr) return authErr;

      const userId = (session!.user as { id: string }).id;
      const stats = await getUserGamificationStats(userId);

      if (!stats) {
        return ApiErrors.notFound('User');
      }

      return NextResponse.json({ stats });
    } catch (error) {
      return handleApiError(error, {
        defaultMessage: 'Failed to fetch stats',
        path: request.url,
      });
    }
  });
}
