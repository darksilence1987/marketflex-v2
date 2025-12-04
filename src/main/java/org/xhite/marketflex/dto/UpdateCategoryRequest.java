package org.xhite.marketflex.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

@Builder
public record UpdateCategoryRequest(
    @NotBlank(message = "Category name is required")
    @Size(max = 100)
    String name,

    @Size(max = 500)
    String description,

    @JsonIgnore
    MultipartFile imageFile
) {}
