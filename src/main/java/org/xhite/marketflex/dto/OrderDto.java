package org.xhite.marketflex.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.xhite.marketflex.model.enums.OrderStatus;
import org.xhite.marketflex.model.enums.PaymentMethod;

import lombok.Builder;

@Builder
public record OrderDto(
    Long id,
    BigDecimal totalPrice,
    OrderStatus status,
    String shippingAddress,
    PaymentMethod paymentMethod,
    List<OrderItemDto> items,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
