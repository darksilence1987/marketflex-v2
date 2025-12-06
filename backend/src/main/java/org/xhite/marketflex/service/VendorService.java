package org.xhite.marketflex.service;

import java.util.List;
import java.util.Optional;

import org.xhite.marketflex.dto.CreateVendorRequest;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.dto.UpdateVendorRequest;
import org.xhite.marketflex.dto.VendorDto;
import org.xhite.marketflex.dto.VendorOrderDto;
import org.xhite.marketflex.model.Vendor;

public interface VendorService {
    
    // Public methods
    VendorDto getVendorByStoreName(String storeName);
    List<ProductDto> getVendorProducts(String storeName);
    List<VendorDto> getAllVendors();  // For landing page featured vendors
    
    // Vendor orders (for vendor dashboard)
    List<VendorOrderDto> getVendorOrders(Long vendorId);
    
    // Multi-vendor support - get all stores for current user
    List<VendorDto> getMyVendors();
    
    // Get specific vendor by ID (with ownership check)
    VendorDto getVendorById(Long vendorId);
    
    // Create new store
    VendorDto createVendor(CreateVendorRequest request);
    
    // Update vendor by ID (with ownership check)
    VendorDto updateVendor(Long vendorId, UpdateVendorRequest request);
    
    // Legacy methods for backward compatibility
    VendorDto getCurrentVendor();
    VendorDto updateCurrentVendor(UpdateVendorRequest request);
    
    // Internal methods
    Optional<Vendor> getVendorEntityByUserId(Long userId);
    VendorDto convertToDto(Vendor vendor);
}
