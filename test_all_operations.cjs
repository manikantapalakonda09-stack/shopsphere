// Comprehensive API and Operations Test Suite for ShopSphere
const axiosModule = require('./frontend/node_modules/axios');
const axios = axiosModule.default || axiosModule;

const BASE_URL = 'http://localhost:5173/api';

const client = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true, // Don't throw on HTTP errors
});

const results = [];

function record(suite, testName, passed, details = '') {
  results.push({ suite, testName, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} [${suite}] ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🚀 STARTING SHOPSPHERE END-TO-END OPERATIONS TEST SUITE');
  console.log(`Target: ${BASE_URL} (Vite Proxy -> Spring Boot 8080 -> MySQL 3308)`);
  console.log('================================================================\n');

  // ----------------------------------------------------------------
  // 1. AUTHENTICATION & REGISTRATION
  // ----------------------------------------------------------------
  console.log('--- SUITE 1: AUTHENTICATION & USER MANAGEMENT ---');
  
  // 1.1 Customer Registration
  const testEmail = `test_customer_${Date.now()}@example.com`;
  const regCustRes = await client.post('/auth/register', {
    fullName: 'Test Customer Automaton',
    email: testEmail,
    password: 'password123',
    phone: '+91 9999988888',
    shippingAddress: '100 Silicon Highway',
    city: 'Hyderabad',
  });
  record('Auth', 'Register New Customer', regCustRes.status === 200 && !!regCustRes.data.token, `Status: ${regCustRes.status}`);

  // 1.2 Seller Registration
  const testSellerEmail = `test_seller_${Date.now()}@example.com`;
  const regSellerRes = await client.post('/auth/register-seller', {
    fullName: 'Test Merchant Lead',
    email: testSellerEmail,
    password: 'password123',
    storeName: `Vanguard Electronics ${Date.now().toString().slice(-4)}`,
    phone: '+91 8888877777',
    storeDescription: 'Premier components and accessories',
    businessAddress: '404 Industrial Blvd',
    taxId: 'GSTIN36AAAAA1111A1Z1',
  });
  record('Auth', 'Register New Seller (Pending)', regSellerRes.status === 200 && !!regSellerRes.data.token, `Status: ${regSellerRes.status}`);

  // 1.3 Customer Login
  const loginCustRes = await client.post('/auth/login', {
    email: 'customer@gmail.com',
    password: 'password123',
  });
  const customerToken = loginCustRes.data.token;
  record('Auth', 'Customer Login (Alice)', loginCustRes.status === 200 && !!customerToken, `User: ${loginCustRes.data.fullName}`);

  // 1.4 Admin Login
  const loginAdminRes = await client.post('/auth/login', {
    email: 'admin@shopsphere.com',
    password: 'password123',
  });
  const adminToken = loginAdminRes.data.token;
  record('Auth', 'Admin Login', loginAdminRes.status === 200 && !!adminToken, `Roles: ${loginAdminRes.data.roles}`);

  // 1.5 Seller Login
  const loginSellerRes = await client.post('/auth/login', {
    email: 'seller@techhub.com',
    password: 'password123',
  });
  const sellerToken = loginSellerRes.data.token;
  const sellerId = loginSellerRes.data.sellerId;
  record('Auth', 'Seller Login (TechHub)', loginSellerRes.status === 200 && !!sellerToken, `Store: ${loginSellerRes.data.storeName}, ID: ${sellerId}`);

  // 1.6 Support Login
  const loginSupportRes = await client.post('/auth/login', {
    email: 'support@shopsphere.com',
    password: 'password123',
  });
  const supportToken = loginSupportRes.data.token;
  record('Auth', 'Support Agent Login', loginSupportRes.status === 200 && !!supportToken, `Roles: ${loginSupportRes.data.roles}`);

  // 1.7 Delivery Partner Login
  const loginDeliveryRes = await client.post('/auth/login', {
    email: 'delivery@fastship.com',
    password: 'password123',
  });
  const deliveryToken = loginDeliveryRes.data.token;
  record('Auth', 'Delivery Partner Login', loginDeliveryRes.status === 200 && !!deliveryToken, `Roles: ${loginDeliveryRes.data.roles}`);

  // 1.8 Profile check with JWT
  const profileRes = await client.get('/auth/profile', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  record('Auth', 'Get Authenticated Profile', profileRes.status === 200 && profileRes.data.email === 'customer@gmail.com');

  // ----------------------------------------------------------------
  // 2. STOREFRONT & CATALOG BROWSING
  // ----------------------------------------------------------------
  console.log('\n--- SUITE 2: CATALOG & PRODUCT DISCOVERY ---');

  // 2.1 Get Categories
  const catRes = await client.get('/categories');
  record('Catalog', 'Get Categories List', catRes.status === 200 && catRes.data.length >= 5, `Found ${catRes.data.length} categories`);

  // 2.2 Search Products (Spring Data Page unpack)
  const prodRes = await client.get('/products');
  const allProds = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.content || []);
  record('Catalog', 'Get All Products', prodRes.status === 200 && allProds.length > 0, `Found ${allProds.length} products`);

  // 2.3 Search with keyword & category filter
  const filterRes = await client.get('/products', {
    params: { search: 'Headphones', categoryId: 1 },
  });
  const filteredProds = Array.isArray(filterRes.data) ? filterRes.data : (filterRes.data?.content || []);
  record('Catalog', 'Filter Products (Keyword & Category)', filterRes.status === 200 && filteredProds.length > 0, `Matched: ${filteredProds[0]?.name}`);

  // 2.4 Get Featured & Top Rated Products
  const featRes = await client.get('/products/featured');
  const topRes = await client.get('/products/top-rated');
  record('Catalog', 'Get Featured Products', featRes.status === 200 && featRes.data.length > 0);
  record('Catalog', 'Get Top-Rated Products', topRes.status === 200 && topRes.data.length > 0);

  // 2.5 Product Details & AI Features
  const singleProdRes = await client.get('/products/1');
  record('Catalog', 'Get Product Details by ID', singleProdRes.status === 200 && singleProdRes.data.name.includes('AeroPro'));

  const sentimentRes = await client.get('/ai/sentiment-analysis/1');
  record('AI', 'AI Review Sentiment Consensus', sentimentRes.status === 200 && sentimentRes.data.sentimentScore > 0, `Score: ${sentimentRes.data.sentimentScore}% Positive`);

  const relatedRes = await client.get('/ai/related/1');
  record('AI', 'AI Related Products', relatedRes.status === 200 && relatedRes.data.length > 0);

  const reviewsRes = await client.get('/reviews/product/1');
  record('Reviews', 'Get Product Reviews', reviewsRes.status === 200 && reviewsRes.data.length > 0, `Count: ${reviewsRes.data.length}`);

  // ----------------------------------------------------------------
  // 3. WISHLIST OPERATIONS
  // ----------------------------------------------------------------
  console.log('\n--- SUITE 3: WISHLIST OPERATIONS ---');
  const custHeaders = { Authorization: `Bearer ${customerToken}` };

  // 3.1 Add to Wishlist
  const addWishRes = await client.post('/wishlist/2', {}, { headers: custHeaders });
  record('Wishlist', 'Add Product #2 to Wishlist', addWishRes.status === 200);

  // 3.2 Get Wishlist
  const getWishRes = await client.get('/wishlist', { headers: custHeaders });
  const hasItem = getWishRes.data.some(p => p.id === 2);
  record('Wishlist', 'Get Customer Wishlist', getWishRes.status === 200 && hasItem, `Items: ${getWishRes.data.length}`);

  // 3.3 Remove from Wishlist (200 or 204 No Content)
  const remWishRes = await client.delete('/wishlist/2', { headers: custHeaders });
  record('Wishlist', 'Remove Product #2 from Wishlist', remWishRes.status === 200 || remWishRes.status === 204);

  // ----------------------------------------------------------------
  // 4. MULTI-VENDOR CART OPERATIONS
  // ----------------------------------------------------------------
  console.log('\n--- SUITE 4: UNIFIED MULTI-VENDOR CART ---');

  // 4.1 Clear Cart first
  await client.delete('/cart/clear', { headers: custHeaders });
  const afterClear = await client.get('/cart', { headers: custHeaders });
  record('Cart', 'Clear Entire Cart', afterClear.status === 200 && (!afterClear.data?.items || afterClear.data.items.length === 0));

  // 4.2 Add Product from Seller 1 (TechHub: Product #1)
  const addCart1 = await client.post('/cart/items', { productId: 1, quantity: 1 }, { headers: custHeaders });
  record('Cart', 'Add Product from Seller 1 (TechHub)', addCart1.status === 200 && addCart1.data?.items?.length === 1);

  // 4.3 Add Product from Seller 2 (StyleVerse: Product #4)
  const addCart2 = await client.post('/cart/items', { productId: 4, quantity: 2 }, { headers: custHeaders });
  const itemsInCart = addCart2.data?.items || [];
  const uniqueSellers = new Set(itemsInCart.map(i => i.sellerId));
  record('Cart', 'Add Product from Seller 2 (Multi-Vendor Cart)', addCart2.status === 200 && uniqueSellers.size === 2, `Distinct Sellers in Cart: ${uniqueSellers.size}`);

  // 4.4 Update Cart Item Quantity (Increment)
  const cartItemId1 = itemsInCart[0].id;
  const updateQtyRes = await client.put(`/cart/items/${cartItemId1}`, { quantity: 3 }, { headers: custHeaders });
  record('Cart', 'Update Item Quantity (Increment to 3)', updateQtyRes.status === 200 && updateQtyRes.data?.items?.find(i => i.id === cartItemId1)?.quantity === 3);

  // 4.5 Decrement Item Quantity via "-" (Update to 2)
  const decQtyRes = await client.put(`/cart/items/${cartItemId1}`, { quantity: 2 }, { headers: custHeaders });
  record('Cart', 'Decrement Item Quantity (to 2)', decQtyRes.status === 200 && decQtyRes.data?.items?.find(i => i.id === cartItemId1)?.quantity === 2);

  // 4.6 Remove Single Item from Cart via "-" at 1 (or delete endpoint)
  // Let's add a 3rd temporary item to test single item removal
  const addCartTemp = await client.post('/cart/items', { productId: 2, quantity: 1 }, { headers: custHeaders });
  const tempItem = addCartTemp.data?.items?.find(i => i.productId === 2);
  const remRes = await client.delete(`/cart/items/${tempItem.id}`, { headers: custHeaders });
  const stillHasTemp = remRes.data?.items?.some(i => i.id === tempItem.id);
  record('Cart', 'Remove Item via DELETE /cart/items/{id}', remRes.status === 200 && !stillHasTemp, `Items remaining: ${remRes.data?.items?.length}`);

  // 4.7 Decrement Item Quantity to 0 (Auto-removal)
  const addCartTemp2 = await client.post('/cart/items', { productId: 2, quantity: 1 }, { headers: custHeaders });
  const tempItem2 = addCartTemp2.data?.items?.find(i => i.productId === 2);
  const decToZeroRes = await client.put(`/cart/items/${tempItem2.id}`, { quantity: 0 }, { headers: custHeaders });
  const stillHasTemp2 = decToZeroRes.data?.items?.some(i => i.id === tempItem2.id);
  record('Cart', 'Decrement Item to 0 (Auto-removes Item)', decToZeroRes.status === 200 && !stillHasTemp2);

  // 4.8 Fetch Cart
  const getCartRes = await client.get('/cart', { headers: custHeaders });
  record('Cart', 'Get Unified Multi-Vendor Cart', getCartRes.status === 200 && getCartRes.data.subtotal > 0, `Cart Subtotal: ₹${getCartRes.data.subtotal}`);

  // ----------------------------------------------------------------
  // 5. COUPONS, FRAUD CHECK & CHECKOUT (ORDER SPLITTING)
  // ----------------------------------------------------------------
  console.log('\n--- SUITE 5: CHECKOUT & MULTI-VENDOR ORDER SPLITTING ---');

  // 5.1 Validate Coupon Code
  const valCouponRes = await client.post('/coupons/validate', {
    code: 'WELCOME10',
    orderAmount: getCartRes.data.subtotal,
  });
  record('Coupon', 'Validate Coupon WELCOME10', valCouponRes.status === 200 && Number(valCouponRes.data.discountValue) === 10, `Discount: ${valCouponRes.data.discountValue}%`);

  // 5.2 AI Transaction Fraud Pre-Flight Check (Product Listing Evaluation)
  const fraudRes = await client.post('/ai/fraud-check', {
    productId: 1,
    title: 'ShopSphere AeroPro 15 Laptop',
    price: 89999.00,
  });
  record('AI', 'AI Pre-Flight Fraud Risk Scoring', fraudRes.status === 200 && fraudRes.data.riskLevel === 'LOW', `Risk: ${fraudRes.data.riskLevel}, Score: ${fraudRes.data.riskScore}`);

  // 5.3 Place Checkout Order
  const checkoutRes = await client.post('/orders/checkout', {
    shippingName: 'Alice Sharma',
    shippingPhone: '+91 98765 43210',
    shippingAddress: 'Flat 402, Green Glen Layout, Bellandur',
    shippingCity: 'Bengaluru',
    shippingState: 'Karnataka',
    shippingZip: '560103',
    shippingCountry: 'India',
    paymentMethod: 'CREDIT_CARD',
    couponCode: 'WELCOME10',
  }, { headers: custHeaders });

  const placedOrder = checkoutRes.data;
  const sellerOrders = placedOrder?.sellerOrders || [];
  const orderSplitSuccess = checkoutRes.status === 200 && sellerOrders.length === 2;
  record('Order', 'Execute Checkout with Multi-Vendor Order Splitting', orderSplitSuccess, `Master: ${placedOrder?.orderNumber}, Sub-Orders: ${sellerOrders.length}`);

  let subOrder1 = sellerOrders[0];

  // 5.4 Get Customer Order History
  const myOrdersRes = await client.get('/orders/my-orders', { headers: custHeaders });
  record('Order', 'Fetch Customer My Orders History', myOrdersRes.status === 200 && myOrdersRes.data.length > 0);

  // ----------------------------------------------------------------
  // 6. SELLER DASHBOARD & OPERATIONS
  // ----------------------------------------------------------------
  console.log('\n--- SUITE 6: SELLER OPERATIONS ---');
  const sellerHeaders = { Authorization: `Bearer ${sellerToken}` };

  // 6.1 Get Seller Dashboard Stats
  const sellerDashRes = await client.get('/seller/dashboard', { headers: sellerHeaders });
  record('Seller', 'Get Seller Dashboard Metrics', sellerDashRes.status === 200 && sellerDashRes.data.storeName.includes('TechHub'), `Store: ${sellerDashRes.data.storeName}`);

  // 6.2 Get Seller Products
  const sellerProdsRes = await client.get('/seller/products', { headers: sellerHeaders });
  record('Seller', 'Get Seller Store Products', sellerProdsRes.status === 200 && sellerProdsRes.data.length > 0, `Count: ${sellerProdsRes.data.length}`);

  // 6.3 AI Listing Copywriter
  const aiCopyRes = await client.post('/ai/generate-description', {
    title: 'Smart Ergonomic Office Mouse with Bluetooth 5.3',
    category: 'Electronics',
    keyFeatures: ['Silent clicks', '4000 DPI sensor', 'Rechargeable battery'],
  });
  record('AI', 'AI Listing Copywriter & SEO Keywords', aiCopyRes.status === 200 && !!aiCopyRes.data.suggestedTitle, `Suggested: ${aiCopyRes.data.suggestedTitle?.slice(0, 40)}...`);

  // 6.4 Create New Product
  const newSku = `SKU-AUTO-${Date.now().toString().slice(-5)}`;
  const createProdRes = await client.post('/seller/products', {
    categoryId: 1,
    name: `ErgoTrack Pro Wireless Mouse ${newSku}`,
    description: 'Precision ergonomic wireless mouse with silent mechanical switches and dual Bluetooth connectivity.',
    highlights: 'Silent Clicks | 4000 DPI Sensor | Type-C Fast Charging',
    price: 1899.00,
    originalPrice: 2499.00,
    discountPercent: 24,
    sku: newSku,
    stockQuantity: 45,
    lowStockThreshold: 5,
    imageUrls: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
  }, { headers: sellerHeaders });
  const createdProdId = createProdRes.data?.id;
  record('Seller', 'Create New Product Listing', createProdRes.status === 200 && !!createdProdId, `Created ID: ${createdProdId}`);

  // 6.5 Update Inventory
  const updateInvRes = await client.put(`/seller/products/${createdProdId}/inventory`, {
    stockQuantity: 50,
    lowStockThreshold: 10,
  }, { headers: sellerHeaders });
  record('Seller', 'Update Product Inventory', updateInvRes.status === 200 && updateInvRes.data.stockQuantity === 50);

  // 6.6 View Incoming Seller Orders
  const sellerOrdersRes = await client.get('/seller/orders', { headers: sellerHeaders });
  record('Seller', 'Get Incoming Sub-Orders Queue', sellerOrdersRes.status === 200 && sellerOrdersRes.data.length > 0, `Incoming: ${sellerOrdersRes.data.length}`);

  // Progress sub-order status
  const techHubSubOrder = sellerOrdersRes.data.find(so => so.status === 'CONFIRMED' || so.status === 'PLACED');
  if (techHubSubOrder) {
    const updateSoStatus = await client.put(`/seller/orders/${techHubSubOrder.id}/status`, {
      status: 'PACKED',
    }, { headers: sellerHeaders });
    record('Seller', 'Progress Sub-Order Status to PACKED', updateSoStatus.status === 200 && updateSoStatus.data.status === 'PACKED');
  }

  // 6.7 AI Demand Prediction
  const demandRes = await client.get(`/ai/demand-prediction/${sellerId}`);
  record('AI', 'AI 30-Day Demand Forecasting for Seller', demandRes.status === 200 && demandRes.data.length > 0, `Forecasted items: ${demandRes.data.length}`);

  // 6.8 View Seller Settlements Ledger
  const sellerSettRes = await client.get('/seller/settlements', { headers: sellerHeaders });
  record('Seller', 'Get Seller Escrow Settlement Ledger', sellerSettRes.status === 200, `Settlement records: ${sellerSettRes.data.length}`);

  // ----------------------------------------------------------------
  // 7. DELIVERY PARTNER OPERATIONS
  // ----------------------------------------------------------------
  console.log('\n--- SUITE 7: DELIVERY PARTNER OPERATIONS ---');
  const deliveryHeaders = { Authorization: `Bearer ${deliveryToken}` };

  // 7.1 View Assigned Shipments
  const shipRes = await client.get('/delivery/shipments', { headers: deliveryHeaders });
  record('Delivery', 'Get Courier Assigned Manifest', shipRes.status === 200, `Shipments: ${shipRes.data.length}`);

  // 7.2 Progress Shipment Status
  if (shipRes.data.length > 0) {
    const targetShipment = shipRes.data[0];
    const updateShipStatus = await client.put(`/delivery/shipments/${targetShipment.id}/status`, {
      status: 'IN_TRANSIT',
      deliveryNotes: 'Dispatched from Bangalore Central Hub',
    }, { headers: deliveryHeaders });
    record('Delivery', 'Progress Shipment to IN_TRANSIT', updateShipStatus.status === 200, `Status: ${updateShipStatus.data.shipmentStatus || updateShipStatus.data.status}`);
  }

  // ----------------------------------------------------------------
  // 8. SUPPORT & DISPUTE DESK OPERATIONS
  // ----------------------------------------------------------------
  console.log('\n--- SUITE 8: CUSTOMER SUPPORT & DISPUTES ---');
  const supportHeaders = { Authorization: `Bearer ${supportToken}` };

  // 8.1 Customer creates a support ticket
  const createTicketRes = await client.post('/support/tickets', {
    orderId: placedOrder?.id,
    subject: 'Package dispatch schedule inquiry',
    description: 'Could you confirm when the second parcel from StyleVerse will be handed to FastShip courier?',
    priority: 'MEDIUM',
  }, { headers: custHeaders });
  const ticketId = createTicketRes.data?.id;
  record('Support', 'Customer Open Support Ticket', createTicketRes.status === 200 && !!ticketId, `Ticket #${ticketId}`);

  // 8.2 Support Agent views all tickets
  const allTicketsRes = await client.get('/support/tickets', { headers: supportHeaders });
  record('Support', 'Support Desk View All Tickets Queue', allTicketsRes.status === 200 && allTicketsRes.data.length > 0);

  // 8.3 Support Agent updates ticket status
  if (ticketId) {
    const updateTickRes = await client.put(`/support/tickets/${ticketId}/status`, {
      status: 'IN_PROGRESS',
    }, { headers: supportHeaders });
    record('Support', 'Support Agent Claim Ticket (IN_PROGRESS)', updateTickRes.status === 200 && updateTickRes.data.status === 'IN_PROGRESS');
  }

  // 8.4 Customer requests return on a sub-order
  if (subOrder1) {
    const retReqRes = await client.post('/support/returns', {
      orderId: placedOrder.id,
      sellerOrderId: subOrder1.id,
      reason: 'Ordered wrong specification by mistake',
    }, { headers: custHeaders });
    const returnId = retReqRes.data?.id;
    record('Support', 'Customer Request Return for Sub-Order', retReqRes.status === 200 && !!returnId, `Return #${returnId}`);

    // 8.5 Support Agent views all returns
    const allReturnsRes = await client.get('/support/returns', { headers: supportHeaders });
    record('Support', 'Support Desk View Returns Queue', allReturnsRes.status === 200 && allReturnsRes.data.length > 0);

    // 8.6 Support Agent 1-Click Approves Return & Issues Refund
    if (returnId) {
      const approveRetRes = await client.put(`/support/returns/${returnId}/approve`, {}, { headers: supportHeaders });
      record('Support', '1-Click Approve Return & Issue Refund', approveRetRes.status === 200 && !!approveRetRes.data.id, `Refund ID: ${approveRetRes.data?.id}, Status: ${approveRetRes.data?.status}`);
    }
  }

  // ----------------------------------------------------------------
  // 9. PLATFORM ADMIN CONSOLE OPERATIONS
  // ----------------------------------------------------------------
  console.log('\n--- SUITE 9: PLATFORM ADMIN CONSOLE ---');
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };

  // 9.1 Admin Dashboard Stats
  const adminDashRes = await client.get('/admin/dashboard', { headers: adminHeaders });
  record('Admin', 'Get Platform Dashboard GMV & Metrics', adminDashRes.status === 200 && adminDashRes.data.totalRevenue > 0, `GMV: ₹${adminDashRes.data.totalRevenue}, Comm: ₹${adminDashRes.data.totalCommissionEarned}`);

  // 9.2 Admin View Pending Sellers
  const pendSellersRes = await client.get('/admin/sellers/pending', { headers: adminHeaders });
  record('Admin', 'Get Pending Sellers Approval Queue', pendSellersRes.status === 200, `Pending count: ${pendSellersRes.data.length}`);

  // 9.3 Admin Approves a pending seller
  if (pendSellersRes.data.length > 0) {
    const sellerToApprove = pendSellersRes.data[0];
    const appSellerRes = await client.put(`/admin/sellers/${sellerToApprove.id}/approve`, {
      approve: true,
    }, { headers: adminHeaders });
    const isApproved = appSellerRes.status === 200 && (appSellerRes.data.status === 'APPROVED' || appSellerRes.data.status === 'ACTIVE');
    record('Admin', 'Approve Pending Seller Application', isApproved, `Status: ${appSellerRes.data?.status}`);
  }

  // 9.4 Admin View AI Suspicious Listings
  const suspRes = await client.get('/admin/suspicious-listings', { headers: adminHeaders });
  record('Admin', 'Get AI Suspicious Moderation Queue', suspRes.status === 200, `Flagged items: ${suspRes.data.length}`);

  // 9.5 Admin View & Release Settlements
  const allSettRes = await client.get('/admin/settlements', { headers: adminHeaders });
  record('Admin', 'Get Platform Escrow Settlements Ledger', allSettRes.status === 200, `Total settlements: ${allSettRes.data.length}`);

  const pendingSett = allSettRes.data.find(s => s.status === 'ESCROW_HELD' || s.status === 'PENDING');
  if (pendingSett) {
    const relSettRes = await client.put(`/admin/settlements/${pendingSett.id}/release`, {}, { headers: adminHeaders });
    const isReleased = relSettRes.status === 200 && (relSettRes.data.status === 'COMPLETED' || relSettRes.data.status === 'RELEASED');
    record('Admin', 'Release Escrow Payout to Vendor Account', isReleased, `Status: ${relSettRes.data?.status}, Ref: ${relSettRes.data?.transactionReference}`);
  }

  // 9.6 Admin Create Promo Coupon
  const promoCode = `FESTIVE${Date.now().toString().slice(-4)}`;
  const createCoupRes = await client.post('/coupons', {
    code: promoCode,
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderAmount: 2000,
    maxDiscountAmount: 3000,
    usageLimit: 250,
    active: true,
  }, { headers: adminHeaders });
  record('Admin', 'Create Promotional Coupon', createCoupRes.status === 200 && createCoupRes.data.code === promoCode, `Code: ${promoCode}`);

  // 9.7 Admin Toggle Coupon Status
  if (createCoupRes.data?.id) {
    const toggleCoupRes = await client.put(`/coupons/${createCoupRes.data.id}/toggle`, {}, { headers: adminHeaders });
    record('Admin', 'Toggle Coupon Active/Inactive Status', toggleCoupRes.status === 200);
  }

  // ----------------------------------------------------------------
  // SUMMARY RESULTS
  // ----------------------------------------------------------------
  console.log('\n================================================================');
  console.log('📊 TEST SUMMARY RESULTS');
  console.log('================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`Total Operations Checked: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter(r => !r.passed).forEach(r => console.log(`  - [${r.suite}] ${r.testName}: ${r.details}`));
  }
}

runTestSuite().catch(err => {
  console.error('Fatal execution error:', err);
});
