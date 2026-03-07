import { useLayoutEffect, type RefObject } from "react";
import { applyGrammarDarkClasses } from "@/utils/grammarDarkModeClasses";

/**
 * After grammar HTML is injected via dangerouslySetInnerHTML, walk the
 * container and tag styled elements with semantic CSS classes so that
 * dark-mode overrides can use cheap class selectors instead of expensive
 * `[style*="..."]` attribute selectors.
 *
 * Uses useLayoutEffect to ensure classes are applied before the browser
 * paints, preventing a flash of wrong colours in dark mode.
 */
export function useGrammarDarkClasses(
  ref: RefObject<HTMLElement | null>,
  /** Change this value whenever the inner HTML changes to re-classify. */
  contentKey: string | undefined,
): void {
  useLayoutEffect(() => {
    if (ref.current) {
      applyGrammarDarkClasses(ref.current);
    }
  }, [ref, contentKey]);
}
