import React, { useState } from "react";

export default function LocationCapture({ onLocationDetected }) {
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [showPostalModal, setShowPostalModal] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [postalError, setPostalError] = useState("");

  const formatTimeTo12Hour = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const h12 = ((hours + 11) % 12) + 1;
    const m = minutes.toString().padStart(2, "0");
    return `${h12}:${m} ${ampm}`;
  };

  const handleConfirm = () => {
    // Open postal-code confirmation modal
    setPostalError("");
    setShowPostalModal(true);
  };

  const validatePostal = (p) => {
    if (!p || p.trim().length < 3) return false;
    // allow alphanumeric, spaces and hyphen, length 3-12
    return /^[A-Za-z0-9 \-]{3,12}$/.test(p.trim());
  };

  const handlePostalConfirm = () => {
    if (!validatePostal(postalCode)) {
      setPostalError("Enter a valid postal code (3–12 characters)");
      return;
    }
    const detectedTime = time || formatTimeTo12Hour(new Date());
    setShowPostalModal(false);
    if (onLocationDetected) onLocationDetected({ address: address || "", latitude: null, longitude: null, time: detectedTime, postalCode: postalCode.trim() });
  };

  return (
    <div className="mb-2">
      <div className="mt-3">
        <label className="text-sm block mb-1">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="w-full border p-2 rounded mb-2 bg-white"
        />
        <div className="flex gap-2">
          <button onClick={handleConfirm} className="px-3 py-2 bg-qsBlue-500 text-white rounded">
            Confirm address
          </button>
          <button onClick={() => setAddress("")} className="px-3 py-2 bg-gray-200 text-gray-800 rounded">
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3">
        <label className="text-sm block mb-1">Preferred time</label>
        <input
          type="time"
          className="w-full border p-2 rounded bg-white"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      {showPostalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowPostalModal(false)} />
          <div className="relative bg-white rounded p-4 w-11/12 max-w-md">
            <h3 className="text-lg font-medium mb-2">Confirm Postal Code</h3>
            <p className="text-sm text-gray-600 mb-3">Please confirm or enter your postal / ZIP code for this address.</p>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => { setPostalCode(e.target.value); setPostalError(""); }}
              placeholder="Postal code"
              className="w-full border p-2 rounded mb-2"
            />
            {postalError && <div className="text-red-600 text-sm mb-2">{postalError}</div>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPostalModal(false)} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handlePostalConfirm} className="px-3 py-2 bg-qsBlue-500 text-white rounded">Confirm Postal Code</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
