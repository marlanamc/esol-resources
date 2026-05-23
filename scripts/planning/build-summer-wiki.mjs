import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "docs/planning/Summer-research");
const outputDir = path.join(sourceDir, "wiki");
const publicOutputDir = path.join(root, "public/summer-planning-wiki");

const docs = [
  {
    file: "next-year-class-improvement-plan.md",
    slug: "class-improvement-plan",
    label: "Class Improvement Plan",
    description:
      "The core teaching vision: community class first, speaking-centered lessons, meaningful homework, quizzes, and adult-life English.",
  },
  {
    file: "app-learning-path-summer-roadmap.md",
    slug: "app-learning-path-roadmap",
    label: "App Learning Path Roadmap",
    description:
      "The product roadmap for turning the app into a guided weekly path with meaningful tasks and less decision fatigue.",
  },
  {
    file: "summer-research-reading-list.md",
    slug: "summer-research-reading-list",
    label: "Summer Research Reading List",
    description:
      "Research areas and readings for microlearning, adult ESOL, confidence, plateauing, transfer, and evaluation.",
  },
  {
    file: "school-resource-website-population-plan.md",
    slug: "school-resource-website-plan",
    label: "Resource Website Plan",
    description:
      "A plan for populating the public resource website with practical school and community supports.",
  },
];

const navItems = docs
  .map(
    (doc) =>
      `<a href="${doc.slug}.html" data-slug="${doc.slug}">${escapeHtml(doc.label)}</a>`,
  )
  .join("\n");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, text, href) =>
      `<a href="${escapeHtml(href)}">${inlineMarkdown(text)}</a>`,
  );
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function parseTable(lines, startIndex) {
  const rows = [];
  let index = startIndex;
  while (index < lines.length && /^\|.*\|$/.test(lines[index].trim())) {
    rows.push(lines[index].trim());
    index += 1;
  }

  if (rows.length < 2 || !/^\|?\s*:?-{3,}:?\s*\|/.test(rows[1])) {
    return null;
  }

  const cells = (row) =>
    row
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim());

  const headers = cells(rows[0]);
  const bodyRows = rows.slice(2).map(cells);

  const html = [
    "<div class=\"table-wrap\"><table>",
    "<thead><tr>",
    ...headers.map((header) => `<th>${inlineMarkdown(header)}</th>`),
    "</tr></thead>",
    "<tbody>",
    ...bodyRows.map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`,
    ),
    "</tbody></table></div>",
  ].join("");

  return { html, nextIndex: index };
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const toc = [];
  let index = 0;
  let paragraph = [];
  let listStack = [];
  let inCode = false;
  let codeLang = "";
  let codeLines = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeLists = (toLevel = 0) => {
    while (listStack.length > toLevel) {
      html.push("</ul>");
      listStack.pop();
    }
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (inCode) {
      if (trimmed.startsWith("```")) {
        html.push(
          `<pre><code class="language-${escapeHtml(codeLang)}">${escapeHtml(
            codeLines.join("\n"),
          )}</code></pre>`,
        );
        inCode = false;
        codeLang = "";
        codeLines = [];
      } else {
        codeLines.push(line);
      }
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushParagraph();
      closeLists();
      inCode = true;
      codeLang = trimmed.slice(3).trim();
      index += 1;
      continue;
    }

    const table = parseTable(lines, index);
    if (table) {
      flushParagraph();
      closeLists();
      html.push(table.html);
      index = table.nextIndex;
      continue;
    }

    if (trimmed === "") {
      flushParagraph();
      closeLists();
      index += 1;
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      closeLists();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text);
      toc.push({ level, text, id });
      html.push(`<h${level} id="${id}">${inlineMarkdown(text)}</h${level}>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      closeLists();
      html.push(`<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`);
      index += 1;
      continue;
    }

    const bullet = /^(\s*)-\s+(.+)$/.exec(line);
    if (bullet) {
      flushParagraph();
      const level = Math.floor(bullet[1].length / 2) + 1;
      while (listStack.length < level) {
        html.push("<ul>");
        listStack.push("ul");
      }
      closeLists(level);
      html.push(`<li>${inlineMarkdown(bullet[2])}</li>`);
      index += 1;
      continue;
    }

    const numbered = /^(\s*)\d+\.\s+(.+)$/.exec(line);
    if (numbered) {
      flushParagraph();
      const level = Math.floor(numbered[1].length / 2) + 1;
      while (listStack.length < level) {
        html.push("<ol>");
        listStack.push("ol");
      }
      closeLists(level);
      html.push(`<li>${inlineMarkdown(numbered[2])}</li>`);
      index += 1;
      continue;
    }

    paragraph.push(trimmed);
    index += 1;
  }

  flushParagraph();
  closeLists();

  const tocHtml = toc
    .filter((item) => item.level <= 3)
    .map(
      (item) =>
        `<a class="toc-level-${item.level}" href="#${item.id}">${escapeHtml(
          item.text.replaceAll("`", ""),
        )}</a>`,
    )
    .join("\n");

  return { body: html.join("\n"), toc: tocHtml, headings: toc };
}

function pageShell({ title, description, body, toc = "", activeSlug }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | Summer Planning Wiki</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body data-active="${escapeHtml(activeSlug)}">
  <a class="skip-link" href="#content">Skip to content</a>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="eyebrow">ESOL Level 3</span>
        <a class="site-title" href="index.html">Summer Planning Wiki</a>
      </div>
      <nav aria-label="Planning documents">
        ${navItems}
      </nav>
      <div class="sidebar-toc" aria-label="On this page">
        <strong>On This Page</strong>
        ${toc || "<span>No sections yet.</span>"}
      </div>
      <div class="sidebar-note">
        <strong>Purpose</strong>
        <span>Community class first. App second. English as the tool for real life.</span>
      </div>
    </aside>
    <main id="content" class="content">
      <header class="page-header">
        <span class="eyebrow">Summer 2026 Planning</span>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </header>
      <article class="article">
        ${body}
      </article>
    </main>
  </div>
  <script src="wiki.js"></script>
</body>
</html>`;
}

