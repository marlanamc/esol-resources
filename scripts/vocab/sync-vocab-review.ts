import { PrismaClient } from "@prisma/client";
import { syncVocabReviewCatalog } from "../../src/lib/vocab-review";

const prisma = new PrismaClient();

async function main() {
  const result = await syncVocabReviewCatalog(prisma);
  console.log(
    `Synced vocab review catalog: ${result.total} cards (${result.created} created, ${result.updated} updated, ${result.deleted} deleted).`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
