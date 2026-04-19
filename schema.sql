-- Organic Dairy & Farm Products Platform — Initial DB Schema

-- 1. Users Table (extends Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    wallet_balance NUMERIC NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Milk & Dairy', 'Organic Vegetables', 'Organic Oils', 'Farm Products')),
    price NUMERIC NOT NULL CHECK (price >= 0),
    unit TEXT NOT NULL, -- e.g., "1L", "500g", "1 bunch"
    farm_info TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Inventory Table
CREATE TABLE inventory (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    batch_number TEXT,
    production_date DATE,
    expiry_date DATE,
    wastage INTEGER NOT NULL DEFAULT 0 CHECK (wastage >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'alternate_day', 'custom')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
    next_delivery_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    order_type TEXT NOT NULL CHECK (order_type IN ('one-time', 'subscription')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'out_for_delivery', 'delivered', 'failed', 'cancelled', 'refunded')),
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_slot TEXT,
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time NUMERIC NOT NULL CHECK (price_at_time >= 0)
);

-- 7. Finance Records (P&L Tracking)
CREATE TABLE finance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_type TEXT NOT NULL CHECK (record_type IN ('revenue', 'expense')),
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    category TEXT NOT NULL,
    sub_category TEXT,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('wallet', 'upi', 'card', 'net_banking', 'cod')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT UNIQUE,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Recurring Orders (for repeated orders based on subscriptions)
CREATE TABLE recurring_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processed', 'skipped', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) setup
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_orders ENABLE ROW LEVEL SECURITY;

