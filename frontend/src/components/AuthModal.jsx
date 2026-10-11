import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Store, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, registerCustomer, registerSeller } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Customer register state
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCity, setCustCity] = useState('');

  // Seller register state
  const [sellerOwnerName, setSellerOwnerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [sellerStoreName, setSellerStoreName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerDesc, setSellerDesc] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [sellerTaxId, setSellerTaxId] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerCustomer({
        fullName: custName,
        email: custEmail,
        password: custPassword,
        phone: custPhone,
        shippingAddress: custAddress,
        city: custCity,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSellerRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerSeller({
        fullName: sellerOwnerName,
        email: sellerEmail,
        password: sellerPassword,
        storeName: sellerStoreName,
        phone: sellerPhone,
        storeDescription: sellerDesc,
        businessAddress: sellerAddress,
        taxId: sellerTaxId,
      });
      alert('Seller account created! Awaiting Platform Admin verification.');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Seller registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 relative">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition ${
              tab === 'login'
                ? 'border-brand-600 text-brand-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition ${
              tab === 'register'
                ? 'border-brand-600 text-brand-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Customer Sign Up
          </button>
          <button
            onClick={() => { setTab('seller'); setError(''); }}
            className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition ${
              tab === 'seller'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sell on ShopSphere
          </button>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-700 transition absolute right-1 top-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. customer@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to ShopSphere'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Tip: Use the top <span className="font-bold text-slate-700">Demo Switcher</span> bar for instant 1-click test role logins!
                </p>
              </div>
            </form>
          )}

          {/* CUSTOMER REGISTER TAB */}
          {tab === 'register' && (
            <form onSubmit={handleCustomerRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Alice Sharma"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="alice@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Shipping Address</label>
                <input
                  type="text"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  placeholder="Street / Apt details"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm transition"
              >
                {loading ? 'Creating Account...' : 'Create Customer Account'}
              </button>
            </form>
          )}

          {/* SELLER REGISTER TAB */}
          {tab === 'seller' && (
            <form onSubmit={handleSellerRegister} className="space-y-3.5">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                Join ShopSphere as an independent merchant. Sell products, manage inventory, and receive automated settlements.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={sellerOwnerName}
                    onChange={(e) => setSellerOwnerName(e.target.value)}
                    placeholder="Rajesh Kumar"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={sellerStoreName}
                    onChange={(e) => setSellerStoreName(e.target.value)}
                    placeholder="Apex Electronics"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    placeholder="seller@store.com"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={sellerPassword}
                    onChange={(e) => setSellerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tax ID / GSTIN</label>
                  <input
                    type="text"
                    value={sellerTaxId}
                    onChange={(e) => setSellerTaxId(e.target.value)}
                    placeholder="GSTIN29AAAAA0000A1Z5"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store Description</label>
                <textarea
                  rows="2"
                  value={sellerDesc}
                  onChange={(e) => setSellerDesc(e.target.value)}
                  placeholder="What products does your brand specialize in?"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm transition"
              >
                {loading ? 'Submitting Application...' : 'Apply for Seller Account'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default AuthModal;
