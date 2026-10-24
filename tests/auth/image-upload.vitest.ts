import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const mocks = vi.hoisted(() => ({ session: vi.fn(), put: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession: mocks.session }));
vi.mock('@/lib/auth/auth', () => ({ authOptions: {} }));
vi.mock('@vercel/blob', () => ({ put: mocks.put }));
import { POST } from '@/app/api/upload/image/route';
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token'); mocks.session.mockResolvedValue({ user: { role: 'teacher' } }); });
afterEach(() => vi.unstubAllEnvs());
function request(type = 'image/png', size = 3) {
  const form = new FormData(); form.set('file', new File([new Uint8Array(size)], 'image.png', { type }));
  return new NextRequest('http://localhost/api/upload/image', { method: 'POST', body: form });
}
it('returns the durable storage URL after the provider confirms upload', async () => {
  mocks.put.mockResolvedValue({ url: 'https://test.public.blob.vercel-storage.com/activities/image.png' });
  const response = await POST(request());
  expect(response.status).toBe(200); expect(await response.json()).toEqual({ url: 'https://test.public.blob.vercel-storage.com/activities/image.png' });
  expect(mocks.put).toHaveBeenCalledWith(expect.stringMatching(/^activities\/.*\.png$/), expect.anything(), expect.objectContaining({ access: 'public', contentType: 'image/png' }));
});
it('fails visibly when storage is missing or rejects the upload', async () => {
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', ''); expect((await POST(request())).status).toBe(503); expect(mocks.put).not.toHaveBeenCalled();
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test'); mocks.put.mockRejectedValue(new Error('offline'));
  expect((await POST(request())).status).toBe(502);
});
it('rejects students, unsupported files, and oversized images before uploading', async () => {
  mocks.session.mockResolvedValue({ user: { role: 'student' } }); expect((await POST(request())).status).toBe(403);
  mocks.session.mockResolvedValue({ user: { role: 'teacher' } });
  expect((await POST(request('text/html'))).status).toBe(400);
  expect((await POST(request('image/png', 5 * 1024 * 1024 + 1))).status).toBe(400);
  expect(mocks.put).not.toHaveBeenCalled();
});
