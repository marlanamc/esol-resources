import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { config as loadDotenv } from "dotenv";
import { getAllTermsWithContext, buildSearchQuery } from "./fetch-vocab-images";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "../../src/data/public-level1-vocab";

// Load environment variables
loadDotenv({ path: path.join(__dirname, "../../.env.local") });
loadDotenv({ path: path.join(__dirname, "../../.env") });

const UNSPLASH_ACCESS_KEY =
  process.env.UNSPLASH_ACCESS_KEY?.trim() ||
  process.env.UNSPLASH_CLIENT_ID?.trim() ||
  process.env.UNSPLASH_ACCESS_KEY_ID?.trim() ||
  process.env.PIXABAY_API_KEY?.trim();
const OVERRIDES_FILE = path.join(__dirname, "../../src/data/vocab-images-overrides.ts");
const PORT = 4000;
const UNSPLASH_RATE_LIMIT_PER_HOUR = (() => {
  const raw = process.env.UNSPLASH_RATE_LIMIT_PER_HOUR?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 50;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
})();
const UNSPLASH_WINDOW_MS = 60 * 60 * 1000;

let unsplashSearchWindowStartMs = Date.now();
let unsplashSearchCountThisWindow = 0;

function getUnsplashSearchState() {
  const now = Date.now();
  if (now - unsplashSearchWindowStartMs >= UNSPLASH_WINDOW_MS) {
    unsplashSearchWindowStartMs = now;
    unsplashSearchCountThisWindow = 0;
  }
  const resetAtMs = unsplashSearchWindowStartMs + UNSPLASH_WINDOW_MS;
  return {
    limit: UNSPLASH_RATE_LIMIT_PER_HOUR,
    remaining: Math.max(0, UNSPLASH_RATE_LIMIT_PER_HOUR - unsplashSearchCountThisWindow),
    used: unsplashSearchCountThisWindow,
    resetAtMs,
    resetInMs: Math.max(0, resetAtMs - now),
  };
}

function setUnsplashRateHeaders(res: http.ServerResponse, state: ReturnType<typeof getUnsplashSearchState>) {
  res.setHeader("X-Unsplash-Limit", String(state.limit));
  res.setHeader("X-Unsplash-Remaining", String(Math.max(0, state.remaining)));
  res.setHeader("X-Unsplash-Reset-In-Ms", String(state.resetInMs));
  res.setHeader("X-Unsplash-Reset-At", new Date(state.resetAtMs).toISOString());
}

function saveOverride(term: string, url: string) {
  let content = fs.readFileSync(OVERRIDES_FILE, "utf-8");
  const regex = new RegExp(`("${term}"|${term}):\\s*".*?",?\\n`);
  
  if (content.match(regex)) {
    content = content.replace(regex, `"${term}": "${url}",\n`);
  } else {
    content = content.replace(/};\s*$/, "");
    content += `  "${term}": "${url}",\n};\n`;
  }
  fs.writeFileSync(OVERRIDES_FILE, content);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "", `http://localhost:${PORT}`);
  
  // CORS and Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (url.pathname === "/api/categories") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(LEVEL1_PUBLIC_VOCAB_UNITS));
      return;
    }

    // 2b. Local Unsplash rate-limit status
    if (url.pathname === "/api/search-rate") {
      const state = getUnsplashSearchState();
      setUnsplashRateHeaders(res, state);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          limit: state.limit,
          remaining: state.remaining,
          resetInMs: state.resetInMs,
          resetAt: new Date(state.resetAtMs).toISOString(),
        }),
      );
      return;
    }

    // 2. Return terms for a specific theme
    if (url.pathname === "/api/terms") {
      const theme = url.searchParams.get("theme");
      const terms = getAllTermsWithContext(undefined, theme || undefined);
      const results = terms.map(t => ({
        ...t,
        query: buildSearchQuery(t.term, t.category)
      })).filter(t => t.query); // Filter out skipped terms
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
      return;
    }

    // 3. Proxy Unsplash Search
    if (url.pathname === "/api/unsplash" || url.pathname === "/api/pixabay") {
      const stateBefore = getUnsplashSearchState();
      if (!UNSPLASH_ACCESS_KEY) throw new Error("No Unsplash API key in env (set UNSPLASH_ACCESS_KEY)");
      if (stateBefore.remaining <= 0) {
        setUnsplashRateHeaders(res, stateBefore);
        res.writeHead(429, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            error: "Local Unsplash hourly limit reached. Wait for the timer to reset.",
            remaining: stateBefore.remaining,
            limit: stateBefore.limit,
            resetInMs: stateBefore.resetInMs,
          }),
        );
        return;
      }

      unsplashSearchCountThisWindow += 1;
      const state = getUnsplashSearchState();
      const q = url.searchParams.get("q") || "";
      const unsplashUrl = new URL("https://api.unsplash.com/search/photos");
      unsplashUrl.searchParams.set("query", q);
      unsplashUrl.searchParams.set("per_page", "15");
      unsplashUrl.searchParams.set("orientation", "landscape");
      
      const response = await fetch(unsplashUrl.toString(), {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          "Accept-Version": "v1",
        },
      });
      if (response.status === 403) {
        const text = await response.text();
        throw new Error(`Unsplash 403: ${text.slice(0, 200)}`);
      }
      if (!response.ok) throw new Error(`Unsplash Error ${response.status}`);

      const data = (await response.json()) as { results?: Array<Record<string, unknown>> };
      const hits = (data.results ?? [])
        .map((result: Record<string, unknown>) => {
          const urls = result.urls as Record<string, string | undefined> | undefined;
          const imageUrl = (urls?.regular || urls?.small || urls?.full || urls?.raw) ?? "";
          if (!imageUrl) return null;
          return {
            ...result,
            webformatURL: imageUrl,
            largeImageURL: imageUrl,
          };
        })
        .filter((hit): hit is Record<string, unknown> => Boolean(hit));
      
      setUnsplashRateHeaders(res, state);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ...data, hits }));
      return;
    }

    // 4. Save Override Action
    if (url.pathname === "/api/override" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => body += chunk.toString());
      req.on("end", () => {
        const { term, url } = JSON.parse(body);
        if (term && url) saveOverride(term, url);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    // 5. Serve Frontend HTML
    if (url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(HTML_CONTENT);
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  } catch (err: any) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: err?.message ?? "Internal server error",
        details: err?.toString?.() ?? String(err),
      }),
    );
  }
});

