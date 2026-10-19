import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CarpenterDetails.css";

import bannerCarpenter from "../../assets/carpenter-banner.jpg";
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

const REVIEWS = [
  {
    name: "Neeraj",
    city: "Hyderabad",
    review: "Door repair done neatly. Very skilled carpenter.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    date: "3 days ago",
  },
  {
    name: "Kavya",
    city: "Gachibowli",
    review: "Wardrobe fixing was perfect. Good pricing!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    date: "1 week ago",
  },
];

const SERVICES = [
  {
    id: "c1",
    icon: "🚪",
    title: "Door Repair & Services",
    tagline: "Fix broken, loose or jammed doors",
    items: [
      {
        id: "c1-1",
        name: "Door Repair",
        desc: "Fix jamming, loose or misaligned doors",
        price: 249,
        time: "30–45 min",
        warranty: "30 Days",
        tag: "Bestseller",
      },
      {
        id: "c1-2",
        name: "Door Lock Repair",
        desc: "Fix common door lock issues",
        price: 199,
        time: "20–30 min",
        warranty: "30 Days",
      },
      {
        id: "c1-3",
        name: "Door Handle Repair",
        desc: "Fix loose or damaged door handles",
        price: 149,
        time: "20–30 min",
        warranty: "30 Days",
      },
    ],
  },
  {
    id: "c2",
    icon: "🪑",
    title: "Furniture Work",
    tagline: "Reliable furniture fixing and repair",
    items: [
      {
        id: "c2-1",
        name: "Chair Repair",
        desc: "Fix broken or unstable chairs",
        price: 149,
        time: "20–30 min",
        warranty: "30 Days",
      },
      {
        id: "c2-2",
        name: "Table Repair",
        desc: "Fix damaged or unstable tables",
        price: 249,
        time: "30–45 min",
        warranty: "30 Days",
      },
      {
        id: "c2-3",
        name: "Furniture Assembly",
        desc: "Assemble beds, tables, chairs and furniture",
        price: 299,
        time: "45–60 min",
        warranty: "30 Days",
      },
    ],
  },
  {
    id: "c3",
    icon: "🗄️",
    title: "Wardrobe & Cabinet",
    tagline: "Repair and adjustment services",
    items: [
      {
        id: "c3-1",
        name: "Wardrobe Repair",
        desc: "Fix wardrobe doors, hinges and alignment",
        price: 249,
        time: "30–45 min",
        warranty: "30 Days",
      },
      {
        id: "c3-2",
        name: "Cabinet Repair",
        desc: "Fix kitchen and storage cabinet issues",
        price: 249,
        time: "30–45 min",
        warranty: "30 Days",
      },
      {
        id: "c3-3",
        name: "Hinge Replacement",
        desc: "Replace damaged or loose furniture hinges",
        price: 149,
        time: "20–30 min",
        warranty: "30 Days",
      },
    ],
  },
  {
    id: "c4",
    icon: "🛏️",
    title: "Bed & Home Furniture",
    tagline: "Common home furniture services",
    items: [
      {
        id: "c4-1",
        name: "Bed Repair",
        desc: "Fix loose, broken or noisy bed frames",
        price: 299,
        time: "30–60 min",
        warranty: "30 Days",
      },
      {
        id: "c4-2",
        name: "Shelf Installation",
        desc: "Install wall shelves and wooden shelves",
        price: 299,
        time: "30–45 min",
        warranty: "30 Days",
      },
      {
        id: "c4-3",
        name: "Wooden Work",
        desc: "Minor wooden repair and fixing work",
        price: 299,
        time: "30–60 min",
        warranty: "30 Days",
      },
    ],
  },
];

const PROBLEMS = [
  {
    id: "door",
    icon: "🚪",
    title: "Door Problem",
    keywords: ["door"],
  },
  {
    id: "furniture",
    icon: "🪑",
    title: "Furniture Repair",
    keywords: ["furniture"],
  },
  {
    id: "wardrobe",
    icon: "🗄️",
    title: "Wardrobe Problem",
    keywords: ["wardrobe"],
  },
  {
    id: "bed",
    icon: "🛏️",
    title: "Bed / Wood Work",
    keywords: ["bed"],
  },
  {
    id: "cabinet",
    icon: "🗄️",
    title: "Cabinet Problem",
    keywords: ["cabinet"],
  },
  {
    id: "hinge",
    icon: "🔧",
    title: "Hinge / Handle",
    keywords: ["hinge"],
  },
];

