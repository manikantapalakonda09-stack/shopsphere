import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, Trash2, ArrowRight, Store, Truck, 
  ShieldCheck, ArrowLeft, AlertCircle, Sparkles 
} from 'lucide-react';

const CartPage = ({ onNavigate, onOpenAuth }) => {
  const { cart, loading, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Unified Shopping Cart</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Sign in to view your multi-vendor cart, preserve items across devices, and experience automated order splitting.
        </p>
        <button
          onClick={onOpenAuth}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition"
        >
          Sign In or Switch to Demo Customer
        </button>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explore products from our verified independent sellers and add items to your cart.
        </p>
        <button
          onClick={() => onNavigate('catalog')}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition inline-flex items-center gap-2"
        >
          <span>Explore Marketplace Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Group cart items by seller
  const itemsBySeller = items.reduce((acc, item) => {
    const key = item.sellerStoreName || `Seller #${item.sellerId}`;
    if (!acc[key]) {
      acc[key] = {
        sellerId: item.sellerId,
        sellerName: key,
        items: [],
        subtotal: 0,
      };
    }
    acc[key].items.push(item);
    acc[key].subtotal += Number(item.subtotal || (item.unitPrice * item.quantity));
    return acc;
  }, {});

  const sellerCount = Object.keys(itemsBySeller).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Unified Multi-Vendor Cart
            </h1>
            <span className="bg-brand-50 text-brand-700 font-bold px-2.5 py-0.5 rounded-full text-xs border border-brand-200">
              {totalItems} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Items from <strong className="text-slate-700">{sellerCount} independent seller{sellerCount > 1 ? 's' : ''}</strong> will be split into individual packages at checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition"
          >
            Clear Entire Cart
          </button>
        </div>
      </div>

      {/* Multi-Vendor Architectural Notification Banner */}
      {sellerCount > 1 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-bold text-blue-900">
              Smart Order Division Active ({sellerCount} Sellers)
            </p>
            <p className="leading-relaxed">
              You are ordering from multiple merchants in a single checkout. Our order orchestrator will automatically create <strong>{sellerCount} separate sub-orders</strong>, assign distinct tracking identifiers, and ensure independent seller inventory deduction.
            </p>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items Grouped by Seller */}
        <div className="lg:col-span-8 space-y-6">
          {Object.entries(itemsBySeller).map(([sellerName, group]) => (
            <div 
              key={sellerName}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Seller Sub-Header */}
              <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900">{sellerName}</span>
                    <span className="text-[10px] text-slate-400 block sm:inline sm:ml-2">
                      Package 1 of {sellerCount} • Dispatched directly by merchant
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-400 text-[11px]">Subtotal: </span>
                  <span className="font-bold text-slate-900">{formatPrice(group.subtotal)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 p-6 space-y-4">
                {group.items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Item Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200'}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-100 bg-slate-50"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 hover:text-brand-600 transition cursor-pointer">
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>Unit: {formatPrice(item.unitPrice)}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">In Stock</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Removal Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1);
                            } else {
                              removeItem(item.id);
                            }
                          }}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 text-xs font-bold text-slate-800 min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="font-extrabold text-sm text-slate-900 block">
                          {formatPrice(item.subtotal || (item.unitPrice * item.quantity))}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Right: Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal ({totalItems})</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Standard Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes (GST Included)</span>
                <span className="font-semibold text-slate-900">₹0</span>
              </div>
              <div className="flex justify-between text-slate-500 pt-1">
                <span>Independent Seller Packages</span>
                <span className="font-bold text-brand-600">{sellerCount} Shipments</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-baseline justify-between">
              <div>
                <span className="text-sm font-black text-slate-900 block">Grand Total</span>
                <span className="text-[10px] text-slate-400">All seller packages included</span>
              </div>
              <span className="text-2xl font-black text-brand-600">
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-brand-600/20 hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Buyer Trust Guarantees */}
            <div className="pt-2 space-y-2 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ShopSphere Escrow Protection on every item</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600" />
                <span>Carrier dispatch tracking across all sellers</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
