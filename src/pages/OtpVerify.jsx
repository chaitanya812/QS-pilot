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
        name: "QuickSeva User",
        phone: phone,
      };

      // Save login
      login(user);

      // Also save locally for easy access
      localStorage.setItem("quickseva_user", JSON.stringify(user));

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-qsBlue-500 text-white p-4 rounded-b-3xl shadow">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="w-10 h-10 rounded-full bg-white text-qsBlue-500 shadow flex items-center justify-center"
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
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
          {/* ICON */}
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-3xl">
            🔐
          </div>

          <h1 className="text-2xl font-bold text-center mt-5">
            Verify your number
          </h1>

          <p className="text-gray-500 text-center mt-2">
            Enter the OTP sent to your phone number.
          </p>

          {phone && (
            <p className="text-center font-semibold mt-2">
              +91 {phone}
            </p>
          )}

          {/* TEST OTP NOTICE */}
          <div className="mt-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800 text-center">
              🧪 Testing mode
            </p>

            <p className="text-center font-bold text-xl mt-1">
              OTP: 123456
            </p>

            <p className="text-xs text-yellow-700 text-center mt-1">
              Firebase SMS is not required for now.
            </p>
          </div>

          {/* OTP INPUT */}
          <input
            type="tel"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            className="w-full mt-6 p-4 border border-gray-300 rounded-2xl text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* VERIFY */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="w-full mt-5 p-4 rounded-2xl bg-gradient-to-r from-qsBlue-400 to-qsBlue-600 text-white font-semibold text-lg shadow-lg disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          {/* CHANGE NUMBER */}
          <button
            type="button"
            onClick={() => nav("/login")}
            className="w-full mt-4 p-3 text-qsBlue-600 font-medium"
          >
            ← Change phone number
          </button>
        </div>
      </div>
    </div>
  );
}