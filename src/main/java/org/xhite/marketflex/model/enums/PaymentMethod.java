package org.xhite.marketflex.model.enums;

/**
 * Represents supported payment methods for orders.
 */
public enum PaymentMethod {
    CREDIT_CARD,
    DEBIT_CARD,
    PAYPAL,
    BANK_TRANSFER,
    CASH_ON_DELIVERY;

    public String getName() {
        return this.name();
    }
}
