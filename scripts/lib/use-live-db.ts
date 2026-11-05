import path from "node:path";
import { config as loadDotenv } from "dotenv";

/**
 * Point this script at the LIVE production database (real class data).
 *
 * Local `.env` / `.env.local` point at the `prisma dev` database so day-to-day
 * development doesn't burn billed Prisma Postgres operations. Scripts that need
 * real class data (Monday slides, practice log replies) call this before creating
 * a PrismaClient. The live URLs live in the git-ignored `.env.production-db`.
 */
export function useLiveDatabase(): void {
    const file = path.join(__dirname, "../../.env.production-db");
    const result = loadDotenv({ path: file, override: true, quiet: true });
    if (result.error) {
        throw new Error(
            `Missing ${file}. Copy DATABASE_URL (and POSTGRES_URL) for the live database from Vercel into it.`,
        );
    }
}
