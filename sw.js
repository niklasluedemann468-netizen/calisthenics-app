const CACHE="calisthenics-flat-fixed-v2";
const FILES=[
"./","./index.html","./style.css","./app.js","./manifest.json","./sw.js","./icon-192.png","./icon-512.png",
"./liegestuetze.jpg","./kniebeugen.jpg","./plank.jpg","./glute_bridge.jpg","./ausfallschritte.jpg","./superman.jpg","./mountain_climbers.jpg","./dips.jpg"
];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
