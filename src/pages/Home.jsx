import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// UI
import QSBottomNav from "../UI/QSBottomNav.jsx";
import QSDrawer from "../UI/QSDrawer.jsx";
import QSServiceSkeleton from "../UI/QSServiceSkeleton.jsx";
import AppRatingPopup from "../components/AppRatingPopup";
import {
  detectCurrentLocation,
  getSavedLocation,
  saveLocation as saveSharedLocation,
} from "../utils/locationService";

// Logo
import qsLogo from "../assets/QS logo.png";

// Banner Images
import bannerElectrician from "../assets/eletrican banner.png";
import bannerPlumber from "../assets/plumber-banner.jpg";
import bannerAC from "../assets/ac-banner.jpg";
import bannerWashing from "../assets/washing-banner.jpg";
import bannerFridge from "../assets/fridge-banner.jpg.png";
import bannerCarpenter from "../assets/carpenter-banner.jpg";

// Service Images
import imgElectrician from "../assets/electrican.png";
import imgPlumber from "../assets/plumber service.png";
import imgAC from "../assets/ac service.png";
import imgWashing from "../assets/washing service.png";
import imgFridge from "../assets/Fridge service.png";
import imgCarpenter from "../assets/carpenter service.png";

// Images for services that did not have local assets yet.
// These are used in both the Popular Services cards and the rotating banner.
const beautyServiceImage =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85";

const bikeCarServiceImage =
  "https://images.unsplash.com/photo-1558980664-10e5a4f75c2f?auto=format&fit=crop&w=900&q=85";


