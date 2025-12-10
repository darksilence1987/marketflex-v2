-- MarketFlex V4 Demo Data Migration
-- Creates comprehensive demo data for production testing
-- 12 categories, 12+ vendors (3 multi-store owners), 60+ products

-- ============================================
-- USERS
-- ============================================

-- Admin user (password: Admin123!)
INSERT INTO app_users (email, password, first_name, last_name, phone_number, street, city, state, zip_code, country, enabled, account_non_locked, failed_attempt, version, created_at)
VALUES ('admin@marketflex.com', '$2b$10$NJZDxN9vCvfEoJXJ7t4e3.i4wt/y4AfaJE1LrOJ0XpmSwbmjrFAeG', 'Admin', 'User', '+1-555-0100', '123 Admin Street', 'San Francisco', 'CA', '94102', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP);

INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM app_users WHERE email = 'admin@marketflex.com'), 'ADMIN');

-- Manager user (password: Manager123!)
INSERT INTO app_users (email, password, first_name, last_name, phone_number, street, city, state, zip_code, country, enabled, account_non_locked, failed_attempt, version, created_at)
VALUES ('manager@marketflex.com', '$2b$10$0r.fywjRJFUfIVIGhiO42um2kVZGjKdcoJen/Xs/kMPelOH/0hVO.', 'Store', 'Manager', '+1-555-0101', '456 Market Ave', 'Los Angeles', 'CA', '90001', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP);

INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM app_users WHERE email = 'manager@marketflex.com'), 'MANAGER');
INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM app_users WHERE email = 'manager@marketflex.com'), 'VENDOR');

-- Multi-store owner 1 (password: MultiStore123!)
INSERT INTO app_users (email, password, first_name, last_name, phone_number, street, city, state, zip_code, country, enabled, account_non_locked, failed_attempt, version, created_at)
VALUES ('multistore1@marketflex.com', '$2b$10$DMCRseppThPFrrEy/xI8/uDF2mP7roHfqU5aTZsz4XFhZuQUEwcQG', 'Alex', 'Thompson', '+1-555-0102', '789 Enterprise Blvd', 'New York', 'NY', '10001', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP);

INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM app_users WHERE email = 'multistore1@marketflex.com'), 'VENDOR');

-- Multi-store owner 2 (password: MultiStore123!)
INSERT INTO app_users (email, password, first_name, last_name, phone_number, street, city, state, zip_code, country, enabled, account_non_locked, failed_attempt, version, created_at)
VALUES ('multistore2@marketflex.com', '$2b$10$DMCRseppThPFrrEy/xI8/uDF2mP7roHfqU5aTZsz4XFhZuQUEwcQG', 'Sarah', 'Williams', '+1-555-0103', '321 Commerce Dr', 'Chicago', 'IL', '60601', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP);

INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM app_users WHERE email = 'multistore2@marketflex.com'), 'VENDOR');

-- Multi-store owner 3 (password: MultiStore123!)
INSERT INTO app_users (email, password, first_name, last_name, phone_number, street, city, state, zip_code, country, enabled, account_non_locked, failed_attempt, version, created_at)
VALUES ('multistore3@marketflex.com', '$2b$10$DMCRseppThPFrrEy/xI8/uDF2mP7roHfqU5aTZsz4XFhZuQUEwcQG', 'Michael', 'Chen', '+1-555-0104', '555 Business Park', 'Seattle', 'WA', '98101', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP);

INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM app_users WHERE email = 'multistore3@marketflex.com'), 'VENDOR');

