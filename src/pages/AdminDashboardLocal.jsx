import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

/* ✅ ADMIN DASHBOARD (Firestore bookings) */
export default function AdminDashboardLocal() {
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    // 🔥 READ BOOKINGS FROM FIRESTORE (LIVE)
    const q = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(list);
    });

    // ✅ LOCAL TECHNICIANS (unchanged)
    const techs = JSON.parse(localStorage.getItem("technicians") || "[]");
    setTechnicians(techs);

    return () => unsubscribe();
  }, []);

  /* ❗ KEEP ASSIGN FUNCTION AS-IS (local only for now) */
  const assignTechnician = (bookingId, technician) => {
    alert(
      "Status update will be connected to Firestore in the next step"
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            className="border rounded-lg p-3 mb-3 bg-white shadow"
          >
            <div className="font-semibold">{b.service}</div>
            <div className="text-sm text-gray-600">{b.subService}</div>

            <div className="text-sm mt-1">
              📅 {b.date} · ⏰ {b.time}
            </div>

            <div className="text-sm mt-1">
              📍 {b.address}
            </div>

            <div className="text-sm mt-1">
              📞 {b.phone}
            </div>

            <div className="text-sm mt-2">
              Status: <strong>{b.status}</strong>
            </div>

            {/* ✅ TECH ASSIGN DROPDOWN (UI SAME, logic later) */}
            {b.status === "Pending" && technicians.length > 0 && (
              <div className="mt-3">
                <select
                  onChange={(e) => {
                    const tech = technicians.find(
                      (t) => t.id === e.target.value
                    );
                    if (tech) assignTechnician(b.id, tech);
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Assign Technician</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ⭐ {t.rating}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ✅ SHOW ASSIGNED TECH (if exists) */}
            {b.technicianName && (
              <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                👨‍🔧 {b.technicianName} · ⭐ {b.technicianRating}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
