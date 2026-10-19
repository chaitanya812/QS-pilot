import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import bannerAC from "../../assets/ac-banner.jpg";
import onCallLogo from "../../assets/On-Call-Logo.jpeg";

import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

import "./AcAppliances.css";

/* =========================================================
   PROJECT THEME
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
   SUPPORT
========================================================= */

const SUPPORT_PHONE = "7661045308";

const whatsappMessage = encodeURIComponent(
  "Hi OnCall, I need help with AC & Appliances service."
);

/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

const REVIEWS = [
  {
    name: "Prakash Reddy",
    city: "Hyderabad",
    rating: 5,
    review:
      "Very professional service. Technician came on time and solved cooling issue quickly.",
    avatar:
      "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2 days ago",
  },

  {
    name: "Sneha Kapoor",
    city: "Kondapur",
    rating: 5,
    review:
      "Quick response and very neat work. Pricing is also reasonable. My AC is cooling perfectly now.",
    avatar:
      "https://randomuser.me/api/portraits/women/44.jpg",
    date: "1 week ago",
  },

  {
    name: "Amit Verma",
    city: "Madhapur",
    rating: 4,
    review:
      "Good technician and polite behaviour. Explained clearly what was wrong and fixed it.",
    avatar:
      "https://randomuser.me/api/portraits/men/66.jpg",
    date: "3 weeks ago",
  },
];

/* =========================================================
   AC SERVICES
========================================================= */

const SERVICES = [
  {
    id: "ac1",
    icon: "🔥",
    title: "Special Offers",
    tagline: "Save more on multiple AC services",

    items: [
      {
        id: "ac1-1",
        name: "Split AC installation - 2 ACs",
        desc:
          "Professional installation with alignment and safety check",
        price: 2400,
        tag: "Bestseller",
        time: "60–90 mins",
        warranty: "90 Days Service Warranty",
      },

      {
        id: "ac1-2",
        name: "Foam-jet service - 2 ACs",
        desc:
          "Deep cleaning for better cooling and air quality",
        price: 990,
        tag: "Popular",
        time: "45–60 mins",
        warranty: "30 Days Warranty",
      },
    ],
  },

  {
    id: "ac2",
    icon: "❄️",
    title: "AC Service",
    tagline:
      "Keep your AC clean and cooling efficiently",

    items: [
      {
        id: "ac2-1",
        name: "Foam-jet service",
        desc:
          "Deep foam cleaning for better cooling and hygiene",
        price: 549,
        tag: "Bestseller",
        time: "40–60 mins",
        warranty: "30 Days Warranty",
      },

      {
        id: "ac2-2",
        name: "General AC service",
        desc:
          "Basic cleaning and inspection",
        price: 350,
        tag: "Popular",
        time: "30–45 mins",
        warranty: "15 Days Warranty",
      },

      {
        id: "ac2-3",
        name: "Indoor Coil Deep Cleaning",
        desc:
          "Removes dust and improves airflow",
        price: 699,
        time: "40–60 mins",
        warranty: "30 Days Warranty",
      },

      {
        id: "ac2-4",
        name: "Outdoor Unit Service",
        desc:
          "Outdoor fan and condenser cleaning",
        price: 499,
        time: "30–45 mins",
        warranty: "30 Days Warranty",
      },
    ],
  },

  {
    id: "ac3",
    icon: "🛠️",
    title: "AC Repair & Gas",
    tagline:
      "For cooling, power, leakage and other problems",

    items: [
      {
        id: "ac3-1",
        name: "Low / No Cooling Repair",
        desc:
          "Complete inspection and repair",
        price: 299,
        time: "30–50 mins",
        warranty: "30 Days Warranty",
      },

      {
        id: "ac3-2",
        name: "AC Power Issue Repair",
        desc:
          "Power, startup and sudden shutdown issues",
        price: 259,
        time: "25–40 mins",
        warranty: "30 Days Warranty",
      },

      {
        id: "ac3-3",
        name: "Water Leakage Repair",
        desc:
          "Indoor or outdoor water leakage problem",
        price: 459,
        time: "30–60 mins",
        warranty: "30 Days Warranty",
      },

      {
        id: "ac3-4",
        name: "Gas Refill + Cooling Check",
        desc:
          "Gas refill with pressure and leakage test",
        price: 2500,
        tag: "Bestseller",
        time: "60–90 mins",
        warranty: "90 Days Cooling Warranty",
      },

      {
        id: "ac3-5",
        name: "PCB / Sensor Repair",
        desc:
          "Motherboard and sensor problem inspection",
        price: 799,
        time: "40–70 mins",
        warranty: "60 Days Warranty",
      },

      {
        id: "ac3-6",
        name: "Noise / Smell Fix",
        desc:
          "Fix vibration, smell and unusual sound",
        price: 499,
        time: "30–50 mins",
        warranty: "30 Days Warranty",
      },
    ],
  },

  {
    id: "ac4",
    icon: "⚙️",
    title: "Installation & Uninstallation",
    tagline:
      "Safe installation and removal",

    items: [
      {
        id: "ac4-1",
        name: "Split AC Installation",
        desc:
          "Secure installation with demo",
        price: 1500,
        tag: "Popular",
        time: "60–90 mins",
        warranty: "90 Days Warranty",
      },

      {
        id: "ac4-2",
        name: "Window AC Installation",
        desc:
          "Strong and safe fitting",
        price: 799,
        time: "40–60 mins",
        warranty: "30 Days Warranty",
      },

      {
        id: "ac4-3",
        name: "Split AC Uninstallation",
        desc:
          "Safe AC removal",
        price: 850,
        time: "30–45 mins",
        warranty: "30 Days Warranty",
      },

      {
        id: "ac4-4",
        name: "Window AC Uninstallation",
        desc:
          "Quick and safe removal",
        price: 699,
        time: "25–40 mins",
        warranty: "30 Days Warranty",
      },
    ],
  },
];

