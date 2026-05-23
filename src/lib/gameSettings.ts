"use client";

// Per-game settings client helper.
//
// Storage strategy:
//   - Authenticated users: server-persisted under UserPreferences.gameSettings[gameId].
//     Settings round-trip through GET/POST /api/user/preferences.
//   - Anonymous users: localStorage only (key: `game-settings:<gameId>`).
//   - Save is debounced ~500ms per game id so dragging a slider doesn't hammer the API.
//
// The shape of an entry is opaque to this helper — each game owns its own schema.

type Entry = Record<string, unknown>;

const LS_PREFIX = "game-settings:";
const SAVE_DEBOUNCE_MS = 500;

function lsKey(gameId: string): string {
    return `${LS_PREFIX}${gameId}`;
}

function readLocal<T extends Entry>(gameId: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(lsKey(gameId));
        if (!raw) return null;
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
        return parsed as T;
    } catch {
        return null;
    }
}

function writeLocal(gameId: string, value: Entry): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(lsKey(gameId), JSON.stringify(value));
    } catch {
        // Quota / disabled storage — ignore. In-memory state still works.
    }
}

/**
 * Fetch settings for one game. Tries the server first; falls back to
 * localStorage on 401 or network failure. Returns null if nothing stored.
 */
export async function fetchGameSettings<T extends Entry>(gameId: string): Promise<T | null> {
    try {
        const res = await fetch("/api/user/preferences", { credentials: "include" });
        if (res.ok) {
            const data = (await res.json()) as { gameSettings?: Record<string, T> };
            const entry = data.gameSettings?.[gameId];
            if (entry && typeof entry === "object") return entry;
        }
        // 401 or other → fall through to localStorage
    } catch {
        // Network down — also fall through
    }
    return readLocal<T>(gameId);
}

// Debounce per game id so two games never share a timer.
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();
const pendingValues = new Map<string, Entry>();

async function flush(gameId: string): Promise<void> {
    const value = pendingValues.get(gameId);
    pendingTimers.delete(gameId);
    pendingValues.delete(gameId);
    if (!value) return;

    // Always mirror to localStorage so anonymous + offline still works.
    writeLocal(gameId, value);

    try {
        await fetch("/api/user/preferences", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameSettings: { [gameId]: value } }),
        });
        // 401 is fine — anonymous user already has their localStorage copy.
    } catch {
        // Ignore — localStorage is the source of truth for offline.
    }
}

/**
 * Save settings for one game. Debounced ~500ms; the latest value wins.
 * Resolves immediately (the save is fire-and-forget by design — callers
 * shouldn't block the UI on a settings write).
 */
export function saveGameSettings(gameId: string, value: Entry): void {
    pendingValues.set(gameId, value);
    const existing = pendingTimers.get(gameId);
    if (existing) clearTimeout(existing);
    const t = setTimeout(() => {
        void flush(gameId);
    }, SAVE_DEBOUNCE_MS);
    pendingTimers.set(gameId, t);
}

/** Force any pending save to flush now. Useful before navigation. */
export async function flushGameSettings(gameId: string): Promise<void> {
    const t = pendingTimers.get(gameId);
    if (t) clearTimeout(t);
    await flush(gameId);
}
