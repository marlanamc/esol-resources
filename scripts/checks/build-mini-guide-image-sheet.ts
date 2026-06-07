#!/usr/bin/env node

/**
 * Build a visual "contact sheet" of every scene photo in the mini grammar guides.
 *
 * For each `sceneCard(...)` photo it renders the live Unsplash thumbnail beside
 * the scene caption, the photo's alt text, and the dialogue that follows — so a
 * reviewer can eyeball all of them at once and spot pictures that do not match
 * their scene. Photos the heuristic (rules-image-context.ts) thinks are
 * mismatched get a badge and sort to the top.
 *
 * Output: tmp/mini-guides-audit/image-review.html (open directly in a browser —
 * no server, no API key needed; thumbnails load from the Unsplash CDN).
 *
 * Usage:
 *   npm run audit:mini-guide-images
 *   node --import tsx scripts/checks/build-mini-guide-image-sheet.ts --max-week 40
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { resolveWeek1to18Guides } from "@/lib/grammar-guide-audit";
import { loadGuide } from "@/lib/grammar-guide-audit/load-guide";
import { extractSceneContexts } from "@/lib/grammar-guide-audit/scene-context";
import { evaluateSceneMatch } from "@/lib/grammar-guide-audit/rules-image-context";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "tmp/mini-guides-audit");
const OUT_PATH = path.join(OUT_DIR, "image-review.html");

interface SceneImage {
    url: string;
    alt: string;
    credit?: { name?: string; url?: string };
}

interface SceneRow {
    slug: string;
    title: string;
    weekNumber: number;
    sceneId: string;
    sectionTitle: string | null;
    caption: string | null;
    alt: string;
    url: string;
    creditName: string;
    dialogue: string;
    flagged: boolean;
    reason: string;
    detail: string;
}

function parseWeekFlag(argv: string[], flag: string, fallback: number): number {
    const index = argv.indexOf(flag);
    if (index === -1 || index + 1 >= argv.length) return fallback;
    const value = Number.parseInt(argv[index + 1]!, 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function findImageExportName(source: string): string | null {
    return source.match(/export const (\w+Images)\s*:/)?.[1] ?? null;
}

async function loadImageModule(
    imageModulePath: string | null,
): Promise<Record<string, SceneImage>> {
    if (!imageModulePath) return {};
    let source: string;
    try {
        source = await readFile(imageModulePath, "utf8");
    } catch {
        return {};
    }
    const exportName = findImageExportName(source);
    if (!exportName) return {};
    const mod = await import(pathToFileURL(imageModulePath).href);
    return (mod[exportName] as Record<string, SceneImage>) ?? {};
}

// Grab the first dialogue line that follows a sceneCard call for context.
const TURN_REGEX =
    /\{\s*speaker:\s*["']([^"']+)["'],\s*avatar:\s*["'][^"']*["'],\s*text:\s*["'`]((?:\\.|[^"'`\\])*)["'`]/g;

function dialogueAfter(source: string, index: number): string {
    const window = source.slice(index, index + 2500);
    TURN_REGEX.lastIndex = 0;
    const lines: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = TURN_REGEX.exec(window)) !== null && lines.length < 2) {
        const speaker = match[1]!;
        const text = match[2]!
            .replace(/\\n/g, " ")
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
        if (text) lines.push(`${speaker}: ${text}`);
    }
    return lines.join("  •  ");
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

async function collectRows(minWeek: number, maxWeek: number): Promise<SceneRow[]> {
    const scope = resolveWeek1to18Guides(minWeek, maxWeek);
    const rows: SceneRow[] = [];

    for (const entry of scope) {
        const loaded = await loadGuide(entry);
        if (!loaded.contentSource.includes("sceneCard(")) continue;

        const images = await loadImageModule(loaded.imageModulePath);
        const scenes = extractSceneContexts(loaded.contentSource);

        for (const scene of scenes) {
            const image = images[scene.sceneId];
            const alt = image?.alt ?? "";
            const match = evaluateSceneMatch(scene.caption, alt);

            rows.push({
                slug: loaded.slug,
                title: entry.title,
                weekNumber: entry.weekNumber,
                sceneId: scene.sceneId,
                sectionTitle: scene.sectionTitle,
                caption: scene.caption,
                alt,
                url: image?.url ?? "",
                creditName: image?.credit?.name ?? "",
                dialogue: dialogueAfter(loaded.contentSource, scene.index),
                flagged: match.flagged,
                reason: match.reason ?? "",
                detail: match.detail,
            });
        }
    }

    // Flagged first, then by week, then guide.
    return rows.sort(
        (a, b) =>
            Number(b.flagged) - Number(a.flagged) ||
            a.weekNumber - b.weekNumber ||
            a.slug.localeCompare(b.slug),
    );
}

function renderCard(row: SceneRow): string {
    const key = `${row.slug}#${row.sceneId}`;
    const badge = row.flagged
        ? `<span class="badge ${row.reason}">⚠ ${
              row.reason === "setting-conflict" ? "likely mismatch" : "generic stand-in"
          }</span>`
        : "";
    const captionHtml = row.caption
        ? escapeHtml(row.caption)
        : `<em class="muted">caption not parsed — check manually</em>`;
    const thumb = row.url
        ? `<img loading="lazy" src="${escapeHtml(row.url)}" alt="">`
        : `<div class="noimg">no image found for <code>${escapeHtml(row.sceneId)}</code></div>`;
    const reasonLine = row.flagged
        ? `<div class="reason">${escapeHtml(row.detail)}</div>`
        : "";
    const dialogue = row.dialogue
        ? `<div class="dialogue">${escapeHtml(row.dialogue)}</div>`
        : "";

    return `
    <article class="card${row.flagged ? " is-flagged" : ""}" data-flagged="${row.flagged}" data-key="${escapeHtml(key)}">
      <button type="button" class="approve" data-key="${escapeHtml(key)}" title="Approve photo">✓</button>
      <label class="pick"><input type="checkbox" class="swap" data-key="${escapeHtml(key)}"> swap</label>
      <div class="thumb">${thumb}</div>
      <div class="body">
        <div class="top">${badge}<span class="week">W${row.weekNumber}</span></div>
        <div class="guide">${escapeHtml(row.title)} <span class="muted">· ${escapeHtml(row.slug)}#${escapeHtml(row.sceneId)}</span></div>
        ${row.sectionTitle ? `<div class="section">§ ${escapeHtml(row.sectionTitle)}</div>` : ""}
        <div class="caption"><span class="k">Scene</span> ${captionHtml}</div>
        <div class="alt"><span class="k">Photo shows</span> ${escapeHtml(row.alt) || `<em class="muted">no alt</em>`}</div>
        ${reasonLine}
        ${dialogue}
      </div>
    </article>`;
}

function renderHtml(rows: SceneRow[]): string {
    const flaggedCount = rows.filter((r) => r.flagged).length;
    const cards = rows.map(renderCard).join("\n");

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini guide scene-photo review</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, system-ui, sans-serif; background: #fdf9f0; color: #1a202c; }
  header { position: sticky; top: 0; z-index: 5; background: #fff; border-bottom: 1px solid #e4ddcf;
           padding: 0.8rem 1.2rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;
           box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  header h1 { font-size: 1.05rem; margin: 0; }
  .stat { font-size: 0.85rem; color: #555; }
  .stat b { color: #b05740; }
  button { font: inherit; border: 1px solid #cdbfa6; background: #fff; border-radius: 0.5rem;
           padding: 0.35rem 0.75rem; cursor: pointer; }
  button.active { background: #b05740; color: #fff; border-color: #b05740; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 1rem; padding: 1.2rem; }
  .card { background: #fff; border: 1px solid #e4ddcf; border-radius: 0.75rem; overflow: hidden;
          position: relative; display: flex; flex-direction: column; }
  .card.is-flagged { border-color: #d98324; box-shadow: 0 0 0 2px rgba(217,131,36,0.25); }
  .thumb { background: #f0ece1; aspect-ratio: 16/9; }
  .thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .noimg { display: flex; align-items: center; justify-content: center; height: 100%;
           font-size: 0.8rem; color: #a33; padding: 1rem; text-align: center; }
  .body { padding: 0.7rem 0.85rem 0.9rem; font-size: 0.84rem; line-height: 1.45; }
  .top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; min-height: 1.2rem; }
  .week { margin-left: auto; font-size: 0.72rem; color: #888; font-weight: 700; }
  .badge { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em;
           padding: 0.15rem 0.45rem; border-radius: 0.4rem; color: #fff; background: #d98324; }
  .badge.generic-photo { background: #8a8170; }
  .guide { font-weight: 700; }
  .section { font-size: 0.78rem; color: #6a8d73; margin: 0.1rem 0 0.4rem; }
  .caption, .alt { margin: 0.25rem 0; }
  .k { display: inline-block; font-size: 0.66rem; font-weight: 700; text-transform: uppercase;
       letter-spacing: 0.04em; color: #b05740; margin-right: 0.3rem; }
  .alt .k { color: #6a8d73; }
  .reason { margin-top: 0.4rem; font-size: 0.74rem; color: #a35a17; background: #fcf0df;
            border-radius: 0.4rem; padding: 0.3rem 0.45rem; }
  .dialogue { margin-top: 0.45rem; font-size: 0.78rem; color: #555; font-style: italic;
              border-left: 3px solid #e4ddcf; padding-left: 0.5rem; }
  .muted { color: #999; }
  .approve { position: absolute; top: 0.5rem; left: 0.5rem; z-index: 2; background: rgba(255,255,255,0.92);
             border: 1px solid #6a8d73; border-radius: 0.4rem; width: 1.75rem; height: 1.75rem;
             font-size: 0.9rem; font-weight: 700; line-height: 1; color: #6a8d73; cursor: pointer;
             display: flex; align-items: center; justify-content: center; padding: 0; }
  .approve:hover { background: #eef5f0; }
  .card.is-approved .approve { background: #6a8d73; color: #fff; border-color: #6a8d73; }
  .pick { position: absolute; top: 0.5rem; right: 0.5rem; z-index: 2; background: rgba(255,255,255,0.92);
          border-radius: 0.4rem; padding: 0.15rem 0.4rem; font-size: 0.72rem; font-weight: 700;
          display: flex; align-items: center; gap: 0.25rem; cursor: pointer; }
  .card.picked { outline: 3px solid #6a8d73; }
  .card.is-approved { border-color: #6a8d73; box-shadow: 0 0 0 2px rgba(106,141,115,0.2); }
  .section-head { padding: 1rem 1.2rem 0.25rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  .section-head h2 { font-size: 0.95rem; margin: 0; color: #6a8d73; }
  #approved-wrap { border-top: 2px solid #6a8d73; background: #f7faf8; }
  #approved-wrap.hidden { display: none; }
  code { background: #f0ece1; padding: 0 0.25rem; border-radius: 0.25rem; }
  .hidden { display: none !important; }
</style>
</head>
<body>
<header>
  <h1>Scene-photo review</h1>
  <span class="stat"><b>${rows.length}</b> photos · <b>${flaggedCount}</b> pre-flagged</span>
  <button id="f-all" class="filter active">All</button>
  <button id="f-flagged" class="filter">Flagged only</button>
  <button id="f-picked" class="filter">Picked only</button>
  <span class="stat"><b id="pickCount">0</b> picked</span>
  <button id="copy">Copy picked list</button>
  <span class="stat"><b id="approvedCount">0</b> approved</span>
  <button id="goto-approved">Go to approved</button>
  <button id="copy-approved">Copy approved list</button>
</header>
<div class="grid" id="grid">
${cards}
</div>
<div id="approved-wrap" class="hidden">
  <div class="section-head">
    <h2>Approved photos</h2>
    <span class="stat muted">Click ↩ on a card to move it back to review.</span>
  </div>
  <div class="grid" id="approved-grid"></div>
</div>
<script>
  const KEY = "mini-guide-image-swaps";
  const APPROVE_KEY = "mini-guide-image-approved";
  const picked = new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  const approved = new Set(JSON.parse(localStorage.getItem(APPROVE_KEY) || "[]"));
  const grid = document.getElementById("grid");
  const approvedGrid = document.getElementById("approved-grid");
  const approvedWrap = document.getElementById("approved-wrap");
  const pickCountEl = document.getElementById("pickCount");
  const approvedCountEl = document.getElementById("approvedCount");

  function persist() {
    localStorage.setItem(KEY, JSON.stringify([...picked]));
    pickCountEl.textContent = String(picked.size);
  }
  function persistApproved() {
    localStorage.setItem(APPROVE_KEY, JSON.stringify([...approved]));
    approvedCountEl.textContent = String(approved.size);
    approvedWrap.classList.toggle("hidden", approved.size === 0);
  }
  function setApproveButton(card, isApproved) {
    const btn = card.querySelector(".approve");
    if (!btn) return;
    btn.textContent = isApproved ? "↩" : "✓";
    btn.title = isApproved ? "Move back to review" : "Approve photo";
  }
  function moveToApproved(card) {
    approved.add(card.dataset.key);
    card.classList.add("is-approved");
    setApproveButton(card, true);
    approvedGrid.appendChild(card);
    persistApproved();
    applyFilter();
  }
  function moveToReview(card) {
    approved.delete(card.dataset.key);
    card.classList.remove("is-approved");
    setApproveButton(card, false);
    grid.appendChild(card);
    persistApproved();
    applyFilter();
  }
  function applyPicked() {
    document.querySelectorAll(".card").forEach((card) => {
      const on = picked.has(card.dataset.key);
      card.classList.toggle("picked", on);
      const box = card.querySelector(".swap");
      if (box) box.checked = on;
    });
    persist();
  }
  grid.addEventListener("change", (e) => {
    const box = e.target.closest(".swap");
    if (!box) return;
    if (box.checked) picked.add(box.dataset.key); else picked.delete(box.dataset.key);
    box.closest(".card").classList.toggle("picked", box.checked);
    persist();
  });
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".approve");
    if (!btn) return;
    const card = btn.closest(".card");
    if (!card) return;
    if (approved.has(card.dataset.key)) moveToReview(card);
    else moveToApproved(card);
  });

  let mode = "all";
  function applyFilter() {
    grid.querySelectorAll(".card").forEach((card) => {
      const flagged = card.dataset.flagged === "true";
      const isPicked = picked.has(card.dataset.key);
      const show = mode === "all" || (mode === "flagged" && flagged) || (mode === "picked" && isPicked);
      card.classList.toggle("hidden", !show);
    });
  }
  function setMode(next, btn) {
    mode = next;
    document.querySelectorAll("header .filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter();
  }
  document.getElementById("f-all").onclick = (e) => setMode("all", e.target);
  document.getElementById("f-flagged").onclick = (e) => setMode("flagged", e.target);
  document.getElementById("f-picked").onclick = (e) => setMode("picked", e.target);
  document.getElementById("copy").onclick = async () => {
    const list = [...picked].sort().join("\\n");
    try { await navigator.clipboard.writeText(list); alert("Copied " + picked.size + " picked scene(s):\\n\\n" + list); }
    catch { prompt("Copy these scene ids:", list); }
  };
  document.getElementById("goto-approved").onclick = () => {
    if (approved.size === 0) { alert("No approved photos yet."); return; }
    approvedWrap.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  document.getElementById("copy-approved").onclick = async () => {
    const list = [...approved].sort().join("\\n");
    if (!list) { alert("No approved photos yet."); return; }
    try { await navigator.clipboard.writeText(list); alert("Copied " + approved.size + " approved scene(s):\\n\\n" + list); }
    catch { prompt("Copy these scene ids:", list); }
  };

  function ensureApproveButtons() {
    document.querySelectorAll(".card").forEach((card) => {
      if (card.querySelector(".approve")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "approve";
      btn.dataset.key = card.dataset.key;
      btn.textContent = "✓";
      btn.title = "Approve photo";
      card.insertBefore(btn, card.firstChild);
    });
  }
  function restoreApproved() {
    grid.querySelectorAll(".card").forEach((card) => {
      if (!approved.has(card.dataset.key)) return;
      card.classList.add("is-approved");
      setApproveButton(card, true);
      approvedGrid.appendChild(card);
    });
    persistApproved();
  }

  ensureApproveButtons();
  applyPicked();
  restoreApproved();
  applyFilter();
</script>
</body>
</html>`;
}

async function main() {
    const argv = process.argv.slice(2);
    const minWeek = parseWeekFlag(argv, "--min-week", 1);
    const maxWeek = parseWeekFlag(argv, "--max-week", 99);

    const rows = await collectRows(minWeek, maxWeek);
    const flagged = rows.filter((r) => r.flagged).length;

    await mkdir(OUT_DIR, { recursive: true });
    await writeFile(OUT_PATH, renderHtml(rows), "utf8");

    console.log(`Scene photos: ${rows.length}  ·  pre-flagged: ${flagged}`);
    console.log(`Review sheet: ${OUT_PATH}`);
    console.log(`Open with:    open "${OUT_PATH}"`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
