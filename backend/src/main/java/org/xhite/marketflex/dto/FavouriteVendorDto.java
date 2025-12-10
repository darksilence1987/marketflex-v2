package org.xhite.marketflex.dto;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record FavouriteVendorDto(
    Long id,
    Long vendorId,
    String storeName,
    String storeDescription,
    String address,
    String contactEmail,
    LocalDateTime addedAt
) {}
