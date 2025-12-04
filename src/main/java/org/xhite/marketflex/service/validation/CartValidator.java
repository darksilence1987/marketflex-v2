package org.xhite.marketflex.service.validation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.xhite.marketflex.exception.CartException;
import org.xhite.marketflex.exception.InsufficientStockException;
import org.xhite.marketflex.service.ProductService;


@Component
@RequiredArgsConstructor
@Slf4j
public class CartValidator {
    private final ProductService productService;
    
    public void validateCartItem(Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new CartException("Quantity must be positive");
        }
        if (!productService.isProductAvailable(productId, quantity)) {
            throw new InsufficientStockException("Not enough stock available");
        }
        log.debug("Cart item validated successfully for product: {}", productId);
    }
}
