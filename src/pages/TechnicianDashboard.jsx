import React, { useState } from "react";
import "../techDashboard.css";

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      customer: "Ramesh",
      service: "AC Repair",
      address: "Madhapur, Hyderabad",
      time: "2:00 PM",
      status: "Pending",
    },
    {
      id: 2,
      customer: "Suresh",
      service: "Plumbing",
      address: "Banjara Hills",
      time: "4:30 PM",
      status: "Pending",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  };

  return (
    <div className="tech-container">
      <header className="tech-header">
        Technician Dashboard
      </header>

      <div className="job-list">
        {jobs.map(job => (
          <div className="job-card" key={job.id}>
            <div className="job-row">
              <h3>{job.service}</h3>

              <span
                className={`status ${
                  job.status === "On the Way" ? "OnWay" : job.status
                }`}
              >
                {job.status}
              </span>
            </div>

            <p><b>Customer:</b> {job.customer}</p>
            <p><b>Address:</b> {job.address}</p>
            <p><b>Time:</b> {job.time}</p>

            <div className="button-group">
              <button
                className="btn onway"
                disabled={job.status !== "Pending"}
                onClick={() => updateStatus(job.id, "On the Way")}
              >
                On The Way
              </button>

              <button
                className="btn done"
                disabled={job.status === "Done"}
                onClick={() => updateStatus(job.id, "Done")}
              >
                Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
