import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "quickseva_cart";

/* =========================================================
   HELPERS
========================================================= */

const toNumber = (value) => {
  if (typeof value === "string") {
    const cleaned = value.replace(/[₹,\s]/g, "");
    const number = Number(cleaned);

    return Number.isFinite(number) ? number : 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const normalizeQty = (value) => {
  const qty = Math.floor(toNumber(value));

  return qty > 0 ? qty : 1;
};

const getItemKey = (item) => {
  if (!item) return null;

  const key =
    item.id ||
    item.serviceId ||
    item.key ||
    item.label ||
    item.name ||
    item.title;

  if (!key) return null;

  return String(key).trim();
};

const normalizeItem = (item) => {
  if (!item) return null;

  const label = String(
    item.label ||
      item.name ||
      item.title ||
      item.subService ||
      "Service"
  ).trim();

  const key = getItemKey({
    ...item,
    label,
  });

  if (!key) {
    return null;
  }

  const price = toNumber(
    item.price ??
      item.amount ??
      item.servicePrice ??
      0
  );

  const qty = normalizeQty(
    item.qty ??
      item.quantity ??
      1
  );

  return {
    ...item,

    id: item.id || key,
    key,

    label,
    name: item.name || label,

    price,
    qty,
  };
};

const normalizeCart = (savedCart) => {
  if (!savedCart || typeof savedCart !== "object") {
    return {};
  }

  const normalizedCart = {};

  Object.values(savedCart).forEach((item) => {
    const normalized = normalizeItem(item);

    if (!normalized) {
      return;
    }

    const existing = normalizedCart[normalized.key];

    if (existing) {
      normalizedCart[normalized.key] = {
        ...existing,
        qty:
          normalizeQty(existing.qty) +
          normalizeQty(normalized.qty),
      };
    } else {
      normalizedCart[normalized.key] = normalized;
    }
  });

  return normalizedCart;
};

/* =========================================================
   CART PROVIDER
========================================================= */

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

      if (!savedCart) {
        return {};
      }

      const parsed = JSON.parse(savedCart);

      return normalizeCart(parsed);
    } catch (error) {
      console.error(
        "QuickSeva: Unable to load cart",
        error
      );

      return {};
    }
  });

  /* =======================================================
     SAVE CART
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "QuickSeva: Unable to save cart",
        error
      );
    }
  }, [cart]);

  /* =======================================================
     ADD ITEM
  ======================================================= */

  const addItem = (item) => {
    const normalized = normalizeItem(item);

    if (!normalized) {
      console.warn(
        "QuickSeva: Invalid cart item",
        item
      );

      return null;
    }

    setCart((currentCart) => {
      const existing =
        currentCart[normalized.key];

      if (existing) {
        return {
          ...currentCart,

          [normalized.key]: {
            ...existing,

            qty:
              normalizeQty(existing.qty) +
              normalizeQty(normalized.qty),
          },
        };
      }

      return {
        ...currentCart,
        [normalized.key]: normalized,
      };
    });

    return normalized.key;
  };

  /* =======================================================
     DECREASE ITEM
  ======================================================= */

  const decreaseItem = (itemKey) => {
    const key = String(itemKey || "").trim();

    if (!key) return;

    setCart((currentCart) => {
      const existing = currentCart[key];

      if (!existing) {
        return currentCart;
      }

      const currentQty = normalizeQty(
        existing.qty
      );

      if (currentQty <= 1) {
        const updatedCart = {
          ...currentCart,
        };

        delete updatedCart[key];

        return updatedCart;
      }

      return {
        ...currentCart,

        [key]: {
          ...existing,
          qty: currentQty - 1,
        },
      };
    });
  };

  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeItem = (itemKey) => {
    const key = String(itemKey || "").trim();

    if (!key) return;

    setCart((currentCart) => {
      if (!currentCart[key]) {
        return currentCart;
      }

      const updatedCart = {
        ...currentCart,
      };

      delete updatedCart[key];

      return updatedCart;
    });
  };

  /* =======================================================
     SET QUANTITY
  ======================================================= */

  const setItemQty = (itemKey, quantity) => {
    const key = String(itemKey || "").trim();

    if (!key) return;

    const qty = Math.floor(
      toNumber(quantity)
    );

    setCart((currentCart) => {
      const existing = currentCart[key];

      if (!existing) {
        return currentCart;
      }

      if (qty <= 0) {
        const updatedCart = {
          ...currentCart,
        };

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

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setCart({});
  };

  /* =======================================================
     TOTAL
  ======================================================= */

  const total = useMemo(() => {
    return Object.values(cart).reduce(
      (sum, item) => {
        const price = toNumber(item.price);
        const qty = normalizeQty(item.qty);

        return sum + price * qty;
      },
      0
    );
  }, [cart]);

  /* =======================================================
     ITEM COUNT
  ======================================================= */

  const itemCount = useMemo(() => {
    return Object.values(cart).reduce(
      (sum, item) => {
        return sum + normalizeQty(item.qty);
      },
      0
    );
  }, [cart]);

  /* =======================================================
     UNIQUE ITEM COUNT
  ======================================================= */

  const uniqueItemCount = useMemo(() => {
    return Object.keys(cart).length;
  }, [cart]);

  /* =======================================================
     ITEMS ARRAY
  ======================================================= */

  const items = useMemo(() => {
    return Object.values(cart);
  }, [cart]);

  /* =======================================================
     EMPTY
  ======================================================= */

  const isEmpty = uniqueItemCount === 0;

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
    cart,
    items,

    addItem,
    decreaseItem,
    removeItem,
    setItemQty,
    clearCart,

    total,
    itemCount,
    uniqueItemCount,

    isEmpty,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

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