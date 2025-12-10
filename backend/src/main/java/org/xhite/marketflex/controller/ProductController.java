package org.xhite.marketflex.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.service.FileStorageService;
import org.xhite.marketflex.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final FileStorageService storageService;

    /**
     * GET /api/v1/products/my-products - Get products for authenticated vendor
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    @GetMapping("/my-products")
    public ResponseEntity<List<ProductDto>> getMyProducts() {
        return ResponseEntity.ok(productService.getMyProducts());
    }

    /**
     * GET /api/v1/products - List all products or filter by category
     */
    @GetMapping
    public ResponseEntity<List<ProductDto>> listProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "false") boolean featured,
            @RequestParam(defaultValue = "10") int limit) {

        if (featured) {
            return ResponseEntity.ok(productService.getFeaturedProducts(limit));
        }

        List<ProductDto> products = (categoryId != null)
                ? productService.getProductsByCategory(categoryId)
                : productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/v1/products/filter - Filter products with advanced parameters
     */
    @GetMapping("/filter")
    public ResponseEntity<org.xhite.marketflex.dto.PagedResponse<ProductDto>> filterProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        
        var request = new org.xhite.marketflex.dto.ProductFilterRequest(
            categoryId, minPrice, maxPrice, search, inStock, sortBy, page, size
        );
        return ResponseEntity.ok(productService.filterProducts(request));
    }

    /**
     * GET /api/v1/products/{id} - Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        return productService.getProductById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/v1/products - Create new product (ADMIN/MANAGER only)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDto> createProduct(
            @Valid @RequestPart("product") ProductDto productDto,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        
        ProductDto finalDto = productDto;
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = storageService.store(imageFile);
            finalDto = ProductDto.builder()
                    .id(productDto.id())
                    .name(productDto.name())
                    .description(productDto.description())
                    .price(productDto.price())
                    .stockQuantity(productDto.stockQuantity())
                    .categoryId(productDto.categoryId())
                    .categoryName(productDto.categoryName())
                    .imageUrl(imageUrl)
                    .active(productDto.active())
                    .build();
        }

        ProductDto created = productService.createProduct(finalDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/v1/products/{id} - Update existing product (ADMIN/MANAGER only)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestPart("product") ProductDto productDto,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        
        ProductDto finalDto = productDto;
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = storageService.store(imageFile);
            finalDto = ProductDto.builder()
                    .id(productDto.id())
                    .name(productDto.name())
                    .description(productDto.description())
                    .price(productDto.price())
                    .stockQuantity(productDto.stockQuantity())
                    .categoryId(productDto.categoryId())
                    .categoryName(productDto.categoryName())
                    .imageUrl(imageUrl)
                    .active(productDto.active())
                    .build();
        }

        ProductDto updated = productService.updateProduct(id, finalDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/v1/products/json - Create new product with JSON body (no file upload)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductDto> createProductJson(@Valid @RequestBody ProductDto productDto) {
        log.info("Creating product via JSON: {}", productDto.name());
        ProductDto created = productService.createProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/v1/products/{id}/json - Update product with JSON body (no file upload)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductDto> updateProductJson(
            @PathVariable Long id,
            @Valid @RequestBody ProductDto productDto) {
        log.info("Updating product {} via JSON", id);
        ProductDto updated = productService.updateProduct(id, productDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/v1/products/{id} - Delete product (ADMIN/MANAGER only)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        // Get product to delete its image
        productService.getProductById(id).ifPresent(product -> {
            if (product.imageUrl() != null) {
                storageService.delete(product.imageUrl());
            }
        });
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/v1/products/{id}/image - Delete product image only
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    @DeleteMapping("/{id}/image")
    public ResponseEntity<ProductDto> deleteProductImage(@PathVariable Long id) {
        log.info("Deleting image for product {}", id);
        
        ProductDto product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Delete from storage
        if (product.imageUrl() != null) {
            storageService.delete(product.imageUrl());
        }
        
        // Update product to remove image URL
        ProductDto updatedDto = ProductDto.builder()
                .id(product.id())
                .name(product.name())
                .description(product.description())
                .price(product.price())
                .stockQuantity(product.stockQuantity())
                .categoryId(product.categoryId())
                .categoryName(product.categoryName())
                .imageUrl(null)
                .active(product.active())
                .vendorId(product.vendorId())
                .vendorStoreName(product.vendorStoreName())
                .build();
        
        ProductDto updated = productService.updateProduct(id, updatedDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/v1/products/{id}/image - Upload/replace product image
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDto> uploadProductImage(
            @PathVariable Long id,
            @RequestPart("imageFile") MultipartFile imageFile) {
        log.info("Uploading image for product {}", id);
        
        ProductDto product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Delete old image if exists
        if (product.imageUrl() != null) {
            storageService.delete(product.imageUrl());
        }
        
        // Upload new image
        String imageUrl = storageService.store(imageFile);
        
        // Update product with new image URL
        ProductDto updatedDto = ProductDto.builder()
                .id(product.id())
                .name(product.name())
                .description(product.description())
                .price(product.price())
                .stockQuantity(product.stockQuantity())
                .categoryId(product.categoryId())
                .categoryName(product.categoryName())
                .imageUrl(imageUrl)
                .active(product.active())
                .vendorId(product.vendorId())
                .vendorStoreName(product.vendorStoreName())
                .build();
        
        ProductDto updated = productService.updateProduct(id, updatedDto);
        return ResponseEntity.ok(updated);
    }
}