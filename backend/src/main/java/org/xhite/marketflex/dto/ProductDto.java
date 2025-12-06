package org.xhite.marketflex.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ProductDto(
    Long id,

    @NotBlank(message = "Product name is required")
    @Size(max = 100)
    String name,

    @Size(max = 1024)
    String description,

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    BigDecimal price,

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    Integer stockQuantity,

    @NotNull(message = "Category is required")
    Long categoryId,

    String imageUrl,

    String categoryName,

    boolean active,

    Long vendorId,

    String vendorStoreName
) {}