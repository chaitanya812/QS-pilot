import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerPlumber from "../../assets/plumber-banner.jpg";
import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

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

/* =========================================================
   PLUMBING SERVICES
========================================================= */

const SERVICES = [
  {
    id: "p1",
    icon: "🚿",
    title: "Tap Leakage & Repair",
    tagline: "Fix all types of water leak issues",
    items: [
      {
        id: "p1-1",
        name: "Tap Leakage Repair",
        desc: "Fix tap dripping & leakage",
        price: "₹99",
        time: "20–30 mins",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        id: "p1-2",
        name: "Tap accessory installation",
        desc: "Fix water leakage in bathroom areas",
        price: "₹79",
        time: "30–45 mins",
        warranty: "30 Days",
      },
      {
        id: "p1-3",
        name: "Tap installation/replacement",
        desc: "Fix under-sink pipe leak",
        price: "₹99",
        time: "25–40 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "p2",
    icon: "🚰",
    title: "Installation Services",
    tagline: "Professional fittings done right",
    items: [
      {
        id: "p2-1",
        name: "Wash Basin Installation",
        desc: "Secure & neat installation",
        price: "₹499",
        time: "40–60 mins",
        warranty: "30 Days",
        tag: "Popular",
      },
      {
        id: "p2-2",
        name: "Tap Installation",
        desc: "Install new tap safely",
        price: "₹149",
        time: "20–30 mins",
        warranty: "30 Days",
      },
      {
        id: "p2-3",
        name: "Hand Shower Installation",
        desc: "Shower fitting & setup",
        price: "₹249",
        time: "25–40 mins",
        warranty: "30 Days",
      },
    ],
  },

  {
    id: "p3",
    icon: "🧰",
    title: "Blockage & Cleaning",
    tagline: "Clear blockage professionally",
    items: [
      {
        id: "p3-1",
        name: "Wash Basin Block Removal",
        desc: "Clear clogged basin",
        price: "₹199",
        time: "25–40 mins",
        warranty: "30 Days",
      },
      {
        id: "p3-2",
        name: "Bathroom Drain Block Removal",
        desc: "Fix clogged bathroom drain",
        price: "₹249",
        time: "30–45 mins",
        warranty: "30 Days",
      },
      {
        id: "p3-3",
        name: "Kitchen Drain Block Removal",
        desc: "Clear kitchen pipeline clog",
        price: "₹299",
        time: "30–50 mins",
        warranty: "30 Days",
        tag: "Trending",
      },
    ],
  },

  {
    id: "p4",
    icon: "🔧",
    title: "General Plumbing",
    tagline: "All other plumbing needs",
    items: [
      {
        id: "p4-1",
        name: "Pipe Repair",
        desc: "Fix broken or damaged pipes",
        price: "₹299",
        time: "30–45 mins",
        warranty: "30 Days",
      },
      {
        id: "p4-2",
        name: "Water Heater Installation",
        desc: "Install new water heater",
        price: "₹499",
        time: "40–60 mins",
        warranty: "30 Days",
      },
      {
        id: "p4-3",
        name: "Bathroom Renovation Plumbing",
        desc: "Complete bathroom plumbing setup",
        price: "₹799",
        time: "1–2 hrs",
        warranty: "30 Days",
      },
    ],
  },
];

/* =========================================================
   QUICK PROBLEMS
========================================================= */

const PROBLEMS = [
  {
    id: "tap",
    icon: "🚿",
    title: "Tap Problem",
    keywords: ["tap", "leakage", "tap installation"],
  },
  {
    id: "leakage",
    icon: "💧",
    title: "Water Leakage",
    keywords: ["leakage", "leak", "pipe"],
  },
  {
    id: "blockage",
    icon: "🧰",
    title: "Drain Blockage",
    keywords: ["block", "drain", "clog"],
  },
  {
    id: "basin",
    icon: "🚰",
    title: "Basin Problem",
    keywords: ["basin", "wash basin"],
  },
  {
    id: "shower",
    icon: "🚿",
    title: "Shower Problem",
    keywords: ["shower", "hand shower"],
  },
  {
    id: "installation",
    icon: "🔧",
    title: "Installation",
    keywords: ["installation", "install", "replacement"],
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

export default function Plumber() {
  const navigate = useNavigate();

  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  /* =======================================================
     SEARCH
  ======================================================= */

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

  /* =======================================================
     BOOK NOW → CART
  ======================================================= */

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

      service: "Plumber",
      category: section.title,
      subService: item.name,

      description: item.desc,
      duration: item.time,
      warranty: item.warranty,

      image: bannerPlumber,
      tag: item.tag || "",
    };

    addItem(cartItem);

    setTimeout(() => {
      navigate("/cart");
      setBookingId(null);
    }, 100);
  };

  /* =======================================================
     PROBLEM CLICK
  ======================================================= */

  const handleProblem = (problem) => {
    setSelectedProblem(problem.id);

    setSearch(problem.keywords[0]);

    setTimeout(() => {
      document
        .getElementById("plumber-services")
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
              Plumber Services
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
            src={bannerPlumber}
            alt="Plumber service"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

          <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col justify-center text-white">
            <span className="text-sm font-semibold text-sky-300">
              QuickSeva Plumbing Services
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold mt-1 max-w-xl">
              Plumbing problem?
              <br />
              We'll take care of it.
            </h2>

            <p className="text-sm text-white/90 mt-2 max-w-lg">
              Leakage repair, tap installation, drain blockage, basin,
              shower and complete plumbing services at your doorstep.
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
              placeholder="Search plumbing services or problems..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-11 pr-12 outline-none focus:ring-2 focus:ring-sky-400"
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
            <div className="mb-3">
              <h2 className="text-lg font-bold text-slate-900">
                What's wrong with your plumbing?
              </h2>

              <p className="text-sm text-slate-500">
                Select your problem and find the right service
              </p>
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
                    <div className="text-2xl">
                      {problem.icon}
                    </div>

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
                Not sure what plumbing service you need?
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
            <div className="mb-3">
              <h2 className="text-lg font-bold text-slate-900">
                Search results
              </h2>

              <p className="text-sm text-slate-500">
                {searchResults.length} service
                {searchResults.length === 1 ? "" : "s"} found
              </p>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white border rounded-2xl p-6 text-center">
                <div className="text-4xl">🔍</div>

                <h3 className="font-bold text-slate-900 mt-3">
                  No matching service found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try searching for tap, leakage, blockage, basin,
                  shower or installation.
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
                      {bookingId === item.id
                        ? "Adding..."
                        : "Book Now"}
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
          id="plumber-services"
          className="mt-8 scroll-mt-24"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              All Plumbing Services
            </h2>

            <p className="text-sm text-slate-500">
              Choose the service that matches your plumbing problem
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
                          {bookingId === item.id
                            ? "Adding..."
                            : "Book Now"}
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
                  Based on 800+ ratings
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

              {/* Reviews */}

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
                Reliable plumbing service at your doorstep
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
