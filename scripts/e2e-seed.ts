/**
 * Ensures E2E test users exist with mustChangePassword=false for login flows.
 * Run after prisma migrate deploy, before or after db:seed.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;
const PASSWORD = "password123";

async function main() {
  const hash = await bcrypt.hash(PASSWORD, BCRYPT_ROUNDS);

  await prisma.user.upsert({
    where: { username: "e2e-teacher" },
    update: { password: hash, mustChangePassword: false },
    create: {
      username: "e2e-teacher",
      name: "E2E Teacher",
      password: hash,
      role: "teacher",
      mustChangePassword: false,
    },
  });

  const student = await prisma.user.upsert({
    where: { username: "e2e-student" },
    update: { password: hash, mustChangePassword: false },
    create: {
      username: "e2e-student",
      name: "E2E Student",
      password: hash,
      role: "student",
      mustChangePassword: false,
    },
  });

  const teacher = await prisma.user.findUnique({ where: { username: "e2e-teacher" } });
  if (teacher) {
    const cls = await prisma.class.upsert({
      where: { code: "E2ETEST" },
      update: {},
      create: {
        name: "E2E Test Class",
        code: "E2ETEST",
        teacherId: teacher.id,
      },
    });
    await prisma.classEnrollment.upsert({
      where: { classId_studentId: { classId: cls.id, studentId: student!.id } },
      update: {},
      create: { classId: cls.id, studentId: student!.id },
    });
  }

  console.log("E2E test users ready: e2e-teacher / e2e-student, password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
