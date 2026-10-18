/** Retain failed save operations until retry; coalesce concurrent duplicate saves. */
export class GrammarSaveQueue {
    private pending = new Map<string, () => Promise<void>>();
    private running = new Map<string, Promise<boolean>>();
    private failed = new Set<string>();
    get pendingCount() { return this.pending.size; }
    get failedCount() { return this.failed.size; }
    run(key: string, operation: () => Promise<void>): Promise<boolean> {
        const active = this.running.get(key);
        if (active) return active;
        this.pending.set(key, operation);
        const result = Promise.resolve().then(operation).then(() => {
            this.pending.delete(key);
            this.failed.delete(key);
            return true;
        }, () => {
            this.failed.add(key);
            return false;
        }).finally(() => { this.running.delete(key); });
        this.running.set(key, result);
        return result;
    }
    async retry(): Promise<boolean> {
        for (const [key, operation] of [...this.pending]) {
            await this.run(key, operation);
        }
        return this.pending.size === 0;
    }
}
