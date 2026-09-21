import React from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../utils/CartContext";

import CartItem from "../components/CartItem";

export default function CartScreen() {
  const navigate = useNavigate();

  const {
    cart,
    total,
    itemCount,
    clearCart,
  } = useCart();

  const items = Object.values(cart);

  const handleContinue = () => {
    if (items.length === 0) {
      return;
    }

    /*
     * Cart is already stored in CartContext.
     *
     * Booking page will read the current cart.
     */
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">

      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-white border-b">

        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl"
          >
            ←
          </button>

          <div className="flex-1">

            <p className="text-xs text-slate-500">
              QuickSeva
            </p>

            <h1 className="text-lg font-bold text-slate-900">
              Your Cart
            </h1>

          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-red-500 font-semibold"
            >
              Clear
            </button>
          )}

        </div>

      </header>

      <main className="max-w-2xl mx-auto px-4 pt-5">

        {/* EMPTY */}

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border p-8 text-center mt-8">

            <div className="text-6xl mb-4">
              🛒
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Select a service to continue with your booking.
            </p>

            <button
              type="button"
              onClick={() => navigate("/ac")}
              className="mt-5 px-6 py-3 rounded-xl bg-sky-500 text-white font-bold"
            >
              Browse AC Services
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="block mx-auto mt-3 text-sm text-sky-600 font-semibold"
            >
              Go to Home
            </button>

          </div>
        ) : (

          <>
            {/* TITLE */}

            <div className="mb-4">

              <h2 className="text-xl font-bold text-slate-900">
                Selected Services
              </h2>

              <p className="text-sm text-slate-500">
                {itemCount}{" "}
                {itemCount === 1
                  ? "service"
                  : "services"}{" "}
                selected
              </p>

            </div>

            {/* ITEMS */}

            <div className="space-y-3">

              {items.map((item) => (
                <CartItem
                  key={
                    item.key ||
                    item.id ||
                    item.label
                  }
                  item={item}
                />
              ))}

            </div>

            {/* SUMMARY */}

            <section className="bg-white rounded-2xl border p-5 mt-5">

              <h3 className="font-bold text-slate-900 mb-4">
                Price Summary
              </h3>

              <div className="flex justify-between text-sm text-slate-600">

                <span>
                  Services
                </span>

                <span>
                  ₹
                  {Number(total).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="flex justify-between text-sm text-slate-600 mt-2">

                <span>
                  Service charge
                </span>

                <span className="text-emerald-600">
                  Included
                </span>

              </div>

              <div className="border-t mt-4 pt-4 flex justify-between">

                <span className="font-bold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-bold text-slate-900">
                  ₹
                  {Number(total).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </section>

            {/* TRUST */}

            <div className="grid grid-cols-3 gap-2 mt-4">

              <div className="bg-white border rounded-xl p-3 text-center">

                <div>
                  🛡️
                </div>

                <p className="text-xs font-semibold mt-1">
                  Verified
                </p>

              </div>

              <div className="bg-white border rounded-xl p-3 text-center">

                <div>
                  💰
                </div>

                <p className="text-xs font-semibold mt-1">
                  Clear Price
                </p>

              </div>

              <div className="bg-white border rounded-xl p-3 text-center">

                <div>
                  ⭐
                </div>

                <p className="text-xs font-semibold mt-1">
                  Trusted
                </p>

              </div>

            </div>

          </>
        )}

      </main>

      {/* CHECKOUT BAR */}

      {items.length > 0 && (

        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">

          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">

            <div className="flex-1">

              <p className="text-xs text-slate-500">
                Total
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
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-sm"
            >
              Continue →
            </button>

          </div>

        </div>

      )}

    </div>
  );
}