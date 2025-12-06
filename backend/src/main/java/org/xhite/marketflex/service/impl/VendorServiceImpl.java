package org.xhite.marketflex.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.dto.UpdateVendorRequest;
import org.xhite.marketflex.dto.VendorDto;
import org.xhite.marketflex.exception.ResourceNotFoundException;
import org.xhite.marketflex.exception.BusinessException;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Vendor;
import org.xhite.marketflex.repository.ProductRepository;
import org.xhite.marketflex.repository.VendorRepository;
import org.xhite.marketflex.service.ProductService;
import org.xhite.marketflex.service.UserService;
import org.xhite.marketflex.service.VendorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ProductService productService;

    @Override
    @Transactional(readOnly = true)
    public VendorDto getVendorByStoreName(String storeName) {
        Vendor vendor = vendorRepository.findByStoreNameIgnoreCase(storeName)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with store name: " + storeName));
        return convertToDto(vendor);
    }

    @Override
    @Transactional(readOnly = true)
    public VendorDto getCurrentVendor() {
        AppUser currentUser = userService.getCurrentUser();
        Vendor vendor = vendorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found for current user"));
        return convertToDto(vendor);
    }

    @Override
    @Transactional
    public VendorDto updateCurrentVendor(UpdateVendorRequest request) {
        AppUser currentUser = userService.getCurrentUser();
        Vendor vendor = vendorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found for current user"));

        // Check if store name is being changed and if it's unique
        if (request.storeName() != null && !request.storeName().isBlank() 
                && !request.storeName().equals(vendor.getStoreName())) {
            if (vendorRepository.existsByStoreName(request.storeName())) {
                throw new BusinessException("Store name already exists: " + request.storeName());
            }
            vendor.setStoreName(request.storeName());
        }

        if (request.storeDescription() != null) {
            vendor.setStoreDescription(request.storeDescription());
        }
        if (request.address() != null) {
            vendor.setAddress(request.address());
        }
        if (request.contactEmail() != null) {
            vendor.setContactEmail(request.contactEmail());
        }
        if (request.contactPhone() != null) {
            vendor.setContactPhone(request.contactPhone());
        }

        Vendor savedVendor = vendorRepository.save(vendor);
        log.info("Updated vendor profile for user: {}", currentUser.getEmail());
        return convertToDto(savedVendor);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vendor> getVendorEntityByUserId(Long userId) {
        return vendorRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getVendorProducts(String storeName) {
        Vendor vendor = vendorRepository.findByStoreNameIgnoreCase(storeName)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with store name: " + storeName));
        
        return productRepository.findByVendorIdAndActiveTrue(vendor.getId())
                .stream()
                .map(productService::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public VendorDto convertToDto(Vendor vendor) {
        return VendorDto.builder()
                .id(vendor.getId())
                .storeName(vendor.getStoreName())
                .storeDescription(vendor.getStoreDescription())
                .address(vendor.getAddress())
                .contactEmail(vendor.getContactEmail())
                .contactPhone(vendor.getContactPhone())
                .userId(vendor.getUser().getId())
                .userEmail(vendor.getUser().getEmail())
                .userFullName(vendor.getUser().getFirstName() + " " + vendor.getUser().getLastName())
                .build();
    }
}
