import {
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";

/*
============================================================
SAVE ADMIN FCM TOKEN
============================================================
*/

export async function saveAdminFCMToken(
  token
) {
  if (!token) {
    return false;
  }

  try {

    /*
    Create a deterministic document ID
    from the token.
    */

    const safeId = btoa(token)
      .replace(
        /[^a-zA-Z0-9]/g,
        ""
      )
      .slice(0, 100);

    await setDoc(
      doc(
        db,
        "adminDevices",
        safeId
      ),
      {
        token: token,

        role: "admin",

        updatedAt:
          new Date().toISOString(),

        userAgent:
          navigator.userAgent,
      },
      {
        merge: true,
      }
    );

    console.log(
      "Admin FCM token saved successfully."
    );

    return true;

  } catch (error) {

    console.error(
      "Failed to save admin FCM token:",
      error
    );

    return false;
  }
}