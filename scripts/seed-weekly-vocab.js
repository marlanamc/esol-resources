/**
 * Seed weekly vocabulary activities (Feb–Jun). Creates for each week:
 * - Word List (packet, resource)
 * - Flash Cards (game)
 * - Matching (game)
 * - Fill-in-the-Blank (game)
 *
 * Run: node scripts/seed-weekly-vocab.js
 * Or: npx tsx scripts/seed-weekly-vocab.js (if you prefer tsx)
 *
 * Removes old monthly vocab activities (february, march, april, may) and creates
 * the new weekly ones (feb-3-5, feb-10-12, ... jun-2-4).
 */

const { PrismaClient } = require("@prisma/client");
const { weeklyVocabData } = require("./weekly-vocab-data.js");

const prisma = new PrismaClient();

function getUnitNumber(slug) {
  if (slug.startsWith("feb-")) return 6;
  if (slug.startsWith("mar-")) return 7;
  if (slug.startsWith("apr-")) return 8;
  if (slug.startsWith("may-")) return 9;
  if (slug.startsWith("jun-")) return 10;
  return 6;
}

function generatePacketContent(slug, data) {
  if (!data) return "";
  const unit = getUnitNumber(slug);
  let content = `Unit ${unit}: ${data.topic}\n\n`;
  data.words.forEach((word, idx) => {
    content += `${idx + 1}) ${word.term} — ${word.def}\n`;
    if (word.ex) content += `   Example: ${word.ex}\n`;
    content += "\n";
  });
  return content.trim();
}

function generateFlashcardContent(slug, data) {
  if (!data) return "";
  let content = "";
  data.words.forEach((word, idx) => {
    content += `${idx + 1}) ${word.term} — ${word.def}\n`;
    if (word.ex) content += `   Example: ${word.ex}\n`;
    content += "\n";
  });
  return content.trim();
}

function generateMatchingContent(slug, data) {
  if (!data || !data.words) return "";
  return data.words.map((w) => `${w.term} :: ${w.def}`).join("\n");
}

function generateFillBlankContent(slug, data) {
  if (!data || !data.words) return "";
  let content = "";
  for (const word of data.words) {
    const termLower = word.term.toLowerCase();
    const exLower = (word.ex || "").toLowerCase();
    const firstIndex = exLower.indexOf(termLower);
    let sentence;
    if (firstIndex !== -1 && word.ex) {
      const before = word.ex.substring(0, firstIndex);
      const after = word.ex.substring(firstIndex + word.term.length);
      sentence = before + "_____" + after;
    } else {
      sentence = `Fill in the blank: ${word.term} means ${word.def}.`;
    }
    const availableWords = data.words.filter((w) => w.term !== word.term);
    const numWrong = Math.min(3, availableWords.length);
    const wrongOptions = availableWords
      .sort(() => 0.5 - Math.random())
      .slice(0, numWrong)
      .map((w) => w.term);
    const allOptions = [word.term, ...wrongOptions].sort(() => 0.5 - Math.random());
    content += `Q: ${sentence}\n`;
    content += `A: ${word.term}\n`;
    content += `OPTIONS: ${allOptions.join(", ")}\n`;
    content += `EXPLAIN: ${word.def}\n\n`;
  }
  return content.trim();
}

async function main() {
  const oldMonthlyIds = ["february", "march", "april", "may"];
  const idsToDelete = [];
  for (const month of oldMonthlyIds) {
    idsToDelete.push(`vocab-${month}-packet`);
    idsToDelete.push(`vocab-${month}-flashcards`);
    idsToDelete.push(`vocab-${month}-matching`);
    idsToDelete.push(`vocab-${month}-fillblank`);
  }

  const deleted = await prisma.activity.deleteMany({
    where: { id: { in: idsToDelete } },
  });
  console.log(`Deleted ${deleted.count} old monthly vocab activities.`);

  const slugs = Object.keys(weeklyVocabData);
  for (const slug of slugs) {
    const data = weeklyVocabData[slug];
    if (!data || !data.words || data.words.length === 0) {
      console.warn(`Skipping ${slug}: no words.`);
      continue;
    }

    const unit = getUnitNumber(slug);
    const wordList = data.words.map((w) => w.term).join(", ");

    const packetId = `vocab-${slug}-packet`;
    const flashId = `vocab-${slug}-flashcards`;
    const matchingId = `vocab-${slug}-matching`;
    const fillblankId = `vocab-${slug}-fillblank`;

    const packetContent = generatePacketContent(slug, data);
    const flashContent = generateFlashcardContent(slug, data);
    const matchingContent = generateMatchingContent(slug, data);
    const fillblankContent = generateFillBlankContent(slug, data);

    await prisma.activity.upsert({
      where: { id: packetId },
      update: {
        title: `Unit ${unit}: Word List`,
        category: `Unit ${unit}: Word List`,
        type: "resource",
        description: `Unit ${unit} vocabulary: ${data.topic}. ${wordList}`,
        content: packetContent,
      },
      create: {
        id: packetId,
        title: `Unit ${unit}: Word List`,
        category: `Unit ${unit}: Word List`,
        type: "resource",
        level: "intermediate",
        description: `Unit ${unit} vocabulary: ${data.topic}. ${wordList}`,
        content: packetContent,
      },
    });

    await prisma.activity.upsert({
      where: { id: flashId },
      update: {
        title: `Unit ${unit}: Flash Cards`,
        category: `Unit ${unit}: Flash Cards`,
        type: "game",
        description: `Unit ${unit} flash cards: ${data.topic}`,
        content: flashContent,
      },
      create: {
        id: flashId,
        title: `Unit ${unit}: Flash Cards`,
        category: `Unit ${unit}: Flash Cards`,
        type: "game",
        level: "intermediate",
        description: `Unit ${unit} flash cards: ${data.topic}`,
        content: flashContent,
      },
    });

    await prisma.activity.upsert({
      where: { id: matchingId },
      update: {
        title: `Unit ${unit}: Matching`,
        category: `Unit ${unit}: Matching`,
        type: "game",
        description: `Match terms to definitions for Unit ${unit}: ${data.topic}`,
        content: matchingContent,
      },
      create: {
        id: matchingId,
        title: `Unit ${unit}: Matching`,
        category: `Unit ${unit}: Matching`,
        type: "game",
        level: "intermediate",
        description: `Match terms to definitions for Unit ${unit}: ${data.topic}`,
        content: matchingContent,
      },
    });

    await prisma.activity.upsert({
      where: { id: fillblankId },
      update: {
        title: `Unit ${unit}: Fill-in-the-Blank`,
        category: `Unit ${unit}: Fill-in-the-Blank`,
        type: "game",
        description: `Fill-in-the-blank practice for Unit ${unit}: ${data.topic}`,
        content: fillblankContent,
      },
      create: {
        id: fillblankId,
        title: `Unit ${unit}: Fill-in-the-Blank`,
        category: `Unit ${unit}: Fill-in-the-Blank`,
        type: "game",
        level: "intermediate",
        description: `Fill-in-the-blank practice for Unit ${unit}: ${data.topic}`,
        content: fillblankContent,
      },
    });

    console.log(`✓ ${slug} (Unit ${unit}): ${data.topic} — ${data.words.length} words`);
  }

  console.log(`\n✅ Created/updated ${slugs.length * 4} weekly vocab activities (${slugs.length} weeks × 4 activities each).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
