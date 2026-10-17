// ---------------------------------------------------------------------------
// Shared visuals for grammar guides: the "something to look at" pages that
// replace a dialogue. Guides keep 1-2 dialogues; other pages use one of these.
//
// Dark mode: only gc-* classes carry color. Neutral surfaces use translucent
// black/white so they read in both themes. The sanitizer allows tables but
// not SVG, so charts are built from divs.
// ---------------------------------------------------------------------------

export type Accent = "terracotta" | "sage" | "blue" | "amber";

const header = (kicker: string, title: string, accent: Accent): string => `
  <div style="padding: 0.75rem 1rem 0.5rem 1rem">
    <div class="gc-text-${accent}" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">${kicker}</div>
    <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">${title}</div>
  </div>
`;

const frame = (inner: string): string => `
  <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
    ${inner}
  </div>
`;

// ---------------------------------------------------------------------------
// Frequency bar chart: 0-100% horizontal bars, one per adverb.
// ---------------------------------------------------------------------------

export type FrequencyRow = {
  word: string;
  percent: number;
  example: string;
  accent?: Accent;
};

export const frequencyBar = (
  rows: FrequencyRow[],
  { kicker = "Chart", title = "How often?" }: { kicker?: string; title?: string } = {}
): string => {
  const bars = rows
    .map(({ word, percent, example, accent = "terracotta" }) => {
      // The bar fill uses currentColor so it follows the gc-text-* theme color.
      const fill =
        percent > 0
          ? `<div class="gc-text-${accent}" style="height: 100%; width: ${percent}%; background: currentColor; border-radius: 999px; opacity: 0.85"></div>`
          : "";
      return `
        <div style="display: grid; grid-template-columns: 5.5rem 1fr 2.75rem; gap: 0.6rem; align-items: center">
          <strong class="gc-text-${accent}">${word}</strong>
          <div style="height: 0.8rem; border-radius: 999px; background: rgba(128,128,128,0.18); overflow: hidden">${fill}</div>
          <span style="font-size: 0.8rem; text-align: right; opacity: 0.8">${percent}%</span>
          <span style="grid-column: 1 / -1; font-size: 0.9rem; margin: -0.2rem 0 0.35rem 0"><em>${example}</em></span>
        </div>
      `;
    })
    .join("");

  return frame(`
    ${header(kicker, title, "terracotta")}
    <div style="display: grid; gap: 0.35rem; padding: 0.25rem 1rem 0.9rem 1rem">${bars}</div>
  `);
};

// ---------------------------------------------------------------------------
// Weekly schedule: a Mon-Sun grid that fits a phone with no sideways scroll.
// Each activity gets its own label line above a full-width row of 7 days, so
// the day columns share the whole width instead of losing a third of it to
// the labels. Keep cell text short (5 characters or fewer: "6:15", "7-3").
// ---------------------------------------------------------------------------

export type ScheduleCell = { text: string; accent?: Accent } | null;

export type ScheduleRow = {
  label: string;
  cells: ScheduleCell[];
};

export const scheduleChart = ({
  kicker = "Schedule",
  title,
  days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  rows,
  note,
}: {
  kicker?: string;
  title: string;
  days?: string[];
  rows: ScheduleRow[];
  note?: string;
}): string => {
  const head = days
    .map(
      (d) =>
        `<th class="gc-table-divider" scope="col" style="padding: 0.3rem 0; font-size: 0.72rem; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.12)">${d}</th>`
    )
    .join("");

  const body = rows
    .map((row) => {
      const cells = row.cells
        .map((cell) => {
          if (!cell) {
            return `<td style="padding: 0.15rem; text-align: center; opacity: 0.35">·</td>`;
          }
          const accent = cell.accent ?? "terracotta";
          return `<td style="padding: 0.15rem"><div class="gc-bg-${accent}-alpha gc-text-${accent}" style="padding: 0.3rem 0; border-radius: 0.4rem; font-size: 0.7rem; font-weight: 700; text-align: center; line-height: 1.25; white-space: nowrap">${cell.text}</div></td>`;
        })
        .join("");
      return `
        <tr><th scope="rowgroup" colspan="${days.length}" style="padding: 0.55rem 0 0.1rem 0; font-size: 0.85rem; text-align: left">${row.label}</th></tr>
        <tr>${cells}</tr>`;
    })
    .join("");

  return frame(`
    ${header(kicker, title, "sage")}
    <div style="padding: 0 0.75rem 0.75rem 0.75rem">
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    ${note ? `<div style="padding: 0 1rem 0.8rem 1rem; font-size: 0.85rem; opacity: 0.85">${note}</div>` : ""}
  `);
};

