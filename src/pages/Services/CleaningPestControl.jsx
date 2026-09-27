import React from "react";
import { useNavigate } from "react-router-dom";

const SUBS_CLEAN = [
  { id: "cl1", label: "Home Cleaning", price: "₹399" },
  { id: "cl2", label: "Pest Control", price: "₹599" },
];

export default function CleaningPestControl() {
  const nav = useNavigate();

  /* 📞 SUPPORT CONFIG */
  const supportPhone = "919000000000"; // 🔁 replace with real QS number
  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva, I need help with Cleaning & Pest Control services."
  );

  return (
    <div className="p-4 pb-28">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => nav(-1)}
          className="p-2 rounded bg-gray-200"
        >
          ← Back
        </button>
        <h2 className="text-lg font-bold">Cleaning & Pest Control</h2>
        <div />
      </div>

      {/* 🔥 HERO BANNER */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-5"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(14,165,233,0.7), rgba(16,185,129,0.55)), url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 400\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Crect width=\'800\' height=\'400\' fill=\'%23ecfeff\'/%3E%3Ccircle cx=\'180\' cy=\'120\' r=\'90\' fill=\'%2393c5fd\' fill-opacity=\'0.7\'/%3E%3Ccircle cx=\'610\' cy=\'160\' r=\'110\' fill=\'%234ade80\' fill-opacity=\'0.55\'/%3E%3Ccircle cx=\'450\' cy=\'250\' r=\'150\' fill=\'%236ee7b7\' fill-opacity=\'0.35\'/%3E%3C/g%3E%3C/svg%3E')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-xl font-bold">Clean & Safe Home</h3>
            <p className="text-sm opacity-90">
              Deep cleaning & effective pest control
            </p>
          </div>

          {/* ✅ CALL + WHATSAPP */}
          <div className="flex gap-2">
            <a
              href={`tel:+${supportPhone}`}
              className="px-4 py-2 bg-green-600 rounded-xl font-semibold shadow"
            >
              📞 Call
            </a>

            <a
              href={`https://wa.me/${supportPhone}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-green-500 rounded-xl font-semibold shadow"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <p className="text-sm text-gray-600">
          Reliable home cleaning and pest control services with verified technicians.
        </p>
      </div>

      {/* SERVICES */}
      <h3 className="font-semibold mb-2">Services</h3>

      <div className="space-y-3">
        {SUBS_CLEAN.map((s) => (
          <div
            key={s.id}
            className="bg-white p-3 rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{s.label}</div>
              <div className="text-sm text-gray-500">{s.price}</div>
            </div>

            <button
              onClick={() =>
                nav("/booking", {
                  state: {
                    service: "Cleaning & Pest Control",
                    subService: s.label,
                    price: s.price,
                  },
                })
              }
              className="px-4 py-2 rounded-2xl bg-qsBlue-500 text-white"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
