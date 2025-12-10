package org.xhite.marketflex.dto;

import org.xhite.marketflex.model.enums.OrderStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
    @NotNull(message = "Status is required")
    OrderStatus status
) {}
