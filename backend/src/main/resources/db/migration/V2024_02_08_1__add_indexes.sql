-- Categories
CREATE INDEX IF NOT EXISTS idx_category_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_category_name ON categories(name);

-- Products
CREATE INDEX IF NOT EXISTS idx_product_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_product_category ON products(category_id, active);
CREATE INDEX IF NOT EXISTS idx_product_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_product_price ON products(price);

-- Users & Orders
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_order_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON orders(status);