import React from "react";

import { useCart } from "../utils/CartContext";

export default function CartItem({ item }) {
  const {
    addItem,
    decreaseItem,
    removeItem,
  } = useCart();

  const itemKey =
    item.key ||
    item.id ||
    item.label ||
    item.name;

  return (
    <div className="bg-white border rounded-2xl p-4">

      <div className="flex justify-between gap-4">

        <div className="flex-1">

          <h3 className="font-bold text-slate-900">
            {item.label || item.name}
          </h3>

          {item.service && (
            <p className="text-xs text-sky-600 mt-1">
              {item.service}
            </p>
          )}

          {item.category && (
            <p className="text-xs text-slate-500">
              {item.category}
            </p>
          )}

          <p className="text-sm text-slate-600 mt-2">
            ₹
            {Number(item.price).toLocaleString(
              "en-IN"
            )}{" "}
            × {item.qty}
          </p>

          <p className="font-bold text-slate-900 mt-1">
            ₹
            {(
              Number(item.price) *
              Number(item.qty)
            ).toLocaleString("en-IN")}
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            removeItem(itemKey)
          }
          className="w-9 h-9 rounded-lg bg-red-50 text-red-500"
          aria-label="Remove service"
        >
          🗑️
        </button>

      </div>

      {/* QUANTITY */}

      <div className="flex items-center justify-between mt-4 pt-3 border-t">

        <span className="text-sm text-slate-500">
          Quantity
        </span>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              decreaseItem(itemKey)
            }
            className="w-9 h-9 rounded-lg bg-slate-100 text-lg font-bold"
          >
            −
          </button>

          <span className="w-6 text-center font-bold">
            {item.qty}
          </span>

          <button
            type="button"
            onClick={() =>
              addItem(item)
            }
            className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 text-lg font-bold"
          >
            +
          </button>

        </div>

      </div>

    </div>
  );
}