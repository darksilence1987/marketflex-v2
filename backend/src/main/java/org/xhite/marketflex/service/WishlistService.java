package org.xhite.marketflex.service;

import org.xhite.marketflex.dto.WishlistDto;

public interface WishlistService {
    
    /**
     * Get the wishlist for the current authenticated user.
     * Creates a new wishlist if one doesn't exist.
     */
    WishlistDto getWishlist();
    
    /**
     * Add a product to the current user's wishlist.
     * 
     * @param productId the product ID to add
     * @return the updated wishlist
     */
    WishlistDto addProduct(Long productId);
    
    /**
     * Remove a product from the current user's wishlist.
     * 
     * @param productId the product ID to remove
     * @return the updated wishlist
     */
    WishlistDto removeProduct(Long productId);
    
    /**
     * Clear all products from the current user's wishlist.
     * 
     * @return the empty wishlist
     */
    WishlistDto clearWishlist();
    
    /**
     * Check if a product is in the current user's wishlist.
     * 
     * @param productId the product ID to check
     * @return true if the product is in the wishlist
     */
    boolean isProductInWishlist(Long productId);
}
