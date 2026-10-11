import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  ShoppingBag, Heart, Search, User, Shield, Store, 
  Headset, Truck, ChevronDown, Sparkles, LayoutDashboard 
} from 'lucide-react';

const Navbar = ({ onOpenAuth, onNavigate, currentTab, categories = [] }) => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { totalItems, subtotal } = useCart();
  const { wishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onNavigate('catalog', { search: searchQuery });
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <header className="sticky top-[33px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Shop<span className="text-brand-600">Sphere</span>
                </span>
                <span className="text-[9px] bg-brand-50 text-brand-700 font-bold px-1.5 py-0.2 rounded border border-brand-200 uppercase">
                  Multi-Vendor
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Marketplace & AI Hub</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products across all verified sellers, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 pl-10 pr-24 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-full text-xs font-semibold shadow-sm transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-3">
            
            {/* Contextual Role Dashboard Shortcut */}
            {isAuthenticated && (
              <>
                {hasRole('ROLE_ADMIN') && (
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className="hidden sm:flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 transition shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                {hasRole('ROLE_SELLER') && (
                  <button
                    onClick={() => onNavigate('seller-dashboard')}
                    className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition shadow-sm"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Seller Dashboard</span>
                  </button>
                )}
                {hasRole('ROLE_SUPPORT') && (
                  <button
                    onClick={() => onNavigate('support-dashboard')}
                    className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition shadow-sm"
                  >
                    <Headset className="w-3.5 h-3.5" />
                    <span>Support Desk</span>
                  </button>
                )}
                {hasRole('ROLE_DELIVERY') && (
                  <button
                    onClick={() => onNavigate('delivery-dashboard')}
                    className="hidden sm:flex items-center gap-1.5 bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cyan-100 transition shadow-sm"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Deliveries</span>
                  </button>
                )}
              </>
            )}

            {/* Catalog Browser Link */}
            <button
              onClick={() => onNavigate('catalog')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                currentTab === 'catalog' ? 'text-brand-600 bg-brand-50' : 'text-slate-700 hover:text-brand-600'
              }`}
            >
              Explore
            </button>

            {/* Role-Specific Actions: Show Wishlist & Cart ONLY for Customers/Guests */}
            {(!hasRole('ROLE_SELLER') && !hasRole('ROLE_DELIVERY') && !hasRole('ROLE_SUPPORT') && !hasRole('ROLE_ADMIN')) && (
              <>
                {/* Wishlist */}
                <button
                  onClick={() => onNavigate('customer-dashboard', { tab: 'wishlist' })}
                  className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition"
                  title="Saved Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Multi-Vendor Cart */}
                <button
                  onClick={() => onNavigate('cart')}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition"
                  title="View Unified Multi-Vendor Cart"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] font-bold px-1 rounded-full min-w-[16px] text-center">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline font-bold">
                    {subtotal > 0 ? formatPrice(subtotal) : 'Cart'}
                  </span>
                </button>
              </>
            )}

            {/* Merchant Quick Portal Button for Sellers */}
            {hasRole('ROLE_SELLER') && (
              <button
                onClick={() => onNavigate('seller-dashboard')}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Portal</span>
              </button>
            )}

            {/* Account Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {user?.roles?.map((r) => (
                            <span key={r} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Only Show Customer Orders link for actual Customers */}
                      {hasRole('ROLE_CUSTOMER') && (
                        <button
                          onClick={() => onNavigate('customer-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          My Orders & Profile
                        </button>
                      )}

                      {hasRole('ROLE_ADMIN') && (
                        <button
                          onClick={() => onNavigate('admin-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-medium"
                        >
                          <Shield className="w-3.5 h-3.5 text-purple-600" />
                          Platform Administration
                        </button>
                      )}

                      {hasRole('ROLE_SELLER') && (
                        <button
                          onClick={() => onNavigate('seller-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-medium"
                        >
                          <Store className="w-3.5 h-3.5 text-emerald-600" />
                          Seller Dashboard Command
                        </button>
                      )}

                      {hasRole('ROLE_SUPPORT') && (
                        <button
                          onClick={() => onNavigate('support-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                        >
                          <Headset className="w-3.5 h-3.5 text-amber-600" />
                          Support Desk
                        </button>
                      )}

                      {hasRole('ROLE_DELIVERY') && (
                        <button
                          onClick={() => onNavigate('delivery-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 font-medium"
                        >
                          <Truck className="w-3.5 h-3.5 text-cyan-600" />
                          Delivery Manifests
                        </button>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 whitespace-nowrap pl-1">Categories:</span>
          <button
            onClick={() => onNavigate('catalog', { categoryId: null })}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition"
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('catalog', { categoryId: cat.id, categoryName: cat.name })}
              className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-brand-50 hover:text-brand-600 border border-slate-200/80 text-slate-600 whitespace-nowrap transition font-medium"
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
