package org.xhite.marketflex.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xhite.marketflex.dto.CategoryDto;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.service.CategoryService;
import org.xhite.marketflex.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final CategoryService categoryService;
    private final ProductService productService;

    /**
     * GET /api/v1/public/homepage - Get homepage data (featured categories/products)
     */
    @GetMapping("/homepage")
    public ResponseEntity<Map<String, Object>> getHomepageData() {
        List<CategoryDto> featuredCategories = categoryService.getAllCategories();
        List<ProductDto> featuredProducts = productService.getAllProducts();
        
        return ResponseEntity.ok(Map.of(
            "featuredCategories", featuredCategories,
            "featuredProducts", featuredProducts
        ));
    }

    /**
     * GET /api/v1/public/health - Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
