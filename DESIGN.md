# 🥛 Organic Dairy & Farm Products Platform
## System Design Document (SDD)
**Version:** 1.1  
**Status:** ✅ Confirmed — Supabase + Dummy Payment (Phase 1)  
**Based on:** PRD v1.0 (Updated April 2026)

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Database Decision — Recommendation](#2-database-decision--recommendation)
3. [Full Database Schema](#3-full-database-schema)
4. [Data Access Layer (DAL)](#4-data-access-layer-dal)
5. [API Design](#5-api-design)
6. [Authentication Strategy](#6-authentication-strategy)
7. [File Storage Strategy](#7-file-storage-strategy)
8. [Notification Strategy](#8-notification-strategy)
9. [Frontend Architecture](#9-frontend-architecture)
10. [UI Design System](#10-ui-design-system)
11. [Page-by-Page Structure](#11-page-by-page-structure)
12. [Security Model](#12-security-model)
13. [Phased Roadmap](#13-phased-roadmap)

---

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                     Next.js Application                        │
│                                                                │
│   /           (User Platform)                                  │
│   /admin       (Admin Platform)                                │
│                                                                │
│   ┌──────────────────────┐  ┌──────────────────────┐          │
│   │   React Components   │  │   Next.js API Routes │          │
│   │   (Client-side UI)   │  │   /api/...           │          │
│   └──────────────────────┘  └──────────┬───────────┘          │
│                                        │                       │
│                              ┌─────────▼──────────┐           │
│                              │  Data Access Layer  │           │
│                              │      (DAL)          │           │
│                              └─────────┬───────────┘           │
└────────────────────────────────────────┼───────────────────────┘
                                         │
                    ┌────────────────────▼───────────────────────┐
                    │           Supabase (Recommended)            │
                    │                                             │
                    │  ┌───────────┐  ┌──────────┐  ┌────────┐  │
                    │  │PostgreSQL │  │   Auth   │  │Storage │  │
                    │  │  (Data)   │  │  (OTP)   │  │(Media) │  │
                    │  └───────────┘  └──────────┘  └────────┘  │
                    └─────────────────────────────────────────────┘
                                         │
                    ┌────────────────────▼───────────────────────┐
                    │           External Services                  │
                    │  Twilio (SMS OTP) │ Dummy Payment (Phase 1)  │
                    │  Resend (Email)   │ Real Gateway (Phase 2)   │
                    └─────────────────────────────────────────────┘
```

### Architecture Decision: Single Next.js App (Option A from PRD)
- `/` → User / Customer Platform  
- `/admin` → Admin Backoffice Platform  
- Route protection via Next.js middleware + Role-Based Access Control (RBAC)

---

## 2. Database Decision — Recommendation

> **✅ CONFIRMED: Supabase — Connect API (PostgREST)**

### Why Supabase Wins for This Platform

| Criteria | Supabase ✅ | Firebase ⚠️ |
|---|---|---|
| **Data model fit** | PostgreSQL — perfect for relational data (orders ↔ items ↔ inventory) | NoSQL — requires complex denormalization |
| **Transactions (ACID)** | ✅ Full ACID — critical for wallet deduction + inventory decrement atomically | ⚠️ Limited — multi-document transactions are complex |
| **P&L queries** | ✅ SQL aggregations, joins, GROUP BY — native | ❌ Must be done in application code or Cloud Functions |
| **Subscription scheduling** | ✅ Complex date-range queries with PostgreSQL | ⚠️ Requires Firestore workarounds |
| **Pricing** | Predictable tiers, unlimited API calls | Pay-per-read/write — can spike with subscription logic |
| **REST API (DAL-friendly)** | ✅ Auto-generated REST API via PostgREST + `supabase-js` | Firebase SDK (not true REST by default) |
| **Row Level Security** | ✅ Built into PostgreSQL — users only see their data | Separate security rules file — harder to audit |
| **Vendor lock-in** | ❌ None — standard PostgreSQL, self-hostable | ⚠️ Proprietary — migration is painful |
| **Next.js integration** | ✅ `@supabase/ssr` package — server components + middleware | ✅ Firebase Admin SDK for server routes |
| **Auth (OTP/Phone)** | ✅ Built-in Phone/OTP via Twilio integration | ✅ Native Phone Auth |

### The Single Deciding Factor for Your App
Your P&L Dashboard requires: aggregations across orders, finance_records, and subscriptions — across date ranges, categories, and product lines. In PostgreSQL this is a single SQL query. In Firestore this requires Cloud Functions, multiple reads, and application-level joins. **Supabase is the clear choice.**

### How You Connect Via Supabase Connect API (PostgREST)

**What is the Connect API?**  
Supabase auto-generates a full REST API on top of your PostgreSQL database using **PostgREST**. Every table and view you create instantly gets REST endpoints — no manual API coding required for standard CRUD. This is Supabase's "Connect API."

```
App Code  →  DAL Function  →  supabase-js client  →  Supabase Connect API (PostgREST)  →  PostgreSQL

Example REST calls generated automatically:
  GET    https://<project>.supabase.co/rest/v1/products          ← list products
  GET    https://<project>.supabase.co/rest/v1/orders?user_id=eq.{id}
  POST   https://<project>.supabase.co/rest/v1/orders            ← create order
  PATCH  https://<project>.supabase.co/rest/v1/orders?id=eq.{id} ← update order
```

**Important:** You never call these URLs directly. The `supabase-js` SDK wraps them cleanly:  
```typescript
// This is all you write in a DAL function — supabase-js handles the REST call
const { data, error } = await supabase
  .from('orders')
  .select('*, order_items(*), products(*)')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

**For complex operations** (e.g. create order + decrement stock + deduct wallet atomically),  
use Supabase `rpc()` which calls a PostgreSQL stored procedure — still via the Connect API:
```typescript
const { data, error } = await supabase.rpc('create_order_transaction', {
  p_user_id: userId,
  p_items: cartItems,
  p_payment_method: 'wallet'
})
```

The DAL is the **only place** that imports `supabase-js`. Components call DAL functions only.

---

## 3. Full Database Schema

### 3.1 Users Table
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE,
  name          TEXT,
  role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'delivery_agent')),
  wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  address       JSONB,          -- { street, city, pincode, lat, lng }
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Categories Table
```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,           -- "Milk & Dairy", "Organic Oils"
  slug        TEXT UNIQUE NOT NULL,
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE
);
```

### 3.3 Products Table
```sql
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID REFERENCES categories(id),
  name            TEXT NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2) NOT NULL,
  unit            TEXT NOT NULL,       -- "500ml", "1L", "1kg"
  stock           INT NOT NULL DEFAULT 0,
  image_url       TEXT,
  farm_name       TEXT,               -- Organic trust layer
  farm_location   TEXT,
  certification   TEXT,               -- "NPOP Certified", "India Organic"
  batch_info      TEXT,
  is_subscription_eligible BOOLEAN DEFAULT TRUE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.4 Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id),
  quantity        INT NOT NULL DEFAULT 1,
  schedule        TEXT NOT NULL CHECK (schedule IN ('daily', 'alternate_day', 'custom')),
  custom_days     INT[],              -- [1,3,5] = Mon, Wed, Fri (if custom)
  start_date      DATE NOT NULL,
  end_date        DATE,               -- NULL = ongoing
  status          TEXT NOT NULL DEFAULT 'active' 
                  CHECK (status IN ('active', 'paused', 'cancelled')),
  pause_from      DATE,
  pause_until     DATE,
  next_delivery   DATE,
  delivery_address JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5 Orders Table
```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),  -- NULL for one-time orders
  order_type      TEXT NOT NULL CHECK (order_type IN ('one_time', 'subscription')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'out_for_delivery', 'delivered', 'failed', 'cancelled', 'refunded')),
  total_amount    DECIMAL(10,2) NOT NULL,
  delivery_address JSONB NOT NULL,
  delivery_date   DATE,
  delivery_slot   TEXT,               -- "6AM-9AM"
  payment_method  TEXT CHECK (payment_method IN ('wallet', 'dummy', 'online', 'cod')),
  -- 'dummy' = test mode only; 'online' = real gateway (Phase 2)
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.6 Order Items Table
```sql
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  quantity    INT NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,  -- price at time of order (snapshot)
  subtotal    DECIMAL(10,2) NOT NULL
);
```

### 3.7 Inventory Table
```sql
CREATE TABLE inventory (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID REFERENCES products(id),
  batch_number    TEXT,
  quantity        INT NOT NULL,
  production_date DATE,
  expiry_date     DATE NOT NULL,
  wastage         INT DEFAULT 0,
  notes           TEXT,
  created_by      UUID REFERENCES users(id),  -- Admin who entered
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.8 Wallet Transactions Table
```sql
CREATE TABLE wallet_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  type            TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount          DECIMAL(10,2) NOT NULL,
  reason          TEXT,               -- "Order payment", "Refund", "Top-up"
  reference_id    UUID,               -- order_id or payment_id
  balance_after   DECIMAL(10,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.9 Finance Records Table ⭐ (P&L Engine)
```sql
CREATE TABLE finance_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  category    TEXT NOT NULL,          -- "sales", "production_cost", "logistics", "operations"
  sub_category TEXT,                  -- "milk_sales", "fuel", "packaging"
  amount      DECIMAL(10,2) NOT NULL,
  order_id    UUID REFERENCES orders(id),  -- linked to order if revenue
  product_id  UUID REFERENCES products(id),
  date        DATE NOT NULL,
  description TEXT,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.10 Delivery Agents Table (Phase 2)
```sql
CREATE TABLE delivery_agents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  vehicle_no  TEXT,
  zone        TEXT,
  is_active   BOOLEAN DEFAULT TRUE
);
```

### 3.11 Notifications Table
```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  type        TEXT NOT NULL,          -- "order_update", "delivery_alert", "subscription_reminder"
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.12 Coupons Table
```sql
CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  discount_type   TEXT CHECK (discount_type IN ('flat', 'percentage')),
  discount_value  DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_uses        INT,
  used_count      INT DEFAULT 0,
  valid_from      DATE,
  valid_until     DATE,
  is_active       BOOLEAN DEFAULT TRUE
);
```

---

## 4. Data Access Layer (DAL)

All DB interactions are **exclusively through DAL functions**. Components never call Supabase directly.

### File Structure
```
src/
  lib/
    supabase/
      client.ts          ← Browser client (supabase-js)
      server.ts          ← Server-side client (Next.js SSR)
    dal/
      users.dal.ts       ← createUser(), getUserById(), updateWallet()
      products.dal.ts    ← getProducts(), getProductById(), updateStock()
      orders.dal.ts      ← createOrder(), getOrdersByUser(), updateOrderStatus()
      subscriptions.dal.ts ← createSubscription(), getActiveSubscriptions()
      inventory.dal.ts   ← addInventoryBatch(), getExpiringSoon()
      finance.dal.ts     ← createFinanceRecord(), getPnLReport()
      auth.dal.ts        ← signInWithOTP(), verifyOTP(), signOut()
```

### Sample DAL Functions
```typescript
// dal/orders.dal.ts
export async function createOrder(payload: CreateOrderInput): Promise<Order> {
  // 1. Check wallet balance (if wallet payment)
  // 2. Decrement product stock (atomic)
  // 3. Insert order + order_items
  // 4. Create wallet_transaction record
  // 5. Create finance_record (revenue)
  // All in a single Supabase RPC (PostgreSQL transaction)
}

export async function getOrdersByDateRange(
  from: string, 
  to: string, 
  status?: string
): Promise<Order[]> { ... }

// dal/finance.dal.ts
export async function getPnLReport(
  from: string, 
  to: string,
  groupBy: 'day' | 'month' | 'category'
): Promise<PnLReport> { ... }
```

### Why RPC (Stored Procedures) for Critical Operations
For operations like **create order** (which touch wallets + inventory + orders simultaneously), use Supabase's `rpc()` calls which execute as a single PostgreSQL transaction — guaranteeing data integrity.

---

## 5. API Design

### REST API Routes (Next.js `/app/api/`)

#### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/otp/send` | Send OTP to phone |
| POST | `/api/auth/otp/verify` | Verify OTP, return session |
| POST | `/api/auth/logout` | Clear session |

#### Products
| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/products` | [Admin] Create product |
| PUT | `/api/products/:id` | [Admin] Update product |
| DELETE | `/api/products/:id` | [Admin] Soft delete |

#### Orders
| Method | Route | Description |
|---|---|---|
| POST | `/api/orders` | Place new order |
| GET | `/api/orders` | [Auth] User's orders |
| GET | `/api/orders/:id` | Order detail |
| PATCH | `/api/orders/:id/status` | [Admin] Update status |
| POST | `/api/orders/:id/cancel` | Cancel + refund |

#### Subscriptions
| Method | Route | Description |
|---|---|---|
| POST | `/api/subscriptions` | Create subscription |
| GET | `/api/subscriptions` | User's subscriptions |
| PATCH | `/api/subscriptions/:id` | Modify quantity/schedule |
| POST | `/api/subscriptions/:id/pause` | Pause with dates |
| POST | `/api/subscriptions/:id/resume` | Resume |
| DELETE | `/api/subscriptions/:id` | Cancel |

#### Payments
| Method | Route | Description |
|---|---|---|
| POST | `/api/payments/dummy/initiate` | [Phase 1] Simulate payment initiation |
| POST | `/api/payments/dummy/confirm` | [Phase 1] Simulate success/failure response |
| POST | `/api/wallet/topup` | Add funds to wallet (dummy in Phase 1) |
| GET | `/api/wallet/balance` | Current balance |
| GET | `/api/wallet/transactions` | Transaction history |

#### Wallet
| Method | Route | Description |
|---|---|---|
| POST | `/api/wallet/topup` | Top-up wallet balance |
| GET | `/api/wallet/balance` | Current balance |
| GET | `/api/wallet/transactions` | Transaction history |

#### Admin — Finance / P&L
| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/pnl` | P&L report (date range, groupBy) |
| POST | `/api/admin/finance/expense` | Log expense |
| GET | `/api/admin/finance/records` | All finance records |

#### Admin — Inventory
| Method | Route | Description |
|---|---|---|
| POST | `/api/admin/inventory` | Add production batch |
| GET | `/api/admin/inventory` | Current inventory |
| GET | `/api/admin/inventory/expiring` | Items expiring soon |
| PATCH | `/api/admin/inventory/:id/wastage` | Log wastage |

#### Admin — Dashboard
| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/dashboard/summary` | KPIs (orders, revenue, subscribers) |
| GET | `/api/admin/dashboard/alerts` | Low stock, expiry alerts |

---

## 6. Authentication Strategy

### Primary: Supabase Auth (Phone OTP)
```
User enters phone  →  Supabase sends SMS via Twilio  →  User enters OTP  →  Session created
```

### Session Management
- **Server-side**: Supabase `@supabase/ssr` handles cookies in Next.js middleware
- **Client-side**: `supabase.auth.getUser()` in client components
- **Middleware**: `middleware.ts` checks role and redirects `/admin` for non-admins

### Role Check Flow
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect('/unauthorized')
    }
  }
}
```

---

## 7A. 💳 Payment Strategy

### Phase 1 — Dummy Payment Gateway (Testing)

No real payment provider is integrated during testing. The dummy gateway simulates the full payment UX without moving real money.

**How it works:**
```
User clicks "Pay"  →  /api/payments/dummy/initiate  →  Returns mock payment UI
                   →  User clicks "Pay Now" (always succeeds, or can toggle failure)
                   →  /api/payments/dummy/confirm   →  Marks order as paid
                   →  Creates finance_record (revenue) in DB
```

**Implementation:**
```typescript
// lib/dal/payments.dal.ts
export async function initiateDummyPayment(orderId: string, amount: number) {
  // Returns a mock payment session — no external call
  return {
    paymentId: `DUMMY_${Date.now()}`,
    orderId,
    amount,
    currency: 'INR',
    mode: 'test',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
  }
}

export async function confirmDummyPayment(
  paymentId: string,
  simulate: 'success' | 'failure' = 'success'
) {
  if (simulate === 'failure') {
    return { status: 'failed', reason: 'Simulated payment failure' }
  }
  // Mark order as paid, create finance_record
  return { status: 'paid', transactionId: paymentId }
}
```

**Checkout UI — Dummy Payment Screen:**
- Shows a fake card form (name, number pre-filled with test values)
- Has a "Simulate Failure" toggle for testing failure flows
- Shows "₹ X will be deducted (TEST MODE)" badge
- On confirm → order status = `confirmed`, wallet debited if wallet used

**Environment flag:**
```env
NEXT_PUBLIC_PAYMENT_MODE=dummy   # phase 1
# NEXT_PUBLIC_PAYMENT_MODE=live  # phase 2 — swap to Razorpay
```

### Phase 2 — Real Payment Gateway (Production)
- **Recommended:** Razorpay (India-first, supports UPI, cards, netbanking)
- Swap: Only the `payments.dal.ts` file and the payment UI component change
- All order/finance logic stays identical (DAL abstraction)

---

## 7B. File Storage Strategy

**Use: Supabase Storage** (S3-compatible, included in plan)

### Buckets
| Bucket | Contents | Access |
|---|---|---|
| `product-images` | Product photos | Public read |
| `farm-media` | Farm images, certifications | Public read |
| `invoice-pdfs` | Order invoices | Private (user-scoped) |
| `admin-assets` | Reports, exports | Private (admin only) |

### Image Upload Flow (Admin)
```
Admin selects image  →  Upload to Supabase Storage  →  Get public URL  →  Save URL in products table
```

---

## 8. Notification Strategy

### Phase 1 (MVP)
| Channel | Provider | Use Case |
|---|---|---|
| **SMS** | Twilio (via Supabase Auth) | OTP verification |
| **In-app** | `notifications` table + polling | Order updates |
| **Email** | Supabase SMTP / Resend | Order confirmation |

### Phase 2
| Channel | Provider | Use Case |
|---|---|---|
| **Push Notifications** | Firebase Cloud Messaging (FCM) | Delivery alerts |
| **WhatsApp** | Twilio WhatsApp API | Subscription reminders |

> 💡 **Note**: You can use Firebase **only for FCM push notifications** while keeping all data in Supabase. Best of both worlds.

---

## 9. Frontend Architecture

### Tech Stack (Confirmed from PRD)
```
Next.js 14+ (App Router)
  React 18
  TypeScript
  Tailwind CSS
  Supabase-js (@supabase/ssr)
  Zustand (client state management)
  React Query / SWR (server state + caching)
  Recharts (charts for P&L dashboard)
  React Hook Form + Zod (forms + validation)
```

### Folder Structure
```
src/
  app/
    (user)/           ← User platform layout
      page.tsx         ← Home
      products/
      cart/
      checkout/
      subscriptions/
      orders/
      profile/
    admin/            ← Admin platform layout
      page.tsx         ← Dashboard
      orders/
      subscriptions/
      inventory/
      products/
      customers/
      finance/
      settings/
    api/              ← API routes
  components/
    atoms/            ← Button, Input, Badge, Avatar
    molecules/        ← ProductCard, OrderCard, StatCard
    organisms/        ← Navbar, Cart, SubscriptionForm, PnLChart
    templates/        ← UserLayout, AdminLayout
  lib/
    supabase/         ← Client + Server instances
    dal/              ← All DB access functions
    utils/            ← Formatters, date helpers
  types/              ← TypeScript interfaces (User, Order, etc.)
  store/              ← Zustand stores (cart, auth)
```

---

## 10. UI Design System

### Color Palette
```css
--color-primary:       #2D6A4F;  /* Deep organic green */
--color-primary-light: #40916C;  /* Hover state */
--color-secondary:     #F4A261;  /* Warm amber — CTAs */
--color-accent:        #E9C46A;  /* Highlight */
--color-surface:       #FAFAF7;  /* Off-white background */
--color-surface-dark:  #1A1A2E;  /* Admin dark mode */
--color-text:          #1B2D2A;  /* Deep dark green-black */
--color-muted:         #6B7280;  /* Secondary text */
--color-danger:        #E63946;  /* Errors, stock alerts */
--color-success:       #52B788;  /* Delivered, confirmed */
```

### Typography
```
Font: Inter (Google Fonts)
  H1: 2.5rem / 700
  H2: 2rem / 600
  H3: 1.5rem / 600
  Body: 1rem / 400
  Small: 0.875rem / 400
  Caption: 0.75rem / 500 (labels, badges)
```

### Component Guidelines
- **Cards**: Rounded-2xl, subtle shadow, hover lift effect
- **Buttons**: Pill shape for primary CTAs, rectangular for secondary
- **Forms**: Floating labels, real-time validation
- **Tables** (Admin): Sortable, filterable, paginated
- **Charts** (P&L): Recharts — line chart for trends, bar chart for category split

---

## 11. Page-by-Page Structure

### 📱 USER PLATFORM

#### `/` — Home Page
- Hero banner with subscription CTA
- Featured categories (Dairy, Vegetables, Oils, Farm)
- Today's fresh products
- Trust badges (Organic certifications, Farm-to-door)
- Subscription upsell strip

#### `/products` — Product Listing
- Category filter tabs
- Search bar
- Product cards (image, name, price, unit, farm name, Add to Cart / Subscribe button)
- Filters: price range, category, subscription-eligible

#### `/products/:id` — Product Detail
- Large image
- Farm info + certification badge
- Batch traceability
- Quantity selector
- "One-time purchase" vs "Subscribe" toggle
- Subscription schedule selector (if subscribe)

#### `/cart` — Cart
- Line items with qty control
- Subtotal
- Coupon input
- Wallet balance shown
- Proceed to Checkout

#### `/checkout` — Checkout
- Delivery address
- Delivery date/slot
- Payment method toggle: **Wallet** / **Pay Online (Test Mode)**
- Dummy payment screen (Phase 1): mock card UI with TEST MODE badge
- Order summary
- Place Order CTA

#### `/subscriptions` — Subscription Manager
- Active subscriptions list
- Delivery calendar view
- Pause / Resume / Skip / Cancel per subscription
- Upcoming deliveries

#### `/orders` — Order History
- List with status badge
- Filter by date, status
- Order detail modal (items, amount, tracking)

#### `/profile` — Profile
- Name, phone, email
- Wallet balance + transaction history
- Saved addresses
- Notification preferences

---

### 🛠️ ADMIN PLATFORM

#### `/admin` — Dashboard
**KPI Cards Row:**
- Today's orders | Active subscriptions | Revenue (MTD) | New customers

**Charts:**
- Orders trend (7-day line chart)
- Revenue by category (bar chart)

**Alerts Panel:**
- ⚠️ Low stock items
- ⚠️ Expiring batches
- ⚠️ Failed deliveries

#### `/admin/orders` — Order Management
- Filterable table (date, status, order type)
- Bulk status update
- Order detail side panel
- Export CSV

#### `/admin/subscriptions` — Subscription Management
- Active subscriptions table
- Filter by product, user, schedule
- Admin pause/resume on behalf of user
- Upcoming delivery count widget

#### `/admin/inventory` — Inventory & Production ⭐
- Daily production entry form (batch, qty, expiry)
- Current stock table (product, stock, expiry, wastage)
- Expiry alert list (< 2 days)
- Wastage logger
- Stock history chart

#### `/admin/products` — Product Management
- Product table with inline edit
- Add/Edit product form (image upload, farm info, certification)
- Category management
- Bulk pricing update

#### `/admin/customers` — Customer Management
- Customer list with search
- Customer detail: profile, orders, subscriptions, wallet
- Wallet manual adjustment (credit/debit)

#### `/admin/finance` — P&L Dashboard ⭐
**Filters:** Date range picker | Monthly view | Category

**Summary Cards:**
- Total Revenue | Total Expenses | Net Profit | Profit Margin %

**Charts:**
- Revenue vs Expense over time (dual-line)
- Category-wise revenue breakdown (pie)
- Product margin table

**Expense Entry:**
- Log production cost, logistics cost, operational expenses

#### `/admin/settings` — Settings
- Business info
- Notification templates
- Delivery slot configuration
- Coupon management

---

## 12. Security Model

### Row Level Security (RLS) — Supabase
```sql
-- Users can only read their own orders
CREATE POLICY "users_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Only admins can update order status
CREATE POLICY "admin_update_orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Users only see their own subscriptions
CREATE POLICY "users_own_subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);
```

### API Route Protection
```typescript
// Utility: requireAdmin()
export async function requireAdmin(req: Request) {
  const user = await getServerSession()
  if (!user || user.role !== 'admin') {
    throw new UnauthorizedError()
  }
}
```

### Environment Variables
```env
# Supabase Connect API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Safe to expose (RLS protects data)
SUPABASE_SERVICE_ROLE_KEY=        # NEVER expose to client (admin operations only)

# Payment — Phase 1 (Dummy)
NEXT_PUBLIC_PAYMENT_MODE=dummy    # Switch to 'live' in Phase 2

# Payment — Phase 2 (uncomment when ready)
# RAZORPAY_KEY_ID=
# RAZORPAY_KEY_SECRET=

# Notifications
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
RESEND_API_KEY=
```

---

## 13. Phased Roadmap

### Phase 1 — MVP (Core)
- [ ] Project setup (Next.js + Supabase)
- [ ] Database schema + RLS policies
- [ ] Authentication (Phone OTP)
- [ ] Product catalog
- [ ] Cart + Checkout
- [ ] Subscription engine ⭐
- [ ] Wallet system
- [ ] Admin dashboard (KPIs)
- [ ] Admin inventory management
- [ ] P&L basic reporting ⭐
- [ ] In-app notifications

### Phase 2 — Growth
- [ ] Delivery module (agents, routes, status)
- [ ] WhatsApp / Push notifications
- [ ] Referral system + coupons
- [ ] Advanced P&L (export PDF)
- [ ] Demand prediction (basic)

### Phase 3 — Intelligence
- [ ] ML-based demand forecasting
- [ ] Automated subscription order generation (cron)
- [ ] Full batch traceability (farm to delivery)
- [ ] Mobile app (React Native + same Supabase backend)

---

## 🔑 Decisions — Locked & Open

| # | Decision | Status | Choice |
|---|---|---|---|
| 1 | **Database** | ✅ Locked | **Supabase** (PostgreSQL) |
| 2 | **DB Connection method** | ✅ Locked | **Supabase Connect API** (PostgREST via supabase-js) |
| 3 | **Auth provider** | ✅ Locked | **Supabase Auth** (Phone OTP) |
| 4 | **Storage** | ✅ Locked | **Supabase Storage** |
| 5 | **Payment — Phase 1** | ✅ Locked | **Dummy Payment Gateway** (test mode, no real money) |
| 6 | **Payment — Phase 2** | 🔄 TBD | Razorpay (recommended) vs Stripe |
| 7 | **Notification email** | 🔄 TBD | **Resend** (recommended, Next.js native) |
| 8 | **Deployment** | 🔄 TBD | **Vercel** (recommended) vs Railway |
| 9 | **Subscription cron** | 🔄 TBD | **Supabase Edge Functions** (recommended) vs Vercel Cron |

---

*Document prepared based on PRD v1.0 — April 2026*
