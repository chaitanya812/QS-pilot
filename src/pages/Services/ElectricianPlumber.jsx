import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import bannerElectrician from "../../assets/eletrican banner.png";
import allfans from "../../assets/allfans.png";
import switchs from "../../assets/switch.jpg";
import switchboards from "../../assets/switchboard.jpg";
import newbox from "../../assets/newswitchboard.jpg";
import fanrepairs from "../../assets/fan repair.png";
import regulator from "../../assets/fan regulator.png";
import karbanfan from "../../assets/Karban fan.png";
import fancylight from "../../assets/Fancylight.png";
import Blub from "../../assets/blub.png";
import Tubelight from "../../assets/tubelight.png";
import Cellinglight from "../../assets/cellinglight.png";
import Hanglight from "../../assets/hanginglight.png";
import chandelier from "../../assets/chandler.png";
import Internal from "../../assets/internal.png";
import External from "../../assets/external.png";
import Regularbell from "../../assets/regulardoorbell.png";
import videoDoorbell from "../../assets/videodoorbell.png";
import Mcb from "../../assets/mcb.png";
import Inverterfuse from "../../assets/inverterfuse.png";
import Submeter from "../../assets/submeter.png";
import Tvinstall from "../../assets/tvinstall.png";
import Tvuninstall from "../../assets/tvuninstall.png";
import Inverterinstall from "../../assets/inverterinstall.png";
import InverterService from "../../assets/inverterservice.png";
import InverterCheck from "../../assets/invertercheckup.png";
import Inverteruninstall from "../../assets/inverteruninstall.png";
import Stabizer from "../../assets/stabilizer.png";

import { useCart } from "../../utils/CartContext";

/* =========================================================
   SUPPORT
========================================================= */

const SUPPORT_PHONE = "7661045308";

const whatsappMessage = encodeURIComponent(
  "Hi QuickSeva, I need help with Electrical service."
);

/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

const REVIEWS = [
  {
    name: "Rahul",
    city: "Hyderabad",
    rating: 5,
    review:
      "Electrician arrived on time and fixed the switchboard problem quickly.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2 days ago",
  },
  {
    name: "Priya",
    city: "Kondapur",
    rating: 5,
    review:
      "Fan installation was neat and professional. Booking was very easy.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "1 week ago",
  },
  {
    name: "Arjun",
    city: "Madhapur",
    rating: 4,
    review:
      "Technician explained the issue clearly and completed the work properly.",
    avatar: "https://randomuser.me/api/portraits/men/66.jpg",
    date: "3 weeks ago",
  },
];

/* =========================================================
   ELECTRICIAN SERVICES
========================================================= */

