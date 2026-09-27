import React from "react";
import { useNavigate } from "react-router-dom";

const SUBS_DEC = [
  { id: "d1", label: "Small Event Setup", price: "₹999" },
  { id: "d2", label: "Decoration - Home", price: "₹499" },
];

export default function DecorationDetails() {
  const nav = useNavigate();

  /* 📞 SUPPORT CONFIG */
  const supportPhone = "919000000000"; // 🔁 replace with real QS number
  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva, I need help with Decoration & Events services."
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
        <h2 className="text-lg font-bold">Decoration & Events</h2>
        <div />
      </div>

      {/* 🔥 HERO BANNER */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-5"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(168,85,247,0.68), rgba(236,72,153,0.5)), url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 400\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Crect width=\'800\' height=\'400\' fill=\'%23faf5ff\'/%3E%3Ccircle cx=\'170\' cy=\'110\' r=\'80\' fill=\'%23c084fc\' fill-opacity=\'0.7\'/%3E%3Ccircle cx=\'620\' cy=\'160\' r=\'120\' fill=\'%23f472b6\' fill-opacity=\'0.58\'/%3E%3Ccircle cx=\'440\' cy=\'250\' r=\'150\' fill=\'%23a78bfa\' fill-opacity=\'0.32\'/%3E%3C/g%3E%3C/svg%3E')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-xl font-bold">Make Your Event Special</h3>
            <p className="text-sm opacity-90">
              Beautiful decorations for home & small events
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
          Decoration and event setup services for small and home events.
        </p>
      </div>

      {/* PACKAGES */}
      <h3 className="font-semibold mb-2">Packages</h3>

      <div className="space-y-3">
        {SUBS_DEC.map((s) => (
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
                    service: "Decoration & Events",
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
