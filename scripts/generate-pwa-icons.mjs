#!/usr/bin/env node
/**
 * Regenerate PWA PNG icons from public/icon.svg
 * Usage: node scripts/generate-pwa-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const svgPath = path.join(root, "public", "icon.svg");
const svg = fs.readFileSync(svgPath);

for (const size of [192, 512]) {
  const outPath = path.join(root, "public", `icon-${size}.png`);
  const outSvgPath = path.join(root, "public", `icon-${size}.svg`);
  await sharp(svg).resize(size, size).png().toFile(outPath);
  fs.copyFileSync(svgPath, outSvgPath);
  const stat = fs.statSync(outPath);
  console.log(`Wrote ${outPath} (${stat.size} bytes)`);
}
