import React, { useState, useEffect } from 'react';
import { productApi, reviewApi, aiApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { 
  Star, Heart, ShoppingBag, Truck, ShieldCheck, 
  RotateCcw, Store, Sparkles, Check, AlertCircle, 
  ThumbsUp, ThumbsDown, MessageSquare, ArrowLeft 
} from 'lucide-react';

const ProductDetailPage = ({ productId, onBack, onSelectProduct, onNavigate }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // New review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        // Load product details
        const prodRes = await productApi.getById(productId);
        const p = prodRes.data;
        setProduct(p);
        setSelectedImage(p.primaryImageUrl || (p.images && p.images[0]?.imageUrl) || '');

        // Record AI view event
        aiApi.recordProductView(productId).catch(() => {});

        // Concurrently fetch reviews, sentiment consensus, and related items
        const [revRes, sentRes, relRes] = await Promise.allSettled([
          reviewApi.getForProduct(productId),
          aiApi.getSentimentAnalysis(productId),
          aiApi.getRelated(productId, 4),
        ]);

        if (revRes.status === 'fulfilled') setReviews(revRes.value.data || []);
        if (sentRes.status === 'fulfilled') setSentiment(sentRes.value.data);
        if (relRes.status === 'fulfilled') setRelatedProducts(relRes.value.data || []);
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      loadProductData();
      window.scrollTo(0, 0);
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || product.outOfStock) return;
    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3000);
    } catch (err) {
      console.error('Error adding to cart', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    onNavigate('cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in as a customer to post a review.');
      return;
    }
    try {
      setSubmittingReview(true);
      await reviewApi.create({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewTitle('');
      setReviewComment('');
      // Reload reviews and sentiment
      const updatedRev = await reviewApi.getForProduct(product.id);
      setReviews(updatedRev.data || []);
      const updatedSent = await aiApi.getSentimentAnalysis(product.id);
      setSentiment(updatedSent.data);
      alert('Thank you! Your verified customer review has been posted.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-96 bg-slate-200 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="text-xs text-slate-400">
          Home &gt; {product.categoryName} &gt; <span className="text-slate-700 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden aspect-[4/3] flex items-center justify-center relative shadow-sm">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800'}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition ${
                    selectedImage === img.imageUrl ? 'border-brand-600 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specs & Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Seller Attribution & Category */}
          <div className="flex items-center justify-between">
            <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-bold">
              {product.categoryName}
            </span>

            <div 
              onClick={() => onNavigate('catalog', { sellerId: product.sellerId })}
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-emerald-100 transition"
              title="Click to view all items by this seller"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sold by: {product.sellerStoreName}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {product.name}
          </h1>

          {/* Ratings & SKU */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-extrabold text-amber-900">
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'Unrated'}
              </span>
              <span className="text-amber-700">({product.totalReviews || 0} customer reviews)</span>
            </div>
            <span className="text-slate-400">SKU: {product.sku}</span>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Inclusive of all taxes
            </span>
          </div>

          {/* Stock Warning */}
          <div>
            {product.outOfStock ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Currently Out of Stock from this Seller</span>
              </div>
            ) : product.isLowStock ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Hurry! Only {product.stockQuantity} units remaining in stock</span>
              </div>
            ) : (
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>In Stock & Ready for Rapid Dispatch ({product.stockQuantity} available)</span>
              </div>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.outOfStock}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-slate-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity || 10, quantity + 1))}
                  disabled={quantity >= product.stockQuantity || product.outOfStock}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.outOfStock || addingToCart}
                className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 hover:shadow-lg transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addingToCart ? 'Adding...' : 'Add to Multi-Vendor Cart'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition shadow-sm ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:border-rose-200'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now direct button */}
            {!product.outOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition shadow-sm"
              >
                Buy Now & Proceed to Checkout
              </button>
            )}

            {addedToast && (
              <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl text-center shadow-lg animate-in fade-in duration-200 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Added to your multi-vendor cart! Order across sellers with one checkout.</span>
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <Truck className="w-4 h-4 mx-auto mb-1 text-brand-600" />
              <p className="text-[11px] font-bold text-slate-800">Fast Courier Dispatch</p>
              <p className="text-[10px] text-slate-500">Live parcel tracking</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <p className="text-[11px] font-bold text-slate-800">Escrow Protected</p>
              <p className="text-[10px] text-slate-500">Safe payments</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-purple-600" />
              <p className="text-[11px] font-bold text-slate-800">Easy 7-Day Returns</p>
              <p className="text-[10px] text-slate-500">Agent resolution</p>
            </div>
          </div>

        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          Product Details & Specifications
        </h2>
        <div className="text-slate-700 text-sm leading-relaxed space-y-4 whitespace-pre-line">
          {product.description}
        </div>
      </div>

      {/* AI Review Sentiment Consensus Component */}
      {sentiment && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span>AI Review Sentiment Consensus</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    NLP Engine
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Synthesized from customer feedback across verified buyers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500">Overall Rating</div>
                <div className="text-lg font-black text-indigo-700">{sentiment.sentimentScore}% Positive</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-indigo-600 flex items-center justify-center font-bold text-xs text-indigo-700">
                {sentiment.sentimentScore}%
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-700 italic bg-white/80 p-4 rounded-2xl border border-indigo-100 leading-relaxed">
            "{sentiment.summary}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Liked Features */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide">
                <ThumbsUp className="w-4 h-4" />
                <span>What Buyers Praised Most</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {sentiment.pros?.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Observations */}
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wide">
                <ThumbsDown className="w-4 h-4" />
                <span>Things to Consider</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {sentiment.cons?.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Customer Reviews</h3>
            <p className="text-xs text-slate-500">Verified buyer ratings and authentic feedback</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {reviews.length} Verified Reviews
          </span>
        </div>

        {/* Write a Review Form */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span>Share Your Product Experience</span>
          </h4>

          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star className={`w-5 h-5 ${s <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600">({reviewRating} Stars)</span>
              </div>

              <input
                type="text"
                required
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Review headline (e.g. Exceptional sound clarity & comfort)"
                className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <textarea
                rows="3"
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Detailed review of your experience with this item..."
                className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              ></textarea>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm transition"
              >
                {submittingReview ? 'Submitting Review...' : 'Post Customer Review'}
              </button>
            </form>
          ) : (
            <div className="text-xs text-slate-500">
              Please sign in as a customer using the top demo switcher to submit a product review.
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No customer reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">{rev.title}</h5>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-slate-700">{rev.customerName || 'Verified Shopper'}</span>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">Similar Products You May Like</h3>
            <span className="text-xs text-brand-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Matched
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                onSelectSeller={(sellerId) => onNavigate('catalog', { sellerId })}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
