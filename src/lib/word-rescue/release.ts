/** Initial rollout: the four FY27 weeks released on October 10, 2026. */
export const RELEASED_RESCUE_COLLECTIONS: ReadonlySet<string> = new Set(['everyday', 'sep-w1', 'sep-w2', 'sep-w4', 'oct-learning']);
export function isRescueMapLinkReleased(href?: string | null) {
  if (!href?.startsWith('/activity/word-rescue?')) return true;
  return RELEASED_RESCUE_COLLECTIONS.has(new URL(href, 'https://myesolclass.com').searchParams.get('collection') ?? '');
}
