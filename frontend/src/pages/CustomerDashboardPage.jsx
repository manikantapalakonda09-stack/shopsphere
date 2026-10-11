import React, { useState, useEffect } from 'react';
import { orderApi, supportApi, authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { 
  User, Package, Heart, Headset, Clock, Truck, 
  Check, AlertCircle, ShoppingBag, Plus, ArrowRight 
} from 'lucide-react';

const CustomerDashboardPage = ({ initialTab = 'orders', onNavigate, onSelectProduct }) => {
  const { user, isAuthenticated } = useAuth();
  const { wishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Return request modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState(null);
  const [returnSellerOrderId, setReturnSellerOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState('');

  // Support ticket modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState('MEDIUM');

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const [ordRes, tickRes] = await Promise.allSettled([
        orderApi.getMyOrders(),
        supportApi.getMyTickets(),
      ]);

      if (ordRes.status === 'fulfilled') setOrders(ordRes.value.data || []);
      if (tickRes.status === 'fulfilled') setTickets(tickRes.value.data || []);
    } catch (err) {
      console.error('Error loading customer dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomerData();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleOpenReturnModal = (orderId, sellerOrderId) => {
    setReturnOrderId(orderId);
    setReturnSellerOrderId(sellerOrderId);
    setReturnReason('');
    setShowReturnModal(true);
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    try {
      await supportApi.requestReturn({
        orderId: returnOrderId,
        sellerOrderId: returnSellerOrderId,
        reason: returnReason,
      });
      alert('Return request submitted successfully. A support agent will review within 24 hours.');
      setShowReturnModal(false);
      loadCustomerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit return request');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await supportApi.createTicket({
        subject: ticketSubject,
        description: ticketDesc,
        priority: ticketPriority,
      });
      alert('Support ticket opened successfully!');
      setShowTicketModal(false);
      setTicketSubject('');
      setTicketDesc('');
      loadCustomerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit ticket');
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPED': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'PACKED': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CANCELLED': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Profile Summary */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-2xl text-brand-300">
            {user?.fullName?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-3 py-0.5 rounded-full text-[11px] font-bold border border-blue-400/30 mb-1">
              <User className="w-3 h-3" />
              <span>Verified Customer Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{user?.fullName}</h1>
            <p className="text-xs text-slate-300">{user?.email} • {orders.length} Multi-Vendor Orders Placed</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('catalog')}
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop More Products</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'orders', label: `My Orders (${orders.length})` },
          { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})` },
          { id: 'tickets', label: `Support Tickets (${tickets.length})` },
          { id: 'profile', label: 'Shipping & Profile' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600 bg-brand-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <Package className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="text-lg font-bold text-slate-800">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore thousands of items from independent merchants and enjoy single checkout with automated order splitting.
              </p>
              <button
                onClick={() => onNavigate('catalog')}
                className="bg-brand-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-brand-700 transition inline-flex items-center gap-2"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Master Order Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 font-mono">MASTER ORDER: {order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.sellerOrders?.length || 1} Independent Seller Packages
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 text-[11px]">Total Paid: </span>
                    <span className="font-black text-sm text-slate-900">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Sub-Orders List (Multi-Vendor Architecture in Action) */}
                <div className="p-6 space-y-6">
                  {order.sellerOrders?.map((so) => (
                    <div key={so.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{so.sellerStoreName}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-800 font-mono font-bold px-2 py-0.5 rounded">
                              Sub-Order: {so.sellerOrderNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-cyan-600" />
                            <span>Carrier Tracking Number: </span>
                            <strong className="font-mono text-slate-800">{so.trackingNumber || 'Pending Courier Pickup'}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(so.status)}`}>
                            {so.status}
                          </span>
                          <button
                            onClick={() => handleOpenReturnModal(order.id, so.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-semibold"
                          >
                            Return / Refund
                          </button>
                        </div>
                      </div>

                      {/* Sub-order items */}
                      <div className="space-y-2">
                        {so.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                            <span>{item.quantity}x {item.productName}</span>
                            <span className="font-semibold">{formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking progression visual */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
                          <span>Confirmed</span>
                          <span>Packed</span>
                          <span>In Transit</span>
                          <span>Delivered</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-600 h-full rounded-full transition-all duration-500"
                            style={{
                              width: so.status === 'DELIVERED' ? '100%' :
                                     so.status === 'SHIPPED' ? '70%' :
                                     so.status === 'PACKED' ? '40%' : '15%'
                            }}
                          ></div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Your Saved Items</h3>
            <span className="text-xs text-slate-500">{wishlist.length} Products Saved</span>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Heart className="w-12 h-12 mx-auto text-slate-300" />
              <h4 className="font-bold text-base text-slate-800">Your Wishlist is Empty</h4>
              <p className="text-xs text-slate-500">Click the heart icon on any product to save it for later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {wishlist.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  onSelectSeller={(sellerId) => onNavigate('catalog', { sellerId })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Customer Support Tickets</h3>
              <p className="text-xs text-slate-500">Submit inquiries regarding orders, refunds, or vendor disputes.</p>
            </div>
            <button
              onClick={() => setShowTicketModal(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </button>
          </div>

          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No support tickets opened.</p>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900">{t.subject}</h4>
                    <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{t.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Priority: <strong>{t.priority}</strong></span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-150 max-w-xl">
          <h3 className="text-base font-bold text-slate-900">Shipping & Account Details</h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold mb-0.5">Full Name</span>
              <p className="font-bold text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-200">{user?.fullName}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-0.5">Email</span>
              <p className="font-bold text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-200">{user?.email}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-0.5">Contact Phone</span>
              <p className="font-bold text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-200">{user?.phone || '+91 9876543210'}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-0.5">Primary Delivery Address</span>
              <p className="font-bold text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {user?.shippingAddress || '42 Innovation Boulevard, Tech Park'}, {user?.city || 'Bengaluru'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RETURN REQUEST MODAL */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">Submit Return Request</h4>
            <p className="text-xs text-slate-500">Specify why you wish to return items from this sub-order.</p>

            <form onSubmit={handleSubmitReturn} className="space-y-3">
              <textarea
                rows="3"
                required
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Item defective, incorrect size, or differs from description..."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              ></textarea>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Submit Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TICKET MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">Open Support Ticket</h4>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Courier tracking status delayed"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Details *</label>
                <textarea
                  rows="3"
                  required
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboardPage;
