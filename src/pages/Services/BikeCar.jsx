import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./BikeCar.css";
import onCallLogo from "../../assets/On-Call-Logo.jpeg";
import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

const SUPPORT_PHONE = "7661045308";

const THEME = {
  navy: "#0B1D36",
  teal: "#0D9488",
  sky: "#0EA5E9",
  cloud: "#F8FAFC",
  mist: "#F1F5F9",
  text: "#0F172A",
  muted: "#64748B",
  border: "#DCE5EC",
};

const BIKE_CAR_SECTIONS = [
  {
    title: "Popular Bike Services",
    subtitle: "Quick bike care at your doorstep",
    items: [
      {
        id: "b1",
        name: "Bike Wash",
        price: 99,
        desc: "Complete exterior bike wash and cleaning",
        time: "30–45 min",
        warranty: "Service assurance",
      },
      {
        id: "b2",
        name: "Bike Oil Change",
        price: 199,
        desc: "Engine oil replacement by a professional mechanic",
        time: "20–30 min",
        warranty: "Service assurance",
      },
      {
        id: "b3",
        name: "Bike General Service",
        price: 399,
        desc: "Basic inspection, adjustments and maintenance",
        time: "60–90 min",
        warranty: "Service assurance",
      },
      {
        id: "b4",
        name: "Bike Brake Service",
        price: 249,
        desc: "Brake inspection and adjustment",
        time: "30–45 min",
        warranty: "Service assurance",
      },
    ],
  },
  {
    title: "Car Services",
    subtitle: "Car maintenance at your location",
    items: [
      {
        id: "b5",
        name: "Car Wash",
        price: 299,
        desc: "Exterior car wash and cleaning",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "b6",
        name: "Car Minor Service",
        price: 499,
        desc: "Basic inspection and minor maintenance",
        time: "60–90 min",
        warranty: "Service assurance",
      },
      {
        id: "b7",
        name: "Car Oil Change",
        price: 699,
        desc: "Engine oil replacement and basic checks",
        time: "30–45 min",
        warranty: "Service assurance",
      },
      {
        id: "b8",
        name: "Car Battery Check",
        price: 199,
        desc: "Battery health and charging system inspection",
        time: "20–30 min",
        warranty: "Service assurance",
      },
    ],
  },
  {
    title: "Repair & Maintenance",
    subtitle: "For common vehicle problems",
    items: [
      {
        id: "b9",
        name: "Vehicle Not Starting",
        price: 299,
        desc: "Basic inspection for starting problems",
        time: "30–60 min",
        warranty: "Service assurance",
      },
      {
        id: "b10",
        name: "Brake Problem",
        price: 249,
        desc: "Brake inspection and basic adjustment",
        time: "30–45 min",
        warranty: "Service assurance",
      },
      {
        id: "b11",
        name: "Battery Problem",
        price: 199,
        desc: "Battery and electrical system inspection",
        time: "20–30 min",
        warranty: "Service assurance",
      },
      {
        id: "b12",
        name: "General Inspection",
        price: 299,
        desc: "Professional vehicle health inspection",
        time: "30–45 min",
        warranty: "Service assurance",
      },
    ],
  },
];

const QUICK_NEEDS = [
  {
    id: "wash",
    icon: "🧽",
    title: "Need a Wash?",
    search: "wash",
  },
  {
    id: "oil",
    icon: "🛢️",
    title: "Oil Change?",
    search: "oil",
  },
  {
    id: "starting",
    icon: "🔑",
    title: "Vehicle Not Starting?",
    search: "starting",
  },
  {
    id: "repair",
    icon: "🔧",
    title: "Need a Repair?",
    search: "repair",
  },
];

