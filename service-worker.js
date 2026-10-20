const CACHE_NAME = "okazawa-gomi-navi-v25-multiyear";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./layout.css",
  "./app.js",
  "./sort-data.js",
  "./sort.js",
  "./schedule-2026.js",
  "./manifest.webmanifest",
  "./icon-okazawa-v1-192.png",
  "./icon-okazawa-v1-512.png",
  "./icon-okazawa-v1-maskable-192.png",
  "./icon-okazawa-v1-maskable-512.png",
  "./favicon-okazawa-v1-32.png",
  "./apple-touch-icon-okazawa-v1-180.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith("okazawa-gomi-navi-") && key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // External data such as weather should stay network-first and is not cached here.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(event.request);
        if (cached) return cached;

        // Only the app's entry navigation may fall back to HTML. Returning it
        // for missing scripts, images or data would hide the real load error.
        const entry = new URL("./", self.location.href);
        const index = new URL("./index.html", self.location.href);
        if (event.request.mode === "navigate" &&
            (url.pathname === entry.pathname || url.pathname === index.pathname)) {
          const fallback = await cache.match(index.href);
          if (fallback) return fallback;
        }
        return Response.error();
      })
  );
});
