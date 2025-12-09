import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import { CartItem } from "./types";

export default function App(){
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(product: any, quantity = 1){
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        return prev.map(i => i.product.id === product.id ? {...i, quantity: i.quantity + quantity} : i);
      }
      return [...prev, {product, quantity}];
    });
  }
  function removeFromCart(productId: number){
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }
  function clearCart(){
    setCart([]);
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">Madame Selido</Link>
          <nav className="space-x-4">
            <Link to="/products" className="hover:underline">Produtos</Link>
            <Link to="/admin" className="hover:underline">Admin</Link>
            <Link to="/cart" className="bg-pink-600 text-white px-3 py-1 rounded">Carrinho ({cart.length})</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}
