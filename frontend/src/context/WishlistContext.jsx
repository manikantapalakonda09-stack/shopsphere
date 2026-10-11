import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !user || !user.customerId) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistApi.get();
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await wishlistApi.remove(productId);
      setWishlist((prev) => prev.filter((p) => p.id !== productId));
    } else {
      await wishlistApi.add(productId);
      fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      isInWishlist,
      toggleWishlist,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
