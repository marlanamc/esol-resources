export function asObject(value: unknown): Record<string, unknown> | null {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    return null;
}

export function asBoolean(value: unknown): boolean {
    return value === true;
}

export function asNumber(value: unknown): number | null {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function readIdempotencyKey(request: Request): string | null {
    const key = request.headers.get("x-idempotency-key");
    if (!key) return null;
    const trimmed = key.trim();
    return trimmed.length > 0 ? trimmed : null;
}

export function getProgressIdempotencyKey(
    categoryData: Record<string, unknown> | null
): string | null {
    if (!categoryData) return null;
    const idempotencyValue = categoryData.pwaLastProgressIdempotencyKey;
    return typeof idempotencyValue === "string" && idempotencyValue.trim().length > 0
        ? idempotencyValue
        : null;
}

export function sanitizeGuideCompletedSectionIds(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined;

    const cleaned = value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .slice(0, 200);

    if (cleaned.length === 0) return undefined;
    return Array.from(new Set(cleaned));
}

export const VOCAB_PROGRESS_TYPES = [
    "word-list",
    "flashcards",
    "matching",
    "fill-blank",
] as const;

export type VocabProgressType = (typeof VOCAB_PROGRESS_TYPES)[number];

export function isVocabProgressType(value: unknown): value is VocabProgressType {
    return (
        typeof value === "string" &&
        (VOCAB_PROGRESS_TYPES as readonly string[]).includes(value)
    );
}

export function parseExistingCategoryData(raw: string | null | undefined): Record<string, unknown> {
    if (!raw) return {};
    try {
        return JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return {};
    }
}
