package org.xhite.marketflex.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.event.CartItemAddedEvent;
import org.xhite.marketflex.service.ProductService;

@Component
@RequiredArgsConstructor
@Slf4j
public class CartEventListener {
    private final ProductService productService;
    
    @EventListener
    @Transactional
    public void handleCartItemAdded(CartItemAddedEvent event) {
        log.info("Handling cart item added event for product: {}", event.getProductId());
        productService.updateStock(event.getProductId(), -event.getQuantity());
    }
}