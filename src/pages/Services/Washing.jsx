import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerWashing from "../../assets/washing-banner.jpg";

/* ===============================
    REVIEWS (Same UX like AC Page)
================================ */
const REVIEWS = [
  {
    name: "Rakesh Kumar",
    city: "Hyderabad",
    rating: 5,
    review:
      "Very good washing machine service. Cleaning done perfectly and machine is working like new.",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    date: "3 days ago",
  },
  {
    name: "Priya Sharma",
    city: "Madhapur",
    rating: 5,
    review:
      "Technician was polite and professional. Issue resolved within 30 mins. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/52.jpg",
    date: "1 week ago",
  },
  {
    name: "Anil Reddy",
    city: "Kondapur",
    rating: 4,
    review:
      "Good service and reasonable pricing. Booking experience was smooth.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    date: "2 weeks ago",
  },
];

/* ===============================
    WASHING MACHINE SERVICES
================================ */
const SERVICES = [
  {
    id: "popular",
    icon: "🔥",
    title: "Super Saving Offers",
    tagline: "Best value services for your washing machine",
    banner:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Full Deep Service (2 Machines)",
        desc: "Complete internal cleaning with high-pressure jet wash",
        desc1: "Drum deep clean • Filter cleaning • Bacteria removal",
        price: "₹999",
        tag: "Bestseller",
        time: "60 - 75 mins",
        warranty: "30 Days",
      },
      {
        name: "Jet Cleaning Service (2 Machines)",
        desc: "Removes dirt, bad smell & improves performance",
        desc1: "Professional Jet Wash + Interior cleaning",
        price: "₹1199",
        tag: "Most Booked",
        time: "45 - 60 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "service",
    icon: "🧼",
    title: "Washing Machine Service",
    tagline: "Professional cleaning & maintenance",
    banner:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "General Service",
        desc: "Basic maintenance for smooth washing",
        desc1: "External clean • Filter wash • Drum checkup",
        price: "₹399",
        tag: "Popular",
        time: "30 - 40 mins",
        warranty: "15 Days",
      },
      {
        name: "Full Deep Cleaning",
        desc: "Recommended every 6 months",
        desc1: "Internal cleaning • Bacteria removal",
        price: "₹699",
        tag: "Recommended",
        time: "45 - 60 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "repair",
    icon: "🛠️",
    title: "Repair & Fix Issues",
    tagline: "Expert technicians for every problem",
    banner:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Machine Not Spinning",
        desc: "Inspection & repair",
        price: "₹249",
        tag: "Most Fixed",
        time: "30 - 45 mins",
        warranty: "15 Days",
      },
      {
        name: "Power / Start Problem",
        desc: "Fix startup & shutdown issues",
        price: "₹299",
        time: "30 - 50 mins",
        warranty: "30 Days",
      },
      {
        name: "Water Leakage Fix",
        desc: "Fix leakage from pipe / drum",
        price: "₹349",
        time: "30 - 60 mins",
        warranty: "30 Days",
      },
      {
        name: "Noise / Vibration Issue",
        desc: "Fix shaking or loud noise",
        price: "₹299",
        time: "25 - 40 mins",
        warranty: "20 Days",
      },
      {
        name: "Error Code Repair",
        desc: "Digital panel warning fix",
        price: "₹349",
        time: "30 - 45 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "install",
    icon: "⚙️",
    title: "Installation & Uninstallation",
    tagline: "Hassle-free setup",
    banner:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Installation",
        desc: "Proper setup + balancing + demo",
        price: "₹799",
        time: "45 - 60 mins",
        warranty: "30 Days",
      },
      {
        name: "Uninstallation",
        desc: "Safe removal",
        price: "₹499",
        time: "20 - 30 mins",
        warranty: "15 Days",
      },
    ],
  },
];

export default function Washing() {
  const navigate = useNavigate();
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setBannerIndex((prev) => (prev + 1) % SERVICES.length),
      3500
    );
    return () => clearInterval(interval);
  }, []);

  const active = SERVICES[bannerIndex];

  const handleBook = (title, name) => {
  navigate("/service-detail", {
    state: {
      service: "Washing Machine",
      subService: `${title} - ${name}`,
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
        <h2 className="text-lg font-bold">Washing Machine Services</h2>
        <div />
      </div>

      {/* HERO */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-6 transition-all duration-700"
        style={{
          backgroundImage: `url(${bannerWashing})`,
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
              href="tel:7661045308"
              className="px-4 py-2 bg-green-600 rounded-xl text-white font-semibold shadow"
            >
              📞 Call
            </a>

            <a
              href="https://wa.me/7661045308"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-green-500 rounded-xl text-white font-semibold shadow"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ⭐ REVIEWS (Same UI Like AC) */}
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
              <p className="text-sm text-gray-700 mt-2">{r.review}</p>
              <p className="text-xs text-gray-500 mt-2">{r.date}</p>

              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-2">
                ✔ Verified Booking
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES LIST — SAME UX AS AC */}
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
                    {item.desc1 && (
                      <p className="text-sm text-gray-600">{item.desc1}</p>
                    )}

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
                      onClick={() => handleBook(section.title, item.name)}
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
