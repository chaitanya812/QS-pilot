import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "quickseva_cart";

/**
 * Safely convert a value to a positive number.
 */
const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

/**
 * Create a stable key for a cart item.
 * We prefer id/key, then label/name.
 */
const getItemKey = (item) => {
  if (!item) return null;

  return String(
    item.id ||
      item.key ||
      item.serviceId ||
      item.label ||
      item.name ||
      ""
  ).trim();
};

/**
 * Normalize an item before putting it into the cart.
 */
const normalizeItem = (item) => {
  if (!item) return null;

  const label = String(
    item.label || item.name || item.title || "Service"
  ).trim();

  const price = toNumber(
    item.price ?? item.amount ?? item.servicePrice ?? 0
  );

  const qty = Math.max(
    1,
    Math.floor(toNumber(item.qty ?? item.quantity ?? 1))
  );

  const key = getItemKey({
    ...item,
    label,
  });

  if (!key) return null;

  return {
    ...item,
    key,
    label,
    name: item.name || label,
    price,
    qty,
  };
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return {};
      }

      const parsed = JSON.parse(savedCart);

      if (!parsed || typeof parsed !== "object") {
        return {};
      }

      const normalizedCart = {};

      Object.values(parsed).forEach((item) => {
        const normalized = normalizeItem(item);

        if (normalized) {
          normalizedCart[normalized.key] = normalized;
        }
      });

      return normalizedCart;
    } catch (error) {
      console.error("Unable to load cart:", error);
      return {};
    }
  });

  /**
   * Save cart whenever it changes.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cart]);

  /**
   * Add service to cart.
   *
   * If the service already exists, quantity increases.
   * IMPORTANT: We preserve the existing price instead of replacing
   * it with a default price.
   */
  const addItem = (item) => {
    const normalized = normalizeItem(item);

    if (!normalized) {
      console.warn("Invalid cart item:", item);
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart[normalized.key];

      if (existing) {
        return {
          ...currentCart,
          [normalized.key]: {
            ...existing,
            qty: existing.qty + 1,
          },
        };
      }

      return {
        ...currentCart,
        [normalized.key]: normalized,
      };
    });
  };

  /**
   * Decrease quantity.
   */
  const decreaseItem = (itemKey) => {
    const key = String(itemKey || "").trim();

    if (!key) return;

    setCart((currentCart) => {
      const existing = currentCart[key];

      if (!existing) {
        return currentCart;
      }

      if (existing.qty <= 1) {
        const updatedCart = { ...currentCart };
        delete updatedCart[key];
        return updatedCart;
      }

      return {
        ...currentCart,
        [key]: {
          ...existing,
          qty: existing.qty - 1,
        },
      };
    });
  };

  /**
   * Remove item completely.
   */
  const removeItem = (itemKey) => {
    const key = String(itemKey || "").trim();

    if (!key) return;

    setCart((currentCart) => {
      if (!currentCart[key]) {
        return currentCart;
      }

      const updatedCart = { ...currentCart };
      delete updatedCart[key];

      return updatedCart;
    });
  };

  /**
   * Set exact quantity.
   */
  const setItemQty = (itemKey, quantity) => {
    const key = String(itemKey || "").trim();
    const qty = Math.floor(toNumber(quantity));

    if (!key) return;

    setCart((currentCart) => {
      const existing = currentCart[key];

      if (!existing) {
        return currentCart;
      }

      if (qty <= 0) {
        const updatedCart = { ...currentCart };
        delete updatedCart[key];
        return updatedCart;
      }

      return {
        ...currentCart,
        [key]: {
          ...existing,
          qty,
        },
      };
    });
  };

  /**
   * Clear entire cart.
   */
  const clearCart = () => {
    setCart({});
  };

  /**
   * Always calculate the total from current cart data.
   * There is NO hard-coded ₹2400 here.
   */
  const total = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => {
      const price = toNumber(item.price);
      const qty = toNumber(item.qty);

      return sum + price * qty;
    }, 0);
  }, [cart]);

  /**
   * Total number of services.
   */
  const itemCount = useMemo(() => {
    return Object.values(cart).reduce(
      (sum, item) => sum + toNumber(item.qty),
      0
    );
  }, [cart]);

  /**
   * Number of different service types.
   */
  const uniqueItemCount = useMemo(() => {
    return Object.keys(cart).length;
  }, [cart]);

  const value = {
    cart,
    addItem,
    decreaseItem,
    removeItem,
    setItemQty,
    clearCart,
    total,
    itemCount,
    uniqueItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
}

export default CartContext;