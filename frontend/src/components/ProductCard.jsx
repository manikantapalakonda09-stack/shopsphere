import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Store, ShieldCheck, AlertCircle, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onSelectProduct, onSelectSeller }) => {
  const { cart, addToCart, updateQuantity, removeItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [loadingAction, setLoadingAction] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const cartItem = cart?.items?.find((item) => item.productId === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (product.outOfStock) return;
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('shopsphere:open-auth', { detail: 'login' }));
      return;
    }
    try {
      setLoadingAction(true);
      await addToCart(product.id, 1);
    } catch (err) {
      console.error('Failed to add item to cart', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleIncrement = async (e) => {
    e.stopPropagation();
    if (!cartItem) return;
    try {
      setLoadingAction(true);
      await updateQuantity(cartItem.id, quantityInCart + 1);
    } catch (err) {
      console.error('Failed to increment cart quantity', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDecrement = async (e) => {
    e.stopPropagation();
    if (!cartItem) return;
    try {
      setLoadingAction(true);
      if (quantityInCart > 1) {
        await updateQuantity(cartItem.id, quantityInCart - 1);
      } else {
        await removeItem(cartItem.id);
      }
    } catch (err) {
      console.error('Failed to decrement cart quantity', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('shopsphere:open-auth', { detail: 'login' }));
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm tracking-wide">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isLowStock && !product.outOfStock && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              Only {product.stockQuantity} Left
            </span>
          )}
          {product.outOfStock && (
            <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller Attribution */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600 truncate max-w-[150px]">
              {product.categoryName}
            </span>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectSeller) onSelectSeller(product.sellerId);
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-brand-600 transition"
              title={`Store: ${product.sellerStoreName}`}
            >
              <Store className="w-3 h-3 text-brand-500" />
              <span className="font-semibold truncate max-w-[110px]">{product.sellerStoreName}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'New'}
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.totalReviews || 0})
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {quantityInCart > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-brand-600 bg-brand-50 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={handleDecrement}
                disabled={loadingAction}
                className="px-2.5 py-1 text-brand-700 hover:bg-brand-100 disabled:opacity-50 transition font-black text-sm active:scale-90 flex items-center justify-center"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3 stroke-[3]" />
              </button>
              <span className="px-2 py-1 text-xs font-black text-brand-900 min-w-[24px] text-center select-none">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                disabled={loadingAction || (product.stockQuantity && quantityInCart >= product.stockQuantity)}
                className="px-2.5 py-1 text-brand-700 hover:bg-brand-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-black text-sm active:scale-90 flex items-center justify-center"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.outOfStock || loadingAction}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                product.outOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-500/20 hover:shadow-md active:scale-95'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.outOfStock ? 'Sold Out' : 'Add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