const SERVICES = [
  {
    id: "ep1",
    icon: "⚡",
    title: "Switch & Socket",
    tagline: "Repair and installation of switches and boards",
    items: [
      {
        id: "e1",
        name: "Switchboard Repair / Replacement",
        desc: "Fix or replace damaged switchboard safely",
        price: 99,
        tag: "Bestseller",
        time: "20–30 mins",
        warranty: "30 Days",
        image: switchboards,
      },
      {
        id: "e2",
        name: "Switch / Socket Repair / Replacement",
        desc: "Repair broken switches and loose sockets",
        price: 149,
        tag: "Popular",
        time: "20–40 mins",
        warranty: "30 Days",
        image: switchs,
      },
      {
        id: "e3",
        name: "New Switch Box Installation",
        desc: "Install a brand new switch box securely",
        price: 149,
        time: "25–40 mins",
        warranty: "30 Days",
        image: newbox,
      },
    ],
  },

  {
    id: "ep2",
    icon: "🌀",
    title: "Fan Services",
    tagline: "Repair, installation and regulator replacement",
    items: [
      {
        id: "e4",
        name: "Fan Repair",
        desc: "Fix fan not working, noise or slow speed",
        price: 149,
        tag: "Trending",
        time: "25–45 mins",
        warranty: "30 Days",
        image: fanrepairs,
      },
      {
        id: "e5",
        name: "Exhaust / Pedestal / Tower Fan Installation",
        desc: "Professional fan fitting with neat wiring",
        price: 99,
        time: "20–30 mins",
        warranty: "30 Days",
        image: allfans,
      },
      {
        id: "e6",
        name: "Fan Regulator Replacement",
        desc: "Replace faulty fan speed regulator",
        price: 79,
        time: "15–20 mins",
        warranty: "30 Days",
        image: regulator,
      },
      {
        id: "e21",
        name: "Karban Airzone Fan Installation",
        desc: "Install premium Airzone fan safely",
        price: 399,
        time: "30–45 mins",
        warranty: "30 Days",
        image: karbanfan,
      },
    ],
  },

  {
    id: "ep3",
    icon: "💡",
    title: "Lights & Chandelier",
    tagline: "Installation and replacement of lights",
    items: [
      {
        id: "e7",
        name: "Fancy Light Installation / Replacement",
        desc: "Install or replace designer fancy lights",
        price: 149,
        tag: "Popular",
        time: "20–35 mins",
        warranty: "30 Days",
        image: fancylight,
      },
      {
        id: "e8",
        name: "Tubelight Installation",
        desc: "Safe and quick tube light installation",
        price: 99,
        time: "15–20 mins",
        warranty: "30 Days",
        image: Tubelight,
      },
      {
        id: "e9",
        name: "Bulb Installation",
        desc: "Install bulb in any room or space",
        price: 49,
        time: "10 mins",
        warranty: "30 Days",
        image: Blub,
      },
      {
        id: "e10",
        name: "Ceiling Light Installation",
        desc: "Fix ceiling lights properly and safely",
        price: 89,
        time: "15–25 mins",
        warranty: "30 Days",
        image: Cellinglight,
      },
      {
        id: "e11",
        name: "Hanging Light Installation",
        desc: "Install hanging lights with proper support",
        price: 199,
        time: "25–40 mins",
        warranty: "30 Days",
        image: Hanglight,
      },
      {
        id: "e12",
        name: "Chandelier Installation",
        desc: "Expert chandelier fitting with care",
        price: 499,
        tag: "Premium",
        time: "40–60 mins",
        warranty: "45 Days",
        image: chandelier,
      },
    ],
  },

  {
    id: "ep4",
    icon: "🧰",
    title: "Wiring Work",
    tagline: "Safe internal and external wiring",
    items: [
      {
        id: "e13",
        name: "Internal Wiring (Per Meter)",
        desc: "New internal electrical wiring work",
        price: 40,
        time: "Depends on work",
        warranty: "30 Days",
        image: Internal,
      },
      {
        id: "e14",
        name: "External Wiring (Per Meter)",
        desc: "Safe and neat external wiring setup",
        price: 24,
        time: "Depends on work",
        warranty: "30 Days",
        image: External,
      },
    ],
  },

  {
    id: "ep5",
    icon: "🔔",
    title: "Doorbell",
    tagline: "Regular and smart video doorbell installation",
    items: [
      {
        id: "e15",
        name: "Regular Doorbell Installation",
        desc: "Install normal doorbell at your home",
        price: 99,
        time: "15–20 mins",
        warranty: "30 Days",
        image: Regularbell,
      },
      {
        id: "e16",
        name: "Video Doorbell Installation",
        desc: "Install smart video doorbell securely",
        price: 600,
        tag: "Bestseller",
        time: "40–60 mins",
        warranty: "45 Days",
        image: videoDoorbell,
      },
    ],
  },

  {
    id: "ep6",
    icon: "🛡️",
    title: "Fuse & Safety",
    tagline: "MCB and electrical safety services",
    items: [
      {
        id: "e17",
        name: "MCB / Fuse Repair",
        desc: "Fix tripping MCBs or blown fuses",
        price: 149,
        time: "20–30 mins",
        warranty: "30 Days",
        image: Mcb,
      },
    ],
  },

  {
    id: "ep7",
    icon: "⚙️",
    title: "Meter Work",
    tagline: "Sub-meter installation",
    items: [
      {
        id: "e18",
        name: "Sub Meter Installation",
        desc: "Install separate home / room meter",
        price: 249,
        time: "35–50 mins",
        warranty: "45 Days",
        image: Submeter,
      },
    ],
  },

  {
    id: "ep8",
    icon: "📺",
    title: "TV Services",
    tagline: "TV installation and safe removal",
    items: [
      {
        id: "e19",
        name: "TV Installation",
        desc: "Wall mount and setup your television",
        price: 299,
        time: "30–45 mins",
        warranty: "30 Days",
        image: Tvinstall,
      },
      {
        id: "e20",
        name: "TV Uninstallation",
        desc: "Remove TV safely without damage",
        price: 200,
        time: "20–30 mins",
        warranty: "30 Days",
        image: Tvuninstall,
      },
    ],
  },

  {
    id: "ep9",
    icon: "🔋",
    title: "Inverter",
    tagline: "Installation, service and repair",
    items: [
      {
        id: "e22",
        name: "Inverter Installation",
        desc: "Install inverter with proper connections",
        price: 450,
        tag: "Popular",
        time: "35–50 mins",
        warranty: "45 Days",
        image: Inverterinstall,
      },
      {
        id: "e23",
        name: "Inverter Fuse Replacement",
        desc: "Replace damaged inverter fuse",
        price: 99,
        time: "10–15 mins",
        warranty: "30 Days",
        image: Inverterfuse,
      },
      {
        id: "e24",
        name: "Inverter Servicing",
        desc: "Full health check and service of inverter",
        price: 249,
        time: "30–45 mins",
        warranty: "30 Days",
        image: InverterService,
      },
      {
        id: "e25",
        name: "Inverter Check-up",
        desc: "Basic inverter health inspection",
        price: 160,
        time: "15–25 mins",
        warranty: "30 Days",
        image: InverterCheck,
      },
      {
        id: "e26",
        name: "Inverter Uninstallation",
        desc: "Remove inverter safely and cleanly",
        price: 499,
        time: "30–45 mins",
        warranty: "30 Days",
        image: Inverteruninstall,
      },
    ],
  },

  {
    id: "ep10",
    icon: "⚙️",
    title: "Stabilizer",
    tagline: "Safe voltage protection",
    items: [
      {
        id: "e27",
        name: "Stabilizer Installation",
        desc: "Install stabilizer for safe voltage use",
        price: 149,
        time: "20–30 mins",
        warranty: "30 Days",
        image: Stabizer,
      },
    ],
  },
];

