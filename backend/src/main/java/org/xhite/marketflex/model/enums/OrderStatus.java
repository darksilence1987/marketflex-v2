package org.xhite.marketflex.model.enums;

/**
 * Represents the lifecycle states of an order.
 */
public enum OrderStatus {
    PENDING,
    PAID,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    public String getName() {
        return this.name();
    }
}
