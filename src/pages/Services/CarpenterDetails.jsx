import React from "react";
import { useNavigate } from "react-router-dom";

const CARPENTER_SERVICES = [
  {
    section: "🔧 Minor Repairs",
    items: [
      {
        id: "mr1",
        label: "Door Repair / Alignment Fix",
        desc:
          "Fix noisy, stuck or misaligned doors. Proper hinge tightening & smooth movement ensured.",
        extra: "Includes inspection + lubrication + alignment check",
        price: "₹279",
        tag: "Bestseller",
        time: "25-40 mins",
        warranty: "30 Days Service Warranty",
      },
      {
        id: "mr2",
        label: "Handle / Knob Fixing",
        desc:
          "Loose or broken handle? Get it fixed neatly with proper alignment.",
        extra: "Cabinets • Wardrobes • Drawers",
        price: "₹199",
        tag: "Popular",
        time: "15-25 mins",
        warranty: "20 Days Warranty",
      },
    ],
  },

  {
    section: "🚪 Door & Window Services",
    items: [
      {
        id: "dw1",
        label: "Door Lock Installation / Repair",
        desc: "Secure lock fitting + alignment for smooth locking experience.",
        extra: "All door types covered",
        price: "₹349",
        tag: "Bestseller",
        time: "30-45 mins",
        warranty: "30 Days Warranty",
      },
      {
        id: "dw2",
        label: "Door Closer Installation / Fix",
        desc: "Perfect door closing without banging — hydraulic adjustment.",
        extra: "Commercial + Home doors supported",
        price: "₹499",
        tag: "Popular",
        time: "35-50 mins",
        warranty: "45 Days Warranty",
      },
    ],
  },

  {
    section: "🛏 Furniture Repair",
    items: [
      {
        id: "fr1",
        label: "Bed / Cot Repair",
        desc: "Repair broken or shaky cot / bed support & joints.",
        extra: "Safe sleep guaranteed",
        price: "₹449",
        tag: "Trending",
        time: "45-60 mins",
        warranty: "60 Days Warranty",
      },
      {
        id: "fr2",
        label: "Cupboard / Wardrobe Repair",
        desc: "Fix jammed doors, hinges & structural issues.",
        extra: "Smooth closing guaranteed",
        price: "₹399",
        tag: "Popular",
        time: "30-45 mins",
        warranty: "45 Days Warranty",
      },
    ],
  },

  {
    section: "🎨 Wall Sticker & Decor",
    items: [
      {
        id: "ws1",
        label: "Designer Wall Sticker Installation",
        desc: "Beautiful bubble-free sticker installation.",
        extra: "Perfect alignment finish",
        price: "₹199",
        tag: "Bestseller",
        time: "20-30 mins",
        warranty: "No Peeling Guarantee",
      },
      {
        id: "ws3",
        label: "Mirror / Frame Mounting",
        desc: "Secure drilling and mounting with safety checks.",
        extra: "Heavy frames supported",
        price: "₹229",
        tag: "Popular",
        time: "25-35 mins",
        warranty: "30 Days Safety Warranty",
      },
    ],
  },
];

const REVIEWS = [
  {
    name: "Rohit Kumar",
    text:
      "Professional and polite carpenter. Work was neat & clean. Highly recommended!",
    rating: 5,
    city: "Hyderabad",
  },
  {
    name: "Sneha Reddy",
    text:
      "Fixed my wardrobe and installed curtain rods perfectly. Quick and quality work.",
    rating: 5,
    city: "Madhapur",
  },
  {
    name: "Mahesh",
    text: "Good service, reasonable price and timely response.",
    rating: 4.5,
    city: "Kondapur",
  },
];

export default function CarpenterDetails() {
  const nav = useNavigate();
  const supportPhone = "7661045308";

  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva, I need Carpenter / Wall Services. Please assist me."
  );

  return (
    <div className="p-4 pb-28 service-container">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => nav(-1)} className="p-2 rounded bg-gray-200">
          ← Back
        </button>
        <h2 className="text-lg font-bold">Carpenter & Wall Stickering</h2>
        <div />
      </div>

      {/* HERO BANNER */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-6"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=1200&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-xl font-bold">Professional Carpentry</h3>
            <p className="text-sm opacity-90">
              Expert Repairs • Secure Installation • Premium Finish
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${supportPhone}`}
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

      {/* ⭐ RATING SUMMARY LIKE AC PAGE */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Customer Rating</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold">4.9 ⭐</p>
            <p className="text-xs text-gray-500">Based on 850+ ratings</p>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="text-xs">{s}★</span>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${s * 18}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCROLL REVIEWS */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="min-w-[260px] bg-gray-50 border rounded-2xl shadow-sm p-3"
            >
              <div className="flex justify-between">
                <b>{r.name}</b>
                <span className="text-yellow-500">⭐ {r.rating}</span>
              </div>

              <p className="text-xs text-gray-500">{r.city}</p>

              <p className="text-sm text-gray-700 mt-2 leading-snug">{r.text}</p>

              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-2">
                ✔ Verified Booking
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES LIST (UNCHANGED DATA – NEW UI) */}
      {CARPENTER_SERVICES.map((block, i) => (
        <div key={i} className="mb-6">
          <h3 className="font-semibold mb-2">{block.section}</h3>

          <div className="service-grid">
            {block.items.map((s) => (
              <div
                key={s.id}
                className="service-card bg-white p-4 rounded-2xl shadow border flex flex-col sm:flex-row justify-between gap-3"
              >
                <div>
                  {s.tag && (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                      ⭐ {s.tag}
                    </span>
                  )}

                  <div className="font-medium mt-1">{s.label}</div>
                  <div className="text-sm text-gray-600">{s.desc}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.extra}</div>

                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      ⏳ {s.time}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      🛡 {s.warranty}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-qsBlue-500 mt-1">
                    {s.price}
                  </div>
                </div>

                <div className="service-actions mt-3 sm:mt-0">
                  <button
                    onClick={() =>
                      nav("/booking", {
                        state: {
                          service: "Carpenter & Wall Stickering",
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
      ))}
    </div>
  );
}
