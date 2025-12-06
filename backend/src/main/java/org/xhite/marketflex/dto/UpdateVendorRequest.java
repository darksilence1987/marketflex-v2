package org.xhite.marketflex.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateVendorRequest(
    @Size(min = 2, max = 100, message = "Store name must be between 2 and 100 characters")
    String storeName,

    @Size(max = 1024, message = "Store description cannot exceed 1024 characters")
    String storeDescription,

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    String address,

    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    String contactEmail,

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    String contactPhone
) {}