-- Single-store vendors (password: Vendor123!)
INSERT INTO app_users (email, password, first_name, last_name, phone_number, street, city, state, zip_code, country, enabled, account_non_locked, failed_attempt, version, created_at)
VALUES 
('techguru@vendor.com', '$2b$10$KfoftbWRx9T6rReZlYRu0e436cIjW4bMMBDX7lxKtAqvdHAgjZi.i', 'Tech', 'Guru', '+1-555-0105', '100 Tech Lane', 'Austin', 'TX', '73301', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP),
('fashionista@vendor.com', '$2b$10$KfoftbWRx9T6rReZlYRu0e436cIjW4bMMBDX7lxKtAqvdHAgjZi.i', 'Fashion', 'Expert', '+1-555-0106', '200 Style Ave', 'Miami', 'FL', '33101', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP),
('homehero@vendor.com', '$2b$10$KfoftbWRx9T6rReZlYRu0e436cIjW4bMMBDX7lxKtAqvdHAgjZi.i', 'Home', 'Hero', '+1-555-0107', '300 Living St', 'Denver', 'CO', '80201', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP),
('sportstar@vendor.com', '$2b$10$KfoftbWRx9T6rReZlYRu0e436cIjW4bMMBDX7lxKtAqvdHAgjZi.i', 'Sport', 'Star', '+1-555-0108', '400 Fitness Rd', 'Phoenix', 'AZ', '85001', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP),
('beautyqueen@vendor.com', '$2b$10$KfoftbWRx9T6rReZlYRu0e436cIjW4bMMBDX7lxKtAqvdHAgjZi.i', 'Beauty', 'Queen', '+1-555-0109', '500 Glow Blvd', 'Las Vegas', 'NV', '89101', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP),
('bookworm@vendor.com', '$2b$10$KfoftbWRx9T6rReZlYRu0e436cIjW4bMMBDX7lxKtAqvdHAgjZi.i', 'Book', 'Worm', '+1-555-0110', '600 Library Ln', 'Boston', 'MA', '02101', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP);

INSERT INTO user_roles (user_id, role) 
SELECT id, 'VENDOR' FROM app_users WHERE email IN ('techguru@vendor.com', 'fashionista@vendor.com', 'homehero@vendor.com', 'sportstar@vendor.com', 'beautyqueen@vendor.com', 'bookworm@vendor.com');

-- Test customers (password: Customer123!)
INSERT INTO app_users (email, password, first_name, last_name, phone_number, street, city, state, zip_code, country, enabled, account_non_locked, failed_attempt, version, created_at)
VALUES 
('customer1@test.com', '$2b$10$Vfy5hfBpsVdWsvmgcKKJbu/HEU8ZzJfZ3rr4el.XKa7kNE2fl.xaW', 'John', 'Doe', '+1-555-0201', '101 Main St', 'Portland', 'OR', '97201', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP),
('customer2@test.com', '$2b$10$Vfy5hfBpsVdWsvmgcKKJbu/HEU8ZzJfZ3rr4el.XKa7kNE2fl.xaW', 'Jane', 'Smith', '+1-555-0202', '202 Oak Ave', 'San Diego', 'CA', '92101', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP),
('customer3@test.com', '$2b$10$Vfy5hfBpsVdWsvmgcKKJbu/HEU8ZzJfZ3rr4el.XKa7kNE2fl.xaW', 'Bob', 'Johnson', '+1-555-0203', '303 Pine Rd', 'Atlanta', 'GA', '30301', 'USA', true, true, 0, 0, CURRENT_TIMESTAMP);

INSERT INTO user_roles (user_id, role) 
SELECT id, 'CUSTOMER' FROM app_users WHERE email IN ('customer1@test.com', 'customer2@test.com', 'customer3@test.com');

-- ============================================
-- CATEGORIES (12 categories)
-- ============================================

