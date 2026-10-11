import React, { useState, useEffect } from 'react';
import { sellerApi, categoryApi, aiApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AiDescriptionModal from '../components/AiDescriptionModal';
import { 
  Store, DollarSign, Package, AlertCircle, Sparkles, 
  Plus, Edit2, Trash2, Check, RefreshCw, 
  Truck, Star 
} from 'lucide-react';

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [demandPredictions, setDemandPredictions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Product Add / Edit Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodHighlights, setProdHighlights] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');

  // AI Description Assistant Modal
  const [showAiModal, setShowAiModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodsRes, ordersRes, catRes, settRes] = await Promise.allSettled([
        sellerApi.getDashboard(),
        sellerApi.getProducts(),
        sellerApi.getOrders(),
        categoryApi.getAll(),
        sellerApi.getSettlements(),
      ]);

      if (statsRes.status === 'fulfilled') {
        const st = statsRes.value.data;
        setStats(st);
        if (st.sellerId) {
          aiApi.getDemandPrediction(st.sellerId)
            .then((res) => setDemandPredictions(res.data || []))
            .catch(() => {});
        }
      }
      if (prodsRes.status === 'fulfilled') setProducts(prodsRes.value.data || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data || []);
      if (catRes.status === 'fulfilled') {
        const cats = catRes.value.data || [];
        setCategories(cats);
        if (cats.length > 0 && !prodCategoryId) setProdCategoryId(cats[0].id);
      }
      if (settRes.status === 'fulfilled') setSettlements(settRes.value.data || []);
    } catch (err) {
      console.error('Error loading seller dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdDesc('');
    setProdHighlights('');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdStock('');
    setProdSku(`SKU-${Date.now().toString().slice(-6)}`);
    setProdImageUrl('');
    setShowProductModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProductId(p.id);
    setProdCategoryId(p.categoryId);
    setProdName(p.name);
    setProdDesc(p.description || '');
    setProdHighlights(p.highlights || '');
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice || '');
    setProdStock(p.stockQuantity);
    setProdSku(p.sku);
    setProdImageUrl(p.primaryImageUrl || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        categoryId: Number(prodCategoryId),
        name: prodName,
        description: prodDesc,
        highlights: prodHighlights,
        price: Number(prodPrice),
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : Number(prodPrice),
        discountPercent: prodOriginalPrice && Number(prodOriginalPrice) > Number(prodPrice)
          ? Math.round(((Number(prodOriginalPrice) - Number(prodPrice)) / Number(prodOriginalPrice)) * 100)
          : 0,
        sku: prodSku,
        stockQuantity: Number(prodStock),
        lowStockThreshold: 5,
        imageUrls: prodImageUrl ? [prodImageUrl] : [],
      };

      if (editingProductId) {
        await sellerApi.updateProduct(editingProductId, payload);
        showToast('Product listing updated successfully!');
      } else {
        await sellerApi.createProduct(payload);
        showToast('New product listed successfully on ShopSphere!');
      }

      setShowProductModal(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await sellerApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product listing removed from your active catalog');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await sellerApi.updateOrderStatus(orderId, newStatus);
      showToast(`Sub-order marked as ${newStatus}`);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const handleApplyAiCopy = (copyData) => {
    if (copyData.name) setProdName(copyData.name);
    if (copyData.description) setProdDesc(copyData.description);
    if (copyData.highlights) setProdHighlights(copyData.highlights);
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
          toast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <Check className="w-4 h-4 text-emerald-600" />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 font-black ml-4">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/30">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Merchant Operations Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {stats?.storeName || 'Seller Portal'}
          </h1>
          <p className="text-xs text-slate-300">
            Manage your store catalog, fulfill incoming sub-orders, access AI copywriters, and view predictive demand analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Store Overview' },
          { id: 'products', label: `Catalog & Inventory (${products.length})` },
          { id: 'orders', label: `Incoming Sub-Orders (${orders.length})` },
          { id: 'ai-demand', label: 'AI Demand Prediction' },
          { id: 'settlements', label: 'Settlements & Escrow' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Total Store Sales</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {formatPrice(stats?.totalSales || 0)}
              </div>
              <div className="text-[11px] text-slate-400">Total gross customer orders</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Pending Fulfillment</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600">
                {stats?.pendingOrders || 0}
              </div>
              <div className="text-[11px] text-amber-700 font-semibold">
                Requires packing or courier dispatch
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Active Listings</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Store className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stats?.totalProducts || 0}
              </div>
              <div className="text-[11px] text-slate-400">Published in marketplace</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Escrow Payout Released</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-purple-700">
                {formatPrice(stats?.releasedSettlementAmount || 0)}
              </div>
              <div className="text-[11px] text-slate-400">Deposited into vendor bank</div>
            </div>
          </div>

          {/* Low Stock Warning Card */}
          {stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Inventory Alert: {stats.lowStockAlerts.length} Products Running Critically Low</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {stats.lowStockAlerts.map((p) => (
                  <div key={p.id} className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 truncate max-w-[180px]">{p.name}</p>
                      <p className="text-slate-400 text-[10px]">SKU: {p.sku}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-900 font-extrabold px-2 py-1 rounded">
                      {p.stockQuantity} Left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Day Revenue Velocity Trend */}
          {stats?.salesTrend && stats.salesTrend.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">7-Day Sales Revenue Velocity</h3>
                  <p className="text-xs text-slate-500">Daily store gross revenue trajectory</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Daily Settlement Tracking
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-2">
                {stats.salesTrend.map((dp, idx) => (
                  <div key={idx} className="flex flex-col items-center bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-400 font-semibold mb-1">{dp.date}</span>
                    <span className="text-xs font-black text-slate-900">
                      {formatPrice(dp.sales)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Product Listings</h3>
              <p className="text-xs text-slate-500">Manage pricing, stock counts, and AI-assisted catalog descriptions.</p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Stock Qty</th>
                  <th className="py-3 px-4">Total Sold</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.primaryImageUrl || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100'}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100 bg-slate-50"
                        />
                        <div>
                          <p className="font-bold text-slate-900 max-w-xs truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{p.categoryName}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        p.stockQuantity <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{p.totalSales || 0}</td>
                    <td className="py-3 px-4 font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{p.averageRating > 0 ? p.averageRating.toFixed(1) : 'New'}</span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INCOMING SUB-ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Fulfillable Sub-Orders</h3>
            <p className="text-xs text-slate-500">
              Orders placed by customers automatically split to your store queue. Update status to trigger tracking for couriers.
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">SUB-ORDER: {o.sellerOrderNumber}</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                        Master: {o.masterOrderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Carrier Tracking: <strong className="font-mono text-slate-700">{o.trackingNumber || 'Pending Pickup'}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="text-slate-400 text-[10px] block">Net Payable to Store</span>
                      <span className="font-black text-emerald-700 text-sm">{formatPrice(o.sellerPayableAmount || o.subtotal)}</span>
                    </div>
                    <span className="bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold px-3 py-1 rounded-xl">
                      {o.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                  {o.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-700">
                      <span>{item.quantity}x {item.productName}</span>
                      <span className="font-semibold">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping info and status actions */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500">
                    <span>Shipping to: </span>
                    <strong className="text-slate-800">{o.customerName}</strong> ({o.shippingAddress}, {o.shippingCity})
                  </div>

                  <div className="flex items-center gap-2">
                    {o.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'PACKED')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Mark as Packed
                      </button>
                    )}
                    {o.status === 'PACKED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'SHIPPED')}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Hand Over to Courier (Shipped)
                      </button>
                    )}
                    {o.status === 'SHIPPED' && (
                      <span className="text-cyan-700 font-bold bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>In Delivery Partner Hands</span>
                      </span>
                    )}
                    {o.status === 'DELIVERED' && (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Delivered to Customer</span>
                      </span>
                    )}
                    {o.status === 'RETURN_REQUESTED' && (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Customer Return Requested</span>
                      </span>
                    )}
                    {o.status === 'REFUNDED' && (
                      <span className="text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                        <span>Refund Processed</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AI DEMAND PREDICTION */}
      {activeTab === 'ai-demand' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Inventory Velocity & Demand Forecasting</h3>
              <p className="text-xs text-slate-500">
                Machine prediction of 30-day unit burn rate, projected stockout horizons, and automated restocking advice.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Current Units</th>
                  <th className="py-3 px-4">Daily Run-Rate</th>
                  <th className="py-3 px-4">30-Day Forecast</th>
                  <th className="py-3 px-4">Days to Stockout</th>
                  <th className="py-3 px-4">Urgency Tier</th>
                  <th className="py-3 px-4">AI Restock Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {demandPredictions.map((dp) => (
                  <tr key={dp.productId} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{dp.productName}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{dp.currentStock} units</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{dp.dailyRunRate} / day</td>
                    <td className="py-3 px-4 font-bold text-brand-600">{dp.projectedSalesNext30Days} units</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        dp.estimatedDaysUntilStockout <= 7 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {dp.estimatedDaysUntilStockout} days
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        dp.demandTier === 'HIGH_DEMAND'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {dp.demandTier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 italic max-w-sm">
                      {dp.stockRecommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SETTLEMENTS & ESCROW */}
      {activeTab === 'settlements' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Settlement Ledger</h3>
            <p className="text-xs text-slate-500">
              Escrow funds released directly to your account after delivery confirmation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Sub-Order #</th>
                  <th className="py-3 px-4">Gross Customer Paid</th>
                  <th className="py-3 px-4">Platform Fee (10%)</th>
                  <th className="py-3 px-4">Net Store Payout</th>
                  <th className="py-3 px-4">Escrow Status</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settlements.map((sett) => (
                  <tr key={sett.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{sett.sellerOrderNumber}</td>
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
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {sett.transactionReference || 'PENDING_RELEASE'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT CREATE / EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingProductId ? 'Edit Product Listing' : 'List New Product on ShopSphere'}
                </h3>
                <p className="text-xs text-slate-500">Fill in product information and inventory count</p>
              </div>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-brand-900">ShopSphere AI Copywriter</h4>
                  <p className="text-[11px] text-brand-700">Auto-generate title, description, and keywords</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition"
              >
                Use AI Assistant &rarr;
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={prodCategoryId}
                    onChange={(e) => setProdCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU / Code *</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="19999"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">MRP / Original Price (₹)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    placeholder="24999"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="25"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Highlights</label>
                <input
                  type="text"
                  value={prodHighlights}
                  onChange={(e) => setProdHighlights(e.target.value)}
                  placeholder="Industry-leading noise cancellation | 30h battery | Multipoint pairing"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows="3"
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Detailed description of features, materials, and warranty..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm transition"
                >
                  {editingProductId ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      <AiDescriptionModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApplyContent={handleApplyAiCopy}
        currentTitle={prodName}
        categoryName={categories.find(c => c.id === Number(prodCategoryId))?.name || ''}
      />

    </div>
  );
};

export default SellerDashboardPage;
