import React, { useEffect, useState } from "react";

export default function AppRatingPopup() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem("qs_app_rating") || "{}");

    // If already asked twice today → do nothing
    if (data.date === today && (data.count || 0) >= 2) return;

    // If snoozed → schedule when it should reappear
    if (data.snoozedUntil && Date.now() < data.snoozedUntil) {
      const waitTime = data.snoozedUntil - Date.now();
      const timer = setTimeout(() => setOpen(true), waitTime);
      return () => clearTimeout(timer);
    }

    // First popup: show after 1 MINUTE
    const firstTimer = setTimeout(() => {
      setOpen(true);
    }, 60 * 1000); // 1 minute

    return () => clearTimeout(firstTimer);
  }, []);

  const submit = () => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem("qs_app_rating") || "{}");

    const newCount = (data.count || 0) + 1;

    // Save rating
    localStorage.setItem(
      "qs_app_rating",
      JSON.stringify({
        date: today,
        count: newCount,
        rating,
        feedback,
      })
    );

    setOpen(false);

    // If this was FIRST rating → schedule second popup in 30 minutes
    if (newCount === 1) {
      localStorage.setItem(
        "qs_app_rating",
        JSON.stringify({
          date: today,
          count: newCount,
          rating,
          feedback,
          snoozedUntil: Date.now() + 30 * 60 * 1000, // 30 minutes
        })
      );

      setTimeout(() => {
        setOpen(true);
      }, 30 * 60 * 1000);
    }
  };

  const remindMeLater = () => {
    localStorage.setItem(
      "qs_app_rating",
      JSON.stringify({
        snoozedUntil: Date.now() + 30 * 60 * 1000, // 30 minutes
      })
    );

    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-xl w-11/12 max-w-sm">
        <h3 className="font-semibold text-lg mb-2">
          Enjoying OnCall?
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Rate your app experience
        </p>

        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              className={`text-2xl cursor-pointer ${
                n <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Feedback (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={submit}
          className="w-full p-3 bg-qsBlue-500 text-white rounded mb-2"
        >
          Submit
        </button>

        <button
          onClick={remindMeLater}
          className="w-full p-3 bg-gray-200 text-gray-700 rounded"
        >
          Remind me later
        </button>
      </div>
    </div>
  );
}
