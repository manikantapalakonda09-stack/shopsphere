import React from 'react';
import { Filter, RotateCcw, ChevronRight } from 'lucide-react';

const FilterPanel = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  onResetFilters
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 font-medium transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
        >
          <option value="createdAt_DESC">Newest Arrivals</option>
          <option value="price_ASC">Price: Low to High</option>
          <option value="price_DESC">Price: High to Low</option>
          <option value="totalSales_DESC">Best Sellers</option>
          <option value="averageRating_DESC">Highest Customer Rating</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
              selectedCategory === null
                ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === null && <ChevronRight className="w-3.5 h-3.5 text-brand-600" />}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                selectedCategory === cat.id
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.id && <ChevronRight className="w-3.5 h-3.5 text-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Max Price: ₹{maxPrice.toLocaleString('en-IN')}
        </label>
        <input
          type="range"
          min="500"
          max="150000"
          step="500"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>₹500</span>
          <span>₹75,000</span>
          <span>₹1,50,000+</span>
        </div>
      </div>

      {/* Marketplace Trust Guarantee Banner */}
      <div className="bg-gradient-to-br from-brand-50 to-indigo-50/50 p-3.5 rounded-xl border border-brand-100 text-xs text-brand-900 space-y-1">
        <p className="font-bold flex items-center gap-1 text-[11px] text-brand-700">
          ✨ ShopSphere Guarantee
        </p>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Order from multiple verified sellers with single combined shipping and buyer protection.
        </p>
      </div>

    </div>
  );
};

export default FilterPanel;
