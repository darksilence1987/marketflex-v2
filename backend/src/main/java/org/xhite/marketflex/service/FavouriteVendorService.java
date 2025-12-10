package org.xhite.marketflex.service;

import java.util.List;

import org.xhite.marketflex.dto.FavouriteVendorDto;

public interface FavouriteVendorService {
    
    /**
     * Get all favourite vendors for the current user.
     */
    List<FavouriteVendorDto> getFavouriteVendors();
    
    /**
     * Add a vendor to the current user's favourites.
     */
    FavouriteVendorDto addFavourite(Long vendorId);
    
    /**
     * Remove a vendor from the current user's favourites.
     */
    void removeFavourite(Long vendorId);
    
    /**
     * Check if a vendor is in the current user's favourites.
     */
    boolean isFavourite(Long vendorId);
    
    /**
     * Get the count of favourite vendors for the current user.
     */
    long getFavouriteCount();
}
