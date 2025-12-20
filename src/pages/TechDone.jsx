// src/pages/TechDone.jsx
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function TechDone() {
  const { bookingId } = useParams();
  const [done, setDone] = useState(false);

  useEffect(() => {
    updateDoc(doc(db, "bookings", bookingId), {
      status: "Completed",
      completedAt: new Date().toISOString(),
    }).then(() => setDone(true));
  }, [bookingId]);

  return <div className="p-6 text-center">{done ? "🎉 Job Completed" : "Updating..."}</div>;
}
