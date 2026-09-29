const {
  onDocumentCreated,
} = require("firebase-functions/v2/firestore");

const {
  initializeApp,
} = require("firebase-admin/app");

const {
  getFirestore,
} = require("firebase-admin/firestore");

const {
  getMessaging,
} = require("firebase-admin/messaging");

initializeApp();

const db = getFirestore();

/*
============================================================
QUICKSEVA - NEW BOOKING ADMIN NOTIFICATION
============================================================
*/

exports.notifyAdminNewBooking = onDocumentCreated(
  "bookings/{bookingId}",
  async (event) => {
    try {
      const snapshot = event.data;

      if (!snapshot) {
        console.log("[FCM] No booking snapshot.");
        return;
      }

      const booking = snapshot.data();
      const bookingId = event.params.bookingId;

      /*
      ========================================================
      BOOKING DATA
      ========================================================
      */

      const service = String(
        booking.service ||
        booking.category ||
        booking.serviceName ||
        booking.title ||
        "Service"
      );

      const subService = String(
        booking.subService ||
        booking.subServiceName ||
        booking.selectedService ||
        ""
      );

      const address = String(
        booking.address ||
        booking.fullAddress ||
        booking.location ||
        "Address not provided"
      );

      const date = String(
        booking.date ||
        booking.bookingDate ||
        "Date not provided"
      );

      const time = String(
        booking.time ||
        booking.bookingTime ||
        "Time not provided"
      );

      const phone = String(
        booking.phone ||
        booking.mobile ||
        booking.customerPhone ||
        "Phone not provided"
      );

      const customerName = String(
        booking.name ||
        booking.customerName ||
        booking.userName ||
        "Customer"
      );

      /*
      ========================================================
      ADMIN DEVICES
      ========================================================
      */

      const adminSnapshot = await db
        .collection("adminDevices")
        .where("enabled", "==", true)
        .get();

      if (adminSnapshot.empty) {
        console.log(
          "[FCM] No enabled admin devices found."
        );
        return;
      }

      const tokens = adminSnapshot.docs
        .map((document) => document.data().token)
        .filter(Boolean);

      if (tokens.length === 0) {
        console.log(
          "[FCM] No admin FCM tokens available."
        );
        return;
      }

      /*
      ========================================================
      NOTIFICATION
      ========================================================
      */

      const title =
        "🔔 New QuickSeva Booking";

      const body =
        `${service}` +
        `${subService ? ` - ${subService}` : ""}` +
        `\n🆔 Booking ID: ${bookingId}` +
        `\n📅 ${date}` +
        `\n⏰ ${time}`;

      /*
      ========================================================
      SEND FCM
      ========================================================
      */

      const response =
        await getMessaging().sendEachForMulticast({
          tokens,

          notification: {
            title,
            body,
          },

          data: {
            bookingId: String(bookingId),

            service: String(service),

            subService: String(subService),

            customerName: String(customerName),

            address: String(address),

            date: String(date),

            time: String(time),

            phone: String(phone),

            url:
              "https://www.quicksevaindia.com/admin",
          },

          webpush: {
            notification: {
              title,
              body,

              icon:
                "https://www.quicksevaindia.com/favicon.ico",

              badge:
                "https://www.quicksevaindia.com/favicon.ico",

              requireInteraction: true,

              tag:
                `quickseva-booking-${bookingId}`,
            },

            fcmOptions: {
              link:
                "https://www.quicksevaindia.com/admin",
            },
          },
        });

      console.log(
        `[FCM] Sent: ${response.successCount}`
      );

      console.log(
        `[FCM] Failed: ${response.failureCount}`
      );

      /*
      ========================================================
      REMOVE INVALID TOKENS
      ========================================================
      */

      const cleanupPromises = [];

      response.responses.forEach(
        (result, index) => {
          if (result.success) {
            return;
          }

          const errorCode =
            result.error?.code;

          console.error(
            `[FCM] Token failed: ${errorCode}`
          );

          if (
            errorCode ===
              "messaging/registration-token-not-registered" ||
            errorCode ===
              "messaging/invalid-registration-token"
          ) {
            const invalidToken =
              tokens[index];

            adminSnapshot.docs
              .filter(
                (document) =>
                  document.data().token ===
                  invalidToken
              )
              .forEach(
                (document) => {
                  cleanupPromises.push(
                    document.ref.delete()
                  );
                }
              );
          }
        }
      );

      await Promise.all(
        cleanupPromises
      );

      console.log(
        `[FCM] Booking notification completed: ${bookingId}`
      );

    } catch (error) {
      console.error(
        "[FCM] New booking notification error:",
        error
      );
    }
  }
);