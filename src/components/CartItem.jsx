import React from "react";
import { useCart } from "../utils/CartContext";

export default function CartItem({ item }) {
  const {
    addItem,
    decreaseItem,
    removeItem,
  } = useCart();

  const price = Number(item?.price) || 0;
  const qty = Number(item?.qty) || 0;
  const itemTotal = price * qty;

  const handleDecrease = () => {
    decreaseItem(item.key || item.label);
  };

  const handleIncrease = () => {
    addItem(item);
  };

  const handleRemove = () => {
    removeItem(item.key || item.label);
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
      {/* Service Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-2xl">
        🛠️
      </div>

      {/* Service Details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900">
          {item?.label || item?.name || "Service"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          ₹{price.toLocaleString("en-IN")} × {qty}
        </p>

        <p className="mt-1 text-sm font-extrabold text-slate-900">
          ₹{itemTotal.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex shrink-0 items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={handleDecrease}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-lg font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-90"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <span className="w-8 text-center text-sm font-bold text-slate-900">
          {qty}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-lg font-bold text-white shadow-sm transition hover:bg-sky-600 active:scale-90"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={handleRemove}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 active:scale-90"
        aria-label="Remove service"
        title="Remove service"
      >
        🗑️
      </button>
    </div>
  );
}