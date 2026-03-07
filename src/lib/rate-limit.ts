/**
 * In-memory rate limiter for API routes.
 * Use for login, password reset, and other sensitive endpoints.
 *
 * Note: In serverless (e.g. Vercel), each instance has isolated memory.
 * For production at scale, consider @upstash/ratelimit with Redis.
 */

const store = new Map<string, { count: number; resetAt: number }>();

/** Clean up expired entries periodically */
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
    lastCleanup = now;
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) store.delete(key);
    }
}

export interface RateLimitOptions {
    /** Max requests per window */
    limit: number;
    /** Window duration in seconds */
    windowSeconds: number;
}

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
export function checkRateLimit(
    key: string,
    options: RateLimitOptions = DEFAULT_AUTH_OPTIONS
): boolean {
    cleanup();
    const now = Date.now();
    const windowMs = options.windowSeconds * 1000;
    const entry = store.get(key);

    if (!entry) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (entry.resetAt < now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }

    entry.count++;
    if (entry.count > options.limit) {
        return false;
    }
    return true;
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
