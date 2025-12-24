import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= CUSTOMER REVIEWS ================= */
const REVIEWS = [
  {
    name: "Kiran Reddy",
    city: "Hyderabad",
    rating: 5,
    review:
      "Technician came on time and fixed cooling issue quickly. Very professional!",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    date: "2 days ago",
  },
  {
    name: "Megha Sharma",
    city: "Kondapur",
    rating: 5,
    review:
      "Good pricing and quality service. My double door fridge works perfectly now.",
    avatar: "https://randomuser.me/api/portraits/women/30.jpg",
    date: "1 week ago",
  },
  {
    name: "Ravi Kumar",
    city: "Madhapur",
    rating: 4,
    review:
      "Quick service. Technician explained everything clearly. Recommended!",
    avatar: "https://randomuser.me/api/portraits/men/66.jpg",
    date: "3 weeks ago",
  },
];

/* ================= FRIDGE SERVICES ================= */
const SERVICES = [
  {
    id: "fr1",
    icon: "❄️",
    title: "Super Saving Offers",
    tagline: "Best value fridge services",
    banner:
      "https://images.unsplash.com/photo-1600959907703-125ba1374c92?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Single Door Service Pack",
        desc: "Full cleaning & performance check",
        price: "₹499",
        time: "30–45 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        name: "Double Door Service Pack",
        desc: "Deep cleaning + cooling check",
        price: "₹699",
        time: "40–60 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        name: "Side-by-Side / French Door Service Pack",
        desc: "Premium refrigerator maintenance",
        price: "₹899",
        time: "50–70 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "fr2",
    icon: "🧊",
    title: "Home Fridge Services",
    tagline: "Keeps your fridge running smooth",
    banner:
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "General fridge service",
        desc: "Basic cleaning & performance check",
        price: "₹299",
        time: "25–40 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        name: "Deep cleaning service",
        desc: "Full inside cleaning & hygiene care",
        price: "₹499",
        time: "40–60 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        name: "Premium fridge service",
        desc: "Triple / French door / Side-by-Side",
        price: "₹699",
        time: "50–70 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "fr3",
    icon: "⚙️",
    title: "Repair Services",
    tagline: "Problem? We fix it properly",
    banner:
      "https://images.unsplash.com/photo-1593504982586-4458f98b5b43?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Fridge not cooling repair",
        desc: "Fix cooling issues safely",
        price: "₹349",
        time: "25–40 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        name: "Power / wiring issue repair",
        desc: "Fix electrical or power problems",
        price: "₹299",
        time: "20–30 mins",
        warranty: "30 Days",
      },
      {
        name: "Water leakage repair",
        desc: "Fix leaking inside or outside",
        price: "₹399",
        time: "30–45 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        name: "Noise / vibration repair",
        desc: "Fix unusual sound & shaking issues",
        price: "₹349",
        time: "25–40 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "fr4",
    icon: "🛠️",
    title: "Gas & Parts Support",
    tagline: "Handled by verified technicians",
    banner:
      "https://images.unsplash.com/photo-1581092795360-f12a5c2a9a5a?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Gas refill (Home fridge)",
        desc: "Gas refill + leakage & cooling test",
        price: "₹1800",
        time: "45–60 mins",
        warranty: "45 Days",
        tag: "Bestseller",
      },
      {
        name: "Compressor health check",
        desc: "Full compressor performance test",
        price: "₹299",
        time: "25–35 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        name: "Thermostat / Sensor Repair",
        desc: "Fix temperature & auto cut-off problems",
        price: "₹499",
        time: "30–45 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "fr5",
    icon: "🏢",
    title: "Commercial & Deep Freezer",
    tagline: "Heavy duty cooling solutions",
    banner:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Deep Freezer Service",
        desc: "Single / double door deep freezer service",
        price: "₹899",
        time: "50–70 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        name: "Visi Cooler / Display Fridge",
        desc: "Shop display fridge servicing",
        price: "₹999",
        time: "50–70 mins",
        warranty: "30 Days",
      },
      {
        name: "Commercial Gas Refill",
        desc: "Gas refill with cooling test",
        price: "₹2600",
        time: "60–90 mins",
        warranty: "60 Days",
        tag: "Popular",
      },
      {
        name: "Commercial Cooling Repair",
        desc: "Cooling failure / heavy load repair",
        price: "₹899",
        time: "40–60 mins",
        warranty: "45 Days",
      },
    ],
  },
];

export default function Fridge() {
  const navigate = useNavigate();
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % SERVICES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const active = SERVICES[bannerIndex];

  const handleBook = (title, name, price) => {
    navigate("/booking", {
      state: {
        service: "Fridge Repair",
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
        <h2 className="text-lg font-bold">Fridge Repair</h2>
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

                  <button
                    onClick={() =>
                      handleBook(section.title, item.name, item.price)
                    }
                    className="px-2 py-0 m rounded-xl bg-qsBlue-500 text-white mt-2 sm:mt-0"
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
