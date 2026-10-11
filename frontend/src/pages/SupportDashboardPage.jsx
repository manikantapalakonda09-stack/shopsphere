import React, { useState, useEffect } from 'react';
import { supportApi } from '../services/api';
import { 
  Headset, AlertCircle, RotateCcw, Check, MessageSquare, 
  RefreshCw, ShieldAlert, CheckCircle, Clock, User 
} from 'lucide-react';

const SupportDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dispute resolution modal
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [disputeDecision, setDisputeDecision] = useState('');
  const [disputeStatus, setDisputeStatus] = useState('RESOLVED_BUYER_FAVOR');

  const loadData = async () => {
    try {
      setLoading(true);
      const [tickRes, dispRes, retRes] = await Promise.allSettled([
        supportApi.getAllTickets(),
        supportApi.getAllDisputes(),
        supportApi.getAllReturns(),
      ]);

      if (tickRes.status === 'fulfilled') setTickets(tickRes.value.data || []);
      if (dispRes.status === 'fulfilled') setDisputes(dispRes.value.data || []);
      if (retRes.status === 'fulfilled') setReturns(retRes.value.data || []);
    } catch (err) {
      console.error('Error loading support desk data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateTicketStatus = async (id, status) => {
    try {
      await supportApi.updateTicketStatus(id, status);
      alert(`Ticket marked as ${status}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket status');
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    try {
      await supportApi.resolveDispute(selectedDispute.id, {
        decision: disputeDecision,
        status: disputeStatus,
      });
      alert('Dispute resolved successfully.');
      setSelectedDispute(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve dispute');
    }
  };

  const handleApproveReturn = async (returnId) => {
    try {
      await supportApi.approveReturn(returnId);
      alert('Return approved! Automated refund processed and merchant escrow updated.');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve return');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
            <Headset className="w-3.5 h-3.5 text-amber-400" />
            <span>Marketplace Mediation Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Support & Dispute Center</h1>
          <p className="text-xs text-slate-300">
            Resolve buyer inquiries, mediate buyer-seller conflicts, and authorize instant refunds under ShopSphere Buyer Protection.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'tickets', label: `Open Tickets (${tickets.length})` },
          { id: 'disputes', label: `Disputes (${disputes.length})` },
          { id: 'returns', label: `Return & Refund Queue (${returns.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-amber-600 text-amber-700 bg-amber-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: TICKETS */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">Customer Support Queue</h3>
            <p className="text-xs text-slate-500">Handle inquiries regarding orders, account status, and courier delays.</p>
          </div>

          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No tickets in queue.</p>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{t.subject}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Customer: <strong className="text-slate-800">{t.customer?.user?.fullName || 'Customer'}</strong> ({t.customer?.user?.email})
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded uppercase">
                        Priority: {t.priority}
                      </span>
                      <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded uppercase">
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    {t.status !== 'IN_PROGRESS' && t.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleUpdateTicketStatus(t.id, 'IN_PROGRESS')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Claim Ticket (In Progress)
                      </button>
                    )}
                    {t.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleUpdateTicketStatus(t.id, 'RESOLVED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Resolve Ticket
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DISPUTES */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">Multi-Vendor Dispute Mediation</h3>
            <p className="text-xs text-slate-500">Arbitrate disagreements between shoppers and merchants regarding condition or fulfillment.</p>
          </div>

          <div className="space-y-4">
            {disputes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No open disputes reported.</p>
            ) : (
              disputes.map((d) => (
                <div key={d.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded uppercase">
                        Dispute #{d.id}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{d.reason}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                      Status: {d.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                    {d.description}
                  </p>

                  {d.resolutionNotes && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                      <strong>Agent Resolution:</strong> {d.resolutionNotes}
                    </div>
                  )}

                  {d.status === 'OPEN' && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => { setSelectedDispute(d); setDisputeDecision(''); }}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition"
                      >
                        Mediate Dispute
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RETURNS & REFUNDS */}
      {activeTab === 'returns' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">Return & Escrow Refund Approvals</h3>
            <p className="text-xs text-slate-500">
              When approved, the system issues a refund transaction and decrements the seller's escrow balance.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Return ID</th>
                  <th className="py-3 px-4">Sub-Order #</th>
                  <th className="py-3 px-4">Customer Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">RET-{r.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">Sub-Order #{r.sellerOrder?.id}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">{r.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      {r.status === 'REQUESTED' ? (
                        <button
                          onClick={() => handleApproveReturn(r.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-xs"
                        >
                          Approve & Refund
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Refunded</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESOLVE DISPUTE MODAL */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">Resolve Dispute #{selectedDispute.id}</h4>

            <form onSubmit={handleResolveDispute} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mediation Finding / Decision</label>
                <select
                  value={disputeStatus}
                  onChange={(e) => setDisputeStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                >
                  <option value="RESOLVED_BUYER_FAVOR">Resolve in Buyer's Favor (Full Refund)</option>
                  <option value="RESOLVED_SELLER_FAVOR">Resolve in Seller's Favor (Valid Fulfillment)</option>
                  <option value="CLOSED">Close Without Action</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resolution Summary Note *</label>
                <textarea
                  rows="3"
                  required
                  value={disputeDecision}
                  onChange={(e) => setDisputeDecision(e.target.value)}
                  placeholder="Official finding after reviewing tracking logs and merchant communication..."
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Apply Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SupportDashboardPage;
