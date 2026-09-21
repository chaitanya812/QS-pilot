import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerFridge from "../../assets/Fridge service.png";
import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

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

/* =========================================================
   FRIDGE SERVICES
========================================================= */

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
        id: "fr1-1",
        name: "Single Door Service Pack",
        desc: "Full cleaning & performance check",
        price: "₹499",
        time: "30–45 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        id: "fr1-2",
        name: "Double Door Service Pack",
        desc: "Deep cleaning + cooling check",
        price: "₹699",
        time: "40–60 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        id: "fr1-3",
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
        id: "fr2-1",
        name: "General fridge service",
        desc: "Basic cleaning & performance check",
        price: "₹299",
        time: "25–40 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        id: "fr2-2",
        name: "Deep cleaning service",
        desc: "Full inside cleaning & hygiene care",
        price: "₹499",
        time: "40–60 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        id: "fr2-3",
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
        id: "fr3-1",
        name: "Fridge not cooling repair",
        desc: "Fix cooling issues safely",
        price: "₹349",
        time: "25–40 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        id: "fr3-2",
        name: "Power / wiring issue repair",
        desc: "Fix electrical or power problems",
        price: "₹299",
        time: "20–30 mins",
        warranty: "30 Days",
      },
      {
        id: "fr3-3",
        name: "Water leakage repair",
        desc: "Fix leaking inside or outside",
        price: "₹399",
        time: "30–45 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        id: "fr3-4",
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
        id: "fr4-1",
        name: "Gas refill (Home fridge)",
        desc: "Gas refill + leakage & cooling test",
        price: "₹1800",
        time: "45–60 mins",
        warranty: "45 Days",
        tag: "Bestseller",
      },
      {
        id: "fr4-2",
        name: "Compressor health check",
        desc: "Full compressor performance test",
        price: "₹299",
        time: "25–35 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        id: "fr4-3",
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
        id: "fr5-1",
        name: "Deep Freezer Service",
        desc: "Single / double door deep freezer service",
        price: "₹899",
        time: "50–70 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        id: "fr5-2",
        name: "Visi Cooler / Display Fridge",
        desc: "Shop display fridge servicing",
        price: "₹999",
        time: "50–70 mins",
        warranty: "30 Days",
      },
      {
        id: "fr5-3",
        name: "Commercial Gas Refill",
        desc: "Gas refill with cooling test",
        price: "₹2600",
        time: "60–90 mins",
        warranty: "60 Days",
        tag: "Popular",
      },
      {
        id: "fr5-4",
        name: "Commercial Cooling Repair",
        desc: "Cooling failure / heavy load repair",
        price: "₹899",
        time: "40–60 mins",
        warranty: "45 Days",
      },
    ],
  },
];

/* =========================================================
   QUICK PROBLEMS
========================================================= */

const PROBLEMS = [
  {
    id: "cooling",
    icon: "❄️",
    title: "Not Cooling",
    keywords: ["cool", "cooling", "cold", "temperature"],
  },
  {
    id: "leakage",
    icon: "💧",
    title: "Water Leakage",
    keywords: ["leak", "water", "leakage"],
  },
  {
    id: "noise",
    icon: "🔊",
    title: "Noise / Vibration",
    keywords: ["noise", "sound", "vibration"],
  },
  {
    id: "power",
    icon: "⚡",
    title: "Power Problem",
    keywords: ["power", "electric", "wiring", "switch"],
  },
  {
    id: "gas",
    icon: "🛠️",
    title: "Gas Problem",
    keywords: ["gas", "refill", "compressor"],
  },
  {
    id: "service",
    icon: "🔧",
    title: "General Service",
    keywords: ["service", "cleaning", "maintenance"],
  },
];

/* =========================================================
   HELPERS
========================================================= */

