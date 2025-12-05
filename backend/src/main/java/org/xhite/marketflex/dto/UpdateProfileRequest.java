package org.xhite.marketflex.dto;

import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record UpdateProfileRequest(
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    String firstName,

    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    String lastName,

    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    String phoneNumber,

    @Size(max = 100, message = "Street must not exceed 100 characters")
    String street,

    @Size(max = 50, message = "City must not exceed 50 characters")
    String city,

    @Size(max = 50, message = "State must not exceed 50 characters")
    String state,

    @Size(max = 10, message = "ZIP code must not exceed 10 characters")
    String zipCode,

    @Size(max = 50, message = "Country must not exceed 50 characters")
    String country
) {}
