// src/utils/whatsapp.js

// ✅ EXISTING FUNCTION (UNCHANGED)
export function openWhatsAppAfterBooking(booking) {
  const phone = "7661045308"; // QS official number

  const message = encodeURIComponent(
    `Hi QS 👋
Booking Confirmed ✅

Service: ${booking.service}
Issue: ${booking.subService}
Date: ${booking.date}
Time: ${booking.time}
Address: ${booking.address}

Please assign a technician.`
  );

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}


// ✅ UPDATED — TECHNICIAN CONTROL MESSAGE
export function openWhatsAppForTechnician(technicianPhone, booking) {
  const base = "https://qs-pilot.vercel.app";

  const message = encodeURIComponent(
    `🛠 New Job Assigned – QS

Service: ${booking.service}
Issue: ${booking.subService}
Date: ${booking.date}
Time: ${booking.time}
Address: ${booking.address}

👉 Update Status:
Accept: ${base}/tech/accept/${booking.id}
Decline: ${base}/tech/decline/${booking.id}
On The Way: ${base}/tech/onway/${booking.id}
Work Started: ${base}/tech/start/${booking.id}
Completed: ${base}/tech/done/${booking.id}`
  );

  window.open(`https://wa.me/91${technicianPhone}?text=${message}`, "_blank");
}
