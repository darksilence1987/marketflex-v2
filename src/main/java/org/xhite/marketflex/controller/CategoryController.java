package org.xhite.marketflex.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.xhite.marketflex.dto.CategoryDto;
import org.xhite.marketflex.dto.CreateCategoryRequest;
import org.xhite.marketflex.service.CategoryService;
import org.xhite.marketflex.service.FileStorageService;
import org.xhite.marketflex.exception.BusinessException;
import org.xhite.marketflex.dto.ErrorResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;    
    private final FileStorageService storageService;

    @GetMapping
    public String listCategories(Model model) {
        List<CategoryDto> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        
        return "category/category-list";
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping
    @ResponseBody
    public ResponseEntity<?> createCategory(
            @Valid @RequestPart("category") CreateCategoryRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = storageService.store(imageFile);
                log.debug("Stored image with URL: {}", imageUrl);
                request.setImageUrl(imageUrl);
            } catch (Exception e) {
                log.error("Failed to store image", e);
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Failed to store image: " + e.getMessage()));
            }
        }
        
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PutMapping("/{id}")
    @ResponseBody
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id,
            @Valid @RequestPart("category") CreateCategoryRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        
        CategoryDto existingCategory = categoryService.getCategoryById(id);
        
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = storageService.store(imageFile);
            request.setImageUrl(imageUrl);
        } else {
            // Keep existing image if no new image is uploaded
            request.setImageUrl(existingCategory.getImageUrl());
        }
        
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteCategory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean deleteProducts) {
        try {
            categoryService.deleteCategory(id, deleteProducts);
            return ResponseEntity.ok().build();
        } catch (BusinessException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }
}