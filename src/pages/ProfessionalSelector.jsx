import React, { useState } from "react";

const MOCK_PROFESSIONALS = [
  {
    id: "p1",
    name: "Rajesh Kumar",
    rating: 4.9,
    jobs: 320,
    distance: 1.8,
    eta: 20,
    skill: "AC & Appliances",
  },
  {
    id: "p2",
    name: "Suresh Reddy",
    rating: 4.7,
    jobs: 210,
    distance: 3.2,
    eta: 35,
    skill: "Electrician",
  },
  {
    id: "p3",
    name: "Imran Khan",
    rating: 4.8,
    jobs: 275,
    distance: 2.5,
    eta: 28,
    skill: "Washing Machine & Fridge",
  },
];

export default function ProfessionalSelector({ onSelect }) {
  const [mode, setMode] = useState("auto"); // auto | manual
  const [selected, setSelected] = useState(null);

  const handleAuto = () => {
    setMode("auto");
    setSelected(null);
    onSelect(null); // OnCall assigns
  };

  const handleSelect = (pro) => {
    setMode("manual");
    setSelected(pro.id);
    onSelect(pro);
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-700">
        Choose a Verified Service Professional Near You
      </h3>
      <p className="text-sm text-gray-500 mb-3">
        Based on location, experience, and service rating
      </p>

      {/* AUTO ASSIGN */}
      <div
        onClick={handleAuto}
        className={`p-4 rounded-xl border cursor-pointer mb-3 ${
          mode === "auto"
            ? "border-qsBlue-500 bg-qsBlue-50"
            : "bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <input type="radio" checked={mode === "auto"} readOnly />
          <span className="font-medium">
            Let OnCall assign the best professional (Recommended)
          </span>
        </div>
      </div>

      {/* MANUAL SELECTION */}
      <div className="space-y-3">
        {MOCK_PROFESSIONALS.map((p) => (
          <div
            key={p.id}
            onClick={() => handleSelect(p)}
            className={`p-4 rounded-xl border cursor-pointer bg-white transition ${
              selected === p.id
                ? "border-qsBlue-500 bg-qsBlue-50"
                : "hover:shadow"
            }`}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">
                  ⭐ {p.rating} · {p.jobs}+ services
                </div>
                <div className="text-sm text-gray-500">
                  📍 {p.distance} km · ⏱ {p.eta} mins
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Specialist: {p.skill}
                </div>
              </div>
              <input type="radio" checked={selected === p.id} readOnly />
            </div>
          </div>
        ))}
      </div>

      {/* TRUST NOTE */}
      <p className="text-xs text-gray-500 mt-3">
        All professionals are verified, background-checked, and monitored by
        OnCall. Services include a 6-month warranty.
      </p>
    </div>
  );
}
