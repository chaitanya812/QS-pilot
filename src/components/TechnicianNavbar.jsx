import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearTechnicianSession } from "../utils/technicianService.js";

export default function TechnicianNavbar({ technician }) {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    clearTechnicianSession();
    navigate("/tech-login");
  };

  return (
    <header className="tech-header">
      <Link className="tech-brand" to="/">QuickSeva</Link>
      <nav className="tech-nav" aria-label="Technician navigation">
        <Link className={location.pathname === "/tech" ? "is-active" : ""} to="/tech">
          Assigned Jobs
        </Link>
        <Link className={location.pathname === "/tech/profile" ? "is-active" : ""} to="/tech/profile">
          Profile
        </Link>
      </nav>
      <div className="tech-account">
        <span>{technician?.name || "Technician"}</span>
        <button type="button" onClick={logout}>Log out</button>
      </div>
    </header>
  );
}