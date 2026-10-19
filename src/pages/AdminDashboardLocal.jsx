import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import "./AdminDashboardLocal.css";

export default function AdminDashboardLocal() {
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [form, setForm] = useState({});

  const audioContextRef = useRef(null);
  const soundEnabledRef = useRef(false);
  const initialBookingsLoadedRef = useRef(false);
  const previousBookingIdsRef = useRef(new Set());

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [newBookingAlert, setNewBookingAlert] = useState(null);
  const enableNotificationSound = async () => {
    try {
      if (!audioContextRef.current) {
        const AudioContext =
          window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) {
          alert(
            "Your browser does not support notification sounds."
          );
          return;
        }

        audioContextRef.current = new AudioContext();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      playNotificationSound();

      soundEnabledRef.current = true;
      setSoundEnabled(true);

      console.log("[OnCall] Notification sound enabled.");
    } catch (error) {console.error(
        "[OnCall] Failed to enable sound:",
        error
      );

      alert(
        "Unable to enable notification sound. Please try again."
      );
    }
  };
  const playNotificationSound = () => {
    try {
      const audioContext = audioContextRef.current;

      if (!audioContext) return;

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime
      );
      oscillator.frequency.setValueAtTime(
        1174,
        audioContext.currentTime + 0.12
      );

      oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime + 0.24
      );

      gainNode.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.35,
        audioContext.currentTime + 0.03
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.5
      );
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error(
        "[OnCall] Sound playback failed:",
        error
      );
    }
  };
  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newBookings = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        if (!initialBookingsLoadedRef.current) {
          newBookings.forEach((booking) => {
            previousBookingIdsRef.current.add(booking.id);
          });

          initialBookingsLoadedRef.current = true;
          setBookings(newBookings);
          return;
        }

        const newlyCreatedBookings = newBookings.filter(
          (booking) =>
            !previousBookingIdsRef.current.has(booking.id)
        );
        if (newlyCreatedBookings.length > 0) {
          const latestBooking = newlyCreatedBookings[0];

          console.log(
            "[OnCall] NEW BOOKING DETECTED:",
            latestBooking
          );

          if (soundEnabledRef.current) {
            playNotificationSound();
          } else {
            console.warn(
              "[OnCall] Sound is not enabled. Click Enable Sound."
            );
          }

          setNewBookingAlert(latestBooking);

          setTimeout(() => {
            setNewBookingAlert(null);
          }, 7000);
        }

        newBookings.forEach((booking) => {
          previousBookingIdsRef.current.add(booking.id);
        });

        setBookings(newBookings);
      },
      (error) => {
        console.error(
          "Booking listener error:",
          error
        );
      }
    );

    try {
      const techs = JSON.parse(
        localStorage.getItem("technicians") || "[]"
      );
      setTechnicians(techs);
    } catch (error) {
      console.error(
        "Technician loading error:",
        error
      );

      setTechnicians([]);
    }

    return () => unsubscribe();
  }, []);
  const assignTechnician = async (booking, tech) => {
    if (!booking?.id || !tech?.name) {
      alert("Booking or technician details are missing.");
      return;
    }

    const rawPhone =
      booking.phone ||
      booking.mobile ||
      booking.customerPhone ||
      booking.customer?.phone ||
      booking.user?.phone ||
      booking.userPhone ||
      "";

    const clientPhone = String(rawPhone).replace(/\\D/g, "");
    if (!clientPhone) {
      alert("The customer's phone number is missing. Add a phone number before assigning a technician.");
      return;
    }
    const whatsappPhone =
      clientPhone.length === 10 ? `91${clientPhone}` : clientPhone;
      const completionToken =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const completionUrl =
      `${window.location.origin}/service-completion/${encodeURIComponent(booking.id)}` +
      `?token=${encodeURIComponent(completionToken)}`;

    const serviceName = getServiceName(booking);
    const amount = getBookingAmount(booking);
    const bookingDate =
      booking.date || booking.bookingDate || booking.serviceDate || "Not provided";
    const bookingTime =
      booking.time || booking.bookingTime || booking.serviceTime || "Not provided";
    const address =
      booking.address ||
      booking.fullAddress ||
      booking.location ||
      booking.customerAddress ||
      booking.customer?.address ||
      "Not provided";
      const message = [
      `Hello ${booking.name || booking.customerName || booking.userName || booking.customer?.name || "Customer"}!`,
      "",
      "Your OnCall service technician has been assigned.",
      "",
      `Booking ID: ${booking.id}`,
      `Service: ${serviceName}`,
      `Technician: ${tech.name}`,
      `Technician phone: ${tech.phone || "Not provided"}`,
      `Booking date: ${bookingDate}`,
      `Booking time: ${bookingTime}`,
      `Address: ${address}`,
      `Total amount: ₹${amount.toLocaleString("en-IN")}`,
      "",
      "After the service is finished, please open this link and tap “Service Completed” to update your booking status:",
      completionUrl,
      "",
      "Thank you for choosing OnCall!",
    ].join("\\n");
    const whatsappUrl =
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;

    // Open synchronously from the selection interaction to reduce popup blocking.
    const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        status: "Assigned",
        technicianId: tech.id,
        technicianName: tech.name,
        technicianPhone: tech.phone || "",
        technicianRating: tech.rating ?? 4.5,
        technicianPhoto: tech.photo || null,
        completedJobs: tech.jobs ?? 20,
        eta: 30,
        assignedAt: new Date().toISOString(),
        completionToken,
        completionUrl,
      });
      alert("Technician assigned. WhatsApp opened with the client message.");
    } catch (error) {
      console.error("[OnCall] Failed to assign technician:", error);
      if (whatsappWindow) whatsappWindow.close();
      alert("Failed to assign technician. Please check your connection and try again.");
    }
  };
  const updateExtraDetails = async (bookingId) => {
    try {
      const values = form[bookingId] || {};

      await updateDoc(
        doc(db, "bookings", bookingId),
        {
          technicianPhoto: values.photo || null,
          technicianRating:
            Number(values.rating) || 4.5,
          completedJobs:
            Number(values.jobs) || 20,
          eta: Number(values.eta) || null,
        }
      );

      alert("Updated successfully ✔");
    } catch (error) {
      console.error(error);
      alert("Failed to update details");
    }
  };
  const updateField = (bookingId, key, value) => {
    setForm((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [key]: value,
      },
    }));
  };
  const getBookingAmount = (booking) => {
    const possibleAmounts = [
      booking?.totalAmount,
      booking?.amount,
      booking?.total,
      booking?.price,
    ];

    for (const value of possibleAmounts) {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }

    if (Array.isArray(booking?.items)) {
      return booking.items.reduce((total, item) => {
        const price = Number(item?.price) || 0;

        const qty =
          Number(item?.qty) > 0
            ? Number(item.qty)
            : 1;
            const subtotal = Number(item?.subtotal);

        return (
          total +
          (Number.isFinite(subtotal)
            ? subtotal
            : price * qty)
        );
      }, 0);
    }

    return 0;
  };

  const getServiceName = (booking) => {
    if (
      Array.isArray(booking?.items) &&
      booking.items.length > 0
    ) {
      const names = booking.items
        .map(
          (item) =>
            item?.label ||
            item?.name ||
            item?.serviceName ||
            item?.subService
        )
        .filter(Boolean);

      if (names.length > 0) {
        return names.join(", ");
      }
    }

    return (
      booking?.serviceName ||
      booking?.subService ||
      booking?.subServiceName ||
      booking?.selectedService ||
      booking?.service ||
      booking?.category ||
      "Service"
    );
  };
  const totalOrders = bookings.length;

  const pendingOrders = bookings.filter((booking) => {
    const status = String(
      booking?.status || "Pending"
    )
      .trim()
      .toLowerCase();

    return (
      status === "pending" ||
      status === "new"
    );
  }).length;

  const completedOrders = bookings.filter(
    (booking) => String(booking?.status || "").toLowerCase() === "completed"
  ).length;

  const totalValue = bookings.reduce(
    (total, booking) =>
      total + getBookingAmount(booking),
    0
  );
  return (
    <div className="admin-dashboard-local">
      <div className="admin-dashboard-container">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-brand">
            <div className="admin-dashboard-logo">
              O
            </div>

            <div>
              <span className="admin-dashboard-eyebrow">
                ONCALL ADMIN
              </span>

              <h1>Admin Dashboard</h1>

              <p>
                Manage bookings, technicians and
                service requests.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={enableNotificationSound}
            className={`admin-sound-button ${
              soundEnabled
                ? "admin-sound-enabled"
                : "admin-sound-disabled"
            }`}
          >
            {soundEnabled
              ? "🔊 Sound ON"
              : "🔇 Enable Sound"}
          </button>
        </header>
        <section className="admin-stat-grid">

          <div className="admin-stat-card admin-stat-orders">
            <div className="admin-stat-content">
              <span>Total Orders</span>
              <strong>{totalOrders}</strong>
              <small>All OnCall bookings</small>
            </div>

            <div className="admin-stat-icon">
              📦
            </div>
          </div>

          <div className="admin-stat-card admin-stat-pending">
            <div className="admin-stat-content">
              <span>Pending Orders</span>
              <strong>{pendingOrders}</strong>
              <small>
                Awaiting technician assignment
              </small>
            </div>

            <div className="admin-stat-icon">
              ⏳
            </div>
          </div>
<div className="admin-stat-card admin-stat-completed">
            <div className="admin-stat-content">
              <span>Completed Orders</span>
              <strong>{completedOrders}</strong>
              <small>Confirmed by customers</small>
            </div>
            <div className="admin-stat-icon">✅</div>
          </div>

          <div className="admin-stat-card admin-stat-value">
            <div className="admin-stat-content">
              <span>Total Value</span>
              <strong>
                ₹{totalValue.toLocaleString("en-IN")}
              </strong>
              <small>Value of all bookings</small>
            </div>

            <div className="admin-stat-icon">
              💰
            </div>
          </div>

        </section>
        <section className="admin-notification-status">
          <div className="admin-notification-status-icon">
            🔔
          </div>

          <div>
            <strong>
              FCM Notifications Active
            </strong>

            <p>
              {soundEnabled
                ? "🔊 OnCall booking sound is enabled."
                : "🔇 Click Enable Sound to activate booking alerts."}
            </p>
          </div>
        </section>
        {newBookingAlert && (
          <section className="admin-new-booking-alert">
            <div className="admin-alert-header">
              <div>
                <span className="admin-alert-badge">
                  🔔 NEW BOOKING
                </span>

                <h2>
                  New OnCall Booking!
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNewBookingAlert(null)
                }
                className="admin-alert-close"
              >
                ✕
              </button>
            </div>
            <div className="admin-alert-details">
              <p>
                <strong>🆔 Booking ID:</strong>{" "}
                {newBookingAlert.id ||
                  "Not available"}
              </p>

              <p>
                <strong>🛠️ Service:</strong>{" "}
                {getServiceName(
                  newBookingAlert
                )}
              </p>

              <p>
                <strong>💰 Amount:</strong>{" "}
                ₹
                {getBookingAmount(
                  newBookingAlert
                ).toLocaleString("en-IN")}
              </p>
<p>
                📅{" "}
                {newBookingAlert.date ||
                  newBookingAlert.bookingDate ||
                  "Date not provided"}
                {" • "}
                ⏰{" "}
                {newBookingAlert.time ||
                  newBookingAlert.bookingTime ||
                  "Time not provided"}
              </p>

              <p>
                👤{" "}
                {newBookingAlert.name ||
                  newBookingAlert.customerName ||
                  newBookingAlert.userName ||
                  "Customer"}
                {" • "}
                📞{" "}
                {newBookingAlert.phone ||
                  newBookingAlert.mobile ||
                  newBookingAlert.customerPhone ||
                  "Phone not provided"}
              </p>
              <p>
                📍{" "}
                {newBookingAlert.address ||
                  newBookingAlert.fullAddress ||
                  newBookingAlert.location ||
                  "Address not provided"}
              </p>
            </div>
          </section>
        )}
        <section className="admin-bookings-section">
          <div className="admin-section-heading">
            <div>
              <span>BOOKING MANAGEMENT</span>
              <h2>Recent Bookings</h2>
            </div>

            <div className="admin-booking-count">
              {totalOrders}
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                📭
              </div>

              <h2>No bookings yet</h2>

              <p>
                New OnCall bookings will appear here.
              </p>
            </div>
            ) : (
            <div className="admin-booking-list">

              {bookings.map((b) => {
                const assignedTech =
                  technicians.find(
                    (t) =>
                      t.id === b.technicianId
                  );

                const bookingAmount =
                  getBookingAmount(b);

                const serviceName =
                  getServiceName(b);

                const normalizedStatus = String(b.status || "Pending").trim().toLowerCase();
                const isPending = normalizedStatus === "pending" || normalizedStatus === "new";
                const isCompleted = normalizedStatus === "completed";

                return (
                  <article
                    key={b.id}
                    className={`admin-booking-card ${
                      isPending
                        ? "admin-booking-pending"
                        : "admin-booking-assigned"
                        } ${isCompleted ? "admin-booking-completed" : ""}`}
                  >

                    {/* NEW ORDER */}

                    {isPending && (
                      <div className="admin-new-order">
                        🔴 NEW ORDER
                      </div>
                    )}

                    {/* BOOKING HEADER */}

                    <div className="admin-booking-header">
                      <div className="admin-booking-heading">
                        <div className="admin-booking-id">
                          🆔
                          <span>
                            Booking ID:
                          </span>

                          <strong>
                            {b.id}
                          </strong>
                        </div>
                        <h2>
                          🛠️ {serviceName}
                        </h2>

                        {(b.subService ||
                          b.subServiceName ||
                          b.selectedService) && (
                          <p className="admin-sub-service">
                            🔧{" "}
                            {b.subService ||
                              b.subServiceName ||
                              b.selectedService}
                          </p>
                        )}
                      </div>

                      <span
                        className={`admin-status ${
                          isPending
                            ? "admin-status-pending"
                            : "admin-status-success"
                        } ${isCompleted ? "admin-status-completed" : ""}`}
                      >
                        {b.status || "Pending"}
                      </span>
                    </div>
                    <div className="admin-booking-summary">
                      <div className="admin-info-tile admin-service-tile">
                        <span>
                          🛠️ Service Name
                        </span>

                        <strong>
                          {serviceName}
                        </strong>
                      </div>

                      <div className="admin-info-tile admin-amount-tile">
                        <span>
                          💰 Total Amount
                        </span>

                        <strong>
                          ₹
                          {bookingAmount.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>
                    </div>
                    {Array.isArray(b.items) &&
                      b.items.length > 0 && (
                        <div className="admin-items-card">
                          <h3>
                            🛠️ Booked Service
                            {b.items.length > 1
                              ? "s"
                              : ""}
                          </h3>

                          <div className="admin-items-list">
                            {b.items.map(
                              (item, index) => {
                                const itemName =
                                  item?.label ||
                                  item?.name ||
                                  item?.serviceName ||
                                  item?.subService ||
                                  "Service";

                                const qty =
                                  Number(
                                    item?.qty
                                  ) > 0
                                    ? Number(
                                      item.qty
                                      )
                                    : 1;

                                const price =
                                  Number(
                                    item?.price
                                  ) || 0;

                                const subtotal =
                                  Number(
                                    item?.subtotal
                                  ) ||
                                  price * qty;

                                return (
                                  <div
                                    key={
                                      item?.id ||
                                      item?.key ||
                                      index
                                    }
                                    className="admin-item-row"
                                  >
                                    <div>
                                      <strong>
                                        {itemName}
                                        </strong>

                                      <small>
                                        Qty: {qty} × ₹
                                        {price}
                                      </small>
                                    </div>

                                    <strong>
                                      ₹
                                      {subtotal.toLocaleString(
                                        "en-IN"
                                      )}
                                    </strong>
                                  </div>
                                );
                              }
                            )}
                          </div>

                          <div className="admin-items-total">
                            <span>
                              Total Amount
                            </span>

                            <strong>
                              ₹
                              {bookingAmount.toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </div>
                        </div>
                      )}

                    {/* CUSTOMER DETAILS */}

                    <div className="admin-customer-card">

                      <div className="admin-customer-row">
                        <span>👤</span>

                        <div>
                          <label>
                            Customer
                          </label>

                          <p>
                            {b.name ||
                              b.customerName ||
                              b.userName ||
                              b.customer?.name ||
                              "Customer"}
                              </p>
                        </div>
                      </div>

                      <div className="admin-customer-row">
                        <span>📞</span>

                        <div>
                          <label>Phone</label>

                          <p>
                            {b.phone ||
                              b.mobile ||
                              b.customerPhone ||
                              b.customer?.phone ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="admin-customer-row">
                        <span>📅</span>

                        <div>
                          <label>Date</label>
<p>
                            {b.date ||
                              b.bookingDate ||
                              b.serviceDate ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="admin-customer-row">
                        <span>⏰</span>

                        <div>
                          <label>Time</label>

                          <p>
                            {b.time ||
                              b.bookingTime ||
                              b.serviceTime ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="admin-customer-row">
                        <span>📍</span>

                        <div>
                          <label>Address</label>

                          <p>
                            {b.address ||
                              b.fullAddress ||
                              b.location ||
                              b.customerAddress ||
                              b.customer?.address ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>

                    </div>
                    {isPending && technicians.length > 0 && (
                        <select
                          className="admin-technician-select"
                          defaultValue=""
                          onChange={(e) => {
                            const tech =
                              technicians.find(
                                (t) =>
                                  t.id ===
                                  e.target.value
                              );

                            if (tech) {
                              assignTechnician(
                                b,
                                tech
                              );
                            }
                          }}
                        >
                          <option
                            value=""
                            disabled
                          >
                            Select Technician
                          </option>
                          {technicians.map((t) => (
                            <option
                              key={t.id}
                              value={t.id}
                            >
                              {t.name} ⭐{" "}
                              {t.rating ?? 0}
                            </option>
                          ))}
                        </select>
                      )}

                    {isCompleted && (
                      <div className="admin-completion-confirmed">
                        ✅ Service marked completed by the customer
                        {b.completedAt && (
                          <small>
                            Completed: {new Date(b.completedAt).toLocaleString("en-IN")}
                          </small>
                        )}
                      </div>
                    )}
                    {b.technicianName && (
                      <div className="admin-assigned-tech">
                        <div className="admin-tech-avatar">
                          👨‍🔧
                        </div>

                        <div className="admin-tech-info">
                          <strong>
                            {b.technicianName}
                          </strong>

                          <span>
                            ⭐{" "}
                            {b.technicianRating ||
                              4.5}
                          </span>

                          <span>
                            ETA:{" "}
                            {b.eta || "--"} mins
                          </span>

                          {b.technicianPhone && (
                            <span>
                              📞{" "}
                              {b.technicianPhone}
                            </span>
                            )}
                        </div>
                      </div>
                    )}

                    {/* EDIT TECHNICIAN DETAILS */}

                    {String(b.status || "").toLowerCase() === "assigned" && (
                      <div className="admin-tech-edit">
                        <div className="admin-tech-edit-heading">
                          <span>
                            TECHNICIAN DETAILS
                          </span>

                          <h3>
                            Update Assigned Technician
                          </h3>
                        </div>

                        <div className="admin-tech-input-grid">
                          <input
                            type="text"
                            placeholder="Tech Photo URL"
                            onChange={(e) =>
                              updateField(
                                b.id,
                                "photo",
                                e.target.value
                              )
                            }
                          />

                          <input
                            type="number"
                            step="0.1"
                            placeholder="Rating"
                            onChange={(e) =>
                              updateField(
                                b.id,
                                "rating",
                                e.target.value
                              )
                            }
                          />
<input
                            type="number"
                            placeholder="Jobs Done"
                            onChange={(e) =>
                              updateField(
                                b.id,
                                "jobs",
                                e.target.value
                              )
                            }
                          />

                          <input
                            type="number"
                            placeholder="ETA (mins)"
                            onChange={(e) =>
                              updateField(
                                b.id,
                                "eta",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateExtraDetails(
                              b.id
                            )
                          }
                          className="admin-save-button"
                        >
                          Save Technician Details
                        </button>

                        {b.completionUrl && (
                          <button
                            type="button"
                            className="admin-whatsapp-button"
                            onClick={() => {
                              const clientPhone = String(
                                b.phone || b.mobile || b.customerPhone ||
                                b.customer?.phone || b.user?.phone || b.userPhone || ""
                              ).replace(/\\D/g, "");
                              if (!clientPhone) {
                                alert("Customer phone number is missing.");
                                return;
                              }
                               const whatsappPhone = clientPhone.length === 10 ? `91${clientPhone}` : clientPhone;
                              const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                                `Hello! Here is your OnCall service completion link: ${b.completionUrl}`
                              )}`;
                              window.open(url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            📲 Resend Completion Link to Client
                          </button>
                        )}
                      </div>
                    )}

                  </article>
                );
              })}

            </div>
          )}
        </section>

      </div>
    </div>
  );
}