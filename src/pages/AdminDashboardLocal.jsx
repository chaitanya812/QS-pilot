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
  const [form, setForm] = useState({});

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const techs = JSON.parse(localStorage.getItem("technicians") || "[]");
    setTechnicians(techs);

    return () => unsubscribe();
  }, []);

  const assignTechnician = async (booking, tech) => {
    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        status: "Assigned",
        technicianId: tech.id,
        technicianName: tech.name,
        technicianPhone: tech.phone,
        technicianRating: tech.rating ?? 4.5,
        technicianPhoto: tech.photo || null,
        completedJobs: tech.jobs ?? 20,
        eta: 30,
        assignedAt: new Date().toISOString(),
      });

      alert("Technician Assigned ✔");
    } catch (e) {
      alert("Failed to assign technician");
    }
  };

  const updateExtraDetails = async (bookingId) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        technicianPhoto: form[bookingId]?.photo || null,
        technicianRating: Number(form[bookingId]?.rating) || 4.5,
        completedJobs: Number(form[bookingId]?.jobs) || 20,
        eta: Number(form[bookingId]?.eta) || null,
      });

      alert("Updated successfully ✔");
    } catch (e) {
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

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {bookings.map((b) => {
        const assignedTech = technicians.find((t) => t.id === b.technicianId);

        return (
          <div
            key={b.id}
            className="border bg-white p-3 rounded-xl mb-3 shadow"
          >
            <strong className="text-lg">{b.service}</strong>
            <div className="text-sm text-gray-600">{b.subService}</div>

            <div className="text-sm mt-1">
              📅 {b.date} — ⏰ {b.time}
            </div>

            <div className="text-sm mt-1">📍 {b.address}</div>
            <div className="text-sm mt-1">📞 {b.phone}</div>

            <div className="text-sm mt-2">
              Status: <b>{b.status}</b>
            </div>

            {/* Assign Technician */}
            {b.status === "Pending" && technicians.length > 0 && (
              <select
                className="w-full mt-2 border p-2 rounded"
                onChange={(e) => {
                  const tech = technicians.find(
                    (t) => t.id === e.target.value
                  );
                  if (tech) assignTechnician(b, tech);
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

            {/* Technician Details Display */}
            {b.technicianName && (
              <div className="mt-3 bg-gray-100 p-2 rounded">
                👨‍🔧 <b>{b.technicianName}</b>
                <br />
                ⭐ {b.technicianRating || 4.5}
                <br />
                ETA: {b.eta || "--"} mins
              </div>
            )}

            {/* Editable Fields */}
            {b.status === "Assigned" && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Tech Photo URL"
                  onChange={(e) =>
                    updateField(b.id, "photo", e.target.value)
                  }
                />

                <input
                  className="border p-2 rounded"
                  placeholder="Rating (4.5)"
                  type="number"
                  step="0.1"
                  onChange={(e) =>
                    updateField(b.id, "rating", e.target.value)
                  }
                />

                <input
                  className="border p-2 rounded"
                  placeholder="Jobs Done"
                  type="number"
                  onChange={(e) => updateField(b.id, "jobs", e.target.value)}
                />

                <input
                  className="border p-2 rounded"
                  placeholder="ETA (mins)"
                  type="number"
                  onChange={(e) => updateField(b.id, "eta", e.target.value)}
                />
              </div>
            )}

            {b.status === "Assigned" && (
              <>
                <button
                  onClick={() => updateExtraDetails(b.id)}
                  className="mt-2 w-full p-2 bg-blue-600 text-white rounded"
                >
                  Save Technician Details
                </button>

                {assignedTech?.phone && (
                  <button
                    onClick={() =>
                      openWhatsAppForTechnician(assignedTech.phone, b)
                    }
                    className="mt-2 w-full p-2 bg-green-600 text-white rounded"
                  >
                    📲 Notify via WhatsApp
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
