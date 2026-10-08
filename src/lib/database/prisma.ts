import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function withSafePoolDefaults(url: string | undefined): string | undefined {
    if (!url) return url;

    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
            return url;
        }

        // Set pool defaults for both dev and production to prevent connection exhaustion
        if (!parsed.searchParams.has("connection_limit")) {
            // In production, serverless runtimes spawn many instances - keep pool small,
            // but not 1: with a single connection, one slow query or open transaction
            // stalls every other request on that instance (Oct 8 2026 outage).
            // Postgres max_connections is 50, so ~12 warm instances x 3 stays well under it.
            // In development, we need enough connections for HMR + parallel queries
            parsed.searchParams.set("connection_limit", process.env.NODE_ENV === "production" ? "3" : "5");
        }
        if (!parsed.searchParams.has("pool_timeout")) {
            // Fail fast instead of queueing requests for 30s behind a stuck connection
            parsed.searchParams.set("pool_timeout", "10");
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
                url: withSafePoolDefaults(process.env.DATABASE_URL || process.env.POSTGRES_URL),
            },
        },
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

globalForPrisma.prisma = prisma;
