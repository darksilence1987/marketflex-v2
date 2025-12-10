package org.xhite.marketflex.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xhite.marketflex.dto.CreateVendorRequest;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.dto.UpdateVendorRequest;
import org.xhite.marketflex.dto.UpdateOrderStatusRequest;
import org.xhite.marketflex.dto.VendorDto;
import org.xhite.marketflex.dto.VendorOrderDto;
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

    // ========================
    // PUBLIC ENDPOINTS
    // ========================

    /**
     * GET /api/v1/vendors/all - Get all vendors for public listing
     */
    @GetMapping("/all")
    public ResponseEntity<List<VendorDto>> getAllVendors() {
        List<VendorDto> vendors = vendorService.getAllVendors();
        return ResponseEntity.ok(vendors);
    }

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

    // ========================
    // MULTI-VENDOR ENDPOINTS
    // ========================

    /**
     * GET /api/v1/vendors/my-stores - Get all stores for current user
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my-stores")
    public ResponseEntity<List<VendorDto>> getMyVendors() {
        List<VendorDto> vendors = vendorService.getMyVendors();
        return ResponseEntity.ok(vendors);
    }

    /**
     * POST /api/v1/vendors - Create a new store
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<VendorDto> createVendor(@Valid @RequestBody CreateVendorRequest request) {
        log.info("Creating new vendor store: {}", request.storeName());
        VendorDto vendor = vendorService.createVendor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(vendor);
    }

    /**
     * GET /api/v1/vendors/store/{id} - Get specific vendor by ID (with ownership check)
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @GetMapping("/store/{id}")
    public ResponseEntity<VendorDto> getVendorById(@PathVariable Long id) {
        VendorDto vendor = vendorService.getVendorById(id);
        return ResponseEntity.ok(vendor);
    }

    /**
     * GET /api/v1/vendors/store/{id}/orders - Get orders for a specific vendor (for vendor dashboard)
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @GetMapping("/store/{id}/orders")
    public ResponseEntity<List<VendorOrderDto>> getVendorOrders(@PathVariable Long id) {
        List<VendorOrderDto> orders = vendorService.getVendorOrders(id);
        return ResponseEntity.ok(orders);
    }


    /**
     * PUT /api/v1/vendors/store/{id} - Update vendor by ID (with ownership check)
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @PutMapping("/store/{id}")
    public ResponseEntity<VendorDto> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody UpdateVendorRequest request) {
        log.info("Updating vendor store with ID: {}", id);
        VendorDto updatedVendor = vendorService.updateVendor(id, request);
        return ResponseEntity.ok(updatedVendor);
    }

    // ========================
    // LEGACY ENDPOINTS (backward compatibility)
    // ========================

    /**
     * GET /api/v1/vendors/me - Get authenticated Vendor's details (first store)
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @GetMapping("/me")
    public ResponseEntity<VendorDto> getCurrentVendor() {
        VendorDto vendor = vendorService.getCurrentVendor();
        return ResponseEntity.ok(vendor);
    }

    /**
     * PUT /api/v1/vendors/me - Update first Vendor profile
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @PutMapping("/me")
    public ResponseEntity<VendorDto> updateCurrentVendor(@Valid @RequestBody UpdateVendorRequest request) {
        log.info("Updating vendor profile (legacy endpoint)");
        VendorDto updatedVendor = vendorService.updateCurrentVendor(request);
        return ResponseEntity.ok(updatedVendor);
    }

    /**
     * PUT /api/v1/vendors/store/{vendorId}/orders/{orderId}/status - Update order status
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @PutMapping("/store/{vendorId}/orders/{orderId}/status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long vendorId,
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        log.info("Updating order {} status to {} for vendor {}", orderId, request.status(), vendorId);
        vendorService.updateOrderStatus(vendorId, orderId, request.status());
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/v1/vendors/store/{id} - Delete vendor store (with ownership check)
     */
    @PreAuthorize("hasAnyRole('VENDOR', 'MANAGER', 'ADMIN')")
    @DeleteMapping("/store/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        log.info("Deleting vendor store with ID: {}", id);
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
