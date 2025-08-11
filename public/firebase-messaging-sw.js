importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
); // Use latest version
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);
import { firebaseConfig } from "../src/config/firebase.config";

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle =
    payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body || "Background Message Body",
    icon: payload.notification?.icon || "/icon-192x192.png",
    data: { url: payload.data?.url || "/" },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked");
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
