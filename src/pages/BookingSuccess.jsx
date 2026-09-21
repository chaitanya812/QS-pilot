import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const nav = useNavigate();
  const location = useLocation();

  // --------------------------------------------------
  // QuickSeva Support
  // --------------------------------------------------
  const SUPPORT_PHONE = "7661045308";
  const WHATSAPP_NUMBER = "7661045308";

  // --------------------------------------------------
  // Booking data from Booking.jsx
  // --------------------------------------------------
  const booking = location.state || {};

  const bookingId = booking.id || "Pending";
  const totalAmount = Number(booking.totalAmount) || 0;

  const customerName =
    booking.userName ||
    booking.user?.name ||
    "Customer";

  const date = booking.date || "";
  const time = booking.time || "";
  const address = booking.address || "";

  const items = Array.isArray(booking.items)
    ? booking.items
    : [];

  // --------------------------------------------------
  // WhatsApp message
  // --------------------------------------------------
  const whatsappMessage = encodeURIComponent(
    `Hello QuickSeva 👋

I just booked a service.

Booking ID: ${bookingId}
Customer: ${customerName}
${date ? `Date: ${date}` : ""}
${time ? `Time: ${time}` : ""}

Please help me regarding my booking.`
  );

  // --------------------------------------------------
  // Format date
  // --------------------------------------------------
  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "Not selected";

  // --------------------------------------------------
  // Booking ID short display
  // --------------------------------------------------
  const shortBookingId =
    bookingId !== "Pending"
      ? String(bookingId).slice(-8).toUpperCase()
      : "PENDING";

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* -------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------- */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => nav("/")}
            className="text-slate-600 font-semibold text-sm hover:text-slate-900"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-7">
        {/* ------------------------------------------ */}
        {/* SUCCESS CARD */}
        {/* ------------------------------------------ */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center">
          {/* Success icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl font-bold">
              ✓
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-5">
            Booking Confirmed!
          </h1>

          <p className="text-slate-500 mt-2 leading-relaxed">
            Your service request has been successfully
            received.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
            🕒 Finding the right professional for you
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* BOOKING ID */}
        {/* ------------------------------------------ */}
        <div className="mt-4 bg-slate-900 rounded-3xl p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Booking ID
              </p>

              <p className="text-xl font-extrabold mt-1 tracking-wider">
                QS-{shortBookingId}
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
              📋
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Keep this ID for support or future reference.
          </p>
        </div>

        {/* ------------------------------------------ */}
        {/* BOOKING DETAILS */}
        {/* ------------------------------------------ */}
        <section className="mt-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 text-lg">
            Booking Details
          </h2>

          {/* Customer */}
          <div className="flex items-center gap-3 mt-5">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center">
              👤
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Customer
              </p>

              <p className="font-semibold text-slate-900">
                {customerName}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3 mt-5">
            <div className="w-11 h-11 rounded-2xl bg-violet-50 flex items-center justify-center">
              🗓️
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Service Date
              </p>

              <p className="font-semibold text-slate-900">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 mt-5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center">
              🕒
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Preferred Time
              </p>

              <p className="font-semibold text-slate-900">
                {time || "Not selected"}
              </p>
            </div>
          </div>

          {/* Address */}
          {address && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex gap-3">
                <span className="text-xl">
                  📍
                </span>

                <div>
                  <p className="text-xs text-slate-500">
                    Service Location
                  </p>

                  <p className="text-sm font-medium text-slate-800 mt-1 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ------------------------------------------ */}
        {/* SERVICES */}
        {/* ------------------------------------------ */}
        {items.length > 0 && (
          <section className="mt-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-slate-900 text-lg">
              Services
            </h2>

            <div className="mt-4 space-y-3">
              {items.map((item, index) => {
                const price =
                  Number(item?.price) || 0;

                const qty =
                  Number(item?.qty) > 0
                    ? Number(item.qty)
                    : 1;

                const subtotal =
                  Number(item?.subtotal) ||
                  price * qty;

                return (
                  <div
                    key={`${item?.label || "service"}-${index}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        {item?.label || "Service"}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        ₹{price} × {qty}
                      </p>
                    </div>

                    <p className="font-bold text-slate-900 whitespace-nowrap">
                      ₹{subtotal}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between">
              <span className="font-bold text-slate-700">
                Total
              </span>

              <span className="text-xl font-extrabold text-slate-900">
                ₹{totalAmount}
              </span>
            </div>
          </section>
        )}

        {/* ------------------------------------------ */}
        {/* WHAT HAPPENS NEXT */}
        {/* ------------------------------------------ */}
        <section className="mt-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 text-lg">
            What happens next?
          </h2>

          <div className="mt-5 space-y-5">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold shrink-0">
                1
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Booking received
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  We've received your service request.
                </p>
              </div>
            </div>

            {/* Line */}
            <div className="ml-4 -my-2 h-4 border-l-2 border-dashed border-slate-200" />

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold shrink-0">
                2
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Professional assigned
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  A suitable service professional will
                  be assigned to your request.
                </p>
              </div>
            </div>

            {/* Line */}
            <div className="ml-4 -my-2 h-4 border-l-2 border-dashed border-slate-200" />

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold shrink-0">
                3
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Professional contacts you
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  You'll receive updates as your booking
                  progresses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------ */}
        {/* TRUST */}
        {/* ------------------------------------------ */}
        <section className="mt-4 rounded-3xl bg-emerald-50 border border-emerald-100 p-5">
          <h2 className="font-bold text-emerald-900">
            Why book with Quickly?
          </h2>

          <div className="mt-4 space-y-3 text-sm text-emerald-800">
            <div className="flex gap-3">
              <span>✓</span>
              <span>Verified service professionals</span>
            </div>

            <div className="flex gap-3">
              <span>✓</span>
              <span>6-month service warranty</span>
            </div>

            <div className="flex gap-3">
              <span>✓</span>
              <span>QuickSeva support available</span>
            </div>

            <div className="flex gap-3">
              <span>✓</span>
              <span>Booking status updates</span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------ */}
        {/* SUPPORT */}
        {/* ------------------------------------------ */}
        <section className="mt-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 flex items-center justify-center text-xl">
              💬
            </div>

            <h2 className="font-bold text-slate-900 mt-3">
              Need help?
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Our support team is available to help
              with your booking.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold transition active:scale-[0.98]"
            >
              💬 WhatsApp
            </a>

            {/* Call */}
            <a
              href={`tel:+91${SUPPORT_PHONE}`}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition active:scale-[0.98]"
            >
              📞 Call Support
            </a>
          </div>
        </section>

        {/* ------------------------------------------ */}
        {/* MAIN ACTIONS */}
        {/* ------------------------------------------ */}
        <div className="mt-5 space-y-3">
          <button
            onClick={() => nav("/my")}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition active:scale-[0.98]"
          >
            📋 View My Bookings
          </button>

          <button
            onClick={() => nav("/")}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold transition"
          >
            🏠 Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}