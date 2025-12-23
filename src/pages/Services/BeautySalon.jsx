import React from "react";
import { useNavigate } from "react-router-dom";

const SUBS_BEAUTY = [
  { id: "be1", label: "Home Salon - Haircut", price: "₹299" },
  { id: "be2", label: "Makeup at Home", price: "₹999" },
];

export default function BeautySalon() {
  const nav = useNavigate();

  /* 📞 SUPPORT CONFIG (SERVICE-AWARE) */
  const supportPhone = "7661045308"; // QuickSeva support number
  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva, I need help with Beauty & Salon service."
  );

  return (
    <div className="p-4 pb-28 service-container">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => nav(-1)} className="p-2 rounded bg-gray-200">
          ← Back
        </button>
        <h2 className="text-lg font-bold">Beauty & Salon</h2>
        <div />
      </div>

      {/* 🔥 HERO BANNER */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-5"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-xl font-bold">Beauty & Salon</h3>
            <p className="text-sm opacity-90">
              Professional services at your home
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

      {/* INFO CARD (UNCHANGED) */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <p className="text-sm text-gray-600">
          Professional beauty and salon services at the comfort of your home.
        </p>
      </div>

      {/* SERVICES LIST (UNCHANGED) */}
      <h3 className="font-semibold mb-2">Popular Services</h3>

      <div className="service-grid">
        {SUBS_BEAUTY.map((s) => (
          <div
            key={s.id}
            className="service-card bg-white p-3 rounded-2xl shadow flex flex-col sm:flex-row justify-between gap-3"
          >
            <div>
              <div className="font-medium">{s.label}</div>
              <div className="text-sm text-gray-500">{s.price}</div>
            </div>

            <div className="service-actions mt-3 sm:mt-0">
              <button
                onClick={() =>
                  nav("/booking", {
                    state: {
                      service: "Beauty & Salon",
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
          </div>
        ))}
      </div>
    </div>
  );
}
