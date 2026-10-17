#!/usr/bin/env node

// ---------------------------------------------------------------------------
// Phone-width check for a grammar guide's explanation HTML.
//
// Renders each section's sanitized explanation in headless Chromium at phone
// widths (no dev server, no database) and reports:
//   - page-overflow: the whole page scrolls sideways
//   - hidden-in-scroll: a scroll box (overflow-x: auto) hides content off to
//     the right, and which text is hidden (e.g. "Sat", "Sun")
//   - spills-out: an element pokes past the page edge
//   - tiny-text: computed font size under 11px (uppercase kickers sit at ~11.5px on purpose)
//
// Then a dark-mode pass at the first width, with the app's real grammar-reader
// CSS from src/app/globals.css and <html class="dark">:
//   - dark-contrast: text under WCAG AA against what is actually behind it
//     (4.5:1, or 3:1 for large/bold text), after opacity and alpha backgrounds
//   - dark-light-box: a light surface left over in dark mode (a white card)
//
// Usage: npm run audit:guide-mobile -- <slug> [--widths 375,320] [--out dir] [--no-dark]
// Screenshots go to <out>/<slug>/<width>-<section>.png and dark-<width>-<section>.png.
//
// The wrapper approximates the grammar reader's mobile gutters. The fit pass
// does not load the app CSS, so treat it as a fit check, not a pixel-perfect
// preview. The dark pass loads globals.css without Tailwind, so utility
// classes are missing but the gc-* dark overrides are real.
// ---------------------------------------------------------------------------

import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";
import { getGrammarContent } from "@/lib/grammar-content-loader";
import { sanitizeHtml } from "@/utils/sanitize";

type Finding = { width: number; section: string; kind: string; detail: string };

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const widths = (flag("widths") ?? "375,320").split(",").map(Number);
const outDir = flag("out") ?? path.join("output", "guide-mobile-fit");
const darkPass = !args.includes("--no-dark");

// globals.css is Tailwind v4 source. Drop the Tailwind-only at-rules and turn
// the @theme block into :root variables so var(--color-text) etc. resolve.
async function loadReaderCss(): Promise<string> {
  let css = await readFile(path.join("src", "app", "globals.css"), "utf8");
  css = css.replace(/^@(import|custom-variant)[^;]*;/gm, "");
  const start = css.indexOf("@theme {");
  if (start >= 0) {
    let depth = 0;
    let end = start + "@theme ".length;
    for (; end < css.length; end += 1) {
      if (css[end] === "{") depth += 1;
      if (css[end] === "}" && --depth === 0) break;
    }
    css = `${css.slice(0, start)}:root ${css.slice(start + "@theme ".length, end + 1)}${css.slice(end + 1)}`;
  }
  return css;
}

const darkPage = (html: string, css: string) => `<!doctype html>
<html class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>${css}</style>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; font-size: 16px; line-height: 1.5; background: var(--surface-base); color: var(--color-text); }
  .explanation-content { padding: 0 4px; }
</style></head>
<body><div class="grammar-reader-container"><div class="explanation-content">${html}</div></div></body></html>`;

// Runs in the browser. Composites alpha backgrounds and opacity up the tree,
// then checks each text run against what is really behind it.
const DARK_PROBE = `(() => {
  const out = [];
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return [0, 0, 0, 0];
    const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const over = (top, under) => {
    const a = top[3];
    return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a)).concat(1);
  };
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const snip = (el) => (el.textContent ?? "").replace(/\\s+/g, " ").trim().slice(0, 40);

  const bgOf = (el) => {
    const chain = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) chain.unshift(n);
    let bg = [255, 255, 255, 1];
    for (const n of chain) {
      const s = getComputedStyle(n);
      const c = parse(s.backgroundColor);
      c[3] *= parseFloat(s.opacity);
      if (c[3] > 0) bg = over(c, bg);
    }
    return bg;
  };
  const opacityOf = (el) => {
    let o = 1;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
    return o;
  };

  const seenBoxes = new Set();
  for (const el of Array.from(document.querySelectorAll(".explanation-content *"))) {
    const s = getComputedStyle(el);
    const ownBg = parse(s.backgroundColor);
    // Bar fills and swatches have no text; only a light box behind words is a bug.
    if (ownBg[3] >= 0.5 && snip(el) && lum(bgOf(el)) > 0.4 && el.getBoundingClientRect().width > 40) {
      if (!Array.from(seenBoxes).some((b) => b.contains(el))) {
        seenBoxes.add(el);
        out.push({ kind: "dark-light-box", detail: \`light surface \${s.backgroundColor}: "\${snip(el)}"\` });
      }
    }
    const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
    // Skip placeholders like "·" in an empty schedule cell.
    if (!hasText || !/[\\p{L}\\p{N}]/u.test(snip(el)) || el.getBoundingClientRect().width === 0) continue;
    const fg = parse(s.color);
    fg[3] *= opacityOf(el);
    const bg = bgOf(el.parentElement ?? el);
    const own = parse(s.backgroundColor);
    const behind = own[3] > 0 ? over(own, bg) : bg;
    const r = ratio(over(fg, behind), behind);
    const size = parseFloat(s.fontSize);
    const large = size >= 24 || (size >= 18.6 && Number(s.fontWeight) >= 700);
    const need = large ? 3 : 4.5;
    if (r < need) {
      out.push({ kind: "dark-contrast", detail: \`\${r.toFixed(2)}:1 (need \${need}) \${s.color} on rgb(\${behind.slice(0, 3).map(Math.round).join(",")}): "\${snip(el)}"\` });
    }
  }
  return out;
})()`;

