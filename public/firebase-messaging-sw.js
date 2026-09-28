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
firebase.initializeApp({
  apiKey: "AIzaSyA9Z0oQccEPabyT6no3B-lqiSFlJ1RXBRc",

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

/*
============================================================
FIREBASE MESSAGING
============================================================
*/

const messaging = firebase.messaging();

/*
============================================================
BACKGROUND MESSAGE
============================================================
*/

messaging.onBackgroundMessage(
  function (payload) {

    console.log(
      "[QuickSeva] Background message received:",
      payload
    );

    const notification =
      payload.notification || {};

    const data =
      payload.data || {};

    /*
    ----------------------------------------------------------
    BOOKING INFORMATION
    ----------------------------------------------------------
    */

    const service =
      data.service ||
      "Service";

    const subService =
      data.subService ||
      "";

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
    ----------------------------------------------------------
    TITLE
    ----------------------------------------------------------
    */

    const title =
      notification.title ||
      data.title ||
      "🔔 New QuickSeva Booking";

    /*
    ----------------------------------------------------------
    BODY
    ----------------------------------------------------------
    */

    let body =
      notification.body;

    if (!body) {

      body =
        `${service}`;

      if (subService) {
        body +=
          ` - ${subService}`;
      }

      body +=
        `\n📅 ${date}`;

      body +=
        `\n⏰ ${time}`;

      body +=
        `\n📍 ${address}`;

      body +=
        `\n📞 ${phone}`;
    }

    /*
    ----------------------------------------------------------
    NOTIFICATION OPTIONS
    ----------------------------------------------------------
    */

    const notificationOptions = {

      body: body,

      icon:
        "/favicon.ico",

      badge:
        "/favicon.ico",

      tag:
        data.bookingId ||
        "quickseva-booking",

      requireInteraction:
        true,

      vibrate: [
        200,
        100,
        200,
        100,
        300,
      ],

      data: {

        bookingId:
          data.bookingId ||
          "",

        service:
          service,

        subService:
          subService,

        address:
          address,

        date:
          date,

        time:
          time,

        phone:
          phone,

        url:
          data.url ||
          "https://www.quicksevaindia.com/admin",
      },
    };

    /*
    ----------------------------------------------------------
    SHOW NOTIFICATION
    ----------------------------------------------------------
    */

    return self.registration.showNotification(
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
      "[QuickSeva] Notification clicked."
    );

    event.notification.close();

    /*
    ----------------------------------------------------------
    GET URL
    ----------------------------------------------------------
    */

    const notificationData =
      event.notification.data || {};

    const targetUrl =
      notificationData.url ||
      "https://www.quicksevaindia.com/admin";

    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      })

      .then(
        function (clientList) {

          /*
          ----------------------------------------------------
          IF ADMIN PAGE IS ALREADY OPEN
          ----------------------------------------------------
          */

          for (
            const client of clientList
          ) {

            if (
              client.url.includes(
                "quicksevaindia.com"
              ) &&
              "focus" in client
            ) {

              return client.focus()
                .then(() => {

                  if (
                    "navigate" in client &&
                    client.url !== targetUrl
                  ) {

                    return client.navigate(
                      targetUrl
                    );
                  }

                  return client;
                });
            }
          }

          /*
          ----------------------------------------------------
          OPEN ADMIN DASHBOARD
          ----------------------------------------------------
          */

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
SERVICE WORKER ACTIVATION
============================================================
*/

self.addEventListener(
  "activate",
  function (event) {

    console.log(
      "[QuickSeva] Firebase messaging service worker activated."
    );

    event.waitUntil(
      self.clients.claim()
    );
  }
);

/*
============================================================
SERVICE WORKER INSTALL
============================================================
*/

self.addEventListener(
  "install",
  function (event) {

    console.log(
      "[QuickSeva] Firebase messaging service worker installed."
    );

    self.skipWaiting();
  }
);