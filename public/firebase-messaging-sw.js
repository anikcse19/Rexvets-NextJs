// Web Push Notification Service Worker
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('Push data:', data);
      
      const options = {
        body: data.body || 'New notification',
        icon: data.icon || '/favicon-32x32.png',
        badge: data.badge || '/favicon-32x32.png',
        tag: data.tag || 'notification',
        data: data.data || {},
        actions: data.actions || [],
        requireInteraction: true,
        silent: false
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
      );
    } catch (error) {
      console.error('Error parsing push data:', error);
      
      // Fallback notification
      const options = {
        body: 'New notification received',
        icon: '/favicon-32x32.png',
        badge: '/favicon-32x32.png',
        tag: 'notification'
      };

      event.waitUntil(
        self.registration.showNotification('Notification', options)
      );
    }
  } else {
    // No data, show default notification
    const options = {
      body: 'New notification received',
      icon: '/favicon-32x32.png',
      badge: '/favicon-32x32.png',
      tag: 'notification'
    };

    event.waitUntil(
      self.registration.showNotification('Notification', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open') {
    // Handle open action
    const url = event.notification.data?.page || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  } else if (event.action === 'close') {
    // Handle close action - notification is already closed
    console.log('Notification closed by user');
  } else {
    // Default click behavior
    const url = event.notification.data?.page || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
});

// Handle service worker installation
self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle push subscription
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Push subscription changed:', event);
  // You can handle subscription renewal here if needed
});
