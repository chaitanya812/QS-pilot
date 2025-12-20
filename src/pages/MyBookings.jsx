// src/pages/MyBookings.jsx
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
      alert("Failed to submit review");
    }
  };

  const steps = [
    "Pending",
    "Assigned",
    "Accepted",
    "On The Way",
    "Work Started",
    "Completed",
  ];

  const StatusTimeline = ({ current }) => (
    <div className="mt-2">
      {steps.map((s, i) => {
        const done = steps.indexOf(current) >= i;
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                done ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span
              className={`text-sm ${
                done ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              {s}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 pb-28 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-200 rounded">
          ←
        </button>
        <h1 className="text-xl font-bold">My Bookings</h1>
      </div>

      <div className="flex gap-2 mb-4">
        {["Upcoming", "Completed", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm border ${
              filter === f ? "bg-qsBlue-500 text-white" : "bg-white text-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          No {filter.toLowerCase()} bookings yet
        </div>
      ) : (
        filtered.map((b) => (
          <div key={b.id} className="bg-white border rounded-xl p-4 mb-3 shadow-sm">
            <div className="flex justify-between">
              <strong>{b.service}</strong>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">{b.status}</span>
            </div>

            <p className="text-sm">{b.subService}</p>
            <p className="text-sm">📅 {b.date} — ⏰ {b.time}</p>
            <p className="text-sm">📍 {b.address}</p>

            {b.technicianName && (
              <div className="mt-2 text-sm bg-blue-50 p-2 rounded">
                👨‍🔧 {b.technicianName}
                <br />
                📞 {b.technicianPhone}
              </div>
            )}

            <StatusTimeline current={b.status} />
          </div>
        ))
      )}

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
              className="w-full border p-2 rounded mb-3"
              placeholder="Write feedback (optional)"
            />

            <button
              onClick={submitReview}
              className="w-full p-3 bg-qsBlue-500 rounded text-white"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