server.listen(PORT, () => {
  console.log(`Curator dashboard running on http://localhost:${PORT}`);
});

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Unsplash Curation Dashboard</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; background: #fafafa; color: #111; padding: 2rem; max-width: 1200px; margin: 0 auto; }
    h1 { font-weight: 800; letter-spacing: -1px; }
    select { padding: 10px; font-size: 16px; margin-bottom: 2rem; border-radius: 8px; border: 1px solid #ccc; width: 300px;}
    .rate-panel { background: #ffffff; border: 1px solid #ddd; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 1rem; font-size: 0.95rem; color: #1f2937; }
    .term-block { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .term-title { font-size: 1.5rem; font-weight: bold; margin-top: 0; }
    .query-text { color: #666; font-family: monospace; font-size: 0.9rem; margin-bottom: 1rem;}
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .img-card { position: relative; cursor: pointer; border-radius: 8px; overflow: hidden; transition: 0.2s; border: 3px solid transparent; }
    .img-card:hover { transform: scale(1.03); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
    .img-card.selected { border-color: #22c55e; }
    .img-card img { width: 100%; height: 160px; object-fit: cover; display: block; }
    .img-card .saved-badge { display: none; position: absolute; top: 8px; right: 8px; background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .img-card.selected .saved-badge { display: block; }
  </style>
</head>
<body>
  <h1>📸 Vocab Curation Dashboard</h1>
  <p>Browse Unsplash results and lock in terms fast from one place. This dashboard now tracks your local hourly search budget to reduce rate-limit interruptions.</p>
  <div id="ratePanel" class="rate-panel">Unsplash budget: loading…</div>
  
  <select id="themeSelect">
    <option value="">-- Choose a Theme --</option>
  </select>

  <div id="content"></div>

  <script>
    const rateState = {
      limit: 50,
      remaining: 50,
      resetAt: Date.now() + 60 * 60 * 1000
    };

    async function init() {
      const res = await fetch('/api/categories');
      const units = await res.json();
      try {
        const rateRes = await fetch('/api/search-rate');
        const ratePayload = await rateRes.json();
        syncRateStateFromResponse(rateRes.headers, ratePayload);
      } catch (_) {}

      const select = document.getElementById('themeSelect');
      renderRatePanel();
      setInterval(renderRatePanel, 1000);
      
      units.forEach(unit => {
        const group = document.createElement('optgroup');
        group.label = unit.title;
        unit.categories.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat.label;
          opt.innerText = cat.label;
          group.appendChild(opt);
        });
        select.appendChild(group);
      });

      select.addEventListener('change', async (e) => {
        if(!e.target.value) return;
        loadTheme(e.target.value);
      });
    }

    function renderRatePanel() {
      const panel = document.getElementById('ratePanel');
      if (!panel) return;

      const remainingMs = Math.max(0, rateState.resetAt - Date.now());
      const mins = Math.floor(remainingMs / 60000);
      const secs = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, "0");
      panel.textContent =
        "Unsplash budget: " +
        rateState.remaining +
        "/" +
        rateState.limit +
        " searches left • resets in " +
        mins +
        "m " +
        secs +
        "s";
      panel.style.color = rateState.remaining <= 5 ? "#b91c1c" : "#1f2937";
    }

    function syncRateStateFromResponse(headers, bodyData) {
      const limit = Number(headers.get("X-Unsplash-Limit"));
      const remaining = Number(headers.get("X-Unsplash-Remaining"));
      const resetInMs = Number(headers.get("X-Unsplash-Reset-In-Ms"));

      if (Number.isFinite(limit)) {
        rateState.limit = Math.max(1, Math.trunc(limit));
      }
      if (Number.isFinite(remaining)) {
        rateState.remaining = Math.max(0, Math.trunc(remaining));
      }
      if (Number.isFinite(resetInMs)) {
        rateState.resetAt = Date.now() + resetInMs;
      }
      if (typeof bodyData?.error === "string" && Number.isFinite(Number(bodyData?.limit))) {
        rateState.limit = Math.max(1, Number(bodyData.limit));
      }
      if (typeof bodyData?.remaining === "number" && Number.isFinite(bodyData.remaining)) {
        rateState.remaining = Math.max(0, Math.trunc(bodyData.remaining));
      }
      if (typeof bodyData?.resetInMs === "number" && Number.isFinite(bodyData.resetInMs)) {
        rateState.resetAt = Date.now() + bodyData.resetInMs;
      }

      if (rateState.resetAt < Date.now()) {
        rateState.resetAt = Date.now() + 60 * 60 * 1000;
        rateState.remaining = rateState.limit;
      }

      renderRatePanel();
    }

    async function loadTheme(theme) {
      const content = document.getElementById('content');
      content.innerHTML = "<h3>Loading terms...</h3>";
      
      const res = await fetch('/api/terms?theme=' + encodeURIComponent(theme));
      const terms = await res.json();
      
      content.innerHTML = '';
      
      for (const t of terms) {
        const block = document.createElement('div');
        block.className = 'term-block';
        block.innerHTML = \`
          <p class="term-title">\${t.term}</p>
          <div class="query-text">
            <input type="text" value="\${t.query}" id="input-\${t.term.replace(/[^a-zA-Z]/g, '')}" style="padding: 6px; width: 350px; border-radius: 4px; border: 1px solid #ccc; font-family: monospace;"/>
            <button style="padding: 6px 12px; cursor: pointer;" onclick="fetchImages('\${t.term}', document.getElementById('input-\${t.term.replace(/[^a-zA-Z]/g, '')}').value, document.getElementById('grid-\${t.term.replace(/[^a-zA-Z]/g, '')}'))">Search Again</button>
          </div>
        \`;
        
        const grid = document.createElement('div');
        grid.className = 'grid';
        grid.id = 'grid-' + t.term.replace(/[^a-zA-Z]/g, '');
        block.appendChild(grid);
        content.appendChild(block);

        fetchImages(t.term, t.query, grid);
      }
    }

    async function fetchImages(term, query, grid) {
      if (rateState.remaining <= 0) {
        grid.innerHTML = "<i>Unsplash budget reached. Wait for the timer before searching again.</i>";
        return;
      }

      grid.innerHTML = "<i>Searching Unsplash...</i>";
      const res = await fetch('/api/unsplash?q=' + encodeURIComponent(query));
      const data = await res.json();
      syncRateStateFromResponse(res.headers, data);

      if (res.status === 429) {
        grid.innerHTML =
          "<i>" + (data?.error || "Unsplash rate limit reached. Wait for timer.") + "</i>";
        return;
      }

      grid.innerHTML = '';

      if (!data.hits || data.hits.length === 0) {
        grid.innerHTML = "<i>No results found on Unsplash. Try editing the query in the code!</i>";
        return;
      }

      data.hits.forEach(hit => {
        const url = hit.webformatURL || hit.largeImageURL;
        const card = document.createElement('div');
        card.className = 'img-card';
        card.innerHTML = \`
          <span class="saved-badge">SAVED</span>
          <img src="\${url}" loading="lazy"/>
        \`;
        
        card.onclick = async () => {
          // Visual select
          Array.from(grid.children).forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          
          Object.assign(card.style, { opacity: '0.5', pointerEvents: 'none' });
          await fetch('/api/override', {
            method: 'POST',
            body: JSON.stringify({ term, url })
          });
          Object.assign(card.style, { opacity: '1', pointerEvents: 'auto' });
        };

        grid.appendChild(card);
      });
    }

    init();
  </script>
</body>
</html>
`;
