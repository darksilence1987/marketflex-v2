package org.xhite.marketflex.dto;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record WishlistItemDto(
    Long productId,
    String productName,
    String productDescription,
    BigDecimal price,
    String imageUrl,
    Integer stockQuantity,
    boolean inStock,
    Long vendorId,
    String vendorStoreName
) {}
