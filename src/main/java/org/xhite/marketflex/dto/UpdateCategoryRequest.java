package org.xhite.marketflex.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateCategoryRequest {
    @NotBlank(message = "Category name is required")
    @Size(max = 100)
    private String name;
    
    @Size(max = 500)
    private String description;
    
    @JsonIgnore
    private MultipartFile imageFile;
}
