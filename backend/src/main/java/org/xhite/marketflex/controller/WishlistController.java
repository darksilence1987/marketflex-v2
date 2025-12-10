package org.xhite.marketflex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.xhite.marketflex.dto.WishlistDto;
import org.xhite.marketflex.service.WishlistService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Slf4j
public class WishlistController {

    private final WishlistService wishlistService;

    /**
     * GET /api/v1/wishlist - Get current user's wishlist
     */
    @GetMapping
    public ResponseEntity<WishlistDto> getWishlist() {
        return ResponseEntity.ok(wishlistService.getWishlist());
    }

    /**
     * POST /api/v1/wishlist/{productId} - Add product to wishlist
     */
    @PostMapping("/{productId}")
    public ResponseEntity<WishlistDto> addProduct(@PathVariable Long productId) {
        log.info("Adding product {} to wishlist", productId);
        return ResponseEntity.ok(wishlistService.addProduct(productId));
    }

    /**
     * DELETE /api/v1/wishlist/{productId} - Remove product from wishlist
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<WishlistDto> removeProduct(@PathVariable Long productId) {
        log.info("Removing product {} from wishlist", productId);
        return ResponseEntity.ok(wishlistService.removeProduct(productId));
    }

    /**
     * DELETE /api/v1/wishlist - Clear entire wishlist
     */
    @DeleteMapping
    public ResponseEntity<WishlistDto> clearWishlist() {
        log.info("Clearing wishlist");
        return ResponseEntity.ok(wishlistService.clearWishlist());
    }

    /**
     * GET /api/v1/wishlist/check/{productId} - Check if product is in wishlist
     */
    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> isProductInWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.isProductInWishlist(productId));
    }
}
