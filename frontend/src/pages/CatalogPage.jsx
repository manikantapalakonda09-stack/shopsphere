import React, { useState, useEffect, useCallback } from 'react';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import { Search, SlidersHorizontal, ShoppingBag, X } from 'lucide-react';

const CatalogPage = ({ initialFilters = {}, onSelectProduct, onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.categoryId || null);
  const [selectedSeller, setSelectedSeller] = useState(initialFilters.sellerId || null);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState('createdAt_DESC');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Error fetching categories', err));
  }, []);

  // Update if initialFilters change
  useEffect(() => {
    if (initialFilters.search !== undefined) setSearchQuery(initialFilters.search);
    if (initialFilters.categoryId !== undefined) setSelectedCategory(initialFilters.categoryId);
    if (initialFilters.sellerId !== undefined) setSelectedSeller(initialFilters.sellerId);
  }, [initialFilters]);

  // Load products based on filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const [sortByField, sortOrder] = sortBy.split('_');
      const params = {
        search: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
        maxPrice: maxPrice < 150000 ? maxPrice : undefined,
        sortBy: sortByField,
        direction: sortOrder || 'DESC',
      };
      const res = await productApi.search(params);
      const items = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setProducts(items);
    } catch (err) {
      console.error('Error searching products', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedSeller, maxPrice, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSeller(null);
    setMaxPrice(150000);
    setSortBy('createdAt_DESC');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search & Top Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-md relative">
          <input
            type="text"
            placeholder="Search catalog by product name, keywords, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{products.length}</strong> products
          </span>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategory || selectedSeller || searchQuery || maxPrice < 150000) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium">Active Filters:</span>
          {searchQuery && (
            <span className="bg-brand-50 border border-brand-200 text-brand-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              Keyword: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-brand-900">×</button>
            </span>
          )}
          {selectedCategory && (
            <span className="bg-brand-50 border border-brand-200 text-brand-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              Category ID: {selectedCategory}
              <button onClick={() => setSelectedCategory(null)} className="hover:text-brand-900">×</button>
            </span>
          )}
          {selectedSeller && (
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              Seller Filtered
              <button onClick={() => setSelectedSeller(null)} className="hover:text-emerald-900">×</button>
            </span>
          )}
          {maxPrice < 150000 && (
            <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              Under ₹{maxPrice.toLocaleString('en-IN')}
              <button onClick={() => setMaxPrice(150000)} className="hover:text-slate-900">×</button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:underline font-semibold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar (Desktop) */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1`}>
          <FilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => {
              setSelectedCategory(id);
              setMobileFilterOpen(false);
            }}
            minPrice={0}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No products matched your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader keywords, adjusting your price slider, or selecting another category.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onSelectSeller={(sellerId) => setSelectedSeller(sellerId)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default CatalogPage;
