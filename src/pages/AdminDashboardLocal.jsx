import React, {
  useEffect,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

import {
  openWhatsAppForTechnician,
} from "../utils/whatsapp";

export default function AdminDashboardLocal() {

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    technicians,
    setTechnicians,
  ] = useState([]);

  const [
    form,
    setForm,
  ] = useState({});

  /*
  ==========================================================
  LOAD BOOKINGS
  ==========================================================
  */

  useEffect(() => {

    const q = query(
      collection(
        db,
        "bookings"
      ),
      orderBy(
        "createdAt",
        "desc"
      )
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {

          setBookings(
            snapshot.docs.map(
              (d) => ({
                id: d.id,
                ...d.data(),
              })
            )
          );

        },
        (error) => {

          console.error(
            "Booking listener error:",
            error
          );

        }
      );

    /*
    ----------------------------------------------------------
    LOAD TECHNICIANS
    ----------------------------------------------------------
    */

    try {

      const techs =
        JSON.parse(
          localStorage.getItem(
            "technicians"
          ) || "[]"
        );

      setTechnicians(
        techs
      );

    } catch (error) {

      console.error(
        "Technician loading error:",
        error
      );

      setTechnicians([]);
    }

    return () =>
      unsubscribe();

  }, []);

  /*
  ==========================================================
  ASSIGN TECHNICIAN
  ==========================================================
  */

  const assignTechnician =
    async (
      booking,
      tech
    ) => {

      try {

        await updateDoc(
          doc(
            db,
            "bookings",
            booking.id
          ),
          {

            status:
              "Assigned",

            technicianId:
              tech.id,

            technicianName:
              tech.name,

            technicianPhone:
              tech.phone,

            technicianRating:
              tech.rating ?? 4.5,

            technicianPhoto:
              tech.photo ||
              null,

            completedJobs:
              tech.jobs ?? 20,

            eta:
              30,

            assignedAt:
              new Date().toISOString(),
          }
        );

        alert(
          "Technician Assigned ✔"
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Failed to assign technician"
        );
      }
    };

  /*
  ==========================================================
  UPDATE TECHNICIAN DETAILS
  ==========================================================
  */

  const updateExtraDetails =
    async (
      bookingId
    ) => {

      try {

        const values =
          form[bookingId] ||
          {};

        await updateDoc(
          doc(
            db,
            "bookings",
            bookingId
          ),
          {

            technicianPhoto:
              values.photo ||
              null,

            technicianRating:
              Number(
                values.rating
              ) || 4.5,

            completedJobs:
              Number(
                values.jobs
              ) || 20,

            eta:
              Number(
                values.eta
              ) || null,
          }
        );

        alert(
          "Updated successfully ✔"
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Failed to update details"
        );
      }
    };

  /*
  ==========================================================
  UPDATE FORM
  ==========================================================
  */

  const updateField =
    (
      bookingId,
      key,
      value
    ) => {

      setForm(
        (prev) => ({
          ...prev,

          [bookingId]: {

            ...prev[
              bookingId
            ],

            [key]:
              value,
          },
        })
      );
    };

  /*
  ==========================================================
  UI
  ==========================================================
  */

  return (

    <div className="p-4 bg-gray-50 min-h-screen pb-20">

      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h1 className="text-2xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              QuickSeva bookings
            </p>

          </div>

          <div className="bg-green-100 text-green-700 px-3 py-2 rounded-xl text-sm font-semibold">
            🔔 Notifications Active
          </div>

        </div>

        {bookings.length === 0 ? (

          <div className="bg-white rounded-2xl p-8 text-center shadow">

            <div className="text-4xl mb-3">
              📭
            </div>

            <h2 className="font-bold text-lg">
              No bookings yet
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              New QuickSeva bookings will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {bookings.map(
              (b) => {

                const assignedTech =
                  technicians.find(
                    (t) =>
                      t.id ===
                      b.technicianId
                  );

                return (

                  <div
                    key={b.id}
                    className="border bg-white p-4 rounded-2xl shadow"
                  >

                    {/* SERVICE */}

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <strong className="text-lg">
                          {b.service ||
                            "Service"}
                        </strong>

                        {b.subService && (

                          <div className="text-sm text-gray-600">
                            {b.subService}
                          </div>

                        )}

                      </div>

                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                        {b.status ||
                          "Pending"}
                      </span>

                    </div>

                    {/* BOOKING DETAILS */}

                    <div className="mt-4 space-y-2 text-sm">

                      <div>
                        📅{" "}
                        <b>Date:</b>{" "}
                        {b.date ||
                          "Not provided"}
                      </div>

                      <div>
                        ⏰{" "}
                        <b>Time:</b>{" "}
                        {b.time ||
                          "Not provided"}
                      </div>

                      <div>
                        📍{" "}
                        <b>Address:</b>{" "}
                        {b.address ||
                          "Not provided"}
                      </div>

                      <div>
                        📞{" "}
                        <b>Customer:</b>{" "}
                        {b.phone ||
                          "Not provided"}
                      </div>

                    </div>

                    {/* ASSIGN TECHNICIAN */}

                    {b.status ===
                      "Pending" &&
                      technicians.length >
                        0 && (

                        <select
                          className="w-full mt-4 border p-3 rounded-xl"
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

                          {technicians.map(
                            (t) => (

                              <option
                                key={t.id}
                                value={t.id}
                              >
                                {t.name} ⭐{" "}
                                {t.rating ??
                                  0}
                              </option>

                            )
                          )}

                        </select>

                      )}

                    {/* TECHNICIAN */}

                    {b.technicianName && (

                      <div className="mt-4 bg-gray-100 p-3 rounded-xl">

                        <div className="font-semibold">
                          👨‍🔧{" "}
                          {b.technicianName}
                        </div>

                        <div className="text-sm mt-1">
                          ⭐{" "}
                          {b.technicianRating ||
                            4.5}
                        </div>

                        <div className="text-sm">
                          ETA:{" "}
                          {b.eta ||
                            "--"}{" "}
                          mins
                        </div>

                        {b.technicianPhone && (

                          <div className="text-sm">
                            📞{" "}
                            {b.technicianPhone}
                          </div>

                        )}

                      </div>

                    )}

                    {/* EDIT TECH DETAILS */}

                    {b.status ===
                      "Assigned" && (

                      <div className="mt-4">

                        <div className="grid grid-cols-2 gap-2">

                          <input
                            className="border p-2 rounded-xl"
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
                            className="border p-2 rounded-xl"
                            placeholder="Rating"
                            type="number"
                            step="0.1"
                            onChange={(e) =>
                              updateField(
                                b.id,
                                "rating",
                                e.target.value
                              )
                            }
                          />

                          <input
                            className="border p-2 rounded-xl"
                            placeholder="Jobs Done"
                            type="number"
                            onChange={(e) =>
                              updateField(
                                b.id,
                                "jobs",
                                e.target.value
                              )
                            }
                          />

                          <input
                            className="border p-2 rounded-xl"
                            placeholder="ETA (mins)"
                            type="number"
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
                          onClick={() =>
                            updateExtraDetails(
                              b.id
                            )
                          }
                          className="mt-3 w-full p-3 bg-blue-600 text-white rounded-xl font-semibold"
                        >
                          Save Technician Details
                        </button>

                        {assignedTech?.phone && (

                          <button
                            onClick={() =>
                              openWhatsAppForTechnician(
                                assignedTech.phone,
                                b
                              )
                            }
                            className="mt-2 w-full p-3 bg-green-600 text-white rounded-xl font-semibold"
                          >
                            📲 Notify Technician via WhatsApp
                          </button>

                        )}

                      </div>

                    )}

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}