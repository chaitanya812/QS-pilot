import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import TechnicianJobCard from "../components/TechnicianJobCard.jsx";
import TechnicianNavbar from "../components/TechnicianNavbar.jsx";
import TechnicianStats from "../components/TechnicianStats.jsx";

import {
  getTechnicianJobs,
  getTechnicianSession,
  saveTechnicianJobs,
  updateTechnicianJobStatus,
} from "../utils/technicianService.js";

import "../techDashboard.css";

export default function TechnicianDashboard() {
  const navigate = useNavigate();

  /* ============================================================
     TECHNICIAN SESSION
  ============================================================ */

  const [technician] = useState(
    () => getTechnicianSession()
  );

  /* ============================================================
     JOB STATE
  ============================================================ */

  const [jobs, setJobs] = useState([]);

  const [loadingJobs, setLoadingJobs] = useState(true);

  const [updatingJobId, setUpdatingJobId] = useState(null);

  /* ============================================================
     LOAD REAL FIRESTORE JOBS
  ============================================================ */

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoadingJobs(true);

        /*
         * Get jobs assigned to the logged-in technician.
         */
        const technicianJobs =
          await getTechnicianJobs(technician);

        setJobs(
          Array.isArray(technicianJobs)
            ? technicianJobs
            : []
        );

        /*
         * Keep local cache as backup.
         */
        saveTechnicianJobs(
          Array.isArray(technicianJobs)
            ? technicianJobs
            : []
        );

      } catch (error) {
        console.error(
          "[TechnicianDashboard] Failed to load Firestore jobs:",
          error
        );

        setJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    }

    if (technician) {
      loadJobs();
    } else {
      setLoadingJobs(false);
    }
  }, [technician]);

  /* ============================================================
     UPDATE JOB STATUS
  ============================================================ */

  const updateStatus = async (
    id,
    newStatus
  ) => {
    try {
      setUpdatingJobId(String(id));

      /*
       * Update the real Firestore booking.
       */
      const success =
        await updateTechnicianJobStatus(
          id,
          newStatus
        );

      if (!success) {
        alert(
          "Unable to update booking status."
        );

        return;
      }

      /*
       * Update dashboard immediately.
       */
      const updatedJobs =
        jobs.map((job) =>
          String(job.id) === String(id)
            ? {
                ...job,
                status: newStatus,
                updatedAt:
                  new Date().toISOString(),
              }
            : job
        );

      setJobs(updatedJobs);

      /*
       * Update local backup.
       */
      saveTechnicianJobs(updatedJobs);

    } catch (error) {
      console.error(
        "[TechnicianDashboard] Status update failed:",
        error
      );

      alert(
        "Something went wrong while updating the job."
      );
    } finally {
      setUpdatingJobId(null);
    }
  };

  /* ============================================================
     LOGIN CHECK
  ============================================================ */

  if (!technician) {
    return (
      <main className="tech-empty">

        <h1>
          Technician login required
        </h1>

        <button
          className="tech-primary-action"
          onClick={() =>
            navigate("/tech-login")
          }
        >
          Go to Technician Login
        </button>

      </main>
    );
  }

  /* ============================================================
     ACTIVE JOBS
  ============================================================ */

  const activeJobs =
    jobs.filter(
      (job) =>
        ![
          "Completed",
          "Declined",
        ].includes(
          String(job.status)
        )
    );

  /* ============================================================
     DASHBOARD
  ============================================================ */

  return (
    <main className="tech-container">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <TechnicianNavbar
        technician={technician}
      />

      <section className="tech-content">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="tech-page-heading">

          <div>

            <p className="tech-eyebrow">
              TECHNICIAN
            </p>

            <h1>
              Assigned Jobs
            </h1>

            <p className="tech-preview-note">
              Manage your assigned
              QuickSeva service jobs.
            </p>

          </div>

          <span className="tech-job-count">
            {activeJobs.length} active
          </span>

        </div>

        {/* ====================================================
            STATS
        ==================================================== */}

        <TechnicianStats
          jobs={jobs}
        />

        {/* ====================================================
            JOB LIST
        ==================================================== */}

        <div className="job-list">

          {loadingJobs ? (

            <div className="tech-empty">

              <h2>
                Loading jobs...
              </h2>

              <p>
                Getting your assigned
                bookings from QuickSeva.
              </p>

            </div>

          ) : jobs.length === 0 ? (

            <div className="tech-empty">

              <h2>
                No jobs assigned
              </h2>

              <p>
                New assigned bookings
                will appear here.
              </p>

            </div>

          ) : (

            jobs.map(
              (job) => (

                <TechnicianJobCard
                  key={job.id}
                  job={job}
                  onStatusChange={
                    updateStatus
                  }
                  updating={
                    updatingJobId ===
                    String(job.id)
                  }
                />

              )
            )

          )}

        </div>

      </section>

    </main>
  );
}