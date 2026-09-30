import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import TechnicianNavbar from "../components/TechnicianNavbar.jsx";

import {
  getTechnicianJobs,
  getTechnicianSession,
  saveTechnicianJobs,
  updateTechnicianJobStatus,
} from "../utils/technicianService.js";

import "../techDashboard.css";

export default function TechnicianJobDetails() {
  const { jobId } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const [technician] = useState(
    () => getTechnicianSession()
  );

  const [job, setJob] = useState(
    () => location.state?.job || null
  );

  const [loading, setLoading] =
    useState(!location.state?.job);

  const [updating, setUpdating] =
    useState(false);

  /* ============================================================
     LOAD REAL JOB FROM FIRESTORE
  ============================================================ */

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);

        const jobs =
          await getTechnicianJobs(
            technician
          );

        const foundJob =
          jobs.find(
            (item) =>
              String(item.id) ===
              String(jobId)
          );

        if (foundJob) {
          setJob(foundJob);

          saveTechnicianJobs(jobs);
        }

      } catch (error) {
        console.error(
          "[TechnicianJobDetails] Failed to load job:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    if (
      technician &&
      !location.state?.job
    ) {
      loadJob();
    }
  }, [
    technician,
    jobId,
    location.state,
  ]);

  /* ============================================================
     LOGIN CHECK
  ============================================================ */

  if (!technician) {
    return (
      <Navigate
        to="/tech-login"
        replace
      />
    );
  }

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main className="tech-container">

        <TechnicianNavbar
          technician={technician}
        />

        <section className="tech-content">

          <div className="tech-empty">

            <h2>
              Loading booking...
            </h2>

            <p>
              Getting booking details.
            </p>

          </div>

        </section>

      </main>
    );
  }

  /* ============================================================
     JOB NOT FOUND
  ============================================================ */

  if (!job) {
    return (
      <main className="tech-container">

        <TechnicianNavbar
          technician={technician}
        />

        <section className="tech-content">

          <div className="tech-empty">

            <h2>
              Booking not found
            </h2>

            <p>
              This booking is no longer
              available for this technician.
            </p>

            <button
              className="tech-primary-action"
              onClick={() =>
                navigate("/tech")
              }
            >
              Back to Jobs
            </button>

          </div>

        </section>

      </main>
    );
  }

  /* ============================================================
     CHANGE STATUS
  ============================================================ */

  const changeStatus = async (
    newStatus
  ) => {
    try {
      setUpdating(true);

      const success =
        await updateTechnicianJobStatus(
          job.id,
          newStatus
        );

      if (!success) {
        alert(
          "Unable to update booking status."
        );

        return;
      }

      const updatedJob = {
        ...job,
        status: newStatus,
        updatedAt:
          new Date().toISOString(),
      };

      setJob(updatedJob);

      /*
       * Update local cache.
       */
      const cachedJobs =
        getTechnicianJobs();

      /*
       * getTechnicianJobs may be asynchronous
       * in the Firestore version, therefore
       * update the current job locally here.
       */
      if (Array.isArray(cachedJobs)) {
        const updatedJobs =
          cachedJobs.map(
            (item) =>
              String(item.id) ===
              String(job.id)
                ? updatedJob
                : item
          );

        saveTechnicianJobs(
          updatedJobs
        );
      }

    } catch (error) {
      console.error(
        "[TechnicianJobDetails] Status update failed:",
        error
      );

      alert(
        "Something went wrong while updating the booking."
      );
    } finally {
      setUpdating(false);
    }
  };

  /* ============================================================
     SERVICE / ITEM DISPLAY
  ============================================================ */

  const items =
    Array.isArray(job.items)
      ? job.items
      : [];

  const serviceName =
    job.service ||
    job.category ||
    job.serviceName ||
    "Service";

  const totalAmount =
    Number(
      job.totalAmount ??
      job.amount ??
      0
    );

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="tech-container">

      <TechnicianNavbar
        technician={technician}
      />

      <section className="tech-content">

        <Link
          className="tech-back-link"
          to="/tech"
        >
          ← Assigned Jobs
        </Link>

        <article className="job-detail-panel">

          {/* ==================================================
              HEADER
          ================================================== */}

          <p className="tech-eyebrow">
            JOB DETAILS
          </p>

          <div className="job-row">

            <div>

              <p className="job-kicker">
                Booking ID: {job.id}
              </p>

              <h1>
                {serviceName}
              </h1>

              {job.subService && (
                <p>
                  {job.subService}
                </p>
              )}

            </div>

            <span
              className={`status status--${String(
                job.status || "Pending"
              )
                .toLowerCase()
                .replaceAll(
                  " ",
                  "-"
                )}`}
            >
              {job.status ||
                "Pending"}
            </span>

          </div>

          {/* ==================================================
              BOOKING INFORMATION
          ================================================== */}

          <div className="job-details">

            <p>
              <span>
                Booking ID
              </span>

              {job.id}
            </p>

            <p>
              <span>
                Customer
              </span>

              {job.customer ||
                job.customerName ||
                job.userName ||
                "Customer"}
            </p>

            <p>
              <span>
                Phone
              </span>

              {job.phone ||
                job.customerPhone ||
                job.mobile ||
                "Not provided"}
            </p>

            <p>
              <span>
                Service
              </span>

              {serviceName}
            </p>

            {job.date && (
              <p>
                <span>
                  Date
                </span>

                {job.date}
              </p>
            )}

            {job.time && (
              <p>
                <span>
                  Time
                </span>

                {job.time}
              </p>
            )}

            <p>
              <span>
                Address
              </span>

              {job.address ||
                job.fullAddress ||
                job.location ||
                "Not provided"}
            </p>

            {job.problem && (
              <p>
                <span>
                  Problem
                </span>

                {job.problem}
              </p>
            )}

          </div>

          {/* ==================================================
              SERVICE ITEMS
          ================================================== */}

          {items.length > 0 && (

            <div className="job-details">

              <h3>
                Service Items
              </h3>

              {items.map(
                (item, index) => (

                  <div
                    key={
                      `${item.label || "item"}-${index}`
                    }
                    style={{
                      padding:
                        "10px 0",
                      borderBottom:
                        "1px solid #e5e7eb",
                    }}
                  >

                    <strong>
                      {item.label ||
                        "Service"}
                    </strong>

                    <div>
                      Qty:{" "}
                      {item.qty ||
                        1}
                    </div>

                    <div>
                      Price: ₹
                      {Number(
                        item.price ||
                        0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </div>

                    <div>
                      Subtotal: ₹
                      {Number(
                        item.subtotal ||
                        0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </div>

                  </div>

                )
              )}

            </div>

          )}

          {/* ==================================================
              TOTAL AMOUNT
          ================================================== */}

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "12px",
              background: "#f0fdf4",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >

            <strong>
              Total Amount
            </strong>

            <strong>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* ==================================================
              STATUS ACTIONS
          ================================================== */}

          <div className="button-group">

            {job.status ===
              "Assigned" && (
              <>
                <button
                  className="btn btn--accept"
                  disabled={updating}
                  onClick={() =>
                    changeStatus(
                      "Accepted"
                    )
                  }
                >
                  {updating
                    ? "Updating..."
                    : "Accept Job"}
                </button>

                <button
                  className="btn btn--reject"
                  disabled={updating}
                  onClick={() =>
                    changeStatus(
                      "Declined"
                    )
                  }
                >
                  Reject
                </button>
              </>
            )}

            {job.status ===
              "Accepted" && (
              <button
                className="btn btn--primary"
                disabled={updating}
                onClick={() =>
                  changeStatus(
                    "On The Way"
                  )
                }
              >
                {updating
                  ? "Updating..."
                  : "On The Way"}
              </button>
            )}

            {job.status ===
              "On The Way" && (
              <button
                className="btn btn--primary"
                disabled={updating}
                onClick={() =>
                  changeStatus(
                    "Work Started"
                  )
                }
              >
                {updating
                  ? "Updating..."
                  : "Start Work"}
              </button>
            )}

            {job.status ===
              "Work Started" && (
              <button
                className="btn btn--complete"
                disabled={updating}
                onClick={() =>
                  changeStatus(
                    "Completed"
                  )
                }
              >
                {updating
                  ? "Updating..."
                  : "Complete Work"}
              </button>
            )}

          </div>

          <p className="tech-preview-note">
            Booking information is loaded
            from QuickSeva Firestore and
            status changes are synchronized
            with the booking.
          </p>

        </article>

      </section>

    </main>
  );
}