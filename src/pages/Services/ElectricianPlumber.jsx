import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Electrician.css";

// =========================================================
// BANNER
// =========================================================

import bannerElectrician from "../../assets/eletrican banner.png";

// =========================================================
// SWITCH & SOCKET
// =========================================================

import allfans from "../../assets/allfans.png";
import switchs from "../../assets/switch.jpg";
import switchboards from "../../assets/switchboard.jpg";
import newbox from "../../assets/newswitchboard.jpg";

// =========================================================
// FAN
// =========================================================

import fanrepairs from "../../assets/fan repair.png";
import regulator from "../../assets/fan regulator.png";
import karbanfan from "../../assets/Karban fan.png";

// =========================================================
// LIGHTS
// =========================================================

import fancylight from "../../assets/Fancylight.png";
import Blub from "../../assets/blub.png";
import Tubelight from "../../assets/tubelight.png";
import Cellinglight from "../../assets/cellinglight.png";
import Hanglight from "../../assets/hanginglight.png";
import chandelier from "../../assets/chandler.png";

// =========================================================
// WIRING
// =========================================================

import Internal from "../../assets/internal.png";
import External from "../../assets/external.png";

// =========================================================
// DOORBELL
// =========================================================

import Regularbell from "../../assets/regulardoorbell.png";
import videoDoorbell from "../../assets/videodoorbell.png";

// =========================================================
// FUSE / METER
// =========================================================

import Mcb from "../../assets/mcb.png";
import Inverterfuse from "../../assets/inverterfuse.png";
import Submeter from "../../assets/submeter.png";

// =========================================================
// TV
// =========================================================

import Tvinstall from "../../assets/tvinstall.png";
import Tvuninstall from "../../assets/tvuninstall.png";

// =========================================================
// INVERTER
// =========================================================

import Inverterinstall from "../../assets/inverterinstall.png";
import InverterService from "../../assets/inverterservice.png";
import InverterCheck from "../../assets/invertercheckup.png";
import Inverteruninstall from "../../assets/inverteruninstall.png";

// =========================================================
// STABILIZER
// =========================================================

import Stabizer from "../../assets/stabilizer.png";

// =========================================================
// CART
// =========================================================

import { useCart } from "../../utils/CartContext";

// =========================================================
// ONCALL PROJECT THEME
// =========================================================

const THEME = {
  navy: "#0B1D36",
  teal: "#0D9488",
  sky: "#0EA5E9",
  mist: "#F1F5F9",
  cloud: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  border: "#CBD5E1",
};

// =========================================================
// SUPPORT
// =========================================================

const SUPPORT_PHONE = "7661045308";

const whatsappMessage = encodeURIComponent(
  "Hi OnCall, I need help with Electrical service."
);

// =========================================================
// CUSTOMER REVIEWS
// =========================================================

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

// =========================================================
// ELECTRICIAN SERVICES
// =========================================================

