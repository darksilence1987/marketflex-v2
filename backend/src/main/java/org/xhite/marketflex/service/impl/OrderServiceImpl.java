package org.xhite.marketflex.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.dto.CartDto;
import org.xhite.marketflex.dto.CartItemDto;
import org.xhite.marketflex.dto.CreateOrderRequest;
import org.xhite.marketflex.dto.OrderDto;
import org.xhite.marketflex.exception.AccessDeniedException;
import org.xhite.marketflex.exception.BusinessException;
import org.xhite.marketflex.exception.InsufficientStockException;
import org.xhite.marketflex.exception.ResourceNotFoundException;
import org.xhite.marketflex.mapper.OrderMapper;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Order;
import org.xhite.marketflex.model.OrderItem;
import org.xhite.marketflex.model.Product;
import org.xhite.marketflex.model.enums.OrderStatus;
import org.xhite.marketflex.repository.OrderRepository;
import org.xhite.marketflex.repository.ProductRepository;
import org.xhite.marketflex.service.CartService;
import org.xhite.marketflex.service.OrderService;
import org.xhite.marketflex.service.ProductService;
import org.xhite.marketflex.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final ProductService productService;
    private final UserService userService;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        log.info("Creating order for current user");

        // Step 1: Get current user
        AppUser user = userService.getCurrentUser();

        // Step 2: Fetch the user's cart
        CartDto cart = cartService.getCart();

        // Step 3: Validate cart is not empty
        if (cart.cartItems() == null || cart.cartItems().isEmpty()) {
            throw new BusinessException("Cannot create order: Cart is empty");
        }

        // Step 4: Validate stock for all items
        for (CartItemDto cartItem : cart.cartItems()) {
            Long productId = cartItem.product().id();
            Integer requestedQuantity = cartItem.quantity();
            
            if (!productService.isProductAvailable(productId, requestedQuantity)) {
                throw new InsufficientStockException(
                    String.format("Insufficient stock for product '%s'. Requested: %d",
                        cartItem.product().name(), requestedQuantity)
                );
            }
        }

        // Step 5: Calculate total price
        BigDecimal totalPrice = cart.cartItems().stream()
                .map(item -> item.product().price().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Step 6: Create and save the order
        Order order = Order.builder()
                .user(user)
                .totalPrice(totalPrice)
                .status(OrderStatus.PAID) // Mock payment - assume always successful
                .shippingAddress(request.shippingAddress())
                .paymentMethod(request.paymentMethod())
                .build();

        // Step 7: Create order items and update stock
        for (CartItemDto cartItem : cart.cartItems()) {
            Long productId = cartItem.product().id();
            Integer quantity = cartItem.quantity();

            // Get the product entity
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

            // Create order item with snapshot price and vendor for tracking
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .vendor(product.getVendor()) // Set vendor for vendor order tracking
                    .quantity(quantity)
                    .price(cartItem.product().price()) // Snapshot price at time of purchase
                    .build();

            order.addOrderItem(orderItem);

            // Update stock (reduce by quantity)
            productService.updateStock(productId, -quantity);
        }

        // Save order (cascades to order items)
        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully with ID: {}", savedOrder.getId());

        // Step 8: Clear the user's cart
        cartService.clearCart();
        log.debug("Cart cleared for user: {}", user.getId());

        // Step 9: Return OrderDto
        return orderMapper.toDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersForCurrentUser() {
        AppUser user = userService.getCurrentUser();
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        
        return orders.stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id) {
        AppUser user = userService.getCurrentUser();

        // Check if user is admin
        if (user.isAdmin()) {
            // Admins can view any order
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
            return orderMapper.toDto(order);
        }

        // Regular users can only view their own orders
        Order order = orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AccessDeniedException("Order not found or access denied"));

        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto cancelOrder(Long id) {
        AppUser user = userService.getCurrentUser();
        
        // Find the order with ownership check
        Order order;
        if (user.isAdmin()) {
            order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        } else {
            order = orderRepository.findByIdAndUser(id, user)
                    .orElseThrow(() -> new AccessDeniedException("Order not found or access denied"));
        }
        
        // Only allow cancellation of PENDING orders
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("Cannot cancel order: Order status is " + order.getStatus() + ". Only PENDING orders can be cancelled.");
        }
        
        // Restore stock for all items
        for (OrderItem item : order.getOrderItems()) {
            productService.updateStock(item.getProduct().getId(), item.getQuantity()); // Negative to restore
        }
        
        // Update order status to CANCELLED
        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);
        
        log.info("Order {} cancelled by user {}", id, user.getEmail());
        return orderMapper.toDto(savedOrder);
    }
}
