package org.xhite.marketflex.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record CreateProductRequest(
    @NotBlank(message = "Product name is required")
    @Size(max = 100)
    String name,

    @Size(max = 1024)
    String description,

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    BigDecimal price,

    @NotNull(message = "Stock quantity is required")
    @Min(0)
    Integer stockQuantity,

    @NotNull(message = "Category is required")
    Long categoryId,

    String imageUrl
) {}