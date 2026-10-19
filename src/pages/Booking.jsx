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
import "./Booking.css";

const firestoreSafe = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, value) =>
      value === undefined ? null : value
    )
  );

const getToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { clearCart, cart } = useCart();

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

  const [locationDetected, setLocationDetected] =
    useState(false);

  const [detectingLocation, setDetectingLocation] =
    useState(false);

  const [mapError, setMapError] = useState("");

  const problem =
    location?.state?.problem ||
    location?.state?.description ||
    "";

  const applySavedLocation = (data) => {
    if (!data) return;

    const detectedAddress = String(
      data.address || data.displayName || ""
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
      const bookingItems = cartItems.map((item) => {
        const price = Number(item?.price) || 0;

        const qty =
          Number(item?.qty) > 0
            ? Number(item.qty)
            : 1;

        return {
          label:
            item?.label ||
            item?.name ||
            "Service",
          price,
          qty,
          subtotal: price * qty,
        };
      });

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
          latitude !== null
            ? Number(latitude)
            : null,

        longitude:
          longitude !== null
            ? Number(longitude)
            : null,

        postalCode: postalCode.trim(),

        date,
        time: time.trim(),

        status: "Pending",

        technicianId: null,
        technicianName: null,
        technicianPhone: null,
        technicianPhoto: null,
        technicianRating: null,

        problem: problem
          ? String(problem).trim()
          : null,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const bookingData =
        firestoreSafe(rawBookingData);

      console.log(
        "Creating booking:",
        bookingData
      );

      const bookingRef = await addDoc(
        collection(db, "bookings"),
        bookingData
      );

      console.log(
  "Booking successfully created:",
  bookingRef.id
);

// Clear the cart only after Firebase saves the booking
clearCart();

const savedBooking = {
  id: bookingRef.id,
  ...bookingData,
};

navigate("/booking-success", {
  state: savedBooking,
});
    } catch (err) {
      console.error(
        "Booking creation failed:",
        err
      );

      let message =
        "We couldn't create your booking. Please try again.";

      if (!navigator.onLine) {
        message =
          "You are offline. Please check your internet connection.";
      } else if (
        err?.code === "permission-denied"
      ) {
        message =
          "Booking permission was denied. Please check your Firebase security rules.";
      } else if (
        err?.code === "unauthenticated"
      ) {
        message =
          "Your login session has expired. Please login again.";
      } else if (
        err?.code === "unavailable"
      ) {
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

  if (cartItems.length === 0) {
    return (
      <div className="booking-page">
        <div className="booking-empty-wrapper">
          <div className="booking-empty-card">
            <div className="booking-empty-icon">
              🛒
            </div>

            <span className="booking-section-label">
              BOOKING CART
            </span>

            <h1>Your cart is empty</h1>

            <p>
              Add a service first and then continue
              with your booking.
            </p>

            <button
              onClick={() => navigate("/")}
              className="booking-primary-btn"
            >
              Browse Services
            </button>

            <button
              onClick={() => navigate(-1)}
              className="booking-secondary-btn"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* HEADER */}
      <header className="booking-header">
        <div className="booking-header-inner">
          <button
            onClick={() => navigate(-1)}
            className="booking-back-btn"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="booking-brand">
            

            <div>
              <div className="booking-brand-name">
                OnCall
              </div>

              <div className="booking-brand-subtitle">
                Service Booking
              </div>
            </div>
          </div>

          <div className="booking-header-icon">
            📋
          </div>
        </div>
      </header>

      <main className="booking-container">
        {/* PAGE INTRO */}
        <section className="booking-intro">
          <span className="booking-section-label">
            BOOKING DETAILS
          </span>

          <h1>Book Your Service</h1>

          <p>
            Just a few details and you're done
          </p>
        </section>

        {/* PROGRESS */}
        <section className="booking-progress-card">
          <div className="booking-progress-labels">
            <span className="active">
              1. Service
            </span>

            <span className="active">
              2. Details
            </span>

            <span>
              3. Confirmation
            </span>
          </div>

          <div className="booking-progress-track">
            <div className="booking-progress-fill" />
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div
            className="booking-error"
            role="alert"
          >
            <div className="booking-error-icon">
              ⚠️
            </div>

            <div className="booking-error-content">
              <p>
                Something needs your attention
              </p>

              <span>{error}</span>
            </div>

            <button
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* CUSTOMER */}
        <section className="booking-card">
          <div className="booking-card-heading">
            <div className="booking-card-icon blue">
              👤
            </div>

            <div>
              <h2>Customer Details</h2>

              <p>
                Booking will be created for this
                account
              </p>
            </div>
          </div>

          <div className="booking-customer-box">
            <strong>
              {user?.name ||
                user?.displayName ||
                "Customer"}
            </strong>

            {user?.phone && (
              <span>📱 {user.phone}</span>
            )}
          </div>
        </section>

        {/* SERVICES */}
        <section className="booking-card">
          <div className="booking-card-heading-between">
            <div>
              <h2>Selected Services</h2>

              <p>
                {cartItems.length} service
                {cartItems.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <span className="booking-count-badge">
              {cartItems.length} item
              {cartItems.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          <div className="booking-service-list">
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
                  className="booking-service-item"
                >
                  <div className="booking-service-icon">
                    🛠️
                  </div>

                  <div className="booking-service-info">
                    <strong>
                      {item?.label ||
                        item?.name ||
                        "Service"}
                    </strong>

                    <span>
                      ₹{price} × {qty}
                    </span>
                  </div>

                  <strong className="booking-service-price">
                    ₹{price * qty}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="booking-total-row">
            <span>Total</span>

            <strong>
              ₹
              {Number(totalAmount).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>
        </section>

        {/* LOCATION */}
        <section className="booking-card">
          <div className="booking-card-heading">
            <div className="booking-card-icon teal">
              📍
            </div>

            <div>
              <h2>
                Where should we send our
                professional?
              </h2>

              <p>Add your service address</p>
            </div>
          </div>

          <button
            type="button"
            onClick={detectCurrentLocation}
            disabled={detectingLocation}
            className={`booking-location-btn ${
              detectingLocation
                ? "detecting"
                : ""
            }`}
          >
            <div className="booking-location-icon">
              📍
            </div>

            <div>
              <strong>
                {detectingLocation
                  ? "Detecting your location..."
                  : "Use my current location"}
              </strong>

              <span>
                Automatically fill your area and
                pincode
              </span>
            </div>

            <b>→</b>
          </button>

          <div className="booking-divider">
            <span>OR ENTER ADDRESS</span>
          </div>

          <div className="booking-form">
            <div className="booking-field">
              <label>
                House / Flat / Office No.
              </label>

              <input
                type="text"
                value={addressLine1}
                onChange={(e) => {
                  setAddressLine1(
                    e.target.value
                  );
                  setAddress(e.target.value);
                  setLocationDetected(false);
                  setError("");
                }}
                placeholder="e.g. Flat 203, H.No. 5-2-18"
              />
            </div>

            <div className="booking-field">
              <label>
                Building / Street / Area
              </label>

              <input
                type="text"
                value={addressLine2}
                onChange={(e) => {
                  setAddressLine2(
                    e.target.value
                  );
                  setLocationDetected(false);
                  setError("");
                }}
                placeholder="e.g. Sri Sai Apartments, Main Road, Kukatpally"
              />
            </div>

            <div className="booking-two-columns">
              <div className="booking-field">
                <label>
                  Landmark{" "}
                  <small>(optional)</small>
                </label>

                <input
                  type="text"
                  value={landmark}
                  onChange={(e) =>
                    setLandmark(e.target.value)
                  }
                  placeholder="Near metro, mall, temple..."
                />
              </div>

              <div className="booking-field">
                <label>City / Town</label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Hyderabad"
                />
              </div>
            </div>

            <div className="booking-field">
              <label>Pincode</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={postalCode}
                onChange={(e) =>
                  setPostalCode(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="Enter 6-digit pincode"
              />
            </div>
          </div>

          {mapError && (
            <div className="booking-warning">
              ⚠️ {mapError}
            </div>
          )}

          {(addressLine1 ||
            addressLine2 ||
            city ||
            postalCode) && (
            <div className="booking-address-preview">
              <strong>
                {locationDetected
                  ? "✅ Location detected"
                  : "📍 Service address"}
              </strong>

              <p>
                {[
                  addressLine1,
                  addressLine2,
                  landmark
                    ? `Landmark: ${landmark}`
                    : "",
                  city,
                  postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}

          {latitude !== null &&
            longitude !== null && (
              <div className="booking-map-card">
                <div className="booking-map">
                  <iframe
                    title="Selected service location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      `${latitude},${longitude}`
                    )}&z=17&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="booking-map-footer">
                  <span>
                    GPS location saved
                  </span>

                  <button
                    type="button"
                    onClick={openGoogleMaps}
                  >
                    Open Maps →
                  </button>
                </div>
              </div>
            )}
        </section>

        {/* DATE & TIME */}
        <section className="booking-card">
          <div className="booking-card-heading">
            <div className="booking-card-icon sky">
              🗓️
            </div>

            <div>
              <h2>Schedule Service</h2>

              <p>
                Choose when you want the service
              </p>
            </div>
          </div>

          <div className="booking-field">
            <label>Preferred Date</label>

            <input
              type="date"
              value={date}
              min={getToday()}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />
          </div>

          <div className="booking-time-wrapper">
            <label>Preferred Time</label>

            <div className="booking-time-grid">
              {TIME_SLOTS.map((slot) => {
                const selected = time === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() =>
                      setTime(slot)
                    }
                    className={
                      selected
                        ? "selected"
                        : ""
                    }
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            {time && (
              <div className="booking-selected-time">
                🕒 Selected time:{" "}
                <strong>{time}</strong>
              </div>
            )}
          </div>
        </section>

        {/* PROBLEM */}
        {problem && (
          <section className="booking-card">
            <div className="booking-card-heading">
              <div className="booking-card-icon amber">
                💬
              </div>

              <div>
                <h2>Problem Description</h2>

                <p>
                  Information provided by you
                </p>
              </div>
            </div>

            <div className="booking-problem">
              {problem}
            </div>
          </section>
        )}

        {/* NEXT */}
        <div className="booking-next">
          <div>💡</div>

          <div>
            <strong>What happens next?</strong>

            <p>
              Your booking will be sent to OnCall.
              A technician can then be assigned to
              your request and you'll be able to
              follow the booking status.
            </p>
          </div>
        </div>
      </main>

      {/* BOTTOM BAR */}
      <div className="booking-bottom-bar">
        <div className="booking-bottom-inner">
          <div className="booking-bottom-total">
            <span>Booking Total</span>

            <strong>
              ₹
              {Number(totalAmount).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={
              isLoading
                ? "booking-confirm-btn loading"
                : "booking-confirm-btn"
            }
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