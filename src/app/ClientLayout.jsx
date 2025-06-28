"use client";
import { useState, createContext } from "react";

export const CartContext = global.CartContext || createContext({ cart: [], setCart: () => {} });
global.CartContext = CartContext;

export default function ClientLayout({ children }) {
  const [cart, setCart] = useState([]);
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}