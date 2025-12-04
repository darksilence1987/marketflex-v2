package org.xhite.marketflex.service;

import java.util.List;

import org.xhite.marketflex.dto.CreateOrderRequest;
import org.xhite.marketflex.dto.OrderDto;

public interface OrderService {

    /**
     * Creates an order from the current user's cart.
     * Validates stock, calculates total, updates inventory, and clears the cart.
     *
     * @param request the order creation request with shipping address and payment method
     * @return the created order details
     */
    OrderDto createOrder(CreateOrderRequest request);

    /**
     * Retrieves all orders for the currently authenticated user.
     *
     * @return list of user's orders, sorted by creation date (newest first)
     */
    List<OrderDto> getOrdersForCurrentUser();

    /**
     * Retrieves a specific order by ID.
     * Ensures the current user owns the order or is an admin.
     *
     * @param id the order ID
     * @return the order details
     */
    OrderDto getOrderById(Long id);
}
