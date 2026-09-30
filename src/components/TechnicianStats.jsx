import React from "react";

export default function TechnicianStats({ jobs }) {
  const activeJobs = jobs.filter((job) => !["Completed", "Declined"].includes(job.status)).length;
  const awaitingResponse = jobs.filter((job) => job.status === "Assigned").length;
  const completedJobs = jobs.filter((job) => job.status === "Completed").length;

  return (
    <section className="tech-stats" aria-label="Job summary">
      <div><span>Active jobs</span><strong>{activeJobs}</strong></div>
      <div><span>Awaiting response</span><strong>{awaitingResponse}</strong></div>
      <div><span>Completed</span><strong>{completedJobs}</strong></div>
    </section>
  );
}