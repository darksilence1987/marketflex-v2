package org.xhite.marketflex.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.dto.CategoryDto;
import org.xhite.marketflex.dto.CreateCategoryRequest;
import org.xhite.marketflex.exception.BusinessException;
import org.xhite.marketflex.exception.ResourceNotFoundException;
import org.xhite.marketflex.model.Category;
import org.xhite.marketflex.model.Product;
import org.xhite.marketflex.repository.CategoryRepository;
import org.xhite.marketflex.repository.ProductRepository;
import org.xhite.marketflex.service.CategoryService;
import org.xhite.marketflex.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@CacheConfig(cacheNames = "categories")
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final org.xhite.marketflex.mapper.CategoryMapper categoryMapper;
    private final ProductRepository productRepository;
    private final CacheManager cacheManager;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(key = "'all'")
    public List<CategoryDto> getAllCategories() {
        return categoryMapper.toDtoList(categoryRepository.findAllActive());
    }
    
    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        return categoryRepository.findActiveById(id)
                .map(categoryMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @Override
    @Transactional
    @CacheEvict(allEntries = true)
    public CategoryDto createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByNameAndActiveTrue(request.name())) {
            throw new BusinessException("Category with this name already exists");
        }
        Category category = categoryMapper.toEntity(request);
        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional
    @CacheEvict(allEntries = true)
    public CategoryDto updateCategory(Long id, CreateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        category.setName(request.name());
        category.setDescription(request.description());
        
        // Only update image URL if a new one is provided
        if (request.imageUrl() != null) {
            category.setImageUrl(request.imageUrl());
        }
        
        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional
    @CacheEvict(allEntries = true)
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable
    public List<CategoryDto> getFeaturedCategories(int limit) {
        return categoryRepository.findAllActive()
                .stream()
                .map(categoryMapper::toDto)
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(allEntries = true)
    public void deleteCategory(Long id, boolean deleteProducts) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (deleteProducts) {
            // Soft delete all products
            category.getProducts().forEach(product -> {
                product.setActive(false);
                product.setUpdatedAt(LocalDateTime.now());
            });
            productRepository.saveAll(category.getProducts());
        } else if (!category.getProducts().isEmpty()) {
            long activeProducts = category.getProducts().stream()
                .filter(Product::isActive)
                .count();
            if (activeProducts > 0) {
                throw new BusinessException("Category contains active products. Delete products first or use force delete.");
            }
        }

        category.setActive(false);
        category.setDeletedAt(LocalDateTime.now());
        categoryRepository.save(category);
        
        // Clear caches
        cacheManager.getCache("categories").clear();
        cacheManager.getCache("products").clear();
        
        log.info("Category {} deleted. Products were {}", 
            category.getName(), 
            deleteProducts ? "also deleted" : "preserved");
    }

}