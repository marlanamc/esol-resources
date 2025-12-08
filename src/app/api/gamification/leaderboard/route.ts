import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWeeklyLeaderboard } from '@/lib/gamification';

/**
 * GET /api/gamification/leaderboard
 * Get the weekly leaderboard
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const limit = parseInt(searchParams.get('limit') || '20');

    const leaderboard = await getWeeklyLeaderboard(limit, classId || undefined);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('[Leaderboard] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
