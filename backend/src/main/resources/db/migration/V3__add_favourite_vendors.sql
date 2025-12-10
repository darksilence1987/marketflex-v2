-- Add favourite_vendors table
CREATE TABLE favourite_vendors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, vendor_id)
);

CREATE INDEX idx_favourite_vendors_user_id ON favourite_vendors(user_id);
CREATE INDEX idx_favourite_vendors_vendor_id ON favourite_vendors(vendor_id);
