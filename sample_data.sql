-- Organic Farm Platform - Sample Data for Supabase
-- Run this after creating the schema.sql tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- SAMPLE USERS (Admin & Customers)
-- ===========================================

-- Admin user
INSERT INTO auth.users (id, email, phone, created_at, updated_at, last_sign_in_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@organic.com', '+919999999999', '2025-01-01 00:00:00+00', '2026-04-18 00:00:00+00', '2026-04-18 00:00:00+00');

INSERT INTO users (id, name, phone, email, role, wallet_balance, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Admin User', '+919999999999', 'admin@organic.com', 'admin', 0.00, '2025-01-01 00:00:00+00');

-- Customer users
INSERT INTO auth.users (id, email, phone, created_at, updated_at, last_sign_in_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'rajesh@example.com', '+919876543210', '2025-01-15 00:00:00+00', '2026-04-18 00:00:00+00', '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440002', 'priya@example.com', '+918765432109', '2025-03-22 00:00:00+00', '2026-04-18 00:00:00+00', '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440003', 'amit@example.com', '+917654321098', '2025-06-10 00:00:00+00', '2026-04-18 00:00:00+00', '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440004', 'sneha@example.com', '+916543210987', '2025-08-05 00:00:00+00', '2026-04-18 00:00:00+00', '2026-04-18 00:00:00+00');

INSERT INTO users (id, name, phone, email, role, wallet_balance, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', '+919876543210', 'rajesh@example.com', 'customer', 500.00, '2025-01-15 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', '+918765432109', 'priya@example.com', 'customer', 750.00, '2025-03-22 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Amit Patel', '+917654321098', 'amit@example.com', 'customer', 200.00, '2025-06-10 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Sneha Reddy', '+916543210987', 'sneha@example.com', 'customer', 150.00, '2025-08-05 00:00:00+00');

-- ===========================================
-- SAMPLE PRODUCTS
-- ===========================================

INSERT INTO products (id, name, category, price, unit, farm_info, is_active, image_url, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'Fresh A2 Cow Milk', 'Milk & Dairy', 70.00, '1 Litre', 'Green Pasture Farm, Anand, Gujarat - NPOP Certified', true, '/products/milk.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Organic Desi Ghee', 'Milk & Dairy', 650.00, '500 ml', 'Green Pasture Farm, Anand, Gujarat - India Organic', true, '/products/ghee.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Probiotic Curd', 'Milk & Dairy', 55.00, '500 gm', 'Sunrise Organics, Pune, Maharashtra - NPOP Certified', true, '/products/curd.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440013', 'Fresh Paneer', 'Milk & Dairy', 120.00, '250 gm', 'Sunrise Organics, Pune, Maharashtra - India Organic', true, '/products/paneer.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440014', 'Organic Vegetable Box', 'Organic Vegetables', 249.00, '2 kg mix', 'Earth Fresh Farms, Nashik, Maharashtra - NPOP Certified', true, '/products/vegetables.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440015', 'Baby Spinach', 'Organic Vegetables', 45.00, '250 gm', 'Earth Fresh Farms, Nashik, Maharashtra - NPOP Certified', true, '/products/spinach.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440016', 'Organic Tomatoes', 'Organic Vegetables', 60.00, '500 gm', 'Earth Fresh Farms, Nashik, Maharashtra - India Organic', true, '/products/tomatoes.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440017', 'Cold-Pressed Coconut Oil', 'Organic Oils', 380.00, '500 ml', 'Kerala Nature Farms, Thrissur, Kerala - India Organic', true, '/products/coconut-cooking-oil-hero-v3.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440018', 'Groundnut Oil', 'Organic Oils', 290.00, '1 Litre', 'Deccan Oil Mills, Tandur, Telangana - NPOP Certified', true, '/products/groundnut-oil-bottle-peanuts-hero.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440019', 'Sesame Oil', 'Organic Oils', 320.00, '500 ml', 'Deccan Oil Mills, Tandur, Telangana - India Organic', true, '/products/sesame-oil-bottle-seeds-hero.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440020', 'Raw Forest Honey', 'Farm Products', 450.00, '500 gm', 'Wild Bloom Apiaries, Coorg, Karnataka - India Organic', true, '/products/honey.png', '2025-01-01 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440021', 'Free-Range Farm Eggs', 'Farm Products', 90.00, '6 pieces', 'Happy Hen Farm, Coimbatore, Tamil Nadu - NPOP Certified', true, 'https://images.unsplash.com/photo-1518569656558-1f25e69d2221?w=400&q=80', '2025-01-01 00:00:00+00');

-- ===========================================
-- SAMPLE INVENTORY
-- ===========================================

INSERT INTO inventory (product_id, stock, batch_number, production_date, expiry_date, wastage, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 120, 'BATCH-M-2024', '2026-04-17', '2026-04-18', 5, '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440012', 80, 'BATCH-C-2025', '2026-04-16', '2026-04-19', 2, '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440013', 30, 'BATCH-P-2026', '2026-04-17', '2026-04-20', 0, '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440011', 45, 'BATCH-G-2020', '2026-03-01', '2026-09-01', 0, '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440014', 60, 'BATCH-V-2027', '2026-04-17', '2026-04-20', 3, '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440017', 35, 'BATCH-O-1800', '2026-02-01', '2026-08-01', 0, '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440020', 20, 'BATCH-H-0990', '2025-12-01', '2026-12-01', 0, '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440021', 150, 'BATCH-E-2028', '2026-04-16', '2026-04-23', 6, '2026-04-18 00:00:00+00');

-- ===========================================
-- SAMPLE SUBSCRIPTIONS
-- ===========================================

INSERT INTO subscriptions (id, user_id, product_id, schedule, quantity, status, next_delivery_date, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'daily', 2, 'active', '2026-04-19', '2025-01-20 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', 'alternate_day', 1, 'active', '2026-04-20', '2025-03-25 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440012', 'custom', 2, 'paused', '2026-04-21', '2025-06-15 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440017', 'daily', 1, 'cancelled', '2026-04-18', '2025-08-10 00:00:00+00');

-- ===========================================
-- SAMPLE ORDERS
-- ===========================================

INSERT INTO orders (id, user_id, order_type, status, total_amount, payment_method, delivery_date, delivery_slot, delivery_address, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', 'subscription', 'delivered', 450.00, 'wallet', '2026-04-15', 'morning', '123 Organic Lane, Green City', '2026-04-10 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440002', 'one-time', 'confirmed', 380.00, 'upi', '2026-04-19', 'evening', '456 Farm Road, Nature Valley', '2026-04-17 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440003', 'subscription', 'out_for_delivery', 249.00, 'card', '2026-04-18', 'afternoon', '789 Green Street, Eco Town', '2026-04-16 00:00:00+00');

INSERT INTO order_items (id, order_id, product_id, quantity, price_at_time)
VALUES
  ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440010', 2, 70.00),
  ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440021', 1, 90.00),
  ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440017', 1, 380.00),
  ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440014', 1, 249.00);

-- ===========================================
-- SAMPLE FINANCE RECORDS
-- ===========================================

INSERT INTO finance_records (id, record_type, amount, category, sub_category, description, date, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440060', 'revenue', 12500.00, 'Sales', 'Subscriptions', 'Weekly subscription revenue settling', '2026-04-18', '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440061', 'expense', 3200.00, 'Logistics', 'Delivery Partners', 'Payout to drivers', '2026-04-18', '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440062', 'revenue', 8500.00, 'Sales', 'One-time Orders', 'Daily order revenue', '2026-04-17', '2026-04-17 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440063', 'expense', 1500.00, 'Operations', 'Packaging', 'Eco-friendly packaging materials', '2026-04-17', '2026-04-17 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440064', 'revenue', 15200.00, 'Sales', 'Subscriptions', 'Monthly subscription settlement', '2026-04-16', '2026-04-16 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440065', 'expense', 4200.00, 'Production', 'Milk Processing', 'Daily milk processing costs', '2026-04-16', '2026-04-16 00:00:00+00');

-- ===========================================
-- SAMPLE PAYMENTS
-- ===========================================

INSERT INTO payments (id, order_id, user_id, amount, payment_method, status, transaction_id, payment_date)
VALUES
  ('550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', 450.00, 'wallet', 'completed', 'TXN_WALLET_001', '2026-04-10 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440002', 380.00, 'upi', 'completed', 'TXN_UPI_002', '2026-04-17 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440003', 249.00, 'card', 'pending', 'TXN_CARD_003', '2026-04-16 00:00:00+00');

-- ===========================================
-- SAMPLE RECURRING ORDERS
-- ===========================================

INSERT INTO recurring_orders (id, subscription_id, order_id, scheduled_date, status, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440040', '2026-04-19', 'processed', '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440031', NULL, '2026-04-20', 'scheduled', '2026-04-18 00:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440032', NULL, '2026-04-21', 'scheduled', '2026-04-18 00:00:00+00');