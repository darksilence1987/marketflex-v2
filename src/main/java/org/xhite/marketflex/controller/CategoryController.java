package org.xhite.marketflex.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.xhite.marketflex.dto.CategoryDto;
import org.xhite.marketflex.dto.CreateCategoryRequest;
import org.xhite.marketflex.service.CategoryService;
import org.xhite.marketflex.service.FileStorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;
    private final FileStorageService storageService;

    /**
     * GET /api/v1/categories - List all categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryDto>> listCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    /**
     * GET /api/v1/categories/{id} - Get category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    /**
     * POST /api/v1/categories - Create new category (ADMIN/MANAGER only)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryDto> createCategory(
            @Valid @RequestPart("category") CreateCategoryRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = storageService.store(imageFile);
            log.debug("Stored image with URL: {}", imageUrl);
            request.setImageUrl(imageUrl);
        }
        
        CategoryDto created = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/v1/categories/{id} - Update existing category (ADMIN/MANAGER only)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id,
            @Valid @RequestPart("category") CreateCategoryRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        
        CategoryDto existing = categoryService.getCategoryById(id);
        
        if (imageFile != null && !imageFile.isEmpty()) {
            request.setImageUrl(storageService.store(imageFile));
        } else {
            // Keep existing image if no new image is uploaded
            request.setImageUrl(existing.getImageUrl());
        }
        
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    /**
     * DELETE /api/v1/categories/{id} - Delete category (ADMIN/MANAGER only)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean deleteProducts) {
        categoryService.deleteCategory(id, deleteProducts);
        return ResponseEntity.noContent().build();
    }
}