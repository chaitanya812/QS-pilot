import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import CartItem from "../components/CartItem";
import CartFooter from "../components/CartFooter";

export default function CartScreen() {
  const navigate = useNavigate();

  const {
    cart,
    total,
    itemCount,
  } = useCart();

  const items = Object.values(cart || {});

  const safeTotal = Number(total) || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl transition hover:bg-slate-200 active:scale-95"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900">
              Your Cart
            </h1>

            <p className="text-xs text-slate-500">
              {itemCount}{" "}
              {itemCount === 1 ? "service" : "services"}
            </p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-32 pt-5">
        {items.length === 0 ? (
          /* Empty Cart */
          <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-sky-100 text-5xl">
              🛒
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              You haven't added any services yet.
              Choose a service and add it to your cart
              to continue.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-600 active:scale-95"
            >
              Browse Services
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-3 text-sm font-medium text-slate-500 hover:text-sky-600"
            >
              ← Back to Home
            </button>
          </div>
        ) : (
          <>
            {/* Heading */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Selected Services
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review your services before booking.
              </p>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={
                    item.key ||
                    item.id ||
                    item.label ||
                    `${item.name}-${index}`
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-slate-900">
                Price Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    Services ({itemCount})
                  </span>

                  <span className="font-semibold text-slate-800">
                    ₹{safeTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    Service visit
                  </span>

                  <span className="font-semibold text-emerald-600">
                    Included
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Estimated Total
                    </span>

                    <span className="text-xl font-extrabold text-slate-900">
                      ₹{safeTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust Message */}
            <div className="mt-4 rounded-2xl bg-sky-50 p-4">
              <div className="flex gap-3">
                <div className="text-xl">
                  🛡️
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Safe & transparent booking
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    You'll see your booking details and
                    technician information after
                    confirmation.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Bottom Footer */}
      {items.length > 0 && <CartFooter />}
    </div>
  );
}