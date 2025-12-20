// src/pages/TechOnWay.jsx
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function TechOnWay() {
  const { bookingId } = useParams();
  const [done, setDone] = useState(false);

  useEffect(() => {
    updateDoc(doc(db, "bookings", bookingId), {
      status: "On The Way",
      onTheWayAt: new Date().toISOString(),
    }).then(() => setDone(true));
  }, [bookingId]);

  return <div className="p-6 text-center">{done ? "🚗 On The Way" : "Updating..."}</div>;
}
