/**
 * Runtime class injection for grammar guide dark mode.
 *
 * Replaces ~100 expensive CSS `[style*="..."]` attribute selectors with a
 * one-time DOM walk that adds lightweight semantic classes.  The browser
 * then uses simple class selectors for dark-mode overrides instead of
 * substring-matching every element's style attribute on every style recalc.
 */

type Rule = { test: (s: string) => boolean; cls: string };

const BG_WHITE_RE =
  /background(?:-color)?:\s*(?:white|#fff(?:fff)?(?:\b|;))/i;
const BG_NEAR_WHITE_RE =
  /background:\s*#fff[5-9a-f]/i;

const rules: Rule[] = [
  // ── Background: white / near-white ──
  { test: (s) => BG_WHITE_RE.test(s), cls: "gc-bg-white" },
  { test: (s) => BG_NEAR_WHITE_RE.test(s), cls: "gc-bg-white" },

  // ── Background: light neutrals ──
  { test: (s) => s.includes("#f8fafc"), cls: "gc-bg-slate" },
  { test: (s) => s.includes("#fdfbf7"), cls: "gc-bg-slate" },
  { test: (s) => s.includes("#f4f1ea"), cls: "gc-bg-slate" },
  { test: (s) => s.includes("#fef9f3"), cls: "gc-bg-slate" },

  // ── Background: semantic colors ──
  { test: (s) => /background[^:]*:\s*#fef9c3/i.test(s), cls: "gc-bg-yellow" },
  { test: (s) => /background[^:]*:\s*#fef3c7/i.test(s), cls: "gc-bg-amber" },
  { test: (s) => /background[^:]*:\s*#fff7ed/i.test(s), cls: "gc-bg-orange" },
  { test: (s) => /background[^:]*:\s*(?:#fff9e6|#fffbeb)/i.test(s), cls: "gc-bg-amber" },
  { test: (s) => /background[^:]*:\s*#fef2f2/i.test(s), cls: "gc-bg-red" },
  { test: (s) => /background[^:]*:\s*#fdf2f8/i.test(s), cls: "gc-bg-pink" },
  { test: (s) => /background[^:]*:\s*(?:#f0fdf4|#ecfdf5)/i.test(s), cls: "gc-bg-green" },
  { test: (s) => /background[^:]*:\s*(?:#eff6ff)/i.test(s), cls: "gc-bg-blue" },
  { test: (s) => /background[^:]*:\s*(?:#faf5ff|#f5f3ff)/i.test(s), cls: "gc-bg-purple" },
  { test: (s) => /background[^:]*:\s*#ede9fe/i.test(s), cls: "gc-bg-violet" },
  { test: (s) => /background[^:]*:\s*(?:#ecfeff)/i.test(s), cls: "gc-bg-cyan" },
  { test: (s) => /background[^:]*:\s*#cbd5e1/i.test(s), cls: "gc-bg-slate-300" },

  // ── Badge / inline span backgrounds ──
  { test: (s) => /background[^:]*:\s*#dbeafe/i.test(s), cls: "gc-badge-blue" },
  { test: (s) => /background[^:]*:\s*#fed7aa/i.test(s), cls: "gc-badge-orange" },
  { test: (s) => /background[^:]*:\s*#fee2e2/i.test(s), cls: "gc-badge-red" },
  { test: (s) => /background[^:]*:\s*(?:#cffafe|#a5f3fc)/i.test(s), cls: "gc-badge-cyan" },
  { test: (s) => /background[^:]*:\s*(?:#f3e8ff|#e9d5ff)/i.test(s), cls: "gc-badge-purple-light" },
  { test: (s) => /background[^:]*:\s*#c4b5fd/i.test(s), cls: "gc-badge-purple-med" },
  { test: (s) => /background[^:]*:\s*(?:#d97757)/i.test(s), cls: "gc-badge-terracotta" },
  { test: (s) => /background[^:]*:\s*#0369a1/i.test(s), cls: "gc-badge-sky" },

  // ── Gradients ──
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(245, 158, 11"), cls: "gc-grad-amber" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(240, 180, 90"), cls: "gc-grad-amber" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(139, 92, 246"), cls: "gc-grad-purple" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(99, 102, 241"), cls: "gc-grad-purple" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(200, 107, 81"), cls: "gc-grad-terracotta" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(248, 113, 113"), cls: "gc-grad-red" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(133, 196, 255"), cls: "gc-grad-cyan" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(6, 182, 212"), cls: "gc-grad-cyan" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(16, 185, 129"), cls: "gc-grad-green" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(34, 197, 94"), cls: "gc-grad-green" },
  { test: (s) => s.includes("linear-gradient") && s.includes("rgba(168, 85, 247"), cls: "gc-grad-violet" },
  { test: (s) => s.includes("linear-gradient") && /(?:#fef3c7|fef3c7)/.test(s), cls: "gc-grad-amber-solid" },
  { test: (s) => /background[^:]*:\s*rgba\(\s*6,\s*182,\s*212,\s*0\.1\)/i.test(s), cls: "gc-bg-cyan-alpha" },
  { test: (s) => /background[^:]*:\s*rgba\(\s*139,\s*92,\s*246,\s*0\.1\)/i.test(s), cls: "gc-bg-purple-alpha" },
  { test: (s) => /background[^:]*:\s*rgba\(\s*249,\s*115,\s*22,\s*0\.1\)/i.test(s), cls: "gc-bg-orange-alpha" },
  { test: (s) => /background[^:]*:\s*rgba\(\s*245,\s*158,\s*11,\s*0\.(?:05|1)\)/i.test(s), cls: "gc-bg-amber-alpha" },

  // ── Border accents (2px solid colored) ──
  { test: (s) => /border:\s*2px\s+solid\s+#06b6d4/i.test(s), cls: "gc-box-cyan" },
  { test: (s) => /border:\s*2px\s+solid\s+#f0b45a/i.test(s), cls: "gc-box-amber" },
  { test: (s) => /border:\s*2px\s+solid\s+#d97757/i.test(s), cls: "gc-box-terracotta" },
  { test: (s) => /border:\s*2px\s+solid\s+#7ba884/i.test(s), cls: "gc-box-sage" },
  { test: (s) => /border:\s*2px\s+solid\s+#f59e0b/i.test(s), cls: "gc-box-amber-500" },
  { test: (s) => /border:\s*2px\s+solid\s+#f97316/i.test(s), cls: "gc-box-orange-500" },
  { test: (s) => /border:\s*2px\s+solid\s+rgba\(139,\s*92,\s*246/i.test(s), cls: "gc-box-violet" },
  { test: (s) => /border:\s*2px\s+solid\s+white/i.test(s), cls: "gc-border-white" },
  { test: (s) => /border:\s*3px\s+solid\s+white/i.test(s), cls: "gc-border-white" },
  { test: (s) => /border:\s*4px\s+solid\s+white/i.test(s), cls: "gc-border-white" },

  // ── Callout borders (left / top accents) ──
  { test: (s) => /border-left:\s*[34]px\s+solid\s+#(?:dc2626|ef4444)/i.test(s), cls: "gc-callout-red" },
  { test: (s) => /border-left:\s*[34]px\s+solid\s+#22c55e/i.test(s), cls: "gc-callout-green" },
  { test: (s) => /border-left:\s*[34]px\s+solid\s+#a855f7/i.test(s), cls: "gc-callout-purple" },
  { test: (s) => /border-left:\s*[34]px\s+solid\s+#3b82f6/i.test(s), cls: "gc-callout-blue" },
  { test: (s) => /border-left:\s*[34]px\s+solid\s+#10b981/i.test(s), cls: "gc-callout-emerald" },
  { test: (s) => /border-left:\s*[34]px\s+solid\s+#(?:f59e0b|eab308)/i.test(s), cls: "gc-callout-amber" },
  { test: (s) => /border-left:\s*[34]px\s+solid\s+#f97316/i.test(s), cls: "gc-callout-orange" },
  { test: (s) => /border-left:\s*[34]px\s+solid/i.test(s), cls: "gc-callout-left" },
  { test: (s) => /border-top:\s*4px\s+solid/i.test(s), cls: "gc-callout-top" },

  // ── Table / structural borders ──
  { test: (s) => /border:\s*1px\s+solid\s+#ddd/i.test(s), cls: "gc-table-border" },
  { test: (s) => /border:\s*1px\s+solid\s+#dbeafe/i.test(s), cls: "gc-table-border-blue" },
  { test: (s) => /border-bottom:\s*[12]px\s+solid\s+#e2e8f0/i.test(s), cls: "gc-table-divider" },
  { test: (s) => /border:\s*1px\s+solid\s+#(?:ffedd5|fed7aa)/i.test(s), cls: "gc-border-orange-light" },
  { test: (s) => /border:\s*1px\s+solid\s+#e2e8f0/i.test(s), cls: "gc-border-slate" },
  { test: (s) => /border:\s*[12]px\s+solid\s+rgba\(0,\s*0,\s*0,\s*0\.1\)/i.test(s), cls: "gc-border-black-alpha" },

  // ── Text colors ──
  { test: (s) => /(?:^|;\s*)color:\s*(?:white|#fff(?:fff)?(?:\b|;|$))/i.test(s), cls: "gc-text-white" },
  { test: (s) => /(?:^|;\s*)color:\s*#(?:6b7280|475569)/i.test(s), cls: "gc-text-muted" },
  { test: (s) => /(?:^|;\s*)color:\s*#94a3b8/i.test(s), cls: "gc-text-muted" },
  { test: (s) => /(?:^|;\s*)color:\s*#64748b/i.test(s), cls: "gc-text-muted" },
  { test: (s) => /(?:^|;\s*)color:\s*#3a3a3a/i.test(s), cls: "gc-text-muted" },
  { test: (s) => /(?:^|;\s*)color:\s*#334155/i.test(s), cls: "gc-text-dark" },
  { test: (s) => /(?:^|;\s*)color:\s*#(?:2b3a4a|374151|1e293b|111827)/i.test(s), cls: "gc-text-dark" },
  { test: (s) => /(?:^|;\s*)color:\s*#(?:d4a843|b45309)/i.test(s), cls: "gc-text-amber" },
  { test: (s) => /(?:^|;\s*)color:\s*#(?:6d28d9|8b5cf6)/i.test(s), cls: "gc-text-purple" },
  { test: (s) => /(?:^|;\s*)color:\s*#dc2626/i.test(s), cls: "gc-text-red" },
  { test: (s) => /(?:^|;\s*)color:\s*#(?:f8fafc|e2e8f0|e5e7eb|cbd5e1)/i.test(s), cls: "gc-text-light" },

  // ── Shadow ──
  { test: (s) => s.includes("box-shadow: inset") || s.includes("box-shadow:inset"), cls: "gc-shadow-inset" },

  // ── Row striping ──
  { test: (s) => /background:\s*rgba\(0,\s*0,\s*0,\s*0\.02\)/i.test(s), cls: "gc-row-stripe" },
];

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
    for (let j = 0; j < rules.length; j++) {
      if (rules[j].test(s)) {
        el.classList.add(rules[j].cls);
      }
    }
  }
}
