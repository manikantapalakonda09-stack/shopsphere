import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = {
  ADMIN: { email: 'admin@shopsphere.com', password: 'password123', label: 'Platform Admin', role: 'ROLE_ADMIN', color: 'bg-purple-600' },
  SELLER: { email: 'seller@techhub.com', password: 'password123', label: 'Seller (TechHub)', role: 'ROLE_SELLER', color: 'bg-emerald-600' },
  CUSTOMER: { email: 'customer@gmail.com', password: 'password123', label: 'Customer (Alice)', role: 'ROLE_CUSTOMER', color: 'bg-blue-600' },
  SUPPORT: { email: 'support@shopsphere.com', password: 'password123', label: 'Support Agent', role: 'ROLE_SUPPORT', color: 'bg-amber-600' },
  DELIVERY: { email: 'delivery@fastship.com', password: 'password123', label: 'Delivery Partner', role: 'ROLE_DELIVERY', color: 'bg-cyan-600' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shopsphere_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('shopsphere_token');
      const storedUser = localStorage.getItem('shopsphere_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const authData = res.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('shopsphere_token', authData.token);
    localStorage.setItem('shopsphere_user', JSON.stringify(authData));
    return authData;
  };

  const quickDemoLogin = async (demoKey) => {
    const demo = DEMO_ACCOUNTS[demoKey];
    if (demo) {
      return await login(demo.email, demo.password);
    }
  };

  const registerCustomer = async (data) => {
    const res = await authApi.registerCustomer(data);
    const authData = res.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('shopsphere_token', authData.token);
    localStorage.setItem('shopsphere_user', JSON.stringify(authData));
    return authData;
  };

  const registerSeller = async (data) => {
    const res = await authApi.registerSeller(data);
    const authData = res.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('shopsphere_token', authData.token);
    localStorage.setItem('shopsphere_user', JSON.stringify(authData));
    return authData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
  };

  const hasRole = (role) => {
    return user && user.roles && user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      quickDemoLogin,
      registerCustomer,
      registerSeller,
      logout,
      hasRole,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
