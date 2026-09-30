import React from "react";
import { Link } from "react-router-dom";

const progressSteps = ["Accepted", "On The Way", "Work Started", "Completed"];

function getProgressIndex(status) {
  if (status === "Accepted") return 1;
  if (status === "On The Way") return 2;
  if (status === "Work Started") return 3;
  if (status === "Completed") return 4;
  return 0;
}

export default function TechnicianJobCard({ job, onStatusChange }) {
  const statusClass = job.status.toLowerCase().replaceAll(" ", "-");
  const progressIndex = getProgressIndex(job.status);

  return (
    <article className="job-card">
      <div className="job-row">
        <div>
          <p className="job-kicker">{job.time}</p>
          <h2>{job.service}</h2>
        </div>
        <span className={`status status--${statusClass}`}>{job.status}</span>
      </div>

      <div className="job-details">
        <p><span>Customer</span>{job.customer}</p>
        <p><span>Address</span>{job.address}</p>
      </div>

      {job.status !== "Declined" && (
        <ol className="job-progress" aria-label="Job progress">
          {progressSteps.map((step, index) => (
            <li className={progressIndex > index ? "is-done" : ""} key={step}>
              <span>{index + 1}</span>
              <small>{step}</small>
            </li>
          ))}
        </ol>
      )}

      <div className="button-group">
        {job.status === "Assigned" && (
          <>
            <button className="btn btn--accept" onClick={() => onStatusChange(job.id, "Accepted")}>Accept Job</button>
            <button className="btn btn--reject" onClick={() => onStatusChange(job.id, "Declined")}>Reject</button>
          </>
        )}
        {job.status === "Accepted" && (
          <button className="btn btn--primary" onClick={() => onStatusChange(job.id, "On The Way")}>On The Way</button>
        )}
        {job.status === "On The Way" && (
          <button className="btn btn--primary" onClick={() => onStatusChange(job.id, "Work Started")}>Start Work</button>
        )}
        {job.status === "Work Started" && (
          <button className="btn btn--complete" onClick={() => onStatusChange(job.id, "Completed")}>Complete Work</button>
        )}
        {job.status === "Completed" && <p className="job-finished">Work completed</p>}
        {job.status === "Declined" && <p className="job-finished">Job rejected</p>}
        <Link className="job-details-link" to={`/tech/jobs/${job.id}`} state={{ job }}>Details</Link>
      </div>
    </article>
  );
}