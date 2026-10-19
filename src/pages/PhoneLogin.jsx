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

      localStorage.setItem("temp_phone", phoneNumber);
      sessionStorage.setItem("temp_phone", phoneNumber);

      sessionStorage.setItem("quickseva_test_otp", DEFAULT_OTP);

      console.log("OnCall TEST OTP:", DEFAULT_OTP);

      nav("/otp");
    } catch (err) {
      console.error("OnCall login error:", err);
      setError("Unable to continue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ backgroundColor: "#F1F5F9" }}
    >
      {/* HEADER */}
      <div
        className="w-full p-4 rounded-b-3xl shadow-lg flex items-center gap-3 text-white"
        style={{
          background:
            "linear-gradient(135deg, #0B1D36 0%, #0D9488 100%)",
        }}
      >
        <button
          type="button"
          onClick={() => nav(-1)}
          className="p-2 rounded-full bg-white shadow"
          style={{ color: "#0B1D36" }}
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
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-sm"
          style={{
            backgroundColor: "#E6FFFB",
            border: "1px solid #99F6E4",
          }}
        >
          📱
        </div>

        {/* TITLE */}
        <h1
          className="text-2xl font-bold mt-5"
          style={{ color: "#0B1D36" }}
        >
          Welcome to OnCall
        </h1>

        <p className="text-gray-500 mt-2">
          Fast, trusted and professional services
          <br />
          at your doorstep.
        </p>

        {/* PHONE INPUT */}
        <div className="flex mt-8">

          {/* COUNTRY CODE */}
          <div
            className="px-4 flex items-center border border-r-0 rounded-l-xl font-semibold"
            style={{
              backgroundColor: "#F8FAFC",
              borderColor: "#CBD5E1",
              color: "#0B1D36",
            }}
          >
            +91
          </div>

          {/* PHONE */}
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
            className="flex-1 min-w-0 p-4 border rounded-r-xl text-lg outline-none bg-white"
            style={{
              borderColor: "#CBD5E1",
              color: "#0F172A",
            }}
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

        {/* CONTINUE BUTTON */}
        <button
          id="send-otp-button"
          type="button"
          onClick={handleContinue}
          disabled={loading || phone.length !== 10}
          className="w-full mt-6 p-4 rounded-full text-white text-lg shadow-lg font-semibold transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(90deg, #0D9488 0%, #0EA5E9 100%)",
          }}
        >
          {loading
            ? "Please wait..."
            : "Continue with Phone Number"}
        </button>

        {/* GUEST OPTION */}
        <button
          type="button"
          onClick={() => nav("/")}
          className="w-full mt-4 p-3 rounded-full transition"
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #CBD5E1",
            color: "#0B1D36",
          }}
        >
          Continue without login
        </button>

        {/* TERMS */}
        <p className="text-xs text-gray-500 mt-5 leading-relaxed">
          By continuing, you agree to our
          <br />

          <span
            className="font-medium"
            style={{ color: "#0D9488" }}
          >
            Terms of Service
          </span>

          {" & "}

          <span
            className="font-medium"
            style={{ color: "#0D9488" }}
          >
            Privacy Policy
          </span>
        </p>

        {/* TESTING FOOTER */}
        <p className="text-[11px] text-gray-400 mt-4">
          Testing mode: use OTP 123456.
        </p>

      </div>
    </div>
  );
}
