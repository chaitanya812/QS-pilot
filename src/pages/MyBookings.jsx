import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const getToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) return "Date not selected";

  try {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return date;
  }
};

const formatMoney = (amount) => {
  const value = Number(amount) || 0;

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const STATUS_STEPS = [
  {
    key: "Pending",
    label: "Service Booking",
    description: "Your booking has been received.",
    icon: "📋",
  },
  {
    key: "Assigned",
    label: "Technician Assigned",
    description: "Your technician has been assigned.",
    icon: "👨‍🔧",
  },
  {
    key: "Completed",
    label: "Service Completed",
    description: "You confirmed that the service is complete.",
    icon: "🎉",
  },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("Upcoming");

  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [complaintBooking, setComplaintBooking] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [complaintCategory, setComplaintCategory] =
    useState("quality");
  const [complaintLoading, setComplaintLoading] = useState(false);

  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [editBooking, setEditBooking] = useState(null);
  const [editService, setEditService] = useState("");
  const [editSubService, setEditSubService] = useState("");
  const [newDate, setNewDate] = useState("");

  const [newTime, setNewTime] = useState({
    hour: "",
    minute: "",
    period: "AM",
  });

  const [editLoading, setEditLoading] = useState(false);

  const supportPhone = "7661045308";

  /* =====================================================
     LOAD BOOKINGS
  ===================================================== */

  useEffect(() => {
    if (!user?.phone) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");

    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("phone", "==", user.phone)
      );

      const unsubscribe = onSnapshot(
        bookingsQuery,
        (snapshot) => {
          const list = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

          const uniqueBookings = Array.from(
            new Map(
              list.map((item) => [item.id, item])
            ).values()
          );

          uniqueBookings.sort((a, b) => {
            const aTime = new Date(
              a.createdAt || 0
            ).getTime();

            const bTime = new Date(
              b.createdAt || 0
            ).getTime();

            return bTime - aTime;
          });

          setBookings(uniqueBookings);
          setLoading(false);
        },
        (error) => {
          console.error(
            "Failed to load bookings:",
            error
          );

          setLoadError(
            "We couldn't load your bookings. Please try again."
          );

          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error(error);

      setLoadError(
        "Unable to connect to your bookings."
      );

      setLoading(false);
    }
  }, [user?.phone]);

  /* =====================================================
     AUTO REVIEW
  ===================================================== */

  useEffect(() => {
    if (reviewBooking) return;

    const completedUnrated = bookings.find(
      (booking) =>
        booking.status === "Completed" &&
        booking.proRating == null
    );

    if (!completedUnrated) return;

    const timer = setTimeout(() => {
      setReviewBooking(completedUnrated);
      setFilter("Completed");
    }, 5000);

    return () => clearTimeout(timer);
  }, [bookings, reviewBooking]);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredBookings = useMemo(() => {
    if (filter === "Upcoming") {
      return bookings.filter(
        (booking) =>
          booking.status !== "Completed" &&
          booking.status !== "Cancelled"
      );
    }

    if (filter === "Completed") {
      return bookings.filter(
        (booking) =>
          booking.status === "Completed"
      );
    }

    if (filter === "Cancelled") {
      return bookings.filter(
        (booking) =>
          booking.status === "Cancelled"
      );
    }

    return bookings;
  }, [filter, bookings]);

  /* =====================================================
     COUNTS
  ===================================================== */

  const counts = useMemo(() => {
    return {
      Upcoming: bookings.filter(
        (b) =>
          b.status !== "Completed" &&
          b.status !== "Cancelled"
      ).length,

      Completed: bookings.filter(
        (b) => b.status === "Completed"
      ).length,

      Cancelled: bookings.filter(
        (b) => b.status === "Cancelled"
      ).length,
    };
  }, [bookings]);

  /* =====================================================
     REVIEW
  ===================================================== */

  const openReview = (booking) => {
    setReviewBooking(booking);
    setRating(booking.proRating || 0);
    setReview(booking.proReview || "");
  };

  const closeReview = () => {
    if (reviewLoading) return;

    setReviewBooking(null);
    setRating(0);
    setReview("");
  };

  const submitReview = async () => {
    if (!reviewBooking) return;

    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    setReviewLoading(true);

    try {
      await updateDoc(
        doc(db, "bookings", reviewBooking.id),
        {
          proRating: rating,
          proReview: review.trim(),
          reviewUpdatedAt:
            new Date().toISOString(),
        }
      );

      closeReview();

      alert(
        "Thank you! Your feedback has been submitted."
      );
    } catch (error) {
      console.error(
        "Review submission error:",
        error
      );

      alert(
        "Could not submit your review. Please try again."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  /* =====================================================
     COMPLAINT
  ===================================================== */

  const closeComplaint = () => {
    if (complaintLoading) return;

    setComplaintBooking(null);
    setComplaintText("");
    setComplaintCategory("quality");
  };

  const submitComplaint = async () => {
    if (!complaintBooking) return;

    if (!complaintText.trim()) {
      alert("Please describe your complaint.");
      return;
    }

    setComplaintLoading(true);

    try {
      await addDoc(
        collection(db, "complaints"),
        {
          bookingId: complaintBooking.id,

          userId: user?.uid || null,

          userName:
            user?.name ||
            user?.displayName ||
            "Customer",

          phone: user?.phone || null,

          category: complaintCategory,

          description:
            complaintText.trim(),

          bookingDetails: {
            items:
              complaintBooking.items || [],

            totalAmount:
              complaintBooking.totalAmount || 0,

            date:
              complaintBooking.date || null,

            time:
              complaintBooking.time || null,

            address:
              complaintBooking.address || null,
          },

          status: "Open",

          createdAt:
            new Date().toISOString(),
        }
      );

      await updateDoc(
        doc(
          db,
          "bookings",
          complaintBooking.id
        ),
        {
          hasComplaint: true,

          complaintDate:
            new Date().toISOString(),

          complaintStatus: "Open",
        }
      );

      closeComplaint();

      alert(
        "Your complaint has been registered. Our support team will contact you."
      );
    } catch (error) {
      console.error(
        "Complaint error:",
        error
      );

      alert(
        "Could not submit your complaint. Please try again."
      );
    } finally {
      setComplaintLoading(false);
    }
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const cancelUserBooking = async () => {
    if (!cancelBooking) return;

    setCancelLoading(true);

    try {
      await updateDoc(
        doc(
          db,
          "bookings",
          cancelBooking.id
        ),
        {
          status: "Cancelled",

          cancelledAt:
            new Date().toISOString(),

          updatedAt:
            new Date().toISOString(),
        }
      );

      setCancelBooking(null);

      alert(
        "Your booking has been cancelled successfully."
      );
    } catch (error) {
      console.error(
        "Cancel booking error:",
        error
      );

      alert(
        "Failed to cancel the booking. Please try again."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEditBooking = (booking) => {
    setEditBooking(booking);

    setEditService(
      booking.service || ""
    );

    setEditSubService(
      booking.subService || ""
    );

    setNewDate(
      booking.date || ""
    );

    if (booking.time) {
      const parts =
        String(booking.time)
          .trim()
          .split(" ");

      const period =
        parts[parts.length - 1] === "PM"
          ? "PM"
          : "AM";

      const timePart =
        parts.length > 1
          ? parts
              .slice(0, -1)
              .join(" ")
          : parts[0];

      const [hour, minute] =
        timePart.split(":");

      setNewTime({
        hour: hour || "",
        minute: minute || "",
        period,
      });
    } else {
      setNewTime({
        hour: "",
        minute: "",
        period: "AM",
      });
    }
  };

  const closeEdit = () => {
    if (editLoading) return;

    setEditBooking(null);
    setEditService("");
    setEditSubService("");
    setNewDate("");

    setNewTime({
      hour: "",
      minute: "",
      period: "AM",
    });
  };

  const saveEditChanges = async () => {
    if (!editBooking) return;

    if (!newDate) {
      alert("Please select a date.");
      return;
    }

    if (
      !newTime.hour ||
      !newTime.minute
    ) {
      alert("Please select a valid time.");
      return;
    }

    const formattedTime =
      `${newTime.hour.padStart(
        2,
        "0"
      )}:${newTime.minute.padStart(
        2,
        "0"
      )} ${newTime.period}`;

    setEditLoading(true);

    try {
      const updatePayload = {
        date: newDate,

        time: formattedTime,

        service:
          editService.trim(),

        subService:
          editSubService.trim(),

        lastModifiedAt:
          new Date().toISOString(),

        modificationRequested: true,

        updatedAt:
          new Date().toISOString(),
      };

      await updateDoc(
        doc(
          db,
          "bookings",
          editBooking.id
        ),
        updatePayload
      );

      closeEdit();

      alert(
        "Your changes have been saved. Our team will review and confirm them."
      );
    } catch (error) {
      console.error(
        "Edit booking error:",
        error
      );

      alert(
        "Failed to update the booking. Please try again."
      );
    } finally {
      setEditLoading(false);
    }
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatusIndex = (booking) => {
  const status = String(booking?.status || "Pending")
    .trim()
    .toLowerCase();

  if (status === "completed") return 2;

  if (
    booking?.technicianId ||
    booking?.technicianName ||
    [
      "assigned",
      "accepted",
      "on the way",
      "work started",
    ].includes(status)
  ) {
    return 1;
  }

  return 0;
};

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-[#CCFBF1] text-[#0D9488]";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Work Started":
        return "bg-[#EFF6FF] text-[#0EA5E9]";

      case "On The Way":
        return "bg-[#CCFBF1] text-[#0D9488]";

      case "Accepted":
        return "bg-[#CCFBF1] text-[#0D9488]";

      case "Assigned":
        return "bg-[#DBEAFE] text-[#0EA5E9]";

      default:
        return "bg-[#E2E8F0] text-[#334155]";
    }
  };

  /* =====================================================
     STATUS TIMELINE
  ===================================================== */

  const StatusTimeline = ({ booking }) => {
  const status = String(booking?.status || "Pending");
  const currentIndex = getStatusIndex(booking);

  if (status.toLowerCase() === "cancelled") {
    return (
      <div className="mt-5 rounded-2xl bg-red-50 border border-red-100 p-4">
        <p className="font-bold text-red-800">
          ❌ Booking Cancelled
        </p>
        <p className="text-sm text-red-700 mt-1">
          This booking is no longer active.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-white p-4">
      <h3 className="text-base font-extrabold text-[#0B1D36] mb-1">
        Track Your Service
      </h3>

      <p className="text-xs text-[#64748B] mb-5">
        Follow your booking from start to completion.
      </p>

      {STATUS_STEPS.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isComplete
                    ? "bg-[#0D9488] text-white"
                    : "bg-[#F1F5F9] text-[#94A3B8]"
                } ${isCurrent ? "ring-4 ring-[#CCFBF1]" : ""}`}
              >
                {isComplete ? "✓" : index + 1}
              </div>

              {index < STATUS_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    index < currentIndex
                      ? "bg-[#0D9488]"
                      : "bg-[#E2E8F0]"
                  }`}
                />
              )}
            </div>

            <div className="flex-1 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <h4
                  className={`text-sm font-bold ${
                    isComplete
                      ? "text-[#0B1D36]"
                      : "text-[#94A3B8]"
                  }`}
                >
                  {step.icon} {step.label}
                </h4>

                {isComplete && (
                  <span className="text-[10px] font-bold text-[#0D9488]">
                    {index === 2 ? "CONFIRMED" : "DONE"}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#64748B] mt-1">
                {index === 1 && booking.technicianName
                  ? `${booking.technicianName} has been assigned to your booking.`
                  : index === 1
                  ? "Waiting for OnCall to assign your technician."
                  : step.description}
              </p>

              {index === 1 && booking.technicianName && (
                <div className="mt-3 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] p-3">
                  <p className="font-bold text-sm text-[#0B1D36]">
                    👨‍🔧 {booking.technicianName}
                  </p>

                  {booking.technicianPhone && (
                    <a
                      href={`tel:${booking.technicianPhone}`}
                      className="inline-block mt-2 text-sm font-bold text-[#0D9488]"
                    >
                      Call Technician
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {currentIndex === 2 && (
        <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3 text-sm font-semibold text-[#166534]">
          ✓ Thank you for confirming service completion!
        </div>
      )}
    </div>
  );
};

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        <div className="max-w-2xl mx-auto px-4 py-5">

          <div className="h-10 bg-white rounded-2xl animate-pulse mb-5" />

          <div className="h-12 bg-white rounded-2xl animate-pulse mb-5" />

          {[1, 2].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl p-5 mb-4 border border-[#E2E8F0]"
            >
              <div className="h-5 bg-[#E2E8F0] rounded w-1/2 animate-pulse" />

              <div className="h-4 bg-[#E2E8F0] rounded w-3/4 mt-4 animate-pulse" />

              <div className="h-20 bg-[#E2E8F0] rounded-2xl mt-4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] p-7 text-center shadow-sm">

          <div className="w-20 h-20 mx-auto rounded-full bg-[#E6FFFB] flex items-center justify-center text-4xl">
            🔐
          </div>

          <h1 className="text-2xl font-bold text-[#0B1D36] mt-5">
            Login Required
          </h1>

          <p className="text-[#64748B] mt-2">
            Please login to view your bookings.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] text-white font-bold shadow-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-28">

      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-[#E2E8F0] hover:bg-[#CBD5E1] flex items-center justify-center text-xl text-[#0B1D36]"
          >
            ←
          </button>

          <div className="flex-1">
            <h1 className="font-bold text-[#0B1D36]">
              My Bookings
            </h1>

            <p className="text-xs text-[#64748B]">
              Track and manage your services
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#E6FFFB] flex items-center justify-center">
            📋
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-5">

        {/* ERROR */}

        {loadError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="font-bold text-red-800">
              ⚠️ Unable to load bookings
            </p>

            <p className="text-sm text-red-700 mt-1">
              {loadError}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-3 text-sm font-bold text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* SUMMARY */}

        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-5 mb-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-[#64748B]">
                Hello
              </p>

              <h2 className="text-xl font-extrabold text-[#0B1D36] mt-1">
                {user?.name ||
                  user?.displayName ||
                  "Customer"}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#E6FFFB] flex items-center justify-center text-2xl">
              👋
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5">

            <div className="rounded-2xl bg-[#E6FFFB] p-3 text-center">
              <p className="text-lg font-extrabold text-[#0D9488]">
                {counts.Upcoming}
              </p>

              <p className="text-[11px] text-[#0D9488] font-semibold">
                Upcoming
              </p>
            </div>

            <div className="rounded-2xl bg-[#EFF6FF] p-3 text-center">
              <p className="text-lg font-extrabold text-[#0EA5E9]">
                {counts.Completed}
              </p>

              <p className="text-[11px] text-[#0EA5E9] font-semibold">
                Completed
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-3 text-center">
              <p className="text-lg font-extrabold text-red-700">
                {counts.Cancelled}
              </p>

              <p className="text-[11px] text-red-600 font-semibold">
                Cancelled
              </p>
            </div>

          </div>
        </div>

        {/* FILTERS */}

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 mb-5 flex gap-1">

          {[
            "Upcoming",
            "Completed",
            "Cancelled",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                filter === item
                  ? "bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] text-white shadow-sm"
                  : "text-[#64748B] hover:bg-[#F1F5F9]"
              }`}
            >
              {item}

              <span
                className={`ml-1 ${
                  filter === item
                    ? "text-white/70"
                    : "text-[#94A3B8]"
                }`}
              >
                ({counts[item]})
              </span>
            </button>
          ))}

        </div>

        {/* EMPTY */}

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-[#F1F5F9] flex items-center justify-center text-4xl">
              {filter === "Upcoming"
                ? "🛠️"
                : filter === "Completed"
                ? "🎉"
                : "📭"}
            </div>

            <h2 className="font-bold text-[#0B1D36] text-xl mt-5">
              No {filter.toLowerCase()} bookings
            </h2>

            <p className="text-sm text-[#64748B] mt-2">
              {filter === "Upcoming"
                ? "Book a service whenever you need help."
                : filter === "Completed"
                ? "Your completed services will appear here."
                : "Cancelled bookings will appear here."}
            </p>

            {filter === "Upcoming" && (
              <button
                onClick={() => navigate("/")}
                className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] text-white font-bold shadow-lg"
              >
                Book a Service
              </button>
            )}

          </div>
        )}

        {/* BOOKINGS */}

        <div className="space-y-4">

          {filteredBookings.map(
            (booking) => {
              const items =
                Array.isArray(
                  booking.items
                )
                  ? booking.items
                  : [];

              const total =
                Number(
                  booking.totalAmount
                ) || 0;

              return (
                <article
                  key={booking.id}
                  className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden"
                >

                  <div className="p-5">

                    <div className="flex items-start gap-3">

                      <div className="w-12 h-12 rounded-2xl bg-[#E6FFFB] flex items-center justify-center text-2xl shrink-0">
                        🛠️
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-2">

                          <div>
                            <p className="text-xs text-[#94A3B8]">
                              Booking ID
                            </p>

                            <p className="font-bold text-[#0B1D36] text-sm mt-0.5">
                              QS-
                              {String(
                                booking.id
                              )
                                .slice(-8)
                                .toUpperCase()}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status ||
                              "Pending"}
                          </span>

                        </div>
                      </div>
                    </div>

                    {/* SERVICES */}

                    <div className="mt-5">

                      <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
                        Services
                      </p>

                      {items.length > 0 ? (
                        <div className="mt-2 space-y-2">

                          {items.map(
                            (item, index) => {
                              const price =
                                Number(
                                  item?.price
                                ) || 0;

                              const qty =
                                Number(
                                  item?.qty
                                ) > 0
                                  ? Number(
                                      item.qty
                                    )
                                  : 1;

                              return (
                                <div
                                  key={`${item?.label || "service"}-${index}`}
                                  className="flex items-center justify-between gap-3 rounded-2xl bg-[#F1F5F9] p-3"
                                >

                                  <div className="min-w-0">

                                    <p className="font-semibold text-[#0B1D36] text-sm">
                                      {item?.label ||
                                        "Service"}
                                    </p>

                                    <p className="text-xs text-[#64748B] mt-1">
                                      ₹
                                      {formatMoney(
                                        price
                                      )}{" "}
                                      ×{" "}
                                      {qty}
                                    </p>

                                  </div>

                                  <p className="font-bold text-[#0B1D36] text-sm">
                                    ₹
                                    {formatMoney(
                                      price *
                                        qty
                                    )}
                                  </p>

                                </div>
                              );
                            }
                          )}

                        </div>
                      ) : booking.service ? (

                        <div className="mt-2 rounded-2xl bg-[#F1F5F9] p-3">

                          <p className="font-semibold text-[#0B1D36]">
                            {booking.service}
                          </p>

                          {booking.subService && (
                            <p className="text-sm text-[#64748B] mt-1">
                              {booking.subService}
                            </p>
                          )}

                        </div>

                      ) : (

                        <p className="text-sm text-[#64748B] mt-2">
                          Service details unavailable
                        </p>

                      )}

                    </div>

                    {/* TOTAL */}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E2E8F0]">

                      <span className="font-semibold text-[#475569]">
                        Total
                      </span>

                      <span className="text-lg font-extrabold text-[#0B1D36]">
                        ₹
                        {formatMoney(
                          total
                        )}
                      </span>

                    </div>

                    {/* DATE / TIME */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">

                      <div className="rounded-2xl bg-[#EFF6FF] p-3">

                        <p className="text-[11px] text-[#0EA5E9] font-semibold">
                          SERVICE DATE
                        </p>

                        <p className="text-sm font-bold text-[#0B1D36] mt-1">
                          {formatDate(
                            booking.date
                          )}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#E6FFFB] p-3">

                        <p className="text-[11px] text-[#0D9488] font-semibold">
                          PREFERRED TIME
                        </p>

                        <p className="text-sm font-bold text-[#0B1D36] mt-1">
                          {booking.time ||
                            "Not selected"}
                        </p>

                      </div>

                    </div>

                    {/* ADDRESS */}

                    {booking.address && (
                      <div className="mt-3 rounded-2xl bg-[#F1F5F9] p-3">

                        <div className="flex gap-2">

                          <span>📍</span>

                          <div>

                            <p className="text-[11px] text-[#94A3B8] font-semibold">
                              SERVICE LOCATION
                            </p>

                            <p className="text-sm text-[#334155] mt-1 leading-relaxed">
                              {booking.address}
                            </p>

                          </div>

                        </div>

                      </div>
                    )}

                    {/* TECHNICIAN */}

                    {booking.technicianName && (
                      <div className="mt-4 rounded-3xl border border-[#99F6E4] bg-[#E6FFFB] p-4">

                        <div className="flex items-center justify-between gap-3">

                          <div>

                            <p className="text-xs font-bold text-[#0D9488] uppercase tracking-wide">
                              Your Professional
                            </p>

                            <p className="text-xs text-[#64748B] mt-1">
                              Assigned by OnCall
                            </p>

                          </div>

                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#0D9488] border border-[#99F6E4]">
                            ✓ Assigned
                          </span>

                        </div>

                        <div className="flex items-center gap-3 mt-4">

                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl overflow-hidden border border-white shadow-sm shrink-0">

                            {booking.technicianPhoto ? (
                              <img
                                src={
                                  booking.technicianPhoto
                                }
                                alt={
                                  booking.technicianName
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              "👨‍🔧"
                            )}

                          </div>

                          <div className="flex-1 min-w-0">

                            <p className="font-bold text-[#0B1D36] truncate">
                              {booking.technicianName}
                            </p>

                            <p className="text-sm text-[#475569] mt-0.5">
                              ⭐{" "}
                              {booking.technicianRating ||
                                "4.7"}{" "}
                              rating
                            </p>

                            {booking.technicianPhone && (
                              <p className="text-xs text-[#64748B] mt-1">
                                📞{" "}
                                {
                                  booking.technicianPhone
                                }
                              </p>
                            )}

                          </div>

                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">

                          <a
                            href={`tel:+91${supportPhone}`}
                            className="py-2.5 rounded-2xl bg-[#0B1D36] text-white text-center font-bold text-xs"
                          >
                            ☎️ Customer Care
                          </a>

                          <a
                            href={`https://wa.me/91${supportPhone}?text=${encodeURIComponent(
                              `Hello OnCall, please connect me with my assigned professional for booking QS-${String(
                                booking.id
                              )
                                .slice(-8)
                                .toUpperCase()}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 rounded-2xl bg-[#E6FFFB] text-[#0D9488] border border-[#99F6E4] text-center font-bold text-xs"
                          >
                            💬 Ask Support to Connect
                          </a>

                        </div>

                        <p className="text-[11px] text-[#64748B] mt-3 leading-relaxed">
                          You can contact the professional with OnCall customer care to connect you.
                        </p>

                      </div>
                    )}

                    {/* STATUS */}

                    <StatusTimeline booking={booking} />

                    {/* ACTIONS */}

                    {booking.status !==
                      "Completed" &&
                      booking.status !==
                        "Cancelled" && (
                        <div className="grid grid-cols-2 gap-3 mt-5">

                          <button
                            onClick={() =>
                              handleEditBooking(
                                booking
                              )
                            }
                            className="py-3 rounded-2xl bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#0B1D36] font-bold text-sm"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() =>
                              setCancelBooking(
                                booking
                              )
                            }
                            className="py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm"
                          >
                            Cancel
                          </button>

                        </div>
                      )}

                    {/* COMPLETED REVIEW */}

                    {booking.status ===
                      "Completed" && (
                      <div className="mt-4">

                        {booking.proRating ? (

                          <div className="rounded-2xl bg-[#E6FFFB] border border-[#99F6E4] p-4">

                            <p className="text-sm font-bold text-[#0B1D36]">
                              Your Rating
                            </p>

                            <p className="text-2xl mt-1 text-[#0D9488]">

                              {"★".repeat(
                                Number(
                                  booking.proRating
                                )
                              )}

                              <span className="text-[#CBD5E1]">
                                {"★".repeat(
                                  5 -
                                    Number(
                                      booking.proRating
                                    )
                                )}
                              </span>

                            </p>

                            {booking.proReview && (
                              <p className="text-sm text-[#475569] mt-2">
                                “
                                {
                                  booking.proReview
                                }
                                ”
                              </p>
                            )}

                          </div>

                        ) : (

                          <button
                            onClick={() =>
                              openReview(
                                booking
                              )
                            }
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] text-white font-bold"
                          >
                            ⭐ Rate Your Service
                          </button>

                        )}

                        {!booking.hasComplaint && (
                          <button
                            onClick={() =>
                              setComplaintBooking(
                                booking
                              )
                            }
                            className="w-full mt-3 py-3 rounded-2xl border border-[#BAE6FD] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0EA5E9] font-bold"
                          >
                            ⚠️ File a Complaint
                          </button>
                        )}

                        {booking.hasComplaint && (
                          <div className="mt-3 rounded-2xl bg-[#EFF6FF] border border-[#BAE6FD] p-4">

                            <p className="text-sm font-bold text-[#0B1D36]">
                              ✓ Complaint Registered
                            </p>

                            {booking.complaintDate && (
                              <p className="text-xs text-[#0EA5E9] mt-1">
                                Registered on{" "}
                                {new Date(
                                  booking.complaintDate
                                ).toLocaleDateString(
                                  "en-IN"
                                )}
                              </p>
                            )}

                            <p className="text-xs text-[#0EA5E9] mt-1">
                              Our support team will contact you.
                            </p>

                          </div>
                        )}

                      </div>
                    )}

                  </div>
                </article>
              );
            }
          )}

        </div>

        {/* SUPPORT */}

        <div
          className="mt-5 rounded-3xl p-5 text-white"
          style={{
            background:
              "linear-gradient(135deg, #0B1D36 0%, #0D9488 100%)",
          }}
        >

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
              💬
            </div>

            <div>

              <h3 className="font-bold">
                Need help with a booking?
              </h3>

              <p className="text-xs text-white/70 mt-1">
                OnCall support is here to help.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">

            <a
              href={`tel:+91${supportPhone}`}
              className="py-3 rounded-2xl bg-white text-[#0B1D36] text-center font-bold text-sm"
            >
              📞 Call
            </a>

            <a
              href={`https://wa.me/91${supportPhone}?text=${encodeURIComponent(
                "Hello OnCall, I need help with my booking."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 rounded-2xl bg-[#0EA5E9] text-white text-center font-bold text-sm"
            >
              💬 WhatsApp
            </a>

          </div>
        </div>

      </main>

      {/* =================================================
          REVIEW MODAL
      ================================================= */}

      {reviewBooking && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">

            <div className="text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E6FFFB] flex items-center justify-center text-2xl">
                ⭐
              </div>

              <h2 className="text-xl font-extrabold text-[#0B1D36] mt-4">
                Rate Your Service
              </h2>

              <p className="text-sm text-[#64748B] mt-1">
                How was your OnCall experience?
              </p>

            </div>

            <div className="flex justify-center gap-1 mt-6">

              {[1, 2, 3, 4, 5].map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() =>
                      setRating(number)
                    }
                    className="text-4xl px-1 transition hover:scale-110 text-[#0D9488]"
                    aria-label={`${number} star rating`}
                  >
                    {number <= rating
                      ? "★"
                      : "☆"}
                  </button>
                )
              )}

            </div>

            <p className="text-center text-sm font-semibold text-[#475569] mt-2">
              {rating === 0
                ? "Select a rating"
                : `${rating} out of 5`}
            </p>

            <textarea
              value={review}
              onChange={(e) =>
                setReview(e.target.value)
              }
              placeholder="Tell us about your experience (optional)"
              className="w-full mt-5 min-h-[110px] p-4 rounded-2xl border border-[#E2E8F0] outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#CCFBF1] resize-none"
            />

            <button
              onClick={submitReview}
              disabled={reviewLoading}
              className={`w-full mt-4 py-3.5 rounded-2xl text-white font-bold ${
                reviewLoading
                  ? "bg-[#94A3B8]"
                  : "bg-gradient-to-r from-[#0D9488] to-[#0EA5E9]"
              }`}
            >
              {reviewLoading
                ? "Submitting..."
                : "Submit Review"}
            </button>

            <button
              onClick={closeReview}
              disabled={reviewLoading}
              className="w-full mt-3 py-3 text-[#64748B] font-semibold"
            >
              Maybe Later
            </button>

          </div>
        </div>
      )}

      {/* =================================================
          CANCEL MODAL
      ================================================= */}

      {cancelBooking && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl w-full max-w-md p-6">

            <div className="text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-3xl">
                ⚠️
              </div>

              <h2 className="text-xl font-extrabold text-[#0B1D36] mt-4">
                Cancel Booking?
              </h2>

              <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                Are you sure you want to cancel this service booking?
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">

              <button
                onClick={() =>
                  setCancelBooking(null)
                }
                disabled={cancelLoading}
                className="py-3 rounded-2xl border border-[#E2E8F0] font-bold text-[#334155]"
              >
                Keep Booking
              </button>

              <button
                onClick={cancelUserBooking}
                disabled={cancelLoading}
                className="py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold"
              >
                {cancelLoading
                  ? "Cancelling..."
                  : "Yes, Cancel"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =================================================
          COMPLAINT MODAL
      ================================================= */}

      {complaintBooking && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">

          <div className="bg-white rounded-3xl w-full max-w-md p-6 my-5">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-extrabold text-[#0B1D36]">
                  File a Complaint
                </h2>

                <p className="text-sm text-[#64748B] mt-1">
                  Tell us what went wrong.
                </p>

              </div>

              <button
                onClick={closeComplaint}
                disabled={complaintLoading}
                className="w-10 h-10 rounded-xl bg-[#E2E8F0] text-xl text-[#0B1D36]"
              >
                ×
              </button>

            </div>

            <label className="block text-sm font-bold text-[#334155] mt-6 mb-2">
              Complaint Category
            </label>

            <select
              value={complaintCategory}
              onChange={(e) =>
                setComplaintCategory(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-2xl border border-[#E2E8F0] bg-white outline-none focus:border-[#0D9488]"
            >
              <option value="quality">
                Quality of Service
              </option>

              <option value="behavior">
                Professional Behavior
              </option>

              <option value="damage">
                Damage / Loss
              </option>

              <option value="pricing">
                Pricing Issue
              </option>

              <option value="delay">
                Service Delay
              </option>

              <option value="other">
                Other
              </option>
            </select>

            <label className="block text-sm font-bold text-[#334155] mt-5 mb-2">
              What happened?
            </label>

            <textarea
              value={complaintText}
              onChange={(e) =>
                setComplaintText(
                  e.target.value
                )
              }
              placeholder="Describe your issue..."
              className="w-full min-h-[130px] p-4 rounded-2xl border border-[#E2E8F0] outline-none focus:border-[#0D9488] resize-none"
            />

            <button
              onClick={submitComplaint}
              disabled={complaintLoading}
              className={`w-full mt-4 py-3.5 rounded-2xl text-white font-bold ${
                complaintLoading
                  ? "bg-[#94A3B8]"
                  : "bg-gradient-to-r from-[#0D9488] to-[#0EA5E9]"
              }`}
            >
              {complaintLoading
                ? "Submitting..."
                : "Submit Complaint"}
            </button>

            <div className="mt-4 rounded-2xl bg-[#E6FFFB] border border-[#99F6E4] p-4">

              <p className="text-sm font-bold text-[#0B1D36]">
                Need immediate help?
              </p>

              <p className="text-sm text-[#0D9488] mt-1">
                Call OnCall support at{" "}

                <a
                  href={`tel:+91${supportPhone}`}
                  className="font-bold underline"
                >
                  {supportPhone}
                </a>
              </p>

            </div>

          </div>
        </div>
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editBooking && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">

          <div className="bg-white rounded-3xl w-full max-w-md my-5 overflow-hidden">

            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">

              <div>

                <h2 className="text-xl font-extrabold text-[#0B1D36]">
                  Edit Booking
                </h2>

                <p className="text-xs text-[#64748B] mt-1">
                  Request a change to your booking
                </p>

              </div>

              <button
                onClick={closeEdit}
                disabled={editLoading}
                className="w-10 h-10 rounded-xl bg-[#E2E8F0] text-xl text-[#0B1D36]"
              >
                ×
              </button>

            </div>

            <div className="p-5 space-y-5">

              <div>
                <label className="block text-sm font-bold text-[#334155] mb-2">
                  Service
                </label>

                <input
                  value={editService}
                  onChange={(e) =>
                    setEditService(
                      e.target.value
                    )
                  }
                  placeholder="e.g. AC Repair"
                  className="w-full p-3 rounded-2xl border border-[#E2E8F0] outline-none focus:border-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#334155] mb-2">
                  Description / Sub-service
                </label>

                <textarea
                  value={editSubService}
                  onChange={(e) =>
                    setEditSubService(
                      e.target.value
                    )
                  }
                  placeholder="Describe the service you need..."
                  className="w-full p-3 rounded-2xl border border-[#E2E8F0] min-h-[100px] outline-none focus:border-[#0D9488] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#334155] mb-2">
                  Preferred Date
                </label>

                <input
                  type="date"
                  min={getToday()}
                  value={newDate}
                  onChange={(e) =>
                    setNewDate(
                      e.target.value
                    )
                  }
                  className="w-full p-3 rounded-2xl border border-[#E2E8F0] outline-none focus:border-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#334155] mb-2">
                  Preferred Time
                </label>

                <div className="grid grid-cols-3 gap-2">

                  <select
                    value={newTime.hour}
                    onChange={(e) =>
                      setNewTime(
                        (previous) => ({
                          ...previous,
                          hour: e.target.value,
                        })
                      )
                    }
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-white outline-none focus:border-[#0D9488]"
                  >
                    <option value="">
                      Hour
                    </option>

                    {Array.from(
                      { length: 12 },
                      (_, index) =>
                        String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )
                    ).map((hour) => (
                      <option
                        key={hour}
                        value={hour}
                      >
                        {hour}
                      </option>
                    ))}
                  </select>

                  <select
                    value={newTime.minute}
                    onChange={(e) =>
                      setNewTime(
                        (previous) => ({
                          ...previous,
                          minute:
                            e.target.value,
                        })
                      )
                    }
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-white outline-none focus:border-[#0D9488]"
                  >
                    <option value="">
                      Min
                    </option>

                    {[
                      "00",
                      "15",
                      "30",
                      "45",
                    ].map((minute) => (
                      <option
                        key={minute}
                        value={minute}
                      >
                        {minute}
                      </option>
                    ))}
                  </select>

                  <select
                    value={newTime.period}
                    onChange={(e) =>
                      setNewTime(
                        (previous) => ({
                          ...previous,
                          period:
                            e.target.value,
                        })
                      )
                    }
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-white outline-none focus:border-[#0D9488]"
                  >
                    <option value="AM">
                      AM
                    </option>

                    <option value="PM">
                      PM
                    </option>
                  </select>

                </div>
              </div>

              <div className="rounded-2xl bg-[#E6FFFB] border border-[#99F6E4] p-4">

                <p className="text-sm text-[#0B1D36] leading-relaxed">

                  <strong>Note:</strong>{" "}

                  Changes are saved as a modification
                  request. Your team can review the
                  updated booking details.

                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <button
                  onClick={closeEdit}
                  disabled={editLoading}
                  className="py-3 rounded-2xl border border-[#E2E8F0] font-bold text-[#334155]"
                >
                  Cancel
                </button>

                <button
                  onClick={saveEditChanges}
                  disabled={editLoading}
                  className={`py-3 rounded-2xl text-white font-bold ${
                    editLoading
                      ? "bg-[#94A3B8]"
                      : "bg-gradient-to-r from-[#0D9488] to-[#0EA5E9]"
                  }`}
                >
                  {editLoading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}