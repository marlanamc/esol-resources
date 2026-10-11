import { runtimeDatabaseUrl } from "./runtime-url";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: runtimeDatabaseUrl(process.env.DATABASE_URL || process.env.POSTGRES_URL),
            },
        },
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

globalForPrisma.prisma = prisma;
