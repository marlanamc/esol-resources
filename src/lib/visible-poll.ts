/** Non-overlapping polling with bounded backoff; background/offline pages send no requests. */
export function startVisiblePoll(operation: () => Promise<boolean | void>, intervalMs = 3000) {
    let stopped = false;
    let running = false;
    let failures = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const available = () => document.visibilityState !== "hidden" && navigator.onLine;
    const schedule = () => {
        clearTimeout(timer);
        if (!stopped && available()) timer = setTimeout(run, Math.min(60000, intervalMs * 2 ** Math.min(failures, 5)) + Math.random() * 700);
    };
    const run = async () => {
        if (stopped || running || !available()) return;
        running = true;
        try {
            if (await operation() === false) stopped = true;
            failures = 0;
        } catch { failures++; }
        finally { running = false; schedule(); }
    };
    const resume = () => {
        clearTimeout(timer);
        if (!running) schedule();
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    window.addEventListener("offline", resume);
    void run();
    return () => {
        stopped = true; clearTimeout(timer);
        document.removeEventListener("visibilitychange", resume);
        window.removeEventListener("online", resume); window.removeEventListener("offline", resume);
    };
}
