# ShopSphere – Multi-Vendor E-Commerce Marketplace & AI Hub

> **Full-Stack Enterprise College/Final-Year Academic Submission**  
> **Backend:** Java 21 • Spring Boot 3.3.4 • Spring Security 6 (JWT + RBAC) • Spring Data JPA • Hibernate  
> **Database:** MySQL 8 (33 Relational Tables • Foreign Keys • Indexes • ACID Transactions)  
> **Frontend:** React 18 • Vite • Tailwind CSS • Lucide Icons • Context API  
> **AI Suite:** Recommendation Engine • Seller Copywriter • Review Sentiment Consensus • Fraud Risk Engine • Demand Forecasting  

---

## 1. Executive Summary & System Overview

**ShopSphere** is an enterprise-style multi-vendor e-commerce web platform engineered to solve the complex architectural challenges of modern marketplaces:
1. **Unified Multi-Vendor Cart & Smart Order Splitting:** Customers browse, add, and pay for products from multiple independent merchants in a single checkout session. The backend automatically splits the checkout into isolated `SellerOrder` records with separate tracking IDs, inventory decrementing, and escrow accounting.
2. **5 Practical AI Capabilities:** Practical machine intelligence for discovery, copy generation, sentiment analysis, transaction fraud checks, and 30-day demand forecasting.
3. **Comprehensive RBAC:** 5 distinct user roles (`ROLE_ADMIN`, `ROLE_SELLER`, `ROLE_CUSTOMER`, `ROLE_SUPPORT`, `ROLE_DELIVERY`) each with tailored dashboards and API route permissions.
4. **1-Click Test Personas:** Built-in demo switcher banner to test all 5 roles instantly without manual logout/login cycles.

---

## 2. Multi-Vendor Order Splitting Architecture

```
                    [ Customer Checkout ]
                              │
                    Unified Payment (₹23,498)
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
           [ Sub-Order #1 ]     [ Sub-Order #2 ]
           TechHub Solutions    StyleVerse Apparel
           ₹19,999 (1 item)     ₹3,499 (1 item)
                    │                   │
             Packed by Seller    Packed by Seller
                    │                   │
           Carrier Dispatched   Carrier Dispatched
           (Tracking: TRK-01)   (Tracking: TRK-02)
                    │                   │
            Doorstep Delivered   Doorstep Delivered
                    │                   │
           Escrow Released      Escrow Released
           (₹17,999.10 payout)  (₹3,149.10 payout)
           (10% Admin Fee)      (10% Admin Fee)
```

---

## 3. Technology Stack

| Layer | Technologies Used | Key Responsibilities |
| :--- | :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.3.4, Maven | REST APIs, Spring Security 6, JWT, JPA Repositories, Transaction Management |
| **Database** | MySQL 8.4 on Port 3308 | 33 relational tables, relational constraints, foreign keys, ACID compliance |
| **Frontend** | React 18, Vite 5, Tailwind CSS | Single-Page Application, state-driven navigation, context providers, responsive dashboards |
| **Icons & UI** | Lucide React, Plus Jakarta Sans font | Enterprise design aesthetic, status chips, interactive modals |
| **Security** | Spring Security 6, JJWT (HMAC-SHA512) | Stateless JWT authentication, role guards, BCrypt password hashing |
| **AI Suite** | Custom Java Machine Intelligence Engine | Real-time sentiment NLP, fraud heuristic scoring, demand velocity forecasting |

---

## 4. Default Demo Accounts (1-Click Switcher)

All default accounts use password: `password123`

| Role | Demo Email | Persona Name | Primary Dashboard Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@shopsphere.com` | System Administrator | GMV Revenue, Seller Approvals, AI Moderation Queue, Payout Releases, Coupon CRUD |
| **Seller** | `seller@techhub.com` | TechHub Solutions (Vikram) | Product CRUD + AI Copywriter, Sub-Orders fulfillment, AI Demand Forecast, Settlement ledger |
| **Customer** | `customer@gmail.com` | Alice Sharma | Unified multi-vendor cart, order division tracking, wishlist, dispute/ticket submission |
| **Support** | `support@shopsphere.com` | Priya Nair (Support Lead) | Customer ticket queue, dispute mediation with findings, 1-click return & refund approvals |
| **Delivery** | `delivery@fastship.com` | FastShip Logistics Partner | Assigned package manifests, tracking updates (`PICKED_UP` $\to$ `IN_TRANSIT` $\to$ `DELIVERED`) |

---

## 5. Modular AI Capabilities

### 1. AI Product Recommendation Engine (`AiRecommendationService.java`)
- Analyzes customer category viewing affinity, top-rated products, and sales velocity.
- Serves personalized suggestions on storefront home page and cart views.

### 2. AI Seller Listing Copywriter (`AiProductContentService.java`)
- Takes a product title, category, and raw specs.
- Produces persuasive marketing copy, SEO-optimized title variants, highlight bullet points, and trending search hashtags.

### 3. AI Review Sentiment Consensus (`AiReviewAnalysisService.java`)
- Performs NLP sentiment scoring on verified customer reviews.
- Outputs an overall percentage consensus score (e.g., 94% Positive), extracts key praise points, and highlights critical considerations.

### 4. AI Transaction Fraud Detection Engine (`AiFraudDetectionService.java`)
- Evaluates transaction risk before order completion based on velocity, cart value anomalies, destination country risk, and payment method heuristics.
- Flags suspicious listings or transactions for admin intervention.

### 5. AI Demand Prediction & Reorder Forecasting (`AiDemandPredictionService.java`)
- Calculates daily sales run-rates, applies category seasonal multipliers, and predicts 30-day unit demand.
- Computes estimated days until stockout and generates automated restocking recommendations ("URGENT RESTOCK", "STABLE", or "OVERSTOCK").

---

## 6. Database Relational Architecture (MySQL)

DDL Script: `sql/schema.sql` (33 tables)  
Seed Script: `sql/seed-data.sql`

Key Tables:
- `users`, `roles`, `user_roles`
- `sellers`, `customers`, `delivery_partners`
- `categories`, `products`, `product_images`, `inventories`
- `carts`, `cart_items`
- `orders` (Master order), `seller_orders` (Sub-orders per vendor), `order_items`
- `shipments`, `shipment_tracking_events`
- `coupons`, `coupon_usages`
- `reviews`, `review_votes`
- `settlements`, `payout_records`
- `support_tickets`, `ticket_messages`, `disputes`, `returns`, `refunds`

---

## 7. REST API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/login` – Authenticate with email/password, returns JWT token & user profile
- `POST /api/auth/register` – Register new customer
- `POST /api/auth/register-seller` – Register new merchant (pending admin approval)
- `GET /api/auth/profile` – Current authenticated user profile

