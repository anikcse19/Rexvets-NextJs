/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: self?.ENV_FIREBASE_API_KEY,
  authDomain: self?.ENV_FIREBASE_AUTH_DOMAIN,
  projectId: self?.ENV_FIREBASE_PROJECT_ID,
  storageBucket: self?.ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self?.ENV_FIREBASE_MESSAGING_SENDER_ID,
  appId: self?.ENV_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    data: payload.data || {},
    icon: '/favicon-32x32.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification?.data?.page || '/';
  event.waitUntil(clients.openWindow(url));
});