const priceToNumber = (value) => {
  const number = Number(String(value).replace(/[₹,\s]/g, ""));
  return Number.isFinite(number) ? number : 0;
};

export default function CarpenterDetails() {
  const navigate = useNavigate();

  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const [activeProblemIndex, setActiveProblemIndex] = useState(0);

  const whatsappMessage = encodeURIComponent(
    "Hi OnCall, I need help with Carpenter service."
  );

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
      service: "Carpenter",
      category: section.title,
      subService: item.name,
      description: item.desc,
      duration: item.time,
      warranty: item.warranty,
      image: bannerCarpenter,
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
        .getElementById("carpenter-services")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  return (
    <div className="carpenter-page">
      <header className="carpenter-header">
        <div className="carpenter-header-inner">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="carpenter-back-btn"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="carpenter-brand">
            <div className="c-logo-box">
            
                          <img
                            src={onCallLogo}
                            alt="OnCall Services"
                            className="c-logo"
                          />
            
                        </div>

            <div>
              <p>OnCall</p>
              <h1>Carpenter Services</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="carpenter-cart-btn"
            aria-label="Open cart"
          >
            🛒

            {itemCount > 0 && (
              <span className="carpenter-cart-count">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="carpenter-container">
        {/* HERO */}

        <section className="carpenter-hero">
          <img
            src={bannerCarpenter}
            alt="Carpenter service"
            className="carpenter-hero-image"
          />

          <div className="carpenter-hero-overlay" />

          <div className="carpenter-hero-content">
            <span className="carpenter-hero-label">
              🪚 ONCALL CARPENTER SERVICES
            </span>

            <h2>
              Carpenter problem?
              <br />
              <span>We'll take care of it.</span>
            </h2>

            <p>
              Door repair, furniture fixing, wardrobe work,
              bed repair and more at your doorstep.
            </p>

            <div className="carpenter-hero-actions">
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
                className="carpenter-call-btn"
              >
                📞 Call
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="carpenter-whatsapp-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* SEARCH */}

        <section className="carpenter-search-section">
          <div className="carpenter-search-box">
            <span className="carpenter-search-icon">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedProblem(null);
              }}
              placeholder="Search carpenter services or problems..."
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedProblem(null);
                }}
                className="carpenter-clear-btn"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* PROBLEM CARDS */}

        {!search && (
          <section className="carpenter-problems-section">
            <div className="carpenter-section-title">
              <div>
                <h2>What do you need help with?</h2>

                <p>
                  Select your problem and find the right service
                </p>
              </div>
            </div>

            <div className="carpenter-problems-grid">
              {PROBLEMS.map((problem, index) => {
                const isFlowActive =
                  index === activeProblemIndex;

                const isSelected =
                  selectedProblem === problem.id;

                return (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => handleProblem(problem)}
                    className={`
                      carpenter-problem-card
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
                        className="oncall-problem-flow-background"
                      />
                    )}

                    {/* CONTENT */}

                    <span className="carpenter-problem-content">
                      <span
                        className="carpenter-problem-icon"
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
                        className="carpenter-problem-title"
                        style={{
                          color: isFlowActive
                            ? "#FFFFFF"
                            : THEME.text,
                        }}
                      >
                        {problem.title}
                      </span>

                      <span
                        className="carpenter-problem-find"
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

        {/* SUPPORT */}

        <section className="carpenter-support-card">
          <div className="carpenter-support-content">
            <span>NEED HELP CHOOSING?</span>

            <h3>
              Not sure which carpenter service you need?
            </h3>

            <p>
              Talk to OnCall and we'll help you choose the
              right service.
            </p>
          </div>

          <div className="carpenter-support-actions">
            <a href={`tel:+91${SUPPORT_PHONE}`}>
              Call
            </a>

            <a
              href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </section>

        {/* SEARCH RESULTS */}

        {search && (
          <section className="carpenter-search-results">
            <div className="carpenter-section-title">
              <div>
                <h2>Search results</h2>

                <p>
                  {searchResults.length} service
                  {searchResults.length === 1 ? "" : "s"} found
                </p>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="carpenter-empty-state">
                <div>🔍</div>

                <h3>No matching service found</h3>

                <p>
                  Try searching for door, furniture,
                  wardrobe, bed, cabinet or repair.
                </p>
              </div>
            ) : (
              <div className="carpenter-results-list">
                {searchResults.map(({ section, item }) => (
                  <article
                    key={`${section.id}-${item.id}`}
                    className="carpenter-result-card"
                  >
                    <div>
                      <span className="carpenter-result-category">
                        {section.title}
                      </span>

                      <h3>{item.name}</h3>

                      <p>{item.desc}</p>

                      <div className="carpenter-result-meta">
                        <span>
                          ⏱ {item.time}
                        </span>

                        <span>
                          🛡 {item.warranty}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {Number(item.price).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    <button
                      type="button"
                      disabled={bookingId === item.id}
                      onClick={() =>
                        handleBook(section, item)
                      }
                      className="carpenter-book-btn"
                    >
                      {bookingId === item.id
                        ? "Adding..."
                        : "Book Now"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SERVICES */}

        <section
          id="carpenter-services"
          className="carpenter-services-section"
        >
          <div className="carpenter-section-title">
            <div>
              <h2>All Carpenter Services</h2>

              <p>
                Choose the service that matches your
                carpentry problem
              </p>
            </div>
          </div>

          <div className="carpenter-service-groups">
            {SERVICES.map((section) => (
              <section
                key={section.id}
                className="carpenter-service-group"
              >
                <div className="carpenter-service-heading">
                  <div className="carpenter-service-icon">
                    {section.icon}
                  </div>

                  <div>
                    <h3>{section.title}</h3>

                    <p>{section.tagline}</p>
                  </div>
                </div>

                <div className="carpenter-service-list">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className="carpenter-service-card"
                    >
                      <div className="carpenter-service-info">
                        <div className="carpenter-service-name">
                          <h4>{item.name}</h4>

                          {item.tag && (
                            <span className="carpenter-service-tag">
                              ⭐ {item.tag}
                            </span>
                          )}
                        </div>

                        <p>{item.desc}</p>

                        <div className="carpenter-service-meta">
                          <span>
                            ⏱ {item.time}
                          </span>

                          <span>
                            🛡 {item.warranty}
                          </span>
                        </div>

                        <strong>
                          ₹
                          {Number(item.price).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>

                      <button
                        type="button"
                        disabled={bookingId === item.id}
                        onClick={() =>
                          handleBook(section, item)
                        }
                        className="carpenter-book-btn"
                      >
                        {bookingId === item.id
                          ? "Adding..."
                          : "Book Now"}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* REVIEWS */}

        <section className="carpenter-reviews-section">
          <div className="carpenter-section-title">
            <div>
              <h2>What Customers Say</h2>

              <p>
                Real feedback from OnCall customers
              </p>
            </div>
          </div>

          <div className="carpenter-reviews-wrapper">
            <div className="carpenter-rating-box">
              <strong>4.9 ⭐</strong>

              <p>Based on 900+ ratings</p>

              <div className="carpenter-rating-bars">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div
                    key={star}
                    className="carpenter-rating-row"
                  >
                    <span>{star}★</span>

                    <div>
                      <i
                        style={{
                          width: `${star * 18}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="carpenter-review-list">
              {REVIEWS.map((review, index) => (
                <article
                  key={index}
                  className="carpenter-review-card"
                >
                  <div className="carpenter-review-user">
                    <img
                      src={review.avatar}
                      alt={review.name}
                    />

                    <div>
                      <h4>{review.name}</h4>

                      <span>{review.city}</span>
                    </div>
                  </div>

                  <div className="carpenter-review-stars">
                    {"⭐".repeat(review.rating)}
                  </div>

                  <p>{review.review}</p>

                  <small>{review.date}</small>

                  <label>
                    ✔ Verified Booking
                  </label>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}

        <section className="carpenter-trust-section">
          <div className="carpenter-section-title center">
            <div>
              <h2>Why Choose OnCall?</h2>

              <p>
                Reliable carpenter service at your doorstep
              </p>
            </div>
          </div>

          <div className="carpenter-trust-grid">
            <div className="carpenter-trust-card">
              <div>🛡️</div>

              <h3>Verified Technicians</h3>

              <p>
                Trained service professionals
              </p>
            </div>

            <div className="carpenter-trust-card">
              <div>💰</div>

              <h3>Clear Pricing</h3>

              <p>
                Transparent service prices
              </p>
            </div>

            <div className="carpenter-trust-card">
              <div>⚡</div>

              <h3>Quick Response</h3>

              <p>
                Fast booking confirmation
              </p>
            </div>

            <div className="carpenter-trust-card">
              <div>⭐</div>

              <h3>Trusted Service</h3>

              <p>
                Customer-focused support
              </p>
            </div>
          </div>
        </section>
      </main>

      <ViewCartBar />
    </div>
  );
}