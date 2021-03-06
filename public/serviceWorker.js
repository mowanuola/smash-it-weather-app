const weatherApp = "smash-it-weather-app";
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/assets/logo.png",
  "/assets/favicon.ico.",
  "/assets/logo512x512.png",
  "/assets/logo192x192.png",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(weatherApp).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
