// Results objects live for one completed round. Reusing the object for a retry
// reuses its key; the next genuine round gets a new object and a fresh key.
const keys = new WeakMap<object, string>();
export function practiceAttemptKey(results: object): string {
    let key = keys.get(results);
    if (!key) {
        key = crypto.randomUUID();
        keys.set(results, key);
    }
    return key;
}