/* =========================================================
   AC PROBLEMS
========================================================= */

const PROBLEMS = [
  {
    id: "cooling",
    icon: "🥵",
    title: "AC not cooling",
    search: "cooling",
  },

  {
    id: "leak",
    icon: "💧",
    title: "Water leaking",
    search: "leak",
  },

  {
    id: "power",
    icon: "⚡",
    title: "AC not turning on",
    search: "power",
  },

  {
    id: "noise",
    icon: "🔊",
    title: "AC making noise",
    search: "noise",
  },

  {
    id: "service",
    icon: "🧽",
    title: "Need servicing",
    search: "service",
  },

  {
    id: "install",
    icon: "🔧",
    title: "Need installation",
    search: "installation",
  },
];

/* =========================================================
   HELPER
========================================================= */

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

/* =========================================================
   COMPONENT
========================================================= */

export default function AcAppliances() {
  const navigate = useNavigate();

  const { addItem } = useCart();

  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] =
    useState("");

  const [bookingId, setBookingId] =
    useState(null);

  const [activeProblemIndex, setActiveProblemIndex] =
    useState(0);

  /* =======================================================
     AUTOMATIC PROBLEM CARD FLOW

     1 → 2 → 3 → 4 → 5 → 6 → 1
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProblemIndex((previous) => {
        return (
          (previous + 1) %
          PROBLEMS.length
        );
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  /* =======================================================
     FILTER SERVICES
  ======================================================= */

  const filteredSections = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return SERVICES;
    }

    return SERVICES
      .map((section) => ({
        ...section,

        items: section.items.filter(
          (item) => {
            const text = `
              ${section.title}
              ${section.tagline}
              ${item.name}
              ${item.desc}
              ${item.tag || ""}
            `.toLowerCase();

            return text.includes(query);
          }
        ),
      }))
      .filter(
        (section) =>
          section.items.length > 0
      );
  }, [search]);

  /* =======================================================
     PROBLEM CLICK
  ======================================================= */

  const handleProblem = (problem) => {
    setSelectedProblem(problem.id);

    setSearch(problem.search);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     BOOK NOW
  ======================================================= */

  const handleBook = (section, item) => {
    if (bookingId) {
      return;
    }

    setBookingId(item.id);

    const cartItem = {
      id: item.id,
      key: item.id,

      label: item.name,
      name: item.name,

      price: Number(item.price),

      qty: 1,

      service: "AC & Appliances",

      category: section.title,

      subService: item.name,

      description: item.desc,

      duration: item.time,

      warranty: item.warranty,
    };

    addItem(cartItem);

    setTimeout(() => {
      navigate("/cart");
      setBookingId(null);
    }, 100);
  };

  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  const clearSearch = () => {
    setSearch("");
    setSelectedProblem("");
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="ac-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="ac-header">

        <div className="ac-header-inner">

          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="ac-header-button"
            aria-label="Go back"
          >
            ←
          </button>

          {/* LOGO */}

          <div className="ac-header-brand">

            <div className="ac-logo-box">

              <img
                src={onCallLogo}
                alt="OnCall Services"
                className="ac-logo"
              />

            </div>

            <div>

              <p className="ac-brand-small">
                OnCall
              </p>

              <h1 className="ac-brand-title">
                AC & Appliances
              </h1>

            </div>

          </div>

          {/* CART */}

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="ac-header-button ac-cart-button"
            aria-label="Open cart"
          >
            🛒
          </button>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="ac-container">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="ac-hero">

          <img
            src={bannerAC}
            alt="AC service technician"
            className="ac-hero-image"
          />

          <div className="ac-hero-overlay" />

          <div className="ac-hero-content">

            <span className="ac-hero-badge">
              ✓ Verified Professionals
            </span>

            <h2>
              AC problem?
              <br />

              <span>
                We'll take care of it.
              </span>
            </h2>

            <p>
              Choose your problem or select a
              service below.
            </p>

            <div className="ac-hero-actions">

              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="ac-hero-call"
              >
                📞 Call
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="ac-hero-whatsapp"
              >
                💬 WhatsApp
              </a>

            </div>

          </div>

        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="ac-search-section">

          <div className="ac-search">

            <span className="ac-search-icon">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedProblem("");
              }}
              placeholder="Search AC problem or service..."
            />

            {search && (

              <button
                type="button"
                onClick={clearSearch}
                className="ac-search-clear"
              >
                ×
              </button>

            )}

          </div>

        </section>

        {/* =================================================
            PROBLEMS
        ================================================= */}

        {!search && (

          <section className="ac-section">

            <div className="ac-section-heading">

              <h2>
                What's wrong with your AC?
              </h2>

              <p>
                Pick your problem — we'll show
                the right service.
              </p>

            </div>

            <div className="ac-problem-grid">

              {PROBLEMS.map(
                (problem, index) => {

                  const isActive =
                    index === activeProblemIndex;

                  const isSelected =
                    selectedProblem ===
                    problem.id;

                  return (

                    <button
                      key={problem.id}
                      type="button"
                      onClick={() =>
                        handleProblem(problem)
                      }
                      className={`
                        ac-problem-card
                        ${
                          isActive
                            ? "ac-problem-active"
                            : ""
                        }
                        ${
                          isSelected
                            ? "ac-problem-selected"
                            : ""
                        }
                      `}
                    >

                      {isActive && (

                        <span
                          key={activeProblemIndex}
                          className="ac-problem-flow"
                        />

                      )}

                      <span className="ac-problem-content">

                        <span
                          className={`
                            ac-problem-icon
                            ${
                              isActive
                                ? "ac-problem-icon-active"
                                : ""
                            }
                          `}
                        >
                          {problem.icon}
                        </span>

                        <span
                          className={`
                            ac-problem-title
                            ${
                              isActive
                                ? "active-text"
                                : ""
                            }
                          `}
                        >
                          {problem.title}
                        </span>

                        <span
                          className={`
                            ac-problem-link
                            ${
                              isActive
                                ? "active-text-soft"
                                : ""
                            }
                          `}
                        >
                          Find service →
                        </span>

                      </span>

                    </button>

                  );
                }
              )}

            </div>

          </section>

        )}

        {/* =================================================
            SUPPORT
        ================================================= */}

        <section className="ac-section">

          <div className="ac-support-card">

            <div className="ac-support-top-line" />

            <div className="ac-support-content">

              <div className="ac-support-icon">
                💬
              </div>

              <div className="ac-support-text">

                <h3>
                  Not sure what service you need?
                </h3>

                <p>
                  Talk to OnCall support and
                  explain your problem.
                </p>

              </div>

              <div className="ac-support-actions">

                <a
                  href={`tel:${SUPPORT_PHONE}`}
                  className="ac-support-call"
                >
                  📞 Call
                </a>

                <a
                  href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ac-support-whatsapp"
                >
                  WhatsApp
                </a>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SEARCH RESULT HEADER
        ================================================= */}

        {search && (

          <section className="ac-search-result-heading">

            <div>

              <h2>
                Services for "{search}"
              </h2>

              <p>
                Choose the service that matches
                your problem.
              </p>

            </div>

            <button
              type="button"
              onClick={clearSearch}
            >
              Clear
            </button>

          </section>

        )}

        {/* =================================================
            SERVICES
        ================================================= */}

        <section
          id="ac-services"
          className="ac-section ac-services-section"
        >

          {!search && (

            <div className="ac-section-heading">

              <div className="ac-heading-with-line">

                <span />

                <h2>
                  All AC Services
                </h2>

              </div>

              <p>
                Transparent pricing. Verified
                technicians.
              </p>

            </div>

          )}

          {filteredSections.length === 0 ? (

            <div className="ac-empty">

              <div className="ac-empty-icon">
                🔍
              </div>

              <h3>
                We couldn't find that service
              </h3>

              <p>
                Try another search or call us
                for help.
              </p>

              <button
                type="button"
                onClick={clearSearch}
              >
                Show all services
              </button>

            </div>

          ) : (

            <div className="ac-service-groups">

              {filteredSections.map(
                (section) => (

                  <section
                    key={section.id}
                    className="ac-service-group"
                  >

                    {/* =================================================
                        CATEGORY HEADER
                    ================================================= */}

                    <div className="ac-category-heading">

                      <div className="ac-category-icon">
                        {section.icon}
                      </div>

                      <div>

                        <h3>
                          {section.title}
                        </h3>

                        <p>
                          {section.tagline}
                        </p>

                      </div>

                    </div>

                    {/* =================================================
                        SERVICE CARDS
                    ================================================= */}

                    <div className="ac-service-list">

                      {section.items.map(
                        (item) => (

                          <article
                            key={item.id}
                            className="ac-service-card"
                          >

                            <div className="ac-service-content">

                              {/* SERVICE INFO */}

                              <div className="ac-service-info">

                                <div className="ac-service-title-row">

                                  <h4>
                                    {item.name}
                                  </h4>

                                  {item.tag && (

                                    <span className="ac-service-tag">
                                      ⭐ {item.tag}
                                    </span>

                                  )}

                                </div>

                                <p className="ac-service-description">
                                  {item.desc}
                                </p>

                                {/* META */}

                                <div className="ac-service-meta">

                                  <span>
                                    ⏱ {item.time}
                                  </span>

                                  <span>
                                    🛡 {item.warranty}
                                  </span>

                                </div>

                              </div>

                              {/* PRICE + BUTTON */}

                              <div className="ac-service-bottom">

                                <div>

                                  <p className="ac-price-label">
                                    Starting from
                                  </p>

                                  <p className="ac-price">
                                    {formatPrice(
                                      item.price
                                    )}
                                  </p>

                                </div>

                                <button
                                  type="button"
                                  disabled={
                                    bookingId ===
                                    item.id
                                  }
                                  onClick={() =>
                                    handleBook(
                                      section,
                                      item
                                    )
                                  }
                                  className={`
                                    ac-book-button
                                    ${
                                      bookingId ===
                                      item.id
                                        ? "ac-book-disabled"
                                        : ""
                                    }
                                  `}
                                >

                                  {bookingId ===
                                  item.id
                                    ? "Opening..."
                                    : "Book Now"}

                                </button>

                              </div>

                            </div>

                          </article>

                        )
                      )}

                    </div>

                  </section>

                )
              )}

            </div>

          )}

        </section>

        {/* =================================================
            REVIEWS
        ================================================= */}

        {!search && (

          <section className="ac-section ac-reviews-section">

            <div className="ac-reviews-card">

              <div className="ac-reviews-heading">

                <div className="ac-heading-with-line">

                  <span />

                  <h2>
                    What Customers Say
                  </h2>

                </div>

                <p>
                  Trusted by customers across
                  Hyderabad
                </p>

              </div>

              <div className="ac-rating-layout">

                {/* RATING */}

                <div className="ac-rating-summary">

                  <p className="ac-rating-number">
                    4.9 ⭐
                  </p>

                  <p className="ac-rating-count">
                    Based on 1,200+ ratings
                  </p>

                  <div className="ac-rating-bars">

                    {[5, 4, 3, 2, 1].map(
                      (star) => (

                        <div
                          key={star}
                          className="ac-rating-row"
                        >

                          <span>
                            {star}★
                          </span>

                          <div className="ac-rating-track">

                            <div
                              className="ac-rating-fill"
                              style={{
                                width: `${Math.min(
                                  100,
                                  star * 18
                                )}%`,
                              }}
                            />

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* REVIEWS */}

                <div className="ac-review-list">

                  {REVIEWS.map(
                    (review) => (

                      <article
                        key={review.name}
                        className="ac-review-card"
                      >

                        <div className="ac-review-user">

                          <img
                            src={review.avatar}
                            alt={review.name}
                          />

                          <div>

                            <p>
                              {review.name}
                            </p>

                            <span>
                              {review.city}
                            </span>

                          </div>

                        </div>

                        <p className="ac-review-stars">
                          {"⭐".repeat(
                            review.rating
                          )}
                        </p>

                        <p className="ac-review-text">
                          {review.review}
                        </p>

                        <p className="ac-review-date">
                          {review.date}
                        </p>

                        <span className="ac-verified">
                          ✓ Verified Booking
                        </span>

                      </article>

                    )
                  )}

                </div>

              </div>

            </div>

          </section>

        )}

        {/* =================================================
            WHY CHOOSE ONCALL
        ================================================= */}

        {!search && (

          <section className="ac-section ac-trust-section">

            <div className="ac-trust-container">

              <div className="ac-trust-heading">

                <div className="ac-trust-title-row">

                  <span />

                  <h2>
                    Why Choose OnCall?
                  </h2>

                  <span />

                </div>

                <p>
                  Reliable AC service at your
                  doorstep
                </p>

              </div>

              <div className="ac-trust-grid">

                {/* CARD 1 */}

                <div className="ac-trust-card">

                  <div className="ac-trust-top-line" />

                  <div className="ac-trust-content">

                    <div className="ac-trust-icon">
                      🛡️
                    </div>

                    <span className="ac-trust-arrow">
                      →
                    </span>

                    <p className="ac-trust-title">
                      Verified Pros
                    </p>

                    <p className="ac-trust-description">
                      Trained service professionals
                    </p>

                  </div>

                </div>

                {/* CARD 2 */}

                <div className="ac-trust-card">

                  <div className="ac-trust-top-line" />

                  <div className="ac-trust-content">

                    <div className="ac-trust-icon">
                      💰
                    </div>

                    <span className="ac-trust-arrow">
                      →
                    </span>

                    <p className="ac-trust-title">
                      Clear Pricing
                    </p>

                    <p className="ac-trust-description">
                      Transparent service prices
                    </p>

                  </div>

                </div>

                {/* CARD 3 */}

                <div className="ac-trust-card">

                  <div className="ac-trust-top-line" />

                  <div className="ac-trust-content">

                    <div className="ac-trust-icon">
                      ⚡
                    </div>

                    <span className="ac-trust-arrow">
                      →
                    </span>

                    <p className="ac-trust-title">
                      Quick Response
                    </p>

                    <p className="ac-trust-description">
                      Fast booking confirmation
                    </p>

                  </div>

                </div>

                {/* CARD 4 */}

                <div className="ac-trust-card">

                  <div className="ac-trust-top-line" />

                  <div className="ac-trust-content">

                    <div className="ac-trust-icon">
                      ⭐
                    </div>

                    <span className="ac-trust-arrow">
                      →
                    </span>

                    <p className="ac-trust-title">
                      Trusted Service
                    </p>

                    <p className="ac-trust-description">
                      Customer-focused support
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

        )}

      </main>

      {/* =================================================
          FLOATING CART
      ================================================= */}

      <ViewCartBar />

    </div>
  );
}