import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

/*
============================================================
QUICKSEVA TECHNICIAN SERVICE
============================================================
*/

/*
============================================================
SAMPLE JOBS
Used only if Firestore has no jobs / for fallback UI
============================================================
*/

const sampleJobs = [
  {
    id: "sample-ac-repair",
    customer: "Ramesh Kumar",
    customerName: "Ramesh Kumar",
    service: "AC Repair",
    subService: "AC Service",
    address: "Madhapur, Hyderabad",
    phone: "9000000001",
    date: "Today",
    time: "02:00 PM",
    totalAmount: 1200,
    status: "Assigned",
  },

  {
    id: "sample-plumbing",
    customer: "Suresh Reddy",
    customerName: "Suresh Reddy",
    service: "Plumbing",
    subService: "Pipe Repair",
    address: "Banjara Hills, Hyderabad",
    phone: "9000000002",
    date: "Today",
    time: "04:30 PM",
    totalAmount: 800,
    status: "Accepted",
  },
];

/*
============================================================
LOCAL STORAGE HELPERS
============================================================
*/

function readJson(key, fallback) {
  try {
    const value = JSON.parse(
      localStorage.getItem(key) || "null"
    );

    return value ?? fallback;
  } catch (error) {
    console.error(
      `[TechnicianService] Failed to read ${key}:`,
      error
    );

    return fallback;
  }
}

/*
============================================================
FIND TECHNICIAN BY PHONE
============================================================
*/

export function findTechnicianByPhone(phone) {
  const normalizedPhone = String(
    phone || ""
  ).replace(/\D/g, "");

  const technicians = readJson(
    "technicians",
    []
  );

  return technicians.find(
    (technician) =>
      String(
        technician.phone || ""
      ).replace(/\D/g, "") ===
      normalizedPhone
  );
}

/*
============================================================
GET TECHNICIAN SESSION
============================================================
*/

export function getTechnicianSession() {
  return readJson(
    "technician",
    null
  );
}

/*
============================================================
SAVE TECHNICIAN SESSION
============================================================
*/

export function saveTechnicianSession(
  technician
) {
  try {
    localStorage.setItem(
      "technician",
      JSON.stringify(technician)
    );
  } catch (error) {
    console.error(
      "[TechnicianService] Failed to save technician session:",
      error
    );
  }
}

/*
============================================================
CLEAR TECHNICIAN SESSION
============================================================
*/

export function clearTechnicianSession() {
  localStorage.removeItem(
    "technician"
  );
}

/*
============================================================
GET TECHNICIAN JOBS
FROM FIRESTORE
============================================================
*/

