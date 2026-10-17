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
// Usage: npm run audit:guide-mobile -- <slug> [--widths 375,320] [--out dir]
// Screenshots go to <out>/<slug>/<width>-<section>.png.
//
// The wrapper approximates the grammar reader's mobile gutters; it does not
// load the app CSS, so treat it as a fit check, not a pixel-perfect preview.
// ---------------------------------------------------------------------------

import { mkdir } from "node:fs/promises";
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
  } finally {
    await browser.close();
  }

  // Tiny text repeats per element; collapse to a count per section.
  const blocking = findings.filter((f) => f.kind !== "tiny-text");
  const tiny = findings.filter((f) => f.kind === "tiny-text");

  console.log(`Phone fit for ${slug} at ${widths.join("px, ")}px`);
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
