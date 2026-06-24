/**
 * One-off: Set Matt's password to ChangeMe123!
 * Run: npx tsx scripts/set-matt-password.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS } from "@/lib/auth/config";

const prisma = new PrismaClient();
const NEW_PASSWORD = "ChangeMe123!";

async function main() {
  const user = await prisma.user.findFirst({
    where: { username: { equals: "matt", mode: "insensitive" } },
  });
  if (!user) {
    throw new Error('User "matt" not found in database.');
  }
  const hash = await bcrypt.hash(NEW_PASSWORD, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hash, mustChangePassword: true },
  });
  console.log(`✅ Password updated for ${user.name ?? user.username} (${user.username}). New password: ${NEW_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error("❌", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
