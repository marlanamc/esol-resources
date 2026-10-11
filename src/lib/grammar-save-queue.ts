/** Retain failed save operations until retry; coalesce concurrent duplicate saves. */
export class GrammarSaveQueue {
    private pending = new Map<string, () => Promise<void>>();
    private running = new Map<string, Promise<boolean>>();
    get pendingCount() { return this.pending.size; }
    run(key: string, operation: () => Promise<void>): Promise<boolean> {
        const active = this.running.get(key);
        if (active) return active;
        this.pending.set(key, operation);
        const result = Promise.resolve().then(operation).then(() => {
            this.pending.delete(key);
            return true;
        }, () => false).finally(() => { this.running.delete(key); });
        this.running.set(key, result);
        return result;
    }
    async retry(): Promise<boolean> {
        const results = await Promise.all([...this.pending].map(([key, operation]) => this.run(key, operation)));
        return results.every(Boolean) && this.pending.size === 0;
    }
}
