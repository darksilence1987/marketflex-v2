package org.xhite.marketflex.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;

/**
 * DTO for vendor-specific order view.
 * Groups order items by order for a specific vendor.
 */
@Builder
public record VendorOrderDto(
    Long orderId,
    String status,
    LocalDateTime createdAt,
    String shippingAddress,
    String customerName,
    String customerEmail,
    BigDecimal vendorTotal,
    List<VendorOrderItemDto> items
) {
    @Builder
    public record VendorOrderItemDto(
        Long id,
        String productName,
        Integer quantity,
        BigDecimal price
    ) {}
}
