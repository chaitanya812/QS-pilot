import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerCarpenter from "../../assets/carpenter-banner.jpg";
import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

const SUPPORT_PHONE = "7661045308";

/* =========================================================
   REVIEWS
========================================================= */

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

/* =========================================================
   CARPENTER SERVICES
========================================================= */

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

/* =========================================================
   PROBLEM CARDS
========================================================= */

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

export default function CarpenterDetails() {
  const navigate = useNavigate();

  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva, I need help with Carpenter service."
  );

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

  /* =======================================================
     PROBLEM CLICK
  ======================================================= */

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
              Carpenter Services
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
            src={bannerCarpenter}
            alt="Carpenter service"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

          <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col justify-center text-white">
            <span className="text-sm font-semibold text-sky-300">
              QuickSeva Carpenter Services
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold mt-1 max-w-xl">
              Carpenter problem?
              <br />
              We'll take care of it.
            </h2>

            <p className="text-sm text-white/90 mt-2 max-w-lg">
              Door repair, furniture fixing, wardrobe work,
              bed repair and more at your doorstep.
            </p>

            <div className="flex gap-2 mt-4">
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
                className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold shadow"
              >
                📞 Call
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
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
              placeholder="Search carpenter services or problems..."
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
                What do you need help with?
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
                Not sure which carpenter service you need?
              </h3>

              <p className="text-sm text-white/70 mt-1">
                Talk to QuickSeva and we'll help you choose
                the right service.
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold"
              >
                Call
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
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
                  Try searching for door, furniture,
                  wardrobe, bed, cabinet or repair.
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
                        ₹{Number(item.price).toLocaleString("en-IN")}
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
            SERVICE SECTIONS
        ================================================= */}

        <section
          id="carpenter-services"
          className="mt-8 scroll-mt-24"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              All Carpenter Services
            </h2>

            <p className="text-sm text-slate-500">
              Choose the service that matches your carpentry
              problem
            </p>
          </div>

          <div className="space-y-8">
            {SERVICES.map((section) => (
              <section key={section.id}>
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
                            ₹{Number(item.price).toLocaleString("en-IN")}
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
                Reliable carpenter service at your doorstep
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
