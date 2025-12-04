package org.xhite.marketflex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.xhite.marketflex.service.CartService;
import org.xhite.marketflex.dto.CartDto;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {
    
    private final CartService cartService;

    /**
     * GET /api/v1/cart - Get current user's cart
     */
    @GetMapping
    public ResponseEntity<CartDto> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    /**
     * POST /api/v1/cart/items/{productId} - Add product to cart
     */
    @PostMapping("/items/{productId}")
    public ResponseEntity<CartDto> addToCart(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(cartService.addToCart(productId, quantity));
    }

    /**
     * PUT /api/v1/cart/items/{itemId} - Update cart item quantity
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(itemId, quantity));
    }

    /**
     * DELETE /api/v1/cart/items/{itemId} - Remove item from cart
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId) {
        cartService.removeFromCart(itemId);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/v1/cart - Clear entire cart
     */
    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
