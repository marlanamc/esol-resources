/**
 * One-off script: Create student Karina (username: karina) and enroll in Marlie's class (ESOL3).
 * Run: npx tsx scripts/add-student-karina.ts
 * Password: set DEV_SEED_ACCOUNT_PASSWORD (same as seed) or ADD_STUDENT_PASSWORD (min 12 chars).
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;
const MARLIE_CLASS_CODE = "ESOL3";
const MIN_PASSWORD_LENGTH = 12;

function getPassword(): string {
  const fromSeed = process.env.DEV_SEED_ACCOUNT_PASSWORD?.trim();
  if (fromSeed && fromSeed.length >= MIN_PASSWORD_LENGTH) return fromSeed;
  const oneOff = process.env.ADD_STUDENT_PASSWORD?.trim();
  if (oneOff && oneOff.length >= MIN_PASSWORD_LENGTH) return oneOff;
  throw new Error(
    `Set DEV_SEED_ACCOUNT_PASSWORD or ADD_STUDENT_PASSWORD (min ${MIN_PASSWORD_LENGTH} chars), then run again.`
  );
}

async function main() {
  const username = "karina";
  const name = "Karina";
  const role = "student";

  // 1. Find Marlie's class (ESOL3)
  const classRecord = await prisma.class.findUnique({
    where: { code: MARLIE_CLASS_CODE },
  });
  if (!classRecord) {
    throw new Error(`Class with code "${MARLIE_CLASS_CODE}" not found. Run seed first.`);
  }

  // 2. Create or update student
  const passwordHash = await bcrypt.hash(getPassword(), BCRYPT_ROUNDS);
  const student = await prisma.user.upsert({
    where: { username },
    update: { name, role },
    create: {
      username,
      name,
      password: passwordHash,
      role,
      mustChangePassword: true,
    },
  });
  console.log(`✅ Student: ${student.name} (${student.username})`);

  // 3. Enroll in Marlie's class
  await prisma.classEnrollment.upsert({
    where: {
      classId_studentId: {
        classId: classRecord.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      classId: classRecord.id,
      studentId: student.id,
    },
  });
  console.log(`✅ Enrolled in class: ${classRecord.name} (${MARLIE_CLASS_CODE})`);
  console.log("\n✨ Done. Karina can log in with the password you used (DEV_SEED_ACCOUNT_PASSWORD or ADD_STUDENT_PASSWORD).");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
