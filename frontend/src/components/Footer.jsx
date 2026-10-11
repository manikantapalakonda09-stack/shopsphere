import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Sparkles, Store, Headset, Lock } from 'lucide-react';

const Footer = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Multi-Vendor Architecture</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unified customer checkout with automated backend sub-order routing and independent seller fulfillment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">AI Intelligence Engine</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deep NLP sentiment consensus, seller listing copywriters, transaction fraud rules, and demand forecasting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Live Shipment Tracking</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time status transitions from dispatch to doorstep with automated partner delivery workflows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Settlement & Escrow</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated commission calculations with transparent payout ledger releases for onboarded merchants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Shop<span className="text-brand-500">Sphere</span>
                </span>
                <span className="ml-2 text-[9px] bg-brand-900/60 text-brand-300 font-bold px-1.5 py-0.5 rounded border border-brand-700 uppercase">
                  v2.0
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              ShopSphere is an enterprise-grade multi-vendor e-commerce platform built on Java 21 Spring Boot 3, MySQL 8, and modern React. Featuring secure RBAC, multi-order routing, automated dispute workflows, and practical machine intelligence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                Spring Boot 3.3.4
              </span>
              <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                MySQL 8.4
              </span>
              <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                React 18 + Vite
              </span>
            </div>
          </div>

          {/* Col 2: Marketplace Navigation */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Marketplace</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition">
                  Featured Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-white transition">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer-dashboard')} className="hover:text-white transition">
                  Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer-dashboard', { tab: 'wishlist' })} className="hover:text-white transition">
                  My Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Role Consoles */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Portals & Consoles</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-purple-400 transition flex items-center gap-1">
                  <span>Platform Admin</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('seller-dashboard')} className="hover:text-emerald-400 transition flex items-center gap-1">
                  <span>Seller Operations</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support-dashboard')} className="hover:text-amber-400 transition flex items-center gap-1">
                  <span>Support & Disputes</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('delivery-dashboard')} className="hover:text-cyan-400 transition flex items-center gap-1">
                  <span>Courier Partner Hub</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer-dashboard')} className="hover:text-blue-400 transition flex items-center gap-1">
                  <span>Customer Account</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: AI Capabilities */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">AI Engine Suite</h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>Product Discovery</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Seller Listing AI</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Review Sentiment</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>Fraud Rule Engine</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Demand Forecasting</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopSphere Marketplace. Designed for College Final-Year Full-Stack Submission.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition cursor-pointer">Security Policies</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Vendor Terms</span>
            <span className="hover:text-slate-400 transition cursor-pointer">API Docs</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