const priceToNumber = (value) => {
  const number = Number(String(value).replace(/[₹,\s]/g, ""));
  return Number.isFinite(number) ? number : 0;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Fridge() {
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);

  /* -------------------------------------------------------
     SEARCH RESULTS
  ------------------------------------------------------- */

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    const results = [];

    SERVICES.forEach((section) => {
      section.items.forEach((item) => {
        const searchable = [
          item.name,
          item.desc,
          section.title,
          section.tagline,
        ]
          .join(" ")
          .toLowerCase();

        if (searchable.includes(query)) {
          results.push({
            section,
            item,
          });
        }
      });
    });

    return results;
  }, [search]);

  /* -------------------------------------------------------
     BOOK NOW → CART
  ------------------------------------------------------- */

  const handleBook = (section, item) => {
    if (bookingId) return;

    setBookingId(item.id);

    const cartItem = {
      id: item.id,
      key: item.id,
      label: item.name,
      name: item.name,
      price: priceToNumber(item.price),
      qty: 1,

      service: "Fridge Repair",
      category: section.title,
      subService: item.name,

      description: item.desc,
      duration: item.time,
      warranty: item.warranty,

      image: bannerFridge,
      tag: item.tag || "",
    };

    addItem(cartItem);

    setTimeout(() => {
      navigate("/cart");
      setBookingId(null);
    }, 100);
  };

  /* -------------------------------------------------------
     PROBLEM FILTER
  ------------------------------------------------------- */

  const handleProblem = (problem) => {
    setSelectedProblem(problem.id);

    setSearch(problem.keywords[0]);

    setTimeout(() => {
      document
        .getElementById("fridge-services")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl"
          >
            ←
          </button>

          <div className="flex-1">
            <p className="text-xs text-slate-500">QuickSeva</p>
            <h1 className="font-bold text-slate-900">
              Fridge & Refrigerator
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
            aria-label="Open cart"
          >
            🛒

            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative mt-4 h-52 sm:h-64 rounded-3xl overflow-hidden shadow-lg">
          <img
            src={bannerFridge}
            alt="Fridge service"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

          <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col justify-center text-white">
            <span className="text-sm font-semibold text-sky-300">
              QuickSeva Fridge Services
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold mt-1 max-w-xl">
              Fridge problem?
              <br />
              We'll take care of it.
            </h2>

            <p className="text-sm text-white/90 mt-2 max-w-lg">
              Cleaning, cooling problems, gas refill, repairs and refrigerator
              maintenance at your doorstep.
            </p>

            <div className="flex gap-2 mt-4">
              <a
                href="tel:7661045308"
                className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold shadow"
              >
                📞 Call
              </a>

              <a
                href="https://wa.me/7661045308"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-green-500 text-white font-semibold shadow"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="mt-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedProblem(null);
              }}
              placeholder="Search fridge services or problems..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-11 pr-4 outline-none focus:ring-2 focus:ring-sky-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedProblem(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-100 text-slate-500"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            PROBLEM CARDS
        ================================================= */}

        {!search && (
          <section className="mt-6">
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  What's wrong with your fridge?
                </h2>

                <p className="text-sm text-slate-500">
                  Select your problem and find the right service
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROBLEMS.map((problem) => {
                const active = selectedProblem === problem.id;

                return (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => handleProblem(problem)}
                    className={`text-left p-4 rounded-2xl border transition ${
                      active
                        ? "bg-sky-50 border-sky-400 shadow-sm"
                        : "bg-white border-slate-200 hover:border-sky-300"
                    }`}
                  >
                    <div className="text-2xl">{problem.icon}</div>

                    <p className="font-semibold text-slate-900 mt-2">
                      {problem.title}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Find service →
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* =================================================
            SUPPORT
        ================================================= */}

        <section className="mt-6 bg-slate-900 rounded-3xl p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sky-300 text-sm font-semibold">
                Need help choosing?
              </p>

              <h3 className="text-lg font-bold mt-1">
                Not sure what's wrong with your fridge?
              </h3>

              <p className="text-sm text-white/70 mt-1">
                Talk to QuickSeva and we'll help you choose the right service.
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href="tel:7661045308"
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold"
              >
                Call
              </a>

              <a
                href="https://wa.me/7661045308"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-green-500 text-white font-bold"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        {search && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Search results
                </h2>

                <p className="text-sm text-slate-500">
                  {searchResults.length} service
                  {searchResults.length === 1 ? "" : "s"} found
                </p>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white border rounded-2xl p-6 text-center">
                <div className="text-4xl">🔍</div>

                <h3 className="font-bold text-slate-900 mt-3">
                  No matching service found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try searching for cooling, leakage, gas, repair or service.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map(({ section, item }) => (
                  <div
                    key={`${section.id}-${item.id}`}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-sky-600 font-semibold">
                        {section.title}
                      </p>

                      <h3 className="font-bold text-slate-900 mt-1">
                        {item.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {item.desc}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                          ⏱ {item.time}
                        </span>

                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">
                          🛡 {item.warranty}
                        </span>
                      </div>

                      <p className="text-lg font-bold text-sky-600 mt-2">
                        {item.price}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={bookingId === item.id}
                      onClick={() => handleBook(section, item)}
                      className="shrink-0 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-bold"
                    >
                      {bookingId === item.id ? "Adding..." : "Book Now"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            ALL SERVICES
        ================================================= */}

        <section
          id="fridge-services"
          className="mt-8 scroll-mt-24"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              All Fridge Services
            </h2>

            <p className="text-sm text-slate-500">
              Choose the service that matches your fridge problem
            </p>
          </div>

          <div className="space-y-8">
            {SERVICES.map((section) => (
              <section key={section.id}>
                {/* Section heading */}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center text-2xl">
                    {section.icon}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {section.title}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {section.tagline}
                    </p>
                  </div>
                </div>

                {/* Service cards */}

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900">
                              {item.name}
                            </h4>

                            {item.tag && (
                              <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-lg font-semibold">
                                ⭐ {item.tag}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-slate-500 mt-1">
                            {item.desc}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                              ⏱ {item.time}
                            </span>

                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">
                              🛡 {item.warranty}
                            </span>
                          </div>

                          <p className="text-lg font-bold text-sky-600 mt-3">
                            {item.price}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={bookingId === item.id}
                          onClick={() => handleBook(section, item)}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-bold shadow-sm"
                        >
                          {bookingId === item.id ? "Adding..." : "Book Now"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* =================================================
            REVIEWS
        ================================================= */}

        <section className="mt-10">
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                What Customers Say
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Real feedback from QuickSeva customers
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Rating */}

              <div className="sm:w-44 shrink-0 text-center sm:text-left">
                <p className="text-4xl font-bold text-slate-900">
                  4.9 ⭐
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Based on 900+ ratings
                </p>

                <div className="mt-3 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div
                      key={star}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs w-5">
                        {star}★
                      </span>

                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${star * 18}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review cards */}

              <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {REVIEWS.map((review, index) => (
                  <article
                    key={index}
                    className="min-w-[260px] sm:min-w-[280px] bg-slate-50 border border-slate-200 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-11 h-11 rounded-full object-cover border"
                      />

                      <div>
                        <p className="font-bold text-sm text-slate-900">
                          {review.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {review.city}
                        </p>
                      </div>
                    </div>

                    <p className="text-yellow-500 text-sm mt-3">
                      ⭐ {review.rating}
                    </p>

                    <p className="text-sm text-slate-700 mt-2">
                      {review.review}
                    </p>

                    <p className="text-xs text-slate-400 mt-3">
                      {review.date}
                    </p>

                    <span className="inline-flex mt-3 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-lg font-semibold">
                      ✔ Verified Booking
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            TRUST SECTION
        ================================================= */}

        <section className="mt-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5">
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Why Choose QuickSeva?
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Reliable fridge service at your doorstep
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl">🛡️</div>
                <p className="font-bold text-sm text-slate-900 mt-2">
                  Verified Technicians
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Trained service professionals
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl">💰</div>
                <p className="font-bold text-sm text-slate-900 mt-2">
                  Clear Pricing
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Transparent service prices
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl">⚡</div>
                <p className="font-bold text-sm text-slate-900 mt-2">
                  Quick Response
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Fast booking confirmation
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl">⭐</div>
                <p className="font-bold text-sm text-slate-900 mt-2">
                  Trusted Service
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Customer-focused support
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ViewCartBar />
    </div>
  );
}
