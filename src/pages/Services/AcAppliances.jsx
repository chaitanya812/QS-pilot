import React, {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import bannerAC from "../../assets/ac-banner.jpg";

import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

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
   SERVICES
========================================================= */

const SERVICES = [
  {
    id: "ac1",
    icon: "🔥",
    title: "Special Offers",
    tagline:
      "Save more on multiple AC services",

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
   PROBLEMS
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
   HELPERS
========================================================= */

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString(
    "en-IN"
  )}`;

/* =========================================================
   COMPONENT
========================================================= */

export default function ApplianceServices() {
  const navigate = useNavigate();

  const { addItem } = useCart();

  const [search, setSearch] = useState("");

  const [selectedProblem, setSelectedProblem] =
    useState("");

  const [bookingId, setBookingId] =
    useState(null);

  /* =======================================================
     FILTER
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
     PROBLEM
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
     
     IMPORTANT FLOW:
     
     Book Now
        ↓
     Add to Cart
        ↓
     /cart
        ↓
     Continue
        ↓
     /booking
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

    /*
     * Add selected service to cart.
     */
    addItem(cartItem);

    /*
     * Give the cart state time to update,
     * then open the cart.
     */
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
    <div className="min-h-screen bg-slate-50 pb-28">

      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
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
              AC & Appliances
            </h1>

          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-xl"
          >
            🛒
          </button>

        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-4">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-3xl shadow-lg">

          <img
            src={bannerAC}
            alt="AC service technician"
            className="w-full h-56 sm:h-72 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">

            <div className="inline-flex bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs mb-2">
              ✓ Verified Professionals
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold">
              AC problem?
              <br />
              We'll take care of it.
            </h2>

            <p className="text-sm text-white/90 mt-1">
              Choose your problem or select a service below.
            </p>

          </div>

        </section>

        {/* SEARCH */}

        <section className="mt-4">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
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
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-12 py-4 outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100"
              >
                ×
              </button>
            )}

          </div>

        </section>

        {/* PROBLEMS */}

        {!search && (
          <section className="mt-5">

            <div className="mb-3">

              <h2 className="font-bold text-lg text-slate-900">
                What's wrong with your AC?
              </h2>

              <p className="text-sm text-slate-500">
                Pick your problem — we'll show the right service.
              </p>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              {PROBLEMS.map(
                (problem) => (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() =>
                      handleProblem(problem)
                    }
                    className={`text-left bg-white border rounded-2xl p-4 shadow-sm transition active:scale-[0.98] ${
                      selectedProblem ===
                      problem.id
                        ? "border-sky-500 ring-2 ring-sky-100"
                        : "border-slate-200"
                    }`}
                  >

                    <div className="text-2xl mb-2">
                      {problem.icon}
                    </div>

                    <p className="font-semibold text-sm text-slate-900">
                      {problem.title}
                    </p>

                    <p className="text-xs text-sky-600 mt-1">
                      Find service →
                    </p>

                  </button>
                )
              )}

            </div>

          </section>
        )}

        {/* SUPPORT */}

        <section className="mt-5 bg-slate-900 rounded-2xl p-4 text-white">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div>

              <p className="font-bold">
                Not sure what service you need?
              </p>

              <p className="text-sm text-slate-300">
                Talk to QuickSeva support and explain your problem.
              </p>

            </div>

            <div className="flex gap-2">

              <a
                href="tel:7661045308"
                className="px-4 py-2 rounded-xl bg-emerald-500 font-semibold text-sm"
              >
                📞 Call
              </a>

              <a
                href="https://wa.me/917661045308"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-green-500 font-semibold text-sm"
              >
                WhatsApp
              </a>

            </div>

          </div>

        </section>

        {/* SEARCH RESULT */}

        {search && (
          <section className="mt-6">

            <div className="flex items-center justify-between mb-3">

              <div>

                <h2 className="font-bold text-lg">
                  Services for "{search}"
                </h2>

                <p className="text-sm text-slate-500">
                  Choose the service that matches your problem.
                </p>

              </div>

              <button
                type="button"
                onClick={clearSearch}
                className="text-sm text-sky-600 font-semibold"
              >
                Clear
              </button>

            </div>

          </section>
        )}

        {/* SERVICES */}

        <section className="mt-6">

          {!search && (
            <div className="mb-4">

              <h2 className="text-xl font-bold text-slate-900">
                All AC Services
              </h2>

              <p className="text-sm text-slate-500">
                Transparent pricing. Verified technicians.
              </p>

            </div>
          )}

          {filteredSections.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center">

              <div className="text-4xl mb-3">
                🔍
              </div>

              <h3 className="font-bold text-lg">
                We couldn't find that service
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try another search or call us for help.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 px-5 py-3 rounded-xl bg-sky-500 text-white font-semibold"
              >
                Show all services
              </button>

            </div>
          ) : (
            <div className="space-y-8">

              {filteredSections.map(
                (section) => (
                  <section key={section.id}>

                    <div className="flex items-center gap-3 mb-3">

                      <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center text-2xl">
                        {section.icon}
                      </div>

                      <div>

                        <h3 className="font-bold text-lg text-slate-900">
                          {section.title}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {section.tagline}
                        </p>

                      </div>

                    </div>

                    <div className="grid gap-3">

                      {section.items.map(
                        (item) => (
                          <article
                            key={item.id}
                            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
                          >

                            <div className="flex flex-col gap-4">

                              <div>

                                <div className="flex flex-wrap items-center gap-2">

                                  <h4 className="font-bold text-slate-900">
                                    {item.name}
                                  </h4>

                                  {item.tag && (
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                                      ⭐ {item.tag}
                                    </span>
                                  )}

                                </div>

                                <p className="text-sm text-slate-600 mt-1">
                                  {item.desc}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-3">

                                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg">
                                    ⏱ {item.time}
                                  </span>

                                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-lg">
                                    🛡 {item.warranty}
                                  </span>

                                </div>

                              </div>

                              <div className="flex items-center justify-between gap-3 pt-3 border-t">

                                <div>

                                  <p className="text-xs text-slate-500">
                                    Starting from
                                  </p>

                                  <p className="text-xl font-bold text-slate-900">
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
                                  className={`px-5 py-3 rounded-xl font-bold text-white shadow-sm transition ${
                                    bookingId ===
                                    item.id
                                      ? "bg-slate-400"
                                      : "bg-sky-500 hover:bg-sky-600 active:scale-95"
                                  }`}
                                >
                                  {bookingId ===
                                  item.id
                                    ? "Opening..."
                                    : "Book Now →"}
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

        {/* REVIEWS */}

        {!search && (
          <section className="mt-10">

            <div className="bg-white rounded-3xl border p-5 shadow-sm">

              <div className="flex items-center gap-4">

                <div>

                  <p className="text-3xl font-bold">
                    4.9 ⭐
                  </p>

                  <p className="text-xs text-slate-500">
                    Based on 1,200+ ratings
                  </p>

                </div>

                <div className="flex-1">

                  {[5, 4, 3, 2, 1].map(
                    (star) => (
                      <div
                        key={star}
                        className="flex items-center gap-2"
                      >

                        <span className="text-xs w-5">
                          {star}★
                        </span>

                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">

                          <div
                            className="h-full bg-emerald-500 rounded-full"
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

              <div className="flex gap-3 overflow-x-auto mt-5 pb-2">

                {REVIEWS.map(
                  (review) => (
                    <div
                      key={review.name}
                      className="min-w-[270px] bg-slate-50 border rounded-2xl p-4"
                    >

                      <div className="flex items-center gap-3">

                        <img
                          src={review.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div>

                          <p className="font-semibold text-sm">
                            {review.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {review.city}
                          </p>

                        </div>

                      </div>

                      <p className="text-yellow-500 text-sm mt-2">
                        {"⭐".repeat(
                          review.rating
                        )}
                      </p>

                      <p className="text-sm text-slate-700 mt-2">
                        {review.review}
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        {review.date}
                      </p>

                      <span className="inline-block mt-3 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        ✓ Verified Booking
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* TRUST */}

        <section className="mt-6 grid grid-cols-3 gap-2">

          <div className="bg-white border rounded-2xl p-3 text-center">

            <div className="text-xl">
              🛡️
            </div>

            <p className="text-xs font-semibold mt-1">
              Verified Pros
            </p>

          </div>

          <div className="bg-white border rounded-2xl p-3 text-center">

            <div className="text-xl">
              💰
            </div>

            <p className="text-xs font-semibold mt-1">
              Clear Pricing
            </p>

          </div>

          <div className="bg-white border rounded-2xl p-3 text-center">

            <div className="text-xl">
              ⭐
            </div>

            <p className="text-xs font-semibold mt-1">
              Rated Service
            </p>

          </div>

        </section>

      </main>

      {/* FLOATING CART — same behavior as Electrician page */}
      <ViewCartBar />

    </div>
  );
}