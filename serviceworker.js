const quizGo = "dev-coffee-site-v1"
const assets = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/leaderboard.html",
  "/login-page.html",
  "/signup-page.html",
  "/faq.html",
  "/app.css",
  "/app.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(quizGo).then(cache => {
      cache.addAll(assets)
    })
  )
})