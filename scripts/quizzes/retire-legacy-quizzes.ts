/** One-time catalog cleanup. Preview by default; --apply uses the production guard. */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient, Prisma } from '@prisma/client';
import quizzes from '../../src/content/quizzes/weekly-quizzes.json';
import { getWeeklyQuizSchedule } from '../../src/lib/weekly-quiz-schedule';
import { COURSE_MAP_UNITS } from '../../src/lib/course-map-data';
const mapTitles = new Map(COURSE_MAP_UNITS.flatMap(u => u.weeks.flatMap(w => w.items)).map(item => [item.id, item.title]));
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const db = new PrismaClient();
const apply = process.argv.includes('--apply');
const keepIds = Object.keys(quizzes);
const quizWhere: Prisma.ActivityWhereInput = {
  OR: [{ type: { equals: 'quiz', mode: 'insensitive' } }, { category: { equals: 'quizzes', mode: 'insensitive' } }],
};
function contentType(content: string) {
  try { return JSON.parse(content)?.type; } catch { return null; }
}
async function main() {
  if (apply) requireSafeDbTarget('retire legacy quizzes and normalize weekly quiz catalog');
  const rows = await db.activity.findMany({ where: { OR: [quizWhere, { id: { in: keepIds } }] }, include: {
    submissions: true, progress: true, assignments: true, quizResponses: true,
    speakingSubmissions: true, writingSessions: true, courseMapItems: true,
  } });
  for (const id of keepIds) if (!rows.some(row => row.id === id)) throw new Error(`Missing canonical quiz ${id}; sync first.`);
  const obsolete = rows.filter(row => !keepIds.includes(row.id) && !row.deletedAt);
  const legacySlots = rows.filter(row => keepIds.includes(row.id) && contentType(row.content) !== 'weekly-quiz');
  console.log(JSON.stringify({ activeBefore: rows.filter(row => !row.deletedAt).length, archiveOlderQuizzes: obsolete.length, replaceLegacySlots: legacySlots.map(row => row.id), retainWeeklyQuizzes: keepIds.length }));
  if (!apply) { console.log('Preview only; no changes.'); return; }
  const stamp = new Date();
  const backupDir = path.resolve('.backups/quiz-cleanup');
  fs.mkdirSync(backupDir, { recursive: true, mode: 0o700 });
  const backupPath = path.join(backupDir, `${stamp.toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(backupPath, JSON.stringify({ createdAt: stamp, rows }, null, 2), { mode: 0o600, flag: 'wx' });
  console.log(`Recovery backup: ${backupPath}`);
  const result = await db.$transaction(async tx => {
    // Lock activity edits during the migration; serializable isolation detects
    // concurrent submission changes rather than mixing old and new quiz work.
    await tx.$queryRaw`SELECT id FROM "Activity" WHERE id IN (${Prisma.join(rows.map(row => row.id))}) FOR UPDATE`;
    const current = await tx.activity.findMany({ where: { id: { in: rows.map(row => row.id) } }, select: { id: true, updatedAt: true } });
    if (current.some(row => row.updatedAt.getTime() !== rows.find(old => old.id === row.id)!.updatedAt.getTime())) throw new Error('Quiz catalog changed during backup; retry cleanup.');
    const submissionsBefore = await tx.submission.count();
    const progressBefore = await tx.activityProgress.count();
    const ledgerBefore = await tx.pointsLedger.aggregate({ _count: true, _sum: { points: true } });
    const archivedVersions: string[] = [];
    for (const old of legacySlots) {
      const archiveId = `${old.id}-archived-verb-only`;
      if (await tx.activity.findUnique({ where: { id: archiveId } })) throw new Error(`Archive already exists: ${archiveId}`);
      const { submissions, progress, assignments, quizResponses, speakingSubmissions, writingSessions, courseMapItems, ...fields } = old;
      void submissions; void progress; void assignments; void quizResponses; void speakingSubmissions; void writingSessions; void courseMapItems;
      await tx.activity.create({ data: { ...fields, id: archiveId, deletedAt: stamp, isReleased: false, isFeaturedForIndependent: false } });
      await tx.submission.updateMany({ where: { activityId: old.id }, data: { activityId: archiveId } });
      await tx.activityProgress.updateMany({ where: { activityId: old.id }, data: { activityId: archiveId } });
      await tx.quizResponse.updateMany({ where: { activityId: old.id }, data: { activityId: archiveId } });
      await tx.speakingSubmission.updateMany({ where: { activityId: old.id }, data: { activityId: archiveId } });
      await tx.writingSession.updateMany({ where: { activityId: old.id }, data: { activityId: archiveId } });
      await tx.assignment.updateMany({ where: { activityId: old.id }, data: { activityId: archiveId } });
      archivedVersions.push(archiveId);
    }
    await tx.activity.updateMany({ where: { id: { in: obsolete.map(row => row.id) } }, data: { deletedAt: stamp, isReleased: false, isFeaturedForIndependent: false } });
    for (const [id, content] of Object.entries(quizzes)) {
      // Preserve existing weekly-quiz answers/content. Only legacy slots get new content.
      const replace = legacySlots.some(old => old.id === id);
      await tx.activity.update({ where: { id }, data: {
        title: content.title, description: 'A 5–10 minute review: verb forms in context, vocabulary, and this week’s grammar.', type: 'quiz', category: 'quizzes', contentKind: 'map', deletedAt: null,
        ...(replace ? { content: JSON.stringify(content), isReleased: false } : {}),
      } });
      await tx.courseMapItem.updateMany({ where: { activityId: id }, data: { activityType: 'quiz', title: mapTitles.get(id) ?? content.title } });
      await tx.assignment.updateMany({ where: { activityId: id }, data: { title: content.title, dueDate: getWeeklyQuizSchedule(content.weekNumber)!.dueAt } });
    }
    const active = await tx.activity.findMany({ where: { AND: [quizWhere, { deletedAt: null }] }, select: { id: true, type: true, category: true, contentKind: true, content: true } });
    if (active.length !== keepIds.length || active.some(row => !keepIds.includes(row.id) || contentType(row.content) !== 'weekly-quiz' || row.category !== 'quizzes' || row.type !== 'quiz' || row.contentKind !== 'map')) throw new Error('Final quiz catalog validation failed.');
    const ledgerAfter = await tx.pointsLedger.aggregate({ _count: true, _sum: { points: true } });
    if (await tx.submission.count() !== submissionsBefore || await tx.activityProgress.count() !== progressBefore || JSON.stringify(ledgerBefore) !== JSON.stringify(ledgerAfter)) throw new Error('Historical work or points changed unexpectedly.');
    return { activeWeeklyQuizzes: active.length, archivedOlderQuizzes: obsolete.length, archivedLegacyVersions: archivedVersions.length, submissionsPreserved: submissionsBefore, progressRecordsPreserved: progressBefore, pointsLedgerUnchanged: true };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 60000, maxWait: 10000 });
  console.log(JSON.stringify(result));
}
main().catch(error => { console.error(error instanceof Error ? error.message.replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted connection]') : 'Quiz cleanup failed'); process.exitCode = 1; }).finally(() => db.$disconnect());
