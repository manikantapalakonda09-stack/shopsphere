import React, { useState, useEffect } from 'react';
import { adminApi, couponApi } from '../services/api';
import { 
  Shield, DollarSign, Store, ShoppingBag, AlertTriangle, 
  Check, X, Sparkles, RefreshCw, Users, CreditCard, Tag, Plus 
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [suspiciousListings, setSuspiciousListings] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('PERCENTAGE');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(1000);
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState(2000);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, sellersRes, suspRes, settRes, coupRes] = await Promise.allSettled([
        adminApi.getDashboard(),
        adminApi.getPendingSellers(),
        adminApi.getSuspiciousListings(),
        adminApi.getSettlements(),
        couponApi.getAll(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (sellersRes.status === 'fulfilled') setPendingSellers(sellersRes.value.data || []);
      if (suspRes.status === 'fulfilled') setSuspiciousListings(suspRes.value.data || []);
      if (settRes.status === 'fulfilled') setSettlements(settRes.value.data || []);
      if (coupRes.status === 'fulfilled') setCoupons(coupRes.value.data || []);
    } catch (err) {
      console.error('Error loading admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveSeller = async (id, approve) => {
    try {
      await adminApi.approveSeller(id, approve);
      alert(`Seller application has been ${approve ? 'approved' : 'rejected'}.`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating seller status');
    }
  };

  const handleModerateListing = async (id, approveFlag) => {
    try {
      await adminApi.moderateListing(id, approveFlag);
      alert(`Listing has been ${approveFlag ? 'approved' : 'taken down'}.`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error moderating listing');
    }
  };

  const handleReleaseSettlement = async (id) => {
    try {
      await adminApi.releaseSettlement(id);
      alert('Settlement escrow released to seller bank account.');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error releasing settlement');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await couponApi.create({
        code: newCouponCode.toUpperCase(),
        discountType: newCouponType,
        discountValue: Number(newCouponValue),
        minOrderAmount: Number(newCouponMinOrder),
        maxDiscountAmount: Number(newCouponMaxDiscount),
        usageLimit: 500,
        active: true,
      });
      setShowCouponModal(false);
      setNewCouponCode('');
      alert('Coupon created successfully!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await couponApi.toggleStatus(id);
      loadData();
    } catch (err) {
      alert('Failed to toggle coupon');
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-400/30">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Platform Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Admin Operations & Moderation</h1>
          <p className="text-xs text-slate-300">
            Monitor gross marketplace revenue, approve onboarding sellers, moderate AI-flagged listings, and release merchant payouts.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Metrics' },
          { id: 'sellers', label: `Seller Approvals (${pendingSellers.length})` },
          { id: 'moderation', label: `AI Listing Moderation (${suspiciousListings.length})` },
          { id: 'settlements', label: 'Escrow & Settlements' },
          { id: 'coupons', label: 'Marketplace Coupons' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-purple-600 text-purple-700 bg-purple-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Gross Marketplace Revenue</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {formatPrice(stats?.totalRevenue || 0)}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span>Total transacted GMV</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Platform Commission (10%)</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-700">
                {formatPrice(stats?.totalCommissionEarned || 0)}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                Platform net earnings
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Total Orders Placed</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stats?.totalOrders || 0}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                Split across multi-vendor sub-orders
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Registered Sellers</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Store className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stats?.totalSellers || 0}
              </div>
              <div className="text-[11px] text-amber-600 font-bold">
                {stats?.pendingSellerApprovals || 0} pending verification
              </div>
            </div>
          </div>

          {/* Top Sellers Performance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Top Performing Sellers by Revenue</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Seller Store</th>
                    <th className="py-3 px-4">Owner Name</th>
                    <th className="py-3 px-4">Orders Fulfilled</th>
                    <th className="py-3 px-4">Gross Revenue</th>
                    <th className="py-3 px-4">Platform Fee Paid</th>
                    <th className="py-3 px-4">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-brand-600" />
                      <span>TechHub Solutions</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">Vikram Malhotra</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">42 Orders</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">₹8,45,000</td>
                    <td className="py-3 px-4 text-slate-600">₹84,500</td>
                    <td className="py-3 px-4 font-bold text-amber-600">4.9 ★</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-brand-600" />
                      <span>StyleVerse Apparel</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">Priya Sharma</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">29 Orders</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">₹2,15,400</td>
                    <td className="py-3 px-4 text-slate-600">₹21,540</td>
                    <td className="py-3 px-4 font-bold text-amber-600">4.7 ★</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING SELLER APPROVALS */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">Merchant Onboarding Verification Queue</h3>
            <p className="text-xs text-slate-500">Review business registration, GSTIN, and identity before granting selling privileges.</p>
          </div>

          {pendingSellers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              No pending seller approval requests. All registered merchants are verified!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Store Name</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Tax ID / GSTIN</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Commission %</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingSellers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{s.storeName}</td>
                      <td className="py-3 px-4 text-slate-700">{s.user?.fullName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{s.taxId || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-500">{s.phone}</td>
                      <td className="py-3 px-4 font-bold text-purple-700">{s.commissionRate || 10}%</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleApproveSeller(s.id, true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveSeller(s.id, false)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI LISTING MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Product Moderation & Suspicious Flagging</h3>
              <p className="text-xs text-slate-500">Automated NLP screening for price manipulation, counterfeit claims, or policy violations.</p>
            </div>
          </div>

          {suspiciousListings.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              ✨ All listings are currently compliant. AI scanning found zero violations!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suspiciousListings.map((listing) => (
                <div key={listing.id} className="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded uppercase">
                        Flagged Listing
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{listing.name}</h4>
                      <p className="text-xs text-slate-500">Seller: {listing.sellerStoreName} • SKU: {listing.sku}</p>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">{formatPrice(listing.price)}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-rose-100 text-xs text-rose-800 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>AI Moderation Reason:</span>
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      Suspicious keyword trigger or abnormally high discount ratio exceeding safety threshold.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleModerateListing(listing.id, true)}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-4 py-1.5 rounded-lg text-xs transition"
                    >
                      Dismiss & Approve
                    </button>
                    <button
                      onClick={() => handleModerateListing(listing.id, false)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition"
                    >
                      Takedown Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTLEMENTS & ESCROW */}
      {activeTab === 'settlements' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">Escrow Payouts & Commission Reconciliation</h3>
            <p className="text-xs text-slate-500">
              Customer payments are retained in platform escrow until carrier delivers. Once delivered, release payout to seller.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Sub-Order #</th>
                  <th className="py-3 px-4">Seller Store</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Platform Fee</th>
                  <th className="py-3 px-4">Net Seller Payout</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settlements.map((sett) => (
                  <tr key={sett.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{sett.sellerOrderNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{sett.storeName}</td>
                    <td className="py-3 px-4 text-slate-800">{formatPrice(sett.grossAmount)}</td>
                    <td className="py-3 px-4 text-purple-700 font-bold">{formatPrice(sett.platformCommission)}</td>
                    <td className="py-3 px-4 font-black text-emerald-700">{formatPrice(sett.netPayable)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sett.status === 'RELEASED' || sett.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sett.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {sett.status !== 'RELEASED' && sett.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleReleaseSettlement(sett.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-xs"
                        >
                          Release Payout
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Disbursed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Promotional Discount Coupons</h3>
              <p className="text-xs text-slate-500">Configure marketplace-wide discount campaigns and usage caps.</p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleToggleCoupon(c.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.active ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>Discount: <strong>{c.discountValue}% OFF</strong></p>
                  <p>Min Order: <strong>{formatPrice(c.minOrderAmount)}</strong></p>
                  <p>Max Savings: <strong>{formatPrice(c.maxDiscountAmount)}</strong></p>
                </div>
              </div>
            ))}
          </div>

          {/* Create Coupon Modal */}
          {showCouponModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-bold text-sm text-slate-900">Create New Promo Coupon</h4>
                  <button onClick={() => setShowCouponModal(false)} className="text-slate-400 hover:text-slate-700">×</button>
                </div>

                <form onSubmit={handleCreateCoupon} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      placeholder="MEGA25"
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs uppercase font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Discount %</label>
                      <input
                        type="number"
                        required
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Min Order (₹)</label>
                      <input
                        type="number"
                        required
                        value={newCouponMinOrder}
                        onChange={(e) => setNewCouponMinOrder(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Max Discount Cap (₹)</label>
                    <input
                      type="number"
                      required
                      value={newCouponMaxDiscount}
                      onChange={(e) => setNewCouponMaxDiscount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCouponModal(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Publish Coupon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
