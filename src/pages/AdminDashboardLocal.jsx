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
import { openWhatsAppForTechnician } from "../utils/whatsapp";

export default function AdminDashboardLocal() {
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [form, setForm] = useState({});

  const initializedRef = useRef(false);
  const knownBookingIdsRef = useRef(new Set());

  // --------------------------------------------------
  // Browser notification permission
  // --------------------------------------------------

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  // --------------------------------------------------
  // New order notification
  // --------------------------------------------------

  const notifyNewOrder = (booking) => {
    console.log("NEW QUICKSEVA ORDER:", booking);

    // Browser notification
    if (
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      const serviceName =
        booking.subService ||
        booking.service ||
        "New Service";

      const customerPhone =
        booking.phone || "Customer";

      const notification = new Notification(
        "🚨 New QuickSeva Order",
        {
          body:
            serviceName +
            "\nCustomer: " +
            customerPhone,
          icon: "/favicon.ico",
          tag: "quickseva-" + booking.id,
        }
      );

      notification.onclick = () => {
        window.focus();
        notification.close();

        const element = document.getElementById(
          "booking-" + booking.id
        );

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      };
    }

    // Simple notification sound
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (AudioContext) {
        const audioContext = new AudioContext();

        const oscillator =
          audioContext.createOscillator();

        const gain =
          audioContext.createGain();

        oscillator.frequency.value = 880;
        oscillator.type = "sine";

        gain.gain.setValueAtTime(
          0.001,
          audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.25,
          audioContext.currentTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + 0.6
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
          audioContext.currentTime + 0.6
        );

        setTimeout(() => {
          audioContext.close().catch(() => {});
        }, 1000);
      }
    } catch (error) {
      console.log(
        "Notification sound unavailable"
      );
    }
  };

  // --------------------------------------------------
  // Firestore booking listener
  // --------------------------------------------------

  useEffect(() => {
    const bookingsQuery = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const newBookings = snapshot.docs.map(
          (bookingDoc) => ({
            id: bookingDoc.id,
            ...bookingDoc.data(),
          })
        );

        // First load:
        // remember existing orders without notifying
        if (!initializedRef.current) {
          newBookings.forEach((booking) => {
            knownBookingIdsRef.current.add(
              booking.id
            );
          });

          initializedRef.current = true;
        } else {
          // Later updates:
          // notify only when a NEW booking document appears
          newBookings.forEach((booking) => {
            const isNew =
              !knownBookingIdsRef.current.has(
                booking.id
              );

            if (isNew) {
              knownBookingIdsRef.current.add(
                booking.id
              );

              if (
                !booking.status ||
                booking.status === "Pending"
              ) {
                notifyNewOrder(booking);
              }
            }
          });
        }

        setBookings(newBookings);
      },
      (error) => {
        console.error(
          "Booking listener error:",
          error
        );
      }
    );

    // Load technicians
    try {
      const savedTechnicians =
        JSON.parse(
          localStorage.getItem(
            "technicians"
          ) || "[]"
        );

      setTechnicians(savedTechnicians);
    } catch (error) {
      console.error(
        "Unable to load technicians:",
        error
      );

      setTechnicians([]);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // --------------------------------------------------
  // Assign technician
  // --------------------------------------------------

  const assignTechnician = async (
    booking,
    technician
  ) => {
    try {
      await updateDoc(
        doc(db, "bookings", booking.id),
        {
          status: "Assigned",
          technicianId: technician.id,
          technicianName: technician.name,
          technicianPhone: technician.phone,
          technicianRating:
            technician.rating ?? 4.5,
          technicianPhoto:
            technician.photo || null,
          completedJobs:
            technician.jobs ?? 20,
          eta: 30,
          assignedAt:
            new Date().toISOString(),
        }
      );

      alert("Technician Assigned ✔");
    } catch (error) {
      console.error(
        "Technician assignment error:",
        error
      );

      alert(
        "Failed to assign technician"
      );
    }
  };

  // --------------------------------------------------
  // Update technician details
  // --------------------------------------------------

  const updateExtraDetails = async (
    bookingId
  ) => {
    try {
      const currentForm =
        form[bookingId] || {};

      await updateDoc(
        doc(db, "bookings", bookingId),
        {
          technicianPhoto:
            currentForm.photo || null,

          technicianRating:
            Number(currentForm.rating) || 4.5,

          completedJobs:
            Number(currentForm.jobs) || 20,

          eta:
            Number(currentForm.eta) || null,
        }
      );

      alert(
        "Technician details updated ✔"
      );
    } catch (error) {
      console.error(
        "Update technician error:",
        error
      );

      alert(
        "Failed to update technician details"
      );
    }
  };

  // --------------------------------------------------
  // Form update
  // --------------------------------------------------

  const updateField = (
    bookingId,
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,

      [bookingId]: {
        ...(previous[bookingId] || {}),
        [field]: value,
      },
    }));
  };

  // --------------------------------------------------
  // Scroll to order
  // --------------------------------------------------

  const viewOrder = (bookingId) => {
    const element =
      document.getElementById(
        "booking-" + bookingId
      );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // --------------------------------------------------
  // Pending orders
  // --------------------------------------------------

  const pendingCount =
    bookings.filter(
      (booking) =>
        !booking.status ||
        booking.status === "Pending"
    ).length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            QuickSeva Orders
          </p>
        </div>

        <div className="bg-white rounded-full px-4 py-2 shadow">
          🔔{" "}
          <span className="font-bold">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* PENDING ORDERS */}

      {pendingCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-2xl mb-5">
          <div className="font-bold">
            🚨 {pendingCount} Pending Order
            {pendingCount !== 1 ? "s" : ""}
          </div>

          <div className="text-sm mt-1">
            New customer bookings need
            technician assignment.
          </div>
        </div>
      )}

      {/* NO ORDERS */}

      {bookings.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow">
          <div className="text-5xl mb-3">
            📭
          </div>

          <h2 className="font-bold text-lg">
            No orders yet
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            New QuickSeva bookings will
            appear here automatically.
          </p>
        </div>
      )}

      {/* BOOKING LIST */}

      <div className="space-y-4">

        {bookings.map((booking) => {
          const assignedTechnician =
            technicians.find(
              (technician) =>
                technician.id ===
                booking.technicianId
            );

          const isPending =
            !booking.status ||
            booking.status === "Pending";

          return (
            <div
              key={booking.id}
              id={
                "booking-" +
                booking.id
              }
              className={
                "bg-white rounded-2xl p-4 shadow border " +
                (isPending
                  ? "border-orange-300"
                  : "border-gray-200")
              }
            >

              {/* NEW ORDER */}

              {isPending && (
                <div className="flex items-center justify-between mb-4">

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                    🔴 NEW ORDER
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      viewOrder(
                        booking.id
                      )
                    }
                    className="text-xs underline text-gray-500"
                  >
                    View
                  </button>

                </div>
              )}

              {/* SERVICE */}

              <h2 className="text-lg font-bold">
                {booking.service ||
                  "QuickSeva Service"}
              </h2>

              <p className="text-sm text-gray-600">
                {booking.subService ||
                  "Service request"}
              </p>

              {/* CUSTOMER */}

              {(booking.customerName ||
                booking.name) && (
                <div className="text-sm mt-3">
                  👤{" "}
                  <b>
                    {booking.customerName ||
                      booking.name}
                  </b>
                </div>
              )}

              {/* DATE */}

              <div className="text-sm mt-2">
                📅 {booking.date || "--"}
              </div>

              {/* TIME */}

              <div className="text-sm mt-1">
                ⏰ {booking.time || "--"}
              </div>

              {/* ADDRESS */}

              <div className="text-sm mt-2">
                📍{" "}
                {booking.address ||
                  "Address not available"}
              </div>

              {/* PHONE */}

              <div className="text-sm mt-2">
                📞{" "}
                {booking.phone || "--"}
              </div>

              {/* STATUS */}

              <div className="mt-3 text-sm">
                Status:{" "}
                <b
                  className={
                    isPending
                      ? "text-orange-600"
                      : "text-green-600"
                  }
                >
                  {booking.status ||
                    "Pending"}
                </b>
              </div>

              {/* ASSIGN TECHNICIAN */}

              {isPending &&
                technicians.length > 0 && (
                  <div className="mt-4">

                    <label className="text-sm font-semibold">
                      Assign Technician
                    </label>

                    <select
                      defaultValue=""
                      className="w-full mt-2 border rounded-xl p-3 bg-white"
                      onChange={(event) => {
                        const technician =
                          technicians.find(
                            (item) =>
                              item.id ===
                              event.target.value
                          );

                        if (technician) {
                          assignTechnician(
                            booking,
                            technician
                          );
                        }
                      }}
                    >
                      <option value="">
                        Select Technician
                      </option>

                      {technicians.map(
                        (technician) => (
                          <option
                            key={
                              technician.id
                            }
                            value={
                              technician.id
                            }
                          >
                            {technician.name} ⭐{" "}
                            {technician.rating ??
                              0}
                          </option>
                        )
                      )}
                    </select>

                  </div>
                )}

              {/* TECHNICIAN DETAILS */}

              {booking.technicianName && (
                <div className="mt-4 bg-gray-100 rounded-xl p-3">

                  <p className="font-semibold">
                    👨‍🔧{" "}
                    {booking.technicianName}
                  </p>

                  <p className="text-sm mt-1">
                    ⭐{" "}
                    {booking.technicianRating ||
                      4.5}
                  </p>

                  <p className="text-sm">
                    🕐 ETA:{" "}
                    {booking.eta ||
                      "--"}{" "}
                    mins
                  </p>

                  {booking.technicianPhone && (
                    <p className="text-sm mt-1">
                      📞{" "}
                      {
                        booking.technicianPhone
                      }
                    </p>
                  )}

                </div>
              )}

              {/* TECHNICIAN EDIT */}

              {booking.status ===
                "Assigned" && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">

                  <input
                    type="text"
                    placeholder="Technician Photo URL"
                    value={
                      form[booking.id]
                        ?.photo || ""
                    }
                    onChange={(event) =>
                      updateField(
                        booking.id,
                        "photo",
                        event.target.value
                      )
                    }
                    className="border p-3 rounded-xl"
                  />

                  <input
                    type="number"
                    step="0.1"
                    placeholder="Rating"
                    value={
                      form[booking.id]
                        ?.rating || ""
                    }
                    onChange={(event) =>
                      updateField(
                        booking.id,
                        "rating",
                        event.target.value
                      )
                    }
                    className="border p-3 rounded-xl"
                  />

                  <input
                    type="number"
                    placeholder="Jobs Done"
                    value={
                      form[booking.id]
                        ?.jobs || ""
                    }
                    onChange={(event) =>
                      updateField(
                        booking.id,
                        "jobs",
                        event.target.value
                      )
                    }
                    className="border p-3 rounded-xl"
                  />

                  <input
                    type="number"
                    placeholder="ETA in minutes"
                    value={
                      form[booking.id]
                        ?.eta || ""
                    }
                    onChange={(event) =>
                      updateField(
                        booking.id,
                        "eta",
                        event.target.value
                      )
                    }
                    className="border p-3 rounded-xl"
                  />

                </div>
              )}

              {/* SAVE */}

              {booking.status ===
                "Assigned" && (
                <button
                  type="button"
                  onClick={() =>
                    updateExtraDetails(
                      booking.id
                    )
                  }
                  className="w-full mt-3 p-3 bg-blue-600 text-white rounded-xl font-semibold"
                >
                  Save Technician Details
                </button>
              )}

              {/* WHATSAPP */}

              {booking.status ===
                "Assigned" &&
                assignedTechnician?.phone && (
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsAppForTechnician(
                        assignedTechnician.phone,
                        booking
                      )
                    }
                    className="w-full mt-2 p-3 bg-green-600 text-white rounded-xl font-semibold"
                  >
                    📲 Notify Technician
                    via WhatsApp
                  </button>
                )}

            </div>
          );
        })}

      </div>
    </div>
  );
}