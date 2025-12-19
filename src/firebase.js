// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import * as firestore from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdwa6VCsJUqaxAjsZydVW52A9dntLMlxs",
  authDomain: "quickseva-c0c49.firebaseapp.com",
  projectId: "quickseva-c0c49",
  storageBucket: "quickseva-c0c49.appspot.com",
  messagingSenderId: "575202046802",
  appId: "1:575202046802:web:ea429919908bbf5ddac08b",
  measurementId: "G-DJRSQEGY5L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Runtime guard: some deployed/stale bundles call the global `getFirestore()`
// (built from older code). Expose a safe wrapper on `window` so those
// bundles don't throw `ReferenceError: getFirestore is not defined`.
if (typeof window !== "undefined" && !window.getFirestore && firestore.getFirestore) {
  // Keep signature compatible: getFirestore(app)
  // eslint-disable-next-line no-undef
  window.getFirestore = (appParam) => firestore.getFirestore(appParam);
}

// ✅ Firestore (primary export used by the app)
export const db = firestore.getFirestore(app);

// ✅ Auth (used in your app)
export const auth = getAuth(app);

// Export the initialized app in case other modules need it
export { app };
