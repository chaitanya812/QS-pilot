import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAdminFCMToken,
} from "../utils/firebaseMessaging";

import {
  saveAdminFCMToken,
} from "../utils/adminNotifications";

/*
============================================================
ADMIN PHONE
============================================================
*/

const ADMIN_PHONE =
  "7661045308";

/*
============================================================
ADMIN LOGIN
============================================================
*/

export default function AdminLogin() {

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const nav =
    useNavigate();

  /*
  ==========================================================
  LOGIN
  ==========================================================
  */

  const login = async () => {

    const cleanPhone =
      phone.replace(
        /\D/g,
        ""
      );

    if (
      cleanPhone !==
      ADMIN_PHONE
    ) {

      alert(
        "Not authorized as admin"
      );

      return;
    }

    try {

      setLoading(true);

      /*
      --------------------------------------------------------
      SAVE ADMIN LOGIN
      --------------------------------------------------------
      */

      localStorage.setItem(
        "admin",
        "true"
      );

      /*
      --------------------------------------------------------
      ENABLE PUSH NOTIFICATIONS
      --------------------------------------------------------
      */

      const token =
        await getAdminFCMToken();

      if (token) {

        /*
        Save FCM token to Firestore
        */

        const saved =
          await saveAdminFCMToken(
            token
          );

        if (saved) {

          console.log(
            "Admin notifications enabled."
          );

        }

      } else {

        console.warn(
          "Admin FCM token unavailable."
        );

      }

      /*
      --------------------------------------------------------
      GO TO ADMIN DASHBOARD
      --------------------------------------------------------
      */

      nav("/admin");

    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );

      alert(
        "Login successful, but notification setup failed."
      );

      nav("/admin");

    } finally {

      setLoading(false);

    }
  };

  /*
  ==========================================================
  UI
  ==========================================================
  */

  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-2">
          Admin Login
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          Login to manage QuickSeva bookings.
        </p>

        <input
          type="tel"
          placeholder="Enter Admin Phone"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          className="w-full p-3 border rounded-xl mb-3"
        />

        <button
          type="button"
          onClick={login}
          disabled={loading}
          className="w-full p-3 bg-qsBlue-500 text-white rounded-xl font-semibold disabled:opacity-60"
        >

          {loading
            ? "Setting up notifications..."
            : "Login as Admin"}

        </button>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3">

          <p className="text-sm text-blue-800">
            🔔 After login, allow browser notifications
            so QuickSeva can notify you when a new booking
            arrives.
          </p>

        </div>

      </div>

    </div>
  );
}