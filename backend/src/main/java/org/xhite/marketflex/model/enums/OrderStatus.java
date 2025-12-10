package org.xhite.marketflex.model.enums;

/**
 * Represents the lifecycle states of an order.
 */
public enum OrderStatus {
    PENDING,
    PROCESSING,
    PAID,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    public String getName() {
        return this.name();
    }
}
