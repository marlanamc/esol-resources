/**
 * Three mutually exclusive content kinds — never conflate them.
 *
 *   practice   — evergreen Practice Library, always open when released
 *   map        — Course Map activity, access gated by ClassReveal
 *   assignment — explicitly assigned with a due date (few timed items)
 */
export const CONTENT_KINDS = ["practice", "map", "assignment"] as const;
export type ContentKind = (typeof CONTENT_KINDS)[number];

export const PRACTICE: ContentKind = "practice";
export const MAP: ContentKind = "map";
export const ASSIGNMENT: ContentKind = "assignment";

/** Prisma WHERE clause for the practice library */
export const PRACTICE_LIBRARY_WHERE = {
  contentKind: PRACTICE,
  deletedAt: null,
} as const;

/** Prisma WHERE clause for map activities */
export const MAP_WHERE = {
  contentKind: MAP,
  deletedAt: null,
} as const;

/** Prisma WHERE clause for timed assignments */
export const ASSIGNMENT_WHERE = {
  contentKind: ASSIGNMENT,
  deletedAt: null,
} as const;

export function isPractice(a: { contentKind?: string | null }): boolean {
  return a.contentKind === PRACTICE;
}

export function isMapKind(a: { contentKind?: string | null }): boolean {
  return a.contentKind === MAP;
}

export function isAssignment(a: { contentKind?: string | null }): boolean {
  return a.contentKind === ASSIGNMENT;
}
