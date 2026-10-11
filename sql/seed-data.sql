-- ==============================================================================
-- SHOPSPHERE - REALISTIC SEED DATA FOR MULTI-VENDOR MARKETPLACE
-- Passwords for all demo accounts: 'password123'
-- BCrypt: $2a$10$VqGv2Wlhq7u7C17mJ0Z84Oq0R0W0b0L0p0O0q0R0W0b0L0p0O0q0R
-- Note: Spring Boot DataInitializer also ensures and updates valid BCrypt hashes on startup
-- ==============================================================================

USE shopsphere_db;

-- 1. SEED ROLES
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_SELLER'),
(3, 'ROLE_CUSTOMER'),
(4, 'ROLE_SUPPORT'),
(5, 'ROLE_DELIVERY')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED USERS (admin, sellers, customers, support, delivery)
-- BCrypt for 'password123': $2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6
INSERT INTO users (id, email, password, full_name, phone, enabled) VALUES
(1, 'admin@shopsphere.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'System Administrator', '+91 98765 43210', TRUE),
(2, 'seller@techhub.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'Vikram Malhotra', '+91 98765 11111', TRUE),
(3, 'seller@fashionforward.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'Ananya Kapoor', '+91 98765 22222', TRUE),
(4, 'seller@artisanroast.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'Karan Mehta', '+91 98765 33333', TRUE),
(5, 'seller@ecoliving.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'Sneha Roy', '+91 98765 44444', TRUE),
(6, 'customer@gmail.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'Alice Sharma', '+91 98765 55555', TRUE),
(7, 'bob@gmail.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'Bob Verma', '+91 98765 66666', TRUE),
(8, 'support@shopsphere.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'Priya Singh', '+91 98765 77777', TRUE),
(9, 'delivery@fastship.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z17wXc5fveAeq6', 'Ravi Kumar', '+91 98765 88888', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 3. USER ROLES ASSIGNMENT
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Admin -> ROLE_ADMIN
(2, 2), -- TechHub -> ROLE_SELLER
(3, 2), -- FashionForward -> ROLE_SELLER
(4, 2), -- ArtisanRoast -> ROLE_SELLER
(5, 2), -- EcoLiving -> ROLE_SELLER
(6, 3), -- Alice -> ROLE_CUSTOMER
(7, 3), -- Bob -> ROLE_CUSTOMER
(8, 4), -- Priya -> ROLE_SUPPORT
(9, 5); -- Ravi -> ROLE_DELIVERY

-- 4. SELLER PROFILES & DATA
INSERT INTO sellers (id, user_id, store_name, business_email, phone, store_description, business_address, tax_id, status, commission_rate, rating, total_ratings) VALUES
(1, 2, 'TechHub Electronics', 'contact@techhub.com', '+91 98765 11111', 'Official flagship store for cutting-edge consumer electronics, audio gear, and computing accessories.', 'Sector 62, Noida, UP, India', 'GSTIN07AABCT2341M1Z5', 'APPROVED', 10.00, 4.85, 128),
(2, 3, 'Fashion Forward Boutique', 'support@fashionforward.com', '+91 98765 22222', 'Contemporary high-street and artisan handcrafted apparel, jackets, and accessories for men and women.', 'Bandra West, Mumbai, MH, India', 'GSTIN27AAACF8912K1Z2', 'APPROVED', 12.00, 4.70, 95),
(3, 4, 'Artisan Roast Gourmet', 'orders@artisanroast.com', '+91 98765 33333', 'Specialty micro-batch roasted single-origin coffees, organic teas, and precision brewing gear.', 'Indiranagar, Bengaluru, KA, India', 'GSTIN29AAAGR4412L1Z9', 'APPROVED', 8.00, 4.92, 64),
(4, 5, 'EcoLiving Essentials', 'hello@ecoliving.com', '+91 98765 44444', 'Zero-waste lifestyle essentials, organic bamboo homeware, and sustainable living accessories.', 'Koramangala, Bengaluru, KA, India', 'GSTIN29AAAEZ1122J1Z3', 'PENDING', 10.00, 5.00, 0)
ON DUPLICATE KEY UPDATE store_name=VALUES(store_name);

INSERT INTO seller_profiles (id, seller_id, banner_url, logo_url, bank_account_name, bank_account_number, bank_name, bank_routing_number) VALUES
(1, 1, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200', 'TechHub Solutions Pvt Ltd', '91238491023910', 'HDFC Bank', 'HDFC0001234'),
(2, 2, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=200', 'Fashion Forward Styles LLP', '81293810293120', 'ICICI Bank', 'ICIC0005678'),
(3, 3, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200', 'Artisan Coffee Roasters', '71293819203911', 'State Bank of India', 'SBIN0009876')
ON DUPLICATE KEY UPDATE bank_name=VALUES(bank_name);

-- 5. CUSTOMERS
INSERT INTO customers (id, user_id, shipping_address, city, state, postal_code, country) VALUES
(1, 6, 'Flat 402, Green Glen Layout, Bellandur', 'Bengaluru', 'Karnataka', '560103', 'India'),
(2, 7, 'B-12, Green Park Main', 'New Delhi', 'Delhi', '110016', 'India')
ON DUPLICATE KEY UPDATE shipping_address=VALUES(shipping_address);

-- 6. SUPPORT & DELIVERY PROFILES
INSERT INTO support_agents (id, user_id, department, active_tickets_count) VALUES
(1, 8, 'Customer Resolution & Disputes', 2)
ON DUPLICATE KEY UPDATE department=VALUES(department);

INSERT INTO delivery_partners (id, user_id, vehicle_type, license_plate, is_available, current_location) VALUES
(1, 9, 'Electric Van', 'KA-01-EQ-9876', TRUE, 'Bengaluru Central Hub')
ON DUPLICATE KEY UPDATE vehicle_type=VALUES(vehicle_type);

-- 7. CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, active) VALUES
(1, 'Electronics', 'electronics', 'Laptops, smart wearables, monitors, and audio equipment', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', TRUE),
(2, 'Fashion & Apparel', 'fashion-apparel', 'Trendy styles, jackets, knitwear, and lifestyle accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', TRUE),
(3, 'Gourmet & Beverage', 'gourmet-beverage', 'Specialty artisan coffee, fine teas, and brewing accessories', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400', TRUE),
(4, 'Home & Living', 'home-living', 'Modern home decor, kitchenware, and sustainable essentials', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400', TRUE),
(5, 'Health & Wellness', 'health-wellness', 'Fitness gear, ergonomics, and wellness products', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 8. PRODUCTS
INSERT INTO products (id, seller_id, category_id, name, slug, description, highlights, price, original_price, discount_percent, sku, status, is_flagged, average_rating, total_reviews, total_sales) VALUES
-- TechHub Products (Seller 1)
(1, 1, 1, 'ShopSphere AeroPro 15 Laptop', 'shopsphere-aeropro-15-laptop', 'Ultra-thin aluminum chassis equipped with latest-gen 10-core processor, 32GB RAM, 1TB NVMe SSD, and vivid 15.6" Retina display. Designed for developers, creators, and power users.', '10-Core Processor | 32GB DDR5 RAM | 1TB NVMe SSD | 18hr Battery Life | 15.6" QHD Display', 89999.00, 99999.00, 10, 'TECH-LAP-001', 'ACTIVE', FALSE, 4.90, 48, 120),
(2, 1, 1, 'AcousticMax Active Noise Cancelling Headphones', 'acousticmax-anc-headphones', 'Engineered with custom 40mm graphene dynamic drivers, active hybrid noise cancellation up to 42dB, and 50-hour battery life with USB-C quick charge.', '42dB Hybrid ANC | 50h Playback | Multipoint Bluetooth 5.3 | Ultra-soft Memory Foam Cushions', 7499.00, 9999.00, 25, 'TECH-AUD-002', 'ACTIVE', FALSE, 4.80, 62, 230),
(3, 1, 1, 'UltraVision 27" 4K HDR Creator Monitor', 'ultravision-27-4k-hdr-monitor', 'IPS Black panel delivering 99% DCI-P3 color gamut, factory color calibrated Delta E < 2, 65W USB-C single cable power delivery, and ergonomic pivot stand.', '4K UHD 3840x2160 | 99% DCI-P3 | Delta E < 2 | 65W USB-C PD | Built-in KVM Switch', 32999.00, 37999.00, 13, 'TECH-MON-003', 'ACTIVE', FALSE, 4.75, 18, 45),

-- FashionForward Products (Seller 2)
(4, 2, 2, 'Artisan Handcrafted Tuscan Leather Jacket', 'artisan-tuscan-leather-jacket', 'Tailored from full-grain vegetable-tanned Italian leather with heavy-duty antique brass YKK zippers and breathable viscose satin lining. Ages with a distinctive vintage patina.', '100% Full-Grain Tuscan Leather | Antique Brass Hardware | Satin Lined | Water-Resistant Finish', 14999.00, 18999.00, 21, 'FASH-JKT-001', 'ACTIVE', FALSE, 4.85, 34, 88),
(5, 2, 2, 'Merino Luxe Classic Crewneck Sweater', 'merino-luxe-crewneck-sweater', 'Spun from superfine 19.5 micron Australian Merino wool. Naturally thermo-regulating, moisture-wicking, and exceptionally soft against sensitive skin.', '100% Superfine Merino Wool | Thermal Regulating | Anti-Pilling Knit | Ribbed Cuffs and Hem', 3499.00, 4499.00, 22, 'FASH-SWT-002', 'ACTIVE', FALSE, 4.65, 29, 142),
(6, 2, 2, 'Aviator Classic Polarized Titanium Sunglasses', 'aviator-classic-polarized-sunglasses', 'Featherweight Japanese titanium frame with polarized gradient polycarbonate lenses providing 100% UV400 blocking and anti-reflective coating.', 'Japanese Pure Titanium | UV400 Polarized | Scratch-Resistant Coating | Lightweight 18g', 4299.00, 5999.00, 28, 'FASH-SGL-003', 'ACTIVE', FALSE, 4.70, 32, 95),

-- ArtisanRoast Products (Seller 3)
(7, 3, 3, 'Single-Origin Ethiopian Yirgacheffe Whole Beans (500g)', 'ethiopian-yirgacheffe-whole-beans-500g', 'Fair-trade single-origin Arabica grown at 2100m elevation. Light-medium roast boasting tasting notes of fragrant jasmine, bergamot citrus, and sweet honey nectar.', 'Washed Process | Elevation 2100m | Tasting Notes: Jasmine, Bergamot, Honey | Freshly Roasted', 899.00, 1099.00, 18, 'GOUR-COF-001', 'ACTIVE', FALSE, 4.95, 41, 310),
(8, 3, 3, 'Precision Barista Pour-Over Gooseneck Kettle (800ml)', 'precision-barista-gooseneck-kettle', 'Matte black stainless steel kettle featuring an ergonomic counterbalanced handle and precise 6mm gooseneck spout for laminar water flow control.', 'Food-Grade 304 Stainless Steel | Built-in Thermometer | 6mm Flow Restrictor Spout | Induction Compatible', 2499.00, 3299.00, 24, 'GOUR-KET-002', 'ACTIVE', FALSE, 4.88, 23, 76),

-- Flagged / Suspicious Listing Demo for Admin Moderation
(9, 1, 1, 'LUXURY DIAMOND WATCH 99% OFF DIRECT WIRE ONLY', 'luxury-diamond-watch-suspicious', 'Exclusive limited stock genuine solid gold diamond timepiece. Do not pay on site, wire money directly to personal bank account for instant free dispatch.', 'Solid Gold | 100 Carat Diamonds | Wire Transfer Only | Hurry limited stock', 999.00, 999999.00, 99, 'SUSP-WAT-999', 'SUSPICIOUS', TRUE, 1.00, 1, 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 9. PRODUCT IMAGES
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES
(1, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', TRUE, 1),
(2, 2, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', TRUE, 1),
(3, 3, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', TRUE, 1),
(4, 4, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', TRUE, 1),
(5, 5, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', TRUE, 1),
(6, 6, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', TRUE, 1),
(7, 7, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', TRUE, 1),
(8, 8, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800', TRUE, 1),
(9, 9, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', TRUE, 1)
ON DUPLICATE KEY UPDATE image_url=VALUES(image_url);

-- 10. INVENTORY (Notice product 3 has 4 items in stock - low stock alert!)
INSERT INTO inventory (id, product_id, stock_quantity, low_stock_threshold, reserved_quantity, out_of_stock) VALUES
(1, 1, 25, 5, 0, FALSE),
(2, 2, 80, 10, 0, FALSE),
(3, 3, 4, 5, 0, FALSE), -- Low stock alert for TechHub!
(4, 4, 15, 3, 0, FALSE),
(5, 5, 45, 8, 0, FALSE),
(6, 6, 30, 5, 0, FALSE),
(7, 7, 120, 15, 0, FALSE),
(8, 8, 35, 5, 0, FALSE),
(9, 9, 0, 5, 0, TRUE)
ON DUPLICATE KEY UPDATE stock_quantity=VALUES(stock_quantity);

-- 11. COUPONS
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active) VALUES
(1, 'WELCOME50', 'PERCENTAGE', 10.00, 1000.00, 1500.00, 500, 12, TRUE),
(2, 'TECHSAVE15', 'PERCENTAGE', 15.00, 5000.00, 3000.00, 200, 5, TRUE),
(3, 'FLAT500', 'FIXED', 500.00, 2500.00, 500.00, 300, 18, TRUE)
ON DUPLICATE KEY UPDATE discount_value=VALUES(discount_value);

-- 12. SAMPLE MULTI-VENDOR MASTER ORDER & SPLIT SELLER ORDERS
-- Alice Sharma places an order containing items from TechHub (Seller 1) and Artisan Roast (Seller 3)
INSERT INTO orders (id, order_number, customer_id, status, subtotal, discount_amount, shipping_fee, total_amount, coupon_code, shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, shipping_phone, payment_method, payment_status) VALUES
(1, 'ORD-2026-9081', 1, 'CONFIRMED', 8398.00, 500.00, 0.00, 7898.00, 'FLAT500', 'Alice Sharma', 'Flat 402, Green Glen Layout, Bellandur', 'Bengaluru', 'Karnataka', '560103', 'India', '+91 98765 55555', 'CREDIT_CARD', 'SUCCESS')
ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);

-- Split Order 1: Seller 1 (TechHub Headphones)
INSERT INTO seller_orders (id, master_order_id, seller_id, seller_order_number, status, subtotal, seller_discount, commission_rate, platform_commission, seller_payable_amount) VALUES
(1, 1, 1, 'SO-2026-9081-S1', 'PROCESSING', 7499.00, 450.00, 10.00, 704.90, 6344.10)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);

-- Split Order 2: Seller 3 (Artisan Roast Ethiopian Coffee)
INSERT INTO seller_orders (id, master_order_id, seller_id, seller_order_number, status, subtotal, seller_discount, commission_rate, platform_commission, seller_payable_amount) VALUES
(2, 1, 3, 'SO-2026-9081-S3', 'CONFIRMED', 899.00, 50.00, 8.00, 67.92, 781.08)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);

-- Order Items
INSERT INTO order_items (id, seller_order_id, product_id, product_name, product_image, unit_price, quantity, subtotal) VALUES
(1, 1, 2, 'AcousticMax Active Noise Cancelling Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 7499.00, 1, 7499.00),
(2, 2, 7, 'Single-Origin Ethiopian Yirgacheffe Whole Beans (500g)', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', 899.00, 1, 899.00)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);

-- Payment record
INSERT INTO payments (id, order_id, transaction_id, payment_method, status, amount, currency) VALUES
(1, 1, 'TXN-998877665544', 'CREDIT_CARD', 'SUCCESS', 7898.00, 'INR')
ON DUPLICATE KEY UPDATE transaction_id=VALUES(transaction_id);

-- Shipment for Seller Order 1
INSERT INTO shipments (id, seller_order_id, delivery_partner_id, tracking_number, status, delivery_notes) VALUES
(1, 1, 1, 'TRK-SS-2026-001', 'ASSIGNED', 'Please call upon reaching security gate.')
ON DUPLICATE KEY UPDATE tracking_number=VALUES(tracking_number);

-- Settlement records
INSERT INTO settlements (id, seller_order_id, seller_id, gross_amount, platform_commission, net_payable, status, transaction_reference) VALUES
(1, 1, 1, 7049.00, 704.90, 6344.10, 'PENDING', 'SETTL-TH-001'),
(2, 2, 3, 849.00, 67.92, 781.08, 'PENDING', 'SETTL-AR-001')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 13. REVIEWS & SENTIMENT
INSERT INTO reviews (id, product_id, customer_id, customer_name, rating, title, comment, sentiment_label, sentiment_score, is_reported, is_moderated) VALUES
(1, 1, 1, 'Alice Sharma', 5, 'Unmatched performance and battery!', 'Blown away by how fast the ShopSphere AeroPro compiles Java code and runs Docker containers. Battery easily lasts 14+ hours.', 'POSITIVE', 0.940, FALSE, TRUE),
(2, 2, 1, 'Alice Sharma', 5, 'Best ANC headphones at this price', 'The active noise cancellation blocks out café ambient chatter completely. Very comfortable for long work meetings.', 'POSITIVE', 0.910, FALSE, TRUE),
(3, 7, 2, 'Bob Verma', 5, 'Exquisite floral and citrus notes', 'One of the best Yirgacheffe roasts available online. Notes of bergamot and honey shine through on V60 pour over.', 'POSITIVE', 0.960, FALSE, TRUE),
(4, 9, 2, 'Bob Verma', 1, 'Clear scam listing reported', 'Seller requests external wire transfer and refused standard cart checkout. Highly suspicious.', 'NEGATIVE', -0.920, TRUE, FALSE)
ON DUPLICATE KEY UPDATE rating=VALUES(rating);

-- 14. SUPPORT TICKET DEMO
INSERT INTO support_tickets (id, customer_id, order_id, subject, description, priority, status, assigned_agent_id) VALUES
(1, 1, 1, 'Inquiry on delivery window', 'Hi, I need delivery of the headphones before Friday 4 PM as I am travelling.', 'MEDIUM', 'IN_PROGRESS', 1)
ON DUPLICATE KEY UPDATE subject=VALUES(subject);

-- 15. DISPUTE DEMO
INSERT INTO disputes (id, order_id, customer_id, seller_id, issue_type, details, status) VALUES
(1, 1, 1, 1, 'Packaging Feedback', 'Customer inquired about extra bubble wrap protection for electronics parcel.', 'OPEN')
ON DUPLICATE KEY UPDATE issue_type=VALUES(issue_type);
