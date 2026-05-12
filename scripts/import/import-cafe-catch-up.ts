/**
 * Import / refresh all Café Catch-Up themed decks defined in the
 * `CAFE_CATCH_UP_DECKS` manifest.
 *
 * Each deck becomes one Activity row (type: "game", category: "games", ui: "cafe-catch-up")
 * with stable id matching the manifest entry. Re-running this script updates
 * existing rows in place without disturbing learner progress.
 *
 * Usage: npx tsx scripts/import/import-cafe-catch-up.ts
 *    or: npm run import:cafe-catch-up
 */

import { PrismaClient } from '@prisma/client';
import { CAFE_CATCH_UP_DECKS } from '../../src/content/cafe-catch-up';

const prisma = new PrismaClient();

async function importDecks() {
    console.log('\u2615  Importing Caf\u00e9 Catch-Up decks...\n');

    const teacher = await prisma.user.findFirst({
        where: { role: 'teacher' },
    });

    if (!teacher) {
        console.error('\u274c  No teacher account found. Please create a teacher account first.');
        process.exit(1);
    }

    let created = 0;
    let updated = 0;

    for (const deck of CAFE_CATCH_UP_DECKS) {
        const { id, level, content } = deck;
        const promptCount = content.prompts.length;
        const filterCount = content.decks.filter((d) => d.id !== 'sip').length;

        const baseData = {
            title: content.title,
            description: content.description ?? null,
            type: 'game',
            category: 'games',
            level: level ?? 'intermediate',
            ui: 'cafe-catch-up',
            content: JSON.stringify(content),
        } as const;

        const existing = await prisma.activity.findUnique({ where: { id } });

        if (existing) {
            await prisma.activity.update({
                where: { id },
                data: baseData,
            });
            updated += 1;
            console.log(`\u2705  Updated  ${id}  \u2014 ${promptCount} prompts across ${filterCount} topics`);
        } else {
            await prisma.activity.create({
                data: {
                    id,
                    ...baseData,
                    createdBy: teacher.id,
                },
            });
            created += 1;
            console.log(`\u2728  Created  ${id}  \u2014 ${promptCount} prompts across ${filterCount} topics`);
        }
    }

    console.log(`\n\u{1F389} Done. Created ${created}, updated ${updated}.`);
    console.log('   Catalog path: Dashboard \u2192 Activities \u2192 Games');
    console.log(`   Direct link:  /activity/${CAFE_CATCH_UP_DECKS[0]?.id}\n`);
}

importDecks()
    .catch((err) => {
        console.error('\u274c  Error during import:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
