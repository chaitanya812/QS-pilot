import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ⭐ REVIEWS */
const REVIEWS = [
  {
    name: "Ramesh",
    city: "Hyderabad",
    rating: 5,
    review: "Quick leak fix and professional work. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
    date: "2 days ago",
  },
  {
    name: "Sana",
    city: "Madhapur",
    rating: 5,
    review: "Affordable pricing and very neat work.",
    avatar: "https://randomuser.me/api/portraits/women/36.jpg",
    date: "1 week ago",
  },
  {
    name: "Akash",
    city: "Kondapur",
    rating: 4,
    review: "Good plumber and fast response.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    date: "3 weeks ago",
  },
];

/* 🚰 PLUMBING SERVICES */
const SERVICES = [
  {
    id: "p1",
    icon: "🚿",
    title: "Leakage & Repair",
    tagline: "Fix all types of water leak issues",
    items: [
      { name: "Tap Leakage Repair", desc: "Fix tap dripping & leakage", price: "₹149", time: "20–30 mins", warranty: "30 Days", tag: "Bestseller" },
      { name: "Bathroom Leakage Fix", desc: "Fix water leakage in bathroom areas", price: "₹249", time: "30–45 mins", warranty: "30 Days" },
      { name: "Kitchen Sink Leakage Repair", desc: "Fix under-sink pipe leak", price: "₹199", time: "25–40 mins", warranty: "30 Days" },
    ],
  },

  {
    id: "p2",
    icon: "🚰",
    title: "Installation Services",
    tagline: "Professional fittings done right",
    items: [
      { name: "Wash Basin Installation", desc: "Secure & neat installation", price: "₹499", time: "40–60 mins", warranty: "30 Days", tag: "Popular" },
      { name: "Tap Installation", desc: "Install new tap safely", price: "₹149", time: "20–30 mins", warranty: "30 Days" },
      { name: "Hand Shower Installation", desc: "Shower fitting & setup", price: "₹249", time: "25–40 mins", warranty: "30 Days" },
    ],
  },

  {
    id: "p3",
    icon: "🧰",
    title: "Blockage & Cleaning",
    tagline: "Clear blockage professionally",
    items: [
      { name: "Wash Basin Block Removal", desc: "Clear clogged basin", price: "₹199", time: "25–40 mins", warranty: "30 Days" },
      { name: "Bathroom Drain Block Removal", desc: "Fix clogged bathroom drain", price: "₹249", time: "30–45 mins", warranty: "30 Days" },
      { name: "Kitchen Drain Block Removal", desc: "Clear kitchen pipeline clog", price: "₹299", time: "30–50 mins", warranty: "30 Days", tag: "Trending" },
    ],
  },
];

export default function Plumber() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setIndex((p) => (p + 1) % SERVICES.length), 3500);
    return () => clearInterval(i);
  }, []);

  const active = SERVICES[index];

  return (
    <div className="p-4 pb-28 service-container">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-200 rounded">
          ← Back
        </button>
        <h2 className="text-lg font-bold">Plumber Services</h2>
        <div />
      </div>

      {/* HERO */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1565895405227-31a94b62d0af?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 p-4 flex flex-col justify-between h-full text-white">
          <div>
            <h3 className="text-xl font-bold">{active?.title}</h3>
            <p className="text-sm opacity-90">{active?.tagline}</p>
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
        <h3 className="font-semibold mb-2">What Customers Say</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold">4.9 ⭐</p>
            <p className="text-xs text-gray-500">Based on 800+ ratings</p>
          </div>

          <div className="flex-1">
            {[5,4,3,2,1].map(s => (
              <div key={s} className="flex items-center gap-2">
                <span className="text-xs">{s}★</span>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${s * 18}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {REVIEWS.map((r,i)=>(
            <div key={i} className="min-w-[260px] bg-gray-50 border rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <img src={r.avatar} className="w-10 h-10 rounded-full"/>
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
        {SERVICES.map((sec)=>(
          <div key={sec.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{sec.icon}</span>
              <div>
                <h3 className="font-semibold">{sec.title}</h3>
                <p className="text-xs text-gray-500">{sec.tagline}</p>
              </div>
            </div>

            <div className="service-grid">
              {sec.items.map((it,i)=>(
                <div key={i} className="bg-white p-4 rounded-2xl shadow border flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{it.name}</p>
                      {it.tag && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          ⭐ {it.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">{it.desc}</p>

                    <div className="flex gap-2 mt-1 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        ⏱ {it.time}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        🛡 {it.warranty}
                      </span>
                    </div>

                    <p className="font-semibold text-qsBlue-500 mt-1">
                      {it.price}
                    </p>
                  </div>

                  <button
                    className="px-4 py-2 h-fit mt-auto rounded-xl bg-qsBlue-500 text-white"
                    onClick={() =>
                      navigate("/booking", {
                        state: {
                          service: "Plumber",
                          subService: it.name,
                          price: it.price,
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
