import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function withSafePoolDefaults(url: string | undefined): string | undefined {
    if (!url) return url;

    // Serverless runtimes can spawn many instances; keep each client pool small
    // and allow a bit more time to wait for a free connection.
    if (process.env.NODE_ENV !== "production") return url;

    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
            return url;
        }

        if (!parsed.searchParams.has("connection_limit")) {
            parsed.searchParams.set("connection_limit", "1");
        }
        if (!parsed.searchParams.has("pool_timeout")) {
            parsed.searchParams.set("pool_timeout", "30");
        }
        return parsed.toString();
    } catch {
        return url;
    }
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: withSafePoolDefaults(process.env.POSTGRES_URL),
            },
        },
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
