package org.xhite.marketflex.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.dto.FavouriteVendorDto;
import org.xhite.marketflex.exception.BusinessException;
import org.xhite.marketflex.exception.ResourceNotFoundException;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.FavouriteVendor;
import org.xhite.marketflex.model.Vendor;
import org.xhite.marketflex.repository.FavouriteVendorRepository;
import org.xhite.marketflex.repository.VendorRepository;
import org.xhite.marketflex.service.FavouriteVendorService;
import org.xhite.marketflex.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavouriteVendorServiceImpl implements FavouriteVendorService {

    private final FavouriteVendorRepository favouriteVendorRepository;
    private final VendorRepository vendorRepository;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public List<FavouriteVendorDto> getFavouriteVendors() {
        AppUser currentUser = userService.getCurrentUser();
        return favouriteVendorRepository.findByUserIdOrderByAddedAtDesc(currentUser.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FavouriteVendorDto addFavourite(Long vendorId) {
        AppUser currentUser = userService.getCurrentUser();
        
        // Check if vendor exists
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + vendorId));
        
        // Check if already in favourites
        if (favouriteVendorRepository.existsByUserIdAndVendorId(currentUser.getId(), vendorId)) {
            throw new BusinessException("Vendor is already in your favourites");
        }
        
        FavouriteVendor favourite = FavouriteVendor.builder()
                .user(currentUser)
                .vendor(vendor)
                .build();
        
        FavouriteVendor saved = favouriteVendorRepository.save(favourite);
        log.info("Added vendor {} to favourites for user {}", vendorId, currentUser.getEmail());
        
        return convertToDto(saved);
    }

    @Override
    @Transactional
    public void removeFavourite(Long vendorId) {
        AppUser currentUser = userService.getCurrentUser();
        
        FavouriteVendor favourite = favouriteVendorRepository.findByUserIdAndVendorId(currentUser.getId(), vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found in favourites"));
        
        favouriteVendorRepository.delete(favourite);
        log.info("Removed vendor {} from favourites for user {}", vendorId, currentUser.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavourite(Long vendorId) {
        AppUser currentUser = userService.getCurrentUser();
        return favouriteVendorRepository.existsByUserIdAndVendorId(currentUser.getId(), vendorId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFavouriteCount() {
        AppUser currentUser = userService.getCurrentUser();
        return favouriteVendorRepository.countByUserId(currentUser.getId());
    }

    private FavouriteVendorDto convertToDto(FavouriteVendor favourite) {
        Vendor vendor = favourite.getVendor();
        return FavouriteVendorDto.builder()
                .id(favourite.getId())
                .vendorId(vendor.getId())
                .storeName(vendor.getStoreName())
                .storeDescription(vendor.getStoreDescription())
                .address(vendor.getAddress())
                .contactEmail(vendor.getContactEmail())
                .addedAt(favourite.getAddedAt())
                .build();
    }
}
