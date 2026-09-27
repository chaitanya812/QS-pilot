import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_OTP = "123456";

export default function PhoneLogin() {
  const nav = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");

    const digits = phone.replace(/\D/g, "").slice(0, 10);

    if (digits.length !== 10) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);

    try {
      const phoneNumber = `+91${digits}`;

      // Save phone for OtpVerify.jsx
      localStorage.setItem("temp_phone", phoneNumber);
      sessionStorage.setItem("temp_phone", phoneNumber);

      // Save testing OTP information
      sessionStorage.setItem("quickseva_test_otp", DEFAULT_OTP);

      /*
       * TEMPORARY TESTING MODE
       *
       * Firebase SMS is intentionally skipped.
       *
       * Test OTP:
       * 123456
       */

      console.log("QuickSeva TEST OTP:", DEFAULT_OTP);

      // Go to OTP verification
      nav("/otp");
    } catch (err) {
      console.error("QuickSeva login error:", err);
      setError("Unable to continue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">

      {/* HEADER */}
      <div className="w-full bg-qsBlue-500 text-white p-4 rounded-b-3xl shadow flex items-center gap-3">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="p-2 rounded-full bg-white text-qsBlue-600 shadow"
        >
          ←
        </button>

        <h2 className="text-lg font-semibold">
          Login
        </h2>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-md mt-14 text-center">

        {/* ICON */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
          📱
        </div>

        <h1 className="text-2xl font-bold mt-5">
          Welcome to QuickSeva
        </h1>

        <p className="text-gray-500 mt-2">
          Fast, trusted and professional services
          at your doorstep.
        </p>

        {/* PHONE INPUT */}
        <div className="flex mt-8">

          <div className="px-4 flex items-center border border-r-0 rounded-l-xl bg-gray-50 text-gray-700 font-semibold">
            +91
          </div>

          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);

              setPhone(value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                phone.length === 10 &&
                !loading
              ) {
                handleContinue();
              }
            }}
            className="flex-1 min-w-0 p-4 border rounded-r-xl text-lg outline-none focus:border-qsBlue-500"
          />

        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-left">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* TEST OTP NOTICE */}
        <div className="mt-5 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-left">
          <p className="text-sm font-semibold text-yellow-800">
            🧪 Testing Mode
          </p>

          <p className="text-sm text-yellow-700 mt-1">
            Firebase SMS is temporarily disabled.
          </p>

          <p className="text-center text-xl font-bold text-yellow-900 mt-2">
            Test OTP: 123456
          </p>
        </div>

        {/* CONTINUE BUTTON */}
        <button
          id="send-otp-button"
          type="button"
          onClick={handleContinue}
          disabled={
            loading ||
            phone.length !== 10
          }
          className="w-full mt-6 p-4 rounded-full bg-gradient-to-r from-qsBlue-400 to-qsBlue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg shadow-lg font-semibold transition"
        >
          {loading
            ? "Please wait..."
            : "Continue with Phone Number"}
        </button>

        {/* GUEST OPTION */}
        <button
          type="button"
          onClick={() => nav("/")}
          className="w-full mt-4 p-3 border rounded-full text-gray-700 hover:bg-gray-50 transition"
        >
          Continue without login
        </button>

        {/* TERMS */}
        <p className="text-xs text-gray-500 mt-5 leading-relaxed">
          By continuing, you agree to our
          <br />

          <span className="text-qsBlue-500">
            Terms of Service
          </span>

          {" & "}

          <span className="text-qsBlue-500">
            Privacy Policy
          </span>
        </p>

        <p className="text-[11px] text-gray-400 mt-4">
          Testing mode: use OTP 123456.
        </p>

      </div>
    </div>
  );
}