package org.xhite.marketflex.dto;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record OrderItemDto(
    Long id,
    ProductDto product,
    Integer quantity,
    BigDecimal price,
    BigDecimal subtotal
) {}
