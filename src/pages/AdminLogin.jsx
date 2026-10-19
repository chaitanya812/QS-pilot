import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminFCMToken } from "../utils/firebaseMessaging";
import { saveAdminFCMToken } from "../utils/adminNotifications";

import "./AdminLogin.css";

const ADMIN_PHONE = "7661045308";

export default function AdminLogin() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const login = async () => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone !== ADMIN_PHONE) {
      alert("Not authorized as admin");
      return;
    }

    try {
      setLoading(true);

      localStorage.setItem("admin", "true");

      const token = await getAdminFCMToken();

      if (token) {
        const saved = await saveAdminFCMToken(token);

        if (saved) {
          console.log("Admin notifications enabled.");
        }
      } else {
        console.warn("Admin FCM token unavailable.");
      }

      nav("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      alert(
        "Login successful, but notification setup failed."
      );

      nav("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg-shape admin-login-bg-shape-one" />
      <div className="admin-login-bg-shape admin-login-bg-shape-two" />

      <main className="admin-login-wrapper">
        <section className="admin-login-card">

          <div className="admin-login-brand">
            <div className="admin-login-logo">
              <span>O</span>
            </div>

            <div className="admin-login-brand-text">
              <span>OnCall</span>
              <small>ADMIN PORTAL</small>
            </div>
          </div>

          <div className="admin-login-heading">
            <div className="admin-login-icon">
              🔐
            </div>

            <span className="admin-login-label">
              SECURE ACCESS
            </span>

            <h1>Admin Login</h1>

            <p>
              Login to manage OnCall bookings and
              service requests.
            </p>
          </div>

          <div className="admin-login-form">

            <label htmlFor="admin-phone">
              Admin Phone Number
            </label>

            <div className="admin-phone-input-wrapper">
              <span className="admin-phone-prefix">
                +91
              </span>

              <input
                id="admin-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter admin phone"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                disabled={loading}
              />
            </div>

            <button
              type="button"
              onClick={login}
              disabled={loading || phone.length === 0}
              className="admin-login-button"
            >
              <span>
                {loading
                  ? "Setting up notifications..."
                  : "Login as Admin"}
              </span>

              {!loading && (
                <span className="admin-login-arrow">
                  →
                </span>
              )}

              {loading && (
                <span className="admin-login-spinner" />
              )}
            </button>

          </div>

          <div className="admin-notification-card">
            <div className="admin-notification-icon">
              🔔
            </div>

            <div>
              <h3>Enable Notifications</h3>

              <p>
                After login, allow browser notifications
                so OnCall can notify you when a new
                booking arrives.
              </p>
            </div>
          </div>

          <div className="admin-security-note">
            <span>🛡️</span>
            <p>
              Authorized admin access only
            </p>
          </div>

        </section>

        <p className="admin-login-footer">
          © {new Date().getFullYear()} OnCall ·
          Service Management Portal
        </p>
      </main>
    </div>
  );
}