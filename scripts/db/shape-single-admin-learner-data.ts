import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "marlie";
const ACTIVE_CLASS_CODE = process.env.ACTIVE_CLASS_CODE || "ESOL3";
const STATUS_NOTE = "Moved to independent learner app after class retired";

async function main() {
  const adminUser = await prisma.user.findUnique({
    where: { username: ADMIN_USERNAME },
    select: { id: true, username: true, name: true, role: true },
  });

  if (!adminUser) {
    throw new Error(`Admin user "${ADMIN_USERNAME}" was not found.`);
  }

  const activeClass = await prisma.class.findUnique({
    where: { code: ACTIVE_CLASS_CODE },
    select: { id: true, name: true, code: true, teacherId: true },
  });

  if (!activeClass) {
    throw new Error(`Active class "${ACTIVE_CLASS_CODE}" was not found.`);
  }

  await prisma.user.update({
    where: { id: adminUser.id },
    data: { role: "admin" },
  });

  await prisma.class.update({
    where: { id: activeClass.id },
    data: { teacherId: adminUser.id },
  });

  await prisma.classEnrollment.updateMany({
    where: {
      studentId: adminUser.id,
      status: "active",
    },
    data: {
      status: "exited",
      statusChangedAt: new Date(),
      statusNote: "Converted to one admin/teacher account",
    },
  });

  const activeClassEnrollments = await prisma.classEnrollment.findMany({
    where: {
      classId: activeClass.id,
      status: "active",
      student: {
        isSystemAccount: false,
        role: "student",
      },
    },
    select: { studentId: true },
  });

  const retiredEnrollments = await prisma.classEnrollment.findMany({
    where: {
      classId: { not: activeClass.id },
      status: "active",
      student: {
        isSystemAccount: false,
        role: "student",
      },
    },
    select: {
      id: true,
      studentId: true,
    },
  });

  await prisma.classEnrollment.updateMany({
    where: {
      id: { in: retiredEnrollments.map((enrollment) => enrollment.id) },
    },
    data: {
      status: "exited",
      statusChangedAt: new Date(),
      statusNote: STATUS_NOTE,
    },
  });

  const independentStudentIds = Array.from(new Set(retiredEnrollments.map((enrollment) => enrollment.studentId)));

  console.log(JSON.stringify({
    admin: adminUser.username,
    activeClass: activeClass.code,
    classroomLearners: activeClassEnrollments.length,
    retiredEnrollments: retiredEnrollments.length,
    independentLearnersUpdated: independentStudentIds.length,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
