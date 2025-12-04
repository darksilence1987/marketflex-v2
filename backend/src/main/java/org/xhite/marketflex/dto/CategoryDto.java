package org.xhite.marketflex.dto;

import lombok.Builder;

@Builder
public record CategoryDto(
    Long id,
    String name,
    String description,
    String imageUrl,
    boolean active,
    int products
) {}