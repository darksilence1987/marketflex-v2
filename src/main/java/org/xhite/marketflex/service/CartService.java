package org.xhite.marketflex.service;

import org.xhite.marketflex.dto.CartDto;

public interface CartService {
    CartDto addToCart(Long productId, Integer quantity);
    CartDto updateCartItem(Long itemId, Integer quantity);
    CartDto removeFromCart(Long itemId);
    CartDto getCart();
    void clearCart();
}
