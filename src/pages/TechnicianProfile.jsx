import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import TechnicianNavbar from "../components/TechnicianNavbar.jsx";
import TechnicianStats from "../components/TechnicianStats.jsx";
import { getTechnicianJobs, getTechnicianSession } from "../utils/technicianService.js";
import "../techDashboard.css";

export default function TechnicianProfile() {
  const [technician] = useState(getTechnicianSession);
  const [jobs] = useState(getTechnicianJobs);

  if (!technician) return <Navigate to="/tech-login" replace />;

  return (
    <main className="tech-container">
      <TechnicianNavbar technician={technician} />
      <section className="tech-content">
        <div className="tech-page-heading">
          <div><p className="tech-eyebrow">ACCOUNT</p><h1>Technician Profile</h1></div>
        </div>
        <section className="technician-profile">
          <div className="technician-avatar" aria-hidden="true">
            {(technician.name || "T").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2>{technician.name || "Technician"}</h2>
            <p>{technician.phone || "Phone number unavailable"}</p>
            {technician.rating && <p>Rating: {technician.rating}</p>}
          </div>
        </section>
        <TechnicianStats jobs={jobs} />
      </section>
    </main>
  );
}