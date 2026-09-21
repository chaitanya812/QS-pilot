import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../utils/CartContext";

export default function ViewCartBar() {
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const count = Number(itemCount) || 0;

  // Hide the floating cart bar when there are no services.
  if (count <= 0) {
    return null;
  }

  const goToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={goToCart}
          className="w-full bg-slate-900 text-white rounded-2xl px-5 py-4 shadow-2xl flex items-center justify-between gap-4 transition hover:bg-slate-800 active:scale-[0.99]"
          aria-label={`View cart with ${count} ${
            count === 1 ? "service" : "services"
          }`}
        >
          <div className="text-left min-w-0">
            <p className="text-xs text-slate-300 truncate">
              {count} {count === 1 ? "service" : "services"} in cart
            </p>

            <p className="font-bold truncate">
              View selected services
            </p>
          </div>

          <span className="font-bold whitespace-nowrap">
            View Cart →
          </span>
        </button>
      </div>
    </div>
  );
}
