import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===============================
    WASHING MACHINE SERVICES (Urban Style)
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
        rating: "4.9",
        reviews: "1,240",
      },
      {
        name: "Jet Cleaning Service (2 Machines)",
        desc: "Removes dirt, bad smell & improves washing performance",
        desc1: "Professional Jet Wash + Interior cleaning",
        price: "₹1199",
        tag: "Most Booked",
        time: "45 - 60 mins",
        warranty: "30 Days",
        rating: "4.8",
        reviews: "980",
      },
    ],
  },

  {
    id: "service",
    icon: "🧼",
    title: "Washing Machine Service",
    tagline: "Professional cleaning & maintenance for smooth performance",
    banner:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "General Service",
        desc: "Basic maintenance for smooth washing experience",
        desc1: "External cleaning • Filter wash • Drum checkup",
        price: "₹399",
        tag: "Popular",
        time: "30 - 40 mins",
        warranty: "15 Days",
        rating: "4.7",
        reviews: "760",
      },
      {
        name: "Full Deep Cleaning",
        desc: "Recommended every 6 months for best performance",
        desc1: "Internal deep clean • Bacteria removal • Drum wash",
        price: "₹699",
        tag: "Recommended",
        time: "45 - 60 mins",
        warranty: "30 Days",
        rating: "4.9",
        reviews: "1,010",
      },
    ],
  },

  {
    id: "repair",
    icon: "🛠️",
    title: "Repair & Fix Issues",
    tagline: "Expert technicians to solve every washing machine problem",
    banner:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Machine Not Spinning / Drum Stuck",
        desc: "Complete inspection & repair",
        price: "₹249",
        tag: "Most Fixed",
        time: "30 - 45 mins",
        warranty: "15 Days",
        rating: "4.8",
        reviews: "670",
      },
      {
        name: "Power / Start Problem",
        desc: "Machine not turning on or auto power-off issue",
        price: "₹299",
        time: "30 - 50 mins",
        warranty: "30 Days",
        rating: "4.9",
        reviews: "820",
      },
      {
        name: "Water Leakage Fix",
        desc: "Leakage from drum, pipe or bottom area",
        price: "₹349",
        time: "30 - 60 mins",
        warranty: "30 Days",
        rating: "4.8",
        reviews: "540",
      },
      {
        name: "Noise / Vibration Issue",
        desc: "Excess shaking or loud sound during wash",
        price: "₹299",
        time: "25 - 40 mins",
        warranty: "20 Days",
        rating: "4.7",
        reviews: "480",
      },
      {
        name: "Error Code Repair",
        desc: "Fix for digital panel error warnings",
        price: "₹349",
        time: "30 - 45 mins",
        warranty: "30 Days",
        rating: "4.9",
        reviews: "710",
      },
    ],
  },

  {
    id: "install",
    icon: "⚙️",
    title: "Installation & Uninstallation",
    tagline: "Hassle-free setup by trained experts",
    banner:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    items: [
      {
        name: "Washing Machine Installation",
        desc: "Proper setup + balancing + basic demo",
        price: "₹799",
        time: "45 - 60 mins",
        warranty: "30 Days",
        rating: "5.0",
        reviews: "620",
      },
      {
        name: "Washing Machine Uninstallation",
        desc: "Safe removal without damage",
        price: "₹499",
        time: "20 - 30 mins",
        warranty: "15 Days",
        rating: "4.8",
        reviews: "390",
      },
      {
        name: "Stand / Pipe Fitting Support",
        desc: "Installation support for accessories",
        price: "₹199",
        time: "15 - 25 mins",
        warranty: "No Warranty",
        rating: "4.6",
        reviews: "320",
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

  const handleBook = (sectionTitle, item) => {
    navigate("/booking", {
      state: {
        service: "Washing Machine",
        subService: `${sectionTitle} - ${item.name}`,
        price: item.price,
      },
    });
  };

  return (
    <div className="p-4 pb-28">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded bg-gray-200">
          ← Back
        </button>
        <h2 className="text-lg font-bold">Washing Machine Services</h2>
        <div />
      </div>

      {/* BANNER */}
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

      {/* INFO */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <p className="text-sm text-gray-600">
          Get your washing machine serviced by trained professionals.
          <br />
          ✔ Transparent pricing ✔ Genuine spare parts ✔ Service Warranty
        </p>
      </div>

      {/* SERVICES */}
      <div className="space-y-6">
        {SERVICES.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-xs text-gray-500">{section.tagline}</p>
              </div>
            </div>

            {/* LIST */}
            <div className="space-y-3">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-2xl shadow border flex justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.name}</p>

                      {item.tag && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">{item.desc}</p>
                    <p className="text-sm text-gray-600">{item.desc1}</p>

                    <div className="flex gap-2 mt-2 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        ⏱ {item.time}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        🛡 Warranty: {item.warranty}
                      </span>
                    </div>

                    {/* REVIEWS */}
                    <div className="mt-2 text-xs text-gray-600">
                      ⭐ {item.rating} • {item.reviews}+ reviews
                    </div>

                    <div className="text-sm font-semibold text-qsBlue-500 mt-1">
                      {item.price}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBook(section.title, item)}
                    className="px-4 py-2 h-fit mt-auto rounded-xl bg-qsBlue-500 text-white"
                  >
                    Book
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
