import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopsphere_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Global response interceptor for 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if on login check
      if (!error.config.url.includes('/auth/login')) {
        console.warn('Session expired or unauthorized request.');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  registerCustomer: (data) => api.post('/auth/register', data),
  registerSeller: (data) => api.post('/auth/register-seller', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const productApi = {
  search: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getTopRated: () => api.get('/products/top-rated'),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
};

export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
  updateQuantity: (cartItemId, quantity) => api.put(`/cart/items/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/items/${cartItemId}`),
  clear: () => api.delete('/cart/clear'),
};

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

export const orderApi = {
  checkout: (data) => api.post('/orders/checkout', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
};

export const sellerApi = {
  getDashboard: () => api.get('/seller/dashboard'),
  getProducts: () => api.get('/seller/products'),
  createProduct: (data) => api.post('/seller/products', data),
  updateProduct: (id, data) => api.put(`/seller/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),
  updateInventory: (id, data) => api.put(`/seller/products/${id}/inventory`, data),
  getOrders: () => api.get('/seller/orders'),
  updateOrderStatus: (id, status) => api.put(`/seller/orders/${id}/status`, { status }),
  getSettlements: () => api.get('/seller/settlements'),
};

export const deliveryApi = {
  getShipments: () => api.get('/delivery/shipments'),
  updateStatus: (id, data) => api.put(`/delivery/shipments/${id}/status`, data),
};

export const couponApi = {
  validate: (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount }),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  toggleStatus: (id) => api.put(`/coupons/${id}/toggle`),
};

export const reviewApi = {
  getForProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (data) => api.post('/reviews', data),
  report: (id) => api.post(`/reviews/${id}/report`),
  getReported: () => api.get('/reviews/reported'),
  moderate: (id, remove) => api.put(`/reviews/${id}/moderate?remove=${remove}`),
};

export const supportApi = {
  createTicket: (data) => api.post('/support/tickets', data),
  getMyTickets: () => api.get('/support/tickets/my'),
  getAllTickets: () => api.get('/support/tickets'),
  updateTicketStatus: (id, status) => api.put(`/support/tickets/${id}/status`, { status }),
  createDispute: (data) => api.post('/support/disputes', data),
  getAllDisputes: () => api.get('/support/disputes'),
  resolveDispute: (id, data) => api.put(`/support/disputes/${id}/resolve`, data),
  requestReturn: (data) => api.post('/support/returns', data),
  getAllReturns: () => api.get('/support/returns'),
  approveReturn: (id) => api.put(`/support/returns/${id}/approve`),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllSellers: () => api.get('/admin/sellers'),
  getPendingSellers: () => api.get('/admin/sellers/pending'),
  approveSeller: (id, approve) => api.put(`/admin/sellers/${id}/approve`, { approve }),
  getSuspiciousListings: () => api.get('/admin/suspicious-listings'),
  moderateListing: (id, approveFlag) => api.put(`/admin/listings/${id}/moderate`, { approveFlag }),
  getSettlements: () => api.get('/admin/settlements'),
  releaseSettlement: (id) => api.put(`/admin/settlements/${id}/release`),
};

export const aiApi = {
  getRecommendations: (limit = 8) => api.get(`/ai/recommendations?limit=${limit}`),
  getRelated: (productId, limit = 4) => api.get(`/ai/related/${productId}?limit=${limit}`),
  recordProductView: (productId) => api.post(`/ai/view-product/${productId}`),
  generateDescription: (data) => api.post('/ai/generate-description', data),
  getSentimentAnalysis: (productId) => api.get(`/ai/sentiment-analysis/${productId}`),
  checkFraud: (data) => api.post('/ai/fraud-check', data),
  getDemandPrediction: (sellerId) => api.get(`/ai/demand-prediction/${sellerId}`),
};

export default api;
