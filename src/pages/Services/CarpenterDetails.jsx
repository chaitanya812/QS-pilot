import React from "react";
import { useNavigate } from "react-router-dom";
import bannerCarpenter from "../../assets/carpenter-banner.jpg";
const REVIEWS = [
  {
    name: "Neeraj",
    city: "Hyderabad",
    review: "Door repair done neatly. Very skilled carpenter.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    date: "3 days ago",
  },
  {
    name: "Kavya",
    city: "Gachibowli",
    review: "Wardrobe fixing was perfect. Good pricing!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    date: "1 week ago",
  },
];

const SERVICES = [
  {
    id: "c1",
    icon: "🚪",
    title: "Door Repair & Services",
    tagline: "Fix broken & jammed doors",
    items: [
      { name: "Door Repair", desc: "Fix jamming / loose / misaligned doors", price: "₹249", time: "30–45 mins", warranty: "30 Days", tag: "Bestseller" },
      { name: "Door Lock Repair", desc: "Fix door lock issues", price: "₹199", time: "20–30 mins", warranty: "30 Days" },
    ],
  },
  {
    id: "c2",
    icon: "🪑",
    title: "Furniture Work",
    tagline: "Reliable furniture fixing",
    items: [
      { name: "Chair Repair", desc: "Fix broken or unstable chair", price: "₹149", time: "20–30 mins", warranty: "30 Days" },
      { name: "Table Repair", desc: "Fix damaged tables", price: "₹249", time: "30–45 mins", warranty: "30 Days" },
    ],
  },
];

export default function CarpenterDetails() {
  const nav = useNavigate();

  return (
    <div className="p-4 pb-28 service-container">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => nav(-1)} className="p-2 bg-gray-200 rounded">
          ← Back
        </button>
        <h2 className="text-lg font-bold">Carpenter</h2>
        <div />
      </div>

      {/* HERO */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-6"
        style={{
          backgroundImage: `url(${bannerCarpenter})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 p-4 text-white flex flex-col justify-between h-full">
          <div>
            <h3 className="text-xl font-bold">Professional Carpenter Services</h3>
            <p className="text-sm opacity-90">Repair • Installation • Fixing</p>
          </div>

          <div className="flex gap-2">
            <a href="tel:7661045308" className="px-4 py-2 bg-green-600 rounded-xl">
              📞 Call
            </a>
            <a
              href="https://wa.me/7661045308"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-green-500 rounded-xl"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h3 className="font-semibold mb-2">Customer Reviews</h3>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {REVIEWS.map((r, i) => (
            <div key={i} className="min-w-[260px] bg-gray-50 border rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <img src={r.avatar} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.city}</p>
                </div>
              </div>
              <p className="text-yellow-500 text-sm mt-1">⭐ {r.rating}</p>
              <p className="text-sm mt-2">{r.review}</p>
              <p className="text-xs text-gray-500 mt-2">{r.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <div className="space-y-6">
        {SERVICES.map((sec) => (
          <div key={sec.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{sec.icon}</span>
              <div>
                <h3 className="font-semibold">{sec.title}</h3>
                <p className="text-xs text-gray-500">{sec.tagline}</p>
              </div>
            </div>

            <div className="service-grid">
              {sec.items.map((i2, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow border flex justify-between">
                  <div>
                    <p className="font-medium">{i2.name}</p>
                    <p className="text-sm text-gray-600">{i2.desc}</p>

                    <div className="flex gap-2 mt-1 text-xs">
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        ⏱ {i2.time}
                      </span>
                      <span className="bg-green-100 px-2 py-1 rounded">
                        🛡 {i2.warranty}
                      </span>
                    </div>

                    <p className="font-semibold text-qsBlue-500 mt-1">
                      {i2.price}
                    </p>
                  </div>

                  <button
                    className="px-4 py-2 rounded-xl bg-qsBlue-500 text-white"
                    onClick={() =>
                      nav("/service-detail", {
                        state: {
                          service: "Carpenter",
                          subService: i2.name,
                          price: i2.price,
                        },
                      })
                    }
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
