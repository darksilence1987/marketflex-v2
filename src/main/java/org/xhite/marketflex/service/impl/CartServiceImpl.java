package org.xhite.marketflex.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.xhite.marketflex.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.dto.CartDto;
import org.xhite.marketflex.exception.InsufficientStockException;
import org.xhite.marketflex.exception.ResourceNotFoundException;
import org.xhite.marketflex.exception.AccessDeniedException;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Cart;
import org.xhite.marketflex.model.CartItem;
import org.xhite.marketflex.model.Product;
import org.xhite.marketflex.repository.CartItemRepository;
import org.xhite.marketflex.repository.CartRepository;
import org.xhite.marketflex.service.CartService;
import org.xhite.marketflex.service.ProductService;
import org.xhite.marketflex.service.UserService;
import org.xhite.marketflex.event.CartItemAddedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.xhite.marketflex.mapper.CartMapper;



@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final UserService userService;
    private final ProductRepository productRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final CartMapper cartMapper; // Add this

    @Override
    @Transactional
    public CartDto addToCart(Long productId, Integer quantity) {
        try {
            AppUser user = userService.getCurrentUser();
            final Cart userCart = cartRepository.findByUser(user)
                    .orElseGet(() -> createNewCart(user));

            Product product = productRepository.findByIdAndActiveTrue(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            if (!productService.isProductAvailable(productId, quantity)) {
                throw new InsufficientStockException("Not enough stock available");
            }

            CartItem cartItem = cartItemRepository.findByCartAndProduct(userCart, product)
                    .map(item -> {
                        item.setQuantity(item.getQuantity() + quantity);
                        return item;
                    })
                    .orElseGet(() -> {
                        CartItem newItem = new CartItem();
                        newItem.setCart(userCart);
                        newItem.setProduct(product);
                        newItem.setQuantity(quantity);
                        userCart.getCartItems().add(newItem);
                        return newItem;
                    });

            cartItemRepository.save(cartItem);
            Cart cart = cartRepository.save(userCart);
            
            // Publish event after successful save
            applicationEventPublisher.publishEvent(new CartItemAddedEvent(productId, quantity));
            
            return cartMapper.toDto(cart); // Use mapper here
        } catch (Exception e) {
            log.error("Error adding product to cart: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public CartDto getCart() {
        AppUser user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> createNewCart(user));
        
        return cartMapper.toDto(cart); // Use mapper here
    }

    @Override
    public CartDto updateCartItem(Long itemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
                
        if (!productService.isProductAvailable(cartItem.getProduct().getId(), quantity)) {
            throw new InsufficientStockException("Not enough stock available");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        
        return cartMapper.toDto(cartItem.getCart()); // Use mapper here
    }

    @Override
    @Transactional
    public CartDto removeFromCart(Long itemId) {
        try {
            AppUser user = userService.getCurrentUser();
            Cart cart = cartRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

            CartItem cartItem = cartItemRepository.findById(itemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

            // Verify ownership
            if (!cartItem.getCart().getId().equals(cart.getId())) {
                throw new AccessDeniedException("Not authorized to remove this item");
            }

            // Remove from collection
            cart.getCartItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
            
            // Refresh cart
            cart = cartRepository.save(cart);
            
            log.debug("Successfully removed item {} from cart {}", itemId, cart.getId());
            
            return cartMapper.toDto(cart); // Use mapper here
        } catch (Exception e) {
            log.error("Error removing item from cart: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void clearCart() {
        AppUser user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> createNewCart(user));
        
        cartItemRepository.deleteAllByCart(cart);
    }

    private Cart createNewCart(AppUser user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    private CartItem createNewCartItem(Cart cart, Product product) {
        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(0);
        return cartItem;
    }

}
