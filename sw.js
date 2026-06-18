const CACHE="calisthenics-poster-pwa-v1";
const FILES=[
"./","./index.html","./style.css","./app.js","./manifest.json","./sw.js","./icon-192.png","./icon-512.png",
"./assets/liegestuetze.jpg","./assets/kniebeugen.jpg","./assets/plank.jpg","./assets/glute_bridge.jpg",
"./assets/ausfallschritte.jpg","./assets/superman.jpg","./assets/mountain_climbers.jpg","./assets/dips.jpg"
];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
