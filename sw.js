/* Protocole Tendon — service worker
   Rôle : rendre l'application utilisable sans réseau et la mettre à jour proprement.
   Incrémenter VERSION à chaque modification d'un fichier pour forcer le renouvellement. */

const VERSION = "v1";
const SHELL   = "tendon-shell-" + VERSION;   // fichiers de l'app, servis depuis le cache
const RUNTIME = "tendon-runtime-" + VERSION; // ressources externes (polices), mises en cache à l'usage

/* Tout ce qui doit être disponible hors ligne dès la première visite. */
const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./three.min.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(SHELL).then(c =>
      /* mise en cache une par une : un fichier manquant ne doit pas faire échouer
         l'installation entière, contrairement à cache.addAll */
      Promise.all(SHELL_FILES.map(u =>
        c.add(new Request(u, {cache: "reload"})).catch(() => null)
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  /* Navigation : on tente le réseau d'abord pour récupérer une version plus récente,
     et on retombe sur le cache si le réseau est absent. */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => {
          caches.open(SHELL).then(c => c.put("./index.html", res.clone())).catch(() => {});
          return res;
        })
        .catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  /* Fichiers de l'app : cache d'abord, c'est instantané et ça marche hors ligne. */
  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then(hit =>
        hit || fetch(req).then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(SHELL).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
      ).catch(() => caches.match("./index.html"))
    );
    return;
  }

  /* Ressources externes (Google Fonts) : on sert le cache et on rafraîchit en arrière-plan.
     Les réponses opaques sont conservées telles quelles, c'est suffisant pour des polices. */
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res) {
          const copy = res.clone();
          caches.open(RUNTIME).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
