import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerAC from "../../assets/ac-banner.jpg";
/* ================= TECHNICIAN DATA ================= */
const TECHNICIANS = [
  {
    name: "Rahul Sharma",
    photo:
      "https://images.unsplash.com/photo-1603415526960-f7e0328e3f5c?auto=format&fit=crop&w=400&q=80",
    rating: "4.9",
    experience: "8 Years Experience",
    jobs: "2,350+ Jobs Completed",
    specialty: "AC Repair • Installation • Deep Service",
  },
  {
    name: "Aditya Verma",
    photo:
      "https://images.unsplash.com/photo-1603415527008-4e8f179f1dc1?auto=format&fit=crop&w=400&q=80",
    rating: "4.8",
    experience: "6 Years Experience",
    jobs: "1,920+ Jobs Completed",
    specialty: "Cooling Issues • Gas Refilling • Maintenance",
  },
];

/* ================= CUSTOMER REVIEWS ================= */
const REVIEWS = [
  {
    name: "Prakash Reddy",
    city: "Hyderabad",
    rating: 5,
    review:
      "Very professional service. Technician came on time and solved cooling issue quickly. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2 days ago",
  },
  {
    name: "Sneha Kapoor",
    city: "Kondapur",
    rating: 5,
    review:
      "Quick response and very neat work. Pricing is also reasonable. My AC is cooling perfectly now.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "1 week ago",
  },
  {
    name: "Amit Verma",
    city: "Madhapur",
    rating: 4,
    review:
      "Good technician and polite behaviour. Explained clearly what was wrong and fixed it.",
    avatar: "https://randomuser.me/api/portraits/men/66.jpg",
    date: "3 weeks ago",
  },
];

/* ================= ALL SERVICES (Urban Style Expanded) ================= */
const SERVICES = [
  /* ================= SUPER SAVER ================= */
  {
    id: "ac1",
    icon: "❄️",
    title: "Super Saving Offers",
    tagline: "",
    banner:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Split AC installation (2 ACs)",
        desc: "Professional installation with proper alignment & safety check",
        price: "₹2400",
        tag: "Bestseller",
        time: "60–90 mins",
        warranty: "90 Days Service Warranty",
      },
      {
        name: "Foam-jet service (2 ACs)",
        desc: "Deep cleaning improves cooling & air quality",
        price: "₹990",
        tag: "Popular",
        time: "45–60 mins",
        warranty: "30 Days Warranty",
      },
    ],
  },

  /* ================= REGULAR SERVICES ================= */
  {
    id: "ac2",
    icon: "❄️",
    title: "AC Services",
    tagline: "Cooling restored by verified professionals",
    banner:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Foam-jet service",
        desc: "Deep foam cleaning for better cooling & hygiene",
        price: "₹549",
        tag: "Bestseller",
        time: "40–60 mins",
        warranty: "30 Days Warranty",
      },
      {
        name: "General AC service",
        desc: "Basic cleaning to maintain cooling efficiency",
        price: "₹350",
        tag: "Popular",
        time: "30–45 mins",
        warranty: "15 Days Warranty",
      },
      {
        name: "Indoor Coil Deep Cleaning",
        desc: "Removes dust, improves airflow & cooling",
        price: "₹699",
        time: "40–60 mins",
        warranty: "30 Days Warranty",
      },
      {
        name: "Outdoor Unit Service",
        desc: "Outdoor fan & condenser cleaning",
        price: "₹499",
        time: "30–45 mins",
        warranty: "30 Days Warranty",
      },
    ],
  },

  /* ================= REPAIRS ================= */
  {
    id: "ac3",
    icon: "🛠️",
    title: "Repair & Gas Refill",
    tagline: "Professional fixing with genuine solutions",
    banner:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Low / No Cooling Repair",
        desc: "Complete inspection & fixing",
        price: "₹299",
        time: "30–50 mins",
        warranty: "30 Days Warranty",
      },
      {
        name: "AC Power Issue Repair",
        desc: "Fixing power, startup & sudden shutdown issues",
        price: "₹259",
        time: "25–40 mins",
        warranty: "30 Days Warranty",
      },
      {
        name: "Water Leakage Repair",
        desc: "Fix for indoor / outdoor water leakage problem",
        price: "₹459",
        time: "30–60 mins",
        warranty: "30 Days Warranty",
      },
      {
        name: "Gas Refill + Cooling Check",
        desc: "Refilling with pressure & leakage test",
        price: "₹2500",
        tag: "Bestseller",
        time: "60–90 mins",
        warranty: "90 Days Cooling Warranty",
      },
      {
        name: "PCB / Sensor Repair",
        desc: "Fix for motherboard & sensor problems",
        price: "₹799",
        time: "40–70 mins",
        warranty: "60 Days Warranty",
      },
      {
        name: "Noise / Smell Fix",
        desc: "Fix for vibration, smell & sound issues",
        price: "₹499",
        time: "30–50 mins",
        warranty: "30 Days Warranty",
      },
    ],
  },

  /* ================= INSTALL / UNINSTALL ================= */
  {
    id: "ac4",
    icon: "⚙️",
    title: "Installation / Uninstallation",
    tagline: "Handled safely by trained experts",
    banner:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Split AC Installation",
        desc: "Secure installation + Demo provided",
        price: "₹1500",
        tag: "Popular",
        time: "60–90 mins",
        warranty: "90 Days Warranty",
      },
      {
        name: "Window AC Installation",
        desc: "Strong & safe fitting",
        price: "₹799",
        time: "40–60 mins",
        warranty: "30 Days Warranty",
      },
      {
        name: "Split AC Uninstallation",
        desc: "Safe removal with care",
        price: "₹850",
        time: "30–45 mins",
        warranty: "30 Days Warranty",
      },
      {
        name: "Window AC Uninstallation",
        desc: "Quick safe removal",
        price: "₹699",
        time: "25–40 mins",
        warranty: "30 Days Warranty",
      },
    ],
  },
];

export default function ApplianceServices() {
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
        service: "AC & Appliances",
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
        <h2 className="text-lg font-bold">Appliance Services</h2>
        <div />
      </div>

      {/* HERO */}
      <div
        className="relative h-44 rounded-2xl overflow-hidden shadow mb-6 transition-all duration-700"
        style={{
          backgroundImage: `url(${bannerAC})`,
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
            <p className="text-xs text-gray-500">Based on 1,200+ ratings</p>
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

      {/* SERVICES SECTION */}
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
