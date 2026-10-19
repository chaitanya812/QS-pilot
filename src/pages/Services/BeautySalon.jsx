import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./BeautySalon.css";
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

const BEAUTY_SECTIONS = [
  {
    title: "Popular Beauty Services",
    subtitle: "Most booked at home",
    items: [
      {
        id: "be1",
        name: "Home Salon - Haircut",
        price: 299,
        desc: "Professional haircut at your home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "be2",
        name: "Makeup at Home",
        price: 999,
        desc: "Professional makeup service at home",
        time: "90–120 min",
        warranty: "Service assurance",
      },
      {
        id: "be3",
        name: "Hair Styling",
        price: 499,
        desc: "Professional hair styling at home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "be4",
        name: "Hair Spa",
        price: 699,
        desc: "Relaxing hair spa treatment at home",
        time: "60–75 min",
        warranty: "Service assurance",
      },
    ],
  },
  {
    title: "Women’s Salon",
    subtitle: "Salon care at your doorstep",
    items: [
      {
        id: "be5",
        name: "Threading",
        price: 149,
        desc: "Eyebrow and facial threading service",
        time: "20–30 min",
        warranty: "Service assurance",
      },
      {
        id: "be6",
        name: "Facial",
        price: 599,
        desc: "Professional facial treatment at home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "be7",
        name: "Manicure",
        price: 399,
        desc: "Professional manicure at home",
        time: "40–50 min",
        warranty: "Service assurance",
      },
      {
        id: "be8",
        name: "Pedicure",
        price: 499,
        desc: "Professional pedicure at home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
    ],
  },
  {
    title: "Men’s Grooming",
    subtitle: "Easy grooming at home",
    items: [
      {
        id: "be9",
        name: "Men's Haircut",
        price: 249,
        desc: "Professional men's haircut at home",
        time: "30–45 min",
        warranty: "Service assurance",
      },
      {
        id: "be10",
        name: "Beard Styling",
        price: 199,
        desc: "Beard trim and styling at home",
        time: "20–30 min",
        warranty: "Service assurance",
      },
      {
        id: "be11",
        name: "Haircut + Beard",
        price: 399,
        desc: "Complete haircut and beard grooming",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "be12",
        name: "Men's Facial",
        price: 499,
        desc: "Professional facial treatment at home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
    ],
  },
];

const QUICK_NEEDS = [
  {
    id: "haircut",
    icon: "✂️",
    title: "Need a Haircut?",
    search: "haircut",
  },
  {
    id: "makeup",
    icon: "💄",
    title: "Need Makeup?",
    search: "makeup",
  },
  {
    id: "facial",
    icon: "✨",
    title: "Need a Facial?",
    search: "facial",
  },
  {
    id: "grooming",
    icon: "🧔",
    title: "Need Grooming?",
    search: "groom",
  },
];

export default function BeautySalon() {
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [bookingId, setBookingId] = useState(null);

  const [activeNeedIndex, setActiveNeedIndex] = useState(0);

  const whatsappMessage = encodeURIComponent(
    "Hi OnCall, I need help with Beauty & Salon service."
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

    if (!query) return BEAUTY_SECTIONS;

    return BEAUTY_SECTIONS.map((section) => ({
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
      service: "Beauty & Salon",
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
      const element = document.getElementById("beauty-services");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  return (
    <div className="beauty-page">
      {/* HEADER */}

      <header className="beauty-header">
        <div className="beauty-header-inner">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="beauty-back-btn"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="beauty-brand">
            <div className="b-logo-box">
            
                          <img
                            src={onCallLogo}
                            alt="OnCall Services"
                            className="b-logo"
                          />
            
                        </div>

            <div>
              <p>OnCall</p>
              <h1>Beauty & Salon</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="beauty-cart-btn"
            aria-label="Open cart"
          >
            🛒

            {itemCount > 0 && (
              <span className="beauty-cart-count">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="beauty-container">
        {/* HERO */}

        <section className="beauty-hero">
          <div className="beauty-hero-background" />
          <div className="beauty-hero-overlay" />

          <div className="beauty-hero-content">
            <div>
              <span className="beauty-hero-label">
                ✨ AT-HOME BEAUTY SERVICES
              </span>

              <h2>
                Beauty care,
                <br />
                <span>at your doorstep.</span>
              </h2>

              <p>
                Book trusted beauty and salon professionals
                without leaving home.
              </p>
            </div>

            <div className="beauty-hero-actions">
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
                className="beauty-call-btn"
              >
                📞 Call Support
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="beauty-whatsapp-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* SEARCH */}

        <section className="beauty-search-section">
          <div className="beauty-search-box">
            <span className="beauty-search-icon">
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What beauty service do you need?"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="beauty-clear-btn"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* QUICK NEEDS */}

        <section className="beauty-quick-section">
          <div className="beauty-section-title">
            <div>
              <h2>What do you need?</h2>

              <p>
                Choose your need and book in seconds
              </p>
            </div>
          </div>

          <div className="beauty-quick-grid">
            {QUICK_NEEDS.map((need, index) => {
              const isFlowActive =
                index === activeNeedIndex;

              return (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => handleQuickNeed(need)}
                  className={`
                    beauty-quick-card
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

                  <span className="beauty-quick-content">
                    <span
                      className="beauty-quick-icon"
                      style={{
                        backgroundColor: isFlowActive
                          ? "rgba(255,255,255,.18)"
                          : "#FCE7F3",
                      }}
                    >
                      {need.icon}
                    </span>

                    <span
                      className="beauty-quick-title"
                      style={{
                        color: isFlowActive
                          ? "#FFFFFF"
                          : THEME.text,
                      }}
                    >
                      {need.title}
                    </span>

                    <span
                      className="beauty-quick-link"
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

        <section className="beauty-trust-strip">
          <div className="beauty-mini-trust-card">
            <div>👩‍💼</div>
            <p>At Home</p>
          </div>

          <div className="beauty-mini-trust-card">
            <div>🛡️</div>
            <p>Verified</p>
          </div>

          <div className="beauty-mini-trust-card">
            <div>💰</div>
            <p>Clear Price</p>
          </div>
        </section>

        {/* SERVICES */}

        <section
          id="beauty-services"
          className="beauty-services-section"
        >
          {filteredSections.length === 0 ? (
            <div className="beauty-empty-state">
              <div>🔎</div>

              <h3>No service found</h3>

              <p>
                Try searching for haircut, makeup, facial
                or grooming.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="beauty-show-all-btn"
              >
                Show All Services
              </button>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div
                key={section.title}
                className="beauty-service-section"
              >
                <div className="beauty-service-section-heading">
                  <h2>{section.title}</h2>

                  <p>{section.subtitle}</p>
                </div>

                <div className="beauty-service-list">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className="beauty-service-card"
                    >
                      <div className="beauty-service-main">
                        <div className="beauty-service-icon">
                          ✨
                        </div>

                        <div className="beauty-service-info">
                          <h3>{item.name}</h3>

                          <p>{item.desc}</p>

                          <div className="beauty-service-meta">
                            <span>
                              ⏱ {item.time}
                            </span>

                            <span>
                              ✓ {item.warranty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="beauty-service-action">
                        <div className="beauty-price">
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
                              ? "beauty-book-btn loading"
                              : "beauty-book-btn"
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

        <section className="beauty-how-section">
          <div className="beauty-how-card">
            <div className="beauty-section-title">
              <div>
                <h2>How OnCall works</h2>
              </div>
            </div>

            <div className="beauty-how-grid">
              <div className="beauty-how-item">
                <div className="beauty-how-icon">
                  1️⃣
                </div>

                <h3>Choose a service</h3>

                <p>
                  Select the beauty service you need.
                </p>
              </div>

              <div className="beauty-how-item">
                <div className="beauty-how-icon">
                  2️⃣
                </div>

                <h3>Choose date & time</h3>

                <p>
                  Tell us where and when you need the
                  service.
                </p>
              </div>

              <div className="beauty-how-item">
                <div className="beauty-how-icon">
                  3️⃣
                </div>

                <h3>Relax at home</h3>

                <p>
                  Your service professional comes to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT */}

        <section className="beauty-support-section">
          <div className="beauty-support-card">
            <p>Need help?</p>

            <h2>
              Not sure which service you need?
            </h2>

            <span>
              Talk to OnCall support and we will help you
              choose.
            </span>

            <div className="beauty-support-actions">
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
              >
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