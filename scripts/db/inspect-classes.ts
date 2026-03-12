
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const codes = ["G54UEU", "ESOL3"];
  const classes = await prisma.class.findMany({
    where: {
      code: { in: codes }
    },
    include: {
      assignments: {
        where: { isFeatured: true },
        include: {
          activity: true
        }
      }
    }
  });

  console.log(JSON.stringify(classes, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