function indexPage() {
  const cards = docs
    .map(
      (doc) => `<a class="doc-card" href="${doc.slug}.html">
        <span>${escapeHtml(doc.label)}</span>
        <p>${escapeHtml(doc.description)}</p>
      </a>`,
    )
    .join("\n");

  const body = `<section class="home-intro">
    <h2>Start Here</h2>
    <p>This wiki gathers the summer planning documents into one readable place. The center of the work is a community-centered ESOL class where every activity helps students handle real life in English.</p>
  </section>
  <section class="doc-grid" aria-label="Planning documents">
    ${cards}
  </section>
  <section class="home-principles">
    <h2>Decision Filter</h2>
    <ul>
      <li>Does this help students live, work, study, advocate, or participate more confidently in the United States?</li>
      <li>Does the app tell students what to do next without making them interpret a menu?</li>
      <li>Does the task have a clear purpose, due date, and class connection?</li>
      <li>Does the lesson create speaking, reading, writing, listening, and critical-thinking practice?</li>
    </ul>
  </section>`;

  return pageShell({
    title: "Summer Planning Wiki",
    description:
      "A browsable version of the planning documents for next year's community-centered ESOL class and app redesign.",
    body,
    activeSlug: "index",
  });
}

const styles = `:root {
  color-scheme: light;
  --ink: #24313f;
  --muted: #667085;
  --line: #f0c8a7;
  --paper: #fff7df;
  --surface: #ffffff;
  --accent: #007f8f;
  --accent-2: #e45d34;
  --accent-3: #6d58c6;
  --accent-4: #e0a400;
  --accent-soft: #d9f7f3;
  --pink-soft: #ffe4ee;
  --peach-soft: #ffe3bd;
  --sun-soft: #fff3b0;
  --leaf-soft: #dff6cf;
  --mark: #fff0a8;
  --shadow: 0 18px 45px rgba(129, 78, 28, 0.13);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 196, 87, 0.45), transparent 22rem),
    radial-gradient(circle at 82% 8%, rgba(0, 169, 181, 0.22), transparent 20rem),
    linear-gradient(135deg, #fff7df 0%, #fff3ea 45%, #eefbf6 100%);
  color: var(--ink);
  font-family: Lato, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.65;
}

a {
  color: var(--accent);
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -3rem;
  background: var(--ink);
  color: white;
  padding: 0.5rem 0.75rem;
  z-index: 10;
}

.skip-link:focus {
  top: 1rem;
}

.layout {
  display: grid;
  grid-template-columns: 19rem minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: auto;
  border-right: 1px solid rgba(176, 104, 43, 0.22);
  background:
    linear-gradient(180deg, rgba(255, 244, 198, 0.92), rgba(220, 247, 241, 0.92)),
    #fff7df;
  padding: 1.5rem;
}

.brand {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
}

.eyebrow {
  color: var(--accent-2);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.site-title {
  color: var(--ink);
  font-size: 1.35rem;
  font-weight: 850;
  line-height: 1.15;
  text-decoration: none;
}

.site-title::after {
  background: linear-gradient(90deg, #e45d34, #e0a400, #007f8f, #6d58c6);
  content: "";
  display: block;
  height: 4px;
  margin-top: 0.7rem;
  width: 5.25rem;
}

nav {
  display: grid;
  gap: 0.35rem;
}

nav a {
  border-radius: 8px;
  color: var(--ink);
  font-weight: 700;
  padding: 0.65rem 0.75rem;
  text-decoration: none;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

nav a:hover,
nav a[aria-current="page"] {
  background: rgba(255, 255, 255, 0.84);
  box-shadow: inset 0 0 0 1px rgba(0, 127, 143, 0.18), 0 8px 22px rgba(0, 127, 143, 0.1);
  color: var(--accent);
}

nav a:hover {
  transform: translateY(-1px);
}

.sidebar-note {
  border-top: 1px solid var(--line);
  color: var(--muted);
  display: grid;
  gap: 0.25rem;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
}

.sidebar-note strong {
  color: var(--ink);
}

.content {
  min-width: 0;
  padding: 3rem clamp(1rem, 4vw, 4rem);
}

.page-header {
  max-width: 58rem;
  margin-bottom: 2rem;
  position: relative;
}

.page-header::before {
  background: linear-gradient(90deg, #e45d34, #ffc857, #00a9b5, #7f6bd9);
  content: "";
  display: block;
  height: 8px;
  margin-bottom: 1.25rem;
  width: min(18rem, 60vw);
}

.page-header h1 {
  font-size: clamp(2rem, 4vw, 4.25rem);
  letter-spacing: 0;
  line-height: 1.05;
  margin: 0.25rem 0 1rem;
  text-wrap: balance;
}

.page-header p {
  color: var(--muted);
  font-size: 1.1rem;
  margin: 0;
  max-width: 48rem;
}

.article {
  background: var(--surface);
  border: 1px solid rgba(176, 104, 43, 0.18);
  box-shadow: var(--shadow);
  max-width: 58rem;
  padding: clamp(1.25rem, 4vw, 3rem);
}

.article h1,
.article h2,
.article h3,
.article h4 {
  line-height: 1.18;
  margin: 2rem 0 0.75rem;
}

.article h1:first-child,
.article h2:first-child {
  margin-top: 0;
}

.article h2 {
  border-top: 1px solid rgba(0, 127, 143, 0.2);
  font-size: 1.55rem;
  padding-top: 1.5rem;
}

.article h3 {
  color: var(--accent);
  font-size: 1.15rem;
}

.article p,
.article li {
  font-size: 1rem;
}

.article blockquote {
  background: var(--mark);
  border-left: 5px solid var(--accent-4);
  font-size: 1.05rem;
  font-weight: 750;
  margin: 1.25rem 0;
  padding: 1rem 1.25rem;
}

.article code {
  background: #e8f8f6;
  border-radius: 5px;
  font-size: 0.92em;
  padding: 0.1rem 0.3rem;
}

.article pre {
  background: #17212f;
  color: #f8fafc;
  overflow: auto;
  padding: 1rem;
}

.article pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}

.article ul,
.article ol {
  padding-left: 1.45rem;
}

.article li + li {
  margin-top: 0.25rem;
}

.table-wrap {
  overflow-x: auto;
  margin: 1.25rem 0;
}

table {
  border-collapse: collapse;
  min-width: 100%;
}

th,
td {
  border: 1px solid var(--line);
  padding: 0.7rem 0.8rem;
  text-align: left;
  vertical-align: top;
}

th {
  background: linear-gradient(135deg, var(--accent-soft), var(--sun-soft));
  color: #173b46;
  font-size: 0.88rem;
}

tr:nth-child(even) td {
  background: #fffaf0;
}

.sidebar-toc {
  border-top: 1px solid rgba(176, 104, 43, 0.22);
  display: grid;
  gap: 0.45rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
}

.sidebar-toc strong {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.sidebar-toc a {
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.35;
  text-decoration: none;
}

.sidebar-toc a:hover {
  color: var(--accent);
}

.toc-level-3 {
  padding-left: 0.75rem;
}

.home-intro,
.home-principles {
  max-width: 54rem;
}

.doc-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 2rem 0;
}

.doc-card {
  background: linear-gradient(145deg, var(--surface), #fff9e9);
  border: 1px solid rgba(176, 104, 43, 0.18);
  color: var(--ink);
  display: grid;
  min-height: 12rem;
  padding: 1.25rem;
  position: relative;
  text-decoration: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.doc-card::before {
  background: linear-gradient(180deg, #e45d34, #e0a400, #007f8f, #6d58c6);
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 6px;
}

.doc-card:hover {
  border-color: rgba(0, 127, 143, 0.34);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.doc-card span {
  color: var(--accent);
  font-size: 1.2rem;
  font-weight: 850;
}

.doc-card p {
  color: var(--muted);
  margin: 0.75rem 0 0;
}

@media (max-width: 980px) {
  .layout {
    display: block;
  }

  .sidebar {
    height: auto;
    position: relative;
  }

  nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sidebar-toc {
    max-height: 15rem;
    overflow: auto;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 1.25rem;
  }

  nav,
  .doc-grid {
    grid-template-columns: 1fr;
  }

  .article {
    border-left: 0;
    border-right: 0;
    margin-left: -1.25rem;
    margin-right: -1.25rem;
  }
}

@media print {
  .sidebar,
  .sidebar-toc,
  .skip-link {
    display: none;
  }

  .layout {
    display: block;
  }

  .content {
    padding: 0;
  }

  .article {
    border: 0;
    box-shadow: none;
  }
}`;

