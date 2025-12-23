import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= CATEGORY WISE SERVICES WITH TAGS ================= */
const SERVICES = [
  /* ======= TAPS & BATH ======= */
  {
    id: "pl1",
    icon: "🚰",
    title: "Tap & Bathroom Fixes",
    tagline: "Quick fixes for bathroom and tap issues",
    banner:
      "https://images.unsplash.com/photo-1581092919535-7146c1c9c6c9?auto=format&fit=crop&w=1200&q=80",
    items: [
      { name: "Tap repair", desc: "Fix leaking or damaged tap", price: "₹99", time: "20–30 mins", warranty: "30 Days", tag: "Bestseller" },
      { name: "Tap installation", desc: "Install new water tap", price: "₹99", time: "20–30 mins", warranty: "30 Days", tag: "Popular" },
      { name: "Tap accessory", desc: "Replace tap accessories", price: "₹79", time: "20 mins", warranty: "30 Days" },
      { name: "Jet spray replacement", desc: "Replace broken jet spray", price: "₹99", time: "15–25 mins", warranty: "30 Days" },
      { name: "Shower installation", desc: "Install bathroom shower", price: "₹99", time: "20–30 mins", warranty: "30 Days" },
      { name: "Shower filter installation", desc: "Install shower filter", price: "₹99", time: "20 mins", warranty: "30 Days" },
    ],
  },

  /* ======= TOILET & FLUSH ======= */
  {
    id: "pl2",
    icon: "🚽",
    title: "Toilet & Flush Services",
    tagline: "Hassle-free toilet fittings & repairs",
    banner:
      "https://images.unsplash.com/photo-1593428498095-9b8e1bc105b9?auto=format&fit=crop&w=1200&q=80",
    items: [
      { name: "Toilet seat cover installation", desc: "Install toilet seat cover", price: "₹99", time: "20–30 mins", warranty: "30 Days" },
      { name: "Flush tank repair", desc: "Fix leaking or faulty flush tank", price: "₹149", time: "25–40 mins", warranty: "30 Days", tag: "Popular" },
      { name: "Indian toilet repair / installation", desc: "Repair or install Indian toilet", price: "₹649", time: "40–60 mins", warranty: "45 Days" },
      { name: "Western toilet repair (wall mount)", desc: "Repair wall-mounted toilet", price: "₹699", time: "40–60 mins", warranty: "45 Days", tag: "Bestseller" },
      { name: "Western toilet repair (floor mount)", desc: "Repair floor-mounted toilet", price: "₹699", time: "40–60 mins", warranty: "45 Days" },
    ],
  },

  /* ======= WASH BASIN & DRAIN ======= */
  {
    id: "pl3",
    icon: "🧼",
    title: "Wash Basin & Drain",
    tagline: "Leakage & blockage solutions",
    banner:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    items: [
      { name: "Wash basin leakage", desc: "Fix basin water leakage", price: "₹99", time: "20–30 mins", warranty: "30 Days", tag: "Bestseller" },
      { name: "Wash basin blockage removal", desc: "Clear blocked basin", price: "₹199", time: "20–40 mins", warranty: "30 Days" },
      { name: "Wash basin installation", desc: "Install new basin", price: "₹469", time: "40–60 mins", warranty: "45 Days" },
      { name: "Waste coupling installation", desc: "Install waste coupling", price: "₹149", time: "20–30 mins", warranty: "30 Days" },
      { name: "Drain cover installation", desc: "Install drain cover", price: "₹149", time: "20 mins", warranty: "30 Days" },
      { name: "Drain blockage removal", desc: "Clear clogged drain", price: "₹199", time: "25–40 mins", warranty: "30 Days", tag: "Popular" },
      { name: "Shut-off valve leakage repair", desc: "Fix leaking valve", price: "₹89", time: "15–20 mins", warranty: "30 Days" },
    ],
  },

  /* ======= INSTALLATIONS & WATER SYSTEM ======= */
  {
    id: "pl4",
    icon: "⚙️",
    title: "Installations & Water System",
    tagline: "Handled safely by trained plumbers",
    banner:
      "https://images.unsplash.com/photo-1581579186989-2c00d06f8a65?auto=format&fit=crop&w=1200&q=80",
    items: [
      { name: "Washing machine inlet installation", desc: "Install water inlet", price: "₹99", time: "20–30 mins", warranty: "30 Days" },
      { name: "RO water connection installation", desc: "Install RO pipeline", price: "₹99", time: "20–30 mins", warranty: "30 Days", tag: "Popular" },
      { name: "Geyser connection leakage repair", desc: "Fix geyser pipe leakage", price: "₹99", time: "20–30 mins", warranty: "30 Days" },
      { name: "Overhead water tank installation", desc: "Install water tank", price: "₹650", time: "60–90 mins", warranty: "45 Days", tag: "Bestseller" },
      { name: "Water tank repair", desc: "Fix tank leakage", price: "₹99", time: "30–45 mins", warranty: "30 Days" },
      { name: "Motor installation", desc: "Install water motor", price: "₹249", time: "30–45 mins", warranty: "30 Days" },
    ],
  },
];

