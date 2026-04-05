import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartPulse, setCartPulse] = useState(0);

  const addToCart = useCallback((menuItem) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.menuId === menuItem.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          menuId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity: 1,
        },
      ];
    });
    setCartPulse((p) => p + 1);
  }, []);

  const setQuantity = useCallback((menuId, quantity) => {
    const q = Math.max(0, Math.floor(Number(quantity) || 0));
    setItems((prev) => {
      if (q === 0) return prev.filter((x) => x.menuId !== menuId);
      return prev.map((x) =>
        x.menuId === menuId ? { ...x, quantity: q } : x
      );
    });
  }, []);

  const removeItem = useCallback((menuId) => {
    setItems((prev) => prev.filter((x) => x.menuId !== menuId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((s, x) => s + x.price * x.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      setQuantity,
      removeItem,
      clearCart,
      total,
      count: items.reduce((s, x) => s + x.quantity, 0),
      cartPulse,
    }),
    [items, addToCart, setQuantity, removeItem, clearCart, total, cartPulse]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
