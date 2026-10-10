import { PrismaClient } from '@prisma/client';
import { requireSafeDbTarget } from '../scripts/lib/require-safe-db-target';
import { WORD_RESCUE_ID } from '../src/lib/word-rescue/types';

async function main() {
  requireSafeDbTarget('seed Word Rescue draft');
  const prisma = new PrismaClient();
  try {
    const teacher = await prisma.user.findFirst({ where: { role: { in: ['admin', 'teacher'] } }, select: { id: true } });
    if (!teacher) throw new Error('Create a teacher account first.');
    const data = { title: 'Word Rescue', description: 'Listen slowly, practice weekly vocabulary and everyday tricky words, and earn points for your effort. Spanish and Brazilian Portuguese sound guides.', type: 'game', ui: 'word-rescue', category: 'pronunciation', level: 'beginner', content: JSON.stringify({ type: 'word-rescue', version: 1 }) };
    await prisma.activity.upsert({ where: { id: WORD_RESCUE_ID }, update: data, create: { id: WORD_RESCUE_ID, ...data, createdBy: teacher.id, isReleased: false } });
    console.log('Word Rescue prepared. New activities remain unreleased until audio/content review.');
  } finally { await prisma.$disconnect(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