### Products & Categories (`/api/products`, `/api/categories`)
- `GET /api/products` – Search products (keyword, category, seller, price, sort)
- `GET /api/products/{id}` – Product details with seller attribution
- `GET /api/products/featured` – Featured curated items
- `GET /api/products/top-rated` – Top customer rated products
- `GET /api/categories` – Hierarchical categories list

### Multi-Vendor Cart (`/api/cart`)
- `GET /api/cart` – View active cart with items from all sellers
- `POST /api/cart/items` – Add product to cart with quantity
- `PUT /api/cart/items/{id}` – Update quantity
- `DELETE /api/cart/items/{id}` – Remove item
- `DELETE /api/cart/clear` – Empty cart

### Orders & Checkout (`/api/orders`)
- `POST /api/orders/checkout` – Single checkout dividing into multi-seller sub-orders
- `GET /api/orders/my-orders` – Customer's orders with sub-order tracking breakdown
- `GET /api/orders/{id}` – Master order detail

### Seller Portal (`/api/seller`)
- `GET /api/seller/dashboard` – Seller metrics (sales, low stock, orders)
- `GET /api/seller/products` – Store products
- `POST /api/seller/products` – Create new listing
- `PUT /api/seller/products/{id}` – Update listing
- `DELETE /api/seller/products/{id}` – Delete listing
- `GET /api/seller/orders` – Incoming sub-orders for this merchant
- `PUT /api/seller/orders/{id}/status` – Advance fulfillment status (`CONFIRMED`, `PACKED`, `SHIPPED`)
- `GET /api/seller/settlements` – Payout ledger

### Delivery Hub (`/api/delivery`)
- `GET /api/delivery/shipments` – Assigned delivery packages
- `PUT /api/delivery/shipments/{id}/status` – Advance courier status (`PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`)

### Platform Administration (`/api/admin`)
- `GET /api/admin/dashboard` – Platform GMV, commissions, active counts
- `GET /api/admin/sellers/pending` – Merchants awaiting verification
- `PUT /api/admin/sellers/{id}/approve` – Approve or reject seller
- `GET /api/admin/suspicious-listings` – AI-flagged listings
- `PUT /api/admin/listings/{id}/moderate` – Approve or take down flagged listing
- `GET /api/admin/settlements` – Platform escrow ledger
- `PUT /api/admin/settlements/{id}/release` – Release escrow payout to vendor

### AI Hub (`/api/ai`)
- `GET /api/ai/recommendations` – Smart personalized recommendations
- `GET /api/ai/related/{productId}` – Content-matched related items
- `POST /api/ai/generate-description` – Listing copywriter & SEO keywords
- `GET /api/ai/sentiment-analysis/{productId}` – Review consensus & pros/cons
- `POST /api/ai/fraud-check` – Transaction risk assessment
- `GET /api/ai/demand-prediction/{sellerId}` – 30-day velocity forecast & restock triggers

---

## 8. Step-by-Step Running Guide

### Prerequisites
- Java 21 JDK installed (`java -version`)
- MySQL 8.x running
- Node.js 18+ and npm installed

### 1. Database Setup
Ensure MySQL is running. Run the schema and seed scripts:
```bash
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed-data.sql
```

### 2. Run Spring Boot Backend
```bash
cd backend
./mvnw clean spring-boot:run
```
Backend runs on `http://localhost:8080`.

### 3. Run React Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 9. Academic Viva Voce Defense Points

When presenting this project for college examination or technical interview:
1. **Explain the Cart Division:** Emphasize that the customer pays once (`orders` table), but the platform immediately splits the transaction into isolated `seller_orders` records. Each merchant only sees their own products and cannot view products sold by competing sellers in the same customer order.
2. **Explain the Escrow Lifecycle:** Show how customer funds are stored in an escrow status (`ESCROW_HELD`) upon checkout and are only transitioned to `RELEASED` once the delivery partner marks the package as `DELIVERED` and any dispute window closes.
3. **Highlight the AI Implementations:** Demonstrate the real-time review sentiment scoring, the automated seller listing copywriter, and the 30-day demand prediction table with days-until-stockout countdowns.
4. **Demonstrate Role Separation:** Use the top **Demo Switcher** to switch between Administrator, Merchant, Customer, Support Specialist, and Logistics Partner in front of the evaluators.
