import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LocationCapture from "../components/LocationCapture";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState("");
  const [subService, setSubService] = useState("");
  const [price, setPrice] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    if (!service.trim()) return alert("Enter service name");
    if (!subService.trim()) return alert("Enter sub-service");
    if (!address) return alert("Please detect your location");
    if (!time) return alert("Please select time");
    if (!postalCode || postalCode.trim().length < 3) return alert("Please confirm your postal code");

    const bookingData = {
      service,
      subService,
      price,
      address,
      latitude,
      longitude,
      time,
      postalCode: postalCode?.trim() || null,
      status: "Pending",
      createdAt: new Date().toISOString(),
      phone: user?.phone || null,
    };

    try {
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      const saved = { id: docRef.id, ...bookingData };
      navigate("/booking-success", { state: saved });
    } catch (err) {
      console.error("Failed to save booking", err);
      alert("Failed to save booking. Please try again.");
    }
  };

  useEffect(() => {
    // prefill service/subservice/price from navigation state when coming from service pages
    if (location?.state) {
      const s = location.state.service;
      const ss = location.state.subService;
      const p = location.state.price;
      if (s) setService(s);
      if (ss) setSubService(ss);
      if (p) setPrice(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      
      <h1 className="text-xl font-bold mb-3">Book Service</h1>

      {/* SERVICE */}
      <input
        placeholder="Service"
        className="w-full border p-2 rounded mb-2 bg-white"
        value={service}
        onChange={(e) => setService(e.target.value)}
      />

      {/* SUB SERVICE */}
      <input
        placeholder="Sub-Service"
        className="w-full border p-2 rounded mb-2 bg-white"
        value={subService}
        onChange={(e) => setSubService(e.target.value)}
      />

      {/* PRICE */}
      <input
        placeholder="Price"
        className="w-full border p-2 rounded mb-2 bg-white"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* 📍 GOOGLE LOCATION + TIME PICKER */}
      <LocationCapture
        onLocationDetected={(data) => {
          console.log("LOCATION PICKED", data);
          setAddress(data.address);
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          setTime(data.time);
          if (data.postalCode) setPostalCode(data.postalCode);
        }}
      />

      {/* SHOW CAPTURED DETAILS */}
      {address && (
        <div className="mt-4 p-3 rounded bg-green-50 border border-green-200 text-sm">
          <p>📍 <b>Address:</b> {address}</p>
          {time && <p>🕒 <b>Time:</b> {time}</p>}
          <div className="mt-2">
            <label className="text-sm block mb-1">Postal Code (confirm/edit)</label>
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-40 border p-2 rounded bg-white"
              placeholder="Postal code"
            />
          </div>
        </div>
      )}

      {/* SUBMIT BTN - fixed on small screens so it's always visible */}
      <div className="fixed bottom-4 left-0 right-0 px-4 z-50 sm:static sm:px-0">
        <button
          onClick={handleSubmit}
          disabled={!address || !service || !subService || !time}
          className={`w-full py-3 rounded text-white font-semibold ${
            address && service && subService && time
              ? "bg-qsBlue-500"
              : "bg-gray-400"
          }`}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
