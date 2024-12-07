importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAh61dWtgbPdnq65nvVOp4eCc3y6FU0FHs",
  authDomain: "bishell.firebaseapp.com",
  projectId: "bishell",
  storageBucket: "bishell.firebasestorage.app",
  messagingSenderId: "307741969922",
  appId: "1:307741969922:web:c54b2131957d9acf37611b",
  measurementId: "G-EEF22G6JTR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title || 'New Message';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: '../src/assets/logo-icon.png', //  app's icon path
    badge: '../src/assets/logo-icon.png', //  badge icon
    data: payload.data, // any custom data
    click_action: payload.notification.click_action || '/' // URL to open on click
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Open or focus window when notification is clicked
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(clientList => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === event.notification.data.click_action && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.click_action);
      }
    })
  );
});