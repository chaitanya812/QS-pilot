import React from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../utils/CartContext";

export default function CartFooter() {
  const navigate = useNavigate();

  const {
    total,
    itemCount,
    isEmpty,
  } = useCart();

  const handleContinue = () => {
    if (isEmpty) {
      return;
    }

    navigate("/booking");
  };

  if (isEmpty) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-xl">

      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">

        <div className="flex-1">

          <p className="text-xs text-slate-500">
            {itemCount}{" "}
            {itemCount === 1
              ? "service"
              : "services"}
          </p>

          <p className="text-xl font-bold text-slate-900">
            ₹
            {Number(total).toLocaleString(
              "en-IN"
            )}
          </p>

        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold"
        >
          Continue →
        </button>

      </div>

    </div>
  );
}