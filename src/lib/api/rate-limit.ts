/**
 * Rate limiter for API routes with a pluggable backing store.
 * Use for login, password reset, and other sensitive endpoints.
 *
 * Store selection happens once at module load:
 * - If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, limits
 *   are enforced in Redis and shared across all serverless instances.
 * - Otherwise falls back to per-instance in-memory counting (fine for
 *   development and single-instance deployments).
 *
 * Store failures fail OPEN (request allowed) so a Redis outage can never
 * lock users out of login or password reset.
 */

import { logger } from "@/lib/shared/logger";

export interface RateLimitOptions {
    /** Max requests per window */
    limit: number;
    /** Window duration in seconds */
    windowSeconds: number;
}

interface RateLimitStore {
    /**
     * Increment the counter for `key`, starting a fixed window of
     * `windowMs` on first increment. Returns the count within the window.
     */
    increment(key: string, windowMs: number): Promise<{ count: number }>;
}

class MemoryStore implements RateLimitStore {
    private store = new Map<string, { count: number; resetAt: number }>();

    /** Clean up expired entries periodically */
    private static readonly CLEANUP_INTERVAL_MS = 60_000;
    private lastCleanup = Date.now();

    private cleanup() {
        const now = Date.now();
        if (now - this.lastCleanup < MemoryStore.CLEANUP_INTERVAL_MS) return;
        this.lastCleanup = now;
        for (const [key, entry] of this.store.entries()) {
            if (entry.resetAt < now) this.store.delete(key);
        }
    }

    async increment(key: string, windowMs: number): Promise<{ count: number }> {
        this.cleanup();
        const now = Date.now();
        const entry = this.store.get(key);

        if (!entry || entry.resetAt < now) {
            this.store.set(key, { count: 1, resetAt: now + windowMs });
            return { count: 1 };
        }

        entry.count++;
        return { count: entry.count };
    }
}

/**
 * Upstash Redis REST pipeline: INCR the key and set its expiry only if it
 * has none (fixed window, matching MemoryStore semantics). Uses plain
 * fetch — no SDK dependency.
 */
class UpstashStore implements RateLimitStore {
    constructor(
        private readonly url: string,
        private readonly token: string
    ) {}

    async increment(key: string, windowMs: number): Promise<{ count: number }> {
        const response = await fetch(`${this.url}/pipeline`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify([
                ["INCR", key],
                ["PEXPIRE", key, windowMs.toString(), "NX"],
            ]),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Upstash rate-limit request failed: ${response.status}`);
        }

        const results = (await response.json()) as Array<{ result?: unknown; error?: string }>;
        const incr = results[0];
        if (!incr || typeof incr.result !== "number") {
            throw new Error(incr?.error || "Malformed Upstash rate-limit response");
        }
        return { count: incr.result };
    }
}

function createStore(): RateLimitStore {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
        return new UpstashStore(url.replace(/\/+$/, ""), token);
    }
    return new MemoryStore();
}

const store = createStore();

const DEFAULT_AUTH_OPTIONS: RateLimitOptions = {
    limit: 10,
    windowSeconds: 60,
};

/**
 * Check if the request should be rate limited.
 * @param key - Unique identifier (e.g. IP + action like "login" or "password-reset")
 * @param options - Rate limit configuration
 * @returns true if allowed, false if rate limited
 */
export async function checkRateLimit(
    key: string,
    options: RateLimitOptions = DEFAULT_AUTH_OPTIONS
): Promise<boolean> {
    try {
        const { count } = await store.increment(key, options.windowSeconds * 1000);
        return count <= options.limit;
    } catch (error) {
        logger.error("Rate limit store error; failing open", error);
        return true;
    }
}

/**
 * Get client IP from request headers (Vercel, proxies, etc.)
 * Accepts Request or Headers-like object (e.g. from next/headers).
 */
export function getClientIp(requestOrHeaders: Request | { get(name: string): string | null }): string {
    const getHeader = (name: string) =>
        requestOrHeaders instanceof Request
            ? requestOrHeaders.headers.get(name)
            : requestOrHeaders.get(name);
    const forwarded = getHeader("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0]?.trim() ?? "unknown";
    }
    const realIp = getHeader("x-real-ip");
    if (realIp) return realIp;
    return "unknown";
}

/**
 * Rate limit key for auth actions (login, password reset).
 */
export function authRateLimitKey(request: Request, action: string): string {
    const ip = getClientIp(request);
    return `auth:${action}:${ip}`;
}
