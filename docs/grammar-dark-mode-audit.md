# Grammar Guides Dark Mode Audit

This document catalogs inline styles in grammar content that may need dark mode patches. Grammar content lives in `src/content/grammar/*.ts` and uses HTML with inline styles. Dark mode overrides are in `src/app/globals.css` under `[data-theme="dark"] .grammar-reader-container .explanation-content`.

---

## Patterns That Break in Dark Mode

### 1. Light backgrounds (text becomes invisible)
| Pattern | Count | Files | CSS Fix Approach |
|---------|-------|-------|------------------|
| `background: #f8fafc` | ~60+ | Most files | ✅ Partially covered; add `!important` overrides for text |
| `background: white` | ~50+ | future-continuous, past-simple, superlatives, modals, punctuation, etc. | Override to `rgba(22,43,61,0.6)` or similar |
| `background: #fdfbf7`, `#f4f1ea` | Several | Various | Same as #f8fafc |

### 2. Light borders (disappear on dark)
| Pattern | Count | Notes |
|---------|-------|-------|
| `border: 1px solid #e2e8f0` | ~80+ | Tables, boxes – ✅ partially covered |
| `border: 2px solid #e2e8f0` | Several | Need `rgba(148,163,184,0.4)` override |
| `border-bottom: 2px solid #e2e8f0` | Many | Table headers |
| `border: 1px solid rgba(0,0,0,0.1)` | Several | modals, punctuation, superlatives |
| `border: 2px solid #06b6d4`, `#f0b45a`, `#d97757` | Theme accents | May need opacity tweak for dark |

### 3. Dark text on light backgrounds (inherits wrong)
| Pattern | Issue |
|---------|-------|
| `color: #6b7280` (muted gray) | Becomes invisible on dark – needs `#94a3b8` or `var(--color-text-muted)` |
| `color: #475569` | Same – use lighter variant |
| `color: #1e293b` | Headings – use `var(--color-text)` |
| Default/inherited text | Rule at globals.css:1710 sets `#1f2937` on light-bg divs – **conflicts** when we override bg to dark |

### 4. “White” elements in diagrams
| Pattern | Files | Fix |
|---------|-------|-----|
| `border: 2px solid white` | Circles/badges in timelines | Use `rgba(255,255,255,0.3)` or theme border |
| `background: white` on small badges | past-continuous, past-simple | Override to dark surface |
| `color: white` on colored badges | Usually OK (on accent bg) | Verify contrast |

### 5. Specific components to audit

#### High-impact (user-facing)
- **Frequency Ladder** (present-simple) – ✅ Patched
- **Tables** (th, td, tr) – ✅ Partially patched; verify all files
- **Comparison tables** (Pattern / Correct / Common Error) – present-simple, cycle-1-review

#### Medium-impact
- **Bulleted lists** with `background: #f8fafc; border-left: 4px solid #06b6d4` – future-continuous, future-perfect-continuous, past-continuous, present-perfect-continuous
- **Timeline diagrams** – circles with white borders, gradient lines
- **Info boxes** – `background: white; border: 2px solid #06b6d4` (future-continuous, past-continuous, past-simple)

#### Lower-impact
- **Small labels** – `color: #94a3b8` (past-continuous) – may need lightening
- **Span badges** – `background: #94a3b8; color: white` (cycle-1-review) – usually OK

---

## Files by Priority

### Tier 1 – Heavy inline usage
- `future-continuous.ts` – white boxes, #f8fafc, tables
- `past-simple.ts` – white boxes, #f8fafc, tables
- `past-continuous.ts` – white boxes, #f8fafc, #94a3b8
- `modals-obligation-permission.ts` – many white boxes
- `superlatives-quantifiers.ts` – white boxes
- `punctuation-capitalization.ts` – white boxes
- `cycle-1-review.ts` – mixed

### Tier 2 – Moderate usage
- `future-perfect-continuous.ts`, `future-perfect-family.ts`
- `past-perfect.ts`, `past-perfect-family.ts`, `past-perfect-continuous.ts`
- `present-perfect-family.ts`, `continuous-tenses-review.ts`
- `simple-tenses-review.ts`, `perfect-tenses-review.ts`

### Tier 3 – Light usage
- `gerunds-infinitives.ts`, `present-simple.ts`, `future-simple.ts`
- Others with few inline styles

---

## Recommended Approach

### Option A: Broader CSS overrides (current strategy)
Add more `[data-theme="dark"]` selectors in `globals.css`:
- `div[style*="background: white"]` → dark background + light text
- `li[style*="background: #f8fafc"]` → dark bg + light text
- `span[style*="color: #6b7280"]` → `var(--color-text-muted)` or `#94a3b8`
- `div[style*="border: 2px solid #06b6d4"]` → increase border opacity

### Option B: Refactor content (longer term)
- Add semantic classes: `grammar-info-box`, `grammar-table`, `grammar-frequency-ladder`
- Use CSS variables: `background: var(--grammar-box-bg)` which switch in dark
- Reduces inline styles and makes future theming easier

### Option C: Sanitize/transform step
- In the HTML sanitizer or before render, inject `data-grammar-dark` or classes
- Or replace light hex colors with CSS variables at build/render time

---

## Quick Test Checklist

1. [ ] Present Simple – Frequency Ladder, Position Rules table
2. [ ] Past Simple – timeline diagram, tables
3. [ ] Past Continuous – timeline, info boxes
4. [ ] Future Continuous – cyan boxes, tables
5. [ ] Future Perfect / Perfect Continuous – diagrams
6. [ ] Present Perfect Family – comparison tables
7. [ ] Continuous Tenses Review – tables, Future Choice clues
8. [ ] Cycle 1 Review – mixed tables and boxes
9. [ ] Modals Obligation/Permission – white example boxes
10. [ ] Superlatives & Quantifiers – white cards
11. [ ] Punctuation & Capitalization – white example divs

---

## Current globals.css Coverage (Updated)

- ✅ Tables (background, border, th, td)
- ✅ `#f8fafc` divs (Frequency Ladder, boxes, list items)
- ✅ `border: 2px solid rgba(139, 92, 246)` divs
- ✅ `background: white` divs and ol – dark override + light text
- ✅ `color: #6b7280`, `#475569` – overridden to #94a3b8, #cbd5e1
- ✅ `border: 1px solid rgba(0,0,0,0.1)` – border-color override
- ✅ Bullet list items (`li` with #f8fafc)
- ✅ Info boxes with accent borders (#06b6d4, #f0b45a, #d97757, #7ba884)
- ✅ border-left accent boxes
- ✅ border-bottom #e2e8f0
- ✅ White borders on diagram circles
- ✅ div with border 1px solid #e2e8f0
- ✅ #fef3c7 (amber cream) – Irregular forms, tip boxes + border-left #f59e0b
- ✅ #fff9e6, #fffbeb – pale yellow boxes
- ✅ Parts of Speech cards – #fdf2f8, #f0fdf4, #eff6ff, #faf5ff (Noun, Verb, Adjective, Adverb)
- ✅ linear-gradient with #fef3c7
- ✅ Italic tip text #3a3a3a – lightened to #94a3b8
- ✅ th / text with #b45309 – lightened to #fbbf24
