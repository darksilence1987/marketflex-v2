package org.xhite.marketflex.dto;

import java.math.BigDecimal;

public record ProductFilterRequest(
    Long categoryId,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    String search,
    Boolean inStock,
    String sortBy,      // "price-asc", "price-desc", "newest", "name"
    Integer page,
    Integer size
) {
    public ProductFilterRequest {
        // Default values
        if (page == null || page < 0) page = 0;
        if (size == null || size <= 0) size = 20;
        if (size > 100) size = 100; // Max page size
    }
}
