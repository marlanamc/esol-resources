import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { config as loadDotenv } from "dotenv";
import { getAllTermsWithContext, buildSearchQuery } from "./fetch-vocab-images";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "../../src/data/public-level1-vocab";

// Load environment variables
loadDotenv({ path: path.join(__dirname, "../../.env.local") });
loadDotenv({ path: path.join(__dirname, "../../.env") });

const PIXABAY_KEY = process.env.PIXABAY_API_KEY?.trim();
const OVERRIDES_FILE = path.join(__dirname, "../../src/data/vocab-images-overrides.ts");
const PORT = 4000;

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

    // 3. Proxy Pixabay Search
    if (url.pathname === "/api/pixabay") {
      if (!PIXABAY_KEY) throw new Error("No PIXABAY_API_KEY in .env");
      const q = url.searchParams.get("q") || "";
      const pixUrl = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(q)}&image_type=photo&per_page=15&safesearch=true`;
      
      const response = await fetch(pixUrl);
      if (!response.ok) throw new Error("Pixabay Error");
      const data = await response.json();
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
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
    res.writeHead(500);
    res.end(err.toString());
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
  <title>Pixabay Curation Dashboard</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; background: #fafafa; color: #111; padding: 2rem; max-width: 1200px; margin: 0 auto; }
    h1 { font-weight: 800; letter-spacing: -1px; }
    select { padding: 10px; font-size: 16px; margin-bottom: 2rem; border-radius: 8px; border: 1px solid #ccc; width: 300px;}
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
  <p>Select a generic theme label to fetch vocabulary words and browse Pixabay alternatives. Click an image to lock it into your code instantly.</p>
  
  <select id="themeSelect">
    <option value="">-- Choose a Theme --</option>
  </select>

  <div id="content"></div>

  <script>
    async function init() {
      const res = await fetch('/api/categories');
      const units = await res.json();
      const select = document.getElementById('themeSelect');
      
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
      grid.innerHTML = "<i>Searching Pixabay...</i>";
      const res = await fetch('/api/pixabay?q=' + encodeURIComponent(query));
      const data = await res.json();
      grid.innerHTML = '';

      if (!data.hits || data.hits.length === 0) {
        grid.innerHTML = "<i>No results found on Pixabay. Try editing the query in the code!</i>";
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
