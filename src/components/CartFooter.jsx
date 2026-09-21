import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../utils/CartContext";

export default function CartFooter() {
  const navigate = useNavigate();

  const {
    cart,
    total,
    itemCount,
  } = useCart();

  const items = Object.values(cart || {});

  const safeTotal = Number(total) || 0;

  const handleContinue = () => {
    if (items.length === 0) {
      return;
    }

    const bookingItems = items.map((item) => ({
      id: item.id || item.key || null,
      key: item.key || item.label,
      name: item.name || item.label,
      label: item.label || item.name,
      qty: Number(item.qty) || 1,
      price: Number(item.price) || 0,
    }));

    navigate("/booking", {
      state: {
        items: bookingItems,
        totalAmount: safeTotal,
      },
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        {/* Total */}
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {itemCount}{" "}
            {itemCount === 1 ? "service" : "services"}
          </p>

          <p className="text-xl font-extrabold text-slate-900">
            ₹{safeTotal.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={items.length === 0}
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-sky-500 px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}