/* =========================================================
   PROBLEMS
========================================================= */

const PROBLEMS = [
  {
    id: "switch",
    icon: "⚡",
    title: "Switch problem",
    search: "switch",
  },
  {
    id: "fan",
    icon: "🌀",
    title: "Fan problem",
    search: "fan",
  },
  {
    id: "light",
    icon: "💡",
    title: "Light problem",
    search: "light",
  },
  {
    id: "power",
    icon: "🔌",
    title: "Power / MCB",
    search: "mcb",
  },
  {
    id: "inverter",
    icon: "🔋",
    title: "Inverter problem",
    search: "inverter",
  },
  {
    id: "wiring",
    icon: "🧰",
    title: "Need wiring",
    search: "wiring",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

/* =========================================================
   COMPONENT
========================================================= */

export default function ElectricianPlumber() {
  const navigate = useNavigate();

  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [bookingId, setBookingId] = useState(null);

  /* =======================================================
     FILTER SERVICES
  ======================================================= */

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return SERVICES;
    }

    return SERVICES.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const text = `
          ${section.title}
          ${section.tagline}
          ${item.name}
          ${item.desc}
        `.toLowerCase();

        return text.includes(query);
      }),
    })).filter((section) => section.items.length > 0);
  }, [search]);

  /* =======================================================
     PROBLEM
  ======================================================= */

  const handleProblem = (problem) => {
    setSelectedProblem(problem.id);
    setSearch(problem.search);

    setTimeout(() => {
      const element = document.getElementById(
        "electrician-services"
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  /* =======================================================
     BOOK NOW

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

      service: "Electrician",
      category: section.title,
      subService: item.name,

      description: item.desc,
      duration: item.time,
      warranty: item.warranty,

      image: item.image,
      tag: item.tag || "",
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
    <div className="min-h-screen bg-slate-50 pb-28">

      {/* ===================================================
          HEADER
      =================================================== */}

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
              Electrician
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-xl"
          >
            🛒

            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-4">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-3xl shadow-lg">

          <img
            src={bannerElectrician}
            alt="Electrician service"
            className="w-full h-56 sm:h-72 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">

            <div className="inline-flex bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs mb-2">
              ✓ Verified Professionals
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Electrical problem?
              <br />
              We'll take care of it.
            </h2>

            <p className="text-sm text-white/90 mt-1">
              Choose your problem or select a service below.
            </p>

          </div>
        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

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
              placeholder="Search electrical problem or service..."
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

        {/* =================================================
            PROBLEMS
        ================================================= */}

        {!search && (
          <section className="mt-5">

            <div className="mb-3">

              <h2 className="font-bold text-lg text-slate-900">
                What's wrong with your electrical system?
              </h2>

              <p className="text-sm text-slate-500">
                Pick your problem — we'll show the right service.
              </p>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              {PROBLEMS.map((problem) => (
                <button
                  key={problem.id}
                  type="button"
                  onClick={() => handleProblem(problem)}
                  className={`text-left bg-white border rounded-2xl p-4 shadow-sm transition active:scale-[0.98] ${
                    selectedProblem === problem.id
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
              ))}

            </div>

          </section>
        )}

        {/* =================================================
            SUPPORT
        ================================================= */}

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
                href={`tel:${SUPPORT_PHONE}`}
                className="px-4 py-2 rounded-xl bg-emerald-500 font-semibold text-sm"
              >
                📞 Call
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-green-500 font-semibold text-sm"
              >
                WhatsApp
              </a>

            </div>

          </div>

        </section>

        {/* =================================================
            SEARCH RESULT
        ================================================= */}

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

        {/* =================================================
            SERVICES
        ================================================= */}

        <section
          id="electrician-services"
          className="mt-6"
        >

          {!search && (
            <div className="mb-4">

              <h2 className="text-xl font-bold text-slate-900">
                All Electrical Services
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

              {filteredSections.map((section) => (

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

                    {section.items.map((item) => (

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
                                {formatPrice(item.price)}
                              </p>

                            </div>

                            <button
                              type="button"
                              disabled={bookingId === item.id}
                              onClick={() =>
                                handleBook(section, item)
                              }
                              className={`px-5 py-3 rounded-xl font-bold text-white shadow-sm transition ${
                                bookingId === item.id
                                  ? "bg-slate-400"
                                  : "bg-sky-500 hover:bg-sky-600 active:scale-95"
                              }`}
                            >
                              {bookingId === item.id
                                ? "Opening..."
                                : "Book Now →"}
                            </button>

                          </div>

                        </div>

                      </article>

                    ))}

                  </div>

                </section>

              ))}

            </div>

          )}

        </section>

        {/* =================================================
            REVIEWS
        ================================================= */}

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

                  {[5, 4, 3, 2, 1].map((star) => (

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

                  ))}

                </div>

              </div>

              <div className="flex gap-3 overflow-x-auto mt-5 pb-2">

                {REVIEWS.map((review) => (

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
                      {"⭐".repeat(review.rating)}
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

                ))}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            TRUST
        ================================================= */}

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

      {/* =================================================
          CART BAR
      ================================================= */}

      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">

          <div className="max-w-2xl mx-auto">

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="w-full bg-slate-900 text-white rounded-2xl px-5 py-4 shadow-2xl flex items-center justify-between"
            >

              <div className="text-left">

                <p className="text-xs text-slate-300">
                  {itemCount}{" "}
                  {itemCount === 1 ? "service" : "services"} in cart
                </p>

                <p className="font-bold">
                  View selected services
                </p>

              </div>

              <span className="font-bold">
                View Cart →
              </span>

            </button>

          </div>

        </div>
      )}

    </div>
  );
}