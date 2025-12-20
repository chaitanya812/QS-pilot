// src/pages/AdminDashboardLocal.jsx
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
import { openWhatsAppForTechnician } from "../utils/whatsapp";

export default function AdminDashboardLocal() {
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const techs = JSON.parse(localStorage.getItem("technicians") || "[]");
    setTechnicians(techs);

    return () => unsubscribe();
  }, []);

  const assignTechnician = async (bookingId, technician) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: "Assigned",
        technicianId: technician.id,
        technicianName: technician.name,
        technicianPhone: technician.phone,
        technicianRating: technician.rating ?? 0,
        assignedAt: new Date().toISOString(),
      });
      alert("Technician Assigned!");
    } catch {
      alert("Failed to assign technician");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {bookings.map((b) => {
        const assignedTech = technicians.find((t) => t.id === b.technicianId);

        return (
          <div key={b.id} className="border bg-white p-3 rounded mb-3 shadow">
            <strong>{b.service}</strong>
            <div className="text-sm">{b.subService}</div>
            <div className="text-sm">📅 {b.date} — {b.time}</div>
            <div className="text-sm">📍 {b.address}</div>
            <div className="text-sm">📞 {b.phone}</div>

            <div className="mt-1 text-sm">
              Status: <b>{b.status}</b>
            </div>

            {b.status === "Pending" && technicians.length > 0 && (
              <select
                className="w-full mt-2 border p-2 rounded"
                onChange={(e) => {
                  const tech = technicians.find((t) => t.id === e.target.value);
                  if (tech) assignTechnician(b.id, tech);
                }}
              >
                <option>Select Technician</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ⭐ {t.rating ?? 0}
                  </option>
                ))}
              </select>
            )}

            {b.status === "Assigned" && assignedTech?.phone && (
              <button
                onClick={() => openWhatsAppForTechnician(assignedTech.phone, b)}
                className="mt-2 w-full p-2 bg-green-600 text-white rounded"
              >
                📲 Notify Technician on WhatsApp
              </button>
            )}

            {b.technicianName && (
              <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                👨‍🔧 {b.technicianName} · ⭐ {b.technicianRating}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
