import React, {
  useEffect,
  useRef,
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
  SOUND SYSTEM
  ==========================================================
  */

  const audioContextRef =
    useRef(null);

  const soundEnabledRef =
    useRef(false);

  const initialBookingsLoadedRef =
    useRef(false);

  const previousBookingIdsRef =
    useRef(new Set());

  const [
    soundEnabled,
    setSoundEnabled,
  ] = useState(false);

  const [
    newBookingAlert,
    setNewBookingAlert,
  ] = useState(null);

  /*
  ==========================================================
  ENABLE NOTIFICATION SOUND
  ==========================================================
  */

  const enableNotificationSound =
    async () => {

      try {

        if (
          !audioContextRef.current
        ) {

          const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

          if (!AudioContext) {

            alert(
              "Your browser does not support notification sounds."
            );

            return;
          }

          audioContextRef.current =
            new AudioContext();
        }

        if (
          audioContextRef.current.state ===
          "suspended"
        ) {

          await audioContextRef.current.resume();
        }

        playNotificationSound();

        soundEnabledRef.current =
          true;

        setSoundEnabled(true);

        console.log(
          "[QuickSeva] Notification sound enabled."
        );

      } catch (error) {

        console.error(
          "[QuickSeva] Failed to enable sound:",
          error
        );

        alert(
          "Unable to enable notification sound. Please try again."
        );
      }
    };

  /*
  ==========================================================
  PLAY NOTIFICATION SOUND
  ==========================================================
  */

  const playNotificationSound =
    () => {

      try {

        const audioContext =
          audioContextRef.current;

        if (!audioContext) {
          return;
        }

        if (
          audioContext.state ===
          "suspended"
        ) {

          audioContext.resume();
        }

        const oscillator =
          audioContext.createOscillator();

        const gainNode =
          audioContext.createGain();

        oscillator.type =
          "sine";

        /*
        ------------------------------------------------------
        QUICKSEVA ALERT TONE
        ------------------------------------------------------
        */

        oscillator.frequency.setValueAtTime(
          880,
          audioContext.currentTime
        );

        oscillator.frequency.setValueAtTime(
          1174,
          audioContext.currentTime + 0.12
        );

        oscillator.frequency.setValueAtTime(
          880,
          audioContext.currentTime + 0.24
        );

        /*
        ------------------------------------------------------
        VOLUME
        ------------------------------------------------------
        */

        gainNode.gain.setValueAtTime(
          0.0001,
          audioContext.currentTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.35,
          audioContext.currentTime + 0.03
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContext.currentTime + 0.5
        );

        oscillator.connect(
          gainNode
        );

        gainNode.connect(
          audioContext.destination
        );

        oscillator.start(
          audioContext.currentTime
        );

        oscillator.stop(
          audioContext.currentTime + 0.5
        );

      } catch (error) {

        console.error(
          "[QuickSeva] Sound playback failed:",
          error
        );
      }
    };

  /*
  ==========================================================
  LOAD BOOKINGS
  ==========================================================
  */

  useEffect(() => {

    const q =
      query(
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

          const newBookings =
            snapshot.docs.map(
              (d) => ({
                id: d.id,
                ...d.data(),
              })
            );

          /*
          ----------------------------------------------------
          INITIAL LOAD
          ----------------------------------------------------
          */

          if (
            !initialBookingsLoadedRef.current
          ) {

            newBookings.forEach(
              (booking) => {

                previousBookingIdsRef.current.add(
                  booking.id
                );
              }
            );

            initialBookingsLoadedRef.current =
              true;

            setBookings(
              newBookings
            );

            return;
          }

          /*
          ----------------------------------------------------
          FIND NEW BOOKINGS
          ----------------------------------------------------
          */

          const newlyCreatedBookings =
            newBookings.filter(
              (booking) =>
                !previousBookingIdsRef.current.has(
                  booking.id
                )
            );

          /*
          ----------------------------------------------------
          NEW BOOKING FOUND
          ----------------------------------------------------
          */

          if (
            newlyCreatedBookings.length >
            0
          ) {

            const latestBooking =
              newlyCreatedBookings[0];

            console.log(
              "[QuickSeva] NEW BOOKING DETECTED:",
              latestBooking
            );

            /*
            --------------------------------------------------
            PLAY SOUND
            --------------------------------------------------
            */

            if (
              soundEnabledRef.current
            ) {

              playNotificationSound();

            } else {

              console.warn(
                "[QuickSeva] Sound is not enabled. Click Enable Sound."
              );
            }

            /*
            --------------------------------------------------
            SHOW DASHBOARD ALERT
            --------------------------------------------------
            */

            setNewBookingAlert(
              latestBooking
            );

            setTimeout(
              () => {

                setNewBookingAlert(
                  null
                );

              },
              7000
            );
          }

          /*
          ----------------------------------------------------
          UPDATE BOOKING IDS
          ----------------------------------------------------
          */

          newBookings.forEach(
            (booking) => {

              previousBookingIdsRef.current.add(
                booking.id
              );
            }
          );

          /*
          ----------------------------------------------------
          UPDATE BOOKINGS
          ----------------------------------------------------
          */

          setBookings(
            newBookings
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
    ========================================================
    LOAD TECHNICIANS
    ========================================================
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
  HELPER - GET BOOKING TOTAL
  ==========================================================
  */

  const getBookingAmount =
    (booking) => {

      const possibleAmounts = [
        booking?.totalAmount,
        booking?.amount,
        booking?.total,
        booking?.price,
      ];

      for (
        const value of possibleAmounts
      ) {

        const number =
          Number(value);

        if (
          Number.isFinite(number)
        ) {

          return number;
        }
      }

      /*
      ------------------------------------------------------
      FALLBACK: CALCULATE FROM ITEMS
      ------------------------------------------------------
      */

      if (
        Array.isArray(
          booking?.items
        )
      ) {

        return booking.items.reduce(
          (
            total,
            item
          ) => {

            const price =
              Number(
                item?.price
              ) || 0;

            const qty =
              Number(
                item?.qty
              ) > 0
                ? Number(item.qty)
                : 1;

            const subtotal =
              Number(
                item?.subtotal
              );

            return (
              total +
              (
                Number.isFinite(
                  subtotal
                )
                  ? subtotal
                  : price * qty
              )
            );

          },
          0
        );
      }

      return 0;
    };

  /*
  ==========================================================
  DASHBOARD STATISTICS
  ==========================================================
  */

  const totalOrders =
    bookings.length;

  const pendingOrders =
    bookings.filter(
      (booking) => {

        const status =
          String(
            booking?.status ||
            "Pending"
          )
            .trim()
            .toLowerCase();

        return (
          status ===
            "pending" ||
          status ===
            "new"
        );
      }
    ).length;

  const totalValue =
    bookings.reduce(
      (
        total,
        booking
      ) => {

        return (
          total +
          getBookingAmount(
            booking
          )
        );

      },
      0
    );

  /*
  ==========================================================
  SERVICE NAME HELPER
  ==========================================================
  */

  const getServiceName =
    (booking) => {

      if (
        Array.isArray(
          booking?.items
        ) &&
        booking.items.length > 0
      ) {

        const names =
          booking.items
            .map(
              (item) =>
                item?.label ||
                item?.name ||
                item?.serviceName ||
                item?.subService
            )
            .filter(Boolean);

        if (
          names.length > 0
        ) {

          return names.join(
            ", "
          );
        }
      }

      return (
        booking?.serviceName ||
        booking?.subService ||
        booking?.subServiceName ||
        booking?.selectedService ||
        booking?.service ||
        booking?.category ||
        "Service"
      );
    };

  /*
  ==========================================================
  UI
  ==========================================================
  */

  return (

    <div className="p-4 bg-gray-50 min-h-screen pb-20">

      <div className="max-w-5xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              QuickSeva bookings
            </p>

          </div>

          {/* SOUND BUTTON */}

          <button
            onClick={
              enableNotificationSound
            }
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              soundEnabled
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >

            {soundEnabled
              ? "🔊 Sound ON"
              : "🔇 Enable Sound"}

          </button>

        </div>

        {/* =================================================
            DASHBOARD SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* TOTAL ORDERS */}

          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Total Orders
                </p>

                <p className="text-3xl font-bold text-blue-700 mt-1">
                  {totalOrders}
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                📦
              </div>

            </div>

            <p className="text-xs text-gray-400 mt-3">
              All QuickSeva bookings
            </p>

          </div>

          {/* PENDING ORDERS */}

          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Pending Orders
                </p>

                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {pendingOrders}
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl">
                ⏳
              </div>

            </div>

            <p className="text-xs text-gray-400 mt-3">
              Awaiting technician assignment
            </p>

          </div>

          {/* TOTAL VALUE */}

          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Total Value
                </p>

                <p className="text-3xl font-bold text-green-700 mt-1">
                  ₹
                  {totalValue.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
                💰
              </div>

            </div>

            <p className="text-xs text-gray-400 mt-3">
              Value of all bookings
            </p>

          </div>

        </div>

        {/* =================================================
            NOTIFICATION STATUS
        ================================================= */}

        <div className="mb-5 bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold">

          🔔 FCM Notifications Active

          <div className="text-xs font-normal mt-1">

            {soundEnabled
              ? "🔊 QuickSeva booking sound is enabled."
              : "🔇 Click Enable Sound to activate booking alerts."}

          </div>

        </div>

        {/* =================================================
            NEW BOOKING ALERT
        ================================================= */}

        {newBookingAlert && (

          <div className="mb-5 bg-blue-600 text-white rounded-2xl p-4 shadow-lg">

            <div className="flex items-start justify-between">

              <div className="min-w-0">

                <div className="font-bold text-lg">
                  🔔 New QuickSeva Booking!
                </div>

                <div className="text-sm mt-1 font-semibold break-all">
                  🆔 Booking ID:{" "}
                  {newBookingAlert.id ||
                    "Not available"}
                </div>

                <div className="text-sm mt-1">
                  🛠️{" "}
                  {getServiceName(
                    newBookingAlert
                  )}
                </div>

                <div className="text-sm mt-1 font-semibold">
                  💰 ₹
                  {getBookingAmount(
                    newBookingAlert
                  )}
                </div>

                <div className="text-sm mt-1">

                  📅{" "}
                  {newBookingAlert.date ||
                    newBookingAlert.bookingDate ||
                    "Date not provided"}

                  {" • "}

                  ⏰{" "}
                  {newBookingAlert.time ||
                    newBookingAlert.bookingTime ||
                    "Time not provided"}

                </div>

                <div className="text-sm mt-1">

                  👤{" "}
                  {newBookingAlert.name ||
                    newBookingAlert.customerName ||
                    newBookingAlert.userName ||
                    "Customer"}

                  {" • "}

                  📞{" "}
                  {newBookingAlert.phone ||
                    newBookingAlert.mobile ||
                    newBookingAlert.customerPhone ||
                    "Phone not provided"}

                </div>

                <div className="text-sm mt-1">

                  📍{" "}
                  {newBookingAlert.address ||
                    newBookingAlert.fullAddress ||
                    newBookingAlert.location ||
                    "Address not provided"}

                </div>

              </div>

              <button
                onClick={() =>
                  setNewBookingAlert(
                    null
                  )
                }
                className="text-white text-xl ml-3"
              >
                ✕
              </button>

            </div>

          </div>

        )}

        {/* =================================================
            NO BOOKINGS
        ================================================= */}

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

                const bookingAmount =
                  getBookingAmount(
                    b
                  );

                const serviceName =
                  getServiceName(
                    b
                  );

                const isPending =
                  !b.status ||
                  String(
                    b.status
                  ).toLowerCase() ===
                    "pending";

                return (

                  <div
                    key={b.id}
                    className={`border bg-white p-4 rounded-2xl shadow ${
                      isPending
                        ? "border-orange-300"
                        : "border-gray-200"
                    }`}
                  >

                    {/* =================================================
                        NEW ORDER
                    ================================================= */}

                    {isPending && (

                      <div className="mb-3">

                        <span className="inline-flex bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                          🔴 NEW ORDER
                        </span>

                      </div>

                    )}

                    {/* =================================================
                        BOOKING HEADER
                    ================================================= */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        {/* BOOKING ID */}

                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold mb-2">

                          🆔

                          <span>
                            Booking ID:
                          </span>

                          <span className="break-all">
                            {b.id}
                          </span>

                        </div>

                        {/* SERVICE */}

                        <h2 className="text-lg font-bold text-gray-900 break-words">

                          🛠️{" "}

                          {serviceName}

                        </h2>

                        {/* SUB SERVICE */}

                        {(b.subService ||
                          b.subServiceName ||
                          b.selectedService) && (

                          <div className="text-sm text-gray-600 mt-1">

                            🔧{" "}

                            {b.subService ||
                              b.subServiceName ||
                              b.selectedService}

                          </div>

                        )}

                      </div>

                      {/* STATUS */}

                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                          isPending
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {b.status ||
                          "Pending"}

                      </span>

                    </div>

                    {/* =================================================
                        SERVICE + AMOUNT SUMMARY
                    ================================================= */}

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">

                      {/* SERVICE NAME */}

                      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">

                        <div className="text-xs font-semibold text-blue-600">
                          🛠️ Service Name
                        </div>

                        <div className="mt-1 text-sm font-bold text-gray-900 break-words">
                          {serviceName}
                        </div>

                      </div>

                      {/* AMOUNT */}

                      <div className="rounded-xl bg-green-50 border border-green-100 p-3">

                        <div className="text-xs font-semibold text-green-600">
                          💰 Total Amount
                        </div>

                        <div className="mt-1 text-lg font-bold text-green-700">

                          ₹
                          {bookingAmount.toLocaleString(
                            "en-IN"
                          )}

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        BOOKED SERVICES
                    ================================================= */}

                    {Array.isArray(
                      b.items
                    ) &&
                      b.items.length >
                        0 && (

                        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">

                          <div className="text-sm font-bold text-gray-900 mb-3">
                            🛠️ Booked Service
                            {b.items.length >
                            1
                              ? "s"
                              : ""}
                          </div>

                          <div className="space-y-2">

                            {b.items.map(
                              (
                                item,
                                index
                              ) => {

                                const itemName =
                                  item?.label ||
                                  item?.name ||
                                  item?.serviceName ||
                                  item?.subService ||
                                  "Service";

                                const qty =
                                  Number(
                                    item?.qty
                                  ) > 0
                                    ? Number(
                                        item.qty
                                      )
                                    : 1;

                                const price =
                                  Number(
                                    item?.price
                                  ) || 0;

                                const subtotal =
                                  Number(
                                    item?.subtotal
                                  ) ||
                                  price *
                                    qty;

                                return (

                                  <div
                                    key={
                                      item?.id ||
                                      item?.key ||
                                      index
                                    }
                                    className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                                  >

                                    <div className="min-w-0">

                                      <div className="font-semibold text-gray-900 break-words">
                                        {itemName}
                                      </div>

                                      <div className="text-xs text-gray-500">
                                        Qty:{" "}
                                        {qty}
                                        {" × "}
                                        ₹
                                        {price}
                                      </div>

                                    </div>

                                    <div className="shrink-0 font-bold text-gray-900">
                                      ₹
                                      {subtotal.toLocaleString(
                                        "en-IN"
                                      )}
                                    </div>

                                  </div>

                                );
                              }
                            )}

                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">

                            <span className="font-bold text-gray-900">
                              Total Amount
                            </span>

                            <span className="font-bold text-green-700">
                              ₹
                              {bookingAmount.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </div>

                        </div>

                      )}

                    {/* =================================================
                        CUSTOMER / BOOKING DETAILS
                    ================================================= */}

                    <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-3 text-sm">

                      {/* CUSTOMER */}

                      <div className="flex gap-3">

                        <span>
                          👤
                        </span>

                        <div className="min-w-0">

                          <b>
                            Customer:
                          </b>

                          <div className="text-gray-700 break-words">

                            {b.name ||
                              b.customerName ||
                              b.userName ||
                              b.customer?.name ||
                              "Customer"}

                          </div>

                        </div>

                      </div>

                      {/* PHONE */}

                      <div className="flex gap-3">

                        <span>
                          📞
                        </span>

                        <div className="min-w-0">

                          <b>
                            Phone:
                          </b>

                          <div className="text-gray-700 break-words">

                            {b.phone ||
                              b.mobile ||
                              b.customerPhone ||
                              b.customer?.phone ||
                              "Not provided"}

                          </div>

                        </div>

                      </div>

                      {/* DATE */}

                      <div className="flex gap-3">

                        <span>
                          📅
                        </span>

                        <div className="min-w-0">

                          <b>
                            Date:
                          </b>

                          <div className="text-gray-700 break-words">

                            {b.date ||
                              b.bookingDate ||
                              b.serviceDate ||
                              "Not provided"}

                          </div>

                        </div>

                      </div>

                      {/* TIME */}

                      <div className="flex gap-3">

                        <span>
                          ⏰
                        </span>

                        <div className="min-w-0">

                          <b>
                            Time:
                          </b>

                          <div className="text-gray-700 break-words">

                            {b.time ||
                              b.bookingTime ||
                              b.serviceTime ||
                              "Not provided"}

                          </div>

                        </div>

                      </div>

                      {/* ADDRESS */}

                      <div className="flex gap-3">

                        <span>
                          📍
                        </span>

                        <div className="min-w-0">

                          <b>
                            Address:
                          </b>

                          <div className="text-gray-700 break-words">

                            {b.address ||
                              b.fullAddress ||
                              b.location ||
                              b.customerAddress ||
                              b.customer?.address ||
                              "Not provided"}

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        ASSIGN TECHNICIAN
                    ================================================= */}

                    {b.status ===
                      "Pending" &&
                      technicians.length >
                        0 && (

                        <select
                          className="w-full mt-4 border p-3 rounded-xl bg-white"
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
                                key={
                                  t.id
                                }
                                value={
                                  t.id
                                }
                              >

                                {t.name}
                                {" "}
                                ⭐
                                {" "}
                                {t.rating ??
                                  0}

                              </option>

                            )
                          )}

                        </select>

                      )}

                    {/* =================================================
                        TECHNICIAN
                    ================================================= */}

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

                    {/* =================================================
                        EDIT TECH DETAILS
                    ================================================= */}

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