/* ================= REVIEWS ================= */
const REVIEWS = [
  {
    name: "Ravi Kumar",
    city: "Hyderabad",
    rating: 5,
    review: "Quick service and professional plumber. Fixed leakage perfectly.",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    date: "2 days ago",
  },
  {
    name: "Ananya Singh",
    city: "Madhapur",
    rating: 5,
    review: "Very neat work. Pricing also good. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    date: "1 week ago",
  },
  {
    name: "Suresh Reddy",
    city: "Kondapur",
    rating: 4,
    review: "Polite behaviour and quality work. Happy with service.",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    date: "3 weeks ago",
  },
];

export default function Plumber() {
  const navigate = useNavigate();
  const [bannerIndex, setBannerIndex] = useState(0);

  const supportPhone = "7661045308";

  useEffect(() => {
    const interval = setInterval(
      () => setBannerIndex((prev) => (prev + 1) % SERVICES.length),
      3500
    );
    return () => clearInterval(interval);
  }, []);

  const active = SERVICES[bannerIndex];

  const handleBook = (title, name, price) => {
    navigate("/booking", {
      state: {
        service: "Plumber",
        subService: `${title} - ${name}`,
        price,
      },
    });
  };

  return (
    <div className="p-4 pb-28 service-container">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded bg-gray-200">
          ← Back
        </button>
        <h2 className="text-lg font-bold">Plumber</h2>
        <div />
      </div>

      {/* HERO */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-6 transition-all duration-700"
        style={{
          backgroundImage: `url(${active.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-xl font-bold">{active.title}</h3>
            <p className="text-sm opacity-90">{active.tagline}</p>
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${supportPhone}`}
              className="px-4 py-2 bg-green-600 rounded-xl font-semibold shadow"
            >
              📞 Call
            </a>
            <a
              href={`https://wa.me/${supportPhone}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-green-500 rounded-xl font-semibold shadow"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ⭐ REVIEWS */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">What Customers Say</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold">4.9 ⭐</p>
            <p className="text-xs text-gray-500">Based on 900+ ratings</p>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs">{star}★</span>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${star * 18}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="min-w-[260px] bg-gray-50 border rounded-2xl shadow-sm p-3"
            >
              <div className="flex items-center gap-2">
                <img src={r.avatar} className="w-10 h-10 rounded-full border object-cover" />
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.city}</p>
                </div>
              </div>

              <p className="text-yellow-500 text-sm mt-1">⭐ {r.rating}</p>
              <p className="text-sm text-gray-700 mt-2">{r.review}</p>
              <p className="text-xs text-gray-500 mt-2">{r.date}</p>

              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-2">
                ✔ Verified Booking
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <div className="space-y-6 service-grid">
        <h2 className="text-lg font-semibold mb-2">Our Services</h2>

        {SERVICES.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-xs text-gray-500">{section.tagline}</p>
              </div>
            </div>

            <div className="service-grid">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="service-card bg-white p-4 rounded-2xl shadow border flex flex-col sm:flex-row justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.name}</p>

                      {item.tag && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          ⭐ {item.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">{item.desc}</p>

                    <div className="flex gap-2 mt-1 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        ⏱ {item.time}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        🛡 {item.warranty}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-qsBlue-500 mt-1">
                      {item.price}
                    </p>
                  </div>

                  <div className="service-actions mt-3 sm:mt-0">
                    <button
                      onClick={() =>
                        handleBook(section.title, item.name, item.price)
                      }
                      className="px-4 py-2 rounded-xl bg-qsBlue-500 text-white"
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
    </div>
  );
}
