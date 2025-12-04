package org.xhite.marketflex.mapper;

import org.springframework.stereotype.Component;
import org.xhite.marketflex.dto.CartDto;
import org.xhite.marketflex.dto.CartItemDto;
import org.xhite.marketflex.model.Cart;
import org.xhite.marketflex.model.CartItem;
import org.xhite.marketflex.service.ProductService;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;


@Component
@RequiredArgsConstructor
public class CartMapper {
    private final ProductService productService;

    public CartDto toDto(Cart cart) {
        if (cart == null) return null;
        
        List<CartItemDto> cartItems = cart.getCartItems().stream()
            .map(this::toCartItemDto)
            .collect(Collectors.toList());
            
        BigDecimal totalPrice = cartItems.stream()
            .map(CartItemDto::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        return CartDto.builder()
            .id(cart.getId())
            .cartItems(cartItems)
            .totalPrice(totalPrice)
            .totalItems(cartItems.size())
            .build();
    }

    private CartItemDto toCartItemDto(CartItem item) {
        return CartItemDto.builder()
            .id(item.getId())
            .product(productService.convertToDto(item.getProduct()))
            .quantity(item.getQuantity())
            .subtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .build();
    }
}
