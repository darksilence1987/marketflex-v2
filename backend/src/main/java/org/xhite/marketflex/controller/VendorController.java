package org.xhite.marketflex.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.dto.UpdateVendorRequest;
import org.xhite.marketflex.dto.VendorDto;
import org.xhite.marketflex.service.VendorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
@Slf4j
public class VendorController {

    private final VendorService vendorService;

    /**
     * GET /api/v1/vendors/{storeName} - Public endpoint to get Vendor details
     */
    @GetMapping("/{storeName}")
    public ResponseEntity<VendorDto> getVendorByStoreName(@PathVariable String storeName) {
        VendorDto vendor = vendorService.getVendorByStoreName(storeName);
        return ResponseEntity.ok(vendor);
    }

    /**
     * GET /api/v1/vendors/{storeName}/products - Get products for a specific vendor
     */
    @GetMapping("/{storeName}/products")
    public ResponseEntity<List<ProductDto>> getVendorProducts(@PathVariable String storeName) {
        List<ProductDto> products = vendorService.getVendorProducts(storeName);
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/v1/vendors/me - Get authenticated Vendor's details
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @GetMapping("/me")
    public ResponseEntity<VendorDto> getCurrentVendor() {
        VendorDto vendor = vendorService.getCurrentVendor();
        return ResponseEntity.ok(vendor);
    }

    /**
     * PUT /api/v1/vendors/me - Update Vendor profile
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @PutMapping("/me")
    public ResponseEntity<VendorDto> updateVendor(@Valid @RequestBody UpdateVendorRequest request) {
        log.info("Updating vendor profile");
        VendorDto updatedVendor = vendorService.updateCurrentVendor(request);
        return ResponseEntity.ok(updatedVendor);
    }
}
