package org.xhite.marketflex.dto;

import lombok.Builder;

@Builder
public record AuthResponse(
    String token,
    String tokenType,
    String email,
    String firstName,
    String lastName,
    String role,
    String phone,
    String street,
    String city,
    String state,
    String zipCode,
    String country
) {}
