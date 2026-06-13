import { prisma } from "@/lib/prisma";
export async function POST() {
  await prisma.user.update({ where: { id }, data: { points: { increment: 10 } } });
  return Response.json({ ok: true });
}
