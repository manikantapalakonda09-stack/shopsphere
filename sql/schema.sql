-- ==============================================================================
-- SHOPSPHERE - MULTI-VENDOR E-COMMERCE MARKETPLACE
-- COMPLETE RELATIONAL DATABASE DDL SCHEMA FOR MYSQL
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS shopsphere_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopsphere_db;

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 3. USER ROLES JOIN TABLE
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. SELLERS
CREATE TABLE IF NOT EXISTS sellers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    store_name VARCHAR(150) NOT NULL,
    business_email VARCHAR(120),
    phone VARCHAR(30),
    store_description TEXT,
    business_address VARCHAR(255),
    tax_id VARCHAR(50),
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, SUSPENDED
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_ratings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_seller_status (status)
) ENGINE=InnoDB;

-- 5. SELLER PROFILES
CREATE TABLE IF NOT EXISTS seller_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL UNIQUE,
    banner_url VARCHAR(500),
    logo_url VARCHAR(500),
    bank_account_name VARCHAR(120),
    bank_account_number VARCHAR(100),
    bank_name VARCHAR(120),
    bank_routing_number VARCHAR(50),
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    shipping_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(30),
    country VARCHAR(100) DEFAULT 'India',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. SUPPORT AGENTS
CREATE TABLE IF NOT EXISTS support_agents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    department VARCHAR(100) DEFAULT 'Customer Resolution',
    active_tickets_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. DELIVERY PARTNERS
CREATE TABLE IF NOT EXISTS delivery_partners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    vehicle_type VARCHAR(50) DEFAULT 'Two Wheeler',
    license_plate VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    current_location VARCHAR(120),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    parent_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL,
    description TEXT,
    highlights TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percent INT DEFAULT 0,
    sku VARCHAR(100),
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPICIOUS, DRAFT
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason VARCHAR(255),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_product_seller (seller_id),
    INDEX idx_product_category (category_id),
    INDEX idx_product_status (status)
) ENGINE=InnoDB;

-- 11. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. INVENTORY
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    reserved_quantity INT NOT NULL DEFAULT 0,
    out_of_stock BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. CARTS
CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uk_cart_product (cart_id, product_id)
) ENGINE=InnoDB;

-- 15. WISHLISTS
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. WISHLIST ITEMS
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wishlist_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uk_wishlist_product (wishlist_id, product_id)
) ENGINE=InnoDB;

-- 17. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL, -- PERCENTAGE, FIXED
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0.00,
    max_discount DECIMAL(10,2),
    start_date TIMESTAMP NULL,
    expiry_date TIMESTAMP NULL,
    usage_limit INT DEFAULT 1000,
    times_used INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 18. ORDERS (MASTER ORDER)
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    coupon_code VARCHAR(50),
    shipping_name VARCHAR(120) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_zip VARCHAR(30) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL DEFAULT 'India',
    shipping_phone VARCHAR(30) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'CREDIT_CARD',
    payment_status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_order_customer (customer_id),
    INDEX idx_order_status (status)
) ENGINE=InnoDB;

-- 19. SELLER ORDERS (ORDER SPLIT PER SELLER)
CREATE TABLE IF NOT EXISTS seller_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    master_order_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    seller_order_number VARCHAR(60) NOT NULL UNIQUE,
    status VARCHAR(30) DEFAULT 'PENDING',
    subtotal DECIMAL(10,2) NOT NULL,
    seller_discount DECIMAL(10,2) DEFAULT 0.00,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    platform_commission DECIMAL(10,2) DEFAULT 0.00,
    seller_payable_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (master_order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES sellers(id),
    INDEX idx_seller_order_seller (seller_id),
    INDEX idx_seller_order_master (master_order_id)
) ENGINE=InnoDB;

-- 20. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(500),
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (seller_order_id) REFERENCES seller_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- 21. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'SUCCESS',
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 22. SHIPMENTS
CREATE TABLE IF NOT EXISTS shipments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_order_id BIGINT NOT NULL UNIQUE,
    delivery_partner_id BIGINT,
    tracking_number VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(30) DEFAULT 'ASSIGNED', -- ASSIGNED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED
    estimated_delivery TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    delivery_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_order_id) REFERENCES seller_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_partner_id) REFERENCES delivery_partners(id)
) ENGINE=InnoDB;

-- 23. SETTLEMENTS
CREATE TABLE IF NOT EXISTS settlements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_order_id BIGINT NOT NULL UNIQUE,
    seller_id BIGINT NOT NULL,
    gross_amount DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) NOT NULL,
    net_payable DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, PROCESSING, RELEASED, COMPLETED, ON_HOLD
    transaction_reference VARCHAR(100),
    released_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_order_id) REFERENCES seller_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
) ENGINE=InnoDB;

-- 24. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(120),
    rating INT NOT NULL,
    title VARCHAR(150),
    comment TEXT,
    sentiment_label VARCHAR(20) DEFAULT 'NEUTRAL', -- POSITIVE, NEUTRAL, NEGATIVE
    sentiment_score DECIMAL(4,3) DEFAULT 0.000,
    is_reported BOOLEAN DEFAULT FALSE,
    is_moderated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 25. SELLER REVIEWS
CREATE TABLE IF NOT EXISTS seller_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 26. RETURNS
CREATE TABLE IF NOT EXISTS returns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    seller_order_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'REQUESTED', -- REQUESTED, APPROVED, REJECTED, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_order_id) REFERENCES seller_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

-- 27. REFUNDS
CREATE TABLE IF NOT EXISTS refunds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    return_id BIGINT,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(30) DEFAULT 'INITIATED', -- INITIATED, PROCESSED, FAILED
    processed_at TIMESTAMP NULL,
    transaction_id VARCHAR(100),
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 28. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    order_id BIGINT,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(30) DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
    assigned_agent_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_agent_id) REFERENCES support_agents(id)
) ENGINE=InnoDB;

-- 29. DISPUTES
CREATE TABLE IF NOT EXISTS disputes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN', -- OPEN, UNDER_REVIEW, RESOLVED_CUSTOMER, RESOLVED_SELLER
    admin_decision TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
) ENGINE=InnoDB;

-- 30. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    link_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 31. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 32. BROWSING HISTORY
CREATE TABLE IF NOT EXISTS browsing_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 33. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL,
    score DECIMAL(4,3) DEFAULT 1.000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
