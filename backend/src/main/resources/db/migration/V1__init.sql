-- MarketFlex V1 Initial Schema
-- Creates all base tables for the application matching Java entity models

-- Users table (AppUser.java)
CREATE TABLE app_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15),
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(50),
    enabled BOOLEAN NOT NULL DEFAULT true,
    account_non_locked BOOLEAN NOT NULL DEFAULT true,
    failed_attempt INTEGER DEFAULT 0,
    lock_time TIMESTAMP,
    last_login_date TIMESTAMP,
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- User roles table (ElementCollection)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role)
);

-- Categories table (Category.java)
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    image_url VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT true,
    deleted_at TIMESTAMP
);

-- Vendors table (Vendor.java)
CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    store_name VARCHAR(100) NOT NULL UNIQUE,
    store_description VARCHAR(1024),
    address VARCHAR(255),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    user_id BIGINT NOT NULL REFERENCES app_users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Products table (Product.java)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1024),
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    image_url VARCHAR(255),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    vendor_id BIGINT NOT NULL REFERENCES vendors(id),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Carts table (Cart.java)
CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES app_users(id),
    created_at TIMESTAMP,
    modified_at TIMESTAMP
);

-- Cart items table (CartItem.java)
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

-- Orders table (Order.java)
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES app_users(id),
    status VARCHAR(20) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    shipping_address VARCHAR(500) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Order items table (OrderItem.java)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    vendor_id BIGINT REFERENCES vendors(id),
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_store_name ON vendors(store_name);
CREATE INDEX idx_order_items_vendor_id ON order_items(vendor_id);
