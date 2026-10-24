import { afterEach, expect, it, vi } from 'vitest';
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });
it('paid work fails closed during a store outage while login retains its policy', async () => {
  vi.resetModules(); vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test'); vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-only');
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  const { checkRateLimit } = await import('@/lib/api/rate-limit');
  expect(await checkRateLimit('paid', { limit: 5, windowSeconds: 60, failClosed: true })).toBe(false);
  expect(await checkRateLimit('login', { limit: 5, windowSeconds: 60 })).toBe(true);
});
