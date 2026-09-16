import { prisma } from '@/lib/database/prisma';

// The Level 1 course path (prisma/seed-level1-course-path.ts) was retired in
// favor of the COURSE_MAP_UNITS-backed course map (src/lib/course-map-data.ts).
// Run this once to clear any Assignment.unitLabel/sequenceNumber rows it left
// behind, so the LegacyCoursePath fallback can't show the stale "Unit 1:
// Simple Tense Review" labels to students whose class hasn't had a
// CourseMapItem week revealed yet.
const STALE_LABELS = [
  'Unit 1: Simple Tense Review',
  'Unit 2: Past Simple',
  'Unit 3: Continuous Tenses',
];

async function main() {
  try {
    const existing = await prisma.assignment.findMany({
      where: { unitLabel: { in: STALE_LABELS } },
      select: { id: true, classId: true, unitLabel: true },
    });

    if (existing.length === 0) {
      console.log('No assignments carry the stale Level 1 unit labels. Nothing to do.');
      return;
    }

    console.log(`Found ${existing.length} assignment(s) with stale Level 1 labels:`);
    for (const label of STALE_LABELS) {
      const count = existing.filter((a) => a.unitLabel === label).length;
      if (count > 0) console.log(`  • "${label}": ${count}`);
    }

    const cleared = await prisma.assignment.updateMany({
      where: { unitLabel: { in: STALE_LABELS } },
      data: { sequenceNumber: null, unitLabel: null },
    });

    console.log(`\nCleared ${cleared.count} stale assignment label(s).`);
  } catch (error) {
    console.error('Error clearing stale Level 1 labels:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
