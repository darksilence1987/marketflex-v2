package org.xhite.marketflex.dto;

import org.xhite.marketflex.model.enums.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record CreateOrderRequest(
    @NotBlank(message = "Shipping address is required")
    @Size(max = 500, message = "Shipping address must not exceed 500 characters")
    String shippingAddress,

    @NotNull(message = "Payment method is required")
    PaymentMethod paymentMethod
) {}
