import React, { useState, useEffect } from 'react';
import { productApi, categoryApi, aiApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { 
  Sparkles, ArrowRight, ShoppingBag, ShieldCheck, Zap, 
  TrendingUp, Award, ChevronRight, Store, Star 
} from 'lucide-react';

const HomePage = ({ onNavigate, onSelectProduct }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [featRes, topRes, catRes, aiRes] = await Promise.allSettled([
          productApi.getFeatured(),
          productApi.getTopRated(),
          categoryApi.getAll(),
          aiApi.getRecommendations(4),
        ]);

        if (featRes.status === 'fulfilled') setFeaturedProducts(featRes.value.data || []);
        if (topRes.status === 'fulfilled') setTopRatedProducts(topRes.value.data || []);
        if (catRes.status === 'fulfilled') setCategories(catRes.value.data || []);
        if (aiRes.status === 'fulfilled') setAiRecommendations(aiRes.value.data || []);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-brand-950 to-slate-900 text-white pt-16 pb-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Next-Generation Multi-Vendor Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Shop Thousands of <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-teal-300">
                  Independent Sellers
                </span><br />
                in One Unified Cart.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Discover authentic electronics, apparel, home goods, and books. Enjoy smart multi-vendor order routing, live carrier delivery updates, and AI-powered product recommendations.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-brand-600/30 hover:scale-[1.02] transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('seller-dashboard')}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 py-3.5 rounded-xl text-sm flex items-center gap-2 transition"
                >
                  <Store className="w-4 h-4 text-brand-300" />
                  <span>Seller Portal</span>
                </button>
              </div>

              {/* Metrics pill */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md">
                <div>
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-xs text-slate-400">Verified Sellers</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-brand-400">Auto</div>
                  <div className="text-xs text-slate-400">Order Splitting</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">5+</div>
                  <div className="text-xs text-slate-400">AI Capabilities</div>
                </div>
              </div>

            </div>

            {/* Right Featured Hero Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-tr from-slate-800/90 to-slate-900/90 p-5 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-300">Live Marketplace Feed</span>
                  </div>
                  <span className="text-[11px] text-brand-400 font-semibold">Multi-Seller Ready</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700 flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" 
                      alt="TechHub" 
                      className="w-14 h-14 object-cover rounded-xl bg-slate-700" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-brand-400">Seller: TechHub Solutions</span>
                        <span className="text-xs font-extrabold text-white">₹19,999</span>
                      </div>
                      <p className="text-xs font-bold text-slate-100 truncate">Sony WH-1000XM5 Headphones</p>
                      <p className="text-[11px] text-slate-400">AI Sentiment: 94% Positive Consensus</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700 flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" 
                      alt="StyleVerse" 
                      className="w-14 h-14 object-cover rounded-xl bg-slate-700" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-brand-400">Seller: StyleVerse Apparel</span>
                        <span className="text-xs font-extrabold text-white">₹3,499</span>
                      </div>
                      <p className="text-xs font-bold text-slate-100 truncate">Nike Air Jordan Retro Low</p>
                      <p className="text-[11px] text-slate-400">Independent Inventory: 40 Units</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-brand-950/60 border border-brand-800/50 rounded-xl text-center">
                  <p className="text-xs font-semibold text-brand-300">
                    💡 Single checkout divides into 2 seller orders automatically
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
            <p className="text-xs text-slate-500">Explore department collections from approved merchants</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('catalog', { categoryId: cat.id, categoryName: cat.name })}
              className="group bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center text-brand-600 transition-colors mb-3 overflow-hidden">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                ) : (
                  <ShoppingBag className="w-6 h-6" />
                )}
              </div>
              <h3 className="font-bold text-xs text-slate-800 group-hover:text-brand-600 transition truncate w-full">
                {cat.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Explore &rarr;</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Recommendations Banner & Products */}
      {aiRecommendations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-purple-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full text-xs font-bold border border-brand-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                  <span>AI Product Recommendation Engine</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">Curated Specifically For You</h2>
                <p className="text-xs text-slate-300">
                  Personalized matching algorithms based on category affinity, trending sales, and review sentiment.
                </p>
              </div>
              <button
                onClick={() => onNavigate('catalog')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition whitespace-nowrap"
              >
                Explore More AI Picks
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {aiRecommendations.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                onSelectSeller={(sellerId) => onNavigate('catalog', { sellerId })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Products</h2>
            </div>
            <p className="text-xs text-slate-500">Hand-picked top quality items from our premier sellers</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1"
          >
            <span>See All Products</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                onSelectSeller={(sellerId) => onNavigate('catalog', { sellerId })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Top Rated & Best Sellers */}
      {topRatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Highest Rated by Customers</h2>
              </div>
              <p className="text-xs text-slate-500">Top-tier ratings verified through actual customer purchases</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topRatedProducts.slice(0, 4).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                onSelectSeller={(sellerId) => onNavigate('catalog', { sellerId })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Seller Onboarding Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Grow Your Business
            </span>
            <h3 className="text-3xl font-black">Sell to Millions on ShopSphere</h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Open your digital storefront in minutes. Benefit from automated inventory tracking, integrated AI listing generators, fast escrow payouts, and reliable logistics support.
            </p>
          </div>
          <button
            onClick={() => onNavigate('seller-dashboard')}
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold px-6 py-3.5 rounded-xl text-sm whitespace-nowrap shadow-lg transition"
          >
            Launch Your Store &rarr;
          </button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
