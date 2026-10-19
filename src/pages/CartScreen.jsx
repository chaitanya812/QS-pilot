import React from "react";
import { useNavigate } from "react-router-dom";

import "./CartScreen.css";

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

    navigate("/booking");
  };

  return (
    <div className="cart-page">

      {/* HEADER */}

      <header className="cart-header">
        <div className="cart-header-inner">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cart-back-btn"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="cart-brand">
            <div className="cart-brand-dot" />

            <div>
              <p>OnCall</p>

              <h1>Your Cart</h1>
            </div>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="cart-clear-btn"
            >
              Clear
            </button>
          )}

        </div>
      </header>

      <main className="cart-container">

        {/* EMPTY CART */}

        {items.length === 0 ? (
          <section className="cart-empty-card">

            <div className="cart-empty-icon">
              🛒
            </div>

            <span className="cart-empty-label">
              YOUR CART
            </span>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Select a service to continue with your booking.
            </p>

            <button
              type="button"
              onClick={() => navigate("/ac")}
              className="cart-browse-btn"
            >
              Browse AC Services →
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="cart-home-btn"
            >
              Go to Home
            </button>

          </section>
        ) : (

          <>

            {/* TITLE */}

            <section className="cart-title-section">

              <div>
                <span>
                  BOOKING CART
                </span>

                <h2>
                  Selected Services
                </h2>

                <p>
                  {itemCount}{" "}
                  {itemCount === 1
                    ? "service"
                    : "services"}{" "}
                  selected
                </p>
              </div>

              <div className="cart-count-badge">
                {itemCount}
              </div>

            </section>

            {/* ITEMS */}

            <section className="cart-items-section">

              {items.map((item) => (
                <div
                  key={
                    item.key ||
                    item.id ||
                    item.label
                  }
                  className="cart-item-wrapper"
                >
                  <CartItem item={item} />
                </div>
              ))}

            </section>

            {/* PRICE SUMMARY */}

            <section className="cart-summary-card">

              <div className="cart-summary-heading">
                <div>
                  <span>
                    ORDER DETAILS
                  </span>

                  <h3>
                    Price Summary
                  </h3>
                </div>

                <div className="cart-summary-icon">
                  ₹
                </div>
              </div>

              <div className="cart-summary-row">

                <span>
                  Services
                </span>

                <strong>
                  ₹
                  {Number(total).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div className="cart-summary-row">

                <span>
                  Service charge
                </span>

                <strong className="cart-included">
                  Included
                </strong>

              </div>

              <div className="cart-summary-divider" />

              <div className="cart-total-row">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {Number(total).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </section>

            {/* TRUST */}

            <section className="cart-trust-grid">

              <div className="cart-trust-card">
                <div className="cart-trust-icon">
                  🛡️
                </div>

                <p>
                  Verified
                </p>
              </div>

              <div className="cart-trust-card">
                <div className="cart-trust-icon">
                  💰
                </div>

                <p>
                  Clear Price
                </p>
              </div>

              <div className="cart-trust-card">
                <div className="cart-trust-icon">
                  ⭐
                </div>

                <p>
                  Trusted
                </p>
              </div>

            </section>

          </>
        )}

      </main>

      {/* CHECKOUT BAR */}

      {items.length > 0 && (

        <div className="cart-checkout-bar">

          <div className="cart-checkout-inner">

            <div className="cart-checkout-total">

              <p>
                Total
              </p>

              <strong>
                ₹
                {Number(total).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="cart-continue-btn"
            >
              Continue →
            </button>

          </div>

        </div>

      )}

    </div>
  );
}