export default function BikeCar() {
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [bookingId, setBookingId] = useState(null);

  const [activeNeedIndex, setActiveNeedIndex] = useState(0);

  const whatsappMessage = encodeURIComponent(
    "Hi OnCall, I need help with Bike & Car Service."
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNeedIndex((prev) => {
        return (prev + 1) % QUICK_NEEDS.length;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return BIKE_CAR_SECTIONS;
    }

    return BIKE_CAR_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query)
      ),
    })).filter((section) => section.items.length > 0);
  }, [search]);

  const handleBook = (section, item) => {
    if (bookingId) return;

    setBookingId(item.id);

    const cartItem = {
      id: item.id,
      key: item.id,
      label: item.name,
      name: item.name,
      price: Number(item.price),
      qty: 1,
      service: "Bike & Car Service",
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

  const handleQuickNeed = (need) => {
    setSearch(need.search);

    setTimeout(() => {
      const element = document.getElementById("vehicle-services");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  return (
    <div className="vehicle-page">
      {/* HEADER */}

      <header className="vehicle-header">
        <div className="vehicle-header-inner">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="vehicle-back-btn"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="vehicle-brand">
            <div className="bc-logo-box">
            
                          <img
                            src={onCallLogo}
                            alt="OnCall Services"
                            className="bc-logo"
                          />
            
                        </div>

            <div>
              <p>OnCall</p>
              <h1>Bike & Car Service</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="vehicle-cart-btn"
            aria-label="Open cart"
          >
            🛒

            {itemCount > 0 && (
              <span className="vehicle-cart-count">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="vehicle-container">
        {/* HERO */}

        <section className="vehicle-hero">
          <div className="vehicle-hero-background" />
          <div className="vehicle-hero-overlay" />

          <div className="vehicle-hero-content">
            <div className="vehicle-hero-main">
              <span className="vehicle-hero-label">
                🚗 VEHICLE CARE AT YOUR DOORSTEP
              </span>

              <h2>
                Vehicle service,
                <br />
                <span>made easy.</span>
              </h2>

              <p>
                Book trusted mechanics for bike and car wash,
                servicing, maintenance and common repairs.
              </p>
            </div>

            <div className="vehicle-hero-actions">
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
                className="vehicle-call-btn"
              >
                📞 Call Support
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="vehicle-whatsapp-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* SEARCH */}

        <section className="vehicle-search-section">
          <div className="vehicle-search-box">
            <span className="vehicle-search-icon">🔎</span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What vehicle service do you need?"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="vehicle-clear-btn"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* QUICK NEEDS */}

        <section className="vehicle-quick-section">
          <div className="vehicle-section-title">
            <div>
              <h2>What do you need?</h2>

              <p>
                Choose your problem and find a service quickly
              </p>
            </div>
          </div>

          <div className="vehicle-quick-grid">
            {QUICK_NEEDS.map((need, index) => {
              const isFlowActive =
                index === activeNeedIndex;

              return (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => handleQuickNeed(need)}
                  className={`
                    vehicle-quick-card
                    ${
                      isFlowActive
                        ? "oncall-problem-flow-active"
                        : ""
                    }
                  `}
                  style={{
                    backgroundColor: isFlowActive
                      ? "transparent"
                      : THEME.cloud,

                    borderColor: isFlowActive
                      ? THEME.teal
                      : THEME.border,

                    color: isFlowActive
                      ? "#FFFFFF"
                      : THEME.text,

                    boxShadow: isFlowActive
                      ? "0 8px 24px rgba(13,148,136,.25)"
                      : "0 2px 8px rgba(15,23,42,.04)",
                  }}
                >
                  {/* LEFT → RIGHT FLOW */}

                  {isFlowActive && (
                    <span
                      key={activeNeedIndex}
                      className="oncall-problem-flow-background"
                    />
                  )}

                  {/* CONTENT */}

                  <span className="vehicle-quick-content">
                    <span
                      className="vehicle-quick-icon"
                      style={{
                        backgroundColor: isFlowActive
                          ? "rgba(255,255,255,.18)"
                          : "#E0F2FE",
                      }}
                    >
                      {need.icon}
                    </span>

                    <span
                      className="vehicle-quick-title"
                      style={{
                        color: isFlowActive
                          ? "#FFFFFF"
                          : THEME.text,
                      }}
                    >
                      {need.title}
                    </span>

                    <span
                      className="vehicle-quick-link"
                      style={{
                        color: isFlowActive
                          ? "rgba(255,255,255,.85)"
                          : THEME.muted,
                      }}
                    >
                      View services →
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* TRUST STRIP */}

        <section className="vehicle-trust-strip">
          <div className="vehicle-mini-trust-card">
            <div>🔧</div>
            <p>Skilled</p>
          </div>

          <div className="vehicle-mini-trust-card">
            <div>🛡️</div>
            <p>Verified</p>
          </div>

          <div className="vehicle-mini-trust-card">
            <div>💰</div>
            <p>Clear Price</p>
          </div>
        </section>

        {/* SERVICES */}

        <section
          id="vehicle-services"
          className="vehicle-services-section"
        >
          {filteredSections.length === 0 ? (
            <div className="vehicle-empty-state">
              <div>🔎</div>

              <h3>No service found</h3>

              <p>
                Try searching for wash, oil, repair, brake or
                battery.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="vehicle-show-all-btn"
              >
                Show All Services
              </button>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div
                key={section.title}
                className="vehicle-service-section"
              >
                <div className="vehicle-service-section-heading">
                  <h2>{section.title}</h2>

                  <p>{section.subtitle}</p>
                </div>

                <div className="vehicle-service-list">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className="vehicle-service-card"
                    >
                      <div className="vehicle-service-main">
                        <div className="vehicle-service-icon">
                          🔧
                        </div>

                        <div className="vehicle-service-info">
                          <h3>{item.name}</h3>

                          <p>{item.desc}</p>

                          <div className="vehicle-service-meta">
                            <span>
                              ⏱ {item.time}
                            </span>

                            <span>
                              ✓ {item.warranty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="vehicle-service-action">
                        <div className="vehicle-price">
                          ₹
                          {Number(item.price).toLocaleString(
                            "en-IN"
                          )}
                        </div>

                        <p>Starting price</p>

                        <button
                          type="button"
                          disabled={bookingId === item.id}
                          onClick={() =>
                            handleBook(section, item)
                          }
                          className={
                            bookingId === item.id
                              ? "vehicle-book-btn loading"
                              : "vehicle-book-btn"
                          }
                        >
                          {bookingId === item.id
                            ? "Adding..."
                            : "Book Now →"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* HOW IT WORKS */}

        <section className="vehicle-how-section">
          <div className="vehicle-how-card">
            <div className="vehicle-section-title">
              <div>
                <h2>How OnCall works</h2>
              </div>
            </div>

            <div className="vehicle-how-grid">
              <div className="vehicle-how-item">
                <div className="vehicle-how-icon">
                  1️⃣
                </div>

                <h3>Choose a service</h3>

                <p>
                  Tell us what your bike or car needs.
                </p>
              </div>

              <div className="vehicle-how-item">
                <div className="vehicle-how-icon">
                  2️⃣
                </div>

                <h3>Choose date & time</h3>

                <p>
                  Tell us where and when you need the service.
                </p>
              </div>

              <div className="vehicle-how-item">
                <div className="vehicle-how-icon">
                  3️⃣
                </div>

                <h3>Get it serviced</h3>

                <p>
                  A service professional comes to your
                  location.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT */}

        <section className="vehicle-support-section">
          <div className="vehicle-support-card">
            <p>Need help?</p>

            <h2>
              Not sure what your vehicle needs?
            </h2>

            <span>
              Talk to OnCall support and we can help you
              choose a service.
            </span>

            <div className="vehicle-support-actions">
              <a href={`tel:+91${SUPPORT_PHONE}`}>
                📞 Call
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <ViewCartBar />
    </div>
  );
}