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
  const [editService, setEditService] = useState("");
  const [editSubService, setEditSubService] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState({ hour: "", minute: "", period: "AM" });

  // Support phone is kept only for company internal use — not shown to customer anymore
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
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const unique = Array.from(new Map(list.map(item => [item.id, item])).values());
      setBookings(unique);
    });

    return () => unsub();
  }, [user?.phone]);

  /* ================= AUTO SHOW REVIEW PROMPT ================= */
  useEffect(() => {
    if (reviewBooking) return;

    const completedUnrated = bookings.find(
      (b) => b.status === "Completed" && b.proRating == null
    );

    if (completedUnrated) {
      const timer = setTimeout(() => {
        setReviewBooking(completedUnrated);
        setFilter("Completed");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [bookings, reviewBooking]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    if (filter === "Upcoming") {
      return bookings.filter(b => b.status !== "Completed" && b.status !== "Cancelled");
    }
    if (filter === "Completed") {
      return bookings.filter(b => b.status === "Completed");
    }
    if (filter === "Cancelled") {
      return bookings.filter(b => b.status === "Cancelled");
    }
    return bookings;
  }, [filter, bookings]);

  /* ================= REVIEW SUBMIT ================= */
  const submitReview = async () => {
    if (!rating) return alert("Please select a rating");

    try {
      await updateDoc(doc(db, "bookings", reviewBooking.id), {
        proRating: rating,
        proReview: review,
      });
      setReviewBooking(null);
      setRating(0);
      setReview("");
      alert("Thank you for your feedback!");
    } catch (err) {
      alert("Could not submit review");
      console.error(err);
    }
  };

  /* ================= CANCEL ================= */
  const cancelUserBooking = async () => {
    try {
      await updateDoc(doc(db, "bookings", cancelBooking.id), {
        status: "Cancelled",
        cancelledAt: new Date().toISOString(),
      });
      setCancelBooking(null);
      alert("Booking cancelled successfully");
    } catch (err) {
      alert("Failed to cancel booking");
      console.error(err);
    }
  };

  /* ================= EDIT BOOKING ================= */
  const handleEditBooking = (booking) => {
    setEditBooking(booking);
    setEditService(booking.service || "");
    setEditSubService(booking.subService || "");
    setNewDate(booking.date || "");

    if (booking.time) {
      const [timePart, period] = booking.time.split(" ");
      const [h, m] = timePart.split(":");
      setNewTime({ hour: h || "", minute: m || "", period: period || "AM" });
    } else {
      setNewTime({ hour: "", minute: "", period: "AM" });
    }
  };

  const saveEditChanges = async () => {
    if (!newDate || !newTime.hour || !newTime.minute) {
      alert("Please select valid date and time");
      return;
    }

    const formattedTime = `${newTime.hour.padStart(2,'0')}:${newTime.minute.padStart(2,'0')} ${newTime.period}`;

    const updatePayload = {
      date: newDate,
      time: formattedTime,
      service: editService.trim(),
      subService: editSubService.trim(),
      lastModifiedAt: new Date().toISOString(),
      modificationRequested: true,   // flag for admin to review
    };

    try {
      await updateDoc(doc(db, "bookings", editBooking.id), updatePayload);
      alert("Changes saved! Our team will review and confirm shortly.");
      setEditBooking(null);
    } catch (err) {
      alert("Failed to save changes");
      console.error(err);
    }
  };

  /* ================= STATUS PROGRESS BAR ================= */
  const steps = ["Pending", "Assigned", "Accepted", "On The Way", "Work Started", "Completed"];

  const StatusBar = ({ status }) => {
    const index = steps.indexOf(status);
    const progress = index >= 0 ? ((index + 1) / steps.length) * 100 : 0;

    return (
      <div className="mt-4">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 text-gray-600">
          {steps.map(s => (
            <span key={s} className={s === status ? "font-bold text-blue-700" : ""}>
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
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-gray-200">
          ←
        </button>
        <h1 className="text-xl font-bold">My Bookings</h1>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {["Upcoming", "Completed", "Cancelled"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === f
                ? "bg-blue-600 text-white shadow"
                : "bg-white border text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* NO BOOKINGS */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {filter.toLowerCase()} bookings found
        </div>
      ) : (
        filtered.map(b => (
          <div
            key={b.id}
            className="bg-white rounded-2xl shadow-sm border mb-4 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{b.service}</h3>
                <p className="text-gray-600 text-sm mt-0.5">{b.subService}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                b.status === "Completed" ? "bg-green-100 text-green-800" :
                b.status === "Cancelled" ? "bg-red-100 text-red-800" :
                "bg-blue-100 text-blue-800"
              }`}>
                {b.status}
              </span>
            </div>

            <div className="mt-3 text-sm space-y-1 text-gray-700">
              <p>📅 {b.date} • ⏰ {b.time}</p>
              <p>📍 {b.address?.slice(0, 60)}{b.address?.length > 60 ? '...' : ''}</p>
            </div>

            {/* TECHNICIAN INFO — ONLY NAME + RATING */}
            {b.technicianName && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                    👨‍🔧
                  </div>
                  <div>
                    <div className="font-medium">{b.technicianName}</div>
                    <div className="text-sm text-gray-600">
                      Rating: ★ {b.technicianRating || "4.7"}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  For any questions or complaints, please contact QuickSeva support
                </p>
              </div>
            )}

            {/* ACTION BUTTONS */}
            {b.status !== "Completed" && b.status !== "Cancelled" && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEditBooking(b)}
                  className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium"
                >
                  ✏️ Edit Booking
                </button>

                <button
                  onClick={() => setCancelBooking(b)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            )}

            <StatusBar status={b.status} />
          </div>
        ))
      )}

      {/* REVIEW MODAL */}
      {reviewBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold mb-4">Rate Your Service</h3>

            <div className="flex justify-center gap-2 mb-5 text-4xl">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)}>
                  {n <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>

            <textarea
              className="w-full p-3 border rounded-xl mb-4 min-h-[100px]"
              placeholder="Your feedback (optional)"
              value={review}
              onChange={e => setReview(e.target.value)}
            />

            <button
              onClick={submitReview}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold"
            >
              Submit Review
            </button>

            <button
              onClick={() => setReviewBooking(null)}
              className="w-full mt-3 text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION */}
      {cancelBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Cancel Booking?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelBooking(null)}
                className="flex-1 py-3 border rounded-xl font-medium"
              >
                No
              </button>
              <button
                onClick={cancelUserBooking}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL — now allows adding/changing services anytime */}
      {editBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Booking</h3>
              <button onClick={() => setEditBooking(null)} className="text-2xl">×</button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Service</label>
                <input
                  className="w-full p-3 border rounded-xl"
                  value={editService}
                  onChange={e => setEditService(e.target.value)}
                  placeholder="e.g. Electrician, Plumbing, AC Repair..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description / Sub-service</label>
                <textarea
                  className="w-full p-3 border rounded-xl min-h-[100px]"
                  value={editSubService}
                  onChange={e => setEditSubService(e.target.value)}
                  placeholder="e.g. Fan installation, Tap leakage repair, Gas refill..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-xl"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Preferred Time</label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    className="p-3 border rounded-xl"
                    value={newTime.hour}
                    onChange={e => setNewTime(p => ({ ...p, hour: e.target.value }))}
                  >
                    <option value="">Hr</option>
                    {[...Array(12)].map((_,i) => (
                      <option key={i+1}>{String(i+1).padStart(2,'0')}</option>
                    ))}
                  </select>

                  <select
                    className="p-3 border rounded-xl"
                    value={newTime.minute}
                    onChange={e => setNewTime(p => ({ ...p, minute: e.target.value }))}
                  >
                    <option value="">Min</option>
                    {["00","15","30","45"].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    className="p-3 border rounded-xl"
                    value={newTime.period}
                    onChange={e => setNewTime(p => ({ ...p, period: e.target.value }))}
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-sm">
                <strong>Note:</strong> Changes will be reviewed by our team. You will be notified once confirmed.
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditBooking(null)}
                  className="flex-1 py-3 border rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditChanges}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}