import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerWashing from "../../assets/washing-banner.jpg";
import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

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

/* =========================================================
   WASHING MACHINE SERVICES
========================================================= */

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
        id: "wm-popular-1",
        name: "Full Deep Service (2 Machines)",
        desc: "Complete internal cleaning with high-pressure jet wash",
        desc1: "Drum deep clean • Filter cleaning • Bacteria removal",
        price: "₹999",
        tag: "Bestseller",
        time: "60 - 75 mins",
        warranty: "30 Days",
      },
      {
        id: "wm-popular-2",
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
        id: "wm-service-1",
        name: "General Service",
        desc: "Basic maintenance for smooth washing",
        desc1: "External clean • Filter wash • Drum checkup",
        price: "₹399",
        tag: "Popular",
        time: "30 - 40 mins",
        warranty: "15 Days",
      },
      {
        id: "wm-service-2",
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
        id: "wm-repair-1",
        name: "Machine Not Spinning",
        desc: "Inspection & repair",
        price: "₹249",
        tag: "Most Fixed",
        time: "30 - 45 mins",
        warranty: "15 Days",
      },
      {
        id: "wm-repair-2",
        name: "Power / Start Problem",
        desc: "Fix startup & shutdown issues",
        price: "₹299",
        time: "30 - 50 mins",
        warranty: "30 Days",
      },
      {
        id: "wm-repair-3",
        name: "Water Leakage Fix",
        desc: "Fix leakage from pipe / drum",
        price: "₹349",
        time: "30 - 60 mins",
        warranty: "30 Days",
      },
      {
        id: "wm-repair-4",
        name: "Noise / Vibration Issue",
        desc: "Fix shaking or loud noise",
        price: "₹299",
        time: "25 - 40 mins",
        warranty: "20 Days",
      },
      {
        id: "wm-repair-5",
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
        id: "wm-install-1",
        name: "Installation",
        desc: "Proper setup + balancing + demo",
        price: "₹799",
        time: "45 - 60 mins",
        warranty: "30 Days",
      },
      {
        id: "wm-install-2",
        name: "Uninstallation",
        desc: "Safe removal",
        price: "₹499",
        time: "20 - 30 mins",
        warranty: "15 Days",
      },
    ],
  },
];

/* =========================================================
   QUICK PROBLEMS
========================================================= */

const PROBLEMS = [
  {
    id: "not-spinning",
    icon: "🔄",
    title: "Not Spinning",
    keywords: ["spinning", "spin"],
  },
  {
    id: "power",
    icon: "⚡",
    title: "Power Problem",
    keywords: ["power", "start", "shutdown"],
  },
  {
    id: "leakage",
    icon: "💧",
    title: "Water Leakage",
    keywords: ["leakage", "water", "leak"],
  },
  {
    id: "noise",
    icon: "🔊",
    title: "Noise / Vibration",
    keywords: ["noise", "vibration", "shaking"],
  },
  {
    id: "error",
    icon: "⚠️",
    title: "Error Code",
    keywords: ["error", "code"],
  },
  {
    id: "cleaning",
    icon: "🧼",
    title: "Cleaning / Service",
    keywords: ["cleaning", "service", "maintenance"],
  },
];

/* =========================================================
   HELPER
========================================================= */

const priceToNumber = (value) => {
  const number = Number(String(value).replace(/[₹,\s]/g, ""));
  return Number.isFinite(number) ? number : 0;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Washing() {
  const navigate = useNavigate();

  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  /* =======================================================
     SEARCH RESULTS
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
          item.desc1,
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

      service: "Washing Machine",
      category: section.title,
      subService: item.name,

      description: item.desc,
      description2: item.desc1 || "",
      duration: item.time,
      warranty: item.warranty,

      image: bannerWashing,
      tag: item.tag || "",
    };

    addItem(cartItem);

    setTimeout(() => {
      navigate("/cart");
      setBookingId(null);
    }, 100);
  };

  /* =======================================================
     PROBLEM CARD
  ======================================================= */

  const handleProblem = (problem) => {
    setSelectedProblem(problem.id);

    setSearch(problem.keywords[0]);

    setTimeout(() => {
      document
        .getElementById("washing-services")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

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
            <p className="text-xs text-slate-500">
              QuickSeva
            </p>

            <h1 className="font-bold text-slate-900">
              Washing Machine Services
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
            src={bannerWashing}
            alt="Washing machine service"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

          <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col justify-center text-white">
            <span className="text-sm font-semibold text-sky-300">
              QuickSeva Washing Machine Services
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold mt-1 max-w-xl">
              Washing machine problem?
              <br />
              We'll take care of it.
            </h2>

            <p className="text-sm text-white/90 mt-2 max-w-lg">
              Cleaning, maintenance, repairs, installation and
              uninstallation at your doorstep.
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
              placeholder="Search washing machine services or problems..."
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
                What's wrong with your washing machine?
              </h2>

              <p className="text-sm text-slate-500">
                Select your problem and find the right service
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROBLEMS.map((problem) => {
                const active =
                  selectedProblem === problem.id;

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
                Not sure what's wrong with your machine?
              </h3>

              <p className="text-sm text-white/70 mt-1">
                Talk to QuickSeva and we'll help you choose
                the right service.
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
                <div className="text-4xl">
                  🔍
                </div>

                <h3 className="font-bold text-slate-900 mt-3">
                  No matching service found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try searching for cleaning, spinning,
                  leakage, power, noise or installation.
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

                      {item.desc1 && (
                        <p className="text-xs text-slate-400 mt-1">
                          {item.desc1}
                        </p>
                      )}

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
                      onClick={() =>
                        handleBook(section, item)
                      }
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
          id="washing-services"
          className="mt-8 scroll-mt-24"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              All Washing Machine Services
            </h2>

            <p className="text-sm text-slate-500">
              Choose the service that matches your machine
              problem
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

                          {item.desc1 && (
                            <p className="text-sm text-slate-400 mt-1">
                              {item.desc1}
                            </p>
                          )}

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
                          onClick={() =>
                            handleBook(section, item)
                          }
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
                Reliable washing machine service at your doorstep
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl">
                  🛡️
                </div>

                <p className="font-bold text-sm text-slate-900 mt-2">
                  Verified Technicians
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Trained service professionals
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl">
                  💰
                </div>

                <p className="font-bold text-sm text-slate-900 mt-2">
                  Clear Pricing
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Transparent service prices
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl">
                  ⚡
                </div>

                <p className="font-bold text-sm text-slate-900 mt-2">
                  Quick Response
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Fast booking confirmation
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl">
                  ⭐
                </div>

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
