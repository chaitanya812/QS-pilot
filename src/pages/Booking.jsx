import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../utils/CartContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  detectCurrentLocation as detectGPSLocation,
  getSavedLocation,
  saveLocation as saveSharedLocation,
} from "../utils/locationService";

// ------------------------------------------------------
// Firestore-safe cleaner
// ------------------------------------------------------
const firestoreSafe = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, value) =>
      value === undefined ? null : value
    )
  );

// ------------------------------------------------------
// Date helper
// ------------------------------------------------------
const getToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ------------------------------------------------------
// Time slots
// ------------------------------------------------------
const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

// ------------------------------------------------------
// Booking Page
// ------------------------------------------------------
export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { cart } = useCart();

  // ----------------------------------------------------
  // Cart
  // ----------------------------------------------------
  const cartItems = useMemo(() => {
    return Object.values(cart || {}).filter(Boolean);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item?.price) || 0;
      const qty = Number(item?.qty) > 0 ? Number(item.qty) : 1;

      return sum + price * qty;
    }, 0);
  }, [cartItems]);

  // ----------------------------------------------------
  // Booking state
  // ----------------------------------------------------
  const savedLocation = getSavedLocation();

  const [postalCode, setPostalCode] = useState(
    savedLocation?.postalCode || ""
  );
  const [address, setAddress] = useState(
    savedLocation?.address ||
      savedLocation?.displayName ||
      ""
  );
  const [addressLine1, setAddressLine1] = useState(
    savedLocation?.addressLine1 || ""
  );
  const [addressLine2, setAddressLine2] = useState(
    savedLocation?.addressLine2 || ""
  );
  const [landmark, setLandmark] = useState(
    savedLocation?.landmark || ""
  );
  const [city, setCity] = useState(
    savedLocation?.city || ""
  );
  const [latitude, setLatitude] = useState(
    savedLocation?.latitude ?? null
  );
  const [longitude, setLongitude] = useState(
    savedLocation?.longitude ?? null
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [locationDetected, setLocationDetected] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [mapError, setMapError] = useState("");

  // Optional information passed from previous page
  const problem =
    location?.state?.problem ||
    location?.state?.description ||
    "";

  // ----------------------------------------------------
  // Shared location data
  // ----------------------------------------------------
  const applySavedLocation = (data) => {
    if (!data) return;

    const detectedAddress = String(
      data.address ||
        data.displayName ||
        ""
    ).trim();

    setAddress(detectedAddress);
    setAddressLine1(String(data.addressLine1 || ""));
    setAddressLine2(String(data.addressLine2 || ""));
    setLandmark(String(data.landmark || ""));
    setCity(String(data.city || ""));
    setPostalCode(String(data.postalCode || ""));
    setLatitude(data.latitude ?? null);
    setLongitude(data.longitude ?? null);
    setLocationDetected(
      data.source === "gps" &&
        data.latitude != null &&
        data.longitude != null
    );
    setError("");
    setMapError("");
  };

  useEffect(() => {
    const saved = getSavedLocation();

    if (saved) {
      applySavedLocation(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------
  // AUTO-DETECT CURRENT LOCATION
  // ----------------------------------------------------
  const detectCurrentLocation = async () => {
    setDetectingLocation(true);
    setMapError("");
    setError("");

    try {
      const detected = await detectGPSLocation();
      const saved = saveSharedLocation(detected);
      applySavedLocation(saved);
    } catch (locationError) {
      console.error(
        "Location detection error:",
        locationError
      );

      setMapError(
        locationError?.message ||
          "Unable to detect your location. Please try again or enter the address manually."
      );
    } finally {
      setDetectingLocation(false);
    }
  };

  const openGoogleMaps = () => {
    if (latitude === null || longitude === null) return;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${latitude},${longitude}`
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ----------------------------------------------------
  // Validation
  // ----------------------------------------------------
  const validateBooking = () => {
    if (!user) {
      return "Please login before booking a service.";
    }

    if (cartItems.length === 0) {
      return "Your cart is empty. Please add a service first.";
    }

    const composedAddress = [
      addressLine1,
      addressLine2,
      landmark ? `Landmark: ${landmark}` : "",
      city,
      postalCode,
    ]
      .filter(Boolean)
      .join(", ")
      .trim();

    if (!composedAddress) {
      return "Please enter your complete service address.";
    }

    if (!postalCode.trim()) {
      return "Please enter your pincode.";
    }

    if (postalCode.trim().length !== 6) {
      return "Please enter a valid 6-digit pincode.";
    }

    if (!date) {
      return "Please select your preferred service date.";
    }

    if (!time) {
      return "Please select your preferred service time.";
    }

    return "";
  };

  // ----------------------------------------------------
  // Create booking
  // ----------------------------------------------------
  const handleSubmit = async () => {
    setError("");

    const validationError = validateBooking();

    if (validationError) {
      setError(validationError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    if (!navigator.onLine) {
      setError(
        "You appear to be offline. Please check your internet connection and try again."
      );
      return;
    }

    setIsLoading(true);

    try {
      // ----------------------------------------------
      // Convert cart into clean booking items
      // ----------------------------------------------
      const bookingItems = cartItems.map((item) => {
        const price = Number(item?.price) || 0;
        const qty =
          Number(item?.qty) > 0 ? Number(item.qty) : 1;

        return {
          label: item?.label || item?.name || "Service",
          price,
          qty,
          subtotal: price * qty,
        };
      });

      // Keep Home and Booking on the same shared location record.
      const finalServiceAddress = [
        addressLine1,
        addressLine2,
        landmark ? `Landmark: ${landmark}` : "",
        city,
        postalCode,
      ]
        .filter(Boolean)
        .join(", ")
        .trim();

      saveSharedLocation({
        ...(getSavedLocation() || {}),
        address: finalServiceAddress,
        displayName: [
          addressLine1,
          addressLine2,
          city,
          postalCode,
        ]
          .filter(Boolean)
          .join(", ")
          .trim(),
        addressLine1,
        addressLine2,
        landmark,
        city,
        postalCode,
        latitude,
        longitude,
        source:
          latitude !== null && longitude !== null
            ? "gps"
            : "manual",
      });

      // ----------------------------------------------
      // Booking data
      // ----------------------------------------------
      const rawBookingData = {
        userId: user?.uid || null,
        userName:
          user?.name ||
          user?.displayName ||
          "Customer",
        phone: user?.phone || null,

        items: bookingItems,

        totalAmount,

        address: [
          addressLine1,
          addressLine2,
          landmark ? `Landmark: ${landmark}` : "",
          city,
          postalCode,
        ]
          .filter(Boolean)
          .join(", ")
          .trim(),
        latitude:
          latitude !== null ? Number(latitude) : null,
        longitude:
          longitude !== null ? Number(longitude) : null,

        postalCode: postalCode.trim(),

        date,
        time: time.trim(),

        status: "Pending",

        // Useful for admin / technician flow
        technicianId: null,
        technicianName: null,
        technicianPhone: null,
        technicianPhoto: null,
        technicianRating: null,

        // Optional problem description
        problem: problem
          ? String(problem).trim()
          : null,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const bookingData = firestoreSafe(rawBookingData);

      console.log("Creating booking:", bookingData);

      // ----------------------------------------------
      // Save to Firestore
      // ----------------------------------------------
      const bookingRef = await addDoc(
        collection(db, "bookings"),
        bookingData
      );

      console.log(
        "Booking successfully created:",
        bookingRef.id
      );

      // ----------------------------------------------
      // Data passed to BookingSuccess
      // ----------------------------------------------
      const savedBooking = {
        id: bookingRef.id,
        ...bookingData,
      };

      // ----------------------------------------------
      // Navigate
      // ----------------------------------------------
      navigate("/booking-success", {
        state: savedBooking,
      });
    } catch (err) {
      console.error("Booking creation failed:", err);

      let message =
        "We couldn't create your booking. Please try again.";

      if (!navigator.onLine) {
        message =
          "You are offline. Please check your internet connection.";
      } else if (err?.code === "permission-denied") {
        message =
          "Booking permission was denied. Please check your Firebase security rules.";
      } else if (err?.code === "unauthenticated") {
        message =
          "Your login session has expired. Please login again.";
      } else if (err?.code === "unavailable") {
        message =
          "Firebase is temporarily unavailable. Please try again in a moment.";
      } else if (
        err?.code === "invalid-argument"
      ) {
        message =
          "Some booking information is invalid. Please check your details.";
      } else if (err?.message) {
        message = `Booking failed: ${err.message}`;
      }

      setError(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Empty cart screen
  // ----------------------------------------------------
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-7 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-sky-50 flex items-center justify-center text-4xl">
            🛒
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-5">
            Your cart is empty
          </h1>

          <p className="text-slate-500 mt-2 leading-relaxed">
            Add a service first and then continue
            with your booking.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition active:scale-[0.98]"
          >
            Browse Services
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Main UI
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl transition"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="flex-1">
            <h1 className="font-bold text-slate-900">
              Book Your Service
            </h1>

            <p className="text-xs text-slate-500">
              Just a few details and you're done
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
            📋
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-5">
        {/* Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-sky-600">
              1. Service
            </span>

            <span className="text-sky-600">
              2. Details
            </span>

            <span className="text-slate-400">
              3. Confirmation
            </span>
          </div>

          <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full w-2/3 bg-sky-500 rounded-full" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <div className="text-xl">⚠️</div>

              <div className="flex-1">
                <p className="font-bold text-red-800">
                  Something needs your attention
                </p>

                <p className="text-sm text-red-700 mt-1 whitespace-pre-line">
                  {error}
                </p>
              </div>

              <button
                onClick={() => setError("")}
                className="text-red-500 font-bold"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Customer */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center text-xl">
              👤
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Customer Details
              </h2>

              <p className="text-xs text-slate-500">
                Booking will be created for this account
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">
              {user?.name ||
                user?.displayName ||
                "Customer"}
            </p>

            {user?.phone && (
              <p className="text-sm text-slate-500 mt-1">
                📱 {user.phone}
              </p>
            )}
          </div>
        </section>

        {/* Cart */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900">
                Selected Services
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                {cartItems.length} service
                {cartItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
              {cartItems.length} item
              {cartItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {cartItems.map((item, index) => {
              const price =
                Number(item?.price) || 0;

              const qty =
                Number(item?.qty) > 0
                  ? Number(item.qty)
                  : 1;

              return (
                <div
                  key={`${item?.label || "service"}-${index}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {item?.label ||
                        item?.name ||
                        "Service"}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      ₹{price} × {qty}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900 whitespace-nowrap">
                    ₹{price * qty}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
            <span className="font-bold text-slate-700">
              Total
            </span>

            <span className="text-xl font-extrabold text-slate-900">
              ₹{totalAmount}
            </span>
          </div>
        </section>

        {/* Service Location */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl">
              📍
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Where should we send our professional?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Add your service address
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={detectCurrentLocation}
            disabled={detectingLocation}
            className={`w-full rounded-2xl border px-4 py-3.5 flex items-center gap-3 text-left transition ${
              detectingLocation
                ? "bg-slate-100 border-slate-200"
                : "bg-sky-50 border-sky-100 hover:bg-sky-100"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm">
              📍
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${
                detectingLocation ? "text-slate-400" : "text-sky-700"
              }`}>
                {detectingLocation
                  ? "Detecting your location..."
                  : "Use my current location"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically fill your area and pincode
              </p>
            </div>
            <span className="text-sky-600 font-bold">›</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] font-bold text-slate-400">
              OR ENTER ADDRESS
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                House / Flat / Office No.
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => {
                  setAddressLine1(e.target.value);
                  setAddress(e.target.value);
                  setLocationDetected(false);
                  setError("");
                }}
                placeholder="e.g. Flat 203, H.No. 5-2-18"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Building / Street / Area
              </label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => {
                  setAddressLine2(e.target.value);
                  setLocationDetected(false);
                  setError("");
                }}
                placeholder="e.g. Sri Sai Apartments, Main Road, Kukatpally"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Landmark <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near metro, mall, temple..."
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  City / Town
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hyderabad"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={postalCode}
                onChange={(e) =>
                  setPostalCode(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6-digit pincode"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm"
              />
            </div>
          </div>

          {mapError && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-800">
                ⚠️ {mapError}
              </p>
            </div>
          )}

          {(addressLine1 || addressLine2 || city || postalCode) && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-bold text-emerald-800">
                {locationDetected ? "✅ Location detected" : "📍 Service address"}
              </p>
              <p className="text-sm text-emerald-700 mt-1 leading-relaxed">
                {[
                  addressLine1,
                  addressLine2,
                  landmark ? `Landmark: ${landmark}` : "",
                  city,
                  postalCode,
                ].filter(Boolean).join(", ")}
              </p>
            </div>
          )}

          {latitude !== null && longitude !== null && (
            <div className="mt-3 rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <div className="h-40 bg-slate-100">
                <iframe
                  title="Selected service location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${latitude},${longitude}`
                  )}&z=17&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="px-3 py-2.5 flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400">
                  GPS location saved
                </p>
                <button
                  type="button"
                  onClick={openGoogleMaps}
                  className="text-xs font-bold text-sky-600"
                >
                  Open Maps →
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Date & Time */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-violet-50 flex items-center justify-center text-xl">
              🗓️
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Schedule Service
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Choose when you want the service
              </p>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Preferred Date
            </label>

            <input
              type="date"
              value={date}
              min={getToday()}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>

          {/* Time */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Preferred Time
            </label>

            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const selected = time === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                      selected
                        ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            {time && (
              <div className="mt-3 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-700">
                🕒 Selected time:{" "}
                <strong>{time}</strong>
              </div>
            )}
          </div>
        </section>

        {/* Problem */}
        {problem && (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-xl">
                💬
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Problem Description
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Information provided by you
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              {problem}
            </div>
          </section>
        )}

        {/* Booking note */}
        <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4 mb-5">
          <div className="flex gap-3">
            <span className="text-xl">
              💡
            </span>

            <div>
              <p className="font-bold text-sky-800">
                What happens next?
              </p>

              <p className="text-sm text-sky-700 mt-1 leading-relaxed">
                Your booking will be sent to Quickly.
                A technician can then be assigned to
                your request and you'll be able to
                follow the booking status.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">
              Booking Total
            </span>

            <span className="font-extrabold text-slate-900">
              ₹{totalAmount}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-2xl text-white font-bold text-base transition active:scale-[0.98] ${
              isLoading
                ? "bg-slate-400 cursor-wait"
                : "bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/20"
            }`}
          >
            {isLoading
              ? "⏳ Creating Booking..."
              : "Confirm Booking →"}
          </button>
        </div>
      </div>
    </div>
  );
}