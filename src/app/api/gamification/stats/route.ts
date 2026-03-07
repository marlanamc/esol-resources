import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireAuth } from '@/lib/api-auth';
import { withRequestLogging } from '@/lib/request-logging';
import { getUserGamificationStats } from '@/lib/gamification';

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
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ stats });
    } catch (error) {
      console.error('[Gamification Stats] Error:', error);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
  });
}