const SERVICES = [
  // =======================================================
  // SWITCH & SOCKET
  // =======================================================

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

  // =======================================================
  // FAN SERVICES
  // =======================================================

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

  // =======================================================
  // LIGHTS & CHANDELIER
  // =======================================================

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

  // =======================================================
  // WIRING
  // =======================================================

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

  // =======================================================
  // DOORBELL
  // =======================================================

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

  // =======================================================
  // FUSE & SAFETY
  // =======================================================

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

  // =======================================================
  // METER
  // =======================================================

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

  // =======================================================
  // TV
  // =======================================================

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

  // =======================================================
  // INVERTER
  // =======================================================

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

  // =======================================================
  // STABILIZER
  // =======================================================

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

// =========================================================
// PROBLEMS
// =========================================================

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

// =========================================================
// HELPER
// =========================================================

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

// =========================================================
// COMPONENT
// =========================================================

export default function ElectricianPlumber() {
  const navigate = useNavigate();

  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);

  // =======================================================
  // FILTER SERVICES
  // =======================================================

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
          ${item.tag || ""}
        `.toLowerCase();

        return text.includes(query);
      }),
    })).filter((section) => section.items.length > 0);
  }, [search]);

  // =======================================================
  // SEARCH
  // =======================================================

  const handleSearch = (value) => {
    setSearch(value);
    setSelectedProblem("");
  };

  const handleProblem = (problem) => {
    setSelectedProblem(problem.id);
    setSearch(problem.search);
  };

  const clearSearch = () => {
    setSearch("");
    setSelectedProblem("");
  };

  // =======================================================
  // BOOK SERVICE
  // =======================================================

  const handleBook = (section, item) => {
    setBookingId(item.id);

    addItem({
      id: item.id,
      name: item.name,
      service: "Electrician",
      category: section.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    });

    setTimeout(() => {
      navigate("/cart");
    }, 250);
  };

  // =======================================================
  // PROBLEM CARD FLOW
  //
  // 1 → 2 → 3 → 4 → 5 → 6 → 1
  // =======================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProblemIndex((prev) => {
        return (prev + 1) % PROBLEMS.length;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // =======================================================
  // JSX
  // =======================================================

  return (
    <div
      className="electrician-page min-h-screen pb-28"
      style={{
        backgroundColor: THEME.mist,
        color: THEME.text,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{
          backgroundColor: "rgba(255,255,255,0.96)",
          borderColor: THEME.border,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="electrician-icon-btn"
            style={{
              backgroundColor: THEME.mist,
              color: THEME.navy,
            }}
          >
            ←
          </button>

          <div className="text-center">
            <h1
              className="font-bold text-lg"
              style={{
                color: THEME.navy,
              }}
            >
              Electrician
            </h1>

            <p
              className="text-xs"
              style={{
                color: THEME.muted,
              }}
            >
              Professional electrical services
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="electrician-icon-btn relative"
            style={{
              backgroundColor: "#E0F2FE",
              color: THEME.sky,
            }}
          >
            🛒

            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{
                  backgroundColor: THEME.teal,
                }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative">
        <div className="relative h-[230px] sm:h-[300px] overflow-hidden">
          
          <img
            src={bannerElectrician}
            alt="Electrician Services"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(11,29,54,.94), rgba(11,29,54,.55), rgba(13,148,136,.15))",
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-5 h-full flex items-center">
            <div className="max-w-xl text-white">

              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
                style={{
                  backgroundColor: "rgba(14,165,233,.18)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                ⚡ Trusted OnCall Service
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Expert Electricians

                <span
                  className="block"
                  style={{
                    color: "#67E8F9",
                  }}
                >
                  At Your Doorstep
                </span>
              </h2>

              <p className="mt-3 text-sm sm:text-base text-white/85">
                Fast, reliable and professional electrical services for
                your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-5xl mx-auto px-4">

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="-mt-6 relative z-20">
          <div
            className="rounded-2xl p-3 shadow-xl border"
            style={{
              backgroundColor: THEME.cloud,
              borderColor: THEME.border,
            }}
          >
            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔍
              </span>

              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search electrician services..."
                className="w-full pl-11 pr-10 py-3.5 rounded-xl outline-none border text-sm"
                style={{
                  backgroundColor: THEME.mist,
                  borderColor: THEME.border,
                  color: THEME.text,
                }}
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                  style={{
                    color: THEME.muted,
                  }}
                >
                  ×
                </button>
              )}

            </div>
          </div>
        </section>

        {/* =================================================
            PROBLEM SELECTOR
        ================================================= */}

        <section className="mt-7">

          <div className="mb-4">
            <h2
              className="font-bold text-lg"
              style={{
                color: THEME.text,
              }}
            >
              What do you need help with?
            </h2>

            <p
              className="text-xs mt-1"
              style={{
                color: THEME.muted,
              }}
            >
              Select your problem to find the right service
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

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
                    relative
                    overflow-hidden
                    text-left
                    rounded-2xl
                    border
                    p-4
                    transition-all
                    duration-500
                    active:scale-[0.98]
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
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 transition-all duration-500"
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
                      className="block font-semibold text-sm transition-colors duration-500"
                      style={{
                        color: isFlowActive
                          ? "#FFFFFF"
                          : THEME.text,
                      }}
                    >
                      {problem.title}
                    </span>

                  </span>
                </button>
              );
            })}

          </div>
        </section>

        {/* =================================================
            SUPPORT
        ================================================= */}

        <section className="mt-7">

          <div
            className="rounded-3xl p-5 sm:p-6 text-white overflow-hidden relative"
            style={{
              backgroundColor: THEME.navy,
            }}
          >

            <div
              className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-30"
              style={{
                backgroundColor: THEME.teal,
              }}
            />

            <div
              className="absolute -left-16 -bottom-16 w-44 h-44 rounded-full opacity-20"
              style={{
                backgroundColor: THEME.sky,
              }}
            />

            <div className="relative z-10">

              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: "#67E8F9",
                }}
              >
                Need help?
              </p>

              <h3 className="text-xl font-bold mt-1">
                Not sure which service to choose?
              </h3>

              <p className="text-sm text-white/70 mt-2">
                Our support team can help you identify the right
                electrician service.
              </p>

              <div className="flex flex-wrap gap-3 mt-4">

                <a
                  href={`tel:${SUPPORT_PHONE}`}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm text-white"
                  style={{
                    backgroundColor: THEME.teal,
                  }}
                >
                  📞 Call Support
                </a>

                <a
                  href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl font-bold text-sm text-white"
                  style={{
                    backgroundColor: "#128C7E",
                  }}
                >
                  WhatsApp
                </a>

              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SERVICES
        ================================================= */}

        <section className="mt-8">

          <div className="mb-5">

            <h2
              className="text-2xl font-extrabold"
              style={{
                color: THEME.text,
              }}
            >
              Electrical Services
            </h2>

            <p
              className="text-sm mt-1"
              style={{
                color: THEME.muted,
              }}
            >
              Choose a service and book a professional electrician.
            </p>

          </div>

          {/* NO RESULTS */}

          {filteredSections.length === 0 ? (

            <div
              className="rounded-3xl border p-8 text-center"
              style={{
                backgroundColor: THEME.cloud,
                borderColor: THEME.border,
              }}
            >

              <div className="text-5xl mb-4">
                🔍
              </div>

              <h3
                className="font-bold text-lg"
                style={{
                  color: THEME.text,
                }}
              >
                No services found
              </h3>

              <p
                className="text-sm mt-2"
                style={{
                  color: THEME.muted,
                }}
              >
                Try another search or call us for help.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 px-5 py-3 rounded-xl text-white font-bold"
                style={{
                  backgroundColor: THEME.sky,
                }}
              >
                Show all services
              </button>

            </div>

          ) : (

            <div className="space-y-9">

              {filteredSections.map((section) => (

                <section key={section.id}>

                  {/* CATEGORY */}

                  <div className="flex items-center gap-3 mb-4">

                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{
                        background:
                          "linear-gradient(135deg, #E0F2FE, #CCFBF1)",
                      }}
                    >
                      {section.icon}
                    </div>

                    <div>

                      <h3
                        className="font-bold text-lg"
                        style={{
                          color: THEME.text,
                        }}
                      >
                        {section.title}
                      </h3>

                      <p
                        className="text-xs"
                        style={{
                          color: THEME.muted,
                        }}
                      >
                        {section.tagline}
                      </p>

                    </div>
                  </div>

                  {/* SERVICE CARDS */}

                  <div className="grid gap-4">

                    {section.items.map((item) => (

                      <article
                        key={item.id}
                        className="electrician-service-card rounded-2xl border overflow-hidden transition-all"
                        style={{
                          backgroundColor: THEME.cloud,
                          borderColor: THEME.border,
                          boxShadow:
                            "0 4px 16px rgba(15,23,42,.05)",
                        }}
                      >

                        <div className="flex flex-col sm:flex-row">

                          {/* IMAGE */}

                          <div className="sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden">

                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover electrician-service-image"
                            />

                          </div>

                          {/* CONTENT */}

                          <div className="p-4 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <h4
                                className="font-bold"
                                style={{
                                  color: THEME.text,
                                }}
                              >
                                {item.name}
                              </h4>

                              {item.tag && (

                                <span
                                  className="text-xs px-2.5 py-1 rounded-full font-bold"
                                  style={{
                                    backgroundColor: "#E0F2FE",
                                    color: "#0369A1",
                                  }}
                                >
                                  ⭐ {item.tag}
                                </span>

                              )}

                            </div>

                            <p
                              className="text-sm mt-1"
                              style={{
                                color: "#475569",
                              }}
                            >
                              {item.desc}
                            </p>

                            {/* META */}

                            <div className="flex flex-wrap gap-2 mt-3">

                              <span
                                className="text-xs px-2.5 py-1.5 rounded-lg"
                                style={{
                                  backgroundColor: THEME.mist,
                                  color: THEME.text,
                                }}
                              >
                                ⏱ {item.time}
                              </span>

                              <span
                                className="text-xs px-2.5 py-1.5 rounded-lg"
                                style={{
                                  backgroundColor: "#CCFBF1",
                                  color: "#0F766E",
                                }}
                              >
                                🛡 {item.warranty}
                              </span>

                            </div>

                            {/* PRICE + BUTTON */}

                            <div
                              className="flex items-center justify-between gap-3 mt-4 pt-4 border-t"
                              style={{
                                borderColor: THEME.border,
                              }}
                            >

                              <div>

                                <p
                                  className="text-xs"
                                  style={{
                                    color: THEME.muted,
                                  }}
                                >
                                  Starting from
                                </p>

                                <p
                                  className="text-xl font-extrabold"
                                  style={{
                                    color: THEME.navy,
                                  }}
                                >
                                  {formatPrice(item.price)}
                                </p>

                              </div>

                              <button
                                type="button"
                                disabled={bookingId === item.id}
                                onClick={() =>
                                  handleBook(section, item)
                                }
                                className="px-5 py-3 rounded-xl font-bold text-white shadow-sm transition active:scale-95"
                                style={{
                                  backgroundColor:
                                    bookingId === item.id
                                      ? "#94A3B8"
                                      : THEME.sky,
                                }}
                              >
                                {bookingId === item.id
                                  ? "Opening..."
                                  : "Book Now →"}
                              </button>

                            </div>
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

            <div
              className="rounded-3xl border p-5 shadow-sm"
              style={{
                backgroundColor: THEME.cloud,
                borderColor: THEME.border,
              }}
            >

              <div className="flex items-center gap-4">

                <div>

                  <p
                    className="text-3xl font-bold"
                    style={{
                      color: THEME.navy,
                    }}
                  >
                    4.9 ⭐
                  </p>

                  <p
                    className="text-xs"
                    style={{
                      color: THEME.muted,
                    }}
                  >
                    Based on 1,200+ ratings
                  </p>

                </div>

                <div className="flex-1">

                  {[5, 4, 3, 2, 1].map((star) => (

                    <div
                      key={star}
                      className="flex items-center gap-2"
                    >

                      <span
                        className="text-xs w-5"
                        style={{
                          color: THEME.text,
                        }}
                      >
                        {star}★
                      </span>

                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{
                          backgroundColor: THEME.mist,
                        }}
                      >

                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              star * 18
                            )}%`,
                            backgroundColor: THEME.teal,
                          }}
                        />

                      </div>
                    </div>

                  ))}

                </div>
              </div>

              {/* REVIEW CARDS */}

              <div className="flex gap-3 overflow-x-auto mt-5 pb-2">

                {REVIEWS.map((review) => (

                  <div
                    key={review.name}
                    className="min-w-[270px] rounded-2xl border p-4"
                    style={{
                      backgroundColor: THEME.mist,
                      borderColor: THEME.border,
                    }}
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={review.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>

                        <p
                          className="font-semibold text-sm"
                          style={{
                            color: THEME.text,
                          }}
                        >
                          {review.name}
                        </p>

                        <p
                          className="text-xs"
                          style={{
                            color: THEME.muted,
                          }}
                        >
                          {review.city}
                        </p>

                      </div>

                    </div>

                    <p className="text-yellow-500 text-sm mt-2">
                      {"⭐".repeat(review.rating)}
                    </p>

                    <p
                      className="text-sm mt-2"
                      style={{
                        color: "#475569",
                      }}
                    >
                      {review.review}
                    </p>

                    <p
                      className="text-xs mt-2"
                      style={{
                        color: "#94A3B8",
                      }}
                    >
                      {review.date}
                    </p>

                    <span
                      className="inline-block mt-3 text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: "#CCFBF1",
                        color: "#0F766E",
                      }}
                    >
                      ✓ Verified Booking
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            TRUST SECTION
        ================================================= */}

        <section className="mt-6 grid grid-cols-3 gap-2">

          {/* VERIFIED */}

          <div
            className="border rounded-2xl p-3 text-center"
            style={{
              backgroundColor: THEME.cloud,
              borderColor: THEME.border,
            }}
          >

            <div className="text-xl">
              🛡️
            </div>

            <p
              className="text-xs font-semibold mt-1"
              style={{
                color: THEME.text,
              }}
            >
              Verified Pros
            </p>

          </div>

          {/* PRICING */}

          <div
            className="border rounded-2xl p-3 text-center"
            style={{
              backgroundColor: THEME.cloud,
              borderColor: THEME.border,
            }}
          >

            <div className="text-xl">
              💰
            </div>

            <p
              className="text-xs font-semibold mt-1"
              style={{
                color: THEME.text,
              }}
            >
              Clear Pricing
            </p>

          </div>

          {/* RATING */}

          <div
            className="border rounded-2xl p-3 text-center"
            style={{
              backgroundColor: THEME.cloud,
              borderColor: THEME.border,
            }}
          >

            <div className="text-xl">
              ⭐
            </div>

            <p
              className="text-xs font-semibold mt-1"
              style={{
                color: THEME.text,
              }}
            >
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
              className="w-full text-white rounded-2xl px-5 py-4 shadow-2xl flex items-center justify-between transition active:scale-[0.99]"
              style={{
                backgroundColor: THEME.navy,
              }}
            >

              <div className="text-left">

                <p
                  className="text-xs"
                  style={{
                    color: "#CBD5E1",
                  }}
                >
                  {itemCount}{" "}
                  {itemCount === 1
                    ? "service"
                    : "services"}{" "}
                  in cart
                </p>

                <p className="font-bold">
                  View selected services
                </p>

              </div>

              <span
                className="font-bold"
                style={{
                  color: "#67E8F9",
                }}
              >
                View Cart →
              </span>

            </button>

          </div>
        </div>
      )}

    </div>
  );
}