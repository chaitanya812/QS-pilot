import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Fridge.css";

import bannerFridge from "../../assets/Fridge service.png";
import onCallLogo from "../../assets/On-Call-Logo.jpeg";
import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

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

const SERVICES = [
  {
    id: "fr1",
    icon: "❄️",
    title: "Super Saving Offers",
    tagline: "Best value fridge services",
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

const priceToNumber = (value) => {
  const number = Number(String(value).replace(/[₹,\s]/g, ""));
  return Number.isFinite(number) ? number : 0;
};

export default function Fridge() {
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [activeProblemIndex, setActiveProblemIndex] = useState(0);

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

  const handleProblem = (problem) => {
    setSelectedProblem(problem.id);
    setSearch(problem.keywords[0]);

    setTimeout(() => {
      document.getElementById("fridge-services")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <div className="fridge-page">
      <header className="fridge-header">
        <div className="fridge-header-inner">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="fridge-back-btn"
          >
            ←
          </button>

          <div className="fridge-brand">
             <div className="Fridge-logo-box">
            
                          <img
                            src={onCallLogo}
                            alt="OnCall Services"
                            className="Fridge-logo"
                          />
            
                        </div>

            <div>
              <small>OnCall</small>
              <h1>Fridge & Refrigerator</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="fridge-cart-btn"
          >
            🛒

            {itemCount > 0 && (
              <span className="fridge-cart-count">{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      <main className="fridge-container">
        {/* HERO */}

        <section className="fridge-hero">
          <img
            src={bannerFridge}
            alt="Fridge service"
            className="fridge-hero-image"
          />

          <div className="fridge-hero-overlay" />

          <div className="fridge-hero-content">
            <span className="fridge-hero-label">
              ❄️ ONCALL FRIDGE SERVICES
            </span>

            <h2>
              Fridge problem?
              <br />
              <span>We'll take care of it.</span>
            </h2>

            <p>
              Cleaning, cooling problems, gas refill, repairs and refrigerator
              maintenance at your doorstep.
            </p>

            <div className="fridge-hero-actions">
              <a href="tel:7661045308" className="fridge-call-btn">
                📞 Call
              </a>

              <a
                href="https://wa.me/7661045308"
                target="_blank"
                rel="noreferrer"
                className="fridge-whatsapp-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* SEARCH */}

        <section className="fridge-search-section">
          <div className="fridge-search-box">
            <span className="fridge-search-icon">🔍</span>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedProblem(null);
              }}
              placeholder="Search fridge services or problems..."
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedProblem(null);
                }}
                className="fridge-clear-btn"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* PROBLEMS */}

        {!search && (
          <section className="fridge-problems-section">
            <div className="fridge-section-title">
              <div>
                <h2>What's wrong with your fridge?</h2>

                <p>Select your problem and find the right service</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROBLEMS.map((problem, index) => {
                const isFlowActive = index === activeProblemIndex;

                const isSelected = selectedProblem === problem.id;

                return (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => handleProblem(problem)}
                    className={`
                      relative
                      overflow-hidden
                      text-left
                      rounded-2xl
                      border
                      p-4
                      transition-all
                      duration-500
                      active:scale-[0.98]
                      fridge-problem-card
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
                        : isSelected
                        ? THEME.sky
                        : THEME.border,

                      color: isFlowActive
                        ? "#FFFFFF"
                        : THEME.text,

                      boxShadow: isFlowActive
                        ? "0 8px 24px rgba(13,148,136,.25)"
                        : isSelected
                        ? "0 8px 24px rgba(14,165,233,.18)"
                        : "0 2px 8px rgba(15,23,42,.04)",
                    }}
                  >
                    {/* LEFT → RIGHT FLOW */}

                    {isFlowActive && (
                      <span
                        key={activeProblemIndex}
                        className="absolute inset-0 z-0 oncall-problem-flow-background"
                      />
                    )}

                    {/* CONTENT */}

                    <span className="relative z-10 block">
                      <span
                        className="fridge-problem-icon"
                        style={{
                          backgroundColor: isFlowActive
                            ? "rgba(255,255,255,.18)"
                            : isSelected
                            ? "rgba(14,165,233,.20)"
                            : "#E0F2FE",
                        }}
                      >
                        {problem.icon}
                      </span>

                      <span
                        className="fridge-problem-title"
                        style={{
                          color: isFlowActive
                            ? "#FFFFFF"
                            : THEME.text,
                        }}
                      >
                        {problem.title}
                      </span>

                      <span
                        className="fridge-problem-find"
                        style={{
                          color: isFlowActive
                            ? "rgba(255,255,255,.85)"
                            : THEME.muted,
                        }}
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

        {/* HELP */}

        <section className="fridge-help-card">
          <div className="fridge-help-content">
            <span>NEED HELP CHOOSING?</span>

            <h3>Not sure what's wrong with your fridge?</h3>

            <p>
              Talk to OnCall and we'll help you choose the right service.
            </p>
          </div>

          <div className="fridge-help-actions">
            <a href="tel:7661045308">Call</a>

            <a
              href="https://wa.me/7661045308"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </section>

        {/* SEARCH RESULTS */}

        {search && (
          <section className="fridge-search-results">
            <div className="fridge-section-title">
              <div>
                <h2>Search results</h2>

                <p>
                  {searchResults.length} service
                  {searchResults.length === 1 ? "" : "s"} found
                </p>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="fridge-empty-state">
                <div>🔍</div>

                <h3>No matching service found</h3>

                <p>
                  Try searching for cooling, leakage, gas, repair or service.
                </p>
              </div>
            ) : (
              <div className="fridge-results-list">
                {searchResults.map(({ section, item }) => (
                  <article
                    key={`${section.id}-${item.id}`}
                    className="fridge-result-card"
                  >
                    <div>
                      <span className="fridge-result-category">
                        {section.title}
                      </span>

                      <h3>{item.name}</h3>

                      <p>{item.desc}</p>

                      <div className="fridge-result-meta">
                        <span>⏱ {item.time}</span>
                        <span>🛡 {item.warranty}</span>
                      </div>

                      <strong>{item.price}</strong>
                    </div>

                    <button
                      type="button"
                      disabled={bookingId === item.id}
                      onClick={() => handleBook(section, item)}
                      className="fridge-book-btn"
                    >
                      {bookingId === item.id ? "Adding..." : "Book Now"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ALL SERVICES */}

        <section
          id="fridge-services"
          className="fridge-services-section"
        >
          <div className="fridge-section-title">
            <div>
              <h2>All Fridge Services</h2>

              <p>Choose the service that matches your fridge problem</p>
            </div>
          </div>

          <div className="fridge-service-groups">
            {SERVICES.map((section) => (
              <section
                key={section.id}
                className="fridge-service-group"
              >
                <div className="fridge-service-heading">
                  <div className="fridge-service-icon">
                    {section.icon}
                  </div>

                  <div>
                    <h3>{section.title}</h3>

                    <p>{section.tagline}</p>
                  </div>
                </div>

                <div className="fridge-service-list">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className="fridge-service-card"
                    >
                      <div className="fridge-service-info">
                        <div className="fridge-service-name">
                          <h4>{item.name}</h4>

                          {item.tag && (
                            <span className="fridge-service-tag">
                              ⭐ {item.tag}
                            </span>
                          )}
                        </div>

                        <p>{item.desc}</p>

                        <div className="fridge-service-meta">
                          <span>⏱ {item.time}</span>
                          <span>🛡 {item.warranty}</span>
                        </div>

                        <strong>{item.price}</strong>
                      </div>

                      <button
                        type="button"
                        disabled={bookingId === item.id}
                        onClick={() => handleBook(section, item)}
                        className="fridge-book-btn"
                      >
                        {bookingId === item.id ? "Adding..." : "Book Now"}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* REVIEWS */}

        <section className="fridge-reviews-section">
          <div className="fridge-section-title">
            <div>
              <h2>What Customers Say</h2>

              <p>Real feedback from OnCall customers</p>
            </div>
          </div>

          <div className="fridge-reviews-wrapper">
            <div className="fridge-rating-box">
              <strong>4.9 ⭐</strong>

              <p>Based on 900+ ratings</p>

              <div className="fridge-rating-bars">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="fridge-rating-row">
                    <span>{star}★</span>

                    <div>
                      <i style={{ width: `${star * 18}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fridge-review-list">
              {REVIEWS.map((review, index) => (
                <article
                  key={index}
                  className="fridge-review-card"
                >
                  <div className="fridge-review-user">
                    <img
                      src={review.avatar}
                      alt={review.name}
                    />

                    <div>
                      <h4>{review.name}</h4>
                      <span>{review.city}</span>
                    </div>
                  </div>

                  <div className="fridge-review-stars">
                    {"⭐".repeat(review.rating)}
                  </div>

                  <p>{review.review}</p>

                  <small>{review.date}</small>

                  <label>✔ Verified Booking</label>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}

        <section className="fridge-trust-section">
          <div className="fridge-section-title center">
            <div>
              <h2>Why Choose OnCall?</h2>

              <p>Reliable fridge service at your doorstep</p>
            </div>
          </div>

          <div className="fridge-trust-grid">
            <div className="fridge-trust-card">
              <div>🛡️</div>
              <h3>Verified Technicians</h3>
              <p>Trained service professionals</p>
            </div>

            <div className="fridge-trust-card">
              <div>💰</div>
              <h3>Clear Pricing</h3>
              <p>Transparent service prices</p>
            </div>

            <div className="fridge-trust-card">
              <div>⚡</div>
              <h3>Quick Response</h3>
              <p>Fast booking confirmation</p>
            </div>

            <div className="fridge-trust-card">
              <div>⭐</div>
              <h3>Trusted Service</h3>
              <p>Customer-focused support</p>
            </div>
          </div>
        </section>
      </main>

      <ViewCartBar />
    </div>
  );
}