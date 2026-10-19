import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import bannerWashing from "../../assets/washing-banner.jpg";
import onCallLogo from "../../assets/On-Call-Logo.jpeg";

import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

import "./Washing.css";

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

const REVIEWS = [
  {
    name: "Rakesh Kumar",
    city: "Hyderabad",
    rating: 5,
    review:
      "Very good washing machine service. Cleaning done perfectly and machine is working like new.",
    avatar:
      "https://randomuser.me/api/portraits/men/12.jpg",
    date: "3 days ago",
  },
  {
    name: "Priya Sharma",
    city: "Madhapur",
    rating: 5,
    review:
      "Technician was polite and professional. Issue resolved within 30 mins. Highly recommended!",
    avatar:
      "https://randomuser.me/api/portraits/women/52.jpg",
    date: "1 week ago",
  },
  {
    name: "Anil Reddy",
    city: "Kondapur",
    rating: 4,
    review:
      "Good service and reasonable pricing. Booking experience was smooth.",
    avatar:
      "https://randomuser.me/api/portraits/men/45.jpg",
    date: "2 weeks ago",
  },
];

const SERVICES = [
  {
    id: "popular",
    icon: "🔥",
    title: "Super Saving Offers",
    tagline: "Best value services for your washing machine",
    items: [
      {
        id: "wm-popular-1",
        name: "Full Deep Service (2 Machines)",
        desc: "Complete internal cleaning with high-pressure jet wash",
        desc1:
          "Drum deep clean • Filter cleaning • Bacteria removal",
        price: "₹999",
        tag: "Bestseller",
        time: "60 - 75 mins",
        warranty: "30 Days",
      },
      {
        id: "wm-popular-2",
        name: "Jet Cleaning Service (2 Machines)",
        desc:
          "Removes dirt, bad smell & improves performance",
        desc1:
          "Professional Jet Wash + Interior cleaning",
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
    items: [
      {
        id: "wm-service-1",
        name: "General Service",
        desc: "Basic maintenance for smooth washing",
        desc1:
          "External clean • Filter wash • Drum checkup",
        price: "₹399",
        tag: "Popular",
        time: "30 - 40 mins",
        warranty: "15 Days",
      },
      {
        id: "wm-service-2",
        name: "Full Deep Cleaning",
        desc: "Recommended every 6 months",
        desc1:
          "Internal cleaning • Bacteria removal",
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
    keywords: ["leakage", "leak", "water"],
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

const priceToNumber = (value) => {
  const number = Number(
    String(value).replace(/[₹,\s]/g, "")
  );

  return Number.isFinite(number) ? number : 0;
};

export default function Washing() {
  const navigate = useNavigate();

  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [bookingId, setBookingId] = useState(null);

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
    <div
      className="washing-page min-h-screen pb-28"
      style={{
        background: THEME.mist,
      }}
    >
      <header className="washing-header sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="washing-icon-button"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="flex-1 flex items-center gap-2.5">
            <div className="washing-logo-box">
              <img
                src={onCallLogo}
                alt="OnCall"
                className="washing-logo"
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#0D9488]">
                OnCall
              </p>

              <h1 className="text-sm sm:text-base font-extrabold text-[#0B1D36]">
                Washing Machine Services
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="washing-cart-button relative"
            aria-label="Open cart"
          >
            🛒

            {itemCount > 0 && (
              <span className="washing-cart-count">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">

        <section className="washing-hero mt-4">
          <img
            src={bannerWashing}
            alt="Washing machine service"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="washing-hero-overlay" />

          <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col justify-center text-white">

            <div className="flex items-center gap-2 mb-2">
              <span className="washing-hero-badge">
                🧺 OnCall Washing Machine Care
              </span>

              <span className="washing-live-dot">
                ●
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl leading-tight">
              Washing machine problem?
              <br />
              <span className="text-[#5EEAD4]">
                We'll take care of it.
              </span>
            </h2>

            <p className="text-sm text-white/85 mt-2 max-w-lg">
              Cleaning, repair, installation and maintenance
              services for your washing machine at your doorstep.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <a
                href="tel:7661045308"
                className="washing-hero-button washing-call-button"
              >
                📞 Call
              </a>

              <a
                href="https://wa.me/7661045308"
                target="_blank"
                rel="noreferrer"
                className="washing-hero-button washing-whatsapp-button"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="washing-search-wrapper">
            <span className="washing-search-icon">
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
              className="washing-search-input"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedProblem(null);
                }}
                className="washing-search-clear"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {!search && (
          <section className="mt-6">
            <div className="mb-3">
              <h2 className="text-lg font-extrabold text-[#0B1D36]">
                What's wrong with your washing machine?
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
                      washing-problem-card
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

        <section className="mt-6">
          <div className="washing-support-card">
            <div className="washing-support-glow" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-[#5EEAD4] text-sm font-bold">
                  Need help choosing?
                </p>

                <h3 className="text-lg font-extrabold mt-1">
                  Not sure what washing machine service you need?
                </h3>

                <p className="text-sm text-white/70 mt-1">
                  Talk to OnCall and we'll help you choose
                  the right service.
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href="tel:7661045308"
                  className="washing-support-button washing-support-call"
                >
                  Call
                </a>

                <a
                  href="https://wa.me/7661045308"
                  target="_blank"
                  rel="noreferrer"
                  className="washing-support-button washing-support-whatsapp"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

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
              <div className="washing-empty-card">
                <div className="text-4xl">
                  🔍
                </div>

                <h3 className="font-bold text-[#0B1D36] mt-3">
                  No matching service found
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Try searching for cleaning, repair,
                  installation, spinning, leakage or error code.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map(({ section, item }) => (
                  <div
                    key={`${section.id}-${item.id}`}
                    className="washing-search-result"
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

                      {item.desc1 && (
                        <p className="text-xs text-[#64748B] mt-1">
                          {item.desc1}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="washing-meta-blue">
                          ⏱ {item.time}
                        </span>

                        <span className="washing-meta-green">
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
                      onClick={() =>
                        handleBook(section, item)
                      }
                      className="washing-book-button shrink-0"
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

        <section
          id="washing-services"
          className="mt-8 scroll-mt-24"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="section-accent-line" />

              <h2 className="text-xl font-extrabold text-[#0B1D36]">
                All Washing Machine Services
              </h2>
            </div>

            <p className="text-sm text-[#64748B] mt-1">
              Choose the service that matches your washing machine
              problem
            </p>
          </div>

          <div className="space-y-7">
            {SERVICES.map((section) => (
              <section
                key={section.id}
                className="washing-service-section"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="washing-service-icon">
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

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className="washing-service-card"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-extrabold text-[#0B1D36]">
                              {item.name}
                            </h4>

                            {item.tag && (
                              <span className="washing-tag">
                                ⭐ {item.tag}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-[#64748B] mt-1">
                            {item.desc}
                          </p>

                          {item.desc1 && (
                            <p className="text-xs text-[#64748B] mt-1">
                              {item.desc1}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="washing-meta-blue">
                              ⏱ {item.time}
                            </span>

                            <span className="washing-meta-green">
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
                          className="washing-book-button w-full sm:w-auto"
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

        <section className="mt-10">
          <div className="washing-reviews-card">
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

              <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {REVIEWS.map((review, index) => (
                  <article
                    key={index}
                    className="washing-review-item"
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

        <section className="mt-6">
          <div className="washing-trust-card">
            <div className="text-center mb-5">
              <div className="flex justify-center items-center gap-2">
                <span className="section-accent-line" />

                <h2 className="text-xl font-extrabold text-[#0B1D36]">
                  Why Choose OnCall?
                </h2>

                <span className="section-accent-line" />
              </div>

              <p className="text-sm text-[#64748B] mt-1">
                Reliable washing machine service at your doorstep
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="washing-trust-item">
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

              <div className="washing-trust-item">
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

              <div className="washing-trust-item">
                <div className="trust-icon">
                  ⚡
                </div>

                <p className="font-extrabold text-sm text-[#0B1D36] mt-2">
                  Quick Response
                </p>

                <p className="text-xs text-[#64748B] mt-1">
                  Fast doorstep assistance
                </p>
              </div>

              <div className="washing-trust-item">
                <div className="trust-icon">
                  🔧
                </div>

                <p className="font-extrabold text-sm text-[#0B1D36] mt-2">
                  Quality Service
                </p>

                <p className="text-xs text-[#64748B] mt-1">
                  Professional workmanship
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