import { prisma } from "@/lib/prisma";
export async function POST() {
  await prisma.pointsLedger.create({ data: { userId, points: 5, weeklyPoints: 5 } });
}
