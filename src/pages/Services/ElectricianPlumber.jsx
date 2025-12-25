import React from "react";
import { useNavigate } from "react-router-dom";
import bannerElectrician from "../../assets/eletrican banner.png";

const SUBS_EP = [
  { id: "e1", label: "Switchboard Repair / Replacement", desc: "Fix or replace damaged switchboard safely", price: "₹99", tag: "Bestseller", time: "20–30 mins", warranty: "30 Days" },
  { id: "e2", label: "Switch / Socket Repair / Replacement", desc: "Repair broken switches and loose sockets", price: "₹149", tag: "Popular", time: "20–40 mins", warranty: "30 Days" },
  { id: "e3", label: "New Switch Box Installation", desc: "Install a brand new switch box securely", price: "₹149", time: "25–40 mins", warranty: "30 Days" },

  { id: "e4", label: "Fan Repair", desc: "Fix fan not working, noise or slow speed", price: "₹149", tag: "Trending", time: "25–45 mins", warranty: "30 Days" },
  { id: "e5", label: "Exhaust / Pedestal / Tower Fan Installation", desc: "Professional fan fitting with neat wiring", price: "₹99", time: "20–30 mins", warranty: "30 Days" },
  { id: "e6", label: "Fan Regulator Replacement", desc: "Replace faulty fan speed regulator", price: "₹79", time: "15–20 mins", warranty: "30 Days" },
  { id: "e21", label: "Karban Airzone Fan Installation", desc: "Install premium Airzone fan safely", price: "₹399", time: "30–45 mins", warranty: "30 Days" },

  { id: "e7", label: "Fancy Light Installation / Replacement", desc: "Install or replace designer fancy lights", price: "₹149", tag: "Popular", time: "20–35 mins", warranty: "30 Days" },
  { id: "e8", label: "Tubelight Installation", desc: "Safe and quick tube light installation", price: "₹99", time: "15–20 mins", warranty: "30 Days" },
  { id: "e9", label: "Bulb Installation", desc: "Install bulb in any room or space", price: "₹49", time: "10 mins", warranty: "30 Days" },
  { id: "e10", label: "Ceiling Light Installation", desc: "Fix ceiling lights properly and safely", price: "₹89", time: "15–25 mins", warranty: "30 Days" },
  { id: "e11", label: "Hanging Light Installation", desc: "Install hanging lights with proper support", price: "₹199", time: "25–40 mins", warranty: "30 Days" },
  { id: "e12", label: "Chandelier Installation", desc: "Expert chandelier fitting with care", price: "₹499", tag: "Premium", time: "40–60 mins", warranty: "45 Days" },

  { id: "e13", label: "Internal Wiring (Per Meter)", desc: "New internal electrical wiring work", price: "₹40", time: "Depends on work", warranty: "30 Days" },
  { id: "e14", label: "External Wiring (Per Meter)", desc: "Safe and neat external wiring setup", price: "₹24", time: "Depends on work", warranty: "30 Days" },

  { id: "e15", label: "Regular Doorbell Installation", desc: "Install normal doorbell at your home", price: "₹99", time: "15–20 mins", warranty: "30 Days" },
  { id: "e16", label: "Video Doorbell Installation", desc: "Install smart video doorbell securely", price: "₹600", tag: "Bestseller", time: "40–60 mins", warranty: "45 Days" },

  { id: "e17", label: "MCB / Fuse Repair", desc: "Fix tripping MCBs or blown fuses", price: "₹149", time: "20–30 mins", warranty: "30 Days" },

  { id: "e18", label: "Sub Meter Installation", desc: "Install separate home / room meter", price: "₹249", time: "35–50 mins", warranty: "45 Days" },

  { id: "e19", label: "TV Installation", desc: "Wall mount and setup your television", price: "₹299", time: "30–45 mins", warranty: "30 Days" },
  { id: "e20", label: "TV Uninstallation", desc: "Remove TV safely without damage", price: "₹200", time: "20–30 mins", warranty: "30 Days" },

  { id: "e22", label: "Inverter Installation", desc: "Install inverter with proper connections", price: "₹450", tag: "Popular", time: "35–50 mins", warranty: "45 Days" },
  { id: "e23", label: "Inverter Fuse Replacement", desc: "Replace damaged inverter fuse", price: "₹99", time: "10–15 mins", warranty: "30 Days" },
  { id: "e24", label: "Inverter Servicing", desc: "Full health check and service of inverter", price: "₹249", time: "30–45 mins", warranty: "30 Days" },
  { id: "e25", label: "Inverter Check-up", desc: "Basic inverter health inspection", price: "₹160", time: "15–25 mins", warranty: "30 Days" },
  { id: "e26", label: "Inverter Uninstallation", desc: "Remove inverter safely and cleanly", price: "₹499", time: "30–45 mins", warranty: "30 Days" },

  { id: "e27", label: "Stabilizer Installation", desc: "Install stabilizer for safe voltage use", price: "₹149", time: "20–30 mins", warranty: "30 Days" },
];

