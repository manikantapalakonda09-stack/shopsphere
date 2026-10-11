import React, { useState, useEffect } from 'react';
import { deliveryApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, Package, MapPin, Phone, CheckCircle, 
  Clock, RefreshCw, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';

const DeliveryDashboardPage = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notes, setNotes] = useState({});

  const loadShipments = async () => {
    try {
      setLoading(true);
      const res = await deliveryApi.getShipments();
      setShipments(res.data || []);
    } catch (err) {
      console.error('Error loading shipments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const handleUpdateStatus = async (sellerOrderId, newStatus) => {
    try {
      const deliveryNote = notes[sellerOrderId] || `Shipment marked as ${newStatus}`;
      await deliveryApi.updateStatus(sellerOrderId, {
        status: newStatus,
        deliveryNotes: deliveryNote,
      });
      alert(`Package status successfully transitioned to: ${newStatus}`);
      loadShipments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update shipment status');
    }
  };

  const filteredShipments = shipments.filter((s) => {
    if (statusFilter === 'ALL') return true;
    return s.shipmentStatus === statusFilter || s.status === statusFilter;
  });

  const getStatusColor = (st) => {
    switch (st) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'OUT_FOR_DELIVERY': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PICKED_UP': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold border border-cyan-400/30">
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Courier Dispatch & Last-Mile Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Delivery Manifest Console</h1>
          <p className="text-xs text-slate-300">
            Carrier Partner: <strong className="text-white">FastShip Logistics</strong> • Real-time package tracking and doorstep delivery confirmation.
          </p>
        </div>

        <button
          onClick={loadShipments}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Manifest</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'ALL', label: `All Assigned Packages (${shipments.length})` },
          { id: 'IN_TRANSIT', label: 'In Transit' },
          { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
          { id: 'DELIVERED', label: 'Delivered' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`pb-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              statusFilter === tab.id
                ? 'border-cyan-600 text-cyan-700 bg-cyan-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
            <Package className="w-12 h-12 mx-auto text-slate-300" />
            <h4 className="font-bold text-base text-slate-800">No Packages in this Queue</h4>
            <p className="text-xs text-slate-500">
              When multi-vendor sub-orders are confirmed and packed by merchants, they are automatically assigned here.
            </p>
          </div>
        ) : (
          filteredShipments.map((shipment) => {
            const currentStatus = shipment.shipmentStatus || shipment.status || 'ASSIGNED';
            return (
              <div 
                key={shipment.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-cyan-200 transition"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-800">
                        TRACKING: {shipment.trackingNumber || `TRK-EXP-${shipment.id}`}
                      </span>
                      <span className="text-xs text-slate-400">
                        Sub-Order: <strong className="font-mono text-slate-700">{shipment.sellerOrderNumber}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Origin Merchant: <strong className="text-slate-800">{shipment.sellerStoreName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black px-3 py-1 rounded-full border uppercase ${getStatusColor(currentStatus)}`}>
                      {currentStatus}
                    </span>
                  </div>
                </div>

                {/* Recipient Address & Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                      Delivery Destination
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{shipment.customerName || 'Customer'}</p>
                    <div className="flex items-start gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{shipment.shippingAddress}, {shipment.shippingCity}</span>
                    </div>
                    {shipment.shippingPhone && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{shipment.shippingPhone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                      Package Contents ({shipment.items?.length || 1} Products)
                    </span>
                    <div className="space-y-1">
                      {shipment.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700">
                          <span className="truncate max-w-[240px]">{it.quantity}x {it.productName}</span>
                          <span className="font-semibold text-slate-900">₹{it.subtotal}</span>
                        </div>
                      ))}
                    </div>
                    {shipment.deliveryNotes && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                        Note: {shipment.deliveryNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action progression bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 max-w-sm">
                    <input
                      type="text"
                      placeholder="Optional delivery memo / gate code / recipient signature..."
                      value={notes[shipment.id] || ''}
                      onChange={(e) => setNotes({ ...notes, [shipment.id]: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {currentStatus === 'ASSIGNED' && (
                      <button
                        onClick={() => handleUpdateStatus(shipment.id, 'PICKED_UP')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm"
                      >
                        Pick Up from Seller
                      </button>
                    )}

                    {(currentStatus === 'ASSIGNED' || currentStatus === 'PICKED_UP') && (
                      <button
                        onClick={() => handleUpdateStatus(shipment.id, 'IN_TRANSIT')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm"
                      >
                        Mark In Transit
                      </button>
                    )}

                    {currentStatus === 'IN_TRANSIT' && (
                      <button
                        onClick={() => handleUpdateStatus(shipment.id, 'OUT_FOR_DELIVERY')}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm"
                      >
                        Out for Delivery
                      </button>
                    )}

                    {currentStatus === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleUpdateStatus(shipment.id, 'DELIVERED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Confirm Doorstep Delivery</span>
                      </button>
                    )}

                    {currentStatus === 'DELIVERED' && (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Delivered & Escrow Settlement Triggered</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default DeliveryDashboardPage;
