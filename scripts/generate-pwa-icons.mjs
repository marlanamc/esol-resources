#!/usr/bin/env node
/**
 * Regenerate PWA PNG icons from public/icon.svg
 * Usage: node scripts/generate-pwa-icons.mjs
 *
 * Every output is flattened onto the icon's own terracotta ground. iOS
 * composites a transparent home screen icon onto black, so the alpha-free
 * property is load-bearing, not cosmetic -- it is asserted below rather
 * than assumed.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const GROUND = "#b05740";

const TARGETS = [
  { size: 192, file: "icon-192.png" },
  { size: 512, file: "icon-512.png" },
  { size: 180, file: "apple-touch-icon.png" },
];

const root = path.resolve(import.meta.dirname, "..");
const svgPath = path.join(root, "public", "icon.svg");
const svg = fs.readFileSync(svgPath);

for (const { size, file } of TARGETS) {
  const outPath = path.join(root, "public", file);

  await sharp(svg)
    .resize(size, size)
    .flatten({ background: GROUND })
    .png()
    .toFile(outPath);

  const { width, height, channels, hasAlpha } = await sharp(outPath).metadata();

  if (hasAlpha || channels !== 3) {
    throw new Error(
      `${file} came out with an alpha channel (channels=${channels}). ` +
        `iOS would render this as a black tile. Refusing to ship it.`,
    );
  }
  if (width !== size || height !== size) {
    throw new Error(`${file} is ${width}x${height}, expected ${size}x${size}.`);
  }

  const { size: bytes } = fs.statSync(outPath);
  console.log(`Wrote public/${file} (${width}x${height}, no alpha, ${bytes} bytes)`);
}