export default function Home() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  const [problemText, setProblemText] = useState("");
  const [showHelpBox, setShowHelpBox] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");

  const [showLocationBox, setShowLocationBox] = useState(false);
  const [locationDetails, setLocationDetails] = useState(() =>
    getSavedLocation()
  );
  const [location, setLocation] = useState(() => {
    const saved = getSavedLocation();
    return saved?.displayName || saved?.address || "";
  });
  const [locationInput, setLocationInput] = useState(() => {
    const saved = getSavedLocation();
    return saved?.displayName || saved?.address || "";
  });
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [showProblemResult, setShowProblemResult] = useState(false);
  const [detectedService, setDetectedService] = useState(null);

  const fileInputRef = useRef(null);

  // =========================
  // USER
  // =========================
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // =========================
  // SUPPORT
  // =========================
  const QS_SUPPORT_PHONE = "7661045308";

  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva 👋 I want to book a service. Please assist me."
  );

  // =========================
  // SERVICES
  // =========================
  const categories = useMemo(
    () => [
      {
        label: "Electrician",
        shortLabel: "Electrician",
        icon: "⚡",
        img: imgElectrician,
        path: "/electrician-plumber",
        bannerImg: bannerElectrician,
        keywords: [
          "electrician",
          "electric",
          "switch",
          "fan",
          "light",
          "power",
          "socket",
          "wire",
          "wiring",
          "current",
        ],
      },
      {
        label: "Plumber",
        shortLabel: "Plumber",
        icon: "🚿",
        img: imgPlumber,
        path: "/plumber",
        bannerImg: bannerPlumber,
        keywords: [
          "plumber",
          "water",
          "tap",
          "pipe",
          "leak",
          "leaking",
          "sink",
          "bathroom",
          "toilet",
          "drain",
        ],
      },
      {
        label: "AC Service",
        shortLabel: "AC",
        icon: "❄️",
        img: imgAC,
        path: "/ac",
        bannerImg: bannerAC,
        keywords: [
          "ac",
          "air conditioner",
          "air conditioning",
          "cooling",
          "not cooling",
          "gas",
          "split ac",
          "window ac",
          "ac water",
        ],
      },
      {
        label: "Washing Machine",
        shortLabel: "Washing",
        icon: "🧺",
        img: imgWashing,
        path: "/washing-machine",
        bannerImg: bannerWashing,
        keywords: [
          "washing",
          "washing machine",
          "washer",
          "laundry",
          "spin",
          "dryer",
          "washing machine noise",
        ],
      },
      {
        label: "Fridge Repair",
        shortLabel: "Fridge",
        icon: "🧊",
        img: imgFridge,
        path: "/refrigerator",
        bannerImg: bannerFridge,
        keywords: [
          "fridge",
          "refrigerator",
          "freezer",
          "cooling",
          "ice",
          "fridge not cooling",
        ],
      },
      {
        label: "Carpenter",
        shortLabel: "Carpenter",
        icon: "🪚",
        img: imgCarpenter,
        path: "/carpenter",
        bannerImg: bannerCarpenter,
        keywords: [
          "carpenter",
          "wood",
          "door",
          "furniture",
          "table",
          "chair",
          "cupboard",
          "wardrobe",
          "woodwork",
        ],
      },
      {
        label: "Beauty Salon",
        shortLabel: "Beauty & Salon",
        icon: "💄",
        img: beautyServiceImage,
        path: "/beauty-salon",
        bannerImg: beautyServiceImage,
        keywords: [
          "beauty",
          "salon",
          "hair",
          "makeup",
          "beauty service",
          "haircut",
          "facial",
          "treatment",
        ],
      },
      {
        label: "Bike & Car Service",
        shortLabel: "Bike & Car",
        icon: "🚗",
        img: bikeCarServiceImage,
        path: "/bike-car",
        bannerImg: bikeCarServiceImage,
        keywords: [
          "bike",
          "car",
          "vehicle",
          "servicing",
          "maintenance",
          "repair",
          "tire",
          "oil",
          "brake",
          "ground",
        ],
      },
    ],
    []
  );

  // =========================
  // LOADING
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // =========================
  // VOICE SUPPORT
  // =========================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setVoiceSupported(Boolean(SpeechRecognition));
  }, []);

  // =========================
  // AUTO BANNER
  // =========================
  useEffect(() => {
    if (!categories.length) return;

    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % categories.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [categories.length]);

  // =========================
  // ACTIVE BANNER
  // =========================
  const activeBanner =
    categories[bannerIndex] || categories[0];

  // =========================
  // SERVICE DETECTION
  // =========================
  const detectService = (text) => {
    const cleanText = text.toLowerCase().trim();

    if (!cleanText) return null;

    let bestService = null;
    let bestScore = 0;

    categories.forEach((service) => {
      let score = 0;

      service.keywords.forEach((keyword) => {
        if (cleanText.includes(keyword.toLowerCase())) {
          // Exact/common service names get stronger weight
          if (keyword === service.label.toLowerCase()) {
            score += 5;
          } else {
            score += 2;
          }
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestService = service;
      }
    });

    return bestService;
  };

  // =========================
  // HANDLE PROBLEM SUBMIT
  // =========================
  const handleProblemSubmit = () => {
    const text = problemText.trim();

    if (!text) {
      setShowHelpBox(true);
      return;
    }

    const service = detectService(text);

    if (service) {
      setDetectedService(service);
      setShowProblemResult(true);
    } else {
      setDetectedService(null);
      setShowProblemResult(true);
    }
  };

  // =========================
  // VOICE INPUT
  // =========================
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome on Android/Desktop or type your problem."
      );
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event?.results?.[0]?.[0]?.transcript || "";

      if (transcript) {
        setProblemText((prev) => {
          const oldText = prev.trim();

          if (!oldText) return transcript;

          return `${oldText} ${transcript}`;
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event?.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Unable to start voice recognition:", error);
      setIsListening(false);
    }
  };

  // =========================
  // FILE SELECTION
  // =========================
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    // Only create a preview for image files
    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);

      setFilePreview((oldUrl) => {
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }

        return previewUrl;
      });
    } else {
      setFilePreview("");
    }

    setShowHelpBox(true);
  };

  // =========================
  // CLEANUP FILE PREVIEW
  // =========================
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // =========================
  // LOCATION
  // =========================
  const handleAutoLocation = async ({
    closeAfter = false,
    silent = false,
  } = {}) => {
    setDetectingLocation(true);

    if (!silent) {
      setLocationError("");
    }

    try {
      const detected = await detectCurrentLocation();
      const displayName =
        detected?.displayName ||
        detected?.address ||
        "Current location";

      setLocationDetails(detected);
      setLocation(displayName);
      setLocationInput(displayName);
      setLocationError("");

      if (closeAfter) {
        setShowLocationBox(false);
      }
    } catch (error) {
      console.error(
        "QuickSeva: GPS location error",
        error
      );

      setLocationError(
        error?.message ||
          "Unable to detect your location. Please try again."
      );
    } finally {
      setDetectingLocation(false);
    }
  };

  // Automatically detect the location once on the homepage when
  // there is no saved location. The customer can still change it.
  useEffect(() => {
    const saved = getSavedLocation();

    if (saved) {
      const displayName =
        saved.displayName || saved.address || "";
      setLocationDetails(saved);
      setLocation(displayName);
      setLocationInput(displayName);
      return;
    }

    handleAutoLocation({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveManualLocation = () => {
    const cleanLocation = locationInput.trim();

    if (!cleanLocation) {
      setLocationError("Please enter your service location.");
      return;
    }

    const saved = saveSharedLocation({
      address: cleanLocation,
      displayName: cleanLocation,
      addressLine1: "",
      addressLine2: cleanLocation,
      landmark: "",
      city: "",
      postalCode: "",
      latitude: null,
      longitude: null,
      accuracy: null,
      source: "manual",
    });

    setLocationDetails(saved);
    setLocation(cleanLocation);
    setLocationInput(cleanLocation);
    setLocationError("");
    setShowLocationBox(false);
  };

  // =========================
  // BOOK SERVICE
  // =========================
  const openService = (service) => {
    if (!service?.path) return;

    navigate(service.path);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-28">
      {/* =========================================
          HEADER
      ========================================== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* LOGO */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shadow-sm active:scale-95 transition"
            aria-label="Open menu"
          >
            <img
              src={qsLogo}
              alt="QuickSeva"
              className="w-full h-full object-cover"
            />
          </button>

          {/* TITLE */}
          <div className="text-center flex-1 px-3">
            <h1 className="text-base sm:text-lg font-bold text-gray-900">
              {user
                ? `Hi, ${user.name || "there"} 👋`
                : "Welcome to QuickSeva"}
            </h1>

            <button
              type="button"
              onClick={() => setShowLocationBox(true)}
              className="text-xs text-gray-500 mt-0.5 max-w-full truncate"
            >
              📍{" "}
              {detectingLocation
                ? "Detecting your location..."
                : location
                ? location
                : "Add your service location"}
            </button>
          </div>

          {/* LOGIN / PROFILE */}
          {user ? (
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl active:scale-95 transition"
              aria-label="Profile"
            >
              👤
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm active:scale-95 transition"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main className="px-4 pt-4">
        {/* =========================================
            LOCATION CARD
        ========================================== */}
        <button
          type="button"
          onClick={() => setShowLocationBox(true)}
          className="w-full bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 text-left active:scale-[0.99] transition"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
            📍
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">
              Service location
            </p>

            <p className="font-semibold text-sm truncate">
              {detectingLocation
                ? "Detecting your location..."
                : location || "Add your location"}
            </p>
          </div>

          <span className="text-blue-600 font-semibold text-sm">
            Change
          </span>
        </button>

        {/* =========================================
            MAIN PROBLEM SEARCH
        ========================================== */}
        <section className="mt-4">
          <h2 className="text-xl font-bold text-gray-900">
            What do you need help with?
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Tell us the problem. We'll help you find the right service.
          </p>

          <div className="mt-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
            <div className="flex items-center gap-2">
              <span className="text-xl pl-2">🔍</span>

              <input
                type="text"
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleProblemSubmit();
                  }
                }}
                placeholder="AC is not cooling..."
                className="flex-1 min-w-0 outline-none text-sm py-3 bg-transparent"
                aria-label="Describe your problem"
              />

              {/* VOICE */}
              <button
                type="button"
                onClick={startVoiceInput}
                disabled={!voiceSupported}
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition ${
                  isListening
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : voiceSupported
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
                title={
                  voiceSupported
                    ? "Speak your problem"
                    : "Voice input not supported"
                }
                aria-label="Voice input"
              >
                {isListening ? "🔴" : "🎤"}
              </button>

              {/* SEARCH */}
              <button
                type="button"
                onClick={handleProblemSubmit}
                className="px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold active:scale-95 transition"
              >
                Find
              </button>
            </div>

            {isListening && (
              <p className="text-xs text-red-500 px-3 pb-2">
                Listening... tell Quickly what happened.
              </p>
            )}
          </div>

          {/* PHOTO / VIDEO */}
          <div className="mt-2 flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 shadow-sm active:scale-[0.98] transition"
            >
              📷 Show us the problem
            </button>

            <button
              type="button"
              onClick={() => {
                setProblemText("");
                setSelectedFile(null);
                setFilePreview("");
                setShowHelpBox(true);
              }}
              className="px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm active:scale-[0.98] transition"
            >
              🤷
            </button>
          </div>
        </section>

        {/* =========================================
            AUTO BANNER
        ========================================== */}
        <section className="mt-5">
          <div
            className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden shadow-md bg-gray-200"
            style={{
              backgroundImage: `url("${activeBanner.bannerImg}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                  {activeBanner.icon} QuickSeva
                </div>

                <h2 className="text-xl sm:text-2xl font-bold mt-3">
                  {activeBanner.label}
                </h2>

                <p className="text-sm opacity-90">
                  Trusted professionals at your doorstep
                </p>
              </div>

              <button
                type="button"
                onClick={() => openService(activeBanner)}
                className="self-start px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md active:scale-95 transition"
              >
                Book {activeBanner.shortLabel} →
              </button>
            </div>
          </div>

          {/* BANNER DOTS */}
          <div className="flex justify-center gap-1.5 mt-2">
            {categories.map((service, index) => (
              <button
                key={service.label}
                type="button"
                onClick={() => setBannerIndex(index)}
                aria-label={`Show ${service.label}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === bannerIndex
                    ? "w-6 bg-blue-600"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </section>

        {/* =========================================
            POPULAR SERVICES
        ========================================== */}
        <section className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Popular Services
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Choose a service or tell us your problem
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-3">
              <QSServiceSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {categories.map((service) => (
                <button
                  key={service.label}
                  type="button"
                  onClick={() => openService(service)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left active:scale-[0.97] transition-all"
                >
                  <div className="p-3">
                    <div className="w-full aspect-square rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={service.img}
                        alt={service.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 mt-3">
                      <span className="text-base">
                        {service.icon}
                      </span>

                      <span className="font-semibold text-sm text-gray-800 truncate">
                        {service.label}
                      </span>
                    </div>

                    <div className="mt-2 text-blue-600 text-xs font-semibold">
                      Book Service →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* =========================================
            DON'T KNOW WHAT'S WRONG
        ========================================== */}
        <section className="mt-5">
          <button
            type="button"
            onClick={() => setShowHelpBox(true)}
            className="w-full rounded-2xl bg-blue-600 text-white p-4 shadow-md text-left active:scale-[0.99] transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl">
                🤷
              </div>

              <div className="flex-1">
                <h3 className="font-bold">
                  Don't know what's wrong?
                </h3>

                <p className="text-xs text-blue-100 mt-1">
                  Describe the problem and Quickly will help you choose.
                </p>
              </div>

              <span className="text-xl">→</span>
            </div>
          </button>
        </section>

        {/* =========================================
            QUICK ACTIONS
        ========================================== */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              type="button"
              onClick={() => navigate("/my")}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left active:scale-[0.98] transition"
            >
              <span className="text-2xl">📋</span>

              <h3 className="font-semibold text-sm mt-2">
                My Bookings
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Track your services
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                window.open(
                  `https://wa.me/${QS_SUPPORT_PHONE}?text=${whatsappMessage}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left active:scale-[0.98] transition"
            >
              <span className="text-2xl">💬</span>

              <h3 className="font-semibold text-sm mt-2">
                Need Help?
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Chat with QuickSeva
              </p>
            </button>
          </div>
        </section>

        {/* =========================================
            WHY QUICKSEVA
        ========================================== */}
        <section className="mt-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">
              Why customers use QuickSeva
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Simple, clear and convenient service booking
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* FAST RESPONSE */}
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <div className="text-3xl">⚡</div>

              <h3 className="font-semibold text-sm text-gray-800 mt-2">
                Fast Response
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Quick booking confirmation
              </p>
            </div>

            {/* PROVIDERS */}
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <div className="text-3xl">👨‍🔧</div>

              <h3 className="font-semibold text-sm text-gray-800 mt-2">
                Verified Providers
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Know who is coming
              </p>
            </div>

            {/* PRICING */}
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <div className="text-3xl">💰</div>

              <h3 className="font-semibold text-sm text-gray-800 mt-2">
                Clear Pricing
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Know charges before confirming
              </p>
            </div>

            {/* SUPPORT */}
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <div className="text-3xl">🛡️</div>

              <h3 className="font-semibold text-sm text-gray-800 mt-2">
                Service Support
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                We're here when you need help
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            SUPPORT BANNER
        ========================================== */}
        <section className="mt-5 mb-2">
          <div className="bg-gray-900 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📞</div>

              <div className="flex-1">
                <h3 className="font-bold text-sm">
                  Need help booking?
                </h3>

                <p className="text-xs text-gray-300 mt-1">
                  Our team can help you choose the right service.
                </p>
              </div>

              <a
                href={`tel:${QS_SUPPORT_PHONE}`}
                className="px-4 py-2 rounded-xl bg-white text-gray-900 text-xs font-bold active:scale-95 transition"
              >
                Call
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
          DRAWER
      ========================================== */}
      <QSDrawer
        open={menuOpen}
        setOpen={setMenuOpen}
        user={user}
      />

      {/* =========================================
          BOTTOM NAV
      ========================================== */}
      <QSBottomNav />

      {/* =========================================
          APP RATING
      ========================================== */}
      <AppRatingPopup />

      {/* =========================================
          LOCATION MODAL
      ========================================== */}
      {showLocationBox && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Service Location
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  We use your location to find nearby professionals.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLocationBox(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                handleAutoLocation({ closeAfter: true })
              }
              disabled={detectingLocation}
              className={`w-full mt-4 rounded-2xl border px-4 py-3.5 flex items-center gap-3 text-left transition ${
                detectingLocation
                  ? "bg-gray-100 border-gray-200"
                  : "bg-blue-50 border-blue-100 hover:bg-blue-100"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                📍
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${
                    detectingLocation
                      ? "text-gray-400"
                      : "text-blue-700"
                  }`}
                >
                  {detectingLocation
                    ? "Detecting your location..."
                    : "Use my current location"}
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  GPS will fill your area, city and pincode.
                </p>
              </div>

              <span className="text-blue-600 font-bold">›</span>
            </button>

            {locationError && (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-semibold text-red-700">
                  ⚠️ {locationError}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-[11px] font-bold text-gray-400">
                OR ENTER MANUALLY
              </span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                Area / Location
              </label>

              <input
                type="text"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setLocationError("");
                }}
                placeholder="Example: Kukatpally, Hyderabad"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm"
              />
            </div>

            {locationDetails?.latitude != null &&
              locationDetails?.longitude != null && (
                <div className="mt-3 rounded-2xl bg-gray-50 border border-gray-100 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🛰️</span>
                    <p className="text-xs text-gray-600">
                      GPS coordinates saved for this location
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${locationDetails.latitude},${locationDetails.longitude}`
                        )}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="mt-2 text-xs font-bold text-blue-600"
                  >
                    Open in Google Maps →
                  </button>
                </div>
              )}

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowLocationBox(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveManualLocation}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          HELP MODAL
      ========================================== */}
      {showHelpBox && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Tell Quickly
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  You don't need to know the technical name.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHelpBox(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* TEXT */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-600">
                What's happening?
              </label>

              <textarea
                value={problemText}
                onChange={(e) =>
                  setProblemText(e.target.value)
                }
                rows={4}
                placeholder="Example: My AC is running but not cooling..."
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 resize-none text-sm"
              />
            </div>

            {/* VOICE */}
            <button
              type="button"
              onClick={startVoiceInput}
              disabled={!voiceSupported}
              className={`w-full mt-3 py-3 rounded-xl font-semibold text-sm ${
                isListening
                  ? "bg-red-100 text-red-600"
                  : voiceSupported
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {isListening
                ? "🔴 Listening..."
                : voiceSupported
                ? "🎤 Speak your problem"
                : "🎤 Voice not supported"}
            </button>

            {/* FILE */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-2 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm"
            >
              📷 Add Photo / Video
            </button>

            {/* PREVIEW */}
            {selectedFile && (
              <div className="mt-3 rounded-xl bg-gray-50 p-3">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Selected problem"
                    className="w-full max-h-48 object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-sm text-gray-600">
                    📎 {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            {/* UNKNOWN SERVICE */}
            <button
              type="button"
              onClick={() => {
                setProblemText(
                  "I don't know what's wrong. Please help me identify the service."
                );
              }}
              className="w-full mt-3 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm"
            >
              🤷 I don't know what's wrong
            </button>

            {/* FIND */}
            <button
              type="button"
              onClick={() => {
                setShowHelpBox(false);
                handleProblemSubmit();
              }}
              className="w-full mt-4 py-3.5 rounded-xl bg-blue-600 text-white font-bold"
            >
              Find My Service →
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          DETECTED SERVICE MODAL
      ========================================== */}
      {showProblemResult && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-end sm:items-center justify-center p-3">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl">
                {detectedService?.icon || "🤝"}
              </div>

              <h2 className="text-xl font-bold mt-3">
                {detectedService
                  ? "We found a possible service"
                  : "Let's find the right service"}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {detectedService
                  ? `Based on "${problemText}"`
                  : "We couldn't automatically identify the service."}
              </p>
            </div>

            {detectedService ? (
              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={detectedService.img}
                    alt={detectedService.label}
                    className="w-20 h-20 rounded-xl object-contain bg-white"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Suggested service
                    </p>

                    <h3 className="font-bold text-lg">
                      {detectedService.label}
                    </h3>

                    {location && (
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-2">
                {categories.map((service) => (
                  <button
                    key={service.label}
                    type="button"
                    onClick={() => {
                      setShowProblemResult(false);
                      openService(service);
                    }}
                    className="p-3 rounded-xl bg-gray-50 text-left border border-gray-100"
                  >
                    <span className="text-xl">
                      {service.icon}
                    </span>

                    <p className="text-xs font-semibold mt-1">
                      {service.label}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowProblemResult(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm"
              >
                Choose Again
              </button>

              {detectedService && (
                <button
                  type="button"
                  onClick={() => {
                    setShowProblemResult(false);
                    openService(detectedService);
                  }}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}