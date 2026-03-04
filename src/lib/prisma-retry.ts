type RetryOptions = {
    maxAttempts?: number;
    baseDelayMs?: number;
};

const RETRYABLE_PRISMA_CODES = new Set(["P2024"]);

function getErrorCode(error: unknown): string | null {
    if (!error || typeof error !== "object") return null;
    const maybeCode = (error as { code?: unknown }).code;
    return typeof maybeCode === "string" ? maybeCode : null;
}

function isRetryablePrismaError(error: unknown): boolean {
    const code = getErrorCode(error);
    return code !== null && RETRYABLE_PRISMA_CODES.has(code);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withPrismaReadRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const maxAttempts = Math.max(1, options.maxAttempts ?? 3);
    const baseDelayMs = Math.max(25, options.baseDelayMs ?? 150);

    let attempt = 1;
    while (true) {
        try {
            return await operation();
        } catch (error) {
            const canRetry = isRetryablePrismaError(error) && attempt < maxAttempts;
            if (!canRetry) {
                throw error;
            }

            const backoffMs = baseDelayMs * 2 ** (attempt - 1);
            await sleep(backoffMs);
            attempt += 1;
        }
    }
}
