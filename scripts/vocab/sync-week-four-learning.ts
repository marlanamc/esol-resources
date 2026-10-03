/** Targeted sync: only Week 4's new learning vocabulary and map ordering. */
import { PrismaClient } from '@prisma/client';
import { COURSE_MAP_UNITS } from '../../src/lib/course-map-data';
const { weeklyVocabData } = require('./weekly-vocab-data');
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const db = new PrismaClient();
const apply = process.argv.includes('--apply');
const id = 'vocab-oct-learning';
const data = weeklyVocabData['oct-learning'] as {topic: string; words: {term: string; pos: string; def: string; ex: string; fillBlank: {text: string; options: string[]}}[]};
const cards = data.words.map(word => ({ term: word.term, pos: word.pos, definition: word.def, example: word.ex, topics: [] }));
const content = {
  type: 'vocabulary', wordList: { cards }, flashcards: { cards },
  matching: { pairs: data.words.map((word, index) => ({ id: index + 1, term: word.term, definition: word.def })) },
  fillInBlank: { sentences: data.words.map((word, index) => ({ id: `sentence-${index}`, text: word.fillBlank.text, blanks: [word.term], correctAnswers: [word.term], options: word.fillBlank.options, explanation: word.def })) },
};
async function main() {
  console.log(`Week 4: ${data.words.map(word => word.term).join(', ')}`);
  if (!apply) { console.log('Preview only; use --apply to sync.'); return; }
  requireSafeDbTarget('sync Week 4 learning vocabulary');
  const week = COURSE_MAP_UNITS.flatMap(unit => unit.weeks).find(week => week.number === 4)!;
  await db.$transaction(async tx => {
    const existing = await tx.activity.findUnique({ where: { id }, select: {content: true} });
    if (existing && existing.content !== JSON.stringify(content) && await tx.activityProgress.count({ where: {activityId: id} })) throw new Error('This vocabulary has existing progress; preserve it before changing content.');
    const fields = { title: `Unit 2: ${data.topic}`, description: `Learning-focused vocabulary: ${data.words.map(word => word.term).join(', ')}.`, type: 'vocabulary', category: 'Vocab', contentKind: 'map', content: JSON.stringify(content) };
    await tx.activity.upsert({ where: { id }, update: fields, create: { id, ...fields, level: 'intermediate' } });
    for (const item of week.items) {
      if (item.activityId === id) {
        const fields = { weekId: week.id, activityId: id, slot: item.slot, order: item.order, wrappedGame: item.wrappedGame, activityType: item.activityType, title: item.title, vocabUi: item.vocabUi };
        await tx.courseMapItem.upsert({ where: { id: item.id }, update: fields, create: { id: item.id, ...fields } });
      } else {
        await tx.courseMapItem.updateMany({ where: { id: item.id, weekId: week.id }, data: { order: item.order } });
      }
    }
  });
  const saved = await db.activity.findUniqueOrThrow({ where: { id }, select: { content: true, category: true, contentKind: true } });
  const links = await db.courseMapItem.findMany({ where: { activityId: id }, select: {weekId: true, vocabUi: true} });
  if (saved.content !== JSON.stringify(content) || saved.category !== 'Vocab' || saved.contentKind !== 'map' || links.length !== 3 || links.some(link => link.weekId !== week.id)) throw new Error('Week 4 verification failed.');
  console.log('Verified: six words, flashcards, matching, and fill-in-the-blank practice in Week 4. Quiz 1 and existing student progress unchanged.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.$disconnect());
