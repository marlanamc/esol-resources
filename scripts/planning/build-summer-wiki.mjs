import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "docs/planning/Summer-research");
const outputDir = path.join(sourceDir, "wiki");
const publicOutputDir = path.join(root, "public/summer-planning-wiki");
const mockupsDir = path.join(sourceDir, "image-mockups");

const primaryDocs = [
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
    file: "skill-chains-practice-paths-plan.md",
    slug: "skill-chains-practice-paths-plan",
    label: "Skill Chains / Practice Paths",
    description:
      "Technical and instructional plan for connecting micro lessons, preset games, pronunciation labs, and use-it tasks into guided chains.",
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

const otherDocs = [
  {
    file: "nrs-level-3-4-coverage-gap-plan.md",
    slug: "nrs-coverage-gap-plan",
    label: "NRS 3–4 Coverage Gap Plan",
    description:
      "Audit of NRS Level 3–4 topics and skills missing from the current class and app, with unit mapping and a summer build checklist.",
  },
  {
    file: "absent-student-catch-up-plan.md",
    slug: "absent-student-catch-up-plan",
    label: "Absent Student Catch-Up Plan",
    description:
      "One repeatable catch-up path for busy adult learners: required app tasks, make-up deadlines, and warm-up/announcement templates.",
  },
  {
    file: "school-year-at-a-glance.md",
    slug: "school-year-at-a-glance",
    label: "School Year At A Glance",
    description:
      "Basic month-by-month map of all ten units, with short December/June and February/April vacation weeks noted.",
  },
  {
    file: "september-app-onboarding-plan.md",
    slug: "september-app-onboarding-plan",
    label: "September App Onboarding Plan",
    description:
      "Chromebook boot camp, myesolclass.com login, password reset summer work, and an app scavenger hunt for Week 1–2.",
  },
];

const docs = [...primaryDocs, ...otherDocs];

const customPages = [
  {
    slug: "summer-work-map",
    label: "Summer Work Map",
    description:
      "A visual diagram for the weekend Advisor Bulletin Board sprint and the rest of the summer roadmap phases.",
  },
  {
    slug: "image-mockups",
    label: "Image Mockups",
    description:
      "Visual mockup ideas for the public homepage and map-style guided learning path.",
  },
];

const wikiHrefBySourceFile = new Map(
  docs.map((doc) => [doc.file, `${doc.slug}.html`]),
);

function renderNavLinks(pages) {
  return pages
    .map(
      (doc) =>
        `<a href="${doc.slug}.html" data-slug="${doc.slug}">${escapeHtml(doc.label)}</a>`,
    )
    .join("\n");
}

const navItems = `${renderNavLinks([...customPages, ...primaryDocs])}
        <div class="sidebar-nav-heading">Other documents</div>
        ${renderNavLinks(otherDocs)}`;

function resolveWikiHref(href) {
  if (
    !href ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
  ) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const pathPart = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);

  if (!pathPart.endsWith(".md")) {
    return href;
  }

  const fileName = path.basename(pathPart);
  const htmlPath = wikiHrefBySourceFile.get(fileName);
  if (htmlPath) {
    return `${htmlPath}${hash}`;
  }

  return href.replace(/\.md(?=#|$)/, ".html");
}

function renderDocCards(pages) {
  return pages
    .map(
      (doc) => `<a class="doc-card" href="${doc.slug}.html">
        <span>${escapeHtml(doc.label)}</span>
        <p>${escapeHtml(doc.description)}</p>
      </a>`,
    )
    .join("\n");
}

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
      `<a href="${escapeHtml(resolveWikiHref(href))}">${inlineMarkdown(text)}</a>`,
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
      <a class="sidebar-dashboard-link" href="/dashboard">← Back to Dashboard</a>
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

function summerWorkMapPage() {
  const toc = [
    '<a class="toc-level-2" href="#weekend-sprint">Weekend Sprint</a>',
    '<a class="toc-level-2" href="#summer-phases">Summer Phases</a>',
    '<a class="toc-level-2" href="#weekly-rhythm">Weekly Rhythm</a>',
    '<a class="toc-level-2" href="#decision-rules">Decision Rules</a>',
  ].join("\n");

  const body = `<section class="roadmap-hero">
    <div>
      <span class="roadmap-kicker">Start here</span>
      <h2 id="weekend-sprint">Weekend Sprint: Advisor Bulletin Board</h2>
      <p>First priority: finish the Advisor Bulletin Board/resource website by <strong>Monday, May 25, 2026</strong>. This is the cleanest short-term win because it directly supports the community-school mission before the bigger app restructuring begins.</p>
    </div>
    <a class="roadmap-button" href="school-resource-website-plan.html">Open Resource Plan</a>
  </section>

  <section class="sprint-board" aria-label="Advisor Bulletin Board sprint tasks">
    <div class="sprint-card priority">
      <span>May 23-25</span>
      <h3>Populate Core Resources</h3>
      <p>Jobs, housing, health, food, immigration, legal aid, ESOL, money, childcare, and school/community supports.</p>
    </div>
    <div class="sprint-card">
      <span>Quality Check</span>
      <h3>Make It Trustworthy</h3>
      <p>Check links, phone numbers, location, eligibility, language access, and whether each resource is actually useful.</p>
    </div>
    <div class="sprint-card">
      <span>Usability</span>
      <h3>Make It Easy To Scan</h3>
      <p>Use plain labels, simple categories, clear action language, and mobile-friendly organization.</p>
    </div>
  </section>

  <h2 id="summer-phases">Summer Phases</h2>
  <p>After the bulletin board sprint, use the phases below as the summer work map. The goal is to finish the major app, LMS, and content structure by the end of July, then use August for pilot polish, testing, and September readiness.</p>

  <section class="phase-flow" aria-label="Summer roadmap phases">
    <article class="phase-card phase-one">
      <div class="phase-number">1</div>
      <div>
        <span class="phase-date">By May 25</span>
        <h3>Advisor Bulletin Board</h3>
        <p>Populate the resource website so students and families can find practical community supports.</p>
        <a href="school-resource-website-plan.html">Resource plan</a>
      </div>
    </article>
    <article class="phase-card phase-two">
      <div class="phase-number">2</div>
      <div>
        <span class="phase-date">May 26-31</span>
        <h3>Inventory And Data Audit</h3>
        <p>Review what students actually used, then mark activities as keep, shorten, split, convert, or retire.</p>
        <a href="app-learning-path-roadmap.html#phase-1-planning-inventory">Phase 1</a>
      </div>
    </article>
    <article class="phase-card phase-three">
      <div class="phase-number">3</div>
      <div>
        <span class="phase-date">June 1-14</span>
        <h3>Dashboard And Weekly Path</h3>
        <p>Design the class dashboard around Next Up, This Week's Path, due dates, teacher order, and Skill Chain cards.</p>
        <a href="app-learning-path-roadmap.html#phase-2-class-dashboard-redesign">Phase 2</a>
        <a href="skill-chains-practice-paths-plan.html">Skill Chains</a>
      </div>
    </article>
    <article class="phase-card phase-four">
      <div class="phase-number">4</div>
      <div>
        <span class="phase-date">June 15-30</span>
        <h3>Content Conversion</h3>
        <p>Turn guides, games, vocab, quizzes, writing, case studies, video, and speaking tasks into microlearning paths and first Skill Chain prototypes.</p>
        <a href="app-learning-path-roadmap.html#phase-4-content-conversion">Phase 4</a>
        <a href="nrs-coverage-gap-plan.html">NRS gap plan</a>
      </div>
    </article>
    <article class="phase-card phase-five">
      <div class="phase-number">5</div>
      <div>
        <span class="phase-date">July 1-12</span>
        <h3>LMS Structure And Learner Types</h3>
        <p>Clarify enrolled students, independent learners, public/free users, supporters, former students, teachers, and possible partner programs.</p>
        <a href="app-learning-path-roadmap.html#phase-7-lms-organization-and-learner-types">Phase 7</a>
      </div>
    </article>
    <article class="phase-card phase-six">
      <div class="phase-number">6</div>
      <div>
        <span class="phase-date">July 13-26</span>
        <h3>Independent And Public Model</h3>
        <p>Define the public app path, free vs paid boundaries, low-cost supporter model, privacy, access, and beta users.</p>
        <a href="app-learning-path-roadmap.html#phase-6-independent-and-public-learner-model">Phase 6</a>
      </div>
    </article>
    <article class="phase-card phase-seven">
      <div class="phase-number">7</div>
      <div>
        <span class="phase-date">By July 31</span>
        <h3>Pilot Weeks And September Readiness</h3>
        <p>Build 2-3 pilot weeks and confirm the core September system is ready before August begins.</p>
        <a href="app-learning-path-roadmap.html#phase-5-pilot-and-refine">Phase 5</a>
      </div>
    </article>
  </section>

  <section class="august-buffer">
    <span>August buffer</span>
    <h3>Polish, test, and prepare for school start</h3>
    <p>August should not carry the core build. Use it for QA, fixing confusing flows, finishing teacher prep, entering final content, and making sure September feels calm instead of rushed.</p>
  </section>

  <h2 id="weekly-rhythm">Weekly Rhythm</h2>
  <section class="rhythm-grid" aria-label="Suggested weekly summer work rhythm">
    <div><strong>Monday</strong><span>Choose one deliverable for the week.</span></div>
    <div><strong>Tuesday</strong><span>Build or convert the smallest useful version.</span></div>
    <div><strong>Wednesday</strong><span>Test it as teacher and student/public user.</span></div>
    <div><strong>Thursday</strong><span>Revise for clarity, purpose, and mobile usability.</span></div>
    <div><strong>Friday</strong><span>Document decisions in the wiki and pick next week's focus.</span></div>
  </section>

  <h2 id="decision-rules">Decision Rules</h2>
  <section class="decision-strip">
    <div>Community usefulness comes first.</div>
    <div>Class students stay the priority.</div>
    <div>One clear next action beats a big menu.</div>
    <div>Public access needs structure before scale.</div>
  </section>`;

  return pageShell({
    title: "Summer Work Map",
    description:
      "A visual plan for finishing the Advisor Bulletin Board first, then moving through the summer app and LMS roadmap phases.",
    body,
    toc,
    activeSlug: "summer-work-map",
  });
}

function imageMockupsPage() {
  const toc = [
    '<a class="toc-level-2" href="#homepage">Homepage</a>',
    '<a class="toc-level-2" href="#map-idea">Map Idea</a>',
    '<a class="toc-level-2" href="#design-notes">Design Notes</a>',
  ].join("\n");

  const body = `<section class="mockup-intro">
    <h2>Mockup Gallery</h2>
    <p>These are early visual ideas for where the app could go this summer. Use them as reference points while designing the public/independent learner experience and the guided path model.</p>
  </section>

  <section class="mockup-gallery" aria-label="App mockup ideas">
    <figure class="mockup-card" id="homepage">
      <a href="image-mockups/homepage.png">
        <img src="image-mockups/homepage.png" alt="Homepage mockup idea">
      </a>
      <figcaption>
        <strong>Homepage</strong>
        <span>Public-facing first impression and entry point.</span>
      </figcaption>
    </figure>

    <figure class="mockup-card" id="map-idea">
      <a href="image-mockups/map-idea.png">
        <img src="image-mockups/map-idea.png" alt="Map-style guided learning path mockup idea">
      </a>
      <figcaption>
        <strong>Map Idea</strong>
        <span>Possible visual model for a guided path: finish a micro lesson, then move to the next practice/game step.</span>
      </figcaption>
    </figure>
  </section>

  <section class="mockup-notes" id="design-notes">
    <h2>Design Notes</h2>
    <ul>
      <li>Use these to think about independent users and public launch, not only enrolled class students.</li>
      <li>The map idea should reduce decision fatigue: students see the next step without interpreting a category menu.</li>
      <li>The homepage should communicate that this app is for adult ESOL learners building real-life confidence.</li>
      <li>Before implementation, check mobile readability, dashboard fit, and whether each screen still says "do this next."</li>
    </ul>
  </section>`;

  return pageShell({
    title: "Image Mockups",
    description:
      "Visual mockup ideas for the public homepage and map-style guided learning path.",
    body,
    toc,
    activeSlug: "image-mockups",
  });
}

function indexPage() {
  const body = `<section class="home-intro">
    <h2>Start Here</h2>
    <p>This wiki gathers the summer planning documents into one readable place. The center of the work is a community-centered ESOL class where every activity helps students handle real life in English.</p>
  </section>
  <section class="doc-grid" aria-label="Planning documents">
    ${renderDocCards([...customPages, ...primaryDocs])}
  </section>
  <section class="home-other-docs">
    <h2>Other documents</h2>
    <p>Detailed plans saved for later — no need to focus on these yet.</p>
    <div class="doc-grid doc-grid-other">
      ${renderDocCards(otherDocs)}
    </div>
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

.sidebar-dashboard-link {
  align-items: center;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 127, 143, 0.22);
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(0, 127, 143, 0.08);
  color: var(--accent);
  display: inline-flex;
  font-size: 0.82rem;
  font-weight: 800;
  justify-content: center;
  margin-bottom: 1.25rem;
  padding: 0.55rem 0.85rem;
  text-decoration: none;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  width: 100%;
}

.sidebar-dashboard-link:hover {
  background: #fff;
  box-shadow: 0 10px 24px rgba(0, 127, 143, 0.14);
  transform: translateY(-1px);
}

.sidebar-nav-heading {
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-top: 1rem;
  padding-top: 1rem;
  text-transform: uppercase;
}

nav a[data-slug="nrs-coverage-gap-plan"],
nav a[data-slug="absent-student-catch-up-plan"],
nav a[data-slug="school-year-at-a-glance"],
nav a[data-slug="september-app-onboarding-plan"] {
  color: var(--muted);
  font-weight: 700;
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

.home-other-docs {
  margin-top: 0.5rem;
}

.home-other-docs h2 {
  color: var(--ink);
  font-size: 1.15rem;
  margin: 0;
}

.home-other-docs > p {
  color: var(--muted);
  font-size: 0.92rem;
  margin: 0.35rem 0 0;
}

.doc-grid-other {
  margin-top: 0.85rem;
}

.doc-grid-other .doc-card {
  opacity: 0.92;
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

.mockup-intro {
  max-width: 48rem;
}

.mockup-intro h2 {
  border-top: 0;
  margin-top: 0;
  padding-top: 0;
}

.mockup-gallery {
  display: grid;
  gap: 1.25rem;
  margin: 1.5rem 0 2rem;
}

.mockup-card {
  background: linear-gradient(145deg, #fffaf0, #e9fbf7);
  border: 1px solid rgba(176, 104, 43, 0.18);
  margin: 0;
  padding: 1rem;
}

.mockup-card a {
  display: block;
}

.mockup-card img {
  background: white;
  border: 1px solid rgba(36, 49, 63, 0.12);
  box-shadow: 0 14px 35px rgba(36, 49, 63, 0.12);
  display: block;
  height: auto;
  max-width: 100%;
}

.mockup-card figcaption {
  display: grid;
  gap: 0.2rem;
  padding-top: 0.85rem;
}

.mockup-card figcaption strong {
  color: var(--accent);
  font-size: 1.05rem;
}

.mockup-card figcaption span,
.mockup-notes li {
  color: var(--muted);
}

.mockup-notes {
  background: #fffaf0;
  border: 1px solid rgba(176, 104, 43, 0.18);
  padding: 1rem 1.25rem;
}

.roadmap-hero {
  align-items: center;
  background: linear-gradient(135deg, #fff0a8, #d9f7f3 58%, #ffe4ee);
  border: 1px solid rgba(176, 104, 43, 0.2);
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1.35rem;
}

.roadmap-hero h2 {
  border-top: 0;
  margin: 0.2rem 0 0.5rem;
  padding-top: 0;
}

.roadmap-hero p {
  margin: 0;
}

.roadmap-kicker,
.phase-date,
.sprint-card span,
.august-buffer span {
  color: var(--accent-2);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.roadmap-button,
.phase-card a {
  align-items: center;
  background: #24313f;
  color: white;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  padding: 0.7rem 0.9rem;
  text-decoration: none;
  white-space: nowrap;
}

.sprint-board {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 1.5rem 0 2rem;
}

.sprint-card {
  background: #fffaf0;
  border: 1px solid rgba(176, 104, 43, 0.18);
  padding: 1rem;
}

.sprint-card.priority {
  background: linear-gradient(145deg, #ffe3bd, #fff3b0);
}

.sprint-card h3,
.phase-card h3,
.august-buffer h3 {
  color: var(--ink);
  margin: 0.35rem 0 0.4rem;
}

.sprint-card p,
.phase-card p,
.august-buffer p {
  color: var(--muted);
  margin: 0;
}

.phase-flow {
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0 2rem;
  position: relative;
}

.phase-card {
  align-items: start;
  border: 1px solid rgba(176, 104, 43, 0.18);
  display: grid;
  gap: 1rem;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 1.1rem;
}

.phase-number {
  align-items: center;
  background: white;
  border: 3px solid currentColor;
  border-radius: 999px;
  display: flex;
  font-size: 1.15rem;
  font-weight: 900;
  height: 2.6rem;
  justify-content: center;
  width: 2.6rem;
}

.phase-one {
  background: #fff3b0;
  color: #b66a00;
}

.phase-two {
  background: #d9f7f3;
  color: #007f8f;
}

.phase-three {
  background: #dff6cf;
  color: #39833a;
}

.phase-four {
  background: #ffe4ee;
  color: #c24176;
}

.phase-five {
  background: #e7e1ff;
  color: #6d58c6;
}

.phase-six {
  background: #ffe3bd;
  color: #b85f21;
}

.phase-seven {
  background: linear-gradient(135deg, #d9f7f3, #fff3b0);
  color: #007f8f;
}

.phase-card a {
  background: rgba(36, 49, 63, 0.9);
  margin-top: 0.85rem;
  width: fit-content;
}

.august-buffer {
  background: #24313f;
  color: white;
  margin: 1.5rem 0 2rem;
  padding: 1.35rem;
}

.august-buffer span,
.august-buffer h3,
.august-buffer p {
  color: white;
}

.rhythm-grid {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin: 1.25rem 0 2rem;
}

.rhythm-grid div {
  background: #fffaf0;
  border: 1px solid rgba(176, 104, 43, 0.18);
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem;
}

.rhythm-grid strong {
  color: var(--accent);
}

.rhythm-grid span {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.4;
}

.decision-strip {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.decision-strip div {
  background: linear-gradient(135deg, #fff3b0, #d9f7f3);
  border: 1px solid rgba(176, 104, 43, 0.18);
  font-weight: 900;
  padding: 1rem;
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

  .roadmap-hero,
  .sprint-board,
  .mockup-gallery,
  .rhythm-grid,
  .decision-strip {
    grid-template-columns: 1fr;
  }

  .roadmap-hero {
    align-items: stretch;
    display: grid;
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
await writeFile(path.join(outputDir, "summer-work-map.html"), summerWorkMapPage());
await writeFile(path.join(outputDir, "image-mockups.html"), imageMockupsPage());
await cp(mockupsDir, path.join(outputDir, "image-mockups"), { recursive: true, force: true });

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

console.log(`Built ${docs.length + customPages.length + 1} pages in ${path.relative(root, outputDir)}`);
console.log(`Copied wiki to ${path.relative(root, publicOutputDir)}`);