const script = `const active = document.body.dataset.active;
document.querySelectorAll("nav a").forEach((link) => {
  if (link.dataset.slug === active) {
    link.setAttribute("aria-current", "page");
  }
});`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#176b87"/>
  <path d="M17 18h30v28H17z" fill="#fffdf8"/>
  <path d="M23 25h18M23 32h18M23 39h11" stroke="#9f5f2f" stroke-width="4" stroke-linecap="round"/>
</svg>`;

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "styles.css"), styles);
await writeFile(path.join(outputDir, "wiki.js"), script);
await writeFile(path.join(outputDir, "favicon.svg"), favicon);
await writeFile(path.join(outputDir, "index.html"), indexPage());

for (const doc of docs) {
  const markdown = await readFile(path.join(sourceDir, doc.file), "utf8");
  const rendered = markdownToHtml(markdown);
  await writeFile(
    path.join(outputDir, `${doc.slug}.html`),
    pageShell({
      title: doc.label,
      description: doc.description,
      body: rendered.body,
      toc: rendered.toc,
      activeSlug: doc.slug,
    }),
  );
}

await mkdir(publicOutputDir, { recursive: true });
await cp(outputDir, publicOutputDir, { recursive: true, force: true });

console.log(`Built ${docs.length + 1} pages in ${path.relative(root, outputDir)}`);
console.log(`Copied wiki to ${path.relative(root, publicOutputDir)}`);
