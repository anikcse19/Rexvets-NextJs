self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated");
  self.clients.claim();
});

// Listen for push events
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log("[Service Worker] Push Received:", data);

    const title = data.title || "Notification";
    const options = {
      body: data.body || "",
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      data: data.url || "/",
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});
