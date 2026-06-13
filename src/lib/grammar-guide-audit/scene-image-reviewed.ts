/**
 * Human-approved scene photos for the mini grammar guides.
 *
 * The scene-image heuristic (rules-image-context.ts) is deliberately conservative
 * and produces some false positives, so it is never a blind hard gate. Instead,
 * the gate (scripts/checks/audit-scene-images.ts) fails only when a scene is
 * heuristic-flagged AND its key is NOT listed here. A flagged scene is cleared by
 * either swapping the photo so it stops being flagged, or — if the photo is
 * actually fine — adding its key below after eyeballing it in the contact sheet.
 *
 * Keys are `"<slug>#<sceneId>"`. To populate or extend this list:
 *   1. npm run audit:mini-guide-images   (opens the visual contact sheet)
 *   2. Click ✓ on each photo you've verified, then "Copy approved list".
 *   3. Paste the copied keys below.
 * Or seed/refresh the current flagged set with:
 *   npm run audit:scene-images -- --list
 *
 * Entries seeded as a baseline are pre-existing flags awaiting review — removing
 * one means "I've fixed or approved this scene." New mismatches that are not in
 * this set will fail the gate.
 */

export const REVIEWED_SCENE_IMAGES: ReadonlySet<string> = new Set<string>([
  // The 2026-06-13 baseline of 8 grandfathered flags was worked down: each scene
  // photo was swapped (scripts/content/swap-mini-guide-images.ts) until the
  // rules-image-context heuristic no longer flags it, so no standing approvals are
  // needed. New mismatches added here mean "I've eyeballed this photo and it's fine."
]);

export function isSceneImageReviewed(slug: string, sceneId: string): boolean {
  return REVIEWED_SCENE_IMAGES.has(`${slug}#${sceneId}`);
}
