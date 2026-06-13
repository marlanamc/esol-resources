export async function awardPoints(userId, points) {
  await db.user.update({ where: { id: userId }, data: { points: { increment: points }, weeklyPoints: { increment: points } } });
  await db.pointsLedger.create({ data: { userId, points } });
}
