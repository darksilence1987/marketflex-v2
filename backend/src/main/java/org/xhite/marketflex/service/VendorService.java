package org.xhite.marketflex.service;

import java.util.List;
import java.util.Optional;

import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.dto.UpdateVendorRequest;
import org.xhite.marketflex.dto.VendorDto;
import org.xhite.marketflex.model.Vendor;

public interface VendorService {
    
    VendorDto getVendorByStoreName(String storeName);
    
    VendorDto getCurrentVendor();
    
    VendorDto updateCurrentVendor(UpdateVendorRequest request);
    
    Optional<Vendor> getVendorEntityByUserId(Long userId);
    
    List<ProductDto> getVendorProducts(String storeName);
    
    VendorDto convertToDto(Vendor vendor);
}
