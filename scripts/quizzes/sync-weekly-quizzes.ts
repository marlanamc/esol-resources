/**
 * Preview by default. --apply updates unused quizzes while preserving release settings.
 * --update-started also updates quizzes students already took, but only when every
 * question keeps its id and answer key, so saved scores and results stay valid
 * (used to switch Weeks 4-8 to tap questions while students make them up).
 */
import { PrismaClient } from '@prisma/client';
import quizzes from '../../src/content/quizzes/weekly-quizzes.json';
import { MAP } from '../../src/lib/content-kind';
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const apply = process.argv.includes('--apply');
const updateStarted = process.argv.includes('--update-started');
const answerKey = (raw: string | null | undefined) => {
  try {
    const parsed = JSON.parse(raw ?? '') as { questions?: { id: string; answers: string[] }[] };
    return JSON.stringify((parsed.questions ?? []).map(q => [q.id, q.answers]).sort());
  } catch { return null; }
};
const prisma = new PrismaClient();
async function main() {
  if (!apply) {
    for (const [id, quiz] of Object.entries(quizzes)) console.log(`${id}: ${quiz.title} (${quiz.questions.length} answers)`);
    console.log('Preview only. Use --apply to sync unused quizzes; release settings are preserved.');
    return;
  }
  requireSafeDbTarget('sync weekly review quizzes');
  const teacher = await prisma.user.findFirst({ where: { role: 'teacher' }, select: { id: true } });
  if (!teacher) throw new Error('A teacher account is required.');
  for (const [id, content] of Object.entries(quizzes)) {
    const outcome = await prisma.$transaction(async tx => {
      // Assignments copy the quiz title, so keep them named the same way.
      await tx.assignment.updateMany({ where: { activityId: id, NOT: { title: content.title } }, data: { title: content.title } });
      const existing = await tx.activity.findUnique({ where: { id }, select: { content: true } });
      if (existing?.content === JSON.stringify(content)) return 'unchanged';
      const [submissions, progress] = await Promise.all([
        tx.submission.count({ where: { activityId: id } }),
        tx.activityProgress.count({ where: { activityId: id } }),
      ]);
      if ((submissions || progress) && updateStarted && answerKey(existing?.content) === answerKey(JSON.stringify(content))) {
        await tx.activity.update({ where: { id }, data: { title: content.title, content: JSON.stringify(content) } });
        return 'synced (started; same questions and answers, so saved scores still match)';
      }
      if (submissions || progress) {
        // Keep the questions students answered, but the title is safe to rename.
        const renamed = await tx.activity.updateMany({ where: { id, NOT: { title: content.title } }, data: { title: content.title } });
        return renamed.count ? 'preserved questions (existing student work); title renamed' : 'preserved: existing student work';
      }
      const fields = { title: content.title, description: 'A 5–10 minute review: verb forms in context, vocabulary, and grammar.', type: 'quiz', category: 'quizzes', content: JSON.stringify(content), contentKind: MAP };
      await tx.activity.upsert({ where: { id }, update: fields, create: { id, ...fields, isReleased: false, createdBy: teacher.id, level: 'intermediate' } });
      return 'synced';
    });
    console.log(`${id}: ${outcome}`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
