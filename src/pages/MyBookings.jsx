import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ✅ New Firebase imports */
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

  /* ================= LOAD BOOKINGS FROM FIREBASE ================= */
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
      setBookings(list);
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
        (b) => b.status === "Pending" || b.status === "Assigned"
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
    } catch (err) {
      console.error("Review update failed", err);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="p-4 pb-28 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded bg-gray-200">
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
            className={`px-4 py-1 rounded-full text-sm border ${
              filter === f
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
        <div className="text-center mt-16 text-gray-500">
          No {filter.toLowerCase()} bookings yet
        </div>
      ) : (
        filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white border rounded-xl p-4 mb-3 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <strong>{b.service}</strong>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">
                {b.status}
              </span>
            </div>

            <p className="text-sm">{b.subService}</p>
            <p className="text-sm">
              📅 {b.date} — ⏰ {b.time}
            </p>
            <p className="text-sm">📍 {b.address}</p>

            {b.status === "Assigned" && (
              <button
                onClick={() => navigate(`/track/${b.id}`)}
                className="mt-3 w-full text-sm py-2 rounded bg-qsBlue-500 text-white"
              >
                📍 Track Technician
              </button>
            )}
          </div>
        ))
      )}

      {/* ⭐ REVIEW POPUP */}
      {reviewBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-11/12 max-w-sm">
            <h3 className="text-lg font-semibold mb-2">
              Rate Your Professional
            </h3>

            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-2xl cursor-pointer ${
                    n <= rating ? "text-yellow-400" : "text-gray-300"
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
    </div>
  );
}
