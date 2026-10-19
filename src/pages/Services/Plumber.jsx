import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import bannerPlumber from "../../assets/plumber-banner.jpg";
import onCallLogo from "../../assets/On-Call-Logo.jpeg";

import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

import "./Plumber.css";

/* =========================================================
   THEME
========================================================= */

const THEME = {
  navy: "#0B1D36",
  teal: "#0D9488",
  sky: "#0EA5E9",
  mist: "#F1F5F9",
  cloud: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  border: "#DCE5EC",
};

/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

const REVIEWS = [
  {
    name: "Ramesh",
    city: "Hyderabad",
    rating: 5,
    review:
      "Quick leak fix and professional work. Highly recommended!",
    avatar:
      "https://randomuser.me/api/portraits/men/28.jpg",
    date: "2 days ago",
  },
  {
    name: "Sana",
    city: "Madhapur",
    rating: 5,
    review:
      "Affordable pricing and very neat work.",
    avatar:
      "https://randomuser.me/api/portraits/women/36.jpg",
    date: "1 week ago",
  },
  {
    name: "Akash",
    city: "Kondapur",
    rating: 4,
    review:
      "Good plumber and fast response.",
    avatar:
      "https://randomuser.me/api/portraits/men/45.jpg",
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
  const number = Number(
    String(value).replace(/[₹,\s]/g, "")
  );

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
     ACTIVE PROBLEM CARD
     1 → 2 → 3 → 4 → 5 → 6 → 1
  ======================================================= */

  const [activeProblemIndex, setActiveProblemIndex] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProblemIndex((prev) => {
        return (prev + 1) % PROBLEMS.length;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

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
    <div
      className="plumber-page min-h-screen pb-28"
      style={{
        background: THEME.mist,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="plumber-header sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="plumber-icon-button"
            aria-label="Go back"
          >
            ←
          </button>

          {/* LOGO + TITLE */}

          <div className="flex-1 flex items-center gap-2.5">

            <div className="plumber-logo-box">
              <img
                src={onCallLogo}
                alt="OnCall"
                className="plumber-logo"
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#0D9488]">
                OnCall
              </p>

              <h1 className="text-sm sm:text-base font-extrabold text-[#0B1D36]">
                Plumber Services
              </h1>
            </div>

          </div>

          {/* CART */}

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="plumber-cart-button relative"
            aria-label="Open cart"
          >
            🛒

            {itemCount > 0 && (
              <span className="plumber-cart-count">
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

        <section className="plumber-hero mt-4">

          <img
            src={bannerPlumber}
            alt="Plumber service"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="plumber-hero-overlay" />

          <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col justify-center text-white">

            <div className="flex items-center gap-2 mb-2">

              <span className="plumber-hero-badge">
                🔧 OnCall Plumbing
              </span>

              <span className="plumber-live-dot">
                ●
              </span>

            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl leading-tight">
              Plumbing problem?
              <br />
              <span className="text-[#5EEAD4]">
                We'll take care of it.
              </span>
            </h2>

            <p className="text-sm text-white/85 mt-2 max-w-lg">
              Leakage repair, tap installation, drain blockage,
              basin, shower and complete plumbing services at
              your doorstep.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">

              <a
                href="tel:7661045308"
                className="plumber-hero-button plumber-call-button"
              >
                📞 Call
              </a>

              <a
                href="https://wa.me/7661045308"
                target="_blank"
                rel="noreferrer"
                className="plumber-hero-button plumber-whatsapp-button"
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

          <div className="plumber-search-wrapper">

            <span className="plumber-search-icon">
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
              className="plumber-search-input"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedProblem(null);
                }}
                className="plumber-search-clear"
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

              <h2 className="text-lg font-extrabold text-[#0B1D36]">
                What's wrong with your plumbing?
              </h2>

              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Select your problem and find the right service
              </p>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              {PROBLEMS.map((problem, index) => {

                const flowActive =
                  index === activeProblemIndex;

                const selected =
                  selectedProblem === problem.id;

                return (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => handleProblem(problem)}
                    className={`
                      plumber-problem-card
                      ${
                        flowActive
                          ? "problem-flow-active"
                          : ""
                      }
                      ${
                        selected
                          ? "problem-selected"
                          : ""
                      }
                    `}
                  >

                    {flowActive && (
                      <span
                        key={activeProblemIndex}
                        className="problem-flow-background"
                      />
                    )}

                    <span className="problem-card-content">

                      <span
                        className={`
                          problem-icon
                          ${
                            flowActive
                              ? "problem-icon-active"
                              : ""
                          }
                        `}
                      >
                        {problem.icon}
                      </span>

                      <span
                        className={`
                          block
                          font-bold
                          text-sm
                          mt-3
                          ${
                            flowActive
                              ? "text-white"
                              : "text-[#0B1D36]"
                          }
                        `}
                      >
                        {problem.title}
                      </span>

                      <span
                        className={`
                          block
                          text-[11px]
                          mt-1
                          font-medium
                          ${
                            flowActive
                              ? "text-white/80"
                              : "text-[#64748B]"
                          }
                        `}
                      >
                        Find service →
                      </span>

                    </span>

                  </button>
                );
              })}

            </div>

          </section>
        )}

        {/* =================================================
            SUPPORT
        ================================================= */}

        <section className="mt-6">

          <div className="plumber-support-card">

            <div className="plumber-support-glow" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">

              <div className="flex-1">

                <p className="text-[#5EEAD4] text-sm font-bold">
                  Need help choosing?
                </p>

                <h3 className="text-lg font-extrabold mt-1">
                  Not sure what plumbing service you need?
                </h3>

                <p className="text-sm text-white/70 mt-1">
                  Talk to OnCall and we'll help you choose
                  the right service.
                </p>

              </div>

              <div className="flex gap-2">

                <a
                  href="tel:7661045308"
                  className="plumber-support-button plumber-support-call"
                >
                  Call
                </a>

                <a
                  href="https://wa.me/7661045308"
                  target="_blank"
                  rel="noreferrer"
                  className="plumber-support-button plumber-support-whatsapp"
                >
                  WhatsApp
                </a>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        {search && (
          <section className="mt-6">

            <div className="mb-3">

              <h2 className="text-lg font-extrabold text-[#0B1D36]">
                Search results
              </h2>

              <p className="text-sm text-[#64748B]">
                {searchResults.length} service
                {searchResults.length === 1 ? "" : "s"} found
              </p>

            </div>

            {searchResults.length === 0 ? (

              <div className="plumber-empty-card">

                <div className="text-4xl">
                  🔍
                </div>

                <h3 className="font-bold text-[#0B1D36] mt-3">
                  No matching service found
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Try searching for tap, leakage, blockage,
                  basin, shower or installation.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {searchResults.map(({ section, item }) => (

                  <div
                    key={`${section.id}-${item.id}`}
                    className="plumber-search-result"
                  >

                    <div>

                      <p className="text-xs text-[#0D9488] font-bold">
                        {section.title}
                      </p>

                      <h3 className="font-extrabold text-[#0B1D36] mt-1">
                        {item.name}
                      </h3>

                      <p className="text-sm text-[#64748B] mt-1">
                        {item.desc}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">

                        <span className="plumber-meta-blue">
                          ⏱ {item.time}
                        </span>

                        <span className="plumber-meta-green">
                          🛡 {item.warranty}
                        </span>

                      </div>

                      <p className="text-lg font-extrabold text-[#0D9488] mt-2">
                        {item.price}
                      </p>

                    </div>

                    <button
                      type="button"
                      disabled={bookingId === item.id}
                      onClick={() => handleBook(section, item)}
                      className="plumber-book-button shrink-0"
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

            <div className="flex items-center gap-2">

              <span className="section-accent-line" />

              <h2 className="text-xl font-extrabold text-[#0B1D36]">
                All Plumbing Services
              </h2>

            </div>

            <p className="text-sm text-[#64748B] mt-1">
              Choose the service that matches your plumbing
              problem
            </p>

          </div>

          <div className="space-y-7">

            {SERVICES.map((section) => (

              <section
                key={section.id}
                className="plumber-service-section"
              >

                {/* SECTION HEADING */}

                <div className="flex items-center gap-3 mb-3">

                  <div className="plumber-service-icon">
                    {section.icon}
                  </div>

                  <div>

                    <h3 className="font-extrabold text-[#0B1D36]">
                      {section.title}
                    </h3>

                    <p className="text-sm text-[#64748B]">
                      {section.tagline}
                    </p>

                  </div>

                </div>

                {/* SERVICE ITEMS */}

                <div className="space-y-3">

                  {section.items.map((item) => (

                    <article
                      key={item.id}
                      className="plumber-service-card"
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        <div className="flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h4 className="font-extrabold text-[#0B1D36]">
                              {item.name}
                            </h4>

                            {item.tag && (
                              <span className="plumber-tag">
                                ⭐ {item.tag}
                              </span>
                            )}

                          </div>

                          <p className="text-sm text-[#64748B] mt-1">
                            {item.desc}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">

                            <span className="plumber-meta-blue">
                              ⏱ {item.time}
                            </span>

                            <span className="plumber-meta-green">
                              🛡 {item.warranty}
                            </span>

                          </div>

                          <p className="text-lg font-extrabold text-[#0D9488] mt-3">
                            {item.price}
                          </p>

                        </div>

                        <button
                          type="button"
                          disabled={bookingId === item.id}
                          onClick={() =>
                            handleBook(section, item)
                          }
                          className="plumber-book-button w-full sm:w-auto"
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

          <div className="plumber-reviews-card">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <span className="section-accent-line" />

                <h2 className="text-xl font-extrabold text-[#0B1D36]">
                  What Customers Say
                </h2>

              </div>

              <p className="text-sm text-[#64748B] mt-1">
                Real feedback from OnCall customers
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-6">

              {/* RATING */}

              <div className="sm:w-44 shrink-0 text-center sm:text-left">

                <p className="text-4xl font-extrabold text-[#0B1D36]">
                  4.9 ⭐
                </p>

                <p className="text-xs text-[#64748B] mt-1">
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

                      <div className="flex-1 bg-[#E2E8F0] rounded-full h-2 overflow-hidden">

                        <div
                          className="rating-bar h-2 rounded-full"
                          style={{
                            width: `${star * 18}%`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              {/* REVIEWS */}

              <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar pb-2">

                {REVIEWS.map((review, index) => (

                  <article
                    key={index}
                    className="plumber-review-item"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#CCFBF1]"
                      />

                      <div>

                        <p className="font-bold text-sm text-[#0B1D36]">
                          {review.name}
                        </p>

                        <p className="text-xs text-[#64748B]">
                          {review.city}
                        </p>

                      </div>

                    </div>

                    <p className="text-yellow-500 text-sm mt-3">
                      ⭐ {review.rating}
                    </p>

                    <p className="text-sm text-[#334155] mt-2">
                      {review.review}
                    </p>

                    <p className="text-xs text-[#94A3B8] mt-3">
                      {review.date}
                    </p>

                    <span className="inline-flex mt-3 bg-[#ECFDF5] text-[#047857] text-xs px-2 py-1 rounded-lg font-bold">
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

          <div className="plumber-trust-card">

            <div className="text-center mb-5">

              <div className="flex justify-center items-center gap-2">

                <span className="section-accent-line" />

                <h2 className="text-xl font-extrabold text-[#0B1D36]">
                  Why Choose OnCall?
                </h2>

                <span className="section-accent-line" />

              </div>

              <p className="text-sm text-[#64748B] mt-1">
                Reliable plumbing service at your doorstep
              </p>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

              {/* TRUST 1 */}

              <div className="plumber-trust-item">

                <div className="trust-icon">
                  🛡️
                </div>

                <p className="font-extrabold text-sm text-[#0B1D36] mt-2">
                  Verified Technicians
                </p>

                <p className="text-xs text-[#64748B] mt-1">
                  Trained service professionals
                </p>

              </div>

              {/* TRUST 2 */}

              <div className="plumber-trust-item">

                <div className="trust-icon">
                  💰
                </div>

                <p className="font-extrabold text-sm text-[#0B1D36] mt-2">
                  Clear Pricing
                </p>

                <p className="text-xs text-[#64748B] mt-1">
                  Transparent service prices
                </p>

              </div>

              {/* TRUST 3 */}

              <div className="plumber-trust-item">

                <div className="trust-icon">
                  ⚡
                </div>

                <p className="font-extrabold text-sm text-[#0B1D36] mt-2">
                  Quick Response
                </p>

                <p className="text-xs text-[#64748B] mt-1">
                  Fast booking confirmation
                </p>

              </div>

              {/* TRUST 4 */}

              <div className="plumber-trust-item">

                <div className="trust-icon">
                  ⭐
                </div>

                <p className="font-extrabold text-sm text-[#0B1D36] mt-2">
                  Trusted Service
                </p>

                <p className="text-xs text-[#64748B] mt-1">
                  Customer-focused support
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* CART BAR */}

      <ViewCartBar />

    </div>
  );
}