const page = (html: string) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; font-size: 16px; line-height: 1.5; background: #fff; color: #222; }
  .explanation-content { padding: 0 4px; }
  table { border-collapse: collapse; }
</style></head>
<body><div class="explanation-content">${html}</div></body></html>`;

// Runs in the browser. Kept as a string so tsx doesn't inject helpers.
const PROBE = `(() => {
          const out = [];
          const vw = window.innerWidth;
          const snip = (el) => (el.textContent ?? "").replace(/\\s+/g, " ").trim().slice(0, 40);

          if (document.documentElement.scrollWidth > vw + 1) {
            out.push({ kind: "page-overflow", detail: \`page is \${document.documentElement.scrollWidth}px wide in a \${vw}px screen\` });
          }

          const boxes = Array.from(document.querySelectorAll("body *")).filter((el) => {
            const ox = getComputedStyle(el).overflowX;
            return (ox === "auto" || ox === "scroll") && el.scrollWidth > el.clientWidth + 1;
          });
          for (const box of boxes) {
            const right = box.getBoundingClientRect().left + box.clientWidth;
            const hidden = Array.from(box.querySelectorAll("th, td, strong, span, div"))
              .filter((el) => el.children.length === 0 && el.getBoundingClientRect().left >= right - 2)
              .map(snip)
              .filter(Boolean);
            const unique = Array.from(new Set(hidden)).slice(0, 8);
            out.push({
              kind: "hidden-in-scroll",
              detail: \`\${box.scrollWidth - box.clientWidth}px hidden off the right edge; hidden at first: \${unique.join(" | ") || "(partial cells)"}\`,
            });
          }

          for (const el of Array.from(document.querySelectorAll("body *"))) {
            if (boxes.some((b) => b.contains(el))) continue;
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > vw + 1 && el.children.length === 0) {
              out.push({ kind: "spills-out", detail: \`"\${snip(el)}" ends at \${Math.round(r.right)}px\` });
            }
            const fs = parseFloat(getComputedStyle(el).fontSize);
            if (fs < 11 && el.children.length === 0 && snip(el)) {
              out.push({ kind: "tiny-text", detail: \`\${fs.toFixed(1)}px: "\${snip(el)}"\` });
            }
          }
          return out;
})()`;

async function main() {
  if (!slug) {
    console.error("Usage: npm run audit:guide-mobile -- <slug> [--widths 375,320]");
    process.exit(2);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guide: any = await getGrammarContent(slug);
  if (!guide?.sections) {
    console.error(`No guide found for slug "${slug}"`);
    process.exit(2);
  }

  const shotDir = path.join(outDir, slug);
  await mkdir(shotDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const findings: Finding[] = [];

  try {
    for (const width of widths) {
      const tab = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 2 });
      for (const section of guide.sections) {
        const id: string = section.id ?? `step-${section.stepNumber}`;
        if (!section.explanation) continue;
        await tab.setContent(page(sanitizeHtml(section.explanation, { allowStyles: true })));

        const hits = (await tab.evaluate(PROBE)) as { kind: string; detail: string }[];

        for (const h of hits) findings.push({ width, section: id, ...h });
        await tab.screenshot({ path: path.join(shotDir, `${width}-${id}.png`), fullPage: true });
      }
      await tab.close();
    }

    if (darkPass) {
      const css = await loadReaderCss();
      const width = widths[0];
      const tab = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 2, colorScheme: "dark" });
      for (const section of guide.sections) {
        const id: string = section.id ?? `step-${section.stepNumber}`;
        if (!section.explanation) continue;
        await tab.setContent(darkPage(sanitizeHtml(section.explanation, { allowStyles: true }), css));

        const hits = (await tab.evaluate(DARK_PROBE)) as { kind: string; detail: string }[];

        for (const h of hits) findings.push({ width, section: id, ...h });
        await tab.screenshot({ path: path.join(shotDir, `dark-${width}-${id}.png`), fullPage: true });
      }
      await tab.close();
    }
  } finally {
    await browser.close();
  }

  // Tiny text repeats per element; collapse to a count per section.
  const blocking = findings.filter((f) => f.kind !== "tiny-text");
  const tiny = findings.filter((f) => f.kind === "tiny-text");

  console.log(`Phone fit for ${slug} at ${widths.join("px, ")}px${darkPass ? `, dark mode at ${widths[0]}px` : ""}`);
  for (const f of blocking) console.log(`  ✗ ${f.width}px ${f.section}: ${f.kind}: ${f.detail}`);
  const tinyBySection = new Map<string, Finding[]>();
  for (const f of tiny) tinyBySection.set(`${f.width}px ${f.section}`, [...(tinyBySection.get(`${f.width}px ${f.section}`) ?? []), f]);
  for (const [key, list] of tinyBySection) console.log(`  ! ${key}: tiny-text x${list.length} (e.g. ${list[0].detail})`);
  if (!findings.length) console.log("  ✓ everything fits");
  console.log(`Screenshots: ${shotDir}`);
  process.exit(blocking.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
