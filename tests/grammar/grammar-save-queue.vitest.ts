import { describe, expect, it, vi } from 'vitest';
import { GrammarSaveQueue } from '@/lib/grammar-save-queue';

describe('grammar save retry queue', () => {
    it('does not report a slow save as failed when another save finishes', async () => {
        const queue = new GrammarSaveQueue();
        let finish!: () => void;
        const slow = queue.run('slow', () => new Promise<void>(resolve => { finish = resolve; }));
        await queue.run('fast', async () => {});
        expect(queue.pendingCount).toBe(1);
        expect(queue.failedCount).toBe(0);
        finish();
        await slow;
        expect(queue.pendingCount).toBe(0);
        expect(queue.failedCount).toBe(0);
    });

    it('clears the failure after recovery while another save is still running', async () => {
        const queue = new GrammarSaveQueue();
        await queue.run('failed', async () => { throw new Error('offline'); });
        expect(queue.failedCount).toBe(1);
        let finish!: () => void;
        const slow = queue.run('slow', () => new Promise<void>(resolve => { finish = resolve; }));
        await queue.run('failed', async () => {});
        expect(queue.failedCount).toBe(0);
        expect(queue.pendingCount).toBe(1);
        finish();
        await slow;
    });

    it('retries other work even when the first pending save keeps failing', async () => {
        const queue = new GrammarSaveQueue();
        const recoverable = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined);
        await queue.run('blocked', async () => { throw new Error('unavailable'); });
        await queue.run('recoverable', recoverable);
        expect(await queue.retry()).toBe(false);
        expect(recoverable).toHaveBeenCalledTimes(2);
        expect(queue.pendingCount).toBe(1);
        expect(queue.failedCount).toBe(1);
    });

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
