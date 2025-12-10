package org.xhite.marketflex.service.impl;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.dto.WishlistDto;
import org.xhite.marketflex.dto.WishlistItemDto;
import org.xhite.marketflex.exception.ResourceNotFoundException;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Product;
import org.xhite.marketflex.model.Wishlist;
import org.xhite.marketflex.repository.ProductRepository;
import org.xhite.marketflex.repository.WishlistRepository;
import org.xhite.marketflex.service.UserService;
import org.xhite.marketflex.service.WishlistService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public WishlistDto getWishlist() {
        AppUser currentUser = userService.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(currentUser);
        return convertToDto(wishlist);
    }

    @Override
    @Transactional
    public WishlistDto addProduct(Long productId) {
        AppUser currentUser = userService.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(currentUser);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        
        wishlist.addProduct(product);
        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        
        log.info("Added product {} to wishlist for user {}", productId, currentUser.getEmail());
        return convertToDto(savedWishlist);
    }

    @Override
    @Transactional
    public WishlistDto removeProduct(Long productId) {
        AppUser currentUser = userService.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(currentUser);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        
        wishlist.removeProduct(product);
        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        
        log.info("Removed product {} from wishlist for user {}", productId, currentUser.getEmail());
        return convertToDto(savedWishlist);
    }

    @Override
    @Transactional
    public WishlistDto clearWishlist() {
        AppUser currentUser = userService.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(currentUser);
        
        wishlist.clear();
        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        
        log.info("Cleared wishlist for user {}", currentUser.getEmail());
        return convertToDto(savedWishlist);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isProductInWishlist(Long productId) {
        AppUser currentUser = userService.getCurrentUser();
        return wishlistRepository.findByUser(currentUser)
                .map(wishlist -> wishlist.getProducts().stream()
                        .anyMatch(p -> p.getId().equals(productId)))
                .orElse(false);
    }

    private Wishlist getOrCreateWishlist(AppUser user) {
        return wishlistRepository.findByUser(user)
                .orElseGet(() -> {
                    Wishlist newWishlist = Wishlist.builder()
                            .user(user)
                            .build();
                    return wishlistRepository.save(newWishlist);
                });
    }

    private WishlistDto convertToDto(Wishlist wishlist) {
        return WishlistDto.builder()
                .id(wishlist.getId())
                .userId(wishlist.getUser().getId())
                .itemCount(wishlist.getProducts().size())
                .items(wishlist.getProducts().stream()
                        .map(this::convertProductToWishlistItem)
                        .collect(Collectors.toList()))
                .build();
    }

    private WishlistItemDto convertProductToWishlistItem(Product product) {
        return WishlistItemDto.builder()
                .productId(product.getId())
                .productName(product.getName())
                .productDescription(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .stockQuantity(product.getStockQuantity())
                .inStock(product.getStockQuantity() > 0)
                .vendorId(product.getVendor() != null ? product.getVendor().getId() : null)
                .vendorStoreName(product.getVendor() != null ? product.getVendor().getStoreName() : null)
                .build();
    }
}
