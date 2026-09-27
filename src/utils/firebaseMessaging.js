import {
  getMessaging,
  getToken,
  onMessage,
} from "firebase/messaging";

import { app } from "../firebase";

/*
============================================================
QUICKSEVA FIREBASE CLOUD MESSAGING
============================================================
*/

let messaging = null;

try {
  messaging = getMessaging(app);
} catch (error) {
  console.error(
    "Firebase Messaging initialization failed:",
    error
  );
}

/*
============================================================
YOUR FIREBASE WEB PUSH VAPID PUBLIC KEY
============================================================
*/

const VAPID_KEY =
  "BIyUzQ3SKyy3K29urI5_oUxO0w_BjhdwH7G1r6nColWtThaIgsTA8xzxfn8VCEVtT5qgF-uUY5oKEM1EvQgIE3s";

/*
============================================================
GET ADMIN FCM TOKEN
============================================================
*/

export async function getAdminFCMToken() {
  try {
    if (!messaging) {
      console.error(
        "Firebase Messaging is not initialized."
      );

      return null;
    }

    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      console.error(
        "Browser notifications are not supported."
      );

      return null;
    }

    /*
    ----------------------------------------------------------
    REQUEST NOTIFICATION PERMISSION
    ----------------------------------------------------------
    */

    let permission =
      Notification.permission;

    if (permission === "default") {
      permission =
        await Notification.requestPermission();
    }

    if (permission !== "granted") {
      console.warn(
        "Notification permission was not granted."
      );

      return null;
    }

    /*
    ----------------------------------------------------------
    REGISTER SERVICE WORKER
    ----------------------------------------------------------
    */

    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    console.log(
      "FCM service worker registered:",
      registration
    );

    /*
    ----------------------------------------------------------
    GET FCM TOKEN
    ----------------------------------------------------------
    */

    const token = await getToken(
      messaging,
      {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration:
          registration,
      }
    );

    if (!token) {
      console.warn(
        "FCM token was not generated."
      );

      return null;
    }

    console.log(
      "Admin FCM token:",
      token
    );

    return token;

  } catch (error) {
    console.error(
      "Error getting FCM token:",
      error
    );

    return null;
  }
}

/*
============================================================
FOREGROUND MESSAGE LISTENER
============================================================
*/

export function listenForForegroundMessages(
  callback
) {
  if (!messaging) {
    return () => {};
  }

  return onMessage(
    messaging,
    (payload) => {

      console.log(
        "Foreground notification:",
        payload
      );

      if (callback) {
        callback(payload);
      }
    }
  );
}