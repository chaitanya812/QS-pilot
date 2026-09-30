import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  findTechnicianByPhone,
  saveTechnicianSession,
} from "../utils/technicianService.js";

export default function TechnicianLogin() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const login = () => {
    const cleanPhone = phone.trim();

    if (!cleanPhone) {
      alert("Please enter technician phone number.");
      return;
    }

    setLoading(true);

    try {
      const tech = findTechnicianByPhone(cleanPhone);

      if (!tech) {
        alert("Technician not found.");
        setLoading(false);
        return;
      }

      saveTechnicianSession(tech);

      nav("/tech");

    } catch (error) {

      console.error(
        "Technician login error:",
        error
      );

      alert(
        "Unable to login. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6">

        {/* ==================================================
            QS BRANDING HEADER
        ================================================== */}

        <div className="text-center mb-6">

          <h2 className="text-2xl font-bold text-qsBlue-600">
            Technician Login
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Login to manage your assigned QuickSeva jobs
          </p>

        </div>

        {/* ==================================================
            PHONE INPUT
        ================================================== */}

        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="Enter Technician Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
          className="w-full p-3 border rounded-xl mb-3 bg-gray-50 focus:ring-2 focus:ring-qsBlue-500 outline-none"
        />

        {/* ==================================================
            LOGIN BUTTON
        ================================================== */}

        <button
          onClick={login}
          disabled={loading}
          className="w-full p-3 bg-qsBlue-500 hover:bg-qsBlue-600 transition text-white rounded-xl font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* ==================================================
            BACK BUTTON
        ================================================== */}

        <button
          onClick={() => nav(-1)}
          disabled={loading}
          className="w-full mt-3 p-2 text-gray-600 text-sm disabled:opacity-50"
        >
          ← Back
        </button>

      </div>

    </div>
  );
}