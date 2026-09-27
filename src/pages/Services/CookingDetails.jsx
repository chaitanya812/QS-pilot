import React from "react";
import { useNavigate } from "react-router-dom";

const SUBS_COOKING = [
  { id: "c1", label: "Home Cook - 2 hrs", price: "₹299" },
  { id: "c2", label: "Home Cook - 4 hrs", price: "₹499" },
  { id: "c3", label: "Babysitter - 1 hr", price: "₹199" },
];

export default function CookingDetails() {
  const nav = useNavigate();

  /* 📞 SUPPORT CONFIG */
  const supportPhone = "919000000000"; // 🔁 replace with real QS number
  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva, I need help with Cooking & Babysitting services."
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
        <h2 className="text-lg font-bold">Cooking & Babysitting</h2>
        <div />
      </div>

      {/* 🔥 HERO BANNER */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-5"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(251,146,60,0.72), rgba(239,68,68,0.52)), url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 400\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Crect width=\'800\' height=\'400\' fill=\'%23fff7ed\'/%3E%3Ccircle cx=\'180\' cy=\'90\' r=\'90\' fill=\'%23f59e0b\' fill-opacity=\'0.6\'/%3E%3Ccircle cx=\'620\' cy=\'170\' r=\'120\' fill=\'%23fb7185\' fill-opacity=\'0.5\'/%3E%3Ccircle cx=\'430\' cy=\'260\' r=\'140\' fill=\'%23fbbf24\' fill-opacity=\'0.35\'/%3E%3C/g%3E%3C/svg%3E')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-xl font-bold">Trusted Home Services</h3>
            <p className="text-sm opacity-90">
              Skilled cooks & caring babysitters near you
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
          Trusted home cooks and babysitters near you. Verified professionals with transparent pricing.
        </p>
      </div>

      {/* SERVICES */}
      <h3 className="font-semibold mb-2">Popular Options</h3>

      <div className="space-y-3">
        {SUBS_COOKING.map((s) => (
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
                    service: "Cooking & Babysitting",
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
