import React, { useState } from 'react';
import { Sparkles, Check, Copy, RefreshCw, X, Tag } from 'lucide-react';
import { aiApi } from '../services/api';

const AiDescriptionModal = ({ isOpen, onClose, onApplyContent, currentTitle = '', categoryName = '' }) => {
  const [title, setTitle] = useState(currentTitle);
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!title.trim()) return;
    try {
      setLoading(true);
      const res = await aiApi.generateDescription({
        title,
        category: categoryName,
        keyFeatures: features,
      });
      setResult(res.data);
    } catch (err) {
      console.error('Failed to generate description', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result && onApplyContent) {
      onApplyContent({
        name: result.suggestedTitle,
        description: result.description,
        highlights: result.highlights.join(' | '),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">ShopSphere AI Listing Assistant</h3>
              <p className="text-xs text-white/80">Generate high-converting titles, descriptions, and SEO tags</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Seed Title or Keywords *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ergonomic Office Chair with lumbar support"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Key Standout Specs (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="e.g. Breathable mesh, 3D armrests, 5yr warranty"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Add Spec
              </button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {features.map((f, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                    {f}
                    <button onClick={() => handleRemoveFeature(i)} className="text-slate-400 hover:text-rose-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !title.trim()}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting AI Content...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Listing Copy & SEO Tags</span>
              </>
            )}
          </button>

          {/* AI Result View */}
          {result && (
            <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-in fade-in duration-200">
              
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <span>Suggested Optimized Title</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">SEO Ready</span>
                </div>
                <p className="text-sm font-bold text-slate-900 bg-white p-3 rounded-xl border border-slate-200">
                  {result.suggestedTitle}
                </p>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Persuasive Product Description
                </span>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {result.description}
                </p>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Bullet Highlights
                </span>
                <ul className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 list-disc pl-5">
                  {result.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-brand-600" />
                  Generated Search Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.searchKeywords.map((kw, i) => (
                    <span key={i} className="text-[11px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium border border-brand-200/60">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          {result && (
            <button
              onClick={handleApply}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Product Form</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AiDescriptionModal;
