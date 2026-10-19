
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccess.css";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const WHATSAPP_NUMBER = "917661045308";
  const SUPPORT_PHONE = "7661045308";

  const booking = location.state || {};

  const bookingId =
    booking.id || booking.bookingId || "Pending";

  const customerName =
    booking.userName ||
    booking.user?.name ||
    booking.customerName ||
    "OnCall User";

  const date = booking.date || "";
  const time = booking.time || "";
  const address = booking.address || "";

  const items = Array.isArray(booking.items)
    ? booking.items
    : [];

  const totalAmount = Number(booking.totalAmount) || 0;

  const [showConfirmDialog, setShowConfirmDialog] =
    useState(true);

  const shortBookingId =
    bookingId !== "Pending"
      ? String(bookingId).slice(-8).toUpperCase()
      : "PENDING";

  const formattedDate = date
    ? /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00`).toLocaleDateString(
          "en-IN",
          {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : date
    : "Not selected";

  const serviceDetails = items.length
    ? items
        .map((item, index) => {
          const price = Number(item?.price) || 0;
          const qty = Number(item?.qty) > 0
            ? Number(item.qty)
            : 1;

          const subtotal =
            Number(item?.subtotal) || price * qty;

          return `${index + 1}. ${
            item?.label || "Service"
          } - ₹${subtotal.toLocaleString("en-IN")} x ${qty}`;
        })
        .join("\n")
    : "Service details unavailable";

  const message = `Hello OnCall! 👋

I would like to confirm my service booking.

Booking ID: ${shortBookingId}
Customer: ${customerName}
Booking Date: ${formattedDate}
Preferred Time: ${time || "Not selected"}

Services:
${serviceDetails}

Total Amount: ₹${totalAmount.toLocaleString("en-IN")}
Service Address: ${address || "Not provided"}

Please confirm my booking. Thank you!`;

  const handleConfirmBooking = () => {
    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setShowConfirmDialog(false);
    window.location.assign(whatsappURL);
  };

  return (
    <div className="booking-success-page">
      {/* WHATSAPP CONFIRMATION DIALOG */}
      {showConfirmDialog && (
        <div className="oncall-dialog-overlay">
          <div
            className="oncall-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="oncall-dialog-title"
          >
            <div className="oncall-dialog-icon">💬</div>

            <h2 id="oncall-dialog-title">
              Confirm Your Booking
            </h2>

            <p className="oncall-dialog-description">
              Your service booking was received successfully.
              To confirm your booking, continue to WhatsApp
              and send your booking details to our support team.
            </p>

            <div className="oncall-dialog-details">
              <div>
                <span>Booking ID</span>
                <strong>{shortBookingId}</strong>
              </div>

              <div>
                <span>Booking Date</span>
                <strong>{formattedDate}</strong>
              </div>

              <div>
                <span>Preferred Time</span>
                <strong>{time || "Not selected"}</strong>
              </div>
            </div>

            <button
              type="button"
              className="oncall-dialog-confirm"
              onClick={handleConfirmBooking}
            >
              Confirm by WhatsApp
            </button>

            
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="success-header">
        <div className="success-header-inner">
          <button
            type="button"
            className="success-back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            ←
          </button>

          <div className="success-brand">
            <div className="success-brand-name">OnCall</div>
            <div className="success-brand-subtitle">
              Booking Confirmation
            </div>
          </div>

          <div className="success-header-icon">✓</div>
        </div>
      </header>

      <main className="success-container">
        {/* SUCCESS HERO */}
        <section className="success-hero">
          <div className="success-check-outer">
            <div className="success-check">✓</div>
          </div>

          <span className="success-label">
            BOOKING SUCCESSFUL
          </span>

          <h1>Booking Received!</h1>

          <p>
            Your service request has been successfully received.
          </p>

          <div className="success-status">
            <span className="success-status-dot" />
            Finding the right professional for you
          </div>
        </section>

        {/* BOOKING ID */}
        <section className="booking-id-card">
          <div>
            <span>BOOKING ID</span>
            <h2>{shortBookingId}</h2>
            <p>Keep this ID for future reference.</p>
          </div>

          <div className="booking-id-icon">📋</div>
        </section>

        {/* BOOKING DETAILS */}
        <section className="success-card">
          <div className="success-card-heading">
            <div className="success-card-icon">📋</div>
            <div>
              <h2>Booking Details</h2>
              <p>Your service booking information</p>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">👤</div>
            <div>
              <span>Customer</span>
              <strong>{customerName}</strong>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">🗓️</div>
            <div>
              <span>Service Date</span>
              <strong>{formattedDate}</strong>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">🕒</div>
            <div>
              <span>Preferred Time</span>
              <strong>{time || "Not selected"}</strong>
            </div>
          </div>

          {address && (
            <div className="success-address">
              <div className="detail-icon">📍</div>
              <div>
                <span>Service Location</span>
                <p>{address}</p>
              </div>
            </div>
          )}
        </section>

        {/* SERVICES */}
        {items.length > 0 && (
          <section className="success-card">
            <div className="success-card-heading">
              <div className="success-card-icon">🛠️</div>
              <div>
                <h2>Services</h2>
                <p>
                  {items.length} selected service
                  {items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="success-service-list">
              {items.map((item, index) => {
                const price = Number(item?.price) || 0;
                const qty = Number(item?.qty) > 0
                  ? Number(item.qty)
                  : 1;

                const subtotal =
                  Number(item?.subtotal) || price * qty;

                return (
                  <div
                    key={`${item?.label || "service"}-${index}`}
                    className="success-service-item"
                  >
                    <div className="success-service-icon">
                      🔧
                    </div>

                    <div className="success-service-info">
                      <strong>
                        {item?.label || "Service"}
                      </strong>
                      <span>
                        ₹{price.toLocaleString("en-IN")} × {qty}
                      </span>
                    </div>

                    <strong className="success-service-price">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </strong>
                  </div>
                );
              })}
            </div>

            <div className="success-total">
              <span>Total Amount</span>
              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>
          </section>
        )}

        {/* WHAT HAPPENS NEXT */}
        <section className="success-card">
          <div className="success-card-heading">
            <div className="success-card-icon">⚡</div>
            <div>
              <h2>What happens next?</h2>
              <p>Here's what you can expect</p>
            </div>
          </div>

          <div className="booking-timeline">
            <div className="timeline-item completed">
              <div className="timeline-number">✓</div>
              <div className="timeline-content">
                <strong>Booking received</strong>
                <p>We've received your service request.</p>
              </div>
            </div>

            <div className="timeline-line" />

            <div className="timeline-item">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <strong>Professional assigned</strong>
                <p>
                  A suitable service professional will be assigned.
                </p>
              </div>
            </div>

            <div className="timeline-line" />

            <div className="timeline-item">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <strong>Professional contacts you</strong>
                <p>
                  You'll receive updates as your booking progresses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="success-card support-card">
          <div className="support-icon">💬</div>
          <h2>Need help?</h2>
          <p>
            Our OnCall support team is available to help with your booking.
          </p>

          <div className="support-actions">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="support-whatsapp"
            >
              💬 WhatsApp
            </a>

            <a
              href={`tel:+91${SUPPORT_PHONE}`}
              className="support-call"
            >
              📞 Call Support
            </a>
          </div>
        </section>

        {/* NAVIGATION */}
        <div className="success-actions">
          <button
            type="button"
            className="success-primary-action"
            onClick={() => navigate("/my")}
          >
            📋 View My Bookings
          </button>

          <button
            type="button"
            className="success-secondary-action"
            onClick={() => navigate("/")}
          >
            🏠 Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
