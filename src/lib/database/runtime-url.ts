/** Runtime only: migrations/backups continue using the original direct URL. */
export function runtimeDatabaseUrl(url: string | undefined, production = process.env.NODE_ENV === "production"): string | undefined {
    if (!url) return url;
    try {
        const parsed = new URL(url);
        if (!["postgres:", "postgresql:"].includes(parsed.protocol)) return url;
        // Prisma's documented transaction pooler uses the same credentials/database.
        // Never rewrite other providers or local databases.
        if (production && parsed.hostname === "db.prisma.io") {
            parsed.hostname = "pooled.db.prisma.io";
        }
        if (parsed.hostname === "pooled.db.prisma.io") {
            parsed.searchParams.set("pgbouncer", "true");
        }
        if (!parsed.searchParams.has("connection_limit")) parsed.searchParams.set("connection_limit", production ? "3" : "5");
        if (!parsed.searchParams.has("pool_timeout")) parsed.searchParams.set("pool_timeout", "10");
        if (!parsed.searchParams.has("connect_timeout")) parsed.searchParams.set("connect_timeout", "5");
        return parsed.toString();
    } catch {
        return url;
    }
}
