/**
 * Avatar cache for instant header paint:
 * - Server props (preferred) for first HTML
 * - In-memory + localStorage so client navigations / hard refresh stay smooth
 */

import {
  DEFAULT_AVATAR,
  DEFAULT_COLOR,
  isValidAvatarId,
  isValidColorId,
} from "@/lib/avatar-constants";

export type CachedAvatar = {
  avatar: string;
  avatarColor: string;
};

const STORAGE_KEY = "class-companion:avatar";
export const AVATAR_UPDATED_EVENT = "class-companion:avatar-updated";
const MEMORY_TTL_MS = 60_000;

type MemoryCache = {
  data: CachedAvatar;
  cachedAt: number;
};

let memoryCache: MemoryCache | null = null;
let inFlight: Promise<CachedAvatar | null> | null = null;

function normalize(
  avatar?: string | null,
  avatarColor?: string | null,
): CachedAvatar {
  return {
    avatar:
      avatar && isValidAvatarId(avatar) ? avatar : DEFAULT_AVATAR,
    avatarColor:
      avatarColor && isValidColorId(avatarColor)
        ? avatarColor
        : DEFAULT_COLOR,
  };
}

export function readCachedAvatar(): CachedAvatar | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedAvatar>;
    if (
      typeof parsed.avatar !== "string" ||
      !isValidAvatarId(parsed.avatar) ||
      typeof parsed.avatarColor !== "string" ||
      !isValidColorId(parsed.avatarColor)
    ) {
      return null;
    }
    return { avatar: parsed.avatar, avatarColor: parsed.avatarColor };
  } catch {
    return null;
  }
}

export function writeCachedAvatar(avatar: string, avatarColor: string): void {
  const next = normalize(avatar, avatarColor);
  memoryCache = { data: next, cachedAt: Date.now() };
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures
  }
  window.dispatchEvent(
    new CustomEvent<CachedAvatar>(AVATAR_UPDATED_EVENT, { detail: next }),
  );
}

export function getFreshMemoryAvatar(): CachedAvatar | null {
  if (!memoryCache) return null;
  if (Date.now() - memoryCache.cachedAt > MEMORY_TTL_MS) return null;
  return memoryCache.data;
}

/**
 * SSR-safe initial value. Prefer explicit server props; never read
 * localStorage here (hydration mismatch).
 */
export function resolveServerAvatar(
  initial?: Partial<CachedAvatar> | null,
): CachedAvatar {
  return normalize(initial?.avatar, initial?.avatarColor);
}

/**
 * Client-only bootstrap after mount: memory → localStorage → null.
 */
export function resolveClientCachedAvatar(): CachedAvatar | null {
  return getFreshMemoryAvatar() ?? readCachedAvatar();
}

export async function fetchAndCacheAvatar(): Promise<CachedAvatar | null> {
  const fresh = getFreshMemoryAvatar();
  if (fresh) return fresh;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const res = await fetch("/api/user/avatar");
      if (!res.ok) return null;
      const data = (await res.json()) as {
        avatar?: string | null;
        avatarColor?: string | null;
      };
      const next = normalize(data.avatar, data.avatarColor);
      writeCachedAvatar(next.avatar, next.avatarColor);
      return next;
    } catch {
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
