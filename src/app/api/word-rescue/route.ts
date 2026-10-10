import { getRescueCollectionsForUser } from '@/lib/word-rescue/access';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';
import { readRescueProgress, rescueActionSchema } from '@/lib/word-rescue/progression';
import { saveRescueAction } from '@/lib/word-rescue/save';
import { WORD_RESCUE_ID } from '@/lib/word-rescue/types';
import { logger } from '@/lib/shared/logger';

async function viewer() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const activity = await prisma.activity.findUnique({ where: { id: WORD_RESCUE_ID }, select: { isReleased: true, deletedAt: true } });
  if (!activity || activity.deletedAt || (!activity.isReleased && session.user.role === 'student')) return null;
  return session.user;
}
export async function GET() {
  const user = await viewer();
  if (!user) return NextResponse.json({ error: 'Sign in to an available activity.' }, { status: 403 });
  const row = await prisma.activityProgress.findFirst({ where: { userId: user.id, activityId: WORD_RESCUE_ID, assignmentId: null }, orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ userId: user.id, state: readRescueProgress(row?.categoryData), collections: await getRescueCollectionsForUser(user) });
}
export async function POST(request: NextRequest) {
  const user = await viewer();
  if (!user) return NextResponse.json({ error: 'Sign in to an available activity.' }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid practice request.' }, { status: 400 }); }
  const parsed = rescueActionSchema.safeParse(body && typeof body === 'object' ? body.action : null);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid practice request.' }, { status: 400 });
  const assignmentId = typeof body.assignmentId === 'string' ? body.assignmentId : null;
  if (assignmentId) {
    const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId, activityId: WORD_RESCUE_ID, class: { OR: [{ teacherId: user.id }, { enrollments: { some: { studentId: user.id, status: 'active' } } }] } }, select: { id: true } });
    if (!assignment) return NextResponse.json({ error: 'This assignment is not available.' }, { status: 403 });
  }
  const collections = await getRescueCollectionsForUser(user);
  const allowedWordIds = new Set(collections.flatMap(set => set.wordIds));
  const action = parsed.data;
  if ((action.type === 'start' && action.collectionId !== 'again' && !collections.some(set => set.id === action.collectionId)) ||
      ('wordId' in action && !allowedWordIds.has(action.wordId))) {
    return NextResponse.json({ error: 'This week is not released for your class yet.' }, { status: 403 });
  }
  try { return NextResponse.json(await saveRescueAction(user.id, action, assignmentId, allowedWordIds)); }
  catch (error) {
    logger.error('Word Rescue save failed', { userId: user.id, error });
    return NextResponse.json({ error: 'Practice could not be saved. Your attempt is kept on this device; retry to save it.' }, { status: 409 });
  }
}
