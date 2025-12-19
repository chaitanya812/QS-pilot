import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// ✅ NEW IMPORT (ONLY ADDITION)
import { openWhatsAppForTechnician } from "../utils/whatsapp";

export default function AdminDashboardLocal() {
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    // 🔥 LIVE BOOKINGS FROM FIRESTORE
    const q = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setBookings(list);
    });

    // ✅ LOCAL TECHNICIANS (UNCHANGED)
    const techs = JSON.parse(localStorage.getItem("technicians") || "[]");
    setTechnicians(techs);

    return () => unsubscribe();
  }, []);

  /* ✅ ASSIGN TECHNICIAN → UPDATE FIRESTORE */
  const assignTechnician = async (bookingId, technician) => {
    try {
      const ref = doc(db, "bookings", bookingId);

      await updateDoc(ref, {
        status: "Assigned",
        technicianId: technician.id,
        technicianName: technician.name,
        technicianRating: technician.rating ?? 0,
        assignedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error assigning technician:", error);
      alert("Failed to assign technician");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet</p>
      ) : (
        bookings.map((b) => {
          const assignedTech = technicians.find(
            (t) => t.id === b.technicianId
          );

          return (
            <div
              key={b.id}
              className="border rounded-lg p-3 mb-3 bg-white shadow"
            >
              <div className="font-semibold">{b.service}</div>
              <div className="text-sm text-gray-600">{b.subService}</div>

              <div className="text-sm mt-1">
                📅 {b.date} · ⏰ {b.time}
              </div>

              <div className="text-sm mt-1">📍 {b.address}</div>
              <div className="text-sm mt-1">📞 {b.phone}</div>

              <div className="text-sm mt-2">
                Status: <strong>{b.status}</strong>
              </div>

              {/* ✅ ASSIGN TECHNICIAN DROPDOWN (UNCHANGED) */}
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
                        {t.name} ⭐ {t.rating ?? 0}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ✅ NEW BUTTON: NOTIFY TECHNICIAN ON WHATSAPP */}
              {b.status === "Assigned" && assignedTech?.phone && (
                <button
                  onClick={() =>
                    openWhatsAppForTechnician(assignedTech.phone, b)
                  }
                  className="mt-3 w-full p-2 bg-green-600 text-white rounded"
                >
                  📲 Notify Technician on WhatsApp
                </button>
              )}

              {/* ✅ SHOW ASSIGNED TECH */}
              {b.technicianName && (
                <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  👨‍🔧 {b.technicianName} · ⭐ {b.technicianRating}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
