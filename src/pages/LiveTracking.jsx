import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LiveTracking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // Mock positions (percentage-based map)
  const CUSTOMER = { x: 50, y: 70 };

  const [tech, setTech] = useState({
    x: 10,
    y: 10,
    distanceKm: 6.5,
    eta: 25,
    status: "On the way",
  });

  // 🔄 Simulate real-time movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTech((prev) => {
        if (prev.distanceKm <= 0.2) {
          clearInterval(interval);
          return {
            ...prev,
            distanceKm: 0,
            eta: 0,
            status: "Arrived",
          };
        }

        return {
          x: prev.x + 1.5,
          y: prev.y + 1.8,
          distanceKm: Math.max(prev.distanceKm - 0.4, 0),
          eta: Math.max(prev.eta - 2, 0),
          status: "On the way",
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 pb-28">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded bg-gray-200"
        >
          ←
        </button>
        <h2 className="text-lg font-bold">Live Tracking</h2>
      </div>

      {/* MAP MOCK */}
      <div className="relative w-full h-72 bg-gray-200 rounded-xl overflow-hidden border">
        {/* Technician */}
        <div
          className="absolute transition-all duration-1000"
          style={{
            left: `${tech.x}%`,
            top: `${tech.y}%`,
          }}
        >
          <div className="text-2xl">🧑‍🔧</div>
        </div>

        {/* Customer */}
        <div
          className="absolute"
          style={{
            left: `${CUSTOMER.x}%`,
            top: `${CUSTOMER.y}%`,
          }}
        >
          <div className="text-2xl">🏠</div>
        </div>
      </div>

      {/* STATUS CARD */}
      <div className="mt-4 bg-white p-4 rounded-xl shadow border">
        <div className="flex justify-between items-center">
          <strong>Status</strong>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              tech.status === "Arrived"
                ? "bg-green-200 text-green-800"
                : "bg-blue-200 text-blue-800"
            }`}
          >
            {tech.status}
          </span>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          🚗 Distance: {tech.distanceKm.toFixed(1)} km
        </div>
        <div className="text-sm text-gray-600">
          ⏱ ETA: {tech.eta} mins
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">
        <a
          href="tel:9000000001"
          className="flex-1 text-center py-2 rounded bg-green-600 text-white"
        >
          📞 Call
        </a>

        <a
          href="https://wa.me/919000000001"
          target="_blank"
          rel="noreferrer"
          className="flex-1 text-center py-2 rounded bg-green-500 text-white"
        >
          💬 WhatsApp
        </a>
      </div>

      {/* FOOTER NOTE */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Live tracking updates every few seconds.
        Powered by OnCall.
      </p>
    </div>
  );
}
