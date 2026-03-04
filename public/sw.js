// Service Worker for Class Companion PWA
const swUrl = new URL(self.location.href);
const buildId = swUrl.searchParams.get("build") || "local-dev";
const CACHE_NAME = `class-companion-${buildId}`;
const OFFLINE_URL = "/offline";

const SHELL_CACHE = [
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  OFFLINE_URL,
];

const NAVIGATION_CACHE_ALLOWLIST = new Set([
  "/",
  "/login",
  "/offline",
]);

function isHashedStaticAsset(pathname) {
  if (pathname.startsWith("/_next/static/")) return true;
  if (/\.[a-f0-9]{8,}\.(js|css)$/.test(pathname)) return true;
  return false;
}

async function networkFirstWithTimeout(request, timeoutMs) {
  const cache = await caches.open(CACHE_NAME);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("network timeout")), timeoutMs);
  });

  try {
    const response = await Promise.race([fetch(request), timeoutPromise]);
    if (response && response.ok) {
      const url = new URL(request.url);
      if (NAVIGATION_CACHE_ALLOWLIST.has(url.pathname)) {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || cache.match(OFFLINE_URL);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_CACHE))
      .catch((error) => {
        console.error("[SW] shell cache install error:", error);
      })
  );
});

self.addEventListener("message", (event) => {
  if (!event.data || typeof event.data !== "object") return;

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (event.data.type === "CLEAR_USER_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => Promise.all(cacheNames.map((name) => caches.delete(name))))
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
            return Promise.resolve(false);
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (requestUrl.pathname === "/sw.js") {
    event.respondWith(fetch(event.request));
    return;
  }

  if (requestUrl.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirstWithTimeout(event.request, 4000));
    return;
  }

  if (isHashedStaticAsset(requestUrl.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        const response = await fetch(event.request);
        if (response && response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      })
    );
  }
});
