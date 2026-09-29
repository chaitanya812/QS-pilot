import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/*
============================================================
QUICKSEVA FIREBASE CONFIGURATION
============================================================
*/

const firebaseConfig = {
  apiKey: "AIzaSyA9Z0oQccEPabyT6no3B-lqiSFlJ1RXBRc",
  authDomain: "quickseva-c0c49.firebaseapp.com",
  projectId: "quickseva-c0c49",
  storageBucket: "quickseva-c0c49.firebasestorage.app",
  messagingSenderId: "575202046802",
  appId: "1:575202046802:web:ea429919908bbf5ddac08b",
};

/*
============================================================
INITIALIZE FIREBASE
============================================================
*/

export const app = initializeApp(firebaseConfig);

/*
============================================================
INITIALIZE FIRESTORE
============================================================
*/

export const db = getFirestore(app);