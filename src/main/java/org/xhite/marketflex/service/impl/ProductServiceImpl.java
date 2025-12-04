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
import org.xhite.marketflex.model.Category;
import org.xhite.marketflex.model.Product;
import org.xhite.marketflex.repository.CategoryRepository;
import org.xhite.marketflex.repository.ProductRepository;
import org.xhite.marketflex.service.ProductService;

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
        log.info("Creating new product: {}", productDto.getName());

        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));

        Product product = new Product();
        updateProductFromDto(product, productDto, category);
        product.setActive(true);

        Product savedProduct = productRepository.save(product);
        log.info("Created new product with ID: {}", savedProduct.getId());

        return convertToDto(savedProduct);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, @Valid ProductDto productDto) {
        log.info("Updating product with ID: {}", id);

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        boolean active = existingProduct.isActive();
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));

        updateProductFromDto(existingProduct, productDto, category);
        existingProduct.setActive(active);
        Product updatedProduct = productRepository.save(existingProduct);
        log.info("Updated product: {}", updatedProduct.getName());

        return convertToDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
        log.info("Product soft deleted: {}", product.getName());
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
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(category);
        if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
            product.setImageUrl(dto.getImageUrl());
        }
        product.setActive(dto.isActive());
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
                .build();
    }

    @Override
    public Product convertToEntity(ProductDto productDto) {
        Product product = new Product();
        product.setId(productDto.getId());
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setActive(productDto.isActive());
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

}