export async function getTechnicianJobs() {
  try {
    const technician =
      getTechnicianSession();

    if (!technician) {
      console.warn(
        "[TechnicianService] No technician session found."
      );

      return [];
    }

    /*
    --------------------------------------------------------
    TECHNICIAN IDENTIFIERS
    --------------------------------------------------------
    */

    const technicianId =
      String(
        technician.id ||
        technician.technicianId ||
        technician.uid ||
        ""
      );

    const technicianPhone =
      String(
        technician.phone ||
        technician.technicianPhone ||
        ""
      ).replace(/\D/g, "");

    const technicianName =
      String(
        technician.name ||
        technician.technicianName ||
        ""
      )
        .trim()
        .toLowerCase();

    console.log(
      "[TechnicianService] Loading jobs for:",
      {
        technicianId,
        technicianPhone,
        technicianName,
      }
    );

    /*
    --------------------------------------------------------
    GET ALL BOOKINGS
    --------------------------------------------------------
    */

    const bookingsRef =
      collection(
        db,
        "bookings"
      );

    const snapshot =
      await getDocs(
        bookingsRef
      );

    const allBookings =
      snapshot.docs.map(
        (document) => ({
          id: document.id,
          ...document.data(),
        })
      );

    /*
    --------------------------------------------------------
    FILTER ASSIGNED BOOKINGS
    --------------------------------------------------------
    */

    const technicianJobs =
      allBookings.filter(
        (booking) => {

          const bookingTechnicianId =
            String(
              booking.technicianId ||
              ""
            );

          const bookingTechnicianPhone =
            String(
              booking.technicianPhone ||
              ""
            ).replace(
              /\D/g,
              ""
            );

          const bookingTechnicianName =
            String(
              booking.technicianName ||
              ""
            )
              .trim()
              .toLowerCase();

          /*
          Match by technician ID
          */

          if (
            technicianId &&
            bookingTechnicianId &&
            technicianId ===
              bookingTechnicianId
          ) {
            return true;
          }

          /*
          Match by technician phone
          */

          if (
            technicianPhone &&
            bookingTechnicianPhone &&
            technicianPhone ===
              bookingTechnicianPhone
          ) {
            return true;
          }

          /*
          Match by technician name
          */

          if (
            technicianName &&
            bookingTechnicianName &&
            technicianName ===
              bookingTechnicianName
          ) {
            return true;
          }

          return false;
        }
      );

    /*
    --------------------------------------------------------
    CONVERT FIRESTORE BOOKINGS INTO JOB OBJECTS
    --------------------------------------------------------
    */

    const jobs =
      technicianJobs.map(
        (booking) => {

          const items =
            Array.isArray(
              booking.items
            )
              ? booking.items
              : [];

          /*
          Build service name from booking
          */

          let service =
            booking.service ||
            booking.category ||
            booking.serviceName ||
            "";

          /*
          If service is missing, use first
          booking item label.
          */

          if (
            !service &&
            items.length > 0
          ) {
            service =
              items[0]?.label ||
              "";
          }

          /*
          Build sub-service
          */

          const subService =
            booking.subService ||
            booking.subServiceName ||
            booking.selectedService ||
            "";

          /*
          Customer name
          */

          const customer =
            booking.userName ||
            booking.customerName ||
            booking.name ||
            booking.customer ||
            "QuickSeva User";

          /*
          Total amount
          */

          const totalAmount =
            Number(
              booking.totalAmount ??
              booking.amount ??
              booking.total ??
              0
            );

          return {
            /*
            Basic booking
            */

            id:
              booking.id,

            bookingId:
              booking.id,

            /*
            Customer
            */

            customer:
              customer,

            customerName:
              customer,

            userName:
              booking.userName ||
              customer,

            phone:
              booking.phone ||
              booking.customerPhone ||
              booking.mobile ||
              "",

            /*
            Service
            */

            service:
              service ||
              "Service",

            serviceName:
              service ||
              "Service",

            category:
              booking.category ||
              "",

            subService:
              subService,

            subServiceName:
              subService,

            /*
            Address
            */

            address:
              booking.address ||
              booking.fullAddress ||
              booking.location ||
              "Address not provided",

            postalCode:
              booking.postalCode ||
              "",

            latitude:
              booking.latitude ??
              null,

            longitude:
              booking.longitude ??
              null,

            /*
            Date / Time
            */

            date:
              booking.date ||
              booking.bookingDate ||
              "Date not provided",

            time:
              booking.time ||
              booking.bookingTime ||
              "Time not provided",

            /*
            Problem
            */

            problem:
              booking.problem ||
              null,

            /*
            Price
            */

            items:
              items,

            amount:
              totalAmount,

            total:
              totalAmount,

            totalAmount:
              totalAmount,

            /*
            Status
            */

            status:
              booking.status ||
              "Assigned",

            /*
            Technician
            */

            technicianId:
              booking.technicianId ||
              "",

            technicianName:
              booking.technicianName ||
              technician.name ||
              "",

            technicianPhone:
              booking.technicianPhone ||
              technician.phone ||
              "",

            technicianPhoto:
              booking.technicianPhoto ||
              null,

            technicianRating:
              booking.technicianRating ||
              null,

            eta:
              booking.eta ||
              null,

            /*
            Dates
            */

            createdAt:
              booking.createdAt ||
              null,

            assignedAt:
              booking.assignedAt ||
              null,

            updatedAt:
              booking.updatedAt ||
              null,
          };
        }
      );

    /*
    --------------------------------------------------------
    SORT NEWEST FIRST
    --------------------------------------------------------
    */

    jobs.sort(
      (a, b) => {

        const dateA =
          new Date(
            a.createdAt || 0
          ).getTime();

        const dateB =
          new Date(
            b.createdAt || 0
          ).getTime();

        return dateB - dateA;
      }
    );

    console.log(
      `[TechnicianService] Found ${jobs.length} assigned jobs.`
    );

    return jobs;

  } catch (error) {

    console.error(
      "[TechnicianService] Failed to load Firestore jobs:",
      error
    );

    /*
    Return locally saved jobs if Firestore
    temporarily fails.
    */

    const localJobs =
      readJson(
        "technicianJobs",
        null
      );

    if (
      Array.isArray(
        localJobs
      )
    ) {
      return localJobs;
    }

    return [];
  }
}

