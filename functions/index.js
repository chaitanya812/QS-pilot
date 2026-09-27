const {
  onDocumentCreated,
} = require(
  "firebase-functions/v2/firestore"
);

const {
  initializeApp,
} = require(
  "firebase-admin/app"
);

const {
  getFirestore,
} = require(
  "firebase-admin/firestore"
);

const {
  getMessaging,
} = require(
  "firebase-admin/messaging"
);

initializeApp();

const db =
  getFirestore();

/*
============================================================
NEW BOOKING NOTIFICATION
============================================================
*/

exports.notifyAdminNewBooking =
  onDocumentCreated(
    "bookings/{bookingId}",
    async (event) => {

      const snapshot =
        event.data;

      if (!snapshot) {
        console.log(
          "No booking snapshot."
        );

        return;
      }

      const booking =
        snapshot.data();

      const bookingId =
        event.params.bookingId;

      /*
      --------------------------------------------------------
      BOOKING INFORMATION
      --------------------------------------------------------
      */

      const service =
        String(
          booking.service ||
          booking.category ||
          "Service"
        );

      const subService =
        String(
          booking.subService ||
          booking.serviceName ||
          ""
        );

      const address =
        String(
          booking.address ||
          "Address not provided"
        );

      const date =
        String(
          booking.date ||
          "Date not provided"
        );

      const time =
        String(
          booking.time ||
          "Time not provided"
        );

      const phone =
        String(
          booking.phone ||
          "Phone not provided"
        );

      /*
      --------------------------------------------------------
      GET ADMIN DEVICES
      --------------------------------------------------------
      */

      const adminSnapshot =
        await db
          .collection(
            "adminDevices"
          )
          .get();

      if (
        adminSnapshot.empty
      ) {

        console.log(
          "No admin devices registered."
        );

        return;
      }

      const tokens =
        adminSnapshot.docs
          .map(
            (document) =>
              document.data().token
          )
          .filter(
            Boolean
          );

      if (
        tokens.length === 0
      ) {

        console.log(
          "No FCM tokens available."
        );

        return;
      }

      /*
      --------------------------------------------------------
      NOTIFICATION TITLE
      --------------------------------------------------------
      */

      const title =
        "🔔 New QuickSeva Booking";

      const body =
        `${service}` +
        `${
          subService
            ? ` - ${subService}`
            : ""
        }` +
        ` | 📅 ${date}` +
        ` | ⏰ ${time}`;

      /*
      --------------------------------------------------------
      SEND NOTIFICATION
      --------------------------------------------------------
      */

      const response =
        await getMessaging()
          .sendEachForMulticast({

            tokens,

            notification: {
              title,
              body,
            },

            data: {

              bookingId:
                String(
                  bookingId
                ),

              service:
                service,

              subService:
                subService,

              address:
                address,

              date:
                date,

              time:
                time,

              phone:
                phone,

              url:
                "https://www.quicksevaindia.com/admin",
            },

            webpush: {

              fcmOptions: {

                link:
                  "https://www.quicksevaindia.com/admin",

              },

            },

          });

      console.log(
        `Sent ${response.successCount} notifications.`
      );

      console.log(
        `Failed ${response.failureCount} notifications.`
      );

      /*
      --------------------------------------------------------
      REMOVE INVALID TOKENS
      --------------------------------------------------------
      */

      const cleanupPromises =
        [];

      response.responses.forEach(
        (result, index) => {

          if (
            !result.success
          ) {

            const errorCode =
              result.error?.code;

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
                    document.data()
                      .token ===
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

        }
      );

      await Promise.all(
        cleanupPromises
      );

    }
  );