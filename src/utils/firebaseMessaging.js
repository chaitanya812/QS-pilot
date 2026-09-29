/*
============================================================
QUICKSEVA FIREBASE CLOUD MESSAGING
ADMIN DEVICE REGISTRATION
============================================================
*/

import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  app,
  db,
} from "../firebase";

/*
============================================================
VAPID PUBLIC KEY
============================================================
*/

const VAPID_KEY =
  "BIyUzQ3SKyy3K29urI5_oUxO0w_BjhdwH7G1r6nColWtThaIgsTA8xzxfn8VCEVtT5qgF-uUY5oKEM1EvQgIE3s";

/*
============================================================
MESSAGING
============================================================
*/

let messaging = null;

/*
============================================================
INITIALIZE MESSAGING
============================================================
*/

async function initializeMessaging() {

  try {

    const supported =
      await isSupported();

    if (!supported) {

      console.warn(
        "[FCM] Messaging is not supported."
      );

      return null;
    }

    if (!messaging) {

      messaging =
        getMessaging(app);

      console.log(
        "[FCM] Messaging initialized."
      );
    }

    return messaging;

  } catch (error) {

    console.error(
      "[FCM] Messaging initialization failed:",
      error
    );

    return null;
  }
}

/*
============================================================
REGISTER SERVICE WORKER
============================================================
*/

async function registerFCMServiceWorker() {

  try {

    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {

      console.error(
        "[FCM] Service Worker unavailable."
      );

      return null;
    }

    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    console.log(
      "[FCM] Service Worker registered:",
      registration
    );

    await navigator.serviceWorker.ready;

    console.log(
      "[FCM] Service Worker ready."
    );

    return registration;

  } catch (error) {

    console.error(
      "[FCM] Service Worker registration failed:",
      error
    );

    return null;
  }
}

/*
============================================================
REQUEST PERMISSION
============================================================
*/

async function requestNotificationPermission() {

  try {

    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {

      console.error(
        "[FCM] Browser notifications unavailable."
      );

      return false;
    }

    let permission =
      Notification.permission;

    console.log(
      "[FCM] Current permission:",
      permission
    );

    if (
      permission === "default"
    ) {

      permission =
        await Notification.requestPermission();

      console.log(
        "[FCM] Permission result:",
        permission
      );
    }

    if (
      permission !== "granted"
    ) {

      console.warn(
        "[FCM] Notification permission denied."
      );

      return false;
    }

    console.log(
      "[FCM] Notification permission granted."
    );

    return true;

  } catch (error) {

    console.error(
      "[FCM] Permission error:",
      error
    );

    return false;
  }
}

/*
============================================================
SAVE TOKEN
============================================================
*/

async function saveAdminToken(token) {

  try {

    if (!token) {
      return false;
    }

    const tokenRef =
      doc(
        db,
        "adminDevices",
        token
      );

    await setDoc(
      tokenRef,
      {

        token,

        role:
          "admin",

        platform:
          "web",

        browser:
          navigator.userAgent,

        enabled:
          true,

        updatedAt:
          serverTimestamp(),

        createdAt:
          serverTimestamp(),

      },
      {
        merge: true,
      }
    );

    console.log(
      "[FCM] Admin token saved."
    );

    console.log(
      "[FCM] Firestore path:",
      `adminDevices/${token}`
    );

    return true;

  } catch (error) {

    console.error(
      "[FCM] Failed to save token:",
      error
    );

    return false;
  }
}

/*
============================================================
GET ADMIN TOKEN
============================================================
*/

export async function getAdminFCMToken() {

  try {

    console.log(
      "[FCM] Starting admin token registration..."
    );

    const messagingInstance =
      await initializeMessaging();

    if (!messagingInstance) {
      return null;
    }

    const permissionGranted =
      await requestNotificationPermission();

    if (!permissionGranted) {
      return null;
    }

    const registration =
      await registerFCMServiceWorker();

    if (!registration) {
      return null;
    }

    console.log(
      "[FCM] Requesting FCM token..."
    );

    const token =
      await getToken(
        messagingInstance,
        {
          vapidKey:
            VAPID_KEY,

          serviceWorkerRegistration:
            registration,
        }
      );

    if (!token) {

      console.warn(
        "[FCM] No FCM token generated."
      );

      return null;
    }

    console.log(
      "[FCM] FCM token generated successfully:"
    );

    console.log(token);

    const saved =
      await saveAdminToken(token);

    if (!saved) {

      console.error(
        "[FCM] Token generated but not saved."
      );

      return token;
    }

    console.log(
      "[FCM] ADMIN DEVICE REGISTRATION COMPLETE."
    );

    return token;

  } catch (error) {

    console.error(
      "[FCM] Error getting FCM token:",
      error
    );

    return null;
  }
}

/*
============================================================
FOREGROUND MESSAGES
============================================================
*/

export async function listenForForegroundMessages(
  callback
) {

  try {

    const messagingInstance =
      await initializeMessaging();

    if (!messagingInstance) {
      return () => {};
    }

    console.log(
      "[FCM] Foreground listener started."
    );

    return onMessage(
      messagingInstance,
      (payload) => {

        console.log(
          "[FCM] Foreground message:",
          payload
        );

        if (callback) {
          callback(payload);
        }
      }
    );

  } catch (error) {

    console.error(
      "[FCM] Foreground listener error:",
      error
    );

    return () => {};
  }
}

/*
============================================================
REGISTER ADMIN DEVICE
============================================================
*/

export async function registerAdminDevice() {

  console.log(
    "[FCM] Registering QuickSeva admin device..."
  );

  const token =
    await getAdminFCMToken();

  if (token) {

    console.log(
      "[FCM] Admin device registered successfully."
    );

  } else {

    console.warn(
      "[FCM] Admin device registration failed."
    );
  }

  return token;
}