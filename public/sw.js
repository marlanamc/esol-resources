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

function isHashedStaticAsset(pathname) {
  if (pathname.startsWith("/_next/static/")) return true;
  if (/\.[a-f0-9]{8,}\.(js|css)$/.test(pathname)) return true;
  return false;
}

/** Guaranteed valid Response for respondWith (never reject). */
function offlinePlainResponse() {
  return new Response("Offline", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/**
 * Wrap so event.respondWith never receives a rejected promise or non-Response.
 * Rejections become Response.error() (valid for the SW API); bad values fall back to offline text for navigations only where needed.
 * @param {Response | Promise<Response>} r
 */
function asRespondWithPromise(r) {
  return Promise.resolve(r).then(
    (res) => (res instanceof Response ? res : offlinePlainResponse()),
    () => Response.error()
  );
}

async function networkFirstWithTimeout(request, timeoutMs) {
  let cache;
  try {
    cache = await caches.open(CACHE_NAME);
  } catch {
    try {
      const direct = await fetch(request);
      return direct instanceof Response ? direct : offlinePlainResponse();
    } catch {
      return offlinePlainResponse();
    }
  }

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("network timeout")), timeoutMs);
  });

  try {
    const response = await Promise.race([fetch(request), timeoutPromise]);
    // Do not cache HTML navigations — stale shells + cache-first static assets caused
    // a visible "old UI then flash to new" after deploys. Offline still falls back below.
    return response instanceof Response ? response : offlinePlainResponse();
  } catch {
    try {
      const cached = await cache.match(request);
      if (cached instanceof Response) return cached;
    } catch {
      /* ignore */
    }
    try {
      const offline = await cache.match(OFFLINE_URL);
      if (offline instanceof Response) return offline;
    } catch {
      /* ignore */
    }
    return offlinePlainResponse();
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

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }
  const title = payload.title || "Class Companion";
  const body = payload.body || "";
  const url = payload.url || "/";
  const tag = payload.tag || "default";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url },
      requireInteraction: false,
      actions: [{ action: "open", title: "Open" }],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(self.location.origin + (url.startsWith("/") ? url : "/" + url));
      }
    })
  );
});

/**
 * Network-first for build assets so online users always get the latest JS/CSS that
 * matches the document. Cache is updated for offline use only (fallback when fetch fails).
 */
async function handleHashedStaticAsset(request) {
  let cache;
  try {
    cache = await caches.open(CACHE_NAME);
  } catch {
    try {
      const direct = await fetch(request);
      return direct instanceof Response ? direct : Response.error();
    } catch {
      return Response.error();
    }
  }

  try {
    const response = await fetch(request);
    if (response instanceof Response && response.ok) {
      try {
        await cache.put(request, response.clone());
      } catch {
        /* ignore */
      }
    }
    return response instanceof Response ? response : Response.error();
  } catch {
    try {
      const cached = await cache.match(request);
      if (cached instanceof Response) return cached;
    } catch {
      /* ignore */
    }
    try {
      const fallback = await fetch(request);
      return fallback instanceof Response ? fallback : Response.error();
    } catch {
      return Response.error();
    }
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (requestUrl.pathname === "/sw.js") {
    event.respondWith(asRespondWithPromise(fetch(event.request)));
    return;
  }

  if (requestUrl.pathname.startsWith("/api/")) {
    event.respondWith(asRespondWithPromise(fetch(event.request)));
    return;
  }

  if (event.request.mode === "navigate") {
    // Bypass the HTTP cache for documents so we never paint a stale app shell after a deploy.
    const navRequest =
      event.request.cache === "only-if-cached"
        ? event.request
        : new Request(event.request, { cache: "no-store" });
    event.respondWith(asRespondWithPromise(networkFirstWithTimeout(navRequest, 4000)));
    return;
  }

  if (isHashedStaticAsset(requestUrl.pathname)) {
    event.respondWith(asRespondWithPromise(handleHashedStaticAsset(event.request)));
  }
});
