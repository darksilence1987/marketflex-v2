package org.xhite.marketflex.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.exception.ResourceNotFoundException;
import org.xhite.marketflex.mapper.ProductMapper;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Category;
import org.xhite.marketflex.model.Product;
import org.xhite.marketflex.model.enums.Role;
import org.xhite.marketflex.repository.CategoryRepository;
import org.xhite.marketflex.repository.ProductRepository;
import org.xhite.marketflex.repository.VendorRepository;
import org.xhite.marketflex.service.ProductService;
import org.xhite.marketflex.service.UserService;
import org.springframework.security.access.AccessDeniedException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final UserService userService;
    private final VendorRepository vendorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAvailableProducts();
        return products.stream()
            .map(productMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        List<Product> products = productRepository.findAvailableProductsByCategoryId(categoryId);
        return products.stream()
            .map(productMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findByIdAndActiveTrue(id)
                .map(this::convertToDto);
    }

    @Override
    @Transactional
    public ProductDto createProduct(@Valid ProductDto productDto) {
        log.info("Creating new product: {}", productDto.name());

        AppUser currentUser = userService.getCurrentUser();
        Category category = categoryRepository.findById(productDto.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.categoryId()));

        // Get vendor for the current user
        var vendors = vendorRepository.findByUserId(currentUser.getId());
        if (vendors.isEmpty()) {
            throw new ResourceNotFoundException("Vendor profile not found. Please create a vendor profile first.");
        }
        var vendor = vendors.get(0);

        Product product = new Product();
        updateProductFromDto(product, productDto, category);
        product.setVendor(vendor);
        product.setActive(true);

        Product savedProduct = productRepository.save(product);
        log.info("Created new product with ID: {} by vendor: {}", savedProduct.getId(), vendor.getStoreName());

        return convertToDto(savedProduct);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, @Valid ProductDto productDto) {
        log.info("Updating product with ID: {}", id);

        AppUser currentUser = userService.getCurrentUser();
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Ownership check: VENDORs/MANAGERs can only update their own products, ADMINs bypass
        if (!currentUser.hasRole(Role.ADMIN) && !existingProduct.getVendor().getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only update your own products");
        }

        boolean active = existingProduct.isActive();
        Category category = categoryRepository.findById(productDto.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.categoryId()));

        updateProductFromDto(existingProduct, productDto, category);
        existingProduct.setActive(active);
        Product updatedProduct = productRepository.save(existingProduct);
        log.info("Updated product: {} by user: {}", updatedProduct.getName(), currentUser.getEmail());

        return convertToDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        AppUser currentUser = userService.getCurrentUser();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Ownership check: VENDORs/MANAGERs can only delete their own products, ADMINs bypass
        if (!currentUser.hasRole(Role.ADMIN) && !product.getVendor().getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only delete your own products");
        }

        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
        log.info("Product soft deleted: {} by user: {}", product.getName(), currentUser.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts(int limit) {
        return productRepository.findByActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isProductAvailable(Long id, int quantity) {
        return productRepository.findByIdAndActiveTrue(id)
                .map(product -> product.getStockQuantity() >= quantity)
                .orElse(false);
    }

    @Override
    @Transactional
    public void updateStock(Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        int newStock = product.getStockQuantity() - quantity;
        if (newStock < 0) {
            throw new IllegalStateException("Insufficient stock for product: " + product.getName());
        }

        product.setStockQuantity(newStock);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
        log.info("Updated stock for product: {}, new stock: {}", product.getName(), newStock);
    }

    private void updateProductFromDto(Product product, ProductDto dto, Category category) {
        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setStockQuantity(dto.stockQuantity());
        product.setCategory(category);
        if (dto.imageUrl() != null && !dto.imageUrl().isEmpty()) {
            product.setImageUrl(dto.imageUrl());
        }
        product.setActive(dto.active());
    }

    @Override
    public ProductDto convertToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .vendorId(product.getVendor() != null ? product.getVendor().getId() : null)
                .vendorStoreName(product.getVendor() != null ? product.getVendor().getStoreName() : null)
                .build();
    }

    @Override
    public Product convertToEntity(ProductDto productDto) {
        Product product = new Product();
        product.setId(productDto.id());
        product.setName(productDto.name());
        product.setDescription(productDto.description());
        product.setPrice(productDto.price());
        product.setStockQuantity(productDto.stockQuantity());
        product.setActive(productDto.active());
        return product;
    }

    @Override
    public boolean isProductAvailable(Long productId, Integer quantity) {
        return productRepository.findByIdAndActiveTrue(productId)
                .map(product -> product.getStockQuantity() >= quantity)
                .orElse(false);
    }

    @Override
    public void updateStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        int newStock = product.getStockQuantity() - quantity;
        if (newStock < 0) {
            throw new IllegalStateException("Insufficient stock for product: " + product.getName());
        }

        product.setStockQuantity(newStock);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
        log.info("Updated stock for product: {}, new stock: {}", product.getName(), newStock);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByVendor(Long vendorId) {
        return productRepository.findByVendorIdAndActiveTrue(vendorId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getMyProducts() {
        AppUser currentUser = userService.getCurrentUser();
        var vendors = vendorRepository.findByUserId(currentUser.getId());
        if (vendors.isEmpty()) {
            throw new ResourceNotFoundException("Vendor profile not found for current user");
        }
        var vendor = vendors.get(0);
        return getProductsByVendor(vendor.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public org.xhite.marketflex.dto.PagedResponse<ProductDto> filterProducts(org.xhite.marketflex.dto.ProductFilterRequest request) {
        org.springframework.data.jpa.domain.Specification<Product> spec = buildSpecification(request);
        
        // Build sort
        org.springframework.data.domain.Sort sort = buildSort(request.sortBy());
        
        // Build pageable
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(
            request.page(), 
            request.size(), 
            sort
        );
        
        // Execute query
        org.springframework.data.domain.Page<Product> page = productRepository.findAll(spec, pageable);
        
        // Convert to DTOs
        List<ProductDto> content = page.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return org.xhite.marketflex.dto.PagedResponse.of(content, request.page(), request.size(), page.getTotalElements());
    }
    
    private org.springframework.data.jpa.domain.Specification<Product> buildSpecification(org.xhite.marketflex.dto.ProductFilterRequest request) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            
            // Always filter active products
            predicates.add(cb.isTrue(root.get("active")));
            
            // Category filter
            if (request.categoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), request.categoryId()));
            }
            
            // Price range filter
            if (request.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.minPrice()));
            }
            if (request.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.maxPrice()));
            }
            
            // Search filter (name or description)
            if (request.search() != null && !request.search().isBlank()) {
                String searchLower = "%" + request.search().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), searchLower),
                    cb.like(cb.lower(root.get("description")), searchLower)
                ));
            }
            
            // In stock filter
            if (request.inStock() != null && request.inStock()) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }
            
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
    
    private org.springframework.data.domain.Sort buildSort(String sortBy) {
        if (sortBy == null) {
            return org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt");
        }
        
        return switch (sortBy) {
            case "price-asc" -> org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "price");
            case "price-desc" -> org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "price");
            case "name" -> org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "name");
            case "newest" -> org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt");
            default -> org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt");
        };
    }

}