-- Basic initial policies
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own profile." ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view own subscriptions." ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions." ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions." ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own orders." ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items." ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Admin policies (admins can see and manage all data)
CREATE POLICY "Admins can view all users." ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all subscriptions." ON subscriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all orders." ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all order items." ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all products." ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all inventory." ON inventory FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all finance records." ON finance_records FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can view own payments." ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own recurring orders." ON recurring_orders FOR SELECT USING (
    subscription_id IN (SELECT id FROM subscriptions WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all payments." ON payments FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all recurring orders." ON recurring_orders FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Additional indexes for performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_finance_records_type ON finance_records(record_type);
CREATE INDEX idx_finance_records_date ON finance_records(date);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_recurring_orders_subscription_id ON recurring_orders(subscription_id);
CREATE INDEX idx_recurring_orders_scheduled_date ON recurring_orders(scheduled_date);
CREATE INDEX idx_recurring_orders_status ON recurring_orders(status);

-- ========================================
-- SAMPLE DATA INSERTS FOR TESTING
-- ========================================
-- Run these INSERT statements after creating all tables above

-- 1. Insert Admin User
INSERT INTO users (id, name, phone, email, role, wallet_balance, created_at) VALUES
('admin-uuid-123', 'Admin User', '9999999999', 'admin@organic.com', 'admin', 0.00, '2026-01-01T00:00:00Z');

-- 2. Insert Sample Users (from mock data)
INSERT INTO users (id, name, phone, email, role, wallet_balance, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Priya Sharma', '9876543210', 'priya.sharma@gmail.com', 'customer', 540.00, '2026-01-10T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440001', 'Rahul Menon', '9123456789', 'rahul.m@outlook.com', 'customer', 120.00, '2026-02-05T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440002', 'Ananya Patel', '9988776655', 'ananya.p@gmail.com', 'customer', 890.00, '2026-01-22T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440003', 'Vikram Nair', '8765432100', 'vikram.nair@gmail.com', 'customer', 0.00, '2026-03-15T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440004', 'Meera Krishnan', '9001234567', 'meera.k@yahoo.com', 'customer', 2100.00, '2025-12-01T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440005', 'Arjun Reddy', '9765432109', 'arjun.r@gmail.com', 'customer', 300.00, '2026-01-30T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440006', 'Divya Iyer', '8890123456', 'divya.iyer@gmail.com', 'customer', 650.00, '2025-11-20T00:00:00Z');

-- 3. Insert Products
INSERT INTO products (id, name, category, price, unit, farm_info, is_active, image_url, created_at) VALUES
('p1', 'Fresh A2 Cow Milk', 'Milk & Dairy', 70.00, '1 Litre', 'Green Pasture Farm, Anand, Gujarat - NPOP Certified', true, '/products/milk.png', '2026-01-01T00:00:00Z'),
('p2', 'Organic Desi Ghee', 'Milk & Dairy', 650.00, '500 ml', 'Green Pasture Farm, Anand, Gujarat - India Organic', true, '/products/ghee.png', '2026-01-01T00:00:00Z'),
('p3', 'Probiotic Curd', 'Milk & Dairy', 55.00, '500 gm', 'Sunrise Organics, Pune, Maharashtra - NPOP Certified', true, '/products/curd.png', '2026-01-01T00:00:00Z'),
('p4', 'Fresh Paneer', 'Milk & Dairy', 120.00, '250 gm', 'Sunrise Organics, Pune, Maharashtra - India Organic', true, '/products/paneer.png', '2026-01-01T00:00:00Z'),
('p5', 'Organic Vegetable Box', 'Vegetables', 249.00, '2 kg mix', 'Earth Fresh Farms, Nashik, Maharashtra - NPOP Certified', true, '/products/vegetables.png', '2026-01-01T00:00:00Z'),
('p6', 'Baby Spinach', 'Vegetables', 45.00, '250 gm', 'Earth Fresh Farms, Nashik, Maharashtra - NPOP Certified', true, '/products/spinach.png', '2026-01-01T00:00:00Z'),
('p7', 'Organic Tomatoes', 'Vegetables', 60.00, '500 gm', 'Earth Fresh Farms, Nashik, Maharashtra - India Organic', true, '/products/tomatoes.png', '2026-01-01T00:00:00Z'),
('p8', 'Cold-Pressed Coconut Oil', 'Organic Oils', 380.00, '500 ml', 'Kerala Nature Farms, Thrissur, Kerala - India Organic', true, '/products/coconut-cooking-oil-hero-v3.png', '2026-01-01T00:00:00Z'),
('p9', 'Groundnut Oil', 'Organic Oils', 290.00, '1 Litre', 'Deccan Oil Mills, Tandur, Telangana - NPOP Certified', true, '/products/groundnut-oil-bottle-peanuts-hero.png', '2026-01-01T00:00:00Z'),
('p10', 'Sesame (Gingelly) Oil', 'Organic Oils', 320.00, '500 ml', 'Deccan Oil Mills, Tandur, Telangana - India Organic', true, '/products/sesame-oil-bottle-seeds-hero.png', '2026-01-01T00:00:00Z'),
('p11', 'Raw Forest Honey', 'Farm Products', 450.00, '500 gm', 'Wild Bloom Apiaries, Coorg, Karnataka - India Organic', true, '/products/honey.png', '2026-01-01T00:00:00Z'),
('p12', 'Free-Range Farm Eggs', 'Farm Products', 90.00, '6 pieces', 'Happy Hen Farm, Coimbatore, Tamil Nadu - NPOP Certified', true, 'https://images.unsplash.com/photo-1518569656558-1f25e69d2221?w=400&q=80', '2026-01-01T00:00:00Z');

-- 4. Insert Inventory
INSERT INTO inventory (product_id, stock, batch_number, production_date, expiry_date, wastage, updated_at) VALUES
('p1', 120, 'BATCH-M-2024', '2026-04-17', '2026-04-18', 5, '2026-04-17T00:00:00Z'),
('p3', 80, 'BATCH-C-2025', '2026-04-16', '2026-04-19', 2, '2026-04-17T00:00:00Z'),
('p4', 30, 'BATCH-P-2026', '2026-04-17', '2026-04-20', 0, '2026-04-17T00:00:00Z'),
('p2', 45, 'BATCH-G-2020', '2026-03-01', '2026-09-01', 0, '2026-04-17T00:00:00Z'),
('p5', 60, 'BATCH-V-2027', '2026-04-17', '2026-04-20', 3, '2026-04-17T00:00:00Z'),
('p8', 35, 'BATCH-O-1800', '2026-02-01', '2026-08-01', 0, '2026-04-17T00:00:00Z'),
('p11', 20, 'BATCH-H-0990', '2025-12-01', '2026-12-01', 0, '2026-04-17T00:00:00Z'),
('p12', 150, 'BATCH-E-2028', '2026-04-16', '2026-04-23', 6, '2026-04-17T00:00:00Z');

-- 5. Insert Subscriptions
INSERT INTO subscriptions (id, user_id, product_id, schedule, quantity, status, next_delivery_date, created_at) VALUES
('SUB-001', '550e8400-e29b-41d4-a716-446655440000', 'p1', 'daily', 2, 'active', '2026-04-18', '2026-01-15T00:00:00Z'),
('SUB-002', '550e8400-e29b-41d4-a716-446655440002', 'p1', 'daily', 1, 'active', '2026-04-18', '2026-02-01T00:00:00Z'),
('SUB-003', '550e8400-e29b-41d4-a716-446655440004', 'p2', 'alternate_day', 1, 'active', '2026-04-19', '2026-03-10T00:00:00Z'),
('SUB-004', '550e8400-e29b-41d4-a716-446655440001', 'p5', 'alternate_day', 1, 'paused', '2026-04-25', '2026-02-20T00:00:00Z'),
('SUB-005', '550e8400-e29b-41d4-a716-446655440006', 'p8', 'alternate_day', 1, 'active', '2026-04-19', '2026-03-01T00:00:00Z'),
('SUB-006', '550e8400-e29b-41d4-a716-446655440005', 'p12', 'alternate_day', 2, 'cancelled', '2026-04-17', '2026-01-05T00:00:00Z');

-- 6. Insert Orders
INSERT INTO orders (id, user_id, order_type, status, total_amount, payment_method, delivery_date, delivery_slot, delivery_address, created_at) VALUES
('ORD-1001', '550e8400-e29b-41d4-a716-446655440000', 'subscription', 'delivered', 140.00, 'wallet', '2026-04-17', '6AM-9AM', '12 MG Road, Bangalore', '2026-04-17T05:30:00Z'),
('ORD-1002', '550e8400-e29b-41d4-a716-446655440001', 'one-time', 'out_for_delivery', 760.00, 'upi', '2026-04-17', '9AM-12PM', '45 Anna Nagar, Chennai', '2026-04-17T07:00:00Z'),
('ORD-1003', '550e8400-e29b-41d4-a716-446655440002', 'subscription', 'confirmed', 115.00, 'wallet', '2026-04-17', '6AM-9AM', '8 Koregaon Park, Pune', '2026-04-17T06:15:00Z'),
('ORD-1004', '550e8400-e29b-41d4-a716-446655440003', 'one-time', 'pending', 760.00, 'card', '2026-04-18', '9AM-12PM', '22 Indiranagar, Bangalore', '2026-04-17T09:30:00Z'),
('ORD-1005', '550e8400-e29b-41d4-a716-446655440004', 'subscription', 'delivered', 70.00, 'wallet', '2026-04-16', '6AM-9AM', '33 T Nagar, Chennai', '2026-04-16T05:20:00Z'),
('ORD-1006', '550e8400-e29b-41d4-a716-446655440005', 'subscription', 'failed', 180.00, 'wallet', '2026-04-17', '6AM-9AM', '15 Jubilee Hills, Hyderabad', '2026-04-17T05:45:00Z'),
('ORD-1007', '550e8400-e29b-41d4-a716-446655440006', 'one-time', 'delivered', 690.00, 'upi', '2026-04-16', '9AM-12PM', '7 Velachery, Chennai', '2026-04-16T08:00:00Z'),
('ORD-1008', '550e8400-e29b-41d4-a716-446655440000', 'subscription', 'delivered', 140.00, 'wallet', '2026-04-16', '6AM-9AM', '12 MG Road, Bangalore', '2026-04-16T05:30:00Z');

-- 7. Insert Order Items
INSERT INTO order_items (id, order_id, product_id, quantity, price_at_time) VALUES
('OI-1001-1', 'ORD-1001', 'p1', 2, 70.00),
('OI-1002-1', 'ORD-1002', 'p2', 1, 650.00),
('OI-1002-2', 'ORD-1002', 'p3', 2, 55.00),
('OI-1003-1', 'ORD-1003', 'p1', 1, 70.00),
('OI-1003-2', 'ORD-1003', 'p6', 1, 45.00),
('OI-1004-1', 'ORD-1004', 'p8', 2, 380.00),
('OI-1005-1', 'ORD-1005', 'p1', 1, 70.00),
('OI-1006-1', 'ORD-1006', 'p12', 2, 90.00),
('OI-1007-1', 'ORD-1007', 'p11', 1, 450.00),
('OI-1007-2', 'ORD-1007', 'p4', 2, 120.00),
('OI-1008-1', 'ORD-1008', 'p1', 2, 70.00);

-- 8. Insert Payments
INSERT INTO payments (id, order_id, user_id, amount, payment_method, status, transaction_id, payment_date) VALUES
('PAY-1001', 'ORD-1001', '550e8400-e29b-41d4-a716-446655440000', 140.00, 'wallet', 'completed', 'TXN-1001', '2026-04-17T05:30:00Z'),
('PAY-1002', 'ORD-1002', '550e8400-e29b-41d4-a716-446655440001', 760.00, 'upi', 'completed', 'TXN-1002', '2026-04-17T07:00:00Z'),
('PAY-1003', 'ORD-1003', '550e8400-e29b-41d4-a716-446655440002', 115.00, 'wallet', 'completed', 'TXN-1003', '2026-04-17T06:15:00Z'),
('PAY-1004', 'ORD-1004', '550e8400-e29b-41d4-a716-446655440003', 760.00, 'card', 'pending', 'TXN-1004', '2026-04-17T09:30:00Z'),
('PAY-1005', 'ORD-1005', '550e8400-e29b-41d4-a716-446655440004', 70.00, 'wallet', 'completed', 'TXN-1005', '2026-04-16T05:20:00Z'),
('PAY-1006', 'ORD-1006', '550e8400-e29b-41d4-a716-446655440005', 180.00, 'wallet', 'refunded', 'TXN-1006', '2026-04-17T05:45:00Z'),
('PAY-1007', 'ORD-1007', '550e8400-e29b-41d4-a716-446655440006', 690.00, 'upi', 'completed', 'TXN-1007', '2026-04-16T08:00:00Z'),
('PAY-1008', 'ORD-1008', '550e8400-e29b-41d4-a716-446655440000', 140.00, 'wallet', 'completed', 'TXN-1008', '2026-04-16T05:30:00Z');

-- 9. Insert Finance Records
INSERT INTO finance_records (id, record_type, amount, category, sub_category, description, date, created_at) VALUES
('FIN-001', 'revenue', 25000.00, 'Sales', 'Subscriptions', 'Monthly subscription revenue', '2026-04-01', '2026-04-01T00:00:00Z'),
('FIN-002', 'revenue', 15000.00, 'Sales', 'One-time Orders', 'One-time order revenue', '2026-04-01', '2026-04-01T00:00:00Z'),
('FIN-003', 'expense', 8000.00, 'Operations', 'Delivery', 'Delivery partner payments', '2026-04-01', '2026-04-01T00:00:00Z'),
('FIN-004', 'expense', 12000.00, 'Operations', 'Packaging', 'Eco-friendly packaging costs', '2026-04-01', '2026-04-01T00:00:00Z'),
('FIN-005', 'expense', 5000.00, 'Operations', 'Staff', 'Monthly staff salaries', '2026-04-01', '2026-04-01T00:00:00Z'),
('FIN-006', 'revenue', 28000.00, 'Sales', 'Subscriptions', 'Monthly subscription revenue', '2026-03-01', '2026-03-01T00:00:00Z'),
('FIN-007', 'revenue', 18000.00, 'Sales', 'One-time Orders', 'One-time order revenue', '2026-03-01', '2026-03-01T00:00:00Z'),
('FIN-008', 'expense', 7500.00, 'Operations', 'Delivery', 'Delivery partner payments', '2026-03-01', '2026-03-01T00:00:00Z'),
('FIN-009', 'expense', 11000.00, 'Operations', 'Packaging', 'Eco-friendly packaging costs', '2026-03-01', '2026-03-01T00:00:00Z'),
('FIN-010', 'expense', 5000.00, 'Operations', 'Staff', 'Monthly staff salaries', '2026-03-01', '2026-03-01T00:00:00Z');
