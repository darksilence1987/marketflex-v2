package org.xhite.marketflex.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record CartItemDto(
    Long id,
    ProductDto product,
    Integer quantity,
    BigDecimal subtotal
) {}