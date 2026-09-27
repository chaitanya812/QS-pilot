/*
============================================================
QUICKSEVA FIREBASE MESSAGING SERVICE WORKER
============================================================
*/

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

/*
============================================================
FIREBASE CONFIGURATION
============================================================

IMPORTANT:

Replace the values below with the EXACT values from:

src/firebase.js
*/

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",

  authDomain:
    "YOUR_PROJECT.firebaseapp.com",

  projectId:
    "YOUR_PROJECT_ID",

  storageBucket:
    "YOUR_STORAGE_BUCKET",

  messagingSenderId:
    "YOUR_MESSAGING_SENDER_ID",

  appId:
    "YOUR_APP_ID",
});

/*
============================================================
FIREBASE MESSAGING
============================================================
*/

const messaging =
  firebase.messaging();

/*
============================================================
BACKGROUND MESSAGE
============================================================
*/

messaging.onBackgroundMessage(
  function (payload) {

    console.log(
      "[QuickSeva] Background message:",
      payload
    );

    const notification =
      payload.notification || {};

    const data =
      payload.data || {};

    const title =
      notification.title ||
      data.title ||
      "🔔 New QuickSeva Booking";

    const body =
      notification.body ||
      data.body ||
      "A new booking has arrived.";

    const notificationOptions = {

      body: body,

      icon:
        "/favicon.ico",

      badge:
        "/favicon.ico",

      tag:
        data.bookingId ||
        "quickseva-booking",

      requireInteraction: true,

      data: {
        bookingId:
          data.bookingId || "",

        url:
          data.url ||
          "/admin",

        service:
          data.service || "",

        address:
          data.address || "",

        date:
          data.date || "",

        time:
          data.time || "",

        phone:
          data.phone || "",
      },

    };

    self.registration.showNotification(
      title,
      notificationOptions
    );
  }
);

/*
============================================================
NOTIFICATION CLICK
============================================================
*/

self.addEventListener(
  "notificationclick",
  function (event) {

    event.notification.close();

    const url =
      event.notification?.data?.url ||
      "/admin";

    event.waitUntil(

      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then(
          function (clientList) {

            /*
            If admin page is already open,
            focus it.
            */

            for (
              const client of clientList
            ) {

              if (
                client.url.includes(
                  "/admin"
                ) &&
                "focus" in client
              ) {

                return client.focus();
              }
            }

            /*
            Otherwise open admin page.
            */

            if (
              clients.openWindow
            ) {

              return clients.openWindow(
                url
              );
            }

            return null;
          }
        )
    );
  }
);