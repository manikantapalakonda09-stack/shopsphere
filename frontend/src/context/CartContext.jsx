import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user || !user.customerId) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.get();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartApi.addItem(productId, quantity);
    setCart(res.data);
    return res.data;
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(cartItemId);
    }
    const res = await cartApi.updateQuantity(cartItemId, quantity);
    setCart(res.data);
    return res.data;
  };

  const removeItem = async (cartItemId) => {
    const res = await cartApi.removeItem(cartItemId);
    setCart(res.data);
    return res.data;
  };

  const clearCart = async () => {
    await cartApi.clear();
    setCart((prev) => (prev ? { ...prev, items: [], totalItems: 0, subtotal: 0 } : { items: [], totalItems: 0, subtotal: 0 }));
  };

  const totalItems = cart && cart.items ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  const subtotal = cart && cart.subtotal ? cart.subtotal : 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      totalItems,
      subtotal,
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
