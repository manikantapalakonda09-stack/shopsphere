import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi, couponApi, aiApi } from '../services/api';
import { 
  ShieldCheck, CreditCard, Truck, Check, ArrowRight, 
  Sparkles, AlertCircle, ShoppingBag, ArrowLeft, Tag, Lock 
} from 'lucide-react';

const CheckoutPage = ({ onNavigate }) => {
  const { cart, subtotal, totalItems, fetchCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Form states
  const [shippingName, setShippingName] = useState(user?.fullName || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '+91 9876543210');
  const [shippingAddress, setShippingAddress] = useState(user?.shippingAddress || '42 Innovation Boulevard, Tech Park');
  const [shippingCity, setShippingCity] = useState(user?.city || 'Bengaluru');
  const [shippingState, setShippingState] = useState('Karnataka');
  const [shippingZip, setShippingZip] = useState('560100');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // AI Fraud check status
  const [fraudScore, setFraudScore] = useState(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
        discountAmount = appliedCoupon.maxDiscountAmount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Format currency
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Run AI Fraud Check preview on amount change
  useEffect(() => {
    if (subtotal > 0) {
      aiApi.checkFraud({
        amount: subtotal,
        paymentMethod,
        shippingCity,
        shippingCountry: 'India',
        ipAddress: '127.0.0.1',
      }).then((res) => {
        setFraudScore(res.data);
      }).catch(() => {});
    }
  }, [subtotal, paymentMethod, shippingCity]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      const res = await couponApi.validate(couponCode.trim(), subtotal);
      setAppliedCoupon(res.data);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to place an order.');
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        shippingName,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry: 'India',
        paymentMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
      };

      const res = await orderApi.checkout(payload);
      setOrderSuccess(res.data);
      await fetchCart(); // Clears cart
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed. Please review your cart.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
        <div className="bg-emerald-500 text-white rounded-3xl p-8 text-center space-y-3 shadow-xl">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black">Order Placed Successfully!</h1>
          <p className="text-emerald-100 text-sm max-w-md mx-auto">
            Your multi-vendor order has been confirmed and divided into isolated sub-orders for each independent merchant.
          </p>
          <div className="inline-block bg-white/10 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider">
            MASTER ORDER: {orderSuccess.orderNumber}
          </div>
        </div>

        {/* Multi-Vendor Order Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Multi-Vendor Sub-Orders Generated</h2>
              <p className="text-xs text-slate-500">Each merchant fulfills and dispatches independently</p>
            </div>
            <span className="text-xs font-bold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
              {orderSuccess.sellerOrders?.length || 1} Independent Shipments
            </span>
          </div>

          <div className="space-y-4">
            {orderSuccess.sellerOrders?.map((so) => (
              <div key={so.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{so.sellerStoreName}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Sub-Order: {so.sellerOrderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Carrier Tracking: <strong className="font-mono text-slate-800">{so.trackingNumber || 'Pending Courier Pickup'}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700 block">{formatPrice(so.sellerPayableAmount || so.subtotal)}</span>
                    <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      Status: {so.status}
                    </span>
                  </div>
                </div>

                {/* Items in this sub-order */}
                <div className="space-y-2">
                  {so.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
                      <span>{item.quantity}x {item.productName}</span>
                      <span className="font-semibold text-slate-800">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500">Delivering to:</span>
              <p className="text-xs font-bold text-slate-800">
                {orderSuccess.shippingName} • {orderSuccess.shippingAddress}, {orderSuccess.shippingCity} ({orderSuccess.shippingZip})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('customer-dashboard')}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition"
              >
                Go to Order Tracking
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition"
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD CHECKOUT FORM
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 mb-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Order Division
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Shipping & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>1. Delivery & Recipient Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="Alice Sharma"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Suite / Landmark *</label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="42 Innovation Boulevard, Tech Park"
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={shippingState}
                  onChange={(e) => setShippingState(e.target.value)}
                  placeholder="Karnataka"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={shippingZip}
                  onChange={(e) => setShippingZip(e.target.value)}
                  placeholder="560100"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>2. Secure Payment Gateway</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
                { id: 'UPI', label: 'UPI / QR', icon: '⚡' },
                { id: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
                { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === pm.id
                      ? 'border-brand-600 bg-brand-50/50 text-brand-700 font-bold shadow-sm ring-1 ring-brand-500'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{pm.icon}</span>
                  <span className="text-xs">{pm.label}</span>
                </button>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Funds are placed in <strong>ShopSphere Escrow</strong> and only disbursed to independent sellers following confirmed delivery.
              </span>
            </div>
          </div>

          {/* AI Fraud Rule Pre-Flight Score */}
          {fraudScore && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-purple-900">AI Transaction Safety Verification</h4>
                  <p className="text-[11px] text-purple-700">
                    Risk Assessment: <strong>{fraudScore.riskLevel || 'LOW RISK'}</strong> • Machine Confidence: {((1 - (fraudScore.fraudScore || 0.05)) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-full border border-emerald-300">
                PASSED
              </span>
            </div>
          )}

        </div>

        {/* Right: Summary & Order Division Preview */}
        <div className="lg:col-span-5 space-y-5 sticky top-24">
          
          {/* Coupon Code Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-brand-600" />
              <span>Promotional Coupon Code</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME10 or FESTIVE20"
                className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:bg-slate-200"
              >
                {couponLoading ? 'Checking...' : 'Apply'}
              </button>
            </div>

            {couponError && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {couponError}
              </p>
            )}

            {appliedCoupon && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between font-medium">
                <span>Applied: <strong>{appliedCoupon.code}</strong> ({appliedCoupon.discountValue}% OFF)</span>
                <button
                  type="button"
                  onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                  className="text-emerald-700 hover:text-rose-600 text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Details
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-baseline justify-between">
              <div>
                <span className="text-sm font-black text-slate-900 block">Total Payable</span>
                <span className="text-[10px] text-slate-400">All seller taxes included</span>
              </div>
              <span className="text-2xl font-black text-brand-600">
                {formatPrice(finalTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || subtotal <= 0}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-brand-600/20 hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Dividing & Processing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-500 text-center">
              By confirming, you agree to ShopSphere's Buyer Protection Guarantee & Multi-Vendor Merchant Policies.
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};

export default CheckoutPage;
