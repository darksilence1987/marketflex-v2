package org.xhite.marketflex.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record CartDto(
    Long id,
    List<CartItemDto> cartItems,
    BigDecimal totalPrice,
    int totalItems
) {
    /**
     * Compact constructor to ensure non-null cartItems list.
     */
    public CartDto {
        if (cartItems == null) {
            cartItems = List.of();
        }
    }
}
