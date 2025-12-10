package org.xhite.marketflex.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record WishlistDto(
    Long id,
    Long userId,
    List<WishlistItemDto> items,
    int itemCount
) {}
