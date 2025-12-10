package org.xhite.marketflex.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.xhite.marketflex.dto.FavouriteVendorDto;
import org.xhite.marketflex.service.FavouriteVendorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/favourites/vendors")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Slf4j
public class FavouriteVendorController {

    private final FavouriteVendorService favouriteVendorService;

    /**
     * GET /api/v1/favourites/vendors - Get current user's favourite vendors
     */
    @GetMapping
    public ResponseEntity<List<FavouriteVendorDto>> getFavouriteVendors() {
        return ResponseEntity.ok(favouriteVendorService.getFavouriteVendors());
    }

    /**
     * POST /api/v1/favourites/vendors/{vendorId} - Add vendor to favourites
     */
    @PostMapping("/{vendorId}")
    public ResponseEntity<FavouriteVendorDto> addFavourite(@PathVariable Long vendorId) {
        log.info("Adding vendor {} to favourites", vendorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(favouriteVendorService.addFavourite(vendorId));
    }

    /**
     * DELETE /api/v1/favourites/vendors/{vendorId} - Remove vendor from favourites
     */
    @DeleteMapping("/{vendorId}")
    public ResponseEntity<Void> removeFavourite(@PathVariable Long vendorId) {
        log.info("Removing vendor {} from favourites", vendorId);
        favouriteVendorService.removeFavourite(vendorId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/favourites/vendors/{vendorId}/check - Check if vendor is in favourites
     */
    @GetMapping("/{vendorId}/check")
    public ResponseEntity<Boolean> isFavourite(@PathVariable Long vendorId) {
        return ResponseEntity.ok(favouriteVendorService.isFavourite(vendorId));
    }

    /**
     * GET /api/v1/favourites/vendors/count - Get count of favourite vendors
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getFavouriteCount() {
        return ResponseEntity.ok(favouriteVendorService.getFavouriteCount());
    }
}
