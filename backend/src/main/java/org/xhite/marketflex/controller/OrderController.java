package org.xhite.marketflex.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xhite.marketflex.dto.CreateOrderRequest;
import org.xhite.marketflex.dto.OrderDto;
import org.xhite.marketflex.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /api/v1/orders/checkout - Create an order from the current user's cart
     */
    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(@Valid @RequestBody CreateOrderRequest request) {
        log.info("Checkout request received");
        OrderDto order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    /**
     * GET /api/v1/orders - Get all orders for the current logged-in user
     */
    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrders() {
        List<OrderDto> orders = orderService.getOrdersForCurrentUser();
        return ResponseEntity.ok(orders);
    }

    /**
     * GET /api/v1/orders/{id} - Get details of a specific order
     * Ensures user owns the order or is ADMIN
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    /**
     * PUT /api/v1/orders/{id}/cancel - Cancel a pending order
     * Users can only cancel their own orders
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long id) {
        log.info("Cancel order request for order ID: {}", id);
        OrderDto cancelledOrder = orderService.cancelOrder(id);
        return ResponseEntity.ok(cancelledOrder);
    }
}