/*
============================================================
SAVE TECHNICIAN JOBS LOCALLY
============================================================
*/

export function saveTechnicianJobs(
  jobs
) {
  try {

    localStorage.setItem(
      "technicianJobs",
      JSON.stringify(
        Array.isArray(jobs)
          ? jobs
          : []
      )
    );

  } catch (error) {

    console.error(
      "[TechnicianService] Failed to save technician jobs:",
      error
    );
  }
}

/*
============================================================
GET LOCAL TECHNICIAN JOBS
============================================================
*/

export function getLocalTechnicianJobs() {
  const jobs =
    readJson(
      "technicianJobs",
      null
    );

  return Array.isArray(
    jobs
  )
    ? jobs
    : sampleJobs.map(
        (job) => ({
          ...job,
        })
      );
}

/*
============================================================
UPDATE TECHNICIAN JOB STATUS
FIRESTORE
============================================================
*/

export async function updateTechnicianJobStatus(
  bookingId,
  newStatus
) {
  try {

    if (!bookingId) {
      console.error(
        "[TechnicianService] Booking ID is required."
      );

      return false;
    }

    if (!newStatus) {
      console.error(
        "[TechnicianService] New status is required."
      );

      return false;
    }

    console.log(
      "[TechnicianService] Updating booking:",
      bookingId,
      "→",
      newStatus
    );

    /*
    --------------------------------------------------------
    BOOKING DOCUMENT
    --------------------------------------------------------
    */

    const bookingRef =
      doc(
        db,
        "bookings",
        String(
          bookingId
        )
      );

    /*
    --------------------------------------------------------
    UPDATE FIRESTORE
    --------------------------------------------------------
    */

    await updateDoc(
      bookingRef,
      {
        status:
          newStatus,

        updatedAt:
          new Date().toISOString(),
      }
    );

    console.log(
      "[TechnicianService] Booking status updated successfully."
    );

    /*
    --------------------------------------------------------
    UPDATE LOCAL CACHE
    --------------------------------------------------------
    */

    const localJobs =
      readJson(
        "technicianJobs",
        []
      );

    if (
      Array.isArray(
        localJobs
      )
    ) {

      const updatedJobs =
        localJobs.map(
          (job) =>
            String(
              job.id
            ) ===
            String(
              bookingId
            )
              ? {
                  ...job,
                  status:
                    newStatus,
                  updatedAt:
                    new Date().toISOString(),
                }
              : job
        );

      saveTechnicianJobs(
        updatedJobs
      );
    }

    return true;

  } catch (error) {

    console.error(
      "[TechnicianService] Failed to update booking status:",
      error
    );

    return false;
  }
}

/*
============================================================
GET SINGLE TECHNICIAN JOB
============================================================
*/

export async function getTechnicianJobById(
  bookingId
) {
  try {

    const jobs =
      await getTechnicianJobs();

    return (
      jobs.find(
        (job) =>
          String(
            job.id
          ) ===
          String(
            bookingId
          )
      ) ||
      null
    );

  } catch (error) {

    console.error(
      "[TechnicianService] Failed to get job:",
      error
    );

    return null;
  }
}

/*
============================================================
LOGOUT TECHNICIAN
============================================================
*/

export function logoutTechnician() {
  clearTechnicianSession();

  localStorage.removeItem(
    "technicianJobs"
  );
}