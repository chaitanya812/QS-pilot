import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("Upcoming");

  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [cancelBooking, setCancelBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState({ hour: "", minute: "", period: "AM" });

  const supportPhone = "7661045308";

  /* ================= LOAD BOOKINGS ================= */
  useEffect(() => {
    if (!user?.phone) return;

    const q = query(
      collection(db, "bookings"),
      where("phone", "==", user.phone),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // 🔥 FIX — remove duplicate bookings completely
      const unique = Array.from(new Map(list.map(item => [item.id, item])).values());

      setBookings(unique);
    });

    return () => unsub();
  }, [user?.phone]);

  /* ================= AUTO REVIEW ================= */
  useEffect(() => {
    if (reviewBooking) return;

    const completedUnrated = bookings.find(
      (b) => b.status === "Completed" && b.proRating == null
    );

    if (!completedUnrated) return;

    const timer = setTimeout(() => {
      setReviewBooking(completedUnrated);
      setFilter("Completed");
    }, 10000);

    return () => clearTimeout(timer);
  }, [bookings, reviewBooking]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    if (filter === "Upcoming")
      return bookings.filter(
        (b) => b.status !== "Completed" && b.status !== "Cancelled"
      );

    if (filter === "Completed")
      return bookings.filter((b) => b.status === "Completed");

    if (filter === "Cancelled")
      return bookings.filter((b) => b.status === "Cancelled");

    return bookings;
  }, [filter, bookings]);

  /* ================= REVIEW ================= */
  const submitReview = async () => {
    if (!rating) return alert("Please rate");

    try {
      const ref = doc(db, "bookings", reviewBooking.id);

      await updateDoc(ref, {
        proRating: rating,
        proReview: review,
      });

      setReviewBooking(null);
      setRating(0);
      setReview("");
    } catch {
      alert("Failed to submit review");
    }
  };

  /* ================= CANCEL BOOKING ================= */
  const cancelUserBooking = async () => {
    try {
      if (cancelBooking?.technicianId || cancelBooking?.technicianName) {
        alert(
          "This booking has been assigned to a technician. To cancel an assigned booking, please contact customer support."
        );
        return;
      }

      await updateDoc(doc(db, "bookings", cancelBooking.id), {
        status: "Cancelled",
        cancelledAt: new Date().toISOString(),
      });

      setCancelBooking(null);
    } catch {
      alert("Failed to cancel booking");
    }
  };

  /* ================= STATUS BAR ================= */
  const steps = [
    "Pending",
    "Assigned",
    "Accepted",
    "On The Way",
    "Work Started",
    "Completed",
  ];

  const StatusBar = ({ status }) => {
    const index = steps.indexOf(status);
    return (
      <div className="mt-3">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="h-2 bg-qsBlue-500 rounded-full transition-all duration-700"
            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] mt-1">
          {steps.map((s) => (
            <span
              key={s}
              className={`${s === status ? "text-qsBlue-600 font-semibold" : "text-gray-400"
                }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded bg-gray-200"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">My Bookings</h1>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-4">
        {["Upcoming", "Completed", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm border ${filter === f
              ? "bg-qsBlue-500 text-white"
              : "bg-white text-gray-600"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* BOOKINGS */}
      {filtered.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          No {filter.toLowerCase()} bookings yet
        </div>
      ) : (
        filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white border rounded-2xl p-4 mb-3 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <strong className="text-lg">{b.service}</strong>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">
                {b.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">{b.subService}</p>
            <p className="text-sm">📅 {b.date} — ⏰ {b.time}</p>
            <p className="text-sm">📍 {b.address}</p>

            {/* Technician Card */}
            {b.technicianName && (
              <div className="mt-3 bg-blue-50 border border-blue-200 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={b.technicianPhoto || "/default-tech.png"}
                    className="w-12 h-12 rounded-full border"
                    alt="tech"
                  />

                  <div>
                    <p className="font-semibold">{b.technicianName}</p>
                    <p className="text-sm text-gray-600">
                      ⭐ {b.technicianRating || 4.5} · {b.completedJobs || 20} Jobs Done
                    </p>

                    {b.eta && (
                      <p className="text-sm text-green-600">
                        ETA: {b.eta} mins
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = `tel:${b.technicianPhone}`}
                  className="mt-3 w-full bg-green-600 text-white py-2 rounded"
                >
                  📞 Call Technician
                </button>
              </div>
            )}

            {/* ACTION BUTTONS */}
            {b.status !== "Completed" && b.status !== "Cancelled" && (
              <div className="relative z-50 flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={() => setEditBooking(b)}
                  className="w-full sm:flex-1 bg-yellow-500 text-white py-2 rounded"
                >
                  ✏️ Edit
                </button>

                {(b.technicianId || b.technicianName) ? (
                  <a
                    href={`tel:+${supportPhone}`}
                    className="w-full sm:flex-1 block text-center bg-orange-500 text-white py-2 rounded"
                  >
                    📞 Contact Support
                  </a>
                ) : (
                  <button
                    onClick={() => setCancelBooking(b)}
                    className="w-full sm:flex-1 bg-red-600 text-white py-2 rounded"
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            )}

            {/* Status Progress */}
            <StatusBar status={b.status} />
          </div>
        ))
      )}

      {/* ⭐ REVIEW POPUP */}
      {reviewBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-5 w-11/12 max-w-sm">
            <h3 className="text-lg font-semibold mb-2">
              Rate Your Professional
            </h3>

            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-2xl cursor-pointer ${n <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write feedback (optional)"
              className="w-full p-2 border rounded mb-3"
            />

            <button
              onClick={submitReview}
              className="w-full p-3 bg-qsBlue-500 text-white rounded"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* ❌ CANCEL POPUP */}
      {cancelBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-11/12 max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2">
              Cancel Booking?
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              This cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCancelBooking(null)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                No
              </button>

              <button
                onClick={cancelUserBooking}
                className="flex-1 bg-red-600 text-white py-2 rounded"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT POPUP WITH 12 HOUR TIME */}
      {editBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-11/12 max-w-sm">
            <h3 className="text-lg font-semibold mb-3">
              Reschedule Booking
            </h3>

            <input
              type="date"
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />

            <div className="flex gap-2">
              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setNewTime((p) => ({ ...p, hour: e.target.value }))
                }
              >
                <option value="">Hour</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => (
                  <option key={h}>{h}</option>
                ))}
              </select>

              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setNewTime((p) => ({ ...p, minute: e.target.value }))
                }
              >
                <option value="">Min</option>
                {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setNewTime((p) => ({ ...p, period: e.target.value }))
                }
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditBooking(null)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!newDate || !newTime.hour || !newTime.minute)
                    return alert("Select date & time");

                  const formattedTime = `${newTime.hour}:${newTime.minute} ${newTime.period}`;

                  try {
                    await updateDoc(doc(db, "bookings", editBooking.id), {
                      date: newDate,
                      time: formattedTime,
                      rescheduledAt: new Date().toISOString(),
                    });

                    setEditBooking(null);
                  } catch {
                    alert("Failed to update booking");
                  }
                }}
                className="flex-1 bg-qsBlue-500 text-white py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
