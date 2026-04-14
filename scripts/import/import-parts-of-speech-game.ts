/**
 * Import the Parts of Speech Pattern Discovery Game
 *
 * Usage: npx tsx scripts/import/import-parts-of-speech-game.ts
 *    or: npm run import:parts-of-speech
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parsePartsOfSpeechOverrideCSV, type PosPhaseOverrideMap } from '../lib/parts-of-speech-round-overrides';

const prisma = new PrismaClient();
const ROUND_OVERRIDE_CSV = path.join(process.cwd(), 'src', 'data', 'parts-of-speech-round-phase-overrides.csv');

const GAME_CONTENT = {
  type: 'parts-of-speech',
  roundSize: 10,
};

function loadRoundOverrides(): PosPhaseOverrideMap {
  if (!fs.existsSync(ROUND_OVERRIDE_CSV)) {
    return {};
  }

  const raw = fs.readFileSync(ROUND_OVERRIDE_CSV, 'utf-8');
  const parsed = parsePartsOfSpeechOverrideCSV(raw);
  if (parsed.errors.length > 0) {
    console.error(`❌ Invalid data in ${path.relative(process.cwd(), ROUND_OVERRIDE_CSV)}:`);
    for (const error of parsed.errors) {
      console.error(`  line ${error.line}: ${error.message}`);
    }
    process.exit(1);
  }

  if (parsed.warnings.length > 0) {
    console.log(`⚠️  Parsed ${parsed.warnings.length} warning(s) from override CSV:`);
    for (const warning of parsed.warnings) {
      console.log(`  line ${warning.line}: ${warning.message}`);
    }
  }

  const applied = parsed.rows.length
    ? ` (${parsed.rows.length} override row${parsed.rows.length === 1 ? '' : 's'})`
    : '';
  console.log(`✅ Loaded override config from parts-of-speech-round-phase-overrides.csv${applied}`);
  return parsed.phaseOverrides;
}

async function importGame() {
  try {
    console.log('🎮 Importing Parts of Speech Pattern Discovery Game...\n');
    const roundOverrides = loadRoundOverrides();
    const gameContent = {
      ...GAME_CONTENT,
      roundOverrides,
    };

    const teacher = await prisma.user.findFirst({
      where: { role: 'teacher' },
    });

    if (!teacher) {
      console.error('❌ No teacher account found. Please create a teacher account first.');
      process.exit(1);
    }

    const existing = await prisma.activity.findUnique({
      where: { id: 'parts-of-speech-game' },
    });

    const baseData = {
      title: 'Parts of Speech Discovery Game',
      description:
        'Learn all 8 parts of speech through discovery-based exercises. Master nouns, verbs, adjectives, adverbs, prepositions, conjunctions, pronouns, and articles — then see how they connect to grammar patterns like gerunds and infinitives.',
      type: 'game',
      category: 'games',
      level: 'beginner',
      ui: 'parts-of-speech',
      content: JSON.stringify(gameContent),
    };

    if (existing) {
      const updated = await prisma.activity.update({
        where: { id: 'parts-of-speech-game' },
        data: baseData,
      });
      console.log('✅ Activity updated:', updated.id);
    } else {
      const created = await prisma.activity.create({
        data: {
          id: 'parts-of-speech-game',
          ...baseData,
          createdBy: teacher.id,
        },
      });
      console.log('✅ Activity created:', created.id);
    }

    console.log('   Title: Parts of Speech Discovery Game');
    console.log('   Type:  game');
    console.log('   UI:    parts-of-speech');
    console.log('\n🔗 Access at: /activity/parts-of-speech-game');
    console.log('\n✨ Import complete!\n');
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importGame();
