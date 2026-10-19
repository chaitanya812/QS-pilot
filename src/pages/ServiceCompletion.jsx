import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import "./ServiceCompletion.css";

const ServiceCompletion = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  // Load and validate the booking
  useEffect(() => {
    let active = true;

    async function loadBooking() {
      try {
        if (!bookingId || !token) {
          throw new Error(
            "This completion link is invalid or incomplete."
          );
        }

        const bookingRef = doc(db, "bookings", bookingId);
        const snapshot = await getDoc(bookingRef);

        if (!snapshot.exists()) {
          throw new Error("We could not find this booking.");
        }

        const data = snapshot.data();

        if (
          !data.completionToken ||
          data.completionToken !== token
        ) {
          throw new Error(
            "This completion link is invalid or has expired. Please contact OnCall support."
          );
        }

        if (active) {
          setBooking({
            id: snapshot.id,
            ...data,
          });

          setCompleted(
            String(data.status || "").toLowerCase() ===
              "completed"
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Unable to load booking details."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      active = false;
    };
  }, [bookingId, token]);

  // Confirm service completion
  const markCompleted = async () => {
    if (!booking || !token || submitting || completed) {
      return;
    }

    const confirmed = window.confirm(
      "Has the technician completed your service?"
    );

    if (!confirmed) return;

    setSubmitting(true);
    setError("");

    try {
      const bookingRef = doc(db, "bookings", booking.id);
      const latest = await getDoc(bookingRef);

      if (!latest.exists()) {
        throw new Error("This booking could not be found.");
      }

      const latestData = latest.data();

      if (latestData.completionToken !== token) {
        throw new Error(
          "This completion link is invalid or has expired."
        );
      }

      if (
        String(latestData.status || "").toLowerCase() ===
        "completed"
      ) {
        setCompleted(true);
        setBooking({
          id: latest.id,
          ...latestData,
        });
        return;
      }

      await updateDoc(bookingRef, {
        status: "Completed",
        completedAt: new Date().toISOString(),
        completedBy: "customer",
      });

      setCompleted(true);

      setBooking((current) => ({
        ...current,
        status: "Completed",
      }));
    } catch (err) {
      console.error(
        "[OnCall] Could not mark booking completed:",
        err
      );

      setError(
        err.message ||
          "Could not update the booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const serviceName =
    booking?.items
      ?.map(
        (item) =>
          item?.label ||
          item?.name ||
          item?.serviceName
      )
      .filter(Boolean)
      .join(", ") ||
    booking?.serviceName ||
    booking?.subService ||
    booking?.selectedService ||
    "OnCall service";

  const amount = Number(
    booking?.totalAmount ??
      booking?.amount ??
      booking?.total ??
      0
  );

  const bookingDate =
    booking?.date ||
    booking?.bookingDate ||
    booking?.serviceDate ||
    "Not provided";

  return (
    <main className="service-completion-page">
      <section className="service-completion-card">
        <div
          className={`service-completion-icon ${
            completed ? "is-completed" : ""
          }`}
        >
          {loading ? "…" : completed ? "✓" : "🛠️"}
        </div>

        <p className="service-completion-eyebrow">
          ONCALL SERVICE
        </p>

        <h1>
          {loading
            ? "Loading your booking..."
            : completed
            ? "Service Completed"
            : "Confirm Service Completion"}
        </h1>

        {loading ? (
          <p className="service-completion-copy">
            Please wait while we verify your booking link.
          </p>
        ) : error && !booking ? (
          <div
            className="service-completion-error"
            role="alert"
          >
            {error}
          </div>
        ) : (
          <>
            <p className="service-completion-copy">
              {completed
                ? "Thank you! Your confirmation has been saved. The OnCall admin dashboard will update automatically."
                : "Please review your booking details. Tap the button below only after the technician has finished the service."}
            </p>

            {booking && (
              <div className="service-completion-details">
                <div>
                  <span>Booking ID</span>
                  <strong>{booking.id}</strong>
                </div>

                <div>
                  <span>Service</span>
                  <strong>{serviceName}</strong>
                </div>

                <div>
                  <span>Technician</span>
                  <strong>
                    {booking.technicianName ||
                      "Assigned technician"}
                  </strong>
                </div>

                <div>
                  <span>Technician Phone</span>
                  <strong>
                    {booking.technicianPhone ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>Booking Date</span>
                  <strong>{bookingDate}</strong>
                </div>

                <div>
                  <span>Booking Time</span>
                  <strong>
                    {booking.time ||
                      booking.bookingTime ||
                      booking.serviceTime ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>Total Amount</span>
                  <strong>
                    ₹{amount.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong
                    className={
                      completed
                        ? "completion-status-done"
                        : "completion-status-pending"
                    }
                  >
                    {completed
                      ? "Completed"
                      : booking.status || "Assigned"}
                  </strong>
                </div>
              </div>
            )}

            {error && (
              <div
                className="service-completion-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {completed ? (
              <div className="service-completion-success-message">
                <span>✓</span> Your booking status has been
                updated successfully.
              </div>
            ) : (
              <button
                type="button"
                className="service-completion-button"
                onClick={markCompleted}
                disabled={submitting || loading}
              >
                {submitting
                  ? "Updating booking..."
                  : "✓ Service Completed"}
              </button>
            )}

            <p className="service-completion-footnote">
              If the service is not finished yet, close this
              page without confirming. Your confirmation
              updates the booking status in OnCall.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default ServiceCompletion;