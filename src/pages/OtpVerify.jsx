import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEFAULT_OTP = "123456";

export default function OtpVerify() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const phone = localStorage.getItem("temp_phone") || "";

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);

    // Temporary testing OTP
    if (otp !== DEFAULT_OTP) {
      setLoading(false);
      alert("Incorrect OTP. Use 123456 for testing.");
      return;
    }

    try {
      const user = {
        uid: `quickseva_${Date.now()}`,
        name: "OnCall User",
        phone: phone,
      };

      // Save login
      login(user);

      // Save locally
      localStorage.setItem(
        "quickseva_user",
        JSON.stringify(user)
      );

      // Remove temporary phone
      localStorage.removeItem("temp_phone");

      // Go to homepage
      nav("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F1F5F9" }}
    >

      {/* HEADER */}
      <div
        className="text-white p-4 rounded-b-3xl shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, #0B1D36 0%, #0D9488 100%)",
        }}
      >
        <div className="max-w-md mx-auto flex items-center gap-3">

          <button
            type="button"
            onClick={() => nav(-1)}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
            style={{ color: "#0B1D36" }}
          >
            ←
          </button>

          <h2 className="text-lg font-semibold">
            OTP Verification
          </h2>

        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center p-6">

        <div
          className="w-full max-w-md rounded-3xl shadow-xl p-6"
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
          }}
        >

          {/* ICON */}
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl"
            style={{
              backgroundColor: "#E6FFFB",
              border: "1px solid #99F6E4",
            }}
          >
            🔐
          </div>

          {/* TITLE */}
          <h1
            className="text-2xl font-bold text-center mt-5"
            style={{ color: "#0B1D36" }}
          >
            Verify your number
          </h1>

          <p className="text-gray-500 text-center mt-2">
            Enter the OTP sent to your phone number.
          </p>

          {/* PHONE NUMBER */}
          {phone && (
            <p
              className="text-center font-semibold mt-2"
              style={{ color: "#0D9488" }}
            >
              {phone}
            </p>
          )}

{/* TEST OTP NOTICE */}
<div
  className="mt-6 p-4 rounded-2xl text-left"
  style={{
    background:
      "linear-gradient(135deg, #E6FFFB 0%, #EFF6FF 100%)",
    border: "1px solid #99F6E4",
  }}
>
  <div className="flex items-center gap-2">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{
        backgroundColor: "#0D9488",
        color: "#FFFFFF",
      }}
    >
      🧪
    </div>

    <div>
      <p
        className="text-sm font-bold"
        style={{ color: "#0B1D36" }}
      >
        Testing Mode
      </p>

      <p
        className="text-xs"
        style={{ color: "#0D9488" }}
      >
        Firebase SMS is temporarily disabled
      </p>
    </div>
  </div>

  <div
    className="mt-3 p-3 rounded-xl text-center"
    style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid #BAE6FD",
    }}
  >
    <p
      className="text-xs font-medium"
      style={{ color: "#64748B" }}
    >
      Test OTP
    </p>

    <p
      className="text-2xl font-bold tracking-[0.25em] mt-1"
      style={{ color: "#0B1D36" }}
    >
      123456
    </p>
  </div>
</div>

          {/* OTP INPUT */}
          <input
            type="tel"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            className="w-full mt-6 p-4 rounded-2xl text-center text-2xl tracking-[0.5em] font-bold focus:outline-none"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #CBD5E1",
              color: "#0F172A",
            }}
          />

          {/* VERIFY BUTTON */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full mt-5 p-4 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(90deg, #0D9488 0%, #0EA5E9 100%)",
            }}
          >
            {loading
              ? "Verifying..."
              : "Verify & Continue"}
          </button>

          {/* CHANGE NUMBER */}
          <button
            type="button"
            onClick={() => nav("/login")}
            className="w-full mt-4 p-3 font-medium transition"
            style={{ color: "#0D9488" }}
          >
            ← Change phone number
          </button>

        </div>
      </div>
    </div>
  );
}
