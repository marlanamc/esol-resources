import { describe, expect, it, vi } from 'vitest';
import { GrammarSaveQueue } from '@/lib/grammar-save-queue';

describe('grammar save retry queue', () => {
    it('retains failed evidence and retries without repeating successful saves', async () => {
        const queue = new GrammarSaveQueue();
        const exercise = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined);
        const quiz = vi.fn().mockResolvedValue(undefined);
        expect(await queue.run('exercise', exercise)).toBe(false);
        expect(await queue.run('quiz', quiz)).toBe(true);
        expect(queue.pendingCount).toBe(1);
        expect(await queue.retry()).toBe(true);
        expect(exercise).toHaveBeenCalledTimes(2);
        expect(quiz).toHaveBeenCalledOnce();
        expect(queue.pendingCount).toBe(0);
    });
    it('coalesces double taps and waits for in-flight saves before finishing', async () => {
        const queue = new GrammarSaveQueue();
        let resolve!: () => void;
        const operation = vi.fn(() => new Promise<void>(done => { resolve = done; }));
        const first = queue.run('quiz', operation);
        const second = queue.run('quiz', operation);
        expect(first).toBe(second);
        await Promise.resolve();
        const retry = queue.retry();
        resolve();
        expect(await retry).toBe(true);
        expect(operation).toHaveBeenCalledOnce();
    });
    it('keeps failures pending when another retry fails', async () => {
        const queue = new GrammarSaveQueue();
        await queue.run('quiz', async () => { throw new Error('offline'); });
        expect(await queue.retry()).toBe(false);
        expect(queue.pendingCount).toBe(1);
    });
});