// ---------------------------------------------------------------------------
// Reading card: a short real-world reading (famous person, fact, news).
// Facts must be checked against the cited source.
// ---------------------------------------------------------------------------

export const readingCard = ({
  kicker = "Did you know?",
  title,
  paragraphs,
  photo,
  sources,
  accent = "blue",
}: {
  kicker?: string;
  title: string;
  paragraphs: string[];
  photo?: { url: string; alt: string; credit: string };
  sources: { name: string; url: string }[];
  accent?: Accent;
}): string => {
  const img = photo
    ? `<img src="${photo.url}" alt="${photo.alt}" loading="lazy" style="display: block; width: 100%; height: auto; max-height: 260px; object-fit: cover; object-position: top" />`
    : "";
  const credit = photo ? `Photo: ${photo.credit}. ` : "";
  const body = paragraphs
    .map((p) => `<p style="margin: 0 0 0.75rem 0; line-height: 1.7; font-size: 0.98rem">${p}</p>`)
    .join("");

  return frame(`
    ${img}
    ${header(kicker, title, accent)}
    <div style="padding: 0 1rem 0.25rem 1rem">${body}</div>
    <div style="padding: 0 1rem 0.75rem 1rem; font-size: 0.7rem; opacity: 0.7">${credit}Source${sources.length > 1 ? "s" : ""}: ${sources
      .map((src) => `<a href="${src.url}" rel="noopener" target="_blank">${src.name}</a>`)
      .join(", ")}</div>
  `);
};

// ---------------------------------------------------------------------------
// Checklist: done / not done rows. Sets up "has already... / hasn't... yet".
// ---------------------------------------------------------------------------

export const checklist = ({
  kicker = "Checklist",
  title,
  items,
}: {
  kicker?: string;
  title: string;
  items: { text: string; done: boolean }[];
}): string => {
  const rows = items
    .map(
      ({ text, done }) => `
        <div class="${done ? "gc-bg-sage-alpha" : ""}" style="display: flex; gap: 0.65rem; align-items: center; padding: 0.5rem 0.75rem; border-radius: 0.4rem${done ? "" : "; border: 1px dashed rgba(128,128,128,0.4)"}">
          <span style="font-size: 1.15rem; line-height: 1">${done ? "✅" : "⬜"}</span>
          <span style="font-size: 0.95rem${done ? "; text-decoration: line-through; text-decoration-thickness: 1px; opacity: 0.85" : ""}">${text}</span>
        </div>
      `
    )
    .join("");

  return frame(`
    ${header(kicker, title, "amber")}
    <div style="display: grid; gap: 0.4rem; padding: 0.25rem 1rem 0.9rem 1rem">${rows}</div>
  `);
};

// ---------------------------------------------------------------------------
// Steps card: numbered instructions (a sign, an app alert, a text with
// directions). Sets up imperatives: "Walk...", "Don't wait...".
// ---------------------------------------------------------------------------

export const stepsCard = ({
  kicker = "Steps",
  title,
  steps,
  note,
  accent = "blue",
}: {
  kicker?: string;
  title: string;
  steps: string[];
  note?: string;
  accent?: Accent;
}): string => {
  const rows = steps
    .map(
      (text, i) => `
        <div style="display: flex; gap: 0.65rem; align-items: baseline; padding: 0.4rem 0">
          <span class="gc-bg-${accent}-alpha gc-text-${accent}" style="flex: none; width: 1.5rem; height: 1.5rem; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700">${i + 1}</span>
          <span style="font-size: 0.95rem; line-height: 1.5">${text}</span>
        </div>
      `
    )
    .join("");

  return frame(`
    ${header(kicker, title, accent)}
    <div style="padding: 0 1rem 0.6rem 1rem">${rows}</div>
    ${note ? `<div style="padding: 0 1rem 0.8rem 1rem; font-size: 0.85rem; opacity: 0.85">${note}</div>` : ""}
  `);
};
