package org.xhite.marketflex.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.xhite.marketflex.dto.OrderDto;
import org.xhite.marketflex.dto.OrderItemDto;
import org.xhite.marketflex.model.Order;
import org.xhite.marketflex.model.OrderItem;
import org.xhite.marketflex.service.ProductService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final ProductService productService;

    /**
     * Converts an Order entity to OrderDto.
     */
    public OrderDto toDto(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderItemDto> items = order.getOrderItems().stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    /**
     * Converts an OrderItem entity to OrderItemDto.
     */
    public OrderItemDto toItemDto(OrderItem item) {
        if (item == null) {
            return null;
        }

        return OrderItemDto.builder()
                .id(item.getId())
                .product(productService.convertToDto(item.getProduct()))
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .build();
    }
}
