export type GrammarDarkStyleMatcherKind =
  | "background"
  | "badge"
  | "gradient"
  | "border"
  | "callout"
  | "table"
  | "text"
  | "shadow"
  | "row";

export interface GrammarDarkStyleMatcher {
  id: string;
  label: string;
  cls: string;
  kind: GrammarDarkStyleMatcherKind;
  test: (style: string) => boolean;
}

const BG_WHITE_RE =
  /background(?:-color)?:\s*(?:white|#fff(?:fff)?(?:\b|;))/i;
const BG_NEAR_WHITE_RE = /background:\s*#fff[5-9a-f]/i;

export const grammarDarkStyleMatchers: readonly GrammarDarkStyleMatcher[] = [
  { id: "bg-white", label: "light background (white / near-white)", cls: "gc-bg-white", kind: "background", test: (s) => BG_WHITE_RE.test(s) },
  { id: "bg-near-white", label: "light background (near-white)", cls: "gc-bg-white", kind: "background", test: (s) => BG_NEAR_WHITE_RE.test(s) },

  { id: "bg-slate-f8", label: "light slate surface (#f8fafc)", cls: "gc-bg-slate", kind: "background", test: (s) => s.includes("#f8fafc") },
  { id: "bg-slate-fdfbf7", label: "warm light surface (#fdfbf7)", cls: "gc-bg-slate", kind: "background", test: (s) => s.includes("#fdfbf7") },
  { id: "bg-slate-f4f1ea", label: "warm light surface (#f4f1ea)", cls: "gc-bg-slate", kind: "background", test: (s) => s.includes("#f4f1ea") },
  { id: "bg-slate-fef9f3", label: "warm light surface (#fef9f3)", cls: "gc-bg-slate", kind: "background", test: (s) => s.includes("#fef9f3") },

  { id: "bg-yellow", label: "yellow callout surface", cls: "gc-bg-yellow", kind: "background", test: (s) => /background[^:]*:\s*#fef9c3/i.test(s) },
  { id: "bg-amber", label: "amber surface", cls: "gc-bg-amber", kind: "background", test: (s) => /background[^:]*:\s*#fef3c7/i.test(s) },
  { id: "bg-amber-soft-warn", label: "soft amber warning surface", cls: "gc-bg-amber", kind: "background", test: (s) => /background[^:]*:\s*#fff3cd/i.test(s) },
  { id: "bg-orange", label: "orange surface", cls: "gc-bg-orange", kind: "background", test: (s) => /background[^:]*:\s*#fff7ed/i.test(s) },
  { id: "bg-amber-soft", label: "soft amber surface", cls: "gc-bg-amber", kind: "background", test: (s) => /background[^:]*:\s*(?:#fff9e6|#fffbeb)/i.test(s) },
  { id: "bg-red", label: "red surface", cls: "gc-bg-red", kind: "background", test: (s) => /background[^:]*:\s*#(?:fef2f2|fee2e2)/i.test(s) },
  { id: "bg-pink", label: "pink surface", cls: "gc-bg-pink", kind: "background", test: (s) => /background[^:]*:\s*#fdf2f8/i.test(s) },
  { id: "bg-green", label: "green surface", cls: "gc-bg-green", kind: "background", test: (s) => /background[^:]*:\s*(?:#f0fdf4|#ecfdf5)/i.test(s) },
  { id: "bg-blue", label: "blue surface", cls: "gc-bg-blue", kind: "background", test: (s) => /background[^:]*:\s*#eff6ff/i.test(s) },
  { id: "bg-purple", label: "purple surface", cls: "gc-bg-purple", kind: "background", test: (s) => /background[^:]*:\s*(?:#faf5ff|#f5f3ff|#eef2ff)/i.test(s) },
  { id: "bg-violet", label: "violet surface", cls: "gc-bg-violet", kind: "background", test: (s) => /background[^:]*:\s*#ede9fe/i.test(s) },
  { id: "bg-cyan", label: "cyan surface", cls: "gc-bg-cyan", kind: "background", test: (s) => /background[^:]*:\s*#ecfeff/i.test(s) },
  { id: "bg-slate-300", label: "slate 300 surface", cls: "gc-bg-slate-300", kind: "background", test: (s) => /background[^:]*:\s*#cbd5e1/i.test(s) },

  { id: "badge-blue", label: "blue badge background", cls: "gc-badge-blue", kind: "badge", test: (s) => /background[^:]*:\s*#dbeafe/i.test(s) },
  { id: "badge-orange", label: "orange badge background", cls: "gc-badge-orange", kind: "badge", test: (s) => /background[^:]*:\s*#fed7aa/i.test(s) },
  { id: "badge-red", label: "red badge background", cls: "gc-badge-red", kind: "badge", test: (s) => /background[^:]*:\s*#fee2e2/i.test(s) },
  { id: "badge-cyan", label: "cyan badge background", cls: "gc-badge-cyan", kind: "badge", test: (s) => /background[^:]*:\s*(?:#cffafe|#a5f3fc)/i.test(s) },
  { id: "badge-purple-light", label: "light purple badge background", cls: "gc-badge-purple-light", kind: "badge", test: (s) => /background[^:]*:\s*(?:#f3e8ff|#e9d5ff)/i.test(s) },
  { id: "badge-purple-med", label: "medium purple badge background", cls: "gc-badge-purple-med", kind: "badge", test: (s) => /background[^:]*:\s*#c4b5fd/i.test(s) },
  { id: "badge-terracotta", label: "terracotta badge background", cls: "gc-badge-terracotta", kind: "badge", test: (s) => /background[^:]*:\s*#d97757/i.test(s) },
  { id: "badge-sky", label: "sky badge background", cls: "gc-badge-sky", kind: "badge", test: (s) => /background[^:]*:\s*#0369a1/i.test(s) },

  { id: "grad-amber", label: "amber gradient", cls: "gc-grad-amber", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(245, 158, 11") },
  { id: "grad-amber-alt", label: "amber gradient", cls: "gc-grad-amber", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(240, 180, 90") },
  { id: "grad-amber-hex", label: "amber gradient", cls: "gc-grad-amber", kind: "gradient", test: (s) => s.includes("linear-gradient") && /#(?:f59e0b|fb923c|ffb347)/i.test(s) },
  { id: "grad-purple", label: "purple gradient", cls: "gc-grad-purple", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(139, 92, 246") },
  { id: "grad-purple-alt", label: "purple gradient", cls: "gc-grad-purple", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(99, 102, 241") },
  { id: "grad-purple-soft-indigo", label: "purple gradient", cls: "gc-grad-purple", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(103, 119, 239") },
  { id: "grad-purple-hex", label: "purple gradient", cls: "gc-grad-purple", kind: "gradient", test: (s) => s.includes("linear-gradient") && /#(?:8b5cf6|a78bfa|7c3aed|6d28d9|c4b5fd|ddd6fe|ede9fe)/i.test(s) },
  { id: "grad-terracotta", label: "terracotta gradient", cls: "gc-grad-terracotta", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(200, 107, 81") },
  { id: "grad-terracotta-warm-indigo", label: "terracotta gradient", cls: "gc-grad-terracotta", kind: "gradient", test: (s) => s.includes("linear-gradient") && /#fff7ed/i.test(s) && /#eef2ff/i.test(s) },
  { id: "grad-red", label: "red gradient", cls: "gc-grad-red", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(248, 113, 113") },
  { id: "grad-cyan", label: "cyan gradient", cls: "gc-grad-cyan", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(133, 196, 255") },
  { id: "grad-cyan-alt", label: "cyan gradient", cls: "gc-grad-cyan", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(6, 182, 212") },
  { id: "grad-cyan-hex", label: "cyan gradient", cls: "gc-grad-cyan", kind: "gradient", test: (s) => s.includes("linear-gradient") && /#06b6d4/i.test(s) },
  { id: "grad-cyan-deep", label: "cyan gradient", cls: "gc-grad-cyan", kind: "gradient", test: (s) => s.includes("linear-gradient") && /rgba\(\s*(?:8,\s*145,\s*178|14,\s*116,\s*144)\s*,/i.test(s) },
  { id: "grad-cyan-purple-soft", label: "cyan gradient", cls: "gc-grad-cyan", kind: "gradient", test: (s) => s.includes("linear-gradient") && /#cffafe/i.test(s) && /#f3e8ff/i.test(s) },
  { id: "grad-future-timeline", label: "future timeline gradient", cls: "gc-grad-cyan", kind: "gradient", test: (s) => s.includes("linear-gradient(to right") && /#cbd5e1/i.test(s) && /#f97316/i.test(s) && /#22c55e/i.test(s) },
  { id: "grad-green", label: "green gradient", cls: "gc-grad-green", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(16, 185, 129") },
  { id: "grad-green-alt", label: "green gradient", cls: "gc-grad-green", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(34, 197, 94") },
  { id: "grad-violet", label: "violet gradient", cls: "gc-grad-violet", kind: "gradient", test: (s) => s.includes("linear-gradient") && s.includes("rgba(168, 85, 247") },
  { id: "grad-amber-solid", label: "amber solid gradient", cls: "gc-grad-amber-solid", kind: "gradient", test: (s) => s.includes("linear-gradient") && /(?:#fef3c7|fef3c7)/.test(s) },
  { id: "bg-cyan-alpha", label: "cyan alpha surface", cls: "gc-bg-cyan-alpha", kind: "background", test: (s) => /background[^:]*:\s*rgba\(\s*6,\s*182,\s*212,\s*0\.1\)/i.test(s) },
  { id: "bg-purple-alpha", label: "purple alpha surface", cls: "gc-bg-purple-alpha", kind: "background", test: (s) => /background[^:]*:\s*rgba\(\s*139,\s*92,\s*246,\s*0\.1\)/i.test(s) },
  { id: "bg-orange-alpha", label: "orange alpha surface", cls: "gc-bg-orange-alpha", kind: "background", test: (s) => /background[^:]*:\s*rgba\(\s*249,\s*115,\s*22,\s*0\.1\)/i.test(s) },
  { id: "bg-amber-alpha", label: "amber alpha surface", cls: "gc-bg-amber-alpha", kind: "background", test: (s) => /background[^:]*:\s*rgba\(\s*245,\s*158,\s*11,\s*0\.(?:05|1)\)/i.test(s) },
  { id: "bg-sage-alpha", label: "sage alpha surface", cls: "gc-bg-sage-alpha", kind: "background", test: (s) => /background[^:]*:\s*rgba\(\s*(?:110,\s*145,\s*118|122,\s*143,\s*124)\s*,\s*0\.(?:05|1|15)\)/i.test(s) },
  { id: "bg-terracotta-alpha", label: "terracotta alpha surface", cls: "gc-bg-terracotta-alpha", kind: "background", test: (s) => /background[^:]*:\s*rgba\(\s*200,\s*107,\s*81\s*,\s*0\.(?:05|1)\)/i.test(s) },

  { id: "box-cyan", label: "2px cyan border box", cls: "gc-box-cyan", kind: "border", test: (s) => /border:\s*2px\s+solid\s+#06b6d4/i.test(s) },
  { id: "box-amber", label: "2px amber border box", cls: "gc-box-amber", kind: "border", test: (s) => /border:\s*2px\s+solid\s+#f0b45a/i.test(s) },
  { id: "box-terracotta", label: "2px terracotta border box", cls: "gc-box-terracotta", kind: "border", test: (s) => /border:\s*2px\s+solid\s+#d97757/i.test(s) },
  { id: "box-sage", label: "2px sage border box", cls: "gc-box-sage", kind: "border", test: (s) => /border:\s*2px\s+solid\s+#7ba884/i.test(s) },
  { id: "box-amber-500", label: "2px amber 500 border box", cls: "gc-box-amber-500", kind: "border", test: (s) => /border:\s*2px\s+solid\s+#f59e0b/i.test(s) },
  { id: "box-orange-500", label: "2px orange 500 border box", cls: "gc-box-orange-500", kind: "border", test: (s) => /border:\s*2px\s+solid\s+#f97316/i.test(s) },
  { id: "box-violet", label: "2px violet border box", cls: "gc-box-violet", kind: "border", test: (s) => /border:\s*2px\s+solid\s+rgba\(139,\s*92,\s*246/i.test(s) },
  { id: "border-white-2", label: "white border", cls: "gc-border-white", kind: "border", test: (s) => /border:\s*2px\s+solid\s+white/i.test(s) },
  { id: "border-white-3", label: "white border", cls: "gc-border-white", kind: "border", test: (s) => /border:\s*3px\s+solid\s+white/i.test(s) },
  { id: "border-white-4", label: "white border", cls: "gc-border-white", kind: "border", test: (s) => /border:\s*4px\s+solid\s+white/i.test(s) },

  { id: "callout-red", label: "red callout border-left", cls: "gc-callout-red", kind: "callout", test: (s) => /border-left:\s*[34]px\s+solid\s+#(?:dc2626|ef4444)/i.test(s) },
  { id: "callout-green", label: "green callout border-left", cls: "gc-callout-green", kind: "callout", test: (s) => /border-left:\s*[34]px\s+solid\s+#22c55e/i.test(s) },
  { id: "callout-purple", label: "purple callout border-left", cls: "gc-callout-purple", kind: "callout", test: (s) => /border-left:\s*[34]px\s+solid\s+#a855f7/i.test(s) },
  { id: "callout-blue", label: "blue callout border-left", cls: "gc-callout-blue", kind: "callout", test: (s) => /border-left:\s*[34]px\s+solid\s+#3b82f6/i.test(s) },
  { id: "callout-emerald", label: "emerald callout border-left", cls: "gc-callout-emerald", kind: "callout", test: (s) => /border-left:\s*[34]px\s+solid\s+#10b981/i.test(s) },
  { id: "callout-amber", label: "amber callout border-left", cls: "gc-callout-amber", kind: "callout", test: (s) => /border-left:\s*[34]px\s+solid\s+#(?:f59e0b|eab308)/i.test(s) },
  { id: "callout-orange", label: "orange callout border-left", cls: "gc-callout-orange", kind: "callout", test: (s) => /border-left:\s*[34]px\s+solid\s+#f97316/i.test(s) },
  { id: "callout-left", label: "generic callout border-left", cls: "gc-callout-left", kind: "callout", test: (s) => /border-left:\s*[34]px\s+solid/i.test(s) },
  { id: "callout-top", label: "callout border-top", cls: "gc-callout-top", kind: "callout", test: (s) => /border-top:\s*4px\s+solid/i.test(s) },

  { id: "table-border", label: "table border (#ddd)", cls: "gc-table-border", kind: "table", test: (s) => /border:\s*1px\s+solid\s+#ddd/i.test(s) },
  { id: "table-border-blue", label: "table border (blue)", cls: "gc-table-border-blue", kind: "table", test: (s) => /border:\s*1px\s+solid\s+#dbeafe/i.test(s) },
  { id: "table-divider", label: "table divider (#e2e8f0)", cls: "gc-table-divider", kind: "table", test: (s) => /border-bottom:\s*[12]px\s+solid\s+#e2e8f0/i.test(s) },
  { id: "table-divider-top", label: "table divider top (#e2e8f0)", cls: "gc-table-divider", kind: "table", test: (s) => /border-top:\s*[12]px\s+solid\s+#e2e8f0/i.test(s) },
  { id: "table-divider-alpha", label: "table divider alpha", cls: "gc-table-divider", kind: "table", test: (s) => /border-bottom:\s*1px\s+solid\s+rgba\(0,\s*0,\s*0,\s*0\.1\)/i.test(s) },
  { id: "border-orange-light", label: "light orange border", cls: "gc-border-orange-light", kind: "border", test: (s) => /border:\s*1px\s+solid\s+#(?:ffedd5|fed7aa)/i.test(s) },
  { id: "border-slate", label: "light slate border", cls: "gc-border-slate", kind: "border", test: (s) => /border:\s*1px\s+solid\s+#e2e8f0/i.test(s) },
  { id: "border-black-alpha", label: "alpha black border", cls: "gc-border-black-alpha", kind: "border", test: (s) => /border:\s*[12]px\s+solid\s+rgba\(0,\s*0,\s*0,\s*0\.1\)/i.test(s) },

  { id: "text-white", label: "white/light text", cls: "gc-text-white", kind: "text", test: (s) => /(?:^|;\s*)color:\s*(?:white|#fff(?:fff)?(?:\b|;|$))/i.test(s) },
  { id: "text-muted-6b7280", label: "muted text (#6b7280)", cls: "gc-text-muted", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#6b7280/i.test(s) },
  { id: "text-muted-475569", label: "muted text (#475569)", cls: "gc-text-muted", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#475569/i.test(s) },
  { id: "text-muted-94a3b8", label: "muted text (#94a3b8)", cls: "gc-text-muted", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#94a3b8/i.test(s) },
  { id: "text-muted-64748b", label: "muted text (#64748b)", cls: "gc-text-muted", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#64748b/i.test(s) },
  { id: "text-muted-5e6b7d", label: "muted text (#5e6b7d)", cls: "gc-text-muted", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#5e6b7d/i.test(s) },
  { id: "text-muted-3a3a3a", label: "muted text (#3a3a3a)", cls: "gc-text-muted", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#3a3a3a/i.test(s) },
  { id: "text-dark-334155", label: "dark text (#334155)", cls: "gc-text-dark", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#334155/i.test(s) },
  { id: "text-dark-group", label: "dark text", cls: "gc-text-dark", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#(?:2b3a4a|374151|1e293b|111827)/i.test(s) },
  { id: "text-amber", label: "amber text", cls: "gc-text-amber", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#(?:d4a843|b45309|f59e0b|f0b45a)/i.test(s) },
  { id: "text-sage", label: "sage text", cls: "gc-text-sage", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#7ba884/i.test(s) },
  { id: "text-terracotta", label: "terracotta text", cls: "gc-text-terracotta", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#(?:d97757|c86b51|c2410c)/i.test(s) },
  { id: "text-brown", label: "brown text", cls: "gc-text-brown", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#(?:7b341e|4a5568)/i.test(s) },
  { id: "text-purple", label: "purple text", cls: "gc-text-purple", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#(?:6d28d9|8b5cf6|6366f1|4338ca|7c3aed|a855f7)/i.test(s) },
  { id: "text-cyan", label: "cyan text", cls: "gc-text-cyan", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#(?:06b6d4|0891b2|0e7490|0369a1|14b8a6)/i.test(s) },
  { id: "text-red", label: "red text", cls: "gc-text-red", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#dc2626/i.test(s) },
  { id: "text-light", label: "light text", cls: "gc-text-light", kind: "text", test: (s) => /(?:^|;\s*)color:\s*#(?:f8fafc|e2e8f0|e5e7eb|cbd5e1)/i.test(s) },

  { id: "shadow-inset", label: "inset shadow", cls: "gc-shadow-inset", kind: "shadow", test: (s) => s.includes("box-shadow: inset") || s.includes("box-shadow:inset") },
  { id: "row-stripe", label: "row stripe background", cls: "gc-row-stripe", kind: "row", test: (s) => /background:\s*rgba\(0,\s*0,\s*0,\s*0\.02\)/i.test(s) },
];

export function getGrammarDarkMatcherHits(
  style: string,
): GrammarDarkStyleMatcher[] {
  return grammarDarkStyleMatchers.filter((matcher) => matcher.test(style));
}

export function getGrammarDarkClassNames(style: string): string[] {
  const classes = new Set<string>();
  for (const matcher of grammarDarkStyleMatchers) {
    if (matcher.test(style)) {
      classes.add(matcher.cls);
    }
  }
  return Array.from(classes);
}
