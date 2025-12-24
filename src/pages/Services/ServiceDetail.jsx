import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ServiceDetail() {
  const nav = useNavigate();
  const { state } = useLocation();

  const [cart, setCart] = useState({});

  const items = [
    { name: "Regular switch", price: 69, rating: "4.82 (67K reviews)", img: "https://i.ibb.co/VBzrQFZ/switch1.png" },
    { name: "Power switch (16 AMP)", price: 89, rating: "4.82 (22K reviews)", img: "https://i.ibb.co/grMGg8T/switch2.png" },
    { name: "Power socket (16 AMP)", price: 129, rating: "4.82 (30K reviews)", img: "https://i.ibb.co/3Yh3PjH/switch3.png" },
  ];

  const toggleQty = (name, type) => {
    setCart((prev) => {
      const qty = prev[name] || 0;
      if (type === "add") return { ...prev, [name]: qty + 1 };

      if (qty === 1) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }

      return { ...prev, [name]: qty - 1 };
    });
  };

  // ✅ LIVE TOTAL CALCULATION
  const total = Object.keys(cart).reduce((sum, key) => {
    const item = items.find((i) => i.name === key);
    return sum + (cart[key] * item.price);
  }, 0);

  // ✅ PROCEED
  const handleProceed = () => {
    if (!total) return alert("Please add at least 1 item");

    const selectedItems = Object.keys(cart).map((key) => ({
      name: key,
      qty: cart[key],
      price: items.find((i) => i.name === key)?.price,
    }));

    nav("/booking", {
      state: {
        service: state?.service || "Electrician",
        subService: state?.subService || "Switch / Socket repair & replacement",
        price: `₹${total}`,
        items: selectedItems,
      },
    });
  };

  const FAQS = [
    { q: "Does the cost include spare parts?", a: "No, prices do not include spare part charges. Technician will share estimate." },
    { q: "What if the same issue occurs again?", a: "Service is covered under warranty period shown on service page." },
    { q: "What if anything gets damaged?", a: "Damage cover up to ₹10,000 as per policy." },
    { q: "Are spare parts covered under warranty?", a: "Yes. Company warranty applies on installed parts." },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="p-4 pb-28">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => nav(-1)} className="p-2 rounded bg-gray-200">
          ← Back
        </button>
        <h2 className="text-lg font-bold">{state?.subService || "Electrician"}</h2>
        <div />
      </div>

      {/* WHITE SHEET CONTAINER */}
      <div className="bg-white rounded-3xl shadow p-4 mb-5">
        <p className="text-xl font-semibold">
          {state?.subService || "Switch / Socket repair & replacement"}
        </p>
        <p className="text-sm mt-1">⭐ 4.82 (91K reviews)</p>

        {/* PRODUCTS */}
        <div className="flex gap-3 overflow-x-auto mt-4 no-scrollbar">
          {items.map((i, idx) => (
            <div key={idx} className="min-w-[150px] p-3 rounded-2xl border shadow-sm">
              <img src={i.img} className="w-full h-20 object-contain" />
              <p className="font-semibold mt-2">{i.name}</p>
              <p className="text-xs text-gray-600">⭐ {i.rating}</p>
              <p className="font-semibold mt-1">₹{i.price}</p>

              {!cart[i.name] ? (
                <button
                  className="w-full mt-2 py-1 border rounded-xl text-purple-600 font-semibold"
                  onClick={() => toggleQty(i.name, "add")}
                >
                  Add
                </button>
              ) : (
                <div className="flex justify-between items-center mt-2 border rounded-xl px-2 py-1">
                  <button onClick={() => toggleQty(i.name, "minus")} className="text-xl">
                    −
                  </button>
                  <span>{cart[i.name]}</span>
                  <button onClick={() => toggleQty(i.name, "add")} className="text-xl">
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* OUR PROCESS */}
        <h3 className="text-xl font-bold mt-6 mb-3">Our process</h3>
        {[
          { t: "Inspection", d: "We inspect your switch/socket & share a repair quote for approval" },
          { t: "Quote approval", d: "Approve quote to proceed or pay only visiting charges if declined" },
          { t: "Repair & spare parts", d: "Spare parts sourced if required" },
          { t: "Replacement if needed", d: "If repair is not possible, replacement will be done" },
          { t: "Warranty activation", d: "30 days warranty after repair" },
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-3 mb-3">
            <div className="w-7 h-7 flex justify-center items-center bg-gray-200 rounded-full font-bold">
              {i + 1}
            </div>
            <div>
              <p className="font-semibold">{s.t}</p>
              <p className="text-sm text-gray-600">{s.d}</p>
            </div>
          </div>
        ))}

        {/* EXCLUDED */}
        <div className="mt-4 bg-gray-50 rounded-2xl p-3">
          <p className="font-bold text-lg">What is excluded?</p>
          <p className="text-sm mt-2">
            ❌ Wiring beyond 2 meters is not included. Extra charges apply.
          </p>
        </div>

        {/* TOP TECHNICIANS */}
        <div className="mt-6">
          <p className="text-xl font-bold">Top technicians</p>
          <p className="mt-2">✔ Background verified</p>
          <p>✔ Trained across all major brands</p>
          <p>✔ Certified technicians</p>
        </div>

        {/* PROMISE */}
        <div className="mt-6 bg-gray-50 rounded-2xl p-3">
          <p className="text-xl font-bold">QS Promise</p>
          <p className="mt-2">🛡 Up to 30 days of warranty</p>
          <p>💰 Up to ₹10,000 damage cover</p>
        </div>

        {/* FAQ */}
        <p className="text-xl font-bold mt-6 mb-2">Frequently asked questions</p>

        {FAQS.map((f, i) => (
          <div key={i} className="border-b">
            <button
              className="w-full flex justify-between py-3"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <span>{f.q}</span>
              <span>⌄</span>
            </button>
            {openFaq === i && (
              <p className="pb-3 text-sm text-gray-600">{f.a}</p>
            )}
          </div>
        ))}

        {/* SHARE */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Share this service with your loved ones
          </p>
          <button className="border rounded-xl px-6 py-2 mt-2 text-purple-600 font-semibold">
            Share ↗
          </button>
        </div>

        {/* RATING SECTION */}
        <div className="mt-6">
          <p className="text-2xl font-bold">⭐ 4.82</p>
          <p className="text-sm text-gray-500">91K reviews</p>

          {[
            { star: 5, value: 85000 },
            { star: 4, value: 3000 },
            { star: 3, value: 945 },
            { star: 2, value: 603 },
            { star: 1, value: 2000 },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 mt-1">
              <span>⭐ {r.star}</span>
              <div className="flex-1 bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${(r.value / 85000) * 100}%` }}
                />
              </div>
              <span>
                {r.value >= 1000 ? `${Math.round(r.value / 1000)}K` : r.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">₹{total || 0}</p>
          <p className="text-xs text-gray-500">Including selected items</p>
        </div>

        <button
          onClick={handleProceed}
          disabled={!total}
          className={`px-6 py-3 rounded-xl text-white font-semibold ${
            total ? "bg-qsBlue-500" : "bg-gray-400"
          }`}
        >
          Proceed to Booking →
        </button>
      </div>
    </div>
  );
}
