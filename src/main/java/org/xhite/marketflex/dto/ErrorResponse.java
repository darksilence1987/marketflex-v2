package org.xhite.marketflex.dto;

import lombok.Builder;

@Builder
public record ErrorResponse(
    String message
) {}
