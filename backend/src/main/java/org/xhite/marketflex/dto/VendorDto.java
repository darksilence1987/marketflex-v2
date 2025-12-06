package org.xhite.marketflex.dto;

import lombok.Builder;

@Builder
public record VendorDto(
    Long id,
    String storeName,
    String storeDescription,
    String address,
    String contactEmail,
    String contactPhone,
    Long userId,
    String userEmail,
    String userFullName
) {}
