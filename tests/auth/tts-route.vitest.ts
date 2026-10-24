import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const mocks = vi.hoisted(() => ({ session: vi.fn(), limit: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: mocks.session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/api/rate-limit', () => ({ checkRateLimit: mocks.limit }));
import { POST } from '@/app/api/tts/route';
const request = (text: unknown = 'Hello') => new NextRequest('http://localhost/api/tts', { method: 'POST', body: JSON.stringify({ text }) });
beforeEach(() => {
  vi.clearAllMocks(); vi.stubEnv('ELEVENLABS_API_KEY', 'test-only');
  mocks.session.mockResolvedValue({ user: { id: 'learner' } }); mocks.limit.mockResolvedValue(true);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]))));
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('paid audio request boundary', () => {
  it('rejects anonymous requests before spending credits', async () => {
    mocks.session.mockResolvedValue(null);
    expect((await POST(request())).status).toBe(401);
    expect(mocks.limit).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });
  it.each([123, {}, [], '', 'a'.repeat(501)])('rejects invalid text %s', async text => {
    expect((await POST(request(text))).status).toBe(400); expect(fetch).not.toHaveBeenCalled();
  });
  it('checks account limits with fail-closed semantics before calling the provider', async () => {
    mocks.limit.mockResolvedValueOnce(false);
    expect((await POST(request())).status).toBe(429); expect(fetch).not.toHaveBeenCalled();
    expect(mocks.limit).toHaveBeenCalledWith('tts:minute:learner', { limit: 30, windowSeconds: 60, failClosed: true });
    expect(mocks.limit).toHaveBeenCalledWith('tts:day:learner', { limit: 500, windowSeconds: 86400, failClosed: true });
  });
  it('returns audio for signed-in users with quota and bounds provider duration', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200); expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('api.elevenlabs.io'), expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });
});
