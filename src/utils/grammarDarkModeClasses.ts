import { getGrammarDarkClassNames } from "@/lib/grammar-dark-style-matchers";

/**
 * Walk all elements with a `style` attribute inside `container` and add
 * semantic CSS classes based on the inline style patterns found.
 *
 * Runs once per call – designed to be invoked from useLayoutEffect so the
 * classes are present before the first paint.
 */
export function applyGrammarDarkClasses(container: HTMLElement): void {
  const styled = container.querySelectorAll<HTMLElement>("[style]");
  for (let i = 0; i < styled.length; i++) {
    const el = styled[i];
    const s = el.getAttribute("style") || "";
    const classes = getGrammarDarkClassNames(s);
    if (classes.length > 0) {
      el.classList.add(...classes);
    }
  }
}
