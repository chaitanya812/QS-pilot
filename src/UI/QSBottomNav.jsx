import React from "react";
import { useNavigate } from "react-router-dom";

export default function QSBottomNav() {
  const nav = useNavigate();
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t shadow qsm flex justify-around z-40 h-16"
      style={{ height: "calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom))" }}
    >
      <button onClick={() => nav("/")} className="flex flex-col items-center text-sm">
        <div className="text-2xl">🏠</div>
        <div>Home</div>
      </button>
      <button onClick={() => nav("/my")} className="flex flex-col items-center text-sm">
        <div className="text-2xl">📘</div>
        <div>Bookings</div>
      </button>
      <button onClick={() => nav("/profile")} className="flex flex-col items-center text-sm">
        <div className="text-2xl">👤</div>
        <div>Profile</div>
      </button>
    </div>
  );
}
