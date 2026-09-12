/**
 * Client-safe constants for the active teaching class.
 * Kept apart from `active-class.ts` so client components can import the cookie
 * name without pulling in Prisma / next/headers.
 */
export const TEACH_CLASS_COOKIE = "teach-active-class";
