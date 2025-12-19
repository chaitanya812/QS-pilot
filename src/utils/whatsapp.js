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

// FUNCTION (ADDED – FOR TECHNICIAN NOTIFICATION)
export function openWhatsAppForTechnician(technicianPhone, booking) {
  const message = encodeURIComponent(
    `🛠 New Job Assigned – QS

Service: ${booking.service}
Issue: ${booking.subService}
Date: ${booking.date}
Time: ${booking.time}
Address: ${booking.address}

✅ Accept Job:
https://qs-pilot.vercel.app/tech/accept/${booking.id}

❌ Decline Job:
https://qs-pilot.vercel.app/tech/decline/${booking.id}`
  );

  window.open(
    `https://wa.me/91${technicianPhone}?text=${message}`,
    "_blank"
  );
}