const CATEGORIES = [
  { key: "switch", title: "Switch & Socket", icon: "⚡", match: ["switch", "socket", "board", "box"] },
  { key: "fan", title: "Fan Services", icon: "🌀", match: ["fan", "regulator"] },
  { key: "lights", title: "Lights & Chandelier", icon: "💡", match: ["light", "bulb", "tube", "chandelier"] },
  { key: "wiring", title: "Wiring Work", icon: "🧰", match: ["wiring"] },
  { key: "doorbell", title: "Doorbell", icon: "🔔", match: ["doorbell"] },
  { key: "mcb", title: "Fuse & Safety", icon: "🛡️", match: ["mcb", "fuse"] },
  { key: "meter", title: "Meter Work", icon: "⚙️", match: ["meter"] },
  { key: "tv", title: "TV Services", icon: "📺", match: ["tv"] },
  { key: "inverter", title: "Inverter", icon: "🔋", match: ["inverter"] },
  { key: "stabilizer", title: "Stabilizer", icon: "⚙️", match: ["stabilizer"] },
];

const REVIEWS = [
  {
    name: "Rohit Sharma",
    city: "Hyderabad",
    text: "Technician arrived on time, work done neatly. Very professional service.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    date: "2 days ago",
  },
  {
    name: "Priya Singh",
    city: "Madhapur",
    text: "Quick response and helpful behaviour. Pricing is also reasonable.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    date: "1 week ago",
  },
  {
    name: "Aman Verma",
    city: "Kondapur",
    text: "Good work quality and safe installation. Happy with the service.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    date: "3 weeks ago",
  },
];

export default function ElectricianPlumber() {
  const nav = useNavigate();
  const supportPhone = "7661045308";

  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva, I need help with Electrician services."
  );

  const filterByCategory = (keywords) =>
    SUBS_EP.filter((s) =>
      keywords.some((k) => s.label.toLowerCase().includes(k))
    );

  return (
    <div className="p-4 pb-28 service-container">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => nav(-1)} className="p-2 rounded bg-gray-200">
          ← Back
        </button>
        <h2 className="text-lg font-bold">Electrician</h2>
        <div />
      </div>

      {/* HERO */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-6"
        style={{
          backgroundImage: `url(${bannerElectrician})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-xl font-bold">Safe & Reliable Electrical Work</h3>
            <p className="text-sm opacity-90">
              Certified electricians for quick & safe service
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

      {/* REVIEWS --- same UX */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h3 className="font-semibold mb-2">Customer Ratings & Reviews</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold">4.9 ⭐</p>
            <p className="text-xs text-gray-500">Based on 900+ ratings</p>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs">{star}★</span>
                <div className="w-full bg-gray-200 h-2 rounded-full">
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
                <img
                  src={r.avatar}
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.city}</p>
                </div>
              </div>

              <p className="text-yellow-500 text-sm mt-1">⭐ {r.rating}</p>
              <p className="text-sm text-gray-700 mt-2">{r.text}</p>
              <p className="text-xs text-gray-500 mt-2">{r.date}</p>

              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-2">
                ✔ Verified Booking
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY SECTIONS */}
      <div className="space-y-6 service-grid">
        {CATEGORIES.map((cat) => {
          const items = filterByCategory(cat.match);
          if (!items.length) return null;

          return (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="font-semibold">{cat.title}</h3>
              </div>

              <div className="service-grid">
                {items.map((s) => (
                  <div
                    key={s.id}
                    className="service-card bg-white p-3 rounded-2xl shadow border flex flex-col sm:flex-row justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{s.label}</p>

                        {s.tag && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            ⭐ {s.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-1">{s.desc}</p>

                      <div className="flex gap-2 mt-1 text-xs">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          ⏱ {s.time}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                          🛡 {s.warranty}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-qsBlue-500 mt-1">
                        {s.price}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        nav("/service-detail", {
                          state: {
                            service: "Electrician",
                            subService: s.label,
                            price: s.price,
                          },
                        })
                      }
                      className="px-4 py-2 rounded-2xl bg-qsBlue-500 text-white mt-2 sm:mt-0"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
