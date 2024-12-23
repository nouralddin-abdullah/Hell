importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAh61dWtgbPdnq65nvVOp4eCc3y6FU0FHs",
  authDomain: "bishell.firebaseapp.com",
  projectId: "bishell",
  storageBucket: "bishell.firebasestorage.app",
  messagingSenderId: "307741969922",
  appId: "1:307741969922:web:c54b2131957d9acf37611b",
  measurementId: "G-EEF22G6JTR",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  try {
    if (!payload.data) {
      console.error("Missing data in payload:", payload);
      return;
    }

    const data = payload.data;
    const notificationTitle = data.title || "Default Title";
    const notificationOptions = {
      body: data.body || "Default Body",
      icon: data.icon || "/default-icon.png",
      data: {
        click_action: data.click_action,
        action_url: data.action_url,
        type: data.type,
      },
    };

    console.log("Notification options:", notificationOptions);
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  } catch (error) {
    console.error(
      "[firebase-messaging-sw.js] Error handling background message:",
      error
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log(
    "[firebase-messaging-sw.js] Notification click event data:",
    event.notification.data
  );

  try {
    const navigationUrl =
      event.notification.data.click_action ||
      event.notification.data.action_url ||
      "/";

    event.notification.close();

    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // Try to focus existing window
          for (const client of clientList) {
            const clientUrl = new URL(client.url);
            const targetUrl = new URL(navigationUrl, self.location.origin);

            if (
              clientUrl.pathname === targetUrl.pathname &&
              "focus" in client
            ) {
              return client.focus();
            }
          }

          // Open new window
          const fullUrl = navigationUrl.startsWith("http")
            ? navigationUrl
            : `${self.location.origin}${navigationUrl}`;

          console.log("Opening URL:", fullUrl);
          return clients.openWindow(fullUrl);
        })
    );
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Error handling click:", error);
    return clients.openWindow("/");
  }
});
