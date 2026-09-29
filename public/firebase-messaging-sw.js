/*
============================================================
QUICKSEVA FIREBASE CLOUD MESSAGING SERVICE WORKER
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
FIREBASE CONFIG
============================================================
*/

firebase.initializeApp({
  apiKey:
    "AIzaSyA9Z0oQccEPabyT6no3B-lqiSFlJ1RXBRc",

  authDomain:
    "quickseva-c0c49.firebaseapp.com",

  projectId:
    "quickseva-c0c49",

  storageBucket:
    "quickseva-c0c49.firebasestorage.app",

  messagingSenderId:
    "575202046802",

  appId:
    "1:575202046802:web:ea429919908bbf5ddac08b",
});

const messaging =
  firebase.messaging();

console.log(
  "[QuickSeva FCM] Service worker loaded."
);

/*
============================================================
BACKGROUND MESSAGE
============================================================
*/

messaging.onBackgroundMessage(
  function (payload) {

    console.log(
      "[QuickSeva FCM] Background message:",
      payload
    );

    const notification =
      payload.notification || {};

    const data =
      payload.data || {};

    /*
    ========================================================
    BOOKING INFORMATION
    ========================================================
    */

    const bookingId =
      data.bookingId || "Not provided";

    const service =
      data.service ||
      "Service";

    const subService =
      data.subService ||
      "";

    const customerName =
      data.customerName ||
      "Customer";

    const address =
      data.address ||
      "Address not provided";

    const date =
      data.date ||
      "Date not provided";

    const time =
      data.time ||
      "Time not provided";

    const phone =
      data.phone ||
      "Phone not provided";

    /*
    ========================================================
    TITLE
    ========================================================
    */

    const title =
      notification.title ||
      "🔔 New QuickSeva Booking";

    /*
    ========================================================
    BODY
    ========================================================
    */

    let body = "";

    body +=
      `🛠️ ${service}`;

    if (subService) {
      body +=
        ` - ${subService}`;
    }

    body +=
      `\n🆔 Booking ID: ${bookingId}`;

    body +=
      `\n👤 Customer: ${customerName}`;

    body +=
      `\n📅 Date: ${date}`;

    body +=
      `\n⏰ Time: ${time}`;

    body +=
      `\n📍 Address: ${address}`;

    body +=
      `\n📞 Phone: ${phone}`;

    /*
    ========================================================
    ADMIN URL
    ========================================================
    */

    const targetUrl =
      data.url ||
      "https://www.quicksevaindia.com/admin";

    /*
    ========================================================
    NOTIFICATION OPTIONS
    ========================================================
    */

    const notificationOptions = {

      body,

      icon:
        "https://www.quicksevaindia.com/favicon.ico",

      badge:
        "https://www.quicksevaindia.com/favicon.ico",

      tag:
        `quickseva-booking-${bookingId}`,

      requireInteraction:
        true,

      renotify:
        true,

      data: {
        bookingId,

        service,

        subService,

        customerName,

        address,

        date,

        time,

        phone,

        url:
          targetUrl,
      },
    };

    /*
    ========================================================
    SHOW NOTIFICATION
    ========================================================
    */

    return self.registration
      .showNotification(
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

    console.log(
      "[QuickSeva FCM] Notification clicked."
    );

    event.notification.close();

    const data =
      event.notification.data || {};

    const targetUrl =
      data.url ||
      "https://www.quicksevaindia.com/admin";

    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      })

      .then(
        function (clientList) {

          for (
            const client of clientList
          ) {

            if (
              client.url.includes(
                "quicksevaindia.com"
              ) &&
              "focus" in client
            ) {

              return client
                .focus()
                .then(
                  function () {

                    if (
                      "navigate" in client &&
                      client.url !== targetUrl
                    ) {

                      return client.navigate(
                        targetUrl
                      );
                    }

                    return client;
                  }
                );
            }
          }

          if (
            clients.openWindow
          ) {

            return clients.openWindow(
              targetUrl
            );
          }

          return null;
        }
      )
    );
  }
);

/*
============================================================
INSTALL
============================================================
*/

self.addEventListener(
  "install",
  function () {

    console.log(
      "[QuickSeva FCM] Service worker installed."
    );

    self.skipWaiting();
  }
);

/*
============================================================
ACTIVATE
============================================================
*/

self.addEventListener(
  "activate",
  function (event) {

    console.log(
      "[QuickSeva FCM] Service worker activated."
    );

    event.waitUntil(
      self.clients.claim()
    );
  }
);