INSERT INTO categories (name, description, image_url, active) VALUES
('Electronics', 'Latest electronic gadgets, smartphones, laptops, and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600', true),
('Fashion', 'Trendy clothing, shoes, and accessories for all ages', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600', true),
('Home & Living', 'Furniture, home decor, and essentials for your living space', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600', true),
('Sports & Fitness', 'Sports equipment, gym gear, and activewear', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600', true),
('Beauty & Health', 'Skincare, makeup, wellness products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', true),
('Books & Stationery', 'Books, notebooks, and office supplies', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600', true),
('Toys & Games', 'Toys, board games, and entertainment for all ages', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600', true),
('Automotive', 'Car accessories, parts, and maintenance products', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600', true),
('Garden & Outdoor', 'Outdoor furniture, gardening tools, and plants', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', true),
('Food & Beverages', 'Gourmet food, snacks, and specialty drinks', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', true),
('Pet Supplies', 'Everything for your furry friends', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600', true),
('Jewelry & Watches', 'Fine jewelry, watches, and accessories', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', true);

-- ============================================
-- VENDORS (12 vendors, 3 multi-store owners)
-- ============================================

-- Manager's store
INSERT INTO vendors (store_name, store_description, address, contact_email, contact_phone, user_id, created_at)
VALUES ('MarketFlex Official', 'Premium products from the official MarketFlex store', '123 Market Street, San Francisco, CA', 'manager@marketflex.com', '+1-555-0101', (SELECT id FROM app_users WHERE email = 'manager@marketflex.com'), CURRENT_TIMESTAMP);

-- Multi-store owner 1: 3 stores
INSERT INTO vendors (store_name, store_description, address, contact_email, contact_phone, user_id, created_at)
VALUES 
('TechZone Electronics', 'Your one-stop shop for all things technology', '100 Tech Plaza, New York, NY', 'multistore1@marketflex.com', '+1-555-0102', (SELECT id FROM app_users WHERE email = 'multistore1@marketflex.com'), CURRENT_TIMESTAMP),
('StyleHub Fashion', 'Fashion forward clothing and accessories', '200 Fashion Ave, New York, NY', 'multistore1@marketflex.com', '+1-555-0102', (SELECT id FROM app_users WHERE email = 'multistore1@marketflex.com'), CURRENT_TIMESTAMP),
('HomeNest Living', 'Everything you need for a cozy home', '300 Home Blvd, New York, NY', 'multistore1@marketflex.com', '+1-555-0102', (SELECT id FROM app_users WHERE email = 'multistore1@marketflex.com'), CURRENT_TIMESTAMP);

-- Multi-store owner 2: 2 stores
INSERT INTO vendors (store_name, store_description, address, contact_email, contact_phone, user_id, created_at)
VALUES 
('SportsMax Pro', 'Professional sports and fitness equipment', '400 Fitness Center, Chicago, IL', 'multistore2@marketflex.com', '+1-555-0103', (SELECT id FROM app_users WHERE email = 'multistore2@marketflex.com'), CURRENT_TIMESTAMP),
('Beauty Palace', 'Premium beauty and skincare products', '500 Beauty Lane, Chicago, IL', 'multistore2@marketflex.com', '+1-555-0103', (SELECT id FROM app_users WHERE email = 'multistore2@marketflex.com'), CURRENT_TIMESTAMP);

-- Multi-store owner 3: 2 stores
INSERT INTO vendors (store_name, store_description, address, contact_email, contact_phone, user_id, created_at)
VALUES 
('BookWorld Plus', 'Books for every reader and learner', '600 Library Square, Seattle, WA', 'multistore3@marketflex.com', '+1-555-0104', (SELECT id FROM app_users WHERE email = 'multistore3@marketflex.com'), CURRENT_TIMESTAMP),
('GamersParadise', 'Gaming gear and entertainment', '700 Gaming Center, Seattle, WA', 'multistore3@marketflex.com', '+1-555-0104', (SELECT id FROM app_users WHERE email = 'multistore3@marketflex.com'), CURRENT_TIMESTAMP);

-- Single-store vendors
INSERT INTO vendors (store_name, store_description, address, contact_email, contact_phone, user_id, created_at)
VALUES 
('GadgetWorld', 'Latest gadgets and tech accessories', '800 Gadget Ave, Austin, TX', 'techguru@vendor.com', '+1-555-0105', (SELECT id FROM app_users WHERE email = 'techguru@vendor.com'), CURRENT_TIMESTAMP),
('Urban Style Co', 'Modern urban fashion for everyone', '900 Style Street, Miami, FL', 'fashionista@vendor.com', '+1-555-0106', (SELECT id FROM app_users WHERE email = 'fashionista@vendor.com'), CURRENT_TIMESTAMP),
('Cozy Home Store', 'Make your house a home', '1000 Living Lane, Denver, CO', 'homehero@vendor.com', '+1-555-0107', (SELECT id FROM app_users WHERE email = 'homehero@vendor.com'), CURRENT_TIMESTAMP),
('ActiveLife Gear', 'Gear up for an active lifestyle', '1100 Sports Road, Phoenix, AZ', 'sportstar@vendor.com', '+1-555-0108', (SELECT id FROM app_users WHERE email = 'sportstar@vendor.com'), CURRENT_TIMESTAMP);

-- ============================================
-- PRODUCTS (60+ products across all categories)
-- ============================================

-- Electronics products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('iPhone 15 Pro Max', 'Latest Apple flagship with titanium design and A17 Pro chip', 1199.99, 50, 'https://images.unsplash.com/photo-1695048133098-15243c3f57c4?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'TechZone Electronics'), true, CURRENT_TIMESTAMP),
('Samsung Galaxy S24 Ultra', 'Premium Android flagship with S-Pen and AI features', 1099.99, 45, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'TechZone Electronics'), true, CURRENT_TIMESTAMP),
('MacBook Pro 16"', 'M3 Pro chip, 18GB RAM, stunning Liquid Retina XDR display', 2499.99, 25, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'GadgetWorld'), true, CURRENT_TIMESTAMP),
('Dell XPS 15', 'Intel Core i9, 32GB RAM, 4K OLED touch display', 1899.99, 30, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'GadgetWorld'), true, CURRENT_TIMESTAMP),
('Sony WH-1000XM5', 'Industry-leading noise cancellation wireless headphones', 349.99, 100, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'TechZone Electronics'), true, CURRENT_TIMESTAMP),
('Apple Watch Ultra 2', 'Rugged smartwatch for extreme sports and diving', 799.99, 40, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('iPad Pro 12.9"', 'M2 chip, ProMotion display, Apple Pencil 2 support', 1099.99, 35, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'GadgetWorld'), true, CURRENT_TIMESTAMP),
('PlayStation 5', 'Next-gen gaming console with DualSense controller', 499.99, 60, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'GamersParadise'), true, CURRENT_TIMESTAMP),
('Nintendo Switch OLED', 'Portable gaming with vibrant OLED screen', 349.99, 70, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'GamersParadise'), true, CURRENT_TIMESTAMP),
('AirPods Pro 2', 'Active noise cancellation with spatial audio', 249.99, 150, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', (SELECT id FROM categories WHERE name = 'Electronics'), (SELECT id FROM vendors WHERE store_name = 'TechZone Electronics'), true, CURRENT_TIMESTAMP);

-- Fashion products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Premium Leather Jacket', 'Genuine Italian leather, classic biker style', 299.99, 40, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', (SELECT id FROM categories WHERE name = 'Fashion'), (SELECT id FROM vendors WHERE store_name = 'StyleHub Fashion'), true, CURRENT_TIMESTAMP),
('Designer Denim Jeans', 'Slim fit premium denim with stretch comfort', 89.99, 120, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', (SELECT id FROM categories WHERE name = 'Fashion'), (SELECT id FROM vendors WHERE store_name = 'Urban Style Co'), true, CURRENT_TIMESTAMP),
('Cashmere Sweater', 'Luxurious 100% cashmere, available in 8 colors', 179.99, 60, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', (SELECT id FROM categories WHERE name = 'Fashion'), (SELECT id FROM vendors WHERE store_name = 'StyleHub Fashion'), true, CURRENT_TIMESTAMP),
('Running Sneakers Pro', 'Lightweight with responsive cushioning', 129.99, 200, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', (SELECT id FROM categories WHERE name = 'Fashion'), (SELECT id FROM vendors WHERE store_name = 'Urban Style Co'), true, CURRENT_TIMESTAMP),
('Silk Evening Dress', 'Elegant floor-length silk gown', 249.99, 25, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', (SELECT id FROM categories WHERE name = 'Fashion'), (SELECT id FROM vendors WHERE store_name = 'StyleHub Fashion'), true, CURRENT_TIMESTAMP),
('Wool Winter Coat', 'Premium wool blend with warm lining', 199.99, 45, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', (SELECT id FROM categories WHERE name = 'Fashion'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Linen Summer Shirt', 'Breathable pure linen casual shirt', 59.99, 150, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', (SELECT id FROM categories WHERE name = 'Fashion'), (SELECT id FROM vendors WHERE store_name = 'Urban Style Co'), true, CURRENT_TIMESTAMP),
('Chelsea Leather Boots', 'Handcrafted leather boots with elastic side panels', 169.99, 80, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400', (SELECT id FROM categories WHERE name = 'Fashion'), (SELECT id FROM vendors WHERE store_name = 'StyleHub Fashion'), true, CURRENT_TIMESTAMP);

-- Home & Living products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Ergonomic Office Chair Pro', 'Full lumbar support, mesh back, adjustable armrests', 449.99, 30, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400', (SELECT id FROM categories WHERE name = 'Home & Living'), (SELECT id FROM vendors WHERE store_name = 'HomeNest Living'), true, CURRENT_TIMESTAMP),
('Modular Sofa Set', '3-piece sectional with chaise lounge', 1299.99, 15, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', (SELECT id FROM categories WHERE name = 'Home & Living'), (SELECT id FROM vendors WHERE store_name = 'Cozy Home Store'), true, CURRENT_TIMESTAMP),
('Smart LED Floor Lamp', 'WiFi-enabled, color changing, voice control', 149.99, 80, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', (SELECT id FROM categories WHERE name = 'Home & Living'), (SELECT id FROM vendors WHERE store_name = 'HomeNest Living'), true, CURRENT_TIMESTAMP),
('King Size Memory Foam Mattress', '12-inch medium-firm with cooling gel', 899.99, 20, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', (SELECT id FROM categories WHERE name = 'Home & Living'), (SELECT id FROM vendors WHERE store_name = 'Cozy Home Store'), true, CURRENT_TIMESTAMP),
('Kitchen Essentials Set', '15-piece stainless steel cookware set', 249.99, 50, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', (SELECT id FROM categories WHERE name = 'Home & Living'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Robot Vacuum Cleaner', 'Smart navigation, auto-empty base, app control', 399.99, 40, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', (SELECT id FROM categories WHERE name = 'Home & Living'), (SELECT id FROM vendors WHERE store_name = 'HomeNest Living'), true, CURRENT_TIMESTAMP);

-- Sports & Fitness products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Professional Treadmill', 'Commercial grade with incline and heart rate monitor', 1499.99, 15, 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400', (SELECT id FROM categories WHERE name = 'Sports & Fitness'), (SELECT id FROM vendors WHERE store_name = 'SportsMax Pro'), true, CURRENT_TIMESTAMP),
('Adjustable Dumbbell Set', '5-52.5 lbs adjustable in 2.5 lb increments', 349.99, 40, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', (SELECT id FROM categories WHERE name = 'Sports & Fitness'), (SELECT id FROM vendors WHERE store_name = 'ActiveLife Gear'), true, CURRENT_TIMESTAMP),
('Yoga Mat Premium', 'Extra thick eco-friendly TPE with alignment lines', 49.99, 200, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', (SELECT id FROM categories WHERE name = 'Sports & Fitness'), (SELECT id FROM vendors WHERE store_name = 'SportsMax Pro'), true, CURRENT_TIMESTAMP),
('Spin Bike Pro', 'Magnetic resistance, LCD display, tablet holder', 699.99, 25, 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400', (SELECT id FROM categories WHERE name = 'Sports & Fitness'), (SELECT id FROM vendors WHERE store_name = 'ActiveLife Gear'), true, CURRENT_TIMESTAMP),
('Resistance Band Set Pro', '11-piece set with door anchor and carrying bag', 39.99, 300, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400', (SELECT id FROM categories WHERE name = 'Sports & Fitness'), (SELECT id FROM vendors WHERE store_name = 'SportsMax Pro'), true, CURRENT_TIMESTAMP),
('Carbon Fiber Tennis Racket', 'Professional grade with oversize head', 179.99, 50, 'https://images.unsplash.com/photo-1617083934555-a8aad6e8cba1?w=400', (SELECT id FROM categories WHERE name = 'Sports & Fitness'), (SELECT id FROM vendors WHERE store_name = 'ActiveLife Gear'), true, CURRENT_TIMESTAMP);

-- Beauty & Health products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Anti-Aging Serum', 'Retinol and vitamin C formula for younger-looking skin', 79.99, 100, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', (SELECT id FROM categories WHERE name = 'Beauty & Health'), (SELECT id FROM vendors WHERE store_name = 'Beauty Palace'), true, CURRENT_TIMESTAMP),
('Luxury Perfume Set', 'Collection of 5 signature fragrances', 199.99, 60, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', (SELECT id FROM categories WHERE name = 'Beauty & Health'), (SELECT id FROM vendors WHERE store_name = 'Beauty Palace'), true, CURRENT_TIMESTAMP),
('Professional Hair Dryer', 'Ionic technology, 3 heat settings, diffuser included', 149.99, 80, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', (SELECT id FROM categories WHERE name = 'Beauty & Health'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Organic Skincare Kit', 'Complete 7-step routine with natural ingredients', 129.99, 70, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', (SELECT id FROM categories WHERE name = 'Beauty & Health'), (SELECT id FROM vendors WHERE store_name = 'Beauty Palace'), true, CURRENT_TIMESTAMP),
('Electric Facial Brush', 'Sonic cleansing with 5 brush heads', 89.99, 90, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', (SELECT id FROM categories WHERE name = 'Beauty & Health'), (SELECT id FROM vendors WHERE store_name = 'Beauty Palace'), true, CURRENT_TIMESTAMP);

-- Books & Stationery products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Bestseller Novel Collection', 'Box set of 5 award-winning novels', 49.99, 150, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', (SELECT id FROM categories WHERE name = 'Books & Stationery'), (SELECT id FROM vendors WHERE store_name = 'BookWorld Plus'), true, CURRENT_TIMESTAMP),
('Leather-Bound Journal', 'Handmade Italian leather with acid-free pages', 39.99, 100, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', (SELECT id FROM categories WHERE name = 'Books & Stationery'), (SELECT id FROM vendors WHERE store_name = 'BookWorld Plus'), true, CURRENT_TIMESTAMP),
('Complete Coding Course', 'Learn web development from scratch', 59.99, 200, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', (SELECT id FROM categories WHERE name = 'Books & Stationery'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Fountain Pen Set', 'German-made with 3 nib sizes and ink bottles', 89.99, 75, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400', (SELECT id FROM categories WHERE name = 'Books & Stationery'), (SELECT id FROM vendors WHERE store_name = 'BookWorld Plus'), true, CURRENT_TIMESTAMP),
('Childrens Picture Book Set', '10 classic fairy tales with illustrations', 29.99, 200, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400', (SELECT id FROM categories WHERE name = 'Books & Stationery'), (SELECT id FROM vendors WHERE store_name = 'BookWorld Plus'), true, CURRENT_TIMESTAMP);

-- Toys & Games products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('LEGO Architecture Set', '2000+ piece landmark collection', 149.99, 60, 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400', (SELECT id FROM categories WHERE name = 'Toys & Games'), (SELECT id FROM vendors WHERE store_name = 'GamersParadise'), true, CURRENT_TIMESTAMP),
('Remote Control Drone', '4K camera, GPS, 30 min flight time', 299.99, 40, 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400', (SELECT id FROM categories WHERE name = 'Toys & Games'), (SELECT id FROM vendors WHERE store_name = 'TechZone Electronics'), true, CURRENT_TIMESTAMP),
('Board Game Ultimate Collection', '10 family favorites in one box', 79.99, 80, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400', (SELECT id FROM categories WHERE name = 'Toys & Games'), (SELECT id FROM vendors WHERE store_name = 'GamersParadise'), true, CURRENT_TIMESTAMP),
('RC Monster Truck', 'All-terrain with waterproof electronics', 129.99, 70, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400', (SELECT id FROM categories WHERE name = 'Toys & Games'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Gaming Headset RGB', '7.1 surround sound with noise-canceling mic', 99.99, 120, 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400', (SELECT id FROM categories WHERE name = 'Toys & Games'), (SELECT id FROM vendors WHERE store_name = 'GamersParadise'), true, CURRENT_TIMESTAMP);

-- Automotive products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('4K Dash Camera', 'Front and rear cameras with night vision and parking mode', 149.99, 80, 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400', (SELECT id FROM categories WHERE name = 'Automotive'), (SELECT id FROM vendors WHERE store_name = 'TechZone Electronics'), true, CURRENT_TIMESTAMP),
('Car Vacuum Cleaner Pro', 'Cordless with HEPA filter and accessories', 69.99, 100, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', (SELECT id FROM categories WHERE name = 'Automotive'), (SELECT id FROM vendors WHERE store_name = 'HomeNest Living'), true, CURRENT_TIMESTAMP),
('LED Headlight Kit', 'H11 6000K super bright conversion kit', 89.99, 150, 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400', (SELECT id FROM categories WHERE name = 'Automotive'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Bluetooth FM Transmitter', 'USB charger with hands-free calling', 29.99, 200, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', (SELECT id FROM categories WHERE name = 'Automotive'), (SELECT id FROM vendors WHERE store_name = 'GadgetWorld'), true, CURRENT_TIMESTAMP);

-- Garden & Outdoor products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Patio Furniture Set', '5-piece wicker set with cushions', 599.99, 20, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400', (SELECT id FROM categories WHERE name = 'Garden & Outdoor'), (SELECT id FROM vendors WHERE store_name = 'Cozy Home Store'), true, CURRENT_TIMESTAMP),
('Electric Lawn Mower', 'Cordless 40V with self-propelled drive', 449.99, 30, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400', (SELECT id FROM categories WHERE name = 'Garden & Outdoor'), (SELECT id FROM vendors WHERE store_name = 'HomeNest Living'), true, CURRENT_TIMESTAMP),
('Solar Garden Lights Set', '12 LED path lights with auto on/off', 49.99, 150, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', (SELECT id FROM categories WHERE name = 'Garden & Outdoor'), (SELECT id FROM vendors WHERE store_name = 'Cozy Home Store'), true, CURRENT_TIMESTAMP),
('BBQ Grill Premium', 'Stainless steel 4-burner with side burner', 699.99, 25, 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400', (SELECT id FROM categories WHERE name = 'Garden & Outdoor'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP);

-- Food & Beverages products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Gourmet Coffee Sampler', '12 single-origin coffees from around the world', 59.99, 100, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', (SELECT id FROM categories WHERE name = 'Food & Beverages'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Artisan Chocolate Collection', '24 handcrafted Belgian chocolates', 44.99, 80, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', (SELECT id FROM categories WHERE name = 'Food & Beverages'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Premium Olive Oil Set', '3 extra virgin oils from Italy, Spain, and Greece', 69.99, 60, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', (SELECT id FROM categories WHERE name = 'Food & Beverages'), (SELECT id FROM vendors WHERE store_name = 'Cozy Home Store'), true, CURRENT_TIMESTAMP);

-- Pet Supplies products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Automatic Pet Feeder', 'WiFi-enabled with camera and voice recording', 149.99, 50, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', (SELECT id FROM categories WHERE name = 'Pet Supplies'), (SELECT id FROM vendors WHERE store_name = 'HomeNest Living'), true, CURRENT_TIMESTAMP),
('Orthopedic Dog Bed', 'Memory foam with washable cover, large size', 89.99, 70, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400', (SELECT id FROM categories WHERE name = 'Pet Supplies'), (SELECT id FROM vendors WHERE store_name = 'Cozy Home Store'), true, CURRENT_TIMESTAMP),
('Cat Tree Tower', '6-level with scratching posts and hideaway', 129.99, 40, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400', (SELECT id FROM categories WHERE name = 'Pet Supplies'), (SELECT id FROM vendors WHERE store_name = 'HomeNest Living'), true, CURRENT_TIMESTAMP),
('Premium Pet Carrier', 'Airline approved with ventilation and pockets', 79.99, 80, 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400', (SELECT id FROM categories WHERE name = 'Pet Supplies'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP);

-- Jewelry & Watches products
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, vendor_id, active, created_at) VALUES
('Diamond Tennis Bracelet', '14K white gold with 3 carat total weight', 1499.99, 15, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', (SELECT id FROM categories WHERE name = 'Jewelry & Watches'), (SELECT id FROM vendors WHERE store_name = 'StyleHub Fashion'), true, CURRENT_TIMESTAMP),
('Automatic Chronograph Watch', 'Swiss movement, sapphire crystal, leather strap', 599.99, 25, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', (SELECT id FROM categories WHERE name = 'Jewelry & Watches'), (SELECT id FROM vendors WHERE store_name = 'StyleHub Fashion'), true, CURRENT_TIMESTAMP),
('Pearl Necklace Set', 'Freshwater pearls with matching earrings', 249.99, 40, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', (SELECT id FROM categories WHERE name = 'Jewelry & Watches'), (SELECT id FROM vendors WHERE store_name = 'MarketFlex Official'), true, CURRENT_TIMESTAMP),
('Designer Sunglasses', 'Polarized lenses with UV400 protection', 159.99, 100, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', (SELECT id FROM categories WHERE name = 'Jewelry & Watches'), (SELECT id FROM vendors WHERE store_name = 'Urban Style Co'), true, CURRENT_TIMESTAMP);

-- ============================================
-- Summary: Created comprehensive demo data
-- - 16 users (1 admin, 1 manager, 3 multi-store owners, 6 vendors, 5 customers)
-- - 12 categories
-- - 12 vendors (with 3 owners having multiple stores)
-- - 60+ products across all categories
